'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  endLocaleTransition,
  isLocaleTransition,
} from '@/lib/i18n/locale-transition'

/**
 * After a locale swap, restore scroll before paint so the page doesn't jump.
 */
export function LocaleTransitionGuard() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (!isLocaleTransition()) return
    const y = endLocaleTransition()
    window.scrollTo(0, y)
  }, [pathname])

  return null
}
