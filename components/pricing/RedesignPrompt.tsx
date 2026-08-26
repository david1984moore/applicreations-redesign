'use client'

import { useLocale } from '@/components/i18n/LocaleProvider'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import { cn } from '@/lib/utils'

/** Typographic footnote mark — Georgia * reads as an asterisk, not a star. */
export function FootnoteAsterisk({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'mr-px text-[0.95em] font-normal leading-none text-primary-700 [font-family:Georgia,Times,serif]',
        className
      )}
      aria-hidden
    >
      *
    </span>
  )
}

/** Darker sky-blue quotes, a step larger than the prompt text. */
function SkyQuote({ mark }: { mark: '“' | '”' }) {
  return (
    <span
      className={cn(
        'inline-block not-italic font-bold leading-none text-[oklch(46%_0.14_230)]',
        '[font-family:Georgia,Times,serif] text-[1.45em]',
        mark === '“' ? 'mr-0.5 translate-y-[0.04em]' : 'ml-0.5 translate-y-[0.04em]'
      )}
      aria-hidden
    >
      {mark}
    </span>
  )
}

/** Quiet Introspect prompt for people who already have a site — not a full section. */
export function RedesignPrompt({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { dict, href } = useLocale()
  const p = dict.pricingPage

  return (
    <div
      className={cn(
        compact
          ? 'flex w-full flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:text-left'
          : 'flex flex-col items-center gap-3 py-4 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-7 sm:py-5 sm:text-left',
        className
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            'font-medium italic text-gray-800 leading-snug',
            compact ? 'text-sm sm:text-base' : 'text-base'
          )}
        >
          <SkyQuote mark="“" />
          {p.redesignPrompt}
          <SkyQuote mark="”" />
        </p>
        <p
          className={cn(
            'mt-0.5 pl-3 text-gray-600 leading-snug sm:pl-4',
            compact ? 'text-xs sm:text-sm' : 'text-sm'
          )}
        >
          {p.redesignHint}
        </p>
      </div>
      <SpectrumFlipCta
        href={href('/redesign')}
        size="sm"
        className="shrink-0 self-center"
      >
        {p.redesignCta}
      </SpectrumFlipCta>
    </div>
  )
}
