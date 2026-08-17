'use client'

/**
 * LANDING BOARD — SPACING + LAYOUT LOCKED (Aug 1, 2026 — final)
 * Reference screenshot: docs/landing-board-locked.png
 *
 * Approved composition (do not restyle without explicit ask):
 * - Left: brand (logo overhang on name) + icon nav (Introspect / Projects / Contact)
 * - Right: simplified website pricing (name → price → short summary → More)
 * - Bottom: How it works cinematic stage (fills remaining viewport on desktop)
 *
 * Locked spacing recipe (desktop):
 * - Shell: lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)]
 * - Block gap (pricing ↔ How it works): lg:gap-[clamp(0.75rem,2vh,1.25rem)]
 * - Prefer explicit rem / clamp values — project --spacing-* tokens are 2× Tailwind defaults
 *
 * How it works cinema (Aug 16, 2026):
 * - No card — stage sits on the tan page wash, expands to remaining height
 * - Intro (How it works / 3 / tagline) → three sequential steps with cartoon sketches
 *   → lasting finale (title + Begin Introspect)
 * - Skip cinema on locale swap / reduced motion.
 */
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { HowItWorksStage } from '@/components/landing/hiw/HowItWorksStage'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { isLocaleTransition } from '@/lib/i18n/locale-transition'
import { getBasicSupport, getPlans } from '@/lib/pricing'
import { cn } from '@/lib/utils'

/**
 * How it works entrance (delays in ms/s as noted):
 * compact hold → expand stage on tan wash
 */
const HIW_MOTION = {
  cardDelay: 0.28,
  cardDuration: 0.5,
  /** How long the empty stage stays before expanding (ms) */
  compactHoldMs: 500,
  /** Expand duration (ms) — keep in sync with duration-[850ms] below */
  expandMs: 850,
} as const

const easeOut = [0.22, 1, 0.36, 1] as const

