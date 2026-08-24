/** Shared branded HTML for client-facing transactional emails. */

import { getSiteUrl } from '@/lib/site'

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const FONT_DISPLAY = "Georgia,'Times New Roman',Times,serif"

/** Coastal palette — aligned with site tokens (paper, sand, sky). */
const COLORS = {
  page: '#f6f3ec',
  paper: '#fffefb',
  headerWash: '#faf7f1',
  footer: '#f0ebe3',
  rule: '#e5dfd4',
  ruleSoft: '#ede8df',
  skySoft: '#dceaf4',
  skyDeep: '#3a6aa8',
  sand: '#e8dfd2',
  sandDeep: '#c4a484',
  text: '#2c2824',
  muted: '#6b6560',
  primary: '#3a6aa8',
  white: '#ffffff',
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
  /** Emphasis for key facts (package, total, recommendation). */
  accent?: boolean
}

export type BrandedEmailSection = {
  title: string
  rows: BrandedEmailRow[]
}

export type BrandedEmailInput = {
  brandName: string
  tagline: string
  title: string
  intro?: string
  rows?: BrandedEmailRow[]
  sections?: BrandedEmailSection[]
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
    `<a href="mailto:$1" style="color:${COLORS.primary};text-decoration:none;font-weight:600;">$1</a>`
  )
}

function formatRowValue(value: string): string {
  const escaped = escapeHtml(value)
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return `<a href="mailto:${escaped}" style="color:${COLORS.primary};text-decoration:none;font-weight:600;">${escaped}</a>`
  }
  if (/^https?:\/\/\S+$/i.test(value.trim())) {
    return `<a href="${escaped}" style="color:${COLORS.primary};text-decoration:none;font-weight:600;">${escaped}</a>`
  }
  return escaped
}

function isAccentRow(row: BrandedEmailRow): boolean {
  if (row.accent != null) return row.accent
  return /package|total|recommended|suggested|estimad|paquete|total estimado/i.test(
    row.label
  )
}

function renderRow(row: BrandedEmailRow, isLast: boolean): string {
  const accent = isAccentRow(row)
  const border = isLast ? 'none' : `1px solid ${COLORS.ruleSoft}`
  return `
    <tr>
      <td style="padding:14px 0 16px;border-bottom:${border};">
        <p style="margin:0 0 5px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.primary};">${escapeHtml(row.label)}</p>
        <p style="margin:0;font-family:${FONT};font-size:18px;line-height:1.5;font-weight:${accent ? '700' : '400'};color:${accent ? COLORS.skyDeep : COLORS.text};">${formatRowValue(row.value)}</p>
      </td>
    </tr>`
}

