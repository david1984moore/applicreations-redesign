import { NextResponse } from 'next/server'
import { getNotifyTo } from '@/lib/brand-contact'
import { sendEmail } from '@/lib/email'
import { brandedEmailHtml } from '@/lib/email-templates'
import { en } from '@/lib/i18n/dictionaries/en'
import {
  aboutBusinessError,
  businessNameError,
  formatAnswersForEmail,
  formatClientIntrospectEmail,
  locationError,
  mergeDraftAnswers,
  phoneDigits,
  recommendPlan,
  websiteUrlRequiredError,
  withNormalizedWebsiteUrls,
  type IntrospectAnswers,
} from '@/lib/introspect'
import { getPlans } from '@/lib/pricing'
import type { PlanId } from '@/lib/pricing'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'

type IntrospectBody = {
  answers?: Partial<IntrospectAnswers>
  recommendation?: { planId?: PlanId; reason?: string }
  locale?: unknown
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
    const localeRaw = form.get('locale')

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

    return {
      body: {
        answers,
        recommendation,
        locale: typeof localeRaw === 'string' ? localeRaw : undefined,
      },
      uploads,
    }
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
    const dict = getDictionary('en')
    return NextResponse.json({ message: dict.api.introspect.invalidBody }, { status: 400 })
  }

  const locale: Locale = isLocale(body.locale) ? body.locale : 'en'
  const dict = getDictionary(locale)
  const messages = dict.api.introspect

  const answers: IntrospectAnswers = withNormalizedWebsiteUrls(
    mergeDraftAnswers({
      ...body.answers,
      photoFileNames: Array.isArray(body.answers?.photoFileNames)
        ? body.answers.photoFileNames
        : [],
    })
  )

  if (uploads.length > 0) {
    const logoUpload = uploads.find((u) => u.field === 'logo')
    const photoUploads = uploads.filter((u) => u.field === 'photos')
    if (logoUpload) answers.logoFileName = logoUpload.name
    if (photoUploads.length > 0) {
      answers.photoFileNames = photoUploads.map((u) => u.name)
    }
  }

  if (!isNonEmptyString(answers.fullName) || answers.fullName.trim().length < 2) {
    return NextResponse.json({ message: messages.nameRequired }, { status: 400 })
  }

  if (!isValidEmail(answers.email.trim())) {
    return NextResponse.json({ message: messages.emailInvalid }, { status: 400 })
  }

  if (phoneDigits(answers.phone).length < 10) {
    return NextResponse.json({ message: messages.phoneInvalid }, { status: 400 })
  }

  const businessErr = businessNameError(answers.businessName, dict.introspectValidation)
  if (businessErr) {
    return NextResponse.json({ message: businessErr }, { status: 400 })
  }

  const aboutErr = aboutBusinessError(answers.aboutBusiness, dict.introspectValidation)
  if (aboutErr) {
    return NextResponse.json({ message: aboutErr }, { status: 400 })
  }

  const locErr = locationError(answers, dict.introspectValidation)
  if (locErr) {
    return NextResponse.json({ message: locErr }, { status: 400 })
  }

  const isRedesign = answers.variant === 'redesign'
  if (isRedesign) {
    const urlErr = websiteUrlRequiredError(
      answers.websiteUrl,
      messages.websiteUrlRequired
    )
    if (urlErr) {
      return NextResponse.json({ message: urlErr }, { status: 400 })
    }
    if (answers.keepItems.length === 0 || answers.changePriorities.length === 0) {
      return NextResponse.json({ message: messages.keepChangeRequired }, { status: 400 })
    }
  }

  const recommendation = recommendPlan(answers, dict)
  const ownerSummary = formatAnswersForEmail(answers, recommendation, en)
  const clientEmail = formatClientIntrospectEmail(
    answers,
    recommendation,
    dict,
    locale
  )
  const clientAddress = answers.email.trim()
  const planName =
    getPlans(en).find((p) => p.id === recommendation.planId)?.name ??
    recommendation.planId.toUpperCase()
  const businessName = answers.businessName.trim() || answers.fullName.trim()
  const ownerCopy = en.api.introspect
  const notifyTo = getNotifyTo()
  const ownerSubject = (isRedesign
    ? ownerCopy.ownerEmailSubjectRedesign
    : ownerCopy.ownerEmailSubject
  )
    .replace('{business}', businessName)
    .replace('{plan}', planName)

  const [clientResult, ownerResult] = await Promise.all([
    sendEmail({
      to: clientAddress,
      subject: clientEmail.subject,
      text: clientEmail.text,
      html: brandedEmailHtml({
        brandName: dict.brand.name,
        tagline: dict.landing.tagline,
        title: clientEmail.title,
        intro: clientEmail.intro,
        sections: clientEmail.sections,
        signoff: clientEmail.signoff,
        linkHref: clientEmail.linkHref,
        linkLabel: clientEmail.linkLabel,
        footer: clientEmail.footer,
      }),
    }),
    sendEmail({
      to: notifyTo,
      subject: ownerSubject,
      text: ownerSummary,
      replyTo: clientAddress,
      html: brandedEmailHtml({
        brandName: en.brand.name,
        tagline: en.landing.tagline,
        title: isRedesign ? ownerCopy.ownerEmailTitleRedesign : ownerCopy.ownerEmailTitle,
        intro: (isRedesign
          ? ownerCopy.ownerEmailIntroRedesign
          : ownerCopy.ownerEmailIntro
        ).replace('{business}', businessName),
        preformatted: ownerSummary,
        footer: 'Reply to this email to respond to the sender.',
      }),
    }),
  ])

  if (!ownerResult.ok) {
    console.error('[introspect] owner notify failed', {
      code: ownerResult.code,
      message: ownerResult.message,
    })
    const status = ownerResult.code === 'missing_config' ? 503 : 502
    return NextResponse.json({ message: ownerResult.message }, { status })
  }

  if (!clientResult.ok) {
    console.error('[introspect] client email failed', {
      code: clientResult.code,
      message: clientResult.message,
    })
    const status = clientResult.code === 'missing_config' ? 503 : 502
    return NextResponse.json({ message: clientResult.message }, { status })
  }

  console.info('[introspect]', {
    name: answers.fullName.trim(),
    email: clientAddress,
    businessName: answers.businessName.trim(),
    recommendation,
    uploads,
    locale,
    variant: answers.variant,
    clientEmailId: clientResult.id,
    ownerEmailId: ownerResult.id,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    recommendation,
    message: messages.success,
    uploadCount: uploads.length,
  })
}
