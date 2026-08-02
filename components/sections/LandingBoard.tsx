'use client'

/**
 * LANDING BOARD — SPACING + LAYOUT LOCKED (Aug 1, 2026 — final)
 * Reference screenshot: docs/landing-board-locked.png
 *
 * Approved composition (do not restyle without explicit ask):
 * - Left: brand (logo overhang on name) + icon nav (Introspect / Projects / Contact)
 * - Right: simplified website pricing (name → price → short summary → More)
 * - Bottom: How it works — staggered steps 1→2→3, Begin Introspect right, Going live footer
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
 * Copy/links/data ok. Spacing, alignment, card format, type scale: frozen.
 */
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ClipboardList, Eye, Globe2 } from 'lucide-react'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { plans, BASIC_SUPPORT } from '@/lib/pricing'

const processSteps = [
  {
    n: '1',
    label: 'Introspect',
    detail: 'A few easy questions about your business — just tell us what you do.',
    Icon: ClipboardList,
  },
  {
    n: '2',
    label: 'Live preview',
    detail: 'A practice site you can open, click through, and try yourself.',
    Icon: Eye,
  },
  {
    n: '3',
    label: 'Working website',
    detail: 'We review with you, finish the build, and deliver the real site.',
    Icon: Globe2,
  },
] as const

