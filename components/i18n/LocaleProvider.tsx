'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { interpolate } from '@/lib/i18n/interpolate'
import { swapLocalePath, withLocale } from '@/lib/i18n/paths'

type LocaleContextValue = {
  locale: Locale
  dict: Dictionary
  /** Interpolate `{key}` placeholders in a dictionary string. */
  t: (template: string, vars?: Record<string, string | number>) => string
  /** Localize an internal href for the active locale. */
  href: (path: string) => string
  setLocale: (next: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      localStorage.setItem(LOCALE_COOKIE, locale)
    } catch {
      /* ignore */
    }
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`
  }, [locale])

  const t = useCallback(
    (template: string, vars?: Record<string, string | number>) =>
      vars ? interpolate(template, vars) : template,
    []
  )

  const href = useCallback((path: string) => withLocale(path, locale), [locale])

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`
      try {
        localStorage.setItem(LOCALE_COOKIE, next)
      } catch {
        /* ignore */
      }
      const search = typeof window !== 'undefined' ? window.location.search : ''
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      router.push(swapLocalePath(pathname || '/', search, hash, next))
    },
    [locale, pathname, router]
  )

  const value = useMemo(
    () => ({ locale, dict: dictionary, t, href, setLocale }),
    [locale, dictionary, t, href, setLocale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
