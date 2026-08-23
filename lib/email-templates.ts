/** Shared branded HTML for client-facing transactional emails. */

import { getSiteUrl } from '@/lib/site'

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

const COLORS = {
  wash: '#f4f1ea',
  card: '#fffefb',
  border: '#e5e0d6',
  text: '#2c2824',
  muted: '#6b6560',
  primary: '#3a6aa8',
  rule: '#e8e2d8',
} as const

export function getEmailAssetBase(): string {
  const url = getSiteUrl()
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return 'https://applicreations.com'
  }
  return url
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type BrandedEmailRow = {
  label: string
  value: string
}

export type BrandedEmailInput = {
  brandName: string
  tagline: string
  title: string
  intro?: string
  rows?: BrandedEmailRow[]
  paragraphs?: string[]
  bullets?: string[]
  notes?: string[]
  /** Long plain-text block (owner dumps). */
  preformatted?: string
  linkHref?: string
  linkLabel?: string
  signoff?: string
  footer: string
}

function linkifyBrandEmail(footer: string): string {
  return escapeHtml(footer).replace(
    /([a-z0-9._%+-]+@applicreations\.com)/gi,
    `<a href="mailto:$1" style="color:${COLORS.primary};text-decoration:none;">$1</a>`
  )
}

/** Coastal branded email shell: logo mark + name + tagline, system sans-serif body. */
export function brandedEmailHtml(input: BrandedEmailInput): string {
  const base = getEmailAssetBase()
  const logoUrl = `${base}/logo-mark.png`

  const rowsHtml =
    input.rows && input.rows.length > 0
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse;">
          ${input.rows
            .map(
              (row, i) => `
            <tr>
              <td style="padding:${i === 0 ? '0' : '12px'} 0 ${i === input.rows!.length - 1 ? '0' : '12px'};border-bottom:${i === input.rows!.length - 1 ? 'none' : `1px solid ${COLORS.rule}`};">
                <p style="margin:0 0 4px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${COLORS.muted};">${escapeHtml(row.label)}</p>
                <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.4;color:${COLORS.text};">${escapeHtml(row.value)}</p>
              </td>
            </tr>`
            )
            .join('')}
        </table>`
      : ''

  const introHtml = input.intro
    ? `<p style="margin:0 0 20px;font-family:${FONT};font-size:15px;line-height:1.5;color:${COLORS.text};">${escapeHtml(input.intro)}</p>`
    : ''

  const paragraphsHtml = (input.paragraphs ?? [])
    .map(
      (p) =>
        `<p style="margin:0 0 12px;font-family:${FONT};font-size:15px;line-height:1.5;color:${COLORS.text};">${escapeHtml(p)}</p>`
    )
    .join('')

  const bulletsHtml =
    input.bullets && input.bullets.length > 0
      ? `<ul style="margin:0 0 16px;padding:0 0 0 20px;font-family:${FONT};font-size:15px;line-height:1.5;color:${COLORS.text};">
          ${input.bullets.map((b) => `<li style="margin:0 0 6px;">${escapeHtml(b)}</li>`).join('')}
        </ul>`
      : ''

  const notesHtml = (input.notes ?? [])
    .map(
      (n) =>
        `<p style="margin:0 0 8px;font-family:${FONT};font-size:14px;line-height:1.45;color:${COLORS.muted};">${escapeHtml(n)}</p>`
    )
    .join('')

  const preformattedHtml = input.preformatted
    ? `<pre style="margin:0 0 16px;padding:14px 16px;background:${COLORS.wash};border:1px solid ${COLORS.border};border-radius:10px;font-family:${FONT};font-size:13px;line-height:1.5;color:${COLORS.text};white-space:pre-wrap;word-break:break-word;">${escapeHtml(input.preformatted)}</pre>`
    : ''

  const linkHtml =
    input.linkHref && input.linkLabel
      ? `<p style="margin:16px 0 0;font-family:${FONT};font-size:14px;line-height:1.4;">
          <a href="${escapeHtml(input.linkHref)}" style="color:${COLORS.primary};text-decoration:none;">${escapeHtml(input.linkLabel)}</a>
        </p>`
      : input.linkHref
        ? `<p style="margin:16px 0 0;font-family:${FONT};font-size:14px;line-height:1.4;">
          <a href="${escapeHtml(input.linkHref)}" style="color:${COLORS.primary};text-decoration:none;">${escapeHtml(input.linkHref)}</a>
        </p>`
        : ''

  const signoffHtml = input.signoff
    ? `<p style="margin:20px 0 0;font-family:${FONT};font-size:15px;line-height:1.4;color:${COLORS.text};">${escapeHtml(input.signoff)}</p>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:${COLORS.wash};">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(input.title)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.wash};">
      <tr>
        <td style="padding:28px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:14px;">
            <tr>
              <td style="padding:28px 28px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">
                  <tr>
                    <td style="vertical-align:middle;padding-right:12px;">
                      <img src="${escapeHtml(logoUrl)}" width="40" height="40" alt="" style="display:block;width:40px;height:40px;border:0;" />
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;font-family:${FONT};font-size:18px;font-weight:700;letter-spacing:-0.01em;color:${COLORS.text};line-height:1.2;">${escapeHtml(input.brandName)}</p>
                      <p style="margin:3px 0 0;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.primary};line-height:1.3;">${escapeHtml(input.tagline)}</p>
                    </td>
                  </tr>
                </table>

                <h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;font-weight:700;line-height:1.25;color:${COLORS.text};">${escapeHtml(input.title)}</h1>
                ${introHtml}
                ${rowsHtml}
                ${paragraphsHtml}
                ${preformattedHtml}
                ${bulletsHtml}
                ${notesHtml}
                ${signoffHtml}
                ${linkHtml}

                <div style="margin-top:28px;padding-top:16px;border-top:1px solid ${COLORS.rule};">
                  <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.4;color:${COLORS.muted};">
                    ${linkifyBrandEmail(input.footer)}
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim()
}
