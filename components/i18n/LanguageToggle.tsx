'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { swapLocalePath } from '@/lib/i18n/paths'
import { cn } from '@/lib/utils'

type LanguageToggleProps = {
  variant?: 'landing' | 'subpage'
  className?: string
  iconSize?: string
}

const sk = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.85,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/**
 * Sketchy 1930s broadcast mic — imperfect grille, loose yoke, short stem.
 * Matches the hand-ink style of BrandNavLinks icons.
 */
function IconLanguage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      {/* Grille rim — uneven oval, not a perfect circle */}
      <path
        {...sk}
        d="M16.3 3.6c3.9-.4 7.8 2 8.6 5.9.9 4.2-1.6 8.4-5.6 9.6-4.1 1.3-8.6-.9-9.7-4.9C8.4 9.8 11.2 4.2 16.3 3.6z"
      />
      {/* Grille lines — slightly wavy, unequal lengths */}
      <path
        {...sk}
        strokeWidth={1.35}
        d="M11.6 7.2c2.8-.3 5.8-.2 8.8.2M10.6 10.4c3.4-.2 7-.1 10.6.3M10.8 13.6c3.2-.2 6.4 0 9.6.4"
      />
      {/* Side pivot scribbles */}
      <path
        fill="currentColor"
        stroke="none"
        d="M8.4 10.2c0-.9.7-1.5 1.5-1.4.9.1 1.4.8 1.3 1.6-.1.8-.9 1.4-1.7 1.3-.7-.1-1.2-.8-1.1-1.5zM21.2 9.8c0-.9.8-1.5 1.6-1.4.8.1 1.4.9 1.3 1.7-.1.7-.9 1.3-1.6 1.2-.9-.1-1.4-.8-1.3-1.5z"
      />
      {/* Loose U-yoke */}
      <path
        {...sk}
        d="M9.2 12.2c-.2 1.2.1 2.6.6 3.8 1.2 3.2 4 5.4 7.4 5.2 3.2-.2 6-2.6 6.8-5.8.4-1.4.4-2.8.2-4"
      />
      {/* Short stem — slight lean, no trophy base */}
      <path {...sk} d="M16.2 21c.1 1.8.3 3.6.6 5.4" />
      {/* Tiny foot scribble */}
      <path {...sk} strokeWidth={1.6} d="M12.4 27.2c2.4.4 4.8.5 7.4.2" />
    </svg>
  )
}

/**
 * Matches BrandNavLinks: line icon above, plain label below.
 * Tap toggles EN ↔ ES — no pill, fill, or slide track.
 */
export function LanguageToggle({
  variant = 'subpage',
  className,
  iconSize,
}: LanguageToggleProps) {
  const { locale, setLocale, dict } = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const isEs = locale === 'es'
  const next = isEs ? 'en' : 'es'

  // Prefetch the other locale so the swap feels instant
  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    router.prefetch(swapLocalePath(pathname || '/', search, hash, next))
  }, [router, pathname, next])

  const resolvedIconSize =
    iconSize ?? (variant === 'landing' ? 'h-5 w-5 lg:h-6 lg:w-6' : 'h-4 w-4')

  const buttonClass =
    variant === 'landing'
      ? 'group flex min-w-0 w-full flex-col items-center gap-1.5 text-center rounded-md outline-none cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
      : 'group flex min-w-0 w-full flex-col items-center gap-0.5 text-center rounded-md outline-none cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'

  const labelClass =
    variant === 'landing'
      ? 'text-[0.6875rem] sm:text-[0.8125rem] lg:text-[0.9375rem] font-bold tracking-tight'
      : 'text-[0.5625rem] sm:text-[0.625rem] font-medium tracking-tight'

  return (
    <button
      type="button"
      aria-label={dict.nav.languageToggleAria}
      title={dict.nav.languageToggleAria}
      onClick={() => setLocale(next)}
      className={cn(buttonClass, className)}
    >
      <span className="inline-flex text-gray-900 transition-colors duration-200 group-hover:text-gray-600">
        <IconLanguage className={resolvedIconSize} />
      </span>
          <span className={cn(labelClass, 'tabular-nums whitespace-nowrap')}>
        <span className={cn(!isEs ? 'text-gray-900' : 'text-gray-400')}>
          {dict.nav.languageEn}
        </span>
        <span className="text-gray-400 mx-0.5">/</span>
        <span className={cn(isEs ? 'text-gray-900' : 'text-gray-400')}>
          {dict.nav.languageEs}
        </span>
      </span>
    </button>
  )
}