export function LandingBoard() {
  const { dict, t, href, locale } = useLocale()
  const plans = useMemo(() => getPlans(dict, locale), [dict, locale])
  const basicSupport = useMemo(() => getBasicSupport(dict, locale), [dict, locale])
  // Locale swaps remount this board — skip fade/slide so the page doesn't flash
  const [skipIntro] = useState(() => isLocaleTransition())
  const prefersReducedMotion = useReducedMotion()
  const instantHiw = skipIntro || !!prefersReducedMotion
  const [hiwExpanded, setHiwExpanded] = useState(instantHiw)
  const [hiwReady, setHiwReady] = useState(instantHiw)

  useEffect(() => {
    if (instantHiw) {
      setHiwExpanded(true)
      setHiwReady(true)
      return
    }
    const id = window.setTimeout(() => setHiwExpanded(true), HIW_MOTION.compactHoldMs)
    return () => window.clearTimeout(id)
  }, [instantHiw])

  useEffect(() => {
    if (instantHiw || !hiwExpanded) return
    const id = window.setTimeout(() => setHiwReady(true), HIW_MOTION.expandMs)
    return () => window.clearTimeout(id)
  }, [hiwExpanded, instantHiw])

  return (
    <section className="landing-board relative flex flex-col overflow-x-hidden lg:h-full lg:overflow-hidden">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_0%,oklch(92%_0.03_230/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_10%,oklch(93%_0.03_80/0.55),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,oklch(98%_0.012_85)_0%,oklch(96%_0.02_80)_45%,oklch(97%_0.015_90)_100%)]" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sand-deep/20 blur-3xl" />
      </div>

      {/* LOCKED shell — cream edges + centered board; vh clamps keep HIW unclipped on short laptops */}
      <div className="relative z-10 flex flex-1 flex-col max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-6 sm:pt-14 sm:pb-8 lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)] min-h-0">
        <div className="flex w-full flex-col gap-4 lg:flex-1 lg:min-h-0 lg:gap-[clamp(0.75rem,2vh,1.25rem)]">
          <div className="grid shrink-0 grid-cols-1 lg:grid-cols-12 gap-x-8 xl:gap-x-10 gap-y-4">
            <div className="lg:col-span-5 flex flex-col items-center lg:items-stretch lg:pr-2">
              <div className="w-fit max-w-full flex flex-col h-full min-h-0 mx-auto lg:mx-0">
                <motion.div
                  initial={skipIntro ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0"
                >
                  <div className="relative">
                    <h1 className="relative font-display text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl text-gray-900 leading-[1.05] tracking-tight pt-7 sm:pt-8 lg:pt-9 text-center lg:text-left">
                      <motion.span
                        initial={skipIntro ? false : { opacity: 0, scale: 0.86 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-none absolute z-10 left-[32%] lg:left-[32%] top-0 -translate-x-1/2 -translate-y-[48%] inline-block h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                        aria-hidden
                      >
                        <Image
                          src="/logo-mark.png"
                          alt=""
                          width={56}
                          height={56}
                          priority
                          className="!h-full !w-full object-contain"
                        />
                      </motion.span>
                      {dict.brand.name}
                    </h1>

                    {/* Tagline — always one line; phone starts right of brand center. Size fits EN + ES. */}
                    <div className="w-0 min-w-full flex justify-start overflow-visible">
                      <p className="mt-2.5 ml-[calc(50%+0.25rem)] sm:ml-[5.75rem] lg:ml-[8.5rem] w-max max-w-none whitespace-nowrap text-[0.6rem] sm:text-base font-[700] italic tracking-[0.02em] sm:tracking-[0.12em] uppercase text-primary-600 leading-none text-left">
                        {dict.landing.tagline}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Nav — own band under brand; never collapses into the name */}
                <nav
                  aria-label="Primary"
                  className="flex flex-1 items-center justify-center gap-3.5 sm:gap-5 lg:gap-8 min-h-[5rem] lg:min-h-[5.75rem] mt-6 lg:mt-6 py-2 w-0 min-w-full"
                >
                  <BrandNavLinks variant="landing" />
                </nav>
              </div>
            </div>

            <div className="lg:col-span-7 self-start">
              <motion.div
                id="pricing"
                initial={skipIntro ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="relative flex flex-col rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-3.5 py-3 sm:px-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-3 mb-2">
                  <span className="hidden lg:block" aria-hidden />
                  <p className="text-sm font-bold tracking-[0.12em] uppercase text-primary-600 text-center">
                    {dict.landing.websitePricing}
                  </p>
                  <Link
                    href={href('/pricing')}
                    className="hidden lg:block justify-self-end cursor-pointer text-[0.9375rem] font-bold tracking-tight text-gray-900 hover:text-gray-700 shrink-0"
                  >
                    {dict.landing.fullPricingDetails}
                  </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {plans.map((plan) => {
                    const isPopular = plan.id === 'basic'
                    return (
                      <Link
                        key={plan.id}
                        href={plan.ctaHref}
                        className={cn(
                          'relative flex flex-col items-center text-center rounded-lg px-3 py-2.5 cursor-pointer outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                          isPopular
                            ? 'border border-primary-400/70 bg-[oklch(96%_0.025_230)] hover:border-primary-500/80 hover:bg-[oklch(95%_0.03_230)] shadow-[inset_0_0_0_1px_oklch(70%_0.06_230/0.12)]'
                            : 'border border-gray-200 bg-paper/70 hover:border-gray-300 hover:bg-paper'
                        )}
                      >
                        {isPopular ? (
                          <span className="mb-1 text-[0.625rem] font-bold tracking-[0.14em] uppercase text-primary-600 leading-none">
                            {dict.landing.popularPackage}
                          </span>
                        ) : null}
                        <h3 className="font-display text-lg font-bold text-gray-900 leading-none tracking-tight">
                          {plan.name}
                        </h3>
                        <p className="mt-1.5 font-display text-2xl font-bold text-primary-600 leading-none tabular-nums">
                          {plan.priceLabel}
                        </p>

                        <p className="mt-1.5 text-[0.8125rem] text-gray-700 leading-snug flex-1">
                          {plan.shortSummary}
                        </p>

                        <span className="mt-1.5 text-[0.9375rem] font-bold tracking-tight text-gray-900">
                          {plan.cta} →
                        </span>
                      </Link>
                    )
                  })}
                </div>

                <p className="mt-2 text-sm text-center">
                  <Link
                    href={href('/pricing#support')}
                    className="cursor-pointer font-medium text-gray-900 hover:text-gray-700"
                  >
                    {t(dict.landing.hostingFrom, { price: basicSupport.priceLabel })}
                  </Link>
                </p>

                <Link
                  href={href('/pricing')}
                  className="lg:hidden mt-2.5 text-center cursor-pointer text-[0.875rem] font-bold tracking-tight text-gray-900 hover:text-gray-700"
                >
                  {dict.landing.fullPricingDetails}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* How it works — expand on tan wash, no card */}
          <motion.div
            id="introspect"
            initial={instantHiw ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: HIW_MOTION.cardDuration,
              delay: HIW_MOTION.cardDelay,
              ease: easeOut,
            }}
            className={
              hiwExpanded
                ? 'relative flex min-h-[20rem] flex-col overflow-hidden lg:min-h-0 lg:flex-1'
                : 'relative flex h-11 shrink-0 flex-col overflow-hidden'
            }
          >
            <div
              className={
                hiwExpanded
                  ? `grid h-full min-h-[20rem] flex-1 grid-rows-[1fr] lg:min-h-0 ${instantHiw ? '' : 'transition-[grid-template-rows] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]'}`
                  : 'grid min-h-[2.75rem] grid-rows-[0fr] pointer-events-none'
              }
            >
              <div className="h-full min-h-0 overflow-hidden">
                <HowItWorksStage started={hiwReady} instant={instantHiw} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
