'use client'

import { Check } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { cn } from '@/lib/utils'

interface SelectToggleProps {
  selected: boolean
  label: string
  onToggle: () => void
  className?: string
  /** When set, button width matches "Choose {widthLabel}" (locale-aware). */
  widthLabel?: string
  /** `solid` is the package-card choose control; `outline` is the quieter hosting row. */
  variant?: 'outline' | 'solid'
}

export function SelectToggle({
  selected,
  label,
  onToggle,
  className,
  widthLabel,
  variant = 'outline',
}: SelectToggleProps) {
  const { dict, t } = useLocale()
  const chooseLabel = t(dict.pricingPage.choose, { name: label })
  const widthAnchorLabel = widthLabel
    ? t(dict.pricingPage.choose, { name: widthLabel })
    : null

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={selected ? t(dict.pricingPage.chosenAria, { name: label }) : chooseLabel}
      className={cn(
        'inline-flex w-full sm:w-auto items-center justify-center text-sm font-bold tracking-tight cursor-pointer',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        variant === 'solid'
          ? cn(
              'rounded-2xl px-3 py-1.5 shadow-[0_1px_2px_oklch(28%_0.02_50/0.06)]',
              'focus-visible:ring-primary/30',
              selected
                ? 'bg-gray-900 text-white ring-1 ring-gray-900 hover:bg-gray-800'
                : 'bg-white text-gray-900 ring-1 ring-gray-900/20 hover:bg-[oklch(96%_0.02_80)] hover:ring-gray-900/35'
            )
          : cn(
              'rounded-2xl px-3.5 py-2',
              'focus-visible:ring-primary/30',
              selected
                ? 'bg-gray-900 text-white ring-1 ring-gray-900 hover:bg-gray-800'
                : 'bg-white text-gray-900 ring-1 ring-gray-900/20 hover:bg-[oklch(96%_0.02_80)] hover:ring-gray-900/35'
            ),
        className
      )}
    >
      {/*
        Width is sized by "Choose {label}", or by widthLabel when uniform width is needed.
        Selected state overlays check + "Chosen" — color/opacity only, no layout shift.
      */}
      <span className="relative inline-grid place-items-center">
        {widthAnchorLabel ? (
          <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
            {widthAnchorLabel}
          </span>
        ) : null}
        <span
          className={cn(
            'col-start-1 row-start-1 transition-opacity duration-150',
            selected ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden
        >
          {chooseLabel}
        </span>
        <span
          className={cn(
            'col-start-1 row-start-1 inline-flex items-center justify-center gap-2 transition-opacity duration-150',
            selected ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden
        >
          <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
          {dict.pricingPage.chosen}
        </span>
      </span>
    </button>
  )
}
