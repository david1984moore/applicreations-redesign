import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { brandedEmailHtml } from '@/lib/email-templates'
import {
  formatSelectionForEmail,
  getPlans,
  getSupportPlans,
  isPlanId,
  isSupportPlanId,
} from '@/lib/pricing'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'

type PricingSelectionBody = {
  email?: unknown
  planId?: unknown
  supportId?: unknown
  buildHandoff?: unknown
  locale?: unknown
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)
}

export async function POST(request: Request) {
  let body: PricingSelectionBody

  try {
    body = (await request.json()) as PricingSelectionBody
  } catch {
    const dict = getDictionary('en')
    return NextResponse.json(
      { message: dict.api.pricingSelection.invalidBody },
      { status: 400 }
    )
  }

  const locale: Locale = isLocale(body.locale) ? body.locale : 'en'
  const dict = getDictionary(locale)
  const messages = dict.api.pricingSelection

  const email = isNonEmptyString(body.email) ? body.email.trim() : ''
  if (!isValidEmail(email)) {
    return NextResponse.json({ message: messages.emailInvalid }, { status: 400 })
  }

  const planId = isPlanId(body.planId) ? body.planId : null
  const buildHandoff = body.buildHandoff === true
  const supportId =
    buildHandoff
      ? null
      : isSupportPlanId(body.supportId)
        ? body.supportId
        : null

  if (!planId && !supportId && !buildHandoff) {
    return NextResponse.json({ message: messages.selectionRequired }, { status: 400 })
  }

  const plans = getPlans(dict, locale)
  const supportPlans = getSupportPlans(dict, locale)
  const plan = planId ? plans.find((p) => p.id === planId) ?? null : null
  const support = supportId
    ? supportPlans.find((p) => p.id === supportId) ?? null
    : null

  const selection = formatSelectionForEmail(
    plan,
    support,
    dict,
    locale,
    buildHandoff
  )

  const result = await sendEmail({
    to: email,
    subject: selection.subject,
    text: selection.body,
    html: brandedEmailHtml({
      brandName: dict.brand.name,
      tagline: dict.landing.tagline,
      title: selection.title,
      rows: selection.rows,
      bullets: selection.bullets,
      notes: selection.notes,
      signoff: selection.signoff,
      linkHref: selection.linkHref,
      linkLabel: selection.linkLabel,
      footer: messages.emailQuestions ?? '',
    }),
  })

  if (!result.ok) {
    console.error('[pricing-selection] send failed', {
      email,
      planId,
      supportId,
      buildHandoff,
      code: result.code,
      message: result.message,
    })
    const status = result.code === 'missing_config' ? 503 : 502
    return NextResponse.json({ message: result.message }, { status })
  }

  console.info('[pricing-selection]', {
    email,
    planId,
    supportId,
    buildHandoff,
    locale,
    id: result.id,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: messages.success,
  })
}
