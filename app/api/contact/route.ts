import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { brandedEmailHtml } from '@/lib/email-templates'
import { getSiteUrl } from '@/lib/site'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'

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

  const clientResult = await sendEmail({
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
  })

  if (!clientResult.ok) {
    console.error('[contact] client email failed', {
      code: clientResult.code,
      message: clientResult.message,
    })
    const status = clientResult.code === 'missing_config' ? 503 : 502
    return NextResponse.json({ message: clientResult.message }, { status })
  }

  const notifyTo = process.env.EMAIL_NOTIFY_TO?.trim()
  if (notifyTo) {
    const ownerSubject = messages.ownerEmailSubject.replace('{name}', name)
    const ownerText = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      '',
      'Message:',
      message,
      '',
      `Locale: ${locale}`,
      `Received: ${new Date().toISOString()}`,
    ].join('\n')

    const ownerResult = await sendEmail({
      to: notifyTo,
      subject: ownerSubject,
      text: ownerText,
      replyTo: email,
    })

    if (!ownerResult.ok) {
      console.error('[contact] owner notify failed', {
        code: ownerResult.code,
        message: ownerResult.message,
      })
    } else {
      console.info('[contact] owner notify sent', { id: ownerResult.id })
    }
  } else {
    console.warn('[contact] EMAIL_NOTIFY_TO is not set — skipping owner notification')
  }

  console.info('[contact]', {
    name,
    email,
    phone: phone || null,
    message,
    locale,
    clientEmailId: clientResult.id,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: messages.success,
  })
}
