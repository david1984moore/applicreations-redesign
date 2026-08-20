'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  CreditCard,
  GitBranch,
  Globe2,
  KeyRound,
  Lock,
  Package,
  Server,
  type LucideIcon,
} from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { IconContact } from '@/components/ui/BrandNavLinks'
import { BuildHandoffConfirmDialog } from '@/components/pricing/BuildHandoffConfirmDialog'
import { DetailGroups } from '@/components/pricing/DetailGroups'
import { LinkRenderText } from '@/components/pricing/LinkRenderText'
import { PackagePriceLabel } from '@/components/pricing/PackagePriceLabel'
import { PlanFeatureRotator } from '@/components/pricing/PlanFeatureRotator'
import { SelectToggle } from '@/components/pricing/SelectToggle'
import { SelectionSummary } from '@/components/pricing/SelectionSummary'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import {
  BUILD_HANDOFF_FEE,
  getPlans,
  getSupportPlans,
  type PlanId,
  type PricingPlan,
  type SupportPlanId,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

const PLAN_IDS = new Set<string>(['starter', 'basic', 'pro', 'business'])
const SUPPORT_IDS = new Set<string>(['support', 'business-support', 'ultimate'])

const introLinkClass =
  'font-medium text-primary-700 hover:text-primary-800 underline underline-offset-2'

const whatsIncludedLinkClass =
  'cursor-pointer inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-[oklch(52%_0.16_295)] hover:text-[oklch(45%_0.15_295)]'

function WebsitePlanPrice({
  plan,
  oneTimeLabel,
  className,
}: {
  plan: PricingPlan
  oneTimeLabel: string
  className?: string
}) {
  return (
    <p className={className}>
      {plan.priceLabel}
      {!plan.contactForPricing ? (
        <span className="ml-1.5 text-xs font-sans font-normal text-gray-500">
          {oneTimeLabel}
        </span>
      ) : null}
    </p>
  )
}

/** Icons for cancel-takeover items — order matches dictionary arrays (en/es). */
const CANCEL_ITEM_ICONS: LucideIcon[] = [
  Globe2,
  Lock,
  Server,
  KeyRound,
  GitBranch,
  Activity,
  Package,
  CreditCard,
]

export default function PricingPageClient() {
  const { dict, t, href, locale } = useLocale()
  const p = dict.pricingPage
  const plans = getPlans(dict, locale)
  const supportPlans = getSupportPlans(dict, locale)

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null)
  const [selectedSupportId, setSelectedSupportId] = useState<SupportPlanId | null>(
    null
  )
  const [selectedBuildHandoff, setSelectedBuildHandoff] = useState(false)
  const [buildHandoffConfirmOpen, setBuildHandoffConfirmOpen] = useState(false)
  const [openPlanId, setOpenPlanId] = useState<PlanId | null>(null)
  const [openSupportId, setOpenSupportId] = useState<SupportPlanId | null>(null)
  const [buildHandoffOpen, setBuildHandoffOpen] = useState(false)

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null
  const selectedSupport =
    supportPlans.find((p) => p.id === selectedSupportId) ?? null
  const websiteChooseWidthLabel =
    plans.find((p) => p.id === 'business')?.name ?? 'Business'
  const hasSelection = Boolean(
    selectedPlan || selectedSupport || selectedBuildHandoff
  )

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
    setSelectedBuildHandoff(false)
    setSelectedSupportId((current) => (current === id ? null : id))
  }

  const requestBuildHandoff = () => {
    setBuildHandoffConfirmOpen(true)
  }

  const confirmBuildHandoff = () => {
    setSelectedSupportId(null)
    setSelectedBuildHandoff(true)
    setBuildHandoffConfirmOpen(false)
  }

  const cancelBuildHandoffConfirm = () => {
    setBuildHandoffConfirmOpen(false)
  }

  const removeBuildHandoff = () => {
    setSelectedBuildHandoff(false)
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

            <section
              className="pb-5 mx-auto max-w-5xl"
              aria-labelledby="website-plans-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 }}
                className="mb-3"
              >
                <h2
                  id="website-plans-heading"
                  className="font-display text-xl sm:text-2xl text-gray-900"
                >
                  {p.websitePlansHeading}
                </h2>
              </motion.div>

              <div className="flex flex-col gap-2">
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
                      <div className="px-3 py-2 sm:px-4">
                        {/* Mobile: stacked so Choose never overlaps price; desktop grid unchanged */}
                        <div className="flex flex-col gap-1.5 lg:hidden">
                          <div className="flex items-baseline justify-between gap-3">
                            <h2 className="font-display text-2xl text-gray-900 leading-none min-w-0">
                              {plan.name}
                            </h2>
                            <WebsitePlanPrice
                              plan={plan}
                              oneTimeLabel={p.oneTime}
                              className={cn(
                                'font-display text-xl text-primary-700 leading-none shrink-0',
                                plan.contactForPricing
                                  ? 'whitespace-normal text-right max-w-[9.5rem]'
                                  : 'whitespace-nowrap'
                              )}
                            />
                          </div>
                          <PlanFeatureRotator
                            messages={plan.features}
                            ariaLabel={t(p.highlightsAria, { name: plan.name })}
                            startDelay={index * 900}
                            visible={!isOpen}
                          />
                          <div className="flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => togglePlanOpen(plan.id)}
                              aria-expanded={isOpen}
                              aria-controls={`${plan.id}-details`}
                              className={whatsIncludedLinkClass}
                            >
                              {p.whatsIncluded}
                              <ChevronDown
                                className={cn(
                                  'h-3.5 w-3.5 transition-transform duration-200',
                                  isOpen && 'rotate-180'
                                )}
                                aria-hidden
                              />
                            </button>
                            <SelectToggle
                              selected={isSelected}
                              label={plan.name}
                              onToggle={() => selectPlan(plan.id)}
                              widthLabel={websiteChooseWidthLabel}
                              className="w-auto px-2.5 py-1 text-sm leading-none"
                            />
                          </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-4">
                          <div className="min-w-0 justify-self-start">
                            <h2 className="font-display text-[1.75rem] text-gray-900 leading-none">
                              {plan.name}
                            </h2>
                            <PlanFeatureRotator
                              messages={plan.features}
                              ariaLabel={t(p.highlightsAria, { name: plan.name })}
                              startDelay={index * 900}
                              visible={!isOpen}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex flex-col items-center justify-self-center text-center px-2">
                            <WebsitePlanPrice
                              plan={plan}
                              oneTimeLabel={p.oneTime}
                              className={cn(
                                'font-display text-2xl text-primary-700 leading-none',
                                plan.contactForPricing ? 'whitespace-normal' : 'whitespace-nowrap'
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => togglePlanOpen(plan.id)}
                              aria-expanded={isOpen}
                              aria-controls={`${plan.id}-details`}
                              className={cn(whatsIncludedLinkClass, 'mt-1')}
                            >
                              {p.whatsIncluded}
                              <ChevronDown
                                className={cn(
                                  'h-3.5 w-3.5 transition-transform duration-200',
                                  isOpen && 'rotate-180'
                                )}
                                aria-hidden
                              />
                            </button>
                          </div>
                          <div className="flex items-start justify-end justify-self-end">
                            <SelectToggle
                              selected={isSelected}
                              label={plan.name}
                              onToggle={() => selectPlan(plan.id)}
                              widthLabel={websiteChooseWidthLabel}
                              className="w-auto px-2.5 py-1 text-sm leading-none"
                            />
                          </div>
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
                              <DetailGroups groups={plan.details} planId={plan.id} />
                              <p className="mt-3.5 border-t border-gray-100 pt-3 text-xs text-gray-500 leading-snug">
                                <span
                                  className="mr-1 font-semibold text-primary-700"
                                  aria-hidden
                                >
                                  *
                                </span>
                                {p.startingPriceNote}
                              </p>
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
              className="scroll-mt-16 border-t border-gray-200 py-5 mx-auto max-w-5xl"
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
                  className="font-display text-xl sm:text-2xl text-gray-900"
                >
                  {p.hostingSupportHeading}
                </h2>
              </motion.div>

              <div className="flex flex-col gap-2">
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
                      <div className="px-3 py-2 sm:px-4">
                        {/* Mobile: stacked so Choose never overlaps price; desktop grid unchanged */}
                        <div className="flex flex-col gap-1.5 lg:hidden">
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="font-display text-2xl text-gray-900 leading-none min-w-0">
                              {plan.name}
                            </h3>
                            <p className="font-display text-xl text-primary-700 whitespace-nowrap leading-none shrink-0">
                              <PackagePriceLabel label={plan.priceLabel} />
                            </p>
                          </div>
                          <PlanFeatureRotator
                            messages={plan.features}
                            ariaLabel={t(p.highlightsAria, { name: plan.name })}
                            startDelay={(plans.length + index) * 900}
                            visible={!isOpen}
                          />
                          <div className="flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => toggleSupportOpen(plan.id)}
                              aria-expanded={isOpen}
                              aria-controls={`${plan.id}-details`}
                              className={whatsIncludedLinkClass}
                            >
                              {p.whatsIncluded}
                              <ChevronDown
                                className={cn(
                                  'h-3.5 w-3.5 transition-transform duration-200',
                                  isOpen && 'rotate-180'
                                )}
                                aria-hidden
                              />
                            </button>
                            <SelectToggle
                              selected={isSelected}
                              label={plan.name}
                              onToggle={() => selectSupport(plan.id)}
                              className="w-auto px-2.5 py-1 text-sm leading-none"
                            />
                          </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-4">
                          <div className="min-w-0 justify-self-start">
                            <h3 className="font-display text-[1.75rem] text-gray-900 leading-none">
                              {plan.name}
                            </h3>
                            <PlanFeatureRotator
                              messages={plan.features}
                              ariaLabel={t(p.highlightsAria, { name: plan.name })}
                              startDelay={(plans.length + index) * 900}
                              visible={!isOpen}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex flex-col items-center justify-self-center text-center px-2">
                            <p className="font-display text-2xl text-primary-700 whitespace-nowrap leading-none">
                              <PackagePriceLabel label={plan.priceLabel} />
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleSupportOpen(plan.id)}
                              aria-expanded={isOpen}
                              aria-controls={`${plan.id}-details`}
                              className={cn(whatsIncludedLinkClass, 'mt-1')}
                            >
                              {p.whatsIncluded}
                              <ChevronDown
                                className={cn(
                                  'h-3.5 w-3.5 transition-transform duration-200',
                                  isOpen && 'rotate-180'
                                )}
                                aria-hidden
                              />
                            </button>
                          </div>
                          <div className="flex items-start justify-end justify-self-end">
                            <SelectToggle
                              selected={isSelected}
                              label={plan.name}
                              onToggle={() => selectSupport(plan.id)}
                              className="w-auto px-2.5 py-1 text-sm leading-none"
                            />
                          </div>
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

            <section
              id="going-live"
              className="scroll-mt-16 border-t border-gray-200 py-5"
              aria-labelledby="going-live-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.18 }}
              >
                <h2
                  id="going-live-heading"
                  className="font-display text-xl sm:text-2xl text-gray-900 mb-0.5"
                >
                  {p.goingLiveHeading}
                </h2>
                <p className="text-sm text-gray-600 leading-snug mb-2.5 max-w-2xl">
                  {p.goingLiveLead}
                </p>

                <div className="rounded-xl border border-[oklch(88%_0.035_195)] bg-[oklch(96%_0.025_195)] overflow-hidden">
                  <ol className="divide-y divide-[oklch(90%_0.03_195)]">
                    <li className="flex gap-2.5 px-3.5 py-2.5 sm:px-4">
                      <span
                        className="mt-px w-5 shrink-0 font-display text-xl font-bold tabular-nums text-[oklch(42%_0.16_295)] leading-none"
                        aria-hidden
                      >
                        1
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {p.goingLiveStep1Title}
                        </h3>
                        <ul className="mt-1 list-disc pl-4 marker:text-[oklch(42%_0.12_295)] space-y-0.5">
                          <li className="text-sm text-gray-700 leading-snug pl-0.5">
                            {p.goingLiveStep1Bullet}
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li className="flex gap-2.5 px-3.5 py-2.5 sm:px-4">
                      <span
                        className="mt-px w-5 shrink-0 font-display text-xl font-bold tabular-nums text-[oklch(42%_0.16_295)] leading-none"
                        aria-hidden
                      >
                        2
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {p.goingLiveStep2Title}
                        </h3>
                        <ul className="mt-1 list-disc pl-4 marker:text-[oklch(42%_0.12_295)] space-y-1">
                          <li className="text-sm text-gray-700 leading-snug pl-0.5">
                            {p.goingLiveStep2BulletPlan}
                          </li>
                          <li className="text-sm text-gray-700 leading-snug pl-0.5">
                            <LinkRenderText
                              text={`${p.hostingIntroBeforeRender} ${p.hostingIntroRender}.`}
                            />
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li className="flex gap-2.5 px-3.5 py-2.5 sm:px-4">
                      <span
                        className="mt-px w-5 shrink-0 font-display text-xl font-bold tabular-nums text-[oklch(42%_0.16_295)] leading-none"
                        aria-hidden
                      >
                        3
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {p.goingLiveStep3Title}
                        </h3>
                        <ul className="mt-1 list-disc pl-4 marker:text-[oklch(42%_0.12_295)] space-y-0.5">
                          <li className="text-sm text-gray-700 leading-snug pl-0.5">
                            {p.goingLiveNeedDomainBefore}
                            <a
                              href="https://www.namecheap.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={introLinkClass}
                            >
                              {p.goingLiveNeedDomainNamecheap}
                            </a>
                            {p.goingLiveNeedDomainAfter}
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ol>
                </div>
              </motion.div>
            </section>

            <section
              id="cancellation"
              className="scroll-mt-16 border-t border-gray-200 py-5"
              aria-labelledby="cancellation-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.22 }}
                className="space-y-3"
              >
                <h2
                  id="cancellation-heading"
                  className="font-display text-xl sm:text-2xl text-gray-900"
                >
                  {p.goingLiveStep2CancellationHeading}
                </h2>

                {/* Cancel anytime — responsibilities you take over */}
                <div className="rounded-xl border border-[oklch(88%_0.035_195)] bg-white overflow-hidden">
                  <div className="border-b border-[oklch(90%_0.03_195)] bg-[oklch(97%_0.015_195)] px-3.5 py-2.5 sm:px-4">
                    <p className="text-sm text-gray-700 leading-snug">
                      <LinkRenderText text={p.goingLiveStep2BulletCancel} />
                    </p>
                  </div>

                  <ul className="grid sm:grid-cols-2 gap-px bg-[oklch(92%_0.02_195)]">
                    {p.goingLiveStep2CancelItems.map((item, index) => {
                      const [plain, tech] = item.split(' — ')
                      const Icon = CANCEL_ITEM_ICONS[index] ?? Server
                      return (
                        <li
                          key={item}
                          className="flex gap-2.5 bg-white px-3.5 py-2.5 sm:px-4"
                        >
                          <span
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[oklch(96%_0.025_195)] text-[oklch(42%_0.1_195)]"
                            aria-hidden
                          >
                            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 leading-snug">
                              <LinkRenderText text={plain ?? item} />
                            </p>
                            {tech ? (
                              <p className="mt-0.5 text-xs text-gray-500 leading-snug">
                                <LinkRenderText text={tech} />
                              </p>
                            ) : null}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Build & hand off — one-time alternative */}
                <div
                  className={cn(
                    'rounded-xl border overflow-hidden transition-colors',
                    selectedBuildHandoff
                      ? 'border-[oklch(70%_0.08_295)] bg-[oklch(96%_0.03_295)]'
                      : 'border-[oklch(88%_0.035_195)] bg-[oklch(96%_0.025_195)]'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setBuildHandoffOpen((current) => !current)}
                    aria-expanded={buildHandoffOpen}
                    aria-controls="build-handoff-details"
                    className="cursor-pointer w-full px-3.5 py-3 sm:px-4 sm:py-3.5 text-left"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                      <span className="flex min-w-0 items-center gap-2">
                        <AlertTriangle
                          className="h-4 w-4 shrink-0 text-red-600"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        <h3 className="text-sm font-bold text-gray-900 leading-tight min-w-0">
                          {p.goingLiveStep2HandoffHeading}
                        </h3>
                      </span>
                      <span className="shrink-0 rounded-md border border-[oklch(82%_0.05_195)] bg-white px-2.5 py-0.5 text-sm font-bold tabular-nums text-gray-900">
                        {t(p.oneTimeSuffix, { price: p.goingLiveStep2HandoffFee })}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {buildHandoffOpen ? (
                      <motion.div
                        id="build-handoff-details"
                        key="build-handoff-details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-3.5 pb-3 sm:px-4 sm:pb-3.5">
                          <ul className="list-disc pl-4 marker:text-[oklch(50%_0.08_195)] space-y-1">
                            <li className="text-sm text-gray-700 leading-snug pl-0.5">
                              {p.goingLiveStep2HandoffBodyBefore}{' '}
                              <span className="font-bold text-gray-900">
                                {p.goingLiveStep2HandoffFee}
                              </span>
                              <LinkRenderText text={p.goingLiveStep2HandoffBodyAfterFee} />
                            </li>
                            <li className="text-sm text-gray-700 leading-snug pl-0.5">
                              <LinkRenderText text={p.goingLiveStep2HandoffFeeCovers} />
                            </li>
                            <li className="text-sm text-gray-700 leading-snug pl-0.5">
                              <LinkRenderText text={p.goingLiveStep2HandoffRenderAccount} />
                            </li>
                            <li className="text-sm font-medium text-gray-900 leading-snug pl-0.5">
                              <LinkRenderText
                                text={p.goingLiveStep2HandoffSoleResponsibility}
                              />
                            </li>
                          </ul>

                          <p className="mt-2.5 rounded-lg border border-[oklch(90%_0.02_195)] bg-white/80 px-2.5 py-1.5 text-sm text-gray-600 leading-snug">
                            <LinkRenderText
                              text={t(p.goingLiveStep2HandoffExample, {
                                planName: plans[0]?.name ?? 'Starter',
                                planPrice: plans[0]?.priceLabel ?? '$349',
                                handoffFee: p.goingLiveStep2HandoffFee,
                                total: `$${((plans[0]?.price ?? 349) + BUILD_HANDOFF_FEE).toLocaleString('en-US')}`,
                              })}
                            />
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                            {selectedBuildHandoff ? (
                              <>
                                <p className="text-xs text-gray-600">
                                  {p.buildHandoffSelected}
                                </p>
                                <button
                                  type="button"
                                  onClick={removeBuildHandoff}
                                  className="cursor-pointer text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800"
                                >
                                  {p.buildHandoffRemove}
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={requestBuildHandoff}
                                className="cursor-pointer text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
                              >
                                {p.buildHandoffSelect}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2.5 border-t border-[oklch(88%_0.04_75)] bg-[oklch(98%_0.02_85)] px-3.5 py-2.5 sm:px-4">
                          <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(48%_0.12_65)]"
                            strokeWidth={2.25}
                            aria-hidden
                          />
                          <p className="text-sm font-bold text-gray-900 leading-snug">
                            <LinkRenderText text={p.goingLiveStep2CancelClosing} />
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <BuildHandoffConfirmDialog
                  open={buildHandoffConfirmOpen}
                  onConfirm={confirmBuildHandoff}
                  onCancel={cancelBuildHandoffConfirm}
                />
              </motion.div>
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
            selectedBuildHandoff={selectedBuildHandoff}
            onClearPlan={() => setSelectedPlanId(null)}
            onClearSupport={() => setSelectedSupportId(null)}
            onClearBuildHandoff={() => setSelectedBuildHandoff(false)}
          />
        </div>
      </div>
    </main>
  )
}