function renderRowsBlock(rows: BrandedEmailRow[]): string {
  if (rows.length === 0) return ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;border-collapse:collapse;">
    ${rows.map((row, i) => renderRow(row, i === rows.length - 1)).join('')}
  </table>`
}

function renderSection(section: BrandedEmailSection, isLast: boolean): string {
  const marginBottom = isLast ? '0' : '32px'
  return `
    <div style="margin:0 0 ${marginBottom};">
      <p style="margin:0 0 12px;font-family:${FONT_DISPLAY};font-size:21px;font-weight:400;line-height:1.25;color:${COLORS.text};border-bottom:2px solid ${COLORS.sandDeep};padding-bottom:8px;display:inline-block;">${escapeHtml(section.title)}</p>
      ${renderRowsBlock(section.rows)}
    </div>`
}

/** Full-width branded email: Gmail reading-pane layout, coastal editorial styling. */
export function brandedEmailHtml(input: BrandedEmailInput): string {
  const base = getEmailAssetBase()
  const logoUrl = `${base}/logo-mark.png`

  const flatRows = input.rows ?? []
  const sections = input.sections ?? []

  const rowsHtml =
    flatRows.length > 0 && sections.length === 0 ? renderRowsBlock(flatRows) : ''

  const sectionsHtml =
    sections.length > 0
      ? sections
          .map((section, i) => renderSection(section, i === sections.length - 1))
          .join('')
      : ''

  const introHtml = input.intro
    ? `<p style="margin:0 0 28px;font-family:${FONT};font-size:18px;line-height:1.6;color:${COLORS.text};">${escapeHtml(input.intro)}</p>`
    : ''

  const paragraphsHtml = (input.paragraphs ?? [])
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:${FONT};font-size:17px;line-height:1.55;color:${COLORS.text};">${escapeHtml(p)}</p>`
    )
    .join('')

  const bulletsHtml =
    input.bullets && input.bullets.length > 0
      ? `<div style="margin:0 0 24px;padding:18px 22px;background:${COLORS.headerWash};border-radius:12px;">
          <ul style="margin:0;padding:0 0 0 20px;font-family:${FONT};font-size:17px;line-height:1.55;color:${COLORS.text};">
            ${input.bullets.map((b) => `<li style="margin:0 0 8px;">${escapeHtml(b)}</li>`).join('')}
          </ul>
        </div>`
      : ''

  const notesHtml =
    input.notes && input.notes.length > 0
      ? `<div style="margin:0 0 28px;padding:18px 22px;background:${COLORS.skySoft};border-radius:12px;">
          ${input.notes
            .map(
              (n) =>
                `<p style="margin:0 0 8px;font-family:${FONT};font-size:16px;line-height:1.55;color:${COLORS.text};">${escapeHtml(n)}</p>`
            )
            .join('')}
        </div>`
      : ''

  const preformattedHtml = input.preformatted
    ? `<div style="margin:0 0 24px;padding:20px 22px;background:${COLORS.headerWash};border-radius:12px;">
        <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.primary};">Submission details</p>
        <pre style="margin:0;font-family:${FONT};font-size:15px;line-height:1.55;color:${COLORS.text};white-space:pre-wrap;word-break:break-word;">${escapeHtml(input.preformatted)}</pre>
      </div>`
    : ''

  const linkHtml =
    input.linkHref && input.linkLabel
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 0;">
          <tr>
            <td style="background:${COLORS.primary};border-radius:999px;">
              <a href="${escapeHtml(input.linkHref)}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:16px;font-weight:600;line-height:1.2;color:${COLORS.white};text-decoration:none;">${escapeHtml(input.linkLabel)}</a>
            </td>
          </tr>
        </table>`
      : input.linkHref
        ? `<p style="margin:16px 0 0;font-family:${FONT};font-size:16px;line-height:1.4;">
          <a href="${escapeHtml(input.linkHref)}" style="color:${COLORS.primary};text-decoration:none;font-weight:600;">${escapeHtml(input.linkHref)}</a>
        </p>`
        : ''

  const signoffHtml = input.signoff
    ? `<p style="margin:32px 0 16px;font-family:${FONT};font-size:17px;line-height:1.4;color:${COLORS.muted};">${escapeHtml(input.signoff)}</p>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;width:100%;background:${COLORS.page};">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(input.title)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:${COLORS.page};">
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,${COLORS.skyDeep} 0%,${COLORS.sandDeep} 100%);">&nbsp;</td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.headerWash};border-bottom:1px solid ${COLORS.rule};">
            <tr>
              <td style="padding:28px 36px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;padding-right:14px;">
                      <img src="${escapeHtml(logoUrl)}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border:0;" />
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;font-family:${FONT_DISPLAY};font-size:24px;font-weight:400;letter-spacing:-0.01em;color:${COLORS.text};line-height:1.15;">${escapeHtml(input.brandName)}</p>
                      <p style="margin:5px 0 0;font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.primary};line-height:1.3;">${escapeHtml(input.tagline)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.paper};">
            <tr>
              <td style="padding:36px 36px 44px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;">
                  <tr>
                    <td>
                      <h1 style="margin:0 0 16px;font-family:${FONT_DISPLAY};font-size:32px;font-weight:400;line-height:1.2;color:${COLORS.text};">${escapeHtml(input.title)}</h1>
                      ${introHtml}
                      ${sectionsHtml}
                      ${rowsHtml}
                      ${paragraphsHtml}
                      ${preformattedHtml}
                      ${bulletsHtml}
                      ${notesHtml}
                      ${signoffHtml}
                      ${linkHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.footer};border-top:1px solid ${COLORS.rule};">
            <tr>
              <td style="padding:22px 36px 28px;">
                <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.5;color:${COLORS.muted};">
                  ${linkifyBrandEmail(input.footer)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim()
}
