'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ClipboardList, Eye, Globe2, type LucideIcon } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import {
  HiwCaption,
  HiwStepCopy,
  SCREENS_SINK_FADE_S,
  type HiwCaptionContent,
} from '@/components/landing/hiw/HiwStepCopy'
import { HiwFormSketch, hiwFormGlowAtMs } from '@/components/landing/hiw/HiwFormSketch'
import {
  HiwLivePreviewSketch,
  hiwStep2PlayMs,
  type PreviewBeat,
} from '@/components/landing/hiw/HiwDeviceSketch'
import {
  HiwStep3Cinema,
  type ReviewBeat,
} from '@/components/landing/hiw/HiwReviewSketch'
import { washEdgeXAtY } from '@/components/landing/hiw/HiwPageWash'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { cn } from '@/lib/utils'

/** Grown CTA stays on the purple with air on both sides of the wash band. */
const CTA_WASH_INSET_PX = 20
const CTA_RIGHT_AIR_PX = 36
const CTA_WASH_MIN_PX = 10
/** Spanish label is longer — keep the grown button inside the wash. */
const ES_CTA_GROW_SCALE = 1.18

const EASE = [0.22, 1, 0.36, 1] as const
const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const
const EXIT_EASE = [0.36, 0, 0.52, 0.22] as const
const FADE_EASE = [0.4, 0, 0.7, 1] as const
/** Screens plunge with the caption — accelerate down, then cut. */
const SINK_EASE = [0.52, 0.02, 0.88, 0.08] as const
const SINK_FADE_EASE = [0.62, 0, 0.22, 1] as const
const SINK_Y = 240
/** Slow start, long settle — CTA grow should feel like it breathes, not snap. */
const CTA_GROW_EASE = [0.45, 0.05, 0.12, 1] as const

function keepLayer(_latest: unknown, generated: string) {
  return generated.includes('translateZ') ? generated : `${generated} translateZ(0)`
}

const DESKTOP_MS = {
  introIn: 880,
  introStagger: 300,
  introGlow: 720,
  /** Inner pulse has peaked; 3 starts toward the viewer while still growing. */
  introGlowToExit: 480,
  /** 3's toward-user travel. Opacity starts later so the approach stays visible. */
  introThreeOut: 1220,
  introThreeFadeDelay: 300,
  introThreeFade: 820,
  /** Tagline follows the 3 at a steady pace, then kicks and fades out. */
  introFollowDelay: 500,
  introTaglineTravel: 700,
  introTaglineHold: 1380,
  introTaglineFade: 720,
  /** Keep intro mounted through the tagline fade. */
  introOut: 3300,
  introFade: 520,
  /** Form arrives during the tagline's end surge, after a longer on-screen hold. */
  introHandoff: 2980,
  /** Typing starts shortly after the form begins to appear. */
  step1PlayLead: 280,
  step1Enter: 1900,
  enter: 1450,
  split: 1100,
  /** Form illustration eases in slower than other step art. */
  step1Art: 1600,
  /** Heading sits at rest, then fades as the caption takes its slot. */
  headingHold: 620,
  headingFade: 760,
  captionLead: 480,
  /** Point 2 fades in over this window while point 1 is still leaving. */
  step2Enter: 1040,
  /** Crew slides in this long after point 2 starts moving. */
  step2ArtDelay: 180,
  /** Building line starts near the end of the point-2 heading fade. */
  step2CaptionLead: 660,
  /** Glow starts as the last character is typed in the last field. */
  step1Play: hiwFormGlowAtMs(),
  /** Short beat on the glowing form + caption, then hand off. */
  step1Glow: 1100,
  /** Form leaves first — opacity drops faster than the slide so copy never lands on it. */
  step1ArtOut: 1080,
  step1ArtFade: 720,
  /** Copy waits until the form is already thinning, then eases down. */
  step1CopyDelay: 280,
  step1CopySettle: 1680,
  /** Centered copy sits alone after the form is gone. */
  step1CopyHold: 700,
  step1CopyFade: 960,
  /** House + laptop stay on this clock. Stage leaves sooner than this. */
  step2Sketch: 30000,
  /** Do not sit on the handset after the line lands. */
  step2Glow: 800,
  step3Review: 3800,
  /** Longer than the caption leave so the next line starts on a blank beat. */
  step3CaptionGap: 920,
  step3Revise: 2700,
  /** Both characters at the house — “to get it just right …”, then “and”. */
  step3House: 7200,
  /** “and” lands this long before the screens cut. */
  step3AndLead: 1800,
  /** Screens + go-live line — hold just long enough to read, then drop. */
  step3Screens: 5500,
  glow: 2200,
  /** Short rest after the live screens — fade while the line still has air. */
  step3Glow: 80,
  exit: 1100,
  /** Last step plunges with the caption so the finale can take the stage. */
  step3Exit: 460,
  /** Headline zooms in from the viewer, then sits. */
  finaleIn: 1100,
  finaleHeadlineHold: 800,
  finalePointsIn: 720,
  finalePointsStagger: 220,
  finalePointsHold: 1200,
  finaleTextOut: 400,
  /** CTA fades in at its natural size, then grows. */
  ctaIn: 360,
  ctaGrowHold: 160,
  ctaGrow: 860,
} as const

const INTRO_FLY = {
  hidden: {
    opacity: 0,
    scale: 1.72,
    rotateX: 18,
    z: 96,
    transformPerspective: 1100,
  },
  shown: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    z: 0,
    transformPerspective: 1100,
  },
} as const

/** Finale tagline: large/near, then settle onto the screen. */
const FINALE_FLY = {
  hidden: {
    opacity: 0,
    scale: 1.58,
    rotateX: 15,
    z: 80,
    transformPerspective: 1100,
  },
  shown: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    z: 0,
    transformPerspective: 1100,
  },
} as const

/** Slide distances stay inside the right-column stage so nothing clips. */
const SLIDE = {
  copyIn: -56,
  copyOut: 48,
  artIn: 40,
  /** Form leaves farther right than other step art. */
  formOut: 80,
} as const

type IntroPose = 'enter' | 'glow' | 'exit'
type StepPose = 'enter' | 'split' | 'play' | 'glow' | 'exit'
type StepNum = 1 | 2 | 3
type FinaleBeat = 'headline' | 'points' | 'cta'

