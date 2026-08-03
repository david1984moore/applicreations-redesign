import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
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
  locale?: unknown
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)
}

function selectionHtml(textBody: string, questionsFooter: string): string {
  const lines = textBody.split('\n')
  const paragraphs = lines
    .map((line) => {
      if (!line.trim()) return '<br />'
      return `<p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.45;color:#2a2a2a">${escapeHtml(line)}</p>`
    })
    .join('')

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#f7f4ef;">
    <div style="max-width:520px;margin:0 auto;padding:24px 28px;background:#fffefb;border:1px solid #e5e0d6;border-radius:12px;">
      <p style="margin:0 0 16px;font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b3fa0;">
        Applicreations
      </p>
      ${paragraphs}
      <p style="margin:20px 0 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.4;color:#6b6560;">
        ${escapeHtml(questionsFooter).replace(
          'hello@applicreations.com',
          '<a href="mailto:hello@applicreations.com" style="color:#6b3fa0;">hello@applicreations.com</a>'
        )}
      </p>
    </div>
  </body>
</html>`.trim()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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
  const supportId = isSupportPlanId(body.supportId) ? body.supportId : null

  if (!planId && !supportId) {
    return NextResponse.json({ message: messages.selectionRequired }, { status: 400 })
  }

  const plans = getPlans(dict, locale)
  const supportPlans = getSupportPlans(dict, locale)
  const plan = planId ? plans.find((p) => p.id === planId) ?? null : null
  const support = supportId
    ? supportPlans.find((p) => p.id === supportId) ?? null
    : null

  const { subject, body: text } = formatSelectionForEmail(plan, support, dict, locale)

  const result = await sendEmail({
    to: email,
    subject,
    text,
    html: selectionHtml(text, messages.emailQuestions ?? ''),
  })

  if (!result.ok) {
    console.error('[pricing-selection] send failed', {
      email,
      planId,
      supportId,
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
    locale,
    id: result.id,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: messages.success,
  })
}
