'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { type PlanId, type PricingPlan } from '@/lib/pricing'
import { cn } from '@/lib/utils'

const PLAN_ORDER: PlanId[] = ['starter', 'basic', 'business', 'pro']

const featuredColClass =
  'bg-[oklch(86%_0.035_230/0.14)] shadow-[-1px_0_0_0_oklch(100%_0_0/0.22),1px_0_0_0_oklch(100%_0_0/0.16)]'

type Cell = { kind: 'check' } | { kind: 'empty' } | { kind: 'text'; value: string }

type SectionId = 'included' | 'build' | 'visibility' | 'strategy' | 'customTools'

type RowDef = {
  section: SectionId
  label: string
  cells: Record<PlanId, Cell>
}

function CellView({
  cell,
  includedAria,
  notIncludedAria,
}: {
  cell: Cell
  includedAria: string
  notIncludedAria: string
}) {
  if (cell.kind === 'check') {
    return (
      <span className="inline-flex items-center justify-center" title={includedAria}>
        <Check
          className="h-3.5 w-3.5 text-[oklch(76%_0.26_146)]"
          strokeWidth={2.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        />
        <span className="sr-only">{includedAria}</span>
      </span>
    )
  }
  if (cell.kind === 'text') {
    return (
      <span className="font-display text-[1.05rem] sm:text-[1.15rem] leading-none text-white tabular-nums">
        {cell.value}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center" title={notIncludedAria}>
      <X
        className="h-3.5 w-3.5 text-[oklch(66%_0.28_16)]"
        strokeWidth={2.35}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      />
      <span className="sr-only">{notIncludedAria}</span>
    </span>
  )
}

export function PricingComparisonMatrix({
  plans,
  defaultOpen = false,
  selectedPlanId = null,
}: {
  plans: PricingPlan[]
  defaultOpen?: boolean
  selectedPlanId?: PlanId | null
}) {
  const { dict } = useLocale()
  const p = dict.pricingPage
  const c = p.comparison
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setOpen(mq.matches ? defaultOpen : false)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [defaultOpen])

  const byId = Object.fromEntries(plans.map((plan) => [plan.id, plan])) as Record<
    PlanId,
    PricingPlan
  >
  const popularId = plans.find((plan) => plan.highlighted)?.id ?? 'basic'
  const [featuredId, setFeaturedId] = useState<PlanId>(selectedPlanId ?? popularId)

  useEffect(() => {
    if (selectedPlanId) setFeaturedId(selectedPlanId)
  }, [selectedPlanId])
  const yes: Cell = { kind: 'check' }
  const no: Cell = { kind: 'empty' }

  const rows: RowDef[] = [
    {
      section: 'included',
      label: c.rows.originalDesign,
      cells: { starter: yes, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'included',
      label: c.rows.responsive,
      cells: { starter: yes, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'included',
      label: c.rows.speedSecurity,
      cells: { starter: yes, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'included',
      label: c.rows.onPageSeo,
      cells: { starter: yes, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'included',
      label: c.rows.contentAsProvided,
      cells: { starter: yes, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'included',
      label: c.rows.contactInfo,
      cells: { starter: yes, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'build',
      label: c.rows.pages,
      cells: {
        starter: { kind: 'text', value: c.values.pagesStarter },
        basic: { kind: 'text', value: c.values.pagesBasic },
        business: { kind: 'text', value: c.values.pagesBusiness },
        pro: { kind: 'text', value: c.values.pagesPro },
      },
    },
    {
      section: 'build',
      label: c.rows.revisionRounds,
      cells: {
        starter: { kind: 'text', value: c.values.revisionsStarter },
        basic: { kind: 'text', value: c.values.revisionsBasic },
        business: { kind: 'text', value: c.values.revisionsBusiness },
        pro: { kind: 'text', value: c.values.revisionsPro },
      },
    },
    {
      section: 'visibility',
      label: c.rows.visitorCounts,
      cells: { starter: no, basic: yes, business: yes, pro: yes },
    },
    {
      section: 'visibility',
      label: c.rows.localSeo,
      cells: { starter: no, basic: no, business: yes, pro: yes },
    },
    {
      section: 'strategy',
      label: c.rows.brandedMarketing,
      cells: {
        starter: no,
        basic: no,
        business: { kind: 'text', value: c.values.brandedMarketingBusiness },
        pro: { kind: 'text', value: c.values.brandedMarketingPro },
      },
    },
    {
      section: 'strategy',
      label: c.rows.walkthrough,
      cells: { starter: no, basic: no, business: no, pro: yes },
    },
    {
      section: 'customTools',
      label: c.rows.adminPage,
      cells: { starter: no, basic: no, business: no, pro: yes },
    },
    {
      section: 'customTools',
      label: c.rows.extraFunctionality,
      cells: { starter: no, basic: no, business: no, pro: yes },
    },
    {
      section: 'customTools',
      label: c.rows.siteSearch,
      cells: { starter: no, basic: no, business: no, pro: yes },
    },
    {
      section: 'customTools',
      label: c.rows.priorityBuild,
      cells: { starter: no, basic: no, business: no, pro: yes },
    },
  ]

  const sections: { id: SectionId; label: string }[] = [
    { id: 'included', label: c.sections.included },
    { id: 'build', label: c.sections.build },
    { id: 'visibility', label: c.sections.visibility },
    { id: 'strategy', label: c.sections.strategy },
    { id: 'customTools', label: c.sections.customTools },
  ]

  return (
    <div className="mt-1">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'bg-[oklch(32%_0.09_300)] text-white',
          'shadow-[0_18px_40px_-24px_oklch(28%_0.08_295/0.55)]'
        )}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 75% 60% at 86% -8%, oklch(62% 0.12 230 / 0.42), transparent 56%)',
          }}
        />

        <div className="relative px-3 pt-3 sm:px-5 sm:pt-4">
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-display text-xl sm:text-[1.85rem] leading-none text-white">
              {c.heading}
            </h3>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-controls="pricing-comparison-matrix"
              className="cursor-pointer inline-flex items-center gap-0.5 text-sm font-medium text-[oklch(86%_0.06_230)] hover:text-white"
            >
              {open ? p.hideComparison : p.seeFullComparison}
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200',
                  open && 'rotate-180'
                )}
                aria-hidden
              />
            </button>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm leading-snug text-white/72 sm:mt-2 sm:text-[0.95rem]">
            {c.includedInEvery}
          </p>
        </div>

        {open ? (
          <div id="pricing-comparison-matrix" className="relative mt-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left table-fixed sm:min-w-[40rem]">
                <colgroup>
                  <col className="w-[24%]" />
                  {PLAN_ORDER.map((id) => (
                    <col key={id} className="w-[19%]" />
                  ))}
                </colgroup>
                <thead>
                  <tr className="border-b border-white/12">
                    <th
                      scope="col"
                      className="px-2 py-2 sm:px-5 sm:py-3 align-bottom"
                    >
                      <span className="sr-only">{c.featureCol}</span>
                    </th>
                    {PLAN_ORDER.map((id) => {
                      const plan = byId[id]
                      const isFeatured = id === featuredId
                      const isPopular = id === popularId
                      return (
                        <th
                          key={id}
                          scope="col"
                          className={cn(
                            'p-0 text-center align-top',
                            isFeatured && featuredColClass
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setFeaturedId(id)}
                            aria-pressed={isFeatured}
                            className={cn(
                              'flex w-full cursor-pointer flex-col items-center border-0 bg-transparent px-1 py-2 text-center outline-none touch-manipulation sm:px-2 sm:py-2.5',
                              !isFeatured &&
                                'hover:bg-[oklch(86%_0.03_230/0.08)]'
                            )}
                          >
                            <span className="block font-display text-base sm:text-[1.4rem] leading-none text-white">
                              {plan?.name ?? id}
                            </span>
                            <span
                              className={cn(
                                'mt-1 block font-display leading-none sm:mt-1.5',
                                plan?.contactForPricing
                                  ? 'text-xs sm:text-[0.95rem] text-[oklch(80%_0.19_225)]'
                                  : 'text-xl sm:text-[1.65rem] text-[oklch(80%_0.19_225)]'
                              )}
                            >
                              {plan?.priceLabel}
                            </span>
                            <span className="mt-1.5 block min-h-[0.85rem] text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/55">
                              {isPopular ? p.mostPopular : '\u00a0'}
                            </span>
                            <span className="mt-0.5 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white/50">
                              {plan?.contactForPricing ? '\u00a0' : p.oneTime}
                            </span>
                          </button>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sections.flatMap((section) => {
                    const sectionRows = rows.filter((row) => row.section === section.id)
                    return sectionRows.map((row, rowIndex) => (
                      <tr
                        key={`${section.id}-${row.label}`}
                        className="border-t border-white/8"
                      >
                        <th
                          scope="row"
                          className={cn(
                            'px-2 sm:px-5 text-sm sm:text-[1rem] font-medium text-white/90',
                            rowIndex === 0 ? 'pt-2.5 pb-1.5' : 'py-1.5'
                          )}
                        >
                          {rowIndex === 0 ? (
                            <span className="mb-0.5 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[oklch(82%_0.08_230)]">
                              {section.label}
                            </span>
                          ) : null}
                          {row.label}
                        </th>
                        {PLAN_ORDER.map((id) => (
                          <td
                            key={id}
                            className={cn(
                              'px-2 text-center',
                              rowIndex === 0 ? 'pt-2.5 pb-1.5' : 'py-1.5',
                              id === featuredId && featuredColClass
                            )}
                          >
                            <CellView
                              cell={row.cells[id]}
                              includedAria={c.includedAria}
                              notIncludedAria={c.notIncludedAria}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  })}
                </tbody>
              </table>
            </div>
            <p className="border-t border-white/10 px-4 py-2.5 sm:px-5 text-[0.85rem] leading-snug text-white/55">
              {c.footer}
            </p>
          </div>
        ) : (
          <div className="h-3" />
        )}
      </div>
    </div>
  )
}