type CinemaPhase =
  | { name: 'idle' }
  | { name: 'intro'; pose: IntroPose }
  | {
      name: 'step'
      step: StepNum
      pose: StepPose
      introExit?: boolean
      /** Previous point stays mounted so its fade overlaps the next point's fade-in. */
      outgoing?: StepNum
    }
  | { name: 'finale'; beat: FinaleBeat }

type HowItWorksStageProps = {
  started: boolean
  /** No motion — reduced motion or a locale swap. */
  instant: boolean
  /** In-site return: skip the cinema, rest the CTA, replay the recap slide-in. */
  replayFinale?: boolean
  onCtaAppear?: () => void
}

function scaleTimings(scale: number) {
  return {
    introIn: Math.round(DESKTOP_MS.introIn * scale),
    introStagger: Math.round(DESKTOP_MS.introStagger * scale),
    introGlow: Math.round(DESKTOP_MS.introGlow * scale),
    introGlowToExit: Math.round(DESKTOP_MS.introGlowToExit * scale),
    introThreeOut: Math.round(DESKTOP_MS.introThreeOut * scale),
    introThreeFadeDelay: Math.round(DESKTOP_MS.introThreeFadeDelay * scale),
    introThreeFade: Math.round(DESKTOP_MS.introThreeFade * scale),
    introFollowDelay: Math.round(DESKTOP_MS.introFollowDelay * scale),
    introTaglineTravel: Math.round(DESKTOP_MS.introTaglineTravel * scale),
    introTaglineHold: Math.round(DESKTOP_MS.introTaglineHold * scale),
    introTaglineFade: Math.round(DESKTOP_MS.introTaglineFade * scale),
    introOut: Math.round(DESKTOP_MS.introOut * scale),
    introFade: Math.round(DESKTOP_MS.introFade * scale),
    introHandoff: Math.round(DESKTOP_MS.introHandoff * scale),
    step1PlayLead: Math.round(DESKTOP_MS.step1PlayLead * scale),
    step1Enter: Math.round(DESKTOP_MS.step1Enter * scale),
    enter: Math.round(DESKTOP_MS.enter * scale),
    split: Math.round(DESKTOP_MS.split * scale),
    step1Art: Math.round(DESKTOP_MS.step1Art * scale),
    headingHold: Math.round(DESKTOP_MS.headingHold * scale),
    headingFade: Math.round(DESKTOP_MS.headingFade * scale),
    captionLead: Math.round(DESKTOP_MS.captionLead * scale),
    step2Enter: Math.round(DESKTOP_MS.step2Enter * scale),
    step2ArtDelay: Math.round(DESKTOP_MS.step2ArtDelay * scale),
    step2CaptionLead: Math.round(DESKTOP_MS.step2CaptionLead * scale),
    // Typing uses unscaled CHAR_MS, so glow must stay on that clock.
    step1Play: DESKTOP_MS.step1Play,
    step1Glow: Math.round(DESKTOP_MS.step1Glow * scale),
    step1ArtOut: Math.round(DESKTOP_MS.step1ArtOut * scale),
    step1ArtFade: Math.round(DESKTOP_MS.step1ArtFade * scale),
    step1CopyDelay: Math.round(DESKTOP_MS.step1CopyDelay * scale),
    step1CopySettle: Math.round(DESKTOP_MS.step1CopySettle * scale),
    step1CopyHold: Math.round(DESKTOP_MS.step1CopyHold * scale),
    step1CopyFade: Math.round(DESKTOP_MS.step1CopyFade * scale),
    step1Exit:
      Math.round(DESKTOP_MS.step1CopyDelay * scale) +
      Math.round(DESKTOP_MS.step1CopySettle * scale) +
      Math.round(DESKTOP_MS.step1CopyHold * scale) +
      Math.round(DESKTOP_MS.step1CopyFade * scale),
    step2Sketch: Math.round(DESKTOP_MS.step2Sketch * scale),
    step2Play: hiwStep2PlayMs(Math.round(DESKTOP_MS.step2Sketch * scale)),
    step2Glow: Math.round(DESKTOP_MS.step2Glow * scale),
    step3Review: Math.round(DESKTOP_MS.step3Review * scale),
    step3CaptionGap: Math.round(DESKTOP_MS.step3CaptionGap * scale),
    step3Revise: Math.round(DESKTOP_MS.step3Revise * scale),
    step3House: Math.round(DESKTOP_MS.step3House * scale),
    step3AndLead: Math.round(DESKTOP_MS.step3AndLead * scale),
    step3Screens: Math.round(DESKTOP_MS.step3Screens * scale),
    step3Play:
      Math.round(DESKTOP_MS.step3Review * scale) +
      Math.round(DESKTOP_MS.step3CaptionGap * scale) * 2 +
      Math.round(DESKTOP_MS.step3Revise * scale) +
      Math.round(DESKTOP_MS.step3House * scale) +
      Math.round(DESKTOP_MS.step3Screens * scale),
    glow: Math.round(DESKTOP_MS.glow * scale),
    step3Glow: Math.round(DESKTOP_MS.step3Glow * scale),
    exit: Math.round(DESKTOP_MS.exit * scale),
    step3Exit: Math.round(DESKTOP_MS.step3Exit * scale),
    finaleIn: Math.round(DESKTOP_MS.finaleIn * scale),
    finaleHeadlineHold: Math.round(DESKTOP_MS.finaleHeadlineHold * scale),
    finalePointsIn: Math.round(DESKTOP_MS.finalePointsIn * scale),
    finalePointsStagger: Math.round(DESKTOP_MS.finalePointsStagger * scale),
    finalePointsHold: Math.round(DESKTOP_MS.finalePointsHold * scale),
    finaleTextOut: Math.round(DESKTOP_MS.finaleTextOut * scale),
    ctaIn: Math.round(DESKTOP_MS.ctaIn * scale),
    ctaGrowHold: Math.round(DESKTOP_MS.ctaGrowHold * scale),
    ctaGrow: Math.round(DESKTOP_MS.ctaGrow * scale),
    ctaGrowScale: scale >= 1 ? 1.5 : 1.16,
  }
}

type IntroTimings = ReturnType<typeof scaleTimings>

