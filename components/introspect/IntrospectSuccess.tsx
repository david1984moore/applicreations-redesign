'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ROUTE_COVER_FADE_MS } from '@/components/ui/RouteCover'
import { requestStaticHiwFinale } from '@/lib/hiw-cinema'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { coverRoute } from '@/lib/route-cover'

const EASE = [0.22, 1, 0.36, 1] as const
const FADE_EASE = [0.33, 0, 0.2, 1] as const
const DRIFT_EASE = [0.16, 1, 0.3, 1] as const

const skyButtonClass =
  '!bg-[oklch(68%_0.15_230)] hover:!bg-[oklch(62%_0.14_230)] focus-visible:!ring-[oklch(68%_0.15_230)/0.45]'

const T = {
  thanksIn: 900,
  thanksHold: 1000,
  restFade: 1100,
  headingHold: 1400,
  headingOut: 750,
  cardIn: 700,
  pointLead: 220,
  pointIn: 900,
  betweenPoints: 600,
  continueLead: 280,
  continueIn: 700,
  cardOut: 800,
  closingIn: 900,
  closingHold: 1500,
} as const

type Scene = 'thanks' | 'heading' | 'card' | 'closing'

export function IntrospectSuccess({
  ui,
  homeHref,
}: {
  ui: Dictionary['introspectUi']
  homeHref: string
}) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const instant = !!prefersReducedMotion
  const [scene, setScene] = useState<Scene>('thanks')
  const [points, setPoints] = useState(0)
  const [showContinue, setShowContinue] = useState(false)

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms))
    }

    if (instant) {
      setScene('card')
      setPoints(2)
      setShowContinue(true)
      return
    }

    const headingAt = T.thanksIn + T.thanksHold
    const cardAt = headingAt + T.restFade + T.headingHold
    const point1At = cardAt + T.headingOut + T.cardIn + T.pointLead
    const point2At = point1At + T.pointIn + T.betweenPoints
    const continueAt = point2At + T.pointIn + T.continueLead

    at(headingAt, () => setScene('heading'))
    at(cardAt, () => setScene('card'))
    at(point1At, () => setPoints(1))
    at(point2At, () => setPoints(2))
    at(continueAt, () => setShowContinue(true))

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [instant])

  useEffect(() => {
    if (scene !== 'closing') return

    const timers: number[] = []
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms))
    }

    const fadeAt = T.cardOut + T.closingIn + T.closingHold
    at(fadeAt, () => {
      requestStaticHiwFinale()
      router.prefetch(homeHref)
      const coverMs = instant ? 0 : ROUTE_COVER_FADE_MS
      void coverRoute(coverMs).then(() => {
        router.replace(homeHref)
      })
    })

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [scene, instant, homeHref, router])

  const nextItems = [ui.successNext1, ui.successNext2]
  const liveText =
    scene === 'closing'
      ? ui.successClosing
      : scene === 'card'
        ? `${ui.successNextHeading} ${nextItems.slice(0, Math.max(points, 1)).join(' ')}`
        : ui.successHeading

  return (
    <div
      className="relative flex min-h-[16rem] flex-1 flex-col items-center justify-center py-4"
      data-introspect-scene={scene}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {liveText}
      </p>

      <AnimatePresence mode="wait">
        {(scene === 'thanks' || scene === 'heading') && (
          <motion.div
            key="heading"
            layout
            className="text-center"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: T.headingOut / 1000, ease: FADE_EASE },
            }}
            transition={{ layout: { duration: T.restFade / 1000, ease: DRIFT_EASE } }}
          >
            <h1 className="relative font-mi-gente text-2xl text-gray-900 leading-tight">
              <motion.span
                className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 w-max max-w-[90vw] -translate-x-1/2 text-xs font-semibold tracking-[0.14em] uppercase text-[oklch(48%_0.12_230)]"
                initial={false}
                animate={{
                  opacity: scene === 'heading' ? 1 : 0,
                  y: scene === 'heading' ? 0 : 4,
                }}
                transition={{
                  duration: T.restFade / 1000,
                  ease: FADE_EASE,
                }}
              >
                {ui.successEyebrow}
              </motion.span>
              <span className="sr-only">{ui.successHeading}</span>

              {/* Mobile: Thanks stays centered, drifts up; rest fades in below. */}
              <span
                className="relative mx-auto flex w-full max-w-[20rem] flex-col items-center lg:hidden"
                aria-hidden
              >
                <motion.span
                  className="whitespace-nowrap"
                  initial={instant ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: T.thanksIn / 1000,
                    ease: EASE,
                  }}
                >
                  {ui.successThanks}
                </motion.span>
                <motion.span
                  className="overflow-hidden"
                  initial={false}
                  animate={
                    scene === 'heading'
                      ? { opacity: 1, height: 'auto', marginTop: 10 }
                      : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  transition={{ duration: T.restFade / 1000, ease: FADE_EASE }}
                >
                  <motion.span
                    className="block max-w-[20rem] text-pretty text-center leading-snug"
                    initial={false}
                    animate={{
                      opacity: scene === 'heading' ? 1 : 0,
                      y: scene === 'heading' ? 0 : 12,
                    }}
                    transition={{ duration: T.restFade / 1000, ease: DRIFT_EASE }}
                  >
                    {ui.successHeadingRest}
                  </motion.span>
                </motion.span>
              </span>

              {/* Desktop: Thanks slides left; rest joins the same line. */}
              <span
                className="relative mx-auto hidden w-max max-w-full lg:block"
                aria-hidden
              >
                <span className="invisible inline-flex items-baseline gap-x-[0.4em] whitespace-nowrap">
                  <span>{ui.successThanks}</span>
                  <span>{ui.successHeadingRest}</span>
                </span>
                <span className="absolute inset-0">
                  <motion.span
                    className="absolute top-0 whitespace-nowrap"
                    initial={instant ? false : { left: '50%', x: '-50%', opacity: 0, y: 8 }}
                    animate={
                      scene === 'heading'
                        ? { left: 0, x: 0, opacity: 1, y: 0 }
                        : { left: '50%', x: '-50%', opacity: 1, y: 0 }
                    }
                    transition={{
                      left: { duration: 0.7, ease: EASE },
                      x: { duration: 0.7, ease: EASE },
                      y: { duration: T.thanksIn / 1000, ease: EASE },
                      opacity: { duration: T.thanksIn / 1000, ease: EASE },
                    }}
                  >
                    {ui.successThanks}
                  </motion.span>
                  <motion.span
                    className="absolute top-0 right-0 whitespace-nowrap"
                    initial={false}
                    animate={{ opacity: scene === 'heading' ? 1 : 0 }}
                    transition={{
                      duration: T.restFade / 1000,
                      ease: FADE_EASE,
                    }}
                  >
                    {ui.successHeadingRest}
                  </motion.span>
                </span>
              </span>
            </h1>
          </motion.div>
        )}

        {scene === 'card' && (
          <motion.div
            key="card"
            className="w-full max-w-xl"
            initial={instant ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 12,
              filter: 'blur(6px)',
              transition: {
                duration: T.cardOut / 1000,
                ease: FADE_EASE,
              },
            }}
            transition={{ duration: T.cardIn / 1000, ease: EASE }}
          >
            <div className="rounded-xl border border-gray-200/80 bg-white/80 px-4 py-5 sm:px-5 space-y-4">
              <p className="text-lg sm:text-xl font-bold text-gray-900 text-center">
                {ui.successNextHeading}
              </p>
              <motion.ol
                layout
                className="min-h-[4.75rem] space-y-2.5 text-sm sm:text-[0.95rem] text-gray-700 leading-snug list-decimal list-inside"
                transition={{ layout: { duration: 0.55, ease: EASE } }}
              >
                {nextItems.slice(0, points).map((item) => (
                  <motion.li
                    key={item}
                    layout
                    initial={
                      instant
                        ? false
                        : { opacity: 0, y: 28, scale: 1.04, filter: 'blur(5px)' }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: T.pointIn / 1000,
                      ease: EASE,
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ol>
              {showContinue ? (
                <motion.div
                  className="flex justify-center pt-1"
                  initial={instant ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: T.continueIn / 1000, ease: EASE }}
                >
                  <Button
                    type="button"
                    className={skyButtonClass}
                    onClick={() => {
                      router.prefetch(homeHref)
                      setScene('closing')
                    }}
                  >
                    {ui.continue}
                  </Button>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        )}

        {scene === 'closing' && (
          <motion.p
            key="closing"
            className="font-mi-gente text-2xl sm:text-3xl text-gray-900 leading-tight text-center"
            initial={instant ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: T.closingIn / 1000,
              ease: FADE_EASE,
            }}
          >
            {ui.successClosing}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
