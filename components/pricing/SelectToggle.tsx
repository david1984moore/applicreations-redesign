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
}

export function SelectToggle({
  selected,
  label,
  onToggle,
  className,
  widthLabel,
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
        'inline-flex w-full sm:w-auto items-center justify-center rounded-lg border px-3.5 py-2 text-sm font-semibold cursor-pointer',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(52%_0.14_295/0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        selected
          ? 'border-[oklch(48%_0.14_295)] bg-[oklch(48%_0.14_295)] text-white shadow-sm hover:border-[oklch(42%_0.13_295)] hover:bg-[oklch(42%_0.13_295)]'
          : 'border-[oklch(52%_0.14_295)] bg-white text-[oklch(36%_0.12_295)] hover:bg-[oklch(93%_0.06_295)]',
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