function captionForStep(
  step: 1 | 2 | 3,
  previewBeat: PreviewBeat,
  reviewBeat: ReviewBeat,
  dict: Dictionary,
  timings: IntroTimings
): HiwCaptionContent | null {
  if (step === 1) {
    return {
      text: dict.landing.steps.introspect.detail,
      placement: 'form',
    }
  }
  if (step === 2) {
    const copy = dict.landing.steps.livePreview
    if (previewBeat === 'build') {
      return { text: copy.building, placement: 'build' }
    }
    if (previewBeat === 'clear') {
      return null
    }
    if (previewBeat === 'phone') {
      return { text: copy.phoneSuffix, placement: 'phone' }
    }
    return { text: copy.detail, placement: 'preview' }
  }
  const copy = dict.landing.steps.workingWebsite
  if (reviewBeat === 'review') {
    return { text: copy.review, placement: 'review' }
  }
  if (reviewBeat === 'clear') {
    return null
  }
  if (reviewBeat === 'revise') {
    return { text: copy.revise, placement: 'revise' }
  }
  if (reviewBeat === 'house') {
    const ellipsisDelayMs = 880
    const lastDotMs = ellipsisDelayMs + 2 * 220
    return {
      text: copy.justRight,
      placement: 'house',
      suffix: copy.justRightAnd,
      suffixDelayMs: Math.max(lastDotMs + 360, timings.step3House - timings.step3AndLead),
      ellipsis: true,
      ellipsisDelayMs,
    }
  }
  return { text: copy.suffix, placement: 'screens' }
}

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Digit-only jitter — the badge stays still. Each instance runs its own clock. */
function RecapDigit({ n, readyMs }: { n: string; readyMs: number }) {
  const prefersReducedMotion = useReducedMotion()
  const [shaking, setShaking] = useState(false)
  const [burst, setBurst] = useState({ sx: 1, sr: 1, ms: 420 })

  useEffect(() => {
    if (prefersReducedMotion) return

    let timeoutId = 0
    let cancelled = false

    const loop = (wait: number) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        const ms = Math.round(randRange(360, 520))
        setBurst({
          sx: randRange(0.85, 1.3) * (Math.random() < 0.5 ? -1 : 1),
          sr: randRange(0.8, 1.25) * (Math.random() < 0.5 ? -1 : 1),
          ms,
        })
        setShaking(true)
        timeoutId = window.setTimeout(() => {
          if (cancelled) return
          setShaking(false)
          loop(randRange(12000, 32000))
        }, ms)
      }, wait)
    }

    loop(readyMs + randRange(6000, 18000))

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [prefersReducedMotion, readyMs])

  return (
    <span
      className={cn(
        'relative inline-block origin-center font-display text-[1.85rem] font-bold leading-none tabular-nums tracking-tight text-white',
        shaking && 'hiw-digit-shake'
      )}
      style={
        shaking
          ? ({
              '--sx': burst.sx,
              '--sr': burst.sr,
              '--shake-ms': `${burst.ms}ms`,
            } as CSSProperties)
          : undefined
      }
    >
      {n}
    </span>
  )
}

function FinaleRecap({
  recap,
  timings,
  instant,
}: {
  recap: readonly { n: string; label: string }[]
  timings: IntroTimings
  instant: boolean
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const [fromX, setFromX] = useState<number | null>(null)
  const pointsIn = timings.finalePointsIn / 1000
  const pointsStagger = timings.finalePointsStagger / 1000
  const ready = instant || fromX != null

  useLayoutEffect(() => {
    if (instant) return
    const el = listRef.current
    if (!el) return
    const box = el.getBoundingClientRect()
    // Start just past the viewport’s right edge so the travel reads as
    // coming from the right side of the screen.
    setFromX(Math.max(Math.round(window.innerWidth - box.left + 48), 160))
  }, [instant])

  return (
    <ul ref={listRef} className="flex flex-col items-start gap-2.5 sm:gap-4 lg:gap-5">
      {recap.map((step, index) => (
        <motion.li
          key={`${step.label}-${ready ? 'in' : 'm'}`}
          className={cn(
            'flex items-center gap-3 antialiased [backface-visibility:hidden]',
            index === 1 && 'lg:ml-[1.15rem]',
            index === 2 && 'lg:ml-[2.3rem]'
          )}
          initial={instant || fromX == null ? false : { opacity: 0, x: fromX }}
          animate={{ opacity: ready ? 1 : 0, x: 0 }}
          transition={{
            duration: pointsIn,
            delay: instant || fromX == null ? 0 : index * pointsStagger,
            ease: SMOOTH_EASE,
          }}
          transformTemplate={keepLayer}
        >
          <motion.span
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center"
            initial={instant ? false : { scale: 0.35 }}
            animate={{ scale: 1 }}
            transition={
              instant
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 460,
                    damping: 16,
                    delay: index * pointsStagger + 0.06,
                  }
            }
          >
            <span
              className="absolute inset-0 rounded-full bg-[oklch(46%_0.16_250)] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_3px_8px_oklch(32%_0.12_250/0.38)] ring-2 ring-white/75"
              aria-hidden
            />
            <RecapDigit
              n={step.n}
              readyMs={
                instant
                  ? 0
                  : timings.finalePointsStagger * index + timings.finalePointsIn
              }
            />
          </motion.span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-white whitespace-nowrap sm:text-xl">
            {step.label}
          </span>
        </motion.li>
      ))}
    </ul>
  )
}

