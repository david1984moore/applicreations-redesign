/** Public and operational contact addresses. Single source of truth. */

export const BRAND_EMAIL = 'solutions@applicreations.com'
export const BRAND_FROM = `Applicreations <${BRAND_EMAIL}>`
export const OWNER_INBOX = 'david1984moore@gmail.com'

export function getFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || BRAND_FROM
}

export function getReplyToAddress(): string {
  return process.env.EMAIL_REPLY_TO?.trim() || BRAND_EMAIL
}

/** Owner inbox for contact + Introspect + pricing-selection copies. */
export function getNotifyTo(): string {
  return process.env.EMAIL_NOTIFY_TO?.trim() || OWNER_INBOX
}
