'use client'

/**
 * LANDING BOARD — SPACING + LAYOUT LOCKED (Aug 1, 2026 — final)
 * Reference screenshot: docs/landing-board-locked.png
 *
 * Approved composition (do not restyle without explicit ask):
 * - Left: brand (logo overhang on name) + icon nav (Introspect / Projects / Contact)
 * - Right: simplified website pricing (name → price → short summary → More)
 * - Bottom: How it works — staggered steps 1→2→3, Begin Introspect right
 *
 * Locked spacing recipe (desktop):
 * - Shell: lg:pt-[clamp(1.5rem,5.5vh,5rem)] lg:pb-[clamp(0.75rem,3vh,2.5rem)]
 * - Block gap (pricing ↔ How it works): lg:gap-[clamp(0.75rem,2vh,1.25rem)]
 * - How it works: py-[0.625rem]/sm:py-[0.75rem], inner gap-[0.625rem], step gap-[0.375rem]
 * - Step stagger: marginLeft min(index * 34%, calc(100% - 20rem))
 * - Begin Introspect CTA (LOCKED): dot + label centered as one unit (inline-flex gap-3),
 *   spectrum-flip grows/shrinks from the dot (200ms ease-in-out), purple→white dot on fill,
 *   sans bold label, top-[32%] on the right of How it works
 * - Prefer explicit rem / clamp values — project --spacing-* tokens are 2× Tailwind defaults
 *
 * How it works entrance (Aug 3, 2026):
 * - Compact card (title + tagline) → pause → expand → steps slide L→R overlapping → CTA last
 * - Step detail type ≥ nav labels (0.9375rem+). Skip on locale swap / reduced motion.
 */
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ClipboardList, Eye, Globe2 } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { isLocaleTransition } from '@/lib/i18n/locale-transition'
import { getBasicSupport, getPlans } from '@/lib/pricing'

/**
 * How it works entrance (delays in ms/s as noted):
 * compact hold → expand (grid) → overlapping step slides → CTA
 */
