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

/** Simple quotes in the same sans as the line — not decorative serif. */
function SkyQuote({ mark }: { mark: '“' | '”' }) {
  return (
    <span
      className={cn(
        'inline-block font-medium leading-none text-primary-500',
        'text-[1.12em]',
        mark === '“' ? 'mr-px' : 'ml-px'
      )}
      aria-hidden
    >
      {mark}
    </span>
  )
}

function PromptWithEmphasis({
  template,
  emphasis,
}: {
  template: string
  emphasis: string
}) {
  const parts = template.split('{em}')
  if (parts.length !== 2) return <>{template}</>
  return (
    <>
      {parts[0]}<span className="font-bold text-primary-800">{emphasis}</span>{parts[1]}
    </>
  )
}

/** Existing-site path under pricing — same footprint as the line + CTA. */
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
      <p
        className={cn(
          'min-w-0 font-medium text-gray-800 leading-snug',
          compact ? 'text-sm sm:text-base' : 'text-base'
        )}
      >
        <SkyQuote mark="“" />
        <PromptWithEmphasis
          template={p.redesignPrompt}
          emphasis={p.redesignPromptEmphasis}
        />
        <SkyQuote mark="”" />
      </p>
      <SpectrumFlipCta
        href={href('/redesign')}
        size="sm"
        className="shrink-0"
      >
        {p.redesignCta}
      </SpectrumFlipCta>
    </div>
  )
}
