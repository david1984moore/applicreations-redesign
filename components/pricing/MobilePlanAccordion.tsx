'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { PackagePriceLabel } from '@/components/pricing/PackagePriceLabel'
import { PlanFullDetails } from '@/components/pricing/PlanFullDetails'
import { PlanTierIcon } from '@/components/pricing/PlanTierIcon'
import { SelectToggle } from '@/components/pricing/SelectToggle'
import type { PlanChecklistItem, PlanDetailGroup, PlanId } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export type AccordionPlan = {
  id: string
  name: string
  priceLabel: string
  contactForPricing?: boolean
  highlighted?: boolean
  details: PlanDetailGroup[]
  included: PlanChecklistItem[]
  shortSummary?: string
  summary?: string
}

export function MobilePlanAccordion({
  plans,
  selectedId,
  onSelect,
  popularLabel,
  afterLabel,
  iconFor,
}: {
  plans: AccordionPlan[]
  selectedId: string | null
  onSelect: (id: string) => void
  popularLabel: string
  afterLabel?: string
  iconFor?: (id: string) => ReactNode
}) {
  const { dict } = useLocale()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      {plans.map((plan) => {
        const open = openId === plan.id
        const selected = selectedId === plan.id
        const detailsId = `${plan.id}-details`
        return (
          <article
            key={plan.id}
            id={plan.id}
            className={cn(
              'scroll-mt-16 overflow-hidden rounded-2xl bg-white',
              'shadow-[0_8px_24px_-12px_rgba(40,28,16,0.18),0_2px_6px_-3px_rgba(40,28,16,0.08)]',
              plan.highlighted ? 'border-2 border-primary-600' : 'border border-gray-200',
              selected && 'ring-2 ring-[oklch(52%_0.14_295)] ring-offset-2 ring-offset-paper'
            )}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpenId((current) => (current === plan.id ? null : plan.id))}
              className="flex w-full min-h-11 cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left touch-manipulation"
            >
              <div className="flex h-10 w-12 shrink-0 items-end justify-center overflow-hidden">
                {iconFor?.(plan.id) ?? (
                  <PlanTierIcon
                    planId={plan.id as PlanId}
                    className="h-[86%] w-auto max-w-full"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="font-display text-base leading-none text-gray-900">
                    {plan.name}
                  </span>
                  {plan.highlighted ? (
                    <span className="rounded-md bg-primary-50 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-primary-800">
                      {popularLabel}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    'mt-1 block font-sans font-bold text-primary-600',
                    plan.contactForPricing
                      ? 'text-sm leading-tight'
                      : 'text-lg leading-none tabular-nums'
                  )}
                >
                  <PackagePriceLabel label={plan.priceLabel} />
                </span>
              </div>
              <span className="sr-only">
                {open ? dict.pricingPage.collapseDetails : dict.pricingPage.expandDetails}
              </span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200',
                  open && 'rotate-180'
                )}
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={detailsId}
                  key={`${plan.id}-open`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-200/80 px-3 pb-3 pt-2.5">
                    {plan.shortSummary || plan.summary ? (
                      <p className="mb-2.5 text-sm leading-snug text-gray-600">
                        {plan.shortSummary ?? plan.summary}
                      </p>
                    ) : null}
                    <PlanFullDetails
                      groups={plan.details}
                      included={plan.included}
                      planId={plan.id}
                      afterLabel={afterLabel}
                      stacked
                    />
                    <div className="mt-3">
                      <SelectToggle
                        selected={selected}
                        label={plan.name}
                        onToggle={() => onSelect(plan.id)}
                        variant="solid"
                        className="w-full min-h-11"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        )
      })}
    </div>
  )
}
