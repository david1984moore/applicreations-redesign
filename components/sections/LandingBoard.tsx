'use client'

/**
 * LANDING BOARD — two-column desktop layout (Aug 16, 2026)
 *
 * Brand lockup (butterfly over "li"): locked in BrandLockup.tsx — do not restyle.
 *
 * Composition:
 * - Left (~7/12): brand + icon nav, then the original wide 4-across pricing card
 * - Right (~5/12): How it works cinematic stage (fills remaining height)
 *
 * Desktop spacing:
 * - Shell: lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)]
 * - Column gap: lg:gap-x-8 xl:gap-x-10; HIW column lg:pl-16 xl:pl-20 so the wash can clear nav / pricing
 *
 * How it works cinema:
 * - No card — stage sits on the tan page wash, fills right column height
 * - Intro: staggered 3D fly-in (How it works → 3 → tagline), inner+outer glow pulse,
 *   3 grows then fades toward the viewer; tagline follows, surges past, then step 1
 *   → three sequential steps with cartoon sketches
 *   → recap finale (tagline zoom-in, three points, then centered Get Free Preview)
 * - Finale CTA blooms a logo-violet wash on the right of a slight curve
 * - Skip cinema on locale swap / reduced motion / in-site return to home
 *   (a refresh starts a new JS lifetime, so the cinema plays again)
 */
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { HowItWorksStage } from '@/components/landing/hiw/HowItWorksStage'
import { HiwPageWash } from '@/components/landing/hiw/HiwPageWash'
import { BrandLockup } from '@/components/ui/BrandLockup'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { hasPlayedHiwCinema, markHiwCinemaPlayed } from '@/lib/hiw-cinema'
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
  const [playedHiw] = useState(() => hasPlayedHiwCinema())
  const prefersReducedMotion = useReducedMotion()
  const instantHiw = skipIntro || !!prefersReducedMotion || playedHiw
  const [hiwExpanded, setHiwExpanded] = useState(instantHiw)
  const [hiwReady, setHiwReady] = useState(instantHiw)
  const [washVisible, setWashVisible] = useState(instantHiw)
  const showFinaleWash = useCallback(() => setWashVisible(true), [])

  useEffect(() => {
    // Defer so React Strict Mode's remount still sees an unplayed cinema.
    const id = window.setTimeout(() => markHiwCinemaPlayed(), 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (instantHiw) {
      setHiwExpanded(true)
      setHiwReady(true)
      setWashVisible(true)
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
      <HiwPageWash visible={washVisible} instant={instantHiw} />
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_0%,oklch(92%_0.03_230/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_10%,oklch(93%_0.03_80/0.55),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,oklch(98%_0.012_85)_0%,oklch(96%_0.02_80)_45%,oklch(97%_0.015_90)_100%)]" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sand-deep/20 blur-3xl" />
      </div>

      {/* LOCKED shell — cream edges + centered board; vh clamps keep HIW unclipped on short laptops */}
      <div className="relative z-10 flex flex-1 flex-col max-w-[90rem] w-full mx-auto px-3 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-6 sm:pt-14 sm:pb-8 lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)] min-h-0">
        <div className="flex w-full flex-col gap-4 lg:flex-1 lg:min-h-0 lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-10 lg:gap-y-0">
          {/* Left column — brand, nav, and pricing share one full-width column edge */}
          <div className="lg:col-span-7 flex w-full min-w-0 flex-col lg:pr-2 lg:self-start">
            <motion.div
              initial={skipIntro ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 w-full"
            >
              <div className="relative w-full">
                {/* Shrink-wrap brand + tagline, then center that unit over the nav. */}
                <div className="mx-auto w-fit">
                  {/* Approved butterfly-over-"li" lockup — geometry lives in BrandLockup.tsx and must not be tweaked here. */}
                  <BrandLockup name={dict.brand.name} skipIntro={skipIntro} />

                  <p className="mt-2.5 whitespace-nowrap text-left text-[0.6rem] font-[700] italic uppercase leading-none tracking-[0.02em] text-primary-600 sm:text-base sm:tracking-[0.12em]">
                    {dict.landing.tagline}
                  </p>
                </div>
              </div>
            </motion.div>

            <nav
              aria-label="Primary"
              className="mt-5 w-full shrink-0 py-2 sm:mt-6 lg:mt-5"
            >
              <BrandNavLinks variant="landing" />
            </nav>

            {/* Website pricing — original wide 4-across card, under brand + nav */}
            <motion.div
              id="pricing"
              initial={skipIntro ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="relative mt-4 lg:mt-5 flex shrink-0 flex-col rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-3.5 py-3 sm:px-4 w-full"
            >
              <p className="text-sm font-bold tracking-[0.12em] uppercase text-primary-600 text-center mb-2">
                {dict.landing.websitePricing}
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-5 pb-2 lg:gap-2 lg:pb-1.5">
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
                        <span className="absolute left-1/2 top-full z-10 mt-px -translate-x-1/2 whitespace-nowrap text-[0.625rem] font-bold tracking-[0.14em] uppercase text-primary-600 leading-none">
                          {dict.landing.popularPackage}
                        </span>
                      ) : null}
                      <h3 className="font-display text-lg font-bold text-gray-900 leading-none tracking-tight">
                        {plan.name}
                      </h3>
                      <p
                        className={cn(
                          'mt-1.5 font-display font-bold text-primary-600',
                          plan.contactForPricing
                            ? 'text-[0.95rem] leading-tight px-0.5'
                            : 'text-2xl leading-none tabular-nums'
                        )}
                      >
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

              <p className="mt-2 ml-auto w-fit text-sm text-right">
                <Link
                  href={href('/pricing#support')}
                  className="cursor-pointer font-medium text-gray-900 hover:text-gray-700"
                >
                  {t(dict.landing.hostingFrom, { price: basicSupport.priceLabel })}
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Right column — How it works cinematic stage */}
          <motion.div
            id="introspect"
            initial={instantHiw ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: HIW_MOTION.cardDuration,
              delay: HIW_MOTION.cardDelay,
              ease: easeOut,
            }}
            className={cn(
              'lg:col-span-5 lg:flex lg:flex-col lg:min-h-0 lg:pl-16 xl:pl-20',
              hiwExpanded
                ? 'relative flex min-h-[20rem] flex-col overflow-visible lg:min-h-0 lg:flex-1'
                : 'relative flex h-11 shrink-0 flex-col overflow-hidden'
            )}
          >
            <div
              className={
                hiwExpanded
                  ? `flex min-h-[20rem] flex-1 flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[1fr] ${instantHiw ? '' : 'transition-[grid-template-rows] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]'}`
                  : 'grid min-h-[2.75rem] grid-rows-[0fr] pointer-events-none'
              }
            >
              <div className="min-h-0 overflow-visible lg:h-full">
                <HowItWorksStage
                  started={hiwReady}
                  instant={instantHiw}
                  onCtaAppear={showFinaleWash}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