export function LandingBoard() {
  return (
    <section className="landing-board relative flex flex-col overflow-x-hidden lg:h-[100svh] lg:overflow-hidden">
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
              <div className="w-fit max-w-full flex flex-col h-full min-h-0 mx-auto lg:mx-0 -translate-x-1 lg:translate-x-0">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0"
                >
                  <div className="relative">
                    <h1 className="relative font-display text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl text-gray-900 leading-[1.05] tracking-tight pt-7 sm:pt-8 lg:pt-9 text-center lg:text-left">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.86 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-none absolute z-10 left-1/2 lg:left-[32%] top-0 -translate-x-1/2 -translate-y-[48%] inline-block h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
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
                      Applicreations
                    </h1>

                    {/* Tagline sits under the name; w-0 min-w-full so it doesn't widen the brand column */}
                    <div className="w-0 min-w-full overflow-visible flex justify-center lg:justify-start">
                      <p className="mt-2.5 ml-0 lg:ml-[8.5rem] w-max max-w-full text-sm sm:text-base font-[700] italic tracking-[0.12em] uppercase text-primary-600 whitespace-nowrap text-center lg:text-left">
                        Custom apps and websites
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Nav — own band under brand; never collapses into the name */}
                <nav
                  aria-label="Primary"
                  className="flex flex-1 items-center justify-center gap-4 sm:gap-5 lg:gap-8 min-h-[5rem] lg:min-h-[5.75rem] mt-6 lg:mt-6 py-2 w-0 min-w-full"
                >
                  <BrandNavLinks variant="landing" />
                </nav>
              </div>
            </div>

            <div className="lg:col-span-7 self-start">
              <motion.div
                id="pricing"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="relative flex flex-col rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-3.5 py-3 sm:px-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-3 mb-2">
                  <span className="hidden lg:block" aria-hidden />
                  <p className="text-sm font-bold tracking-[0.12em] uppercase text-primary-600 text-center">
                    Website Pricing
                  </p>
                  <a
                    href="/pricing"
                    className="hidden lg:block justify-self-end cursor-pointer text-[0.9375rem] font-bold tracking-tight text-gray-900 hover:text-gray-700 shrink-0"
                  >
                    Full pricing details →
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {plans.map((plan) => (
                    <a
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
                    </a>
                  ))}
                </div>

                <p className="mt-2 text-sm text-center">
                  <a
                    href="/pricing#support"
                    className="cursor-pointer font-medium text-gray-900 hover:text-gray-700"
                  >
                    *Hosting &amp; support from {BASIC_SUPPORT.priceLabel}
                  </a>
                </p>

                <a
                  href="/pricing"
                  className="lg:hidden mt-2.5 text-center cursor-pointer text-[0.875rem] font-bold tracking-tight text-gray-900 hover:text-gray-700"
                >
                  Full pricing details →
                </a>
              </motion.div>
            </div>
          </div>

          {/* LOCKED How it works — staggered steps; Begin Introspect right; Going live footer */}
          <motion.div
            id="introspect"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="relative shrink-0 rounded-xl border border-primary-400/40 bg-fade-next text-white px-5 py-[0.625rem] sm:px-6 sm:py-[0.75rem]"
          >
            <div className="flex flex-col gap-[0.625rem]">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold tracking-[0.14em] uppercase text-primary-100/90 text-center">
                  How it works
                </p>
                <h2 className="font-display text-lg sm:text-xl leading-[1.15] tracking-tight text-center">
                  Three simple steps to get your website…
                </h2>
              </div>

              <div className="relative pr-0 sm:pr-56 overflow-x-hidden lg:overflow-visible">
                <ol className="flex flex-col gap-[0.375rem] text-left">
                  {processSteps.map((step, index) => (
                    <li
                      key={step.n}
                      className="flex gap-2 max-w-[min(100%,20rem)] max-lg:!ml-0"
                      style={{ marginLeft: `min(${index * 34}%, calc(100% - 20rem))` }}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[oklch(78%_0.08_310/0.45)] bg-[oklch(58%_0.14_310)] text-white">
                        <step.Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-baseline gap-1.5 text-sm font-semibold text-white leading-tight">
                          <span className="font-display text-xl font-semibold tabular-nums text-[oklch(86%_0.08_310)] leading-none">
                            {step.n}
                          </span>
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[0.8125rem] leading-snug text-primary-50/90">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* CTA — mobile: solid shaded button; lg+: spectrum-flip from the dot */}
                <div className="mt-3 flex justify-center sm:mt-0 sm:absolute sm:right-0 sm:top-[32%] sm:-translate-y-1/2">
                  <Link
                    href="/introspect"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-8 py-3 font-sans text-base font-bold tracking-tight shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-[oklch(58%_0.14_310)] text-white ring-1 ring-white/25 focus-visible:ring-white/60 focus-visible:ring-offset-primary-700 lg:bg-[oklch(98%_0.012_85)] lg:text-primary-800 lg:ring-white/70"
                  >
                    <span className="relative inline-flex items-center gap-3">
                      <span className="relative z-0 hidden h-2 w-2 shrink-0 lg:block" aria-hidden>
                        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(58%_0.14_310)] shadow-[0_0_0_0_oklch(58%_0.14_310)] transition-[box-shadow] duration-200 ease-in-out group-hover:shadow-[0_0_0_220px_oklch(58%_0.14_310)] group-focus-visible:shadow-[0_0_0_220px_oklch(58%_0.14_310)]" />
                        <span className="relative z-20 block h-2 w-2 rounded-full bg-[oklch(58%_0.14_310)] transition-colors duration-200 ease-in-out group-hover:bg-white group-focus-visible:bg-white" />
                      </span>
                      <span className="relative z-10 lg:transition-colors lg:duration-200 lg:ease-in-out lg:group-hover:text-white lg:group-focus-visible:text-white">
                        Begin Introspect
                      </span>
                    </span>
                  </Link>
                </div>
              </div>

              <div className="border-t border-white/15 pt-[0.375rem]">
                <p className="text-[0.75rem] leading-snug text-primary-100/80">
                  <span className="font-bold text-white">Going live:</span> Your website package
                  covers the <span className="font-bold text-white">build only</span> — designing
                  and delivering the site. To put it on the internet, you’ll need to{' '}
                  <span className="font-bold text-white">purchase a domain</span> (your web
                  address, like <span className="font-bold text-white">www.joescafe.com</span> —
                  you can buy one at{' '}
                  <a
                    href="https://www.namecheap.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white underline underline-offset-2 decoration-white/55 hover:decoration-white"
                  >
                    Namecheap
                  </a>
                  ) and <span className="font-bold text-white">hosting</span>. Most clients choose
                  our hosting &amp; support from {BASIC_SUPPORT.priceLabel} so we get the site
                  live, keep it online, and handle technical issues. Without a hosting &amp;
                  support plan,{' '}
                  <span className="font-bold text-white">you are responsible</span>{' '}
                  for getting the site online and keeping it running.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
