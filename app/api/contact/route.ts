import { NextResponse } from 'next/server'

type ContactBody = {
  name?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
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
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : ''
  const email = isNonEmptyString(body.email) ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (name.length < 2) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: 'Please enter a valid email.' }, { status: 400 })
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    return NextResponse.json(
      { message: 'Please enter a valid phone number.' },
      { status: 400 }
    )
  }

  if (message.length < 10) {
    return NextResponse.json(
      {
        message:
          message.length === 0
            ? 'Please enter a message.'
            : 'Please add a bit more detail to your message.',
      },
      { status: 400 }
    )
  }

  // Email delivery (Resend/SendGrid) can plug in here later.
  // For now we accept and log so the form UX works end-to-end in local/dev.
  console.info('[contact]', {
    name,
    email,
    phone: phone || null,
    message,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: 'Thanks! We will respond soon.',
  })
}
