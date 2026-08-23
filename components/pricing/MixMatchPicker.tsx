import { PackagePriceLabel } from '@/components/pricing/PackagePriceLabel'
import { cn } from '@/lib/utils'

export type MixMatchItem = {
  id: string
  name: string
  priceLabel: string
  brief: string[]
  selected: boolean
}

export function MixMatchPicker({
  heading,
  items,
  onSelect,
  step,
  className,
}: {
  heading: string
  items: MixMatchItem[]
  onSelect: (id: string) => void
  step?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-3.5',
        className
      )}
    >
      <h3 className="flex shrink-0 items-center gap-2 font-display text-lg leading-none tracking-tight text-gray-900">
        {step != null ? (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[oklch(90%_0.05_230)] font-display text-sm font-bold text-[oklch(38%_0.10_230)]"
            aria-hidden
          >
            {step}
          </span>
        ) : null}
        {heading}
      </h3>
      <ul className="mt-2 flex flex-col gap-1.5 lg:mt-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              aria-pressed={item.selected}
              className={cn(
                'box-border flex min-h-11 h-auto w-full shrink-0 cursor-pointer flex-col justify-center overflow-hidden rounded-xl px-3 py-2 text-left transition-colors duration-200 touch-manipulation lg:h-[5.5rem]',
                'ring-2 ring-inset',
                'focus-visible:outline-none focus-visible:ring-[oklch(52%_0.14_295)]',
                item.selected
                  ? 'bg-[oklch(96%_0.04_295)] ring-[oklch(52%_0.14_295)]'
                  : 'bg-white ring-[oklch(82%_0.03_230)] hover:bg-[oklch(97%_0.02_230)] hover:ring-[oklch(70%_0.06_230)]'
              )}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg leading-none text-gray-900">
                  {item.name}
                </span>
                <span className="shrink-0 font-sans text-sm font-bold tabular-nums text-primary-600">
                  <PackagePriceLabel label={item.priceLabel} />
                </span>
              </span>
              {item.brief.length > 0 ? (
                <span className="mt-1.5 line-clamp-2 block text-xs leading-snug text-gray-500">
                  {item.brief.join(' · ')}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
