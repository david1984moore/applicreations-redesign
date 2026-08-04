/** Absolute public site origin for metadata and absolute asset URLs. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://applicreations.com'
  return raw.replace(/\/$/, '')
}
