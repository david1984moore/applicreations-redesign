'use client'

import type { ReactNode } from 'react'
import { isLocaleTransition } from '@/lib/i18n/locale-transition'

/**
 * During EN↔ES swaps, skip skeleton fallbacks so the page doesn't flash.
 * Prefetch + router.replace(scroll:false) usually resolve before this matters.
 */
export function LocaleAwareLoading({ children }: { children: ReactNode }) {
  if (isLocaleTransition()) return null
  return children
}
