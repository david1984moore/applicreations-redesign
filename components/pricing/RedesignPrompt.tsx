'use client'

import { useLocale } from '@/components/i18n/LocaleProvider'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import { cn } from '@/lib/utils'

/** Quiet Introspect prompt for people who already have a site — not a full section. */
export function RedesignPrompt({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { dict, t, href } = useLocale()
  const p = dict.pricingPage

  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
        className
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            'italic text-gray-800 leading-snug',
            compact ? 'text-sm sm:text-base' : 'text-base'
          )}
        >
          {p.redesignPrompt}
        </p>
        <p
          className={cn(
            'mt-0.5 text-gray-600 leading-snug',
            compact ? 'text-xs sm:text-sm' : 'text-sm'
          )}
        >
          <span
            className="mr-1 inline-block translate-y-[0.08em] text-[1.15rem] font-bold leading-none text-primary-700"
            aria-hidden
          >
            *
          </span>
          {t(p.redesignHint, { choice: dict.introspectUi.hasOnlineYes })}
        </p>
      </div>
      <SpectrumFlipCta
        href={href('/introspect')}
        size="sm"
        className="shrink-0 self-start sm:self-center"
      >
        {p.redesignCta}
      </SpectrumFlipCta>
    </div>
  )
}