function FinaleCinema({
  beat,
  threeSteps,
  recap,
  ctaLabel,
  ctaHref,
  timings,
  instant,
  replayFinale,
  fitCtaToWash = false,
}: {
  beat: FinaleBeat
  threeSteps: string
  recap: readonly { n: string; label: string; Icon: LucideIcon }[]
  ctaLabel: string
  ctaHref: string
  timings: IntroTimings
  instant: boolean
  replayFinale: boolean
  /** Spanish label is longer — grow only as far as the purple wash allows. */
  fitCtaToWash?: boolean
}) {
  const showHeadline = beat !== 'cta'
  const showPoints = beat === 'points' || beat === 'cta'
  const showCta = beat === 'cta'
  const skipCtaMotion = instant || replayFinale
  const ctaSlotRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const offsetXRef = useRef(0)
  const [offsetY, setOffsetY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [ctaScale, setCtaScale] = useState(1)

  useLayoutEffect(() => {
    const slot = ctaSlotRef.current
    const pricing = document.getElementById('pricing')
    if (!slot || !pricing) return

    const align = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        offsetXRef.current = 0
        setOffsetY(0)
        setOffsetX(0)
        setCtaScale(1)
        return
      }
      const priceBox = pricing.getBoundingClientRect()
      const slotBox = slot.getBoundingClientRect()
      const deltaY =
        priceBox.top +
        priceBox.height / 2 -
        (slotBox.top + slotBox.height / 2)
      if (Math.abs(deltaY) >= 0.5) {
        setOffsetY((y) => y + deltaY)
      }

      const cta = ctaRef.current
      if (!cta) return
      const box = cta.getBoundingClientRect()
      const edgeX = washEdgeXAtY(box.top + box.height / 2)
      if (edgeX == null) return

      // Grown size from layout width, not the already-scaled box — so a
      // return visit (scale already 1.5) matches first play.
      const scale = fitCtaToWash
        ? Math.min(timings.ctaGrowScale, ES_CTA_GROW_SCALE)
        : timings.ctaGrowScale
      setCtaScale((prev) => (Math.abs(prev - scale) >= 0.01 ? scale : prev))

      const grownWidth = cta.offsetWidth * scale
      const layoutCenter = box.left + box.width / 2 - offsetXRef.current
      const naturalLeft = layoutCenter - grownWidth / 2
      const preferredLeft = edgeX + CTA_WASH_INSET_PX
      const rightLimit = window.innerWidth - grownWidth - CTA_RIGHT_AIR_PX
      const floorLeft = edgeX + CTA_WASH_MIN_PX
      let targetLeft = Math.max(naturalLeft, preferredLeft)
      if (targetLeft > rightLimit) {
        targetLeft = fitCtaToWash
          ? rightLimit
          : Math.max(floorLeft, rightLimit)
      }
      const nextX = Math.max(0, targetLeft - naturalLeft)
      if (Math.abs(nextX - offsetXRef.current) >= 0.5) {
        offsetXRef.current = nextX
        setOffsetX(nextX)
      }
    }

    align()
    const observer = new ResizeObserver(align)
    observer.observe(pricing)
    observer.observe(slot)
    window.addEventListener('resize', align)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', align)
    }
  }, [beat, timings.ctaGrowScale, fitCtaToWash])

  return (
    <div
      className="relative px-4 py-5 sm:py-8 lg:absolute lg:inset-0 lg:px-5 lg:py-4"
      style={{ perspective: 1100, perspectiveOrigin: '50% 46%' }}
    >
      <div className="flex items-center justify-center lg:h-full">
        <div
          className="relative flex w-full max-w-[26rem] flex-col items-center px-2"
          style={{
            transformStyle: 'preserve-3d',
            transform: offsetY ? `translateY(${offsetY}px)` : undefined,
          }}
        >
          <div className="pointer-events-none relative mb-4 flex w-full justify-center sm:mb-7 lg:absolute lg:bottom-full lg:mb-8 lg:w-[26rem]">
            <AnimatePresence>
              {showPoints ? (
                <motion.div
                  key="finale-recap"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0 }}
                >
                  <FinaleRecap recap={recap} timings={timings} instant={instant} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div
            ref={ctaSlotRef}
            className="relative flex min-h-[5.25rem] w-full items-center justify-center"
          >
            <AnimatePresence>
              {showHeadline ? (
                <motion.h2
                  key="finale-headline"
                  className="font-display origin-center pointer-events-none absolute inset-x-0 mx-auto max-w-[22rem] px-1 text-center text-2xl leading-[1.28] tracking-tight text-gray-900 antialiased sm:max-w-[24rem] sm:text-3xl lg:text-[1.7rem] lg:leading-[1.25]"
                  initial={instant ? false : FINALE_FLY.hidden}
                  animate={FINALE_FLY.shown}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: timings.finaleTextOut / 1000,
                      ease: FADE_EASE,
                    },
                  }}
                  transition={{ duration: timings.finaleIn / 1000, ease: SMOOTH_EASE }}
                  style={{ backfaceVisibility: 'hidden' }}
                  transformTemplate={keepLayer}
                >
                  {threeSteps}
                </motion.h2>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showCta ? (
                <motion.div
                  key="finale-cta"
                  ref={ctaRef}
                  className="relative z-10 mx-auto w-full origin-center max-w-sm lg:w-auto lg:max-w-none"
                  initial={
                    skipCtaMotion
                      ? false
                      : { opacity: 0, scaleX: 1, scaleY: 1, x: 0 }
                  }
                  animate={{
                    opacity: 1,
                    scaleX: ctaScale,
                    scaleY: ctaScale,
                    x: offsetX,
                  }}
                  transition={
                    skipCtaMotion
                      ? { duration: 0 }
                      : {
                          x: { duration: 0 },
                          opacity: {
                            duration: timings.ctaIn / 1000,
                            ease: SMOOTH_EASE,
                          },
                          scaleX: {
                            duration: timings.ctaGrow / 1000,
                            delay:
                              (timings.ctaIn + timings.ctaGrowHold) / 1000,
                            ease: CTA_GROW_EASE,
                          },
                          scaleY: {
                            duration: timings.ctaGrow / 1000,
                            delay:
                              (timings.ctaIn + timings.ctaGrowHold) / 1000,
                            ease: CTA_GROW_EASE,
                          },
                        }
                  }
                  style={{ transformOrigin: '50% 50%' }}
                >
                  <SpectrumFlipCta
                    href={ctaHref}
                    className={cn(
                      'w-full whitespace-nowrap max-lg:px-6 max-lg:text-2xl lg:w-auto lg:shadow-[0_14px_28px_-8px_oklch(32%_0.08_310/0.5),0_6px_12px_-4px_rgba(28,12,48,0.28)]',
                      fitCtaToWash && 'lg:px-5 lg:text-sm'
                    )}
                  >
                    {ctaLabel}
                  </SpectrumFlipCta>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function IntroCinema({
  pose,
  howItWorks,
  threeSteps,
  timings,
}: {
  pose: IntroPose
  howItWorks: string
  threeSteps: string
  timings: IntroTimings
}) {
  const leaving = pose === 'exit'
  const glowThree = pose !== 'enter'
  const pieceIn = (index: number) => ({
    duration: timings.introIn / 1000,
    delay: (index * timings.introStagger) / 1000,
    ease: SMOOTH_EASE,
  })
  const threeGrowMs = timings.introGlowToExit + timings.introThreeOut
  const taglineTotal =
    timings.introTaglineTravel +
    timings.introTaglineHold +
    timings.introTaglineFade

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-visible px-4"
      style={{ perspective: 1100, perspectiveOrigin: '50% 42%' }}
    >
      <div
        className="origin-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="flex flex-col items-center px-2 text-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.p
            className="origin-center text-base font-bold tracking-[0.16em] uppercase text-primary-600 antialiased [backface-visibility:hidden] lg:text-sm"
            initial={INTRO_FLY.hidden}
            animate={
              leaving
                ? { ...INTRO_FLY.shown, opacity: 0, scale: 1.08 }
                : INTRO_FLY.shown
            }
            transition={
              leaving
                ? { duration: timings.introFade / 1000, ease: FADE_EASE }
                : pieceIn(0)
            }
            transformTemplate={keepLayer}
          >
            {howItWorks}
          </motion.p>
          <motion.p
            className="font-display relative origin-center mt-3 text-6xl font-semibold leading-none text-[oklch(68%_0.15_230)] antialiased lg:mt-3.5 lg:text-7xl lg:text-[oklch(58%_0.14_310)]"
            initial={{
              scale: INTRO_FLY.hidden.scale,
              rotateX: INTRO_FLY.hidden.rotateX,
              z: INTRO_FLY.hidden.z,
              transformPerspective: INTRO_FLY.hidden.transformPerspective,
            }}
            animate={
              leaving
                ? {
                    scale: 1.88,
                    rotateX: -11,
                    z: 150,
                    transformPerspective: 1100,
                  }
                : {
                    scale: INTRO_FLY.shown.scale,
                    rotateX: INTRO_FLY.shown.rotateX,
                    z: INTRO_FLY.shown.z,
                    transformPerspective: INTRO_FLY.shown.transformPerspective,
                  }
            }
            transition={
              leaving
                ? {
                    duration: timings.introThreeOut / 1000,
                    ease: EXIT_EASE,
                  }
                : pieceIn(1)
            }
            style={{ backfaceVisibility: 'hidden' }}
            transformTemplate={keepLayer}
          >
            <motion.span
              className="relative inline-block [backface-visibility:hidden]"
              initial={{ opacity: 0 }}
              animate={
                leaving
                  ? { opacity: [1, 1, 0] }
                  : { opacity: 1 }
              }
              transition={
                leaving
                  ? {
                      duration:
                        (timings.introThreeFadeDelay + timings.introThreeFade) /
                        1000,
                      times: [
                        0,
                        timings.introThreeFadeDelay /
                          (timings.introThreeFadeDelay + timings.introThreeFade),
                        1,
                      ],
                      ease: ['linear', [0.4, 0, 0.2, 1]],
                    }
                  : {
                      duration: timings.introIn / 1000,
                      delay: timings.introStagger / 1000,
                      ease: EASE,
                    }
              }
            >
              {glowThree ? (
                <>
                  <span className="hiw-intro-ripple" aria-hidden />
                  <span className="hiw-intro-ripple hiw-intro-ripple-b" aria-hidden />
                </>
              ) : null}
              <span
                className={
                  glowThree
                    ? 'hiw-intro-3-grow relative inline-block origin-center'
                    : 'relative inline-block origin-center'
                }
                style={
                  glowThree
                    ? { animationDuration: `${threeGrowMs / 1000}s` }
                    : undefined
                }
              >
                <span className={glowThree ? 'hiw-intro-3-neon' : undefined}>
                  3
                </span>
              </span>
            </motion.span>
          </motion.p>
          <motion.h2
            className="font-display origin-center mt-4 max-w-[22rem] px-1 text-xl leading-[1.3] tracking-tight text-gray-900 antialiased [backface-visibility:hidden] sm:text-2xl lg:mt-5 lg:text-xl lg:leading-[1.25]"
            initial={INTRO_FLY.hidden}
            animate={
              leaving
                ? {
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    z: 0,
                    transformPerspective: 1100,
                  }
                : INTRO_FLY.shown
            }
            transition={
              leaving ? { duration: 0 } : pieceIn(2)
            }
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: leaving ? 'flat' : undefined,
            }}
            transformTemplate={keepLayer}
          >
            <span className="hiw-tagline-slot">
              <span className="hiw-tagline-ghost" aria-hidden>
                {threeSteps}
              </span>
              <span
                className={
                  leaving ? 'hiw-tagline-live hiw-tagline-grow' : 'hiw-tagline-live'
                }
                style={
                  leaving
                    ? {
                        animationDelay: `${timings.introFollowDelay}ms`,
                        animationDuration: `${taglineTotal}ms`,
                      }
                    : undefined
                }
              >
                {threeSteps}
              </span>
            </span>
          </motion.h2>
        </div>
      </div>
    </div>
  )
}

