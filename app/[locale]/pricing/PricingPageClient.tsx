'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { IconContact } from '@/components/ui/BrandNavLinks'
import { DetailGroups } from '@/components/pricing/DetailGroups'
import { SelectToggle } from '@/components/pricing/SelectToggle'
import { SelectionSummary } from '@/components/pricing/SelectionSummary'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import {
  getPlans,
  getSupportPlans,
  type PlanId,
  type SupportPlanId,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

const PLAN_IDS = new Set<string>(['basic', 'pro', 'business'])
const SUPPORT_IDS = new Set<string>(['support', 'ultimate'])

const introLinkClass =
  'font-medium text-primary-700 hover:text-primary-800 underline underline-offset-2'

export default function PricingPageClient() {
  const { dict, t, href, locale } = useLocale()
  const p = dict.pricingPage
  const plans = getPlans(dict, locale)
  const supportPlans = getSupportPlans(dict, locale)

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null)
  const [selectedSupportId, setSelectedSupportId] = useState<SupportPlanId | null>(
    null
  )
  const [openPlanId, setOpenPlanId] = useState<PlanId | null>(null)
  const [openSupportId, setOpenSupportId] = useState<SupportPlanId | null>(null)

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null
  const selectedSupport =
    supportPlans.find((p) => p.id === selectedSupportId) ?? null
  const hasSelection = Boolean(selectedPlan || selectedSupport)

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (PLAN_IDS.has(hash)) {
        setOpenPlanId(hash as PlanId)
      } else if (SUPPORT_IDS.has(hash)) {
        setOpenSupportId(hash as SupportPlanId)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  const selectPlan = (id: PlanId) => {
    setSelectedPlanId((current) => (current === id ? null : id))
  }

  const selectSupport = (id: SupportPlanId) => {
    setSelectedSupportId((current) => (current === id ? null : id))
  }

  const togglePlanOpen = (id: PlanId) => {
    setOpenPlanId((current) => (current === id ? null : id))
  }

  const toggleSupportOpen = (id: SupportPlanId) => {
    setOpenSupportId((current) => (current === id ? null : id))
  }

  return (
    <main className={cn('bg-paper', hasSelection && 'pb-20 lg:pb-0')}>
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_0%,oklch(92%_0.03_230/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_10%,oklch(93%_0.03_80/0.45),transparent_50%)]" />
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8 xl:gap-10">
          {/* pb on the content column so the sticky rail’s stretch height includes page end padding */}
          <div className="min-w-0 max-w-3xl lg:max-w-none pb-6">
            <section className="pt-2 sm:pt-3 pb-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="font-display text-2xl sm:text-3xl text-gray-900 text-center">
                  {p.title}
                </h1>
              </motion.div>
            </section>

            <section className="pb-5" aria-label={p.websitePackagesAria}>
              <div className="flex flex-col gap-2.5">
                {plans.map((plan, index) => {
                  const isSelected = selectedPlanId === plan.id
                  const isOpen = openPlanId === plan.id
                  return (
                    <motion.article
                      key={plan.id}
                      id={plan.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 + index * 0.04 }}
                      className={cn(
                        'scroll-mt-16 rounded-xl overflow-hidden transition-[border-color,background-color,box-shadow] duration-300',
                        isSelected
                          ? 'border-2 border-[oklch(52%_0.14_295)] bg-[oklch(96%_0.04_295)] shadow-[0_0_0_1px_oklch(52%_0.14_295/0.12)]'
                          : 'border border-gray-200 bg-white/85'
                      )}
                    >
                      <div className="px-3.5 pt-3.5 pb-1.5 sm:px-4 sm:pt-4 sm:pb-2">
                        <div className="flex items-baseline justify-between gap-4 mb-1.5">
                          <div className="min-w-0 flex-1">
                            <h2 className="font-display text-2xl sm:text-[1.75rem] text-gray-900 leading-tight">
                              {plan.name}
                            </h2>
                            <ul
                              className="flex flex-wrap gap-1.5 mt-2.5"
                              aria-label={t(p.highlightsAria, { name: plan.name })}
                            >
                              {plan.features.map((feature) => (
                                <li
                                  key={feature}
                                  className="text-xs text-gray-700 bg-[oklch(96%_0.02_295)] border border-[oklch(90%_0.035_295)] px-2 py-0.5 rounded-md"
                                >
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="font-display text-xl sm:text-2xl text-primary-700 shrink-0 text-right whitespace-nowrap">
                            {plan.priceLabel}
                            <span className="ml-1.5 text-xs font-sans font-normal text-gray-500">
                              {p.oneTime}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 mt-4">
                          <button
                            type="button"
                            onClick={() => togglePlanOpen(plan.id)}
                            aria-expanded={isOpen}
                            aria-controls={`${plan.id}-details`}
                            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 self-start"
                          >
                            {p.whatsIncluded}
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isOpen && 'rotate-180'
                              )}
                              aria-hidden
                            />
                          </button>
                          <SelectToggle
                            selected={isSelected}
                            label={plan.name}
                            onToggle={() => selectPlan(plan.id)}
                          />
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            id={`${plan.id}-details`}
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mx-3.5 sm:mx-4 mb-3.5 sm:mb-4 rounded-lg border border-primary-100/80 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5">
                              <DetailGroups groups={plan.details} />
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.article>
                  )
                })}
              </div>
              <p className="mt-2.5 text-xs text-gray-500 leading-snug">
                {t(p.exampleTotal, {
                  basicPrice: plans[0]?.priceLabel ?? '',
                  supportPrice: supportPlans[0]?.priceLabel ?? '',
                })}
              </p>
            </section>

            <section
              id="hosting-support"
              className="scroll-mt-16 border-t border-gray-200 py-5"
              aria-labelledby="hosting-support-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="mb-3"
              >
                <h2
                  id="hosting-support-heading"
                  className="font-display text-xl sm:text-2xl text-gray-900 mb-1"
                >
                  {p.hostingSupportHeading}
                </h2>
                <p className="text-sm text-gray-600 leading-snug max-w-2xl">
                  {p.hostingIntroBeforeRender}{' '}
                  <a
                    href="https://render.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={introLinkClass}
                  >
                    {p.hostingIntroRender}
                  </a>
                  {p.hostingIntroAfterRender}{' '}
                  <a
                    href="https://render.com/docs/service-types"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={introLinkClass}
                  >
                    {p.hostingIntroServices}
                  </a>
                  {p.hostingIntroIncluding}{' '}
                  <a
                    href="https://render.com/docs/static-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={introLinkClass}
                  >
                    {p.hostingIntroStaticSites}
                  </a>{' '}
                  {p.hostingIntroAnd}{' '}
                  <a
                    href="https://render.com/docs/web-services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={introLinkClass}
                  >
                    {p.hostingIntroWebServices}
                  </a>
                  {p.hostingIntroEnd}
                </p>
              </motion.div>

              <div className="flex flex-col gap-2.5">
                {supportPlans.map((plan, index) => {
                  const isSelected = selectedSupportId === plan.id
                  const isOpen = openSupportId === plan.id
                  return (
                    <motion.article
                      key={plan.id}
                      id={plan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.14 + index * 0.04 }}
                      className={cn(
                        'scroll-mt-16 rounded-xl overflow-hidden transition-[border-color,background-color,box-shadow] duration-300',
                        isSelected
                          ? 'border-2 border-[oklch(52%_0.14_295)] bg-[oklch(96%_0.04_295)] shadow-[0_0_0_1px_oklch(52%_0.14_295/0.12)]'
                          : 'border border-gray-200 bg-white/85'
                      )}
                    >
                      <div className="px-3.5 pt-3.5 pb-1.5 sm:px-4 sm:pt-4 sm:pb-2">
                        <div className="flex items-baseline justify-between gap-4 mb-1.5">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-2xl sm:text-[1.75rem] text-gray-900 leading-tight">
                              {plan.name}
                            </h3>
                            <ul
                              className="flex flex-wrap gap-1.5 mt-2.5"
                              aria-label={t(p.highlightsAria, { name: plan.name })}
                            >
                              {plan.features.map((feature) => (
                                <li
                                  key={feature}
                                  className="text-xs text-gray-700 bg-[oklch(96%_0.02_295)] border border-[oklch(90%_0.035_295)] px-2 py-0.5 rounded-md"
                                >
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="font-display text-xl sm:text-2xl text-primary-700 shrink-0 text-right whitespace-nowrap">
                            {plan.priceLabel}
                          </p>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 mt-4">
                          <button
                            type="button"
                            onClick={() => toggleSupportOpen(plan.id)}
                            aria-expanded={isOpen}
                            aria-controls={`${plan.id}-details`}
                            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 self-start"
                          >
                            {p.whatsIncluded}
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isOpen && 'rotate-180'
                              )}
                              aria-hidden
                            />
                          </button>
                          <SelectToggle
                            selected={isSelected}
                            label={plan.name}
                            onToggle={() => selectSupport(plan.id)}
                          />
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            id={`${plan.id}-details`}
                            key="support-details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mx-3.5 sm:mx-4 mb-3.5 sm:mb-4 rounded-lg border border-primary-100/80 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 space-y-2.5">
                              <p className="text-sm text-gray-700 leading-snug">
                                {plan.whyItHelps}
                              </p>
                              <DetailGroups groups={plan.details} />
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.article>
                  )
                })}
              </div>
            </section>

            <section className="border-t border-gray-200 bg-white/50 py-5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:rounded-xl">
              <div className="text-center">
                <h2 className="font-sans text-lg sm:text-xl font-semibold tracking-tight text-gray-900 mb-1">
                  {p.notSureHeading}
                </h2>
                <p className="text-sm text-gray-600 mb-3 leading-snug">{p.notSureBody}</p>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 justify-center">
                  <SpectrumFlipCta href={href('/introspect')} size="md">
                    {p.introspectCta}
                  </SpectrumFlipCta>
                  <Link
                    href={href('/contact')}
                    className="group flex flex-col items-center gap-1 rounded-md px-3 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                  >
                    <span className="inline-flex text-gray-900 transition-colors duration-200 group-hover:text-gray-600">
                      <IconContact className="h-7 w-7" />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-gray-900 group-hover:text-gray-600">
                      {p.contactCta}
                    </span>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <SelectionSummary
            selectedPlan={selectedPlan}
            selectedSupport={selectedSupport}
            onClearPlan={() => setSelectedPlanId(null)}
            onClearSupport={() => setSelectedSupportId(null)}
          />
        </div>
      </div>
    </main>
  )
}
