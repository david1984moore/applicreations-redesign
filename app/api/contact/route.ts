import { NextResponse } from 'next/server'
import { getNotifyTo } from '@/lib/brand-contact'
import { sendEmail } from '@/lib/email'
import { brandedEmailHtml } from '@/lib/email-templates'
import { getSiteUrl } from '@/lib/site'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { en } from '@/lib/i18n/dictionaries/en'

type ContactBody = {
  name?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  locale?: unknown
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: ContactBody

  try {
    body = (await request.json()) as ContactBody
  } catch {
    const dict = getDictionary('en')
    return NextResponse.json({ message: dict.api.contact.invalidBody }, { status: 400 })
  }

  const locale: Locale = isLocale(body.locale) ? body.locale : 'en'
  const dict = getDictionary(locale)
  const messages = dict.api.contact
  const labels = dict.contact
  const ownerCopy = en.api.contact

  const name = isNonEmptyString(body.name) ? body.name.trim() : ''
  const email = isNonEmptyString(body.email) ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (name.length < 2) {
    return NextResponse.json({ message: messages.nameRequired }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: messages.emailInvalid }, { status: 400 })
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    return NextResponse.json({ message: messages.phoneInvalid }, { status: 400 })
  }

  if (message.length < 10) {
    return NextResponse.json(
      {
        message: message.length === 0 ? messages.messageEmpty : messages.messageShort,
      },
      { status: 400 }
    )
  }

  const rows = [
    { label: labels.nameLabel, value: name },
    { label: labels.emailLabel, value: email },
    { label: labels.phoneLabel, value: phone },
    { label: labels.messageLabel, value: message },
  ]

  const ownerRows = [
    { label: 'Name', value: name },
    { label: 'Email', value: email },
    { label: 'Phone', value: phone },
    { label: 'Message', value: message },
    { label: 'Locale', value: locale },
  ]

  const clientText = [
    messages.clientEmailTitle,
    '',
    messages.clientEmailIntro,
    '',
    ...rows.map((row) => `${row.label}: ${row.value}`),
    '',
    messages.clientEmailSignoff,
    '',
    messages.emailQuestions,
  ].join('\n')

  const ownerSubject = ownerCopy.ownerEmailSubject.replace('{name}', name)
  const ownerText = [
    ownerCopy.ownerEmailTitle,
    '',
    ...ownerRows.map((row) => `${row.label}: ${row.value}`),
    '',
    `Received: ${new Date().toISOString()}`,
  ].join('\n')

  const notifyTo = getNotifyTo()

  const [clientResult, ownerResult] = await Promise.all([
    sendEmail({
      to: email,
      subject: messages.clientEmailSubject,
      text: clientText,
      html: brandedEmailHtml({
        brandName: dict.brand.name,
        tagline: dict.landing.tagline,
        title: messages.clientEmailTitle,
        intro: messages.clientEmailIntro,
        rows,
        signoff: messages.clientEmailSignoff,
        linkHref: getSiteUrl(),
        linkLabel: messages.clientEmailLinkLabel,
        footer: messages.emailQuestions,
      }),
    }),
    sendEmail({
      to: notifyTo,
      subject: ownerSubject,
      text: ownerText,
      replyTo: email,
      html: brandedEmailHtml({
        brandName: en.brand.name,
        tagline: en.landing.tagline,
        title: ownerCopy.ownerEmailTitle,
        intro: ownerCopy.ownerEmailIntro,
        rows: ownerRows,
        footer: 'Reply to this email to respond to the sender.',
      }),
    }),
  ])

  if (!ownerResult.ok) {
    console.error('[contact] owner notify failed', {
      code: ownerResult.code,
      message: ownerResult.message,
    })
    const status = ownerResult.code === 'missing_config' ? 503 : 502
    return NextResponse.json({ message: ownerResult.message }, { status })
  }

  if (!clientResult.ok) {
    console.error('[contact] client email failed', {
      code: clientResult.code,
      message: clientResult.message,
    })
    const status = clientResult.code === 'missing_config' ? 503 : 502
    return NextResponse.json({ message: clientResult.message }, { status })
  }

  console.info('[contact]', {
    name,
    email,
    phone: phone || null,
    message,
    locale,
    clientEmailId: clientResult.id,
    ownerEmailId: ownerResult.id,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: messages.success,
  })
}
