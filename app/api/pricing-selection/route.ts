import { NextResponse } from 'next/server'
import { getNotifyTo } from '@/lib/brand-contact'
import { sendEmail } from '@/lib/email'
import { brandedEmailHtml } from '@/lib/email-templates'
import { en } from '@/lib/i18n/dictionaries/en'
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

  const ownerCopy = en.api.pricingSelection
  const ownerResult = await sendEmail({
    to: getNotifyTo(),
    subject: ownerCopy.ownerEmailSubject.replace('{email}', email),
    text: [
      ownerCopy.ownerEmailTitle,
      '',
      `Sent to: ${email}`,
      `Locale: ${locale}`,
      '',
      selection.body,
    ].join('\n'),
    replyTo: email,
    html: brandedEmailHtml({
      brandName: en.brand.name,
      tagline: en.landing.tagline,
      title: ownerCopy.ownerEmailTitle,
      intro: ownerCopy.ownerEmailIntro.replace('{email}', email),
      rows: selection.rows,
      bullets: selection.bullets,
      notes: selection.notes,
      footer: 'Reply to this email to reach the visitor.',
    }),
  })

  if (!ownerResult.ok) {
    console.error('[pricing-selection] owner notify failed', {
      code: ownerResult.code,
      message: ownerResult.message,
    })
  }

  console.info('[pricing-selection]', {
    email,
    planId,
    supportId,
    buildHandoff,
    locale,
    id: result.id,
    ownerEmailId: ownerResult.ok ? ownerResult.id : null,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: messages.success,
  })
}