type ProcessStep = {
  n: '1' | '2' | '3'
  label: string
  Icon: LucideIcon
}

function HiwStepView({
  step,
  pose,
  timings,
  processSteps,
  previewBeat,
  reviewBeat,
  dict,
  onPreviewBeat,
  onReviewBeat,
}: {
  step: StepNum
  pose: StepPose
  timings: IntroTimings
  processSteps: readonly ProcessStep[]
  previewBeat: PreviewBeat
  reviewBeat: ReviewBeat
  dict: Dictionary
  onPreviewBeat: (beat: PreviewBeat) => void
  onReviewBeat: (beat: ReviewBeat) => void
}) {
  const copy = processSteps[step - 1]!
  const enterMs =
    step === 1
      ? timings.step1Enter
      : step === 2
        ? timings.step2Enter
        : timings.enter

  return (
    <StepScene
      pose={pose}
      enterMs={enterMs}
      splitMs={timings.split}
      exitMs={step === 1 ? timings.step1Exit : step === 3 ? timings.step3Exit : timings.exit}
      glowMs={step === 1 ? timings.step1Glow : step === 2 ? timings.step2Glow : timings.step3Glow}
      pulseGlow={step === 1}
      artMs={step === 1 ? timings.step1Art : timings.split}
      headingHoldMs={timings.headingHold}
      headingFadeMs={timings.headingFade}
      captionLeadMs={step === 2 ? timings.step2CaptionLead : timings.captionLead}
      artDuringEnter={step === 2}
      artDelayMs={step === 2 ? timings.step2ArtDelay : 0}
      headingRestMs={step === 2 ? timings.headingHold : undefined}
      sinkExit={step === 3}
      preSinkAfterMs={
        step === 3 ? Math.round(timings.step3Screens * 0.84) : undefined
      }
      preSinkDurationMs={
        step === 3
          ? Math.round(timings.step3Screens * 0.16) + timings.step3Glow
          : undefined
      }
      staggeredExit={
        step === 1
          ? {
              settleMs: timings.step1CopySettle,
              holdMs: timings.step1CopyHold,
              fadeMs: timings.step1CopyFade,
              delayMs: timings.step1CopyDelay,
              artOutMs: timings.step1ArtOut,
              artFadeMs: timings.step1ArtFade,
            }
          : undefined
      }
      copy={<HiwStepCopy n={copy.n} label={copy.label} Icon={copy.Icon} />}
      caption={captionForStep(step, previewBeat, reviewBeat, dict, timings)}
      illustration={
        step === 1 ? (
          <HiwFormSketch
            playing={pose === 'play' || pose === 'glow' || pose === 'exit'}
            duration={timings.step1Play}
          />
        ) : step === 2 ? (
          <HiwLivePreviewSketch
            playing={pose === 'play' || pose === 'glow' || pose === 'exit'}
            duration={timings.step2Sketch}
            onBeat={onPreviewBeat}
          />
        ) : (
          <HiwStep3Cinema
            playing={pose === 'play' || pose === 'glow' || pose === 'exit'}
            reviewMs={timings.step3Review}
            captionGapMs={timings.step3CaptionGap}
            reviseMs={timings.step3Revise}
            houseMs={timings.step3House}
            screensMs={timings.step3Screens}
            onBeat={onReviewBeat}
          />
        )
      }
    />
  )
}

