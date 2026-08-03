import { NextResponse, type NextRequest } from 'next/server'
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from '@/lib/i18n/config'

function pathnameIsFile(pathname: string): boolean {
  return pathname.includes('.')
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookie)) return cookie

  const accept = request.headers.get('accept-language') || ''
  if (accept.toLowerCase().includes('es')) return 'es'
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathnameIsFile(pathname)
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split('/')
  const maybeLocale = segments[1]
  const hasLocalePrefix = isLocale(maybeLocale)

  // Canonical English: no /en prefix in the URL
  if (maybeLocale === 'en') {
    const url = request.nextUrl.clone()
    const rest = '/' + segments.slice(2).join('/')
    url.pathname = rest === '/' ? '/' : rest.replace(/\/$/, '') || '/'
    return NextResponse.redirect(url)
  }

  if (hasLocalePrefix) {
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, maybeLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  // No locale in path → English URL surface; optionally send first-time ES browsers to /es
  const preferred = getPreferredLocale(request)
  const hasCookie = Boolean(request.cookies.get(LOCALE_COOKIE)?.value)

  if (!hasCookie && preferred === 'es') {
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/' ? '/es' : `/es${pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, 'es', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  // Rewrite bare English paths into /en/... for the [locale] segment
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  const response = NextResponse.rewrite(url)
  response.cookies.set(LOCALE_COOKIE, defaultLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
