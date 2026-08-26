import type { ReactNode } from 'react'
import Link from 'next/link'
import { PackagePriceLabel } from '@/components/pricing/PackagePriceLabel'
import { PlanTierIcon } from '@/components/pricing/PlanTierIcon'
import type { PlanId } from '@/lib/pricing'
import { cn } from '@/lib/utils'

type TierCardPlan = {
  id: string
  name: string
  priceLabel: string
  contactForPricing?: boolean
  highlighted?: boolean
}

/**
 * Landing See more — ink text. Hover flips to HIW wash violet.
 */
export const planSeeMoreClass =
  'inline-flex min-h-11 items-center justify-center px-2 text-xs font-semibold tracking-tight text-gray-800 underline-offset-2 cursor-pointer whitespace-nowrap transition-colors duration-200 touch-manipulation hover:text-[oklch(48%_0.12_310)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(70%_0.10_310)/0.45] focus-visible:ring-offset-2 focus-visible:ring-offset-paper lg:min-h-0 lg:px-0'

/** @deprecated Use planSeeMoreClass — kept so existing landing imports keep working. */
export const planChooseClass = planSeeMoreClass

/** Compact mark beside the name so the four page cards fit one viewport. */
const HOUSE_SLOT_PAGE = 'h-[clamp(3.5rem,9vh,4.5rem)] w-[clamp(4.25rem,10vh,5.5rem)]'

const HOUSE_SCALE: Record<PlanId, string> = {
  starter: 'h-[68%]',
  basic: 'h-[78%]',
  business: 'h-[89%]',
  pro: 'h-full',
}

export function PlanTierCard({
  plan,
  popularLabel,
  selected = false,
  density = 'page',
  icon,
  children,
  action,
  className,
  anchor = true,
  mobileHref,
  mobileLinkLabel,
}: {
  plan: TierCardPlan
  popularLabel: string
  selected?: boolean
  /** Landing cards stay short so the 4-up row fits the viewport. */
  density?: 'landing' | 'page'
  /** Replaces the house mark — used for hosting cards. */
  icon?: ReactNode
  children: ReactNode
  action: ReactNode
  className?: string
  /** Set false when another copy of this plan already owns the hash id. */
  anchor?: boolean
  /** Mobile-only: whole card taps through to this href; See more stays desktop. */
  mobileHref?: string
  mobileLinkLabel?: string
}) {
  const isPopular = Boolean(plan.highlighted)
  const compact = density === 'landing'

  return (
    <article
      id={anchor ? plan.id : undefined}
      className={cn(
        'relative isolate flex flex-col',
        compact
          ? cn(
              'h-auto self-stretch items-center px-2 pb-2 pt-2 text-center sm:px-3 sm:pb-3 sm:pt-3',
              isPopular && 'bg-[oklch(90%_0.07_230)]'
            )
          : cn(
              'h-full items-stretch overflow-visible rounded-2xl bg-white px-2.5 pb-2.5 pt-3 text-left',
              'shadow-[0_8px_24px_-12px_rgba(40,28,16,0.18),0_2px_6px_-3px_rgba(40,28,16,0.08)]',
              isPopular ? 'border-2 border-primary-600' : 'border border-gray-200'
            ),
        !compact &&
          selected &&
          'ring-2 ring-[oklch(52%_0.14_295)] ring-offset-2 ring-offset-paper',
        className
      )}
    >
      {mobileHref ? (
        <Link
          href={mobileHref}
          className="absolute inset-0 z-10 lg:hidden"
          aria-label={mobileLinkLabel ?? plan.name}
        />
      ) : null}

      {isPopular && compact ? (
        <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-card px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-gray-800 ring-1 ring-gray-200/90">
          {popularLabel}
        </span>
      ) : null}

      {compact ? (
        <div className="w-full">
          <h3 className="font-display text-[0.9375rem] text-gray-900 leading-none tracking-tight sm:text-base">
            {plan.name}
          </h3>
          <p
            className={cn(
              'mt-0.5 flex h-7 w-full items-start justify-center font-sans font-[700] tracking-tight text-primary-600 sm:mt-1 sm:h-9',
              plan.contactForPricing
                ? 'text-xs leading-tight px-0.5 sm:text-sm'
                : 'text-[1.25rem] leading-none tabular-nums sm:text-[1.5rem]'
            )}
          >
            <PackagePriceLabel label={plan.priceLabel} />
          </p>
        </div>
      ) : (
        <div className="flex w-full items-end gap-2.5">
          <div
            className={cn(
              'flex shrink-0 items-end justify-center overflow-hidden',
              HOUSE_SLOT_PAGE
            )}
          >
            {icon ?? (
              <PlanTierIcon
                planId={plan.id as PlanId}
                className={cn(
                  'w-auto max-w-full',
                  HOUSE_SCALE[plan.id as PlanId]
                )}
              />
            )}
          </div>
          <div className="min-w-0 pb-0.5">
            <h3 className="font-display text-[clamp(1.4rem,3vh,1.65rem)] text-gray-900 leading-none tracking-tight">
              {plan.name}
            </h3>
            <p
              className={cn(
                'mt-1 font-sans font-bold text-primary-600',
                plan.contactForPricing
                  ? 'text-base leading-tight'
                  : 'text-[clamp(1.4rem,3vh,1.65rem)] leading-none tabular-nums'
              )}
            >
              <PackagePriceLabel label={plan.priceLabel} />
            </p>
          </div>
        </div>
      )}
      <div className={cn('w-full', compact ? 'mt-1.5 flex flex-1 flex-col justify-start sm:mt-3' : 'mt-4 flex min-h-0 flex-1 flex-col')}>
        {children}
      </div>
      <div
        className={cn(
          'w-full shrink-0',
          compact ? 'mt-1.5 flex justify-center sm:mt-3' : 'mt-2.5',
          mobileHref && 'max-lg:hidden'
        )}
      >
        {action}
      </div>
    </article>
  )
}
