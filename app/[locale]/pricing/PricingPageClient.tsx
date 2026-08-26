'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
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
import { LinkRenderText } from '@/components/pricing/LinkRenderText'
import { MixMatchPicker } from '@/components/pricing/MixMatchPicker'
import { MobilePlanAccordion } from '@/components/pricing/MobilePlanAccordion'
import { PlanFeatureRevealProvider } from '@/components/pricing/PlanChecklist'
import { PlanFullDetails } from '@/components/pricing/PlanFullDetails'
import { PlanTierCard } from '@/components/pricing/PlanTierCard'
import { PricingComparisonMatrix } from '@/components/pricing/PricingComparisonMatrix'
import { FootnoteAsterisk, RedesignPrompt } from '@/components/pricing/RedesignPrompt'
import { SelectToggle } from '@/components/pricing/SelectToggle'
import { SelectionSummary } from '@/components/pricing/SelectionSummary'
import { SupportTierIcon } from '@/components/pricing/SupportTierIcon'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import {
  BUILD_HANDOFF_FEE,
  getPlans,
  getSupportPlans,
  type PlanId,
  type SupportPlanId,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

const introLinkClass =
  'font-medium text-primary-700 hover:text-primary-800 underline underline-offset-2'

function EmphasisText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/)
        if (bold?.[1]) {
          return (
            <strong key={i} className="font-semibold text-gray-800">
              {bold[1]}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
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
  const [buildHandoffOpen, setBuildHandoffOpen] = useState(false)

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null
  const selectedSupport =
    supportPlans.find((p) => p.id === selectedSupportId) ?? null
  const hasSelection = Boolean(
    selectedPlan || selectedSupport || selectedBuildHandoff
  )

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

  return (
    <main className={cn('bg-paper overflow-x-clip', hasSelection && 'pb-20 lg:pb-0')}>
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_0%,oklch(92%_0.03_230/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_10%,oklch(93%_0.03_80/0.45),transparent_50%)]" />
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <section
              className="pt-1 sm:pt-1.5 pb-4 xl:flex xl:min-h-[calc(100svh-var(--spacing-12))] xl:flex-col"
              aria-labelledby="website-plans-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 shrink-0"
              >
                <h1 className="font-display text-sm text-gray-500 leading-none">
                  {p.title}
                </h1>
                <h2
                  id="website-plans-heading"
                  className="mt-1 font-display text-xl sm:text-2xl text-gray-900 leading-none"
                >
                  {p.websitePlansHeading}
                </h2>
                <p className="mt-1.5 text-sm text-gray-600 leading-snug max-w-3xl">
                  <EmphasisText text={p.baselineNote} />
                </p>
              </motion.div>

              <PlanFeatureRevealProvider>
              <div className="xl:hidden">
                <MobilePlanAccordion
                  plans={plans}
                  selectedId={selectedPlanId}
                  onSelect={(id) => selectPlan(id as PlanId)}
                  popularLabel={p.mostPopular}
                />
              </div>
              <div className="hidden xl:grid xl:grid-cols-4 xl:flex-1 xl:gap-3.5 xl:items-stretch">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id
                  return (
                    <PlanTierCard
                      key={plan.id}
                      plan={plan}
                      popularLabel={p.mostPopular}
                      selected={isSelected}
                      className="scroll-mt-16"
                      anchor={false}
                      action={
                        <SelectToggle
                          selected={isSelected}
                          label={plan.name}
                          onToggle={() => selectPlan(plan.id)}
                          variant="solid"
                          className="w-full sm:w-full"
                        />
                      }
                    >
                      <PlanFullDetails
                        groups={plan.details}
                        included={plan.included}
                        planId={plan.id}
                      />
                    </PlanTierCard>
                  )
                })}
              </div>
              </PlanFeatureRevealProvider>
              <p className="mt-2 shrink-0 text-xs text-gray-500 leading-snug">
                <FootnoteAsterisk />
                {p.startingPriceNote}
              </p>
              <RedesignPrompt className="mt-2 mb-1" />
            </section>

            <section
              className="pb-5"
              aria-label={p.comparison.heading}
            >
              <div id="comparison" className="scroll-mt-16">
                <PricingComparisonMatrix
                  plans={plans}
                  defaultOpen
                  selectedPlanId={selectedPlanId}
                />
              </div>
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
                  className="font-display text-xl sm:text-2xl text-gray-900 leading-none"
                >
                  {p.hostingSupportHeading}
                </h2>
                <p className="mt-1.5 text-sm text-gray-600 leading-snug max-w-3xl">
                  {p.hostingSupportLead}
                </p>
              </motion.div>

              <PlanFeatureRevealProvider
                defaultReveal={{
                  planId: 'business-support',
                  icon: 'priority-hours',
                }}
              >
                <div className="xl:hidden">
                  <MobilePlanAccordion
                    plans={supportPlans}
                    selectedId={selectedSupportId}
                    onSelect={(id) => selectSupport(id as SupportPlanId)}
                    popularLabel={p.mostPopular}
                    afterLabel={p.hostingWhoFor}
                    iconFor={(id) => (
                      <SupportTierIcon planId={id as SupportPlanId} />
                    )}
                  />
                </div>
                <div className="hidden xl:grid xl:grid-cols-3 xl:gap-3.5 xl:items-stretch">
                  {supportPlans.map((plan) => {
                    const isSelected = selectedSupportId === plan.id
                    return (
                      <PlanTierCard
                        key={plan.id}
                        plan={plan}
                        popularLabel={p.mostPopular}
                        selected={isSelected}
                        className="scroll-mt-16"
                        anchor={false}
                        icon={<SupportTierIcon planId={plan.id} />}
                        action={
                          <SelectToggle
                            selected={isSelected}
                            label={plan.name}
                            onToggle={() => selectSupport(plan.id)}
                            variant="solid"
                            className="w-full sm:w-full"
                          />
                        }
                      >
                        <PlanFullDetails
                          groups={plan.details}
                          included={plan.included}
                          planId={plan.id}
                          afterLabel={p.hostingWhoFor}
                        />
                      </PlanTierCard>
                    )
                  })}
                </div>
              </PlanFeatureRevealProvider>
            </section>

            <section
              id="mix-and-match"
              className="scroll-mt-16 -mx-4 bg-[oklch(68%_0.24_232)] px-4 py-5 sm:-mx-6 sm:px-6 sm:py-6 lg:-mx-8 lg:px-8"
              aria-labelledby="mix-and-match-heading"
            >
              <div>
                <h2
                  id="mix-and-match-heading"
                  className="font-display text-xl sm:text-2xl text-white leading-none"
                >
                  {p.mixMatchHeading}
                </h2>
                <p className="mt-2 text-sm text-white/90 leading-snug max-w-3xl">
                  <span className="hidden lg:inline">{p.mixMatchLead}</span>
                  <span className="lg:hidden">{p.mixMatchLeadTap}</span>
                </p>

                <div
                  className={cn(
                    'mt-4 grid overflow-hidden rounded-2xl border border-white bg-white',
                    'shadow-[0_10px_24px_rgba(8,40,80,0.18)]',
                    'md:grid-cols-2 lg:h-[31rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(18rem,22rem)] lg:grid-rows-1'
                  )}
                >
                  <MixMatchPicker
                    step={1}
                    className="border-b border-[oklch(86%_0.03_230)] md:border-r lg:border-b-0"
                    heading={p.mixMatchWebsiteHeading}
                    items={plans.map((plan) => ({
                      id: plan.id,
                      name: plan.name,
                      priceLabel: plan.priceLabel,
                      brief: plan.features,
                      selected: selectedPlanId === plan.id,
                    }))}
                    onSelect={(id) => selectPlan(id as PlanId)}
                  />
                  <MixMatchPicker
                    step={2}
                    className="border-b border-[oklch(86%_0.03_230)] lg:border-b-0 lg:border-r"
                    heading={p.mixMatchHostingHeading}
                    items={supportPlans.map((plan) => ({
                      id: plan.id,
                      name: plan.name,
                      priceLabel: plan.priceLabel,
                      brief: plan.features,
                      selected: selectedSupportId === plan.id,
                    }))}
                    onSelect={(id) => selectSupport(id as SupportPlanId)}
                  />
                  <div className="h-full min-h-0 md:col-span-2 lg:col-span-1">
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

                {/* Website-build cancellation */}
                <div className="rounded-xl border border-[oklch(88%_0.035_195)] bg-[oklch(97%_0.015_195)] px-3.5 py-2.5 sm:px-4">
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {p.goingLiveStep2CancelBuildHeading}
                  </p>
                  <p className="mt-1 text-sm text-gray-700 leading-snug">
                    {p.goingLiveStep2BulletCancelBuild}
                  </p>
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

                {/* Responsibilities you take over — under build & hand off */}
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
    </main>
  )
}
