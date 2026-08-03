import { NextResponse } from 'next/server'
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
  const messages = getDictionary(locale).api.contact

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

  console.info('[contact]', {
    name,
    email,
    phone: phone || null,
    message,
    locale,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: messages.success,
  })
}
