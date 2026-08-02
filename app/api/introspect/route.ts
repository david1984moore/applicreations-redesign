import { NextResponse } from 'next/server'
import {
  aboutBusinessError,
  businessNameError,
  emptyAnswers,
  formatAnswersForEmail,
  locationError,
  phoneDigits,
  recommendPlan,
  type IntrospectAnswers,
} from '@/lib/introspect'
import type { PlanId } from '@/lib/pricing'

type IntrospectBody = {
  answers?: Partial<IntrospectAnswers>
  recommendation?: { planId?: PlanId; reason?: string }
}

type UploadMeta = {
  field: 'logo' | 'photos'
  name: string
  size: number
  type: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function parseRequest(request: Request): Promise<{
  body: IntrospectBody
  uploads: UploadMeta[]
}> {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    const answersRaw = form.get('answers')
    const recommendationRaw = form.get('recommendation')

    let answers: Partial<IntrospectAnswers> | undefined
    let recommendation: IntrospectBody['recommendation']

    if (typeof answersRaw === 'string') {
      try {
        answers = JSON.parse(answersRaw) as Partial<IntrospectAnswers>
      } catch {
        answers = undefined
      }
    }

    if (typeof recommendationRaw === 'string') {
      try {
        recommendation = JSON.parse(recommendationRaw) as IntrospectBody['recommendation']
      } catch {
        recommendation = undefined
      }
    }

    const uploads: UploadMeta[] = []
    const logo = form.get('logo')
    if (logo instanceof File && logo.size > 0) {
      uploads.push({
        field: 'logo',
        name: logo.name,
        size: logo.size,
        type: logo.type || 'application/octet-stream',
      })
    }

    for (const entry of form.getAll('photos')) {
      if (entry instanceof File && entry.size > 0) {
        uploads.push({
          field: 'photos',
          name: entry.name,
          size: entry.size,
          type: entry.type || 'application/octet-stream',
        })
      }
    }

    return { body: { answers, recommendation }, uploads }
  }

  const body = (await request.json()) as IntrospectBody
  return { body, uploads: [] }
}

export async function POST(request: Request) {
  let body: IntrospectBody
  let uploads: UploadMeta[]

  try {
    ;({ body, uploads } = await parseRequest(request))
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  const answers: IntrospectAnswers = {
    ...emptyAnswers,
    ...body.answers,
    photoFileNames: Array.isArray(body.answers?.photoFileNames)
      ? body.answers.photoFileNames
      : [],
  }

  if (uploads.length > 0) {
    const logoUpload = uploads.find((u) => u.field === 'logo')
    const photoUploads = uploads.filter((u) => u.field === 'photos')
    if (logoUpload) answers.logoFileName = logoUpload.name
    if (photoUploads.length > 0) {
      answers.photoFileNames = photoUploads.map((u) => u.name)
    }
  }

  if (!isNonEmptyString(answers.fullName) || answers.fullName.trim().length < 2) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 })
  }

  if (!isValidEmail(answers.email.trim())) {
    return NextResponse.json({ message: 'Please enter a valid email.' }, { status: 400 })
  }

  if (phoneDigits(answers.phone).length < 10) {
    return NextResponse.json(
      { message: 'Please enter a full 10-digit phone number.' },
      { status: 400 }
    )
  }

  const businessErr = businessNameError(answers.businessName)
  if (businessErr) {
    return NextResponse.json({ message: businessErr }, { status: 400 })
  }

  const aboutErr = aboutBusinessError(answers.aboutBusiness)
  if (aboutErr) {
    return NextResponse.json({ message: aboutErr }, { status: 400 })
  }

  const locErr = locationError(answers.location)
  if (locErr) {
    return NextResponse.json({ message: locErr }, { status: 400 })
  }

  const recommendation = recommendPlan(answers)
  const summary = formatAnswersForEmail(answers, recommendation)

  // Email delivery (Resend/SendGrid) and Google Drive transfer can plug in here later.
  console.info('[introspect]', {
    name: answers.fullName.trim(),
    email: answers.email.trim(),
    businessName: answers.businessName.trim(),
    recommendation,
    uploads,
    receivedAt: new Date().toISOString(),
    summary,
  })

  return NextResponse.json({
    ok: true,
    recommendation,
    message: 'Thanks! We received your Introspect answers.',
    uploadCount: uploads.length,
  })
}