const HIW_MOTION = {
  cardDelay: 0.28,
  cardDuration: 0.5,
  /** How long the header-only card stays before expanding (ms) */
  compactHoldMs: 1200,
  /** Expand duration (ms) — keep in sync with duration-[850ms] below */
  expandMs: 850,
  /** Fraction of expand elapsed before step 1 starts */
  step1AtExpand: 0.68,
  stepDuration: 0.55,
  /** Next step begins before the previous finishes */
  stepOverlap: 0.32,
  ctaDuration: 0.45,
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

  useEffect(() => {
    if (instantHiw) {
      setHiwExpanded(true)
      return
    }
    const id = window.setTimeout(() => setHiwExpanded(true), HIW_MOTION.compactHoldMs)
    return () => window.clearTimeout(id)
  }, [instantHiw])

  const processSteps = useMemo(
    () =>
      [
        { n: '1', ...dict.landing.steps.introspect, Icon: ClipboardList },
        { n: '2', ...dict.landing.steps.livePreview, Icon: Eye },
        { n: '3', ...dict.landing.steps.workingWebsite, Icon: Globe2 },
      ] as const,
    [dict]
  )

  const stepStartDelay = (HIW_MOTION.expandMs / 1000) * HIW_MOTION.step1AtExpand
  const stepDelays = processSteps.map(
    (_, index) => stepStartDelay + index * HIW_MOTION.stepOverlap
  )
  const ctaDelay =
    stepDelays[stepDelays.length - 1]! + HIW_MOTION.stepDuration + 0.06

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
        <div className="lg:my-auto flex w-full shrink-0 flex-col gap-4 lg:gap-[clamp(0.75rem,2vh,1.25rem)]">
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

                    {/* Tagline — phone: starts right of brand center; wraps in remaining width so ES isn’t clipped. sm+/lg unchanged. */}
                    <div className="w-0 min-w-full flex justify-start min-h-[2.35rem] sm:min-h-0">
                      <p className="mt-2.5 ml-[calc(50%+1rem)] max-w-[calc(50%-1.25rem)] sm:ml-[5.75rem] sm:max-w-[calc(100%-5.75rem)] lg:ml-[8.5rem] lg:max-w-none lg:w-max text-[0.8125rem] sm:text-base font-[700] italic tracking-[0.05em] sm:tracking-[0.12em] uppercase text-primary-600 leading-snug text-left lg:whitespace-nowrap">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {plans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={plan.ctaHref}
                      className="relative flex flex-col items-center text-center rounded-lg px-3 py-2.5 bg-paper/70 border border-gray-200 cursor-pointer outline-none transition-colors hover:border-gray-300 hover:bg-paper focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                    >
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
                  ))}
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

          {/* How it works — compact → expand → staggered steps → CTA */}
          <motion.div
            id="introspect"
            initial={instantHiw ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: HIW_MOTION.cardDuration,
              delay: HIW_MOTION.cardDelay,
              ease: easeOut,
            }}
            className="relative shrink-0 rounded-xl border border-primary-400/40 bg-fade-next text-white px-5 py-3.5 sm:px-6 sm:py-4 lg:py-[0.75rem]"
          >
            <div className="flex flex-col">
              <div className="flex flex-col gap-1 lg:gap-0.5">
                <p className="text-base font-bold tracking-[0.14em] uppercase text-primary-100/90 text-center lg:text-sm">
                  {dict.landing.howItWorks}
                </p>
                <h2 className="font-display text-xl sm:text-2xl lg:text-xl leading-[1.2] lg:leading-[1.15] tracking-tight text-center">
                  {dict.landing.threeSteps}
                </h2>
              </div>

              {/* Expand via grid-rows so compact state is truly header-only */}
              <div
                aria-hidden={!hiwExpanded}
                className={
                  hiwExpanded
                    ? `grid grid-rows-[1fr] ${instantHiw ? '' : 'transition-[grid-template-rows] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]'}`
                    : 'grid grid-rows-[0fr] pointer-events-none'
                }
              >
                <div className="min-h-0 overflow-hidden">
                  {/* pt replaces former flex gap so compact state stays header-only */}
                  <div className="relative pr-0 sm:pr-56 overflow-x-hidden lg:overflow-visible pt-3 lg:pt-[0.625rem]">
                    <ol className="flex flex-col gap-2.5 lg:gap-[0.5rem] text-left">
                      {processSteps.map((step, index) => (
                        <motion.li
                          key={step.n}
                          initial={false}
                          animate={
                            hiwExpanded || instantHiw
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -40 }
                          }
                          transition={
                            instantHiw
                              ? { duration: 0 }
                              : {
                                  delay: hiwExpanded ? stepDelays[index] : 0,
                                  duration: HIW_MOTION.stepDuration,
                                  ease: easeOut,
                                }
                          }
                          className="flex gap-2.5 lg:gap-2 max-w-none lg:max-w-[min(100%,22rem)] max-lg:!ml-0"
                          style={{ marginLeft: `min(${index * 34}%, calc(100% - 22rem))` }}
                        >
                          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[oklch(84%_0.12_205/0.55)] bg-[oklch(60%_0.13_205)] text-white lg:h-8 lg:w-8 lg:border-[oklch(78%_0.08_310/0.45)] lg:bg-[oklch(58%_0.14_310)]">
                            <step.Icon className="h-5 w-5 lg:h-4 lg:w-4" strokeWidth={1.6} aria-hidden />
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-baseline gap-1.5 text-base font-semibold text-white leading-tight lg:text-[0.9375rem]">
                              <span className="font-display text-2xl font-semibold tabular-nums text-[oklch(88%_0.12_205)] leading-none lg:text-xl lg:text-[oklch(86%_0.08_310)]">
                                {step.n}
                              </span>
                              {step.label}
                            </p>
                            <p className="mt-1 text-base leading-snug text-primary-50/95 lg:mt-0.5 lg:text-base">
                              {step.detail}
                            </p>
                          </div>
                        </motion.li>
                      ))}
                    </ol>

                    {/* CTA — mobile: solid shaded button; lg+: spectrum-flip from the dot */}
                    <motion.div
                      initial={false}
                      animate={
                        hiwExpanded || instantHiw
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={
                        instantHiw
                          ? { duration: 0 }
                          : {
                              delay: hiwExpanded ? ctaDelay : 0,
                              duration: HIW_MOTION.ctaDuration,
                              ease: easeOut,
                            }
                      }
                      className="mt-4 flex justify-center sm:mt-0 sm:absolute sm:right-0 sm:top-[32%] sm:-translate-y-1/2"
                    >
                      <Link
                        href={href('/introspect')}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-8 py-3 font-sans text-base font-bold tracking-tight shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-[oklch(58%_0.13_205)] text-white ring-1 ring-white/30 focus-visible:ring-white/60 focus-visible:ring-offset-primary-700 lg:bg-[oklch(98%_0.012_85)] lg:text-primary-800 lg:ring-white/70"
                      >
                        <span className="relative inline-flex items-center gap-3">
                          <span className="relative z-0 hidden h-2 w-2 shrink-0 lg:block" aria-hidden>
                            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(58%_0.14_310)] shadow-[0_0_0_0_oklch(58%_0.14_310)] transition-[box-shadow] duration-200 ease-in-out group-hover:shadow-[0_0_0_220px_oklch(58%_0.14_310)] group-focus-visible:shadow-[0_0_0_220px_oklch(58%_0.14_310)]" />
                            <span className="relative z-20 block h-2 w-2 rounded-full bg-[oklch(58%_0.14_310)] transition-colors duration-200 ease-in-out group-hover:bg-white group-focus-visible:bg-white" />
                          </span>
                          <span className="relative z-10 lg:transition-colors lg:duration-200 lg:ease-in-out lg:group-hover:text-white lg:group-focus-visible:text-white">
                            {dict.landing.beginIntrospect}
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
