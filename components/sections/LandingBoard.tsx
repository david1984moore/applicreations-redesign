'use client'

/**
 * LANDING BOARD — two-column desktop layout (Aug 16, 2026)
 *
 * Brand lockup (butterfly over "li"): locked in BrandLockup.tsx — do not restyle.
 *
 * Composition:
 * - Desktop left (~7/12): brand + icon nav, then 4-up vertical website pricing cards
 * - Desktop right (~5/12): How it works cinematic stage (fills remaining height)
 * - Mobile stack: brand → nav → How it works → pricing (cinema is first after chrome)
 * - Mobile cinema is in-flow (no clip box) so each scene can render fully;
 *   contain:paint keeps intro/step transforms from stretching past the footer
 *
 * Desktop spacing:
 * - Shell: lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)]
 * - Column gap: lg:gap-x-8 xl:gap-x-10; HIW column lg:pl-16 xl:pl-20 so the wash can clear nav / pricing
 *
 * How it works cinema:
 * - No card — stage sits on the tan page wash, fills right column height
 * - Starts on first paint (no compact-hold / expand wait)
 * - Intro: staggered 3D fly-in (How it works → 3 → tagline), inner+outer glow pulse,
 *   3 grows then fades toward the viewer; tagline follows, surges past, then step 1
 *   → three sequential steps with cartoon sketches
 *   → recap finale (tagline keeps receding and fading; then Get Started
 *     fades in from that far point)
 * - Finale CTA blooms a logo-violet wash on the right of a slight curve
 * - Skip cinema on locale swap / reduced motion / in-site return to home
 *   (a refresh starts a new JS lifetime, so the cinema plays again)
 * - In-site return still replays the recap points (staggered slide-in) with
 *   the Get Free Preview button already at its resting place
 */
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { HowItWorksStage } from '@/components/landing/hiw/HowItWorksStage'
import { HiwPageWash } from '@/components/landing/hiw/HiwPageWash'
import { LandingPricingRow } from '@/components/landing/LandingPricingRow'
import { PlanChecklist } from '@/components/pricing/PlanChecklist'
import { PlanTierCard, planSeeMoreClass } from '@/components/pricing/PlanTierCard'
import { BrandLockup } from '@/components/ui/BrandLockup'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { hasPlayedHiwCinema, markHiwCinemaPlayed } from '@/lib/hiw-cinema'
import { isLocaleTransition } from '@/lib/i18n/locale-transition'
import { getPlans } from '@/lib/pricing'

/**
 * How it works entrance: stage is open on first paint so the cinema
 * can start with the landing page, not after a compact-hold + expand.
 */
const HIW_MOTION = {
  cardDelay: 0,
  cardDuration: 0.18,
} as const

const easeOut = [0.22, 1, 0.36, 1] as const

export function LandingBoard() {
  const { dict, locale } = useLocale()
  const plans = useMemo(() => getPlans(dict, locale), [dict, locale])
  // Locale swaps remount this board — skip fade/slide so the page doesn't flash
  const [skipIntro] = useState(() => isLocaleTransition())
  const [playedHiw] = useState(() => hasPlayedHiwCinema())
  const prefersReducedMotion = useReducedMotion()
  const staticFinale = skipIntro || !!prefersReducedMotion
  const replayFinale = playedHiw && !staticFinale
  const skipCinema = staticFinale || playedHiw
  const [washVisible, setWashVisible] = useState(skipCinema)
  const showFinaleWash = useCallback(() => setWashVisible(true), [])

  useEffect(() => {
    // Defer so React Strict Mode's remount still sees an unplayed cinema.
    const id = window.setTimeout(() => markHiwCinemaPlayed(), 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (skipCinema) setWashVisible(true)
  }, [skipCinema])

  return (
    <section className="landing-board relative flex flex-col overflow-x-clip max-lg:[contain:paint] lg:h-full lg:overflow-hidden">
      <HiwPageWash visible={washVisible} instant={skipCinema} />
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_0%,oklch(92%_0.03_230/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_10%,oklch(93%_0.03_80/0.55),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,oklch(98%_0.012_85)_0%,oklch(96%_0.02_80)_45%,oklch(97%_0.015_90)_100%)]" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sand-deep/20 blur-3xl" />
      </div>

      {/* LOCKED shell — cream edges + centered board; vh clamps keep HIW unclipped on short laptops */}
      <div className="relative z-10 flex flex-1 flex-col max-w-[90rem] w-full mx-auto px-3 sm:px-6 lg:px-10 xl:px-12 pt-5 pb-3 sm:pt-14 sm:pb-8 lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)] min-h-0">
        <div className="flex w-full flex-col gap-3 sm:gap-4 lg:flex-1 lg:min-h-0 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-8 xl:gap-x-10 lg:gap-y-0">
          {/* Brand + nav — first on mobile; top of the left column on desktop */}
          <div className="relative z-20 order-1 flex w-full min-w-0 flex-col lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:pr-2">
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

                  <p className="mt-2.5 whitespace-nowrap text-left text-[length:clamp(0.72rem,calc((100vw-3.5rem)/22),0.92rem)] font-[700] italic uppercase leading-none tracking-[0.02em] text-primary-600 sm:text-base sm:tracking-[0.12em]">
                    {dict.landing.tagline}
                  </p>
                </div>
              </div>
            </motion.div>

            <nav
              aria-label="Primary"
              className="mt-4 w-full shrink-0 py-2 sm:mt-5 lg:mt-4"
            >
              <BrandNavLinks variant="landing" />
            </nav>
          </div>

          {/* How it works — directly under nav on mobile; right column on desktop */}
          <motion.div
            id="introspect"
            initial={skipCinema ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: HIW_MOTION.cardDuration,
              delay: HIW_MOTION.cardDelay,
              ease: easeOut,
            }}
            className="relative z-10 order-2 flex w-full flex-col overflow-visible max-lg:min-h-[24rem] max-lg:[overflow-anchor:none] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:h-auto lg:min-h-0 lg:flex-1 lg:overflow-visible lg:pl-16 lg:[clip-path:inset(-6rem_-100vw_-6rem_0)] xl:pl-20"
          >
            <div className="flex w-full flex-col max-lg:min-h-[24rem] lg:h-full lg:min-h-0 lg:flex-1 lg:grid lg:grid-rows-[1fr]">
              <div className="w-full max-lg:overflow-visible lg:h-full lg:min-h-0 lg:overflow-visible">
                <HowItWorksStage
                  started
                  instant={staticFinale}
                  replayFinale={replayFinale}
                  onCtaAppear={showFinaleWash}
                />
              </div>
            </div>
          </motion.div>

          {/* Website pricing — after the cinema on mobile; leftover left-column height on desktop */}
          <motion.div
            id="pricing"
            initial={skipIntro ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative z-20 order-3 flex min-h-0 w-full flex-col overflow-visible pt-1 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-3 lg:flex-1 lg:pr-2 lg:pt-2"
          >
            <h2 className="sr-only">{dict.landing.websitePricing}</h2>

            <LandingPricingRow>
              {plans.map((plan) => (
                <PlanTierCard
                  key={plan.id}
                  plan={plan}
                  popularLabel={dict.pricingPage.mostPopular}
                  density="landing"
                  action={
                    <Link
                      href={plan.ctaHref}
                      className={planSeeMoreClass}
                      aria-label={`${dict.landing.seeMore}, ${plan.name}`}
                    >
                      {dict.landing.seeMore}
                    </Link>
                  }
                >
                  <PlanChecklist items={plan.checklist} />
                </PlanTierCard>
              ))}
            </LandingPricingRow>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