export function HowItWorksStage({
  started,
  instant,
  replayFinale = false,
  onCtaAppear,
}: HowItWorksStageProps) {
  const { dict, href, locale } = useLocale()
  const [phase, setPhase] = useState<CinemaPhase>(() =>
    instant || replayFinale
      ? { name: 'finale', beat: 'cta' }
      : { name: 'idle' }
  )
  const [timings, setTimings] = useState(() => scaleTimings(1))
  const [previewBeat, setPreviewBeat] = useState<PreviewBeat>('build')
  const [reviewBeat, setReviewBeat] = useState<ReviewBeat>('review')

  const processSteps = useMemo(
    () =>
      [
        { n: '1' as const, ...dict.landing.steps.introspect, Icon: ClipboardList },
        { n: '2' as const, ...dict.landing.steps.livePreview, Icon: Eye },
        { n: '3' as const, ...dict.landing.steps.workingWebsite, Icon: Globe2 },
      ] as const,
    [dict]
  )

  const handlePreviewBeat = useCallback((beat: PreviewBeat) => {
    setPreviewBeat(beat)
  }, [])

  const handleReviewBeat = useCallback((beat: ReviewBeat) => {
    setReviewBeat(beat)
  }, [])

  useEffect(() => {
    if (phase.name === 'finale' && phase.beat === 'cta') {
      onCtaAppear?.()
    }
  }, [phase, onCtaAppear])

  useEffect(() => {
    if (instant || replayFinale) {
      setPhase({ name: 'finale', beat: 'cta' })
      return
    }
    if (!started) return

    const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.55 : 1
    const t = scaleTimings(scale)
    setTimings(t)

    const timers: number[] = []
    let clock = 0
    const at = (delay: number, fn: () => void) => {
      clock += delay
      timers.push(window.setTimeout(fn, clock))
    }
    const atFromNow = (delay: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, clock + delay))
    }

    setPhase({ name: 'intro', pose: 'enter' })
    setPreviewBeat('build')
    setReviewBeat('review')
    at(t.introStagger + t.introIn, () => setPhase({ name: 'intro', pose: 'glow' }))
    at(t.introGlowToExit, () => setPhase({ name: 'intro', pose: 'exit' }))
    at(t.introHandoff, () =>
      setPhase({ name: 'step', step: 1, pose: 'split', introExit: true })
    )
    at(t.step1PlayLead, () =>
      setPhase({ name: 'step', step: 1, pose: 'play', introExit: true })
    )
    atFromNow(t.introOut - t.introHandoff - t.step1PlayLead, () =>
      setPhase({ name: 'step', step: 1, pose: 'play', introExit: false })
    )
    at(t.step1Play, () => setPhase({ name: 'step', step: 1, pose: 'glow' }))
    at(t.step1Glow, () => {
      setPreviewBeat('build')
      setPhase({ name: 'step', step: 2, pose: 'enter', outgoing: 1 })
    })
    at(t.step2Enter, () =>
      setPhase({ name: 'step', step: 2, pose: 'split', outgoing: 1 })
    )
    atFromNow(
      Math.max(0, Math.max(t.step1ArtOut, 960) - t.step2Enter),
      () => setPhase({ name: 'step', step: 2, pose: 'split' })
    )
    at(t.split, () => setPhase({ name: 'step', step: 2, pose: 'play' }))
    at(t.step2Play, () => setPhase({ name: 'step', step: 2, pose: 'glow' }))
    at(t.step2Glow, () => setPhase({ name: 'step', step: 2, pose: 'exit' }))
    at(t.exit, () => {
      setReviewBeat('review')
      setPhase({ name: 'step', step: 3, pose: 'enter' })
    })
    at(t.enter, () => setPhase({ name: 'step', step: 3, pose: 'split' }))
    at(t.split, () => setPhase({ name: 'step', step: 3, pose: 'play' }))
    at(t.step3Play, () => setPhase({ name: 'step', step: 3, pose: 'glow' }))
    at(t.step3Glow, () => setPhase({ name: 'step', step: 3, pose: 'exit' }))
    at(t.step3Exit, () => setPhase({ name: 'finale', beat: 'headline' }))
    at(t.finaleIn + t.finaleHeadlineHold, () =>
      setPhase({ name: 'finale', beat: 'points' })
    )
    at(
      t.finalePointsStagger * 2 + t.finalePointsIn + t.finalePointsHold,
      () => setPhase({ name: 'finale', beat: 'cta' })
    )

    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [started, instant, replayFinale])

  const stepCaption =
    phase.name === 'step'
      ? captionForStep(phase.step, previewBeat, reviewBeat, dict, timings)
      : null

  const stepPoses: Partial<Record<StepNum, StepPose>> =
    phase.name === 'step'
      ? {
          [phase.step]: phase.pose,
          ...(phase.outgoing && phase.outgoing !== phase.step
            ? { [phase.outgoing]: 'exit' as const }
            : {}),
        }
      : {}
  const overlapping = Boolean(phase.name === 'step' && phase.outgoing)

  const liveRegion =
    phase.name === 'intro'
      ? `${dict.landing.howItWorks}. ${dict.landing.threeSteps}`
      : phase.name === 'step' && stepCaption
        ? `${processSteps[phase.step - 1]!.label}. ${
            [stepCaption.text, stepCaption.suffix].filter(Boolean).join(' ')
          }`
        : phase.name === 'finale' && phase.beat === 'cta'
          ? `${processSteps.map((step) => step.label).join('. ')}. ${
              dict.landing.getFreePreview
            }`
          : phase.name === 'finale' && phase.beat === 'points'
            ? `${dict.landing.threeSteps}. ${processSteps
                .map((step) => step.label)
                .join('. ')}`
            : phase.name === 'finale'
              ? dict.landing.threeSteps
              : ''

  const showIntro =
    phase.name === 'intro' || (phase.name === 'step' && phase.introExit)
  const introPose: IntroPose =
    phase.name === 'intro' ? phase.pose : 'exit'

  return (
    <div className="relative flex min-h-[14rem] w-full flex-col items-center justify-center overflow-x-clip overflow-y-clip px-2 py-3 sm:min-h-[16rem] sm:px-3 lg:h-full lg:min-h-0 lg:overflow-visible lg:px-2 lg:py-1">
      <p className="sr-only" aria-live="polite">
        {liveRegion}
      </p>

      {showIntro ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          <IntroCinema
            pose={introPose}
            howItWorks={dict.landing.howItWorks}
            threeSteps={dict.landing.threeSteps}
            timings={timings}
          />
        </div>
      ) : null}

      {phase.name === 'step'
        ? ([1, 2, 3] as const).map((step) => {
            const pose = stepPoses[step]
            if (!pose) return null
            const incoming = overlapping && phase.step === step
            return (
              <div
                key={step}
                className={cn(
                  'w-full',
                  incoming && 'pointer-events-none absolute inset-0 z-[2]',
                  // Outgoing stays in normal flow on small screens so the form
                  // keeps the stage height. Never `relative` here: StepScene is
                  // `lg:absolute`, and a 0-height relative wrapper becomes its
                  // containing block — the form snaps to the bottom and clips.
                  overlapping && !incoming && 'lg:absolute lg:inset-0 lg:z-[1]'
                )}
              >
                <HiwStepView
                  step={step}
                  pose={pose}
                  timings={timings}
                  processSteps={processSteps}
                  previewBeat={previewBeat}
                  reviewBeat={reviewBeat}
                  dict={dict}
                  onPreviewBeat={handlePreviewBeat}
                  onReviewBeat={handleReviewBeat}
                />
              </div>
            )
          })
        : null}

      <AnimatePresence>
        {phase.name === 'finale' ? (
          <FinaleCinema
            key="finale"
            beat={phase.beat}
            threeSteps={dict.landing.threeSteps}
            recap={processSteps}
            ctaLabel={dict.landing.getFreePreview}
            ctaHref={href('/introspect')}
            timings={timings}
            instant={instant}
            replayFinale={replayFinale}
            fitCtaToWash={locale === 'es'}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function StepScene({
  pose,
  enterMs,
  splitMs,
  exitMs,
  glowMs,
  pulseGlow,
  artMs,
  headingHoldMs,
  headingFadeMs,
  captionLeadMs,
  artDuringEnter = false,
  artDelayMs = 0,
  headingRestMs,
  sinkExit,
  preSinkAfterMs,
  preSinkDurationMs,
  staggeredExit,
  copy,
  caption,
  illustration,
}: {
  pose: 'enter' | 'split' | 'play' | 'glow' | 'exit'
  enterMs: number
  splitMs: number
  exitMs: number
  glowMs: number
  pulseGlow?: boolean
  artMs: number
  headingHoldMs: number
  headingFadeMs: number
  captionLeadMs: number
  artDuringEnter?: boolean
  artDelayMs?: number
  /** After enter, wait this long before fading the heading. Defaults to split + hold. */
  headingRestMs?: number
  sinkExit?: boolean
  preSinkAfterMs?: number
  preSinkDurationMs?: number
  staggeredExit?: {
    settleMs: number
    holdMs: number
    fadeMs: number
    delayMs: number
    artOutMs: number
    artFadeMs: number
  }
  copy: ReactNode
  caption: HiwCaptionContent | null
  illustration: ReactNode
}) {
  const glowing = pose === 'glow' || pose === 'exit'
  const leaving = pose === 'exit'
  const arriving = pose === 'enter'
  const formExit = Boolean(staggeredExit) && leaving
  const sinking = Boolean(sinkExit) && leaving
  const sinkMs = exitMs
  const [headingOff, setHeadingOff] = useState(false)
  const [captionOn, setCaptionOn] = useState(false)
  const [captionPreSink, setCaptionPreSink] = useState(false)
  const [earlyArtOn, setEarlyArtOn] = useState(false)
  const showArt = pose !== 'enter' || earlyArtOn

  useEffect(() => {
    if (!artDuringEnter) {
      setEarlyArtOn(false)
      return
    }
    if (pose === 'exit') return
    if (pose !== 'enter') {
      setEarlyArtOn(true)
      return
    }
    const id = window.setTimeout(() => setEarlyArtOn(true), artDelayMs)
    return () => window.clearTimeout(id)
  }, [artDuringEnter, pose, artDelayMs])

  useEffect(() => {
    if (arriving) {
      setHeadingOff(false)
      setCaptionOn(false)
      return
    }
    if (leaving) return
    const restAt = headingRestMs ?? splitMs + headingHoldMs
    const headingTimer = window.setTimeout(() => setHeadingOff(true), restAt)
    const captionTimer = window.setTimeout(
      () => setCaptionOn(true),
      restAt + captionLeadMs
    )
    return () => {
      window.clearTimeout(headingTimer)
      window.clearTimeout(captionTimer)
    }
  }, [arriving, leaving, splitMs, headingHoldMs, headingRestMs, captionLeadMs])

  useEffect(() => {
    if (!sinkExit || !captionOn || caption?.placement !== 'screens') {
      setCaptionPreSink(false)
      return
    }
    if (pose === 'glow' || pose === 'exit') {
      setCaptionPreSink(true)
      return
    }
    if (preSinkAfterMs == null) return
    const id = window.setTimeout(() => setCaptionPreSink(true), preSinkAfterMs)
    return () => window.clearTimeout(id)
  }, [sinkExit, captionOn, caption?.placement, pose, preSinkAfterMs])

  const copyDuration =
    pose === 'enter' ? enterMs / 1000 : pose === 'exit' ? exitMs / 1000 : splitMs / 1000
  const headingTransition =
    headingOff && !leaving
      ? { duration: headingFadeMs / 1000, ease: FADE_EASE }
      : { duration: copyDuration, ease: SMOOTH_EASE }
  const artDuration = sinking
    ? sinkMs / 1000
    : leaving
      ? (staggeredExit?.artOutMs ?? artMs) / 1000
      : artMs / 1000
  const artFadeDuration = sinking
    ? SCREENS_SINK_FADE_S
    : leaving
      ? (staggeredExit?.artFadeMs ?? staggeredExit?.artOutMs ?? artMs) / 1000
      : artMs / 1000
  const artFadeDelay = sinking ? 0.02 : 0
  const pulseMs = glowMs + (staggeredExit?.artFadeMs ?? 0)
  const sketchCaption =
    caption?.placement === 'preview' || caption?.placement === 'phone'
      ? caption
      : null
  const stageCaption =
    caption && caption.placement !== 'preview' && caption.placement !== 'phone'
      ? caption
      : null

  return (
    <div className="relative flex flex-col items-center overflow-visible px-1 pt-3 pb-8 sm:px-2 sm:pt-4 lg:absolute lg:inset-0 lg:pt-2 lg:pb-0">
      <div className="relative z-[2] flex w-full shrink-0 justify-center lg:justify-start lg:pl-1">
        <div className="relative min-h-[2.85rem] w-full max-w-[22rem] overflow-visible sm:min-h-[3.1rem] lg:min-h-[3.4rem] lg:max-w-[24rem]">
          <motion.div
            className="mx-auto w-max origin-center will-change-transform [backface-visibility:hidden] lg:mx-0"
            initial={{ opacity: 0, x: SLIDE.copyIn, y: 92 }}
            animate={{
              opacity: headingOff || leaving ? 0 : 1,
              x: leaving && !formExit && !headingOff ? SLIDE.copyOut : 0,
              y: 0,
              scale: leaving && !formExit && !headingOff ? 0.96 : 1,
            }}
            exit={formExit || headingOff ? { opacity: 0 } : { opacity: 0, x: SLIDE.copyOut }}
            transition={headingTransition}
            transformTemplate={keepLayer}
          >
            {copy}
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[8] overflow-visible">
        <AnimatePresence>
          {captionOn && stageCaption ? (
            <HiwCaption
              key={stageCaption.placement}
              text={stageCaption.text}
              placement={stageCaption.placement}
              prefix={stageCaption.prefix}
              prefixDelayMs={stageCaption.prefixDelayMs}
              suffix={stageCaption.suffix}
              suffixDelayMs={stageCaption.suffixDelayMs}
              ellipsis={stageCaption.ellipsis}
              ellipsisDelayMs={stageCaption.ellipsisDelayMs}
              leaving={leaving || sinking}
              preSink={captionPreSink}
              leaveMs={sinkExit ? sinkMs : undefined}
              preSinkMs={preSinkDurationMs ?? glowMs}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showArt ? (
          <motion.div
            key="art"
            className="relative mt-3 flex w-full items-center justify-center will-change-transform [backface-visibility:hidden] sm:mt-4 lg:mt-5"
            initial={{ opacity: 0, x: SLIDE.artIn }}
            animate={{
              opacity: leaving || sinking ? 0 : 1,
              x: sinking ? 0 : leaving ? (formExit ? SLIDE.formOut : SLIDE.artIn) : 0,
              y: sinking ? SINK_Y : 0,
              scale: sinking ? 0.82 : 1,
            }}
            exit={{
              opacity: 0,
              x: sinking ? 0 : formExit ? SLIDE.formOut : SLIDE.artIn,
              y: sinking ? SINK_Y : 0,
              scale: sinking ? 0.82 : 1,
            }}
            transition={{
              duration: artDuration,
              ease: sinking ? SINK_EASE : SMOOTH_EASE,
              opacity: {
                duration: artFadeDuration,
                delay: artFadeDelay,
                ease: sinking ? SINK_FADE_EASE : FADE_EASE,
              },
            }}
            transformTemplate={keepLayer}
          >
            <div className="@container relative w-full overflow-visible">
              {glowing && pulseGlow ? (
                <span
                  className="hiw-glow-pulse"
                  style={{ animationDuration: `${pulseMs / 1000}s` }}
                  aria-hidden
                />
              ) : null}
              <div
                className={
                  glowing && !pulseGlow
                    ? 'hiw-glow-build relative z-[1] isolate w-full'
                    : 'relative z-[1] isolate w-full'
                }
                style={
                  glowing && !pulseGlow
                    ? { animationDuration: `${glowMs / 1000}s` }
                    : undefined
                }
                aria-hidden
              >
                {illustration}
              </div>
              <AnimatePresence>
                {captionOn && sketchCaption ? (
                  <HiwCaption
                    key={sketchCaption.placement}
                    text={sketchCaption.text}
                    placement={sketchCaption.placement}
                    leaving={leaving || sinking}
                    leaveMs={sinking ? sinkMs : undefined}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
