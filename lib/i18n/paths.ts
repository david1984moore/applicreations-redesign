import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config'

/** Strip leading locale segment (`/es/pricing` → `/pricing`). */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && isLocale(segments[1])) {
    const rest = '/' + segments.slice(2).join('/')
    return rest === '/' ? '/' : rest.replace(/\/$/, '') || '/'
  }
  return pathname || '/'
}

/** Read locale from a pathname (`/es/about` → `es`, `/pricing` → `en`). */
export function localeFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  if (segments.length > 1 && isLocale(segments[1])) {
    return segments[1]
  }
  return defaultLocale
}

/**
 * Prefix a site-internal path for the active locale.
 * English has no prefix; Spanish uses `/es`.
 * Leaves external URLs, hashes-only, and mailto/tel alone.
 */
export function withLocale(href: string, locale: Locale): string {
  if (
    !href ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  ) {
    return href
  }

  const [pathAndQuery = '', hash] = href.split('#')
  const [path, query] = pathAndQuery.split('?')
  const clean = stripLocale(path || '/')
  const localized =
    locale === defaultLocale
      ? clean
      : clean === '/'
        ? `/${locale}`
        : `/${locale}${clean}`

  const withQuery = query ? `${localized}?${query}` : localized
  return hash !== undefined ? `${withQuery}#${hash}` : withQuery
}

/** Swap the locale prefix on the current path (keeps query + hash). */
export function swapLocalePath(
  pathname: string,
  search: string,
  hash: string,
  nextLocale: Locale
): string {
  const bare = stripLocale(pathname)
  const next = withLocale(bare, nextLocale)
  return `${next}${search}${hash}`
}
