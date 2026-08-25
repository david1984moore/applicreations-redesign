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
  HOUSE_AND_THEN_DELAY_MS,
  HOUSE_ELLIPSIS_DELAY_MS,
  SCREENS_CAPTION_IN_DELAY_MS,
  SCREENS_SINK_FADE_S,
  usePhoneStage,
  type HiwCaptionContent,
} from '@/components/landing/hiw/HiwStepCopy'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { HiwFormSketch, hiwFormGlowAtMs } from '@/components/landing/hiw/HiwFormSketch'
import {
  HiwLivePreviewSketch,
  hiwStep2PlayMs,
  type PreviewBeat,
} from '@/components/landing/hiw/HiwDeviceSketch'
import {
  HiwStep3Cinema,
  hiwSwitchLiveAtMs,
  type ReviewBeat,
} from '@/components/landing/hiw/HiwReviewSketch'
import { washEdgeXAtY } from '@/components/landing/hiw/HiwPageWash'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { cn } from '@/lib/utils'

/** Spanish label is longer — keep the grown button inside the wash. */
const ES_CTA_GROW_SCALE = 1.18

const EASE = [0.22, 1, 0.36, 1] as const
const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const
const EXIT_EASE = [0.36, 0, 0.52, 0.22] as const
const FADE_EASE = [0.4, 0, 0.7, 1] as const
/** Screens drift down with the caption — keep moving, never ease to a stop. */
const SINK_EASE = [0.28, 0.06, 0.82, 0.52] as const
const SINK_FADE_EASE = [0.42, 0, 0.48, 1] as const
/** Start the sink, then fade while they are still traveling. */
const SCREENS_ART_FADE_DELAY_S = 0.42
const SINK_Y = 240
/** Fast rise from the vanishing point, soft land — graceful, not a snap. */
const CTA_GROW_EASE = [0.12, 0.84, 0.14, 1] as const
/** Arrive still moving — never ease to a stop at the readable pose. */
const FINALE_IN_EASE = [0.32, 0, 0.7, 0.88] as const
/** Slow recede while the line stays close enough to read. */
const FINALE_LINGER_EASE = [0.3, 0.12, 0.65, 0.85] as const
/** Pick up from the linger and whip into the vanishing point. */
const FINALE_AWAY_EASE = [0.45, 0.0, 0.88, 0.06] as const
/** Barely fade at first, then a little more as the linger ends. */
const FINALE_LINGER_FADE_EASE = [0.45, 0, 0.75, 0.4] as const
/** Whip the fade once the line starts leaving. */
const FINALE_AWAY_FADE_EASE = [0.42, 0.02, 0.86, 0.06] as const

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
  introFollowDelay: 780,
  introTaglineTravel: 700,
  introTaglineHold: 1380,
  introTaglineFade: 720,
  /** Keep intro mounted through the tagline fade. */
  introOut: 3580,
  introFade: 520,
  /** Form arrives during the tagline's end surge, after a longer on-screen hold. */
  introHandoff: 3260,
  /** Typing starts shortly after the form begins to appear. */
  step1PlayLead: 280,
  step1Enter: 1900,
  /** Point 3 slide-in — keep it quicker than the form, close to point 2. */
  enter: 1080,
  split: 1100,
  /** Form illustration eases in slower than other step art. */
  step1Art: 1600,
  /** Heading sits at rest, then fades as the caption takes its slot. */
  headingHold: 620,
  headingFade: 760,
  /** Points 2 and 3: brief settle, then a slow right drift. */
  headingDriftRest: 320,
  /** Gradual fade while the heading is still drifting. */
  headingDriftFade: 1080,
  /** Caption starts as the heading begins to leave — no empty-band gap. */
  captionLead: 40,
  /** Point 1 caption waits until the numeral is already lifting out. */
  step1CaptionLead: 520,
  /** Point 2 fades in over this window while point 1 is still leaving. */
  step2Enter: 1040,
  /** Crew slides in this long after point 2 starts moving. */
  step2ArtDelay: 180,
  /** “…we get to work” as the heading starts drifting, not late into it. */
  step2CaptionLead: 160,
  /** Fade starts after that line is already on. */
  step2HeadingFadeDelay: 1520,
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
  step1CopyHold: 560,
  step1CopyFade: 720,
  /** Form caption starts fading this long before step 2 enters. */
  step1CopyEarly: 260,
  /** House + laptop stay on this clock. Stage leaves sooner than this. */
  step2Sketch: 30000,
  /** Do not sit on the handset after the line lands. */
  step2Glow: 800,
  step3Review: 2300,
  /** Blank beat between table lines — a hair longer than the caption leave. */
  step3CaptionGap: 400,
  step3Revise: 1800,
  /** Point 3 heading fade — tighter than the shared heading fade. */
  step3HeadingFade: 500,
  /** Start “We review” as soon as the heading begins to leave. */
  step3CaptionLead: 40,
  /** Both characters at the house — Adjusting, Fine-tuning, then “… and then”. */
  step3House: 7550,
  /** “Adjusting” holds this long before it fades. */
  step3Adjust: 2050,
  /** “Fine-tuning” holds this long, then a gap, then the ellipsis beat. */
  step3Tune: 1900,
  /** Dots, then “and then”, then a short hold before the switch cut. */
  step3Finally: 2800,
  /** Flip, zap, hold the go-live line — then dissolve the man first. */
  step3Switch: 2600,
  /** Screens + “And you're in business!” — rest long enough to read. */
  step3Screens: 7200,
  /** Caption keeps drifting this long before opacity starts falling. */
  step3CaptionFloat: 2400,
  glow: 2200,
  /** Short rest after the live screens — fade while the line still has air. */
  step3Glow: 80,
  exit: 1100,
  /** Screens drift down while fading, then the finale takes the stage. */
  step3Exit: 2500,
  /** Headline comes from the viewer, lingers close enough to read, then recedes. */
  finaleIn: 1100,
  /** Stay near the viewer — still drifting and fading, not parked. */
  finaleHeadlineHold: 2200,
  finalePointsIn: 720,
  finalePointsStagger: 220,
  finalePointsHold: 1200,
  /** Whip into the distance while fading — then the button. */
  finaleTextOut: 620,
  /** Button fades in after the headline is gone. */
  ctaIn: 240,
  /** One fast grow from the vanishing point to the resting size. */
  ctaGrow: 320,
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

/** Finale tagline: near → readable → linger close → accelerate away. Never parks. */
const FINALE_FLY = {
  hidden: {
    opacity: 0,
    scale: 1.58,
    rotateX: 15,
    z: 80,
    transformPerspective: 1100,
  },
  /** Instant / replay rest — cinema never parks here. */
  rest: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    z: 0,
    transformPerspective: 1100,
  },
  /** Still traveling — readable, already heading away. */
  shown: {
    opacity: 1,
    scale: 1.18,
    rotateX: 7,
    z: 32,
    transformPerspective: 1100,
  },
  /** Still close — slow recede + slow fade so the line can be read. */
  linger: {
    opacity: 0.78,
    scale: 1.13,
    rotateX: 5,
    z: 24,
    transformPerspective: 1100,
  },
  /** Same far pocket the CTA fades in from. */
  away: {
    opacity: 0,
    scale: 0.38,
    rotateX: -8,
    z: -110,
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

/** Modest rightward drift — still moving when the heading fades. */
const HEADING_DRIFT_X = 26
const HEADING_DRIFT_S = 7.6
/** Point 1 lifts out of the caption slot instead of fading in place. */
const HEADING_VACATE_X = -10
const HEADING_VACATE_Y = -14
const HEADING_VACATE_PHONE_Y = -18

const STEP3_HEADING_FADE_BEATS: ReadonlySet<ReviewBeat> = new Set([
  'revise',
  'house',
  'houseGap',
  'fineTune',
  'andFinally',
  'switch',
  'screens',
])

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

/** Playback vs authored desktop clock — a touch faster than 1. */
const PLAYBACK = 0.88

function scaleTimings(viewportScale: number) {
  const scale = viewportScale * PLAYBACK
  const step3Switch = Math.max(
    Math.round(DESKTOP_MS.step3Switch * scale),
    hiwSwitchLiveAtMs() + 1400,
  )
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
    headingDriftRest: Math.round(DESKTOP_MS.headingDriftRest * scale),
    headingDriftFade: Math.round(DESKTOP_MS.headingDriftFade * scale),
    captionLead: Math.round(DESKTOP_MS.captionLead * scale),
    step1CaptionLead: Math.round(DESKTOP_MS.step1CaptionLead * scale),
    step2Enter: Math.round(DESKTOP_MS.step2Enter * scale),
    step2ArtDelay: Math.round(DESKTOP_MS.step2ArtDelay * scale),
    step2CaptionLead: Math.round(DESKTOP_MS.step2CaptionLead * scale),
    step2HeadingFadeDelay: Math.round(DESKTOP_MS.step2HeadingFadeDelay * scale),
    // Typing uses unscaled CHAR_MS, so glow must stay on that clock.
    step1Play: DESKTOP_MS.step1Play,
    step1Glow: Math.round(DESKTOP_MS.step1Glow * scale),
    step1ArtOut: Math.round(DESKTOP_MS.step1ArtOut * scale),
    step1ArtFade: Math.round(DESKTOP_MS.step1ArtFade * scale),
    step1CopyDelay: Math.round(DESKTOP_MS.step1CopyDelay * scale),
    step1CopySettle: Math.round(DESKTOP_MS.step1CopySettle * scale),
    step1CopyHold: Math.round(DESKTOP_MS.step1CopyHold * scale),
    step1CopyFade: Math.round(DESKTOP_MS.step1CopyFade * scale),
    step1CopyEarly: Math.round(DESKTOP_MS.step1CopyEarly * scale),
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
    step3HeadingFade: Math.round(DESKTOP_MS.step3HeadingFade * scale),
    step3CaptionLead: Math.round(DESKTOP_MS.step3CaptionLead * scale),
    step3Adjust: Math.round(DESKTOP_MS.step3Adjust * scale),
    step3Tune: Math.round(DESKTOP_MS.step3Tune * scale),
    step3Finally: Math.round(DESKTOP_MS.step3Finally * scale),
    step3House:
      Math.round(DESKTOP_MS.step3Adjust * scale) +
      Math.round(DESKTOP_MS.step3CaptionGap * scale) +
      Math.round(DESKTOP_MS.step3Tune * scale) +
      Math.round(DESKTOP_MS.step3CaptionGap * scale) +
      Math.round(DESKTOP_MS.step3Finally * scale),
    step3Switch,
    step3Screens: Math.round(DESKTOP_MS.step3Screens * scale),
    step3CaptionFloat: Math.round(DESKTOP_MS.step3CaptionFloat * scale),
    step3Play:
      Math.round(DESKTOP_MS.step3Review * scale) +
      Math.round(DESKTOP_MS.step3CaptionGap * scale) * 2 +
      Math.round(DESKTOP_MS.step3Revise * scale) +
      Math.round(DESKTOP_MS.step3House * scale) +
      step3Switch +
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
    ctaGrow: Math.round(DESKTOP_MS.ctaGrow * scale),
    ctaGrowScale: viewportScale >= 1 ? 1.52 : 1.18,
  }
}

type IntroTimings = ReturnType<typeof scaleTimings>

function finaleHeadlineTravelMs(t: IntroTimings) {
  return t.finaleIn + t.finaleHeadlineHold + t.finaleTextOut
}

function captionForStep(
  step: 1 | 2 | 3,
  previewBeat: PreviewBeat,
  reviewBeat: ReviewBeat,
  dict: Dictionary,
  switchMs: number,
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
    if (previewBeat === 'building') {
      return { text: copy.buildingPreview, placement: 'build' }
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
    return { text: copy.justRight, placement: 'house' }
  }
  if (reviewBeat === 'houseGap') {
    return null
  }
  if (reviewBeat === 'fineTune') {
    return { text: copy.justRightTune, placement: 'fineTune' }
  }
  if (reviewBeat === 'andFinally') {
    return {
      text: '',
      placement: 'andFinally',
      ellipsis: true,
      ellipsisDelayMs: HOUSE_ELLIPSIS_DELAY_MS,
      suffix: copy.justRightFinally,
      suffixDelayMs: HOUSE_AND_THEN_DELAY_MS,
    }
  }
  if (reviewBeat === 'switch') {
    return {
      text: copy.goLive,
      placement: 'switch',
      enterDelayMs: hiwSwitchLiveAtMs(switchMs),
    }
  }
  return {
    text: copy.suffix,
    placement: 'screens',
    enterDelayMs: SCREENS_CAPTION_IN_DELAY_MS,
  }
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
    <ul
      ref={listRef}
      className="relative flex w-max max-w-full flex-col items-start gap-2.5 sm:gap-3 lg:gap-2"
    >
      {recap.map((step, index) => (
        <motion.li
          key={step.n}
          className="flex items-center gap-3 antialiased [backface-visibility:hidden]"
          initial={
            instant
              ? false
              : { opacity: 0, x: fromX ?? 160 }
          }
          animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : fromX ?? 160 }}
          transition={{
            duration: ready ? pointsIn : 0,
            delay: ready && !instant ? index * pointsStagger : 0,
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
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-gray-900 whitespace-nowrap sm:text-xl lg:text-white">
            {step.label}
          </span>
        </motion.li>
      ))}
    </ul>
  )
}

/** Intro “3” — same face, weight, and cyan / purple as the opening numeral. */
function FinaleHeadlineMark({ rest }: { rest: string }) {
  return (
    <span className="max-w-[22rem] text-center sm:max-w-[24rem]">
      <span className="mr-[0.12em] inline-block origin-center align-[-0.18em] font-display text-[1.95em] font-semibold leading-none text-[oklch(68%_0.15_230)] lg:text-[oklch(58%_0.14_310)]">
        3
      </span>{' '}
      {rest}
    </span>
  )
}

function FinaleCinema({
  beat,
  threeSteps,
  threeStepsRest,
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
  threeStepsRest: string
  recap: readonly { n: string; label: string; Icon: LucideIcon }[]
  ctaLabel: string
  ctaHref: string
  timings: IntroTimings
  instant: boolean
  replayFinale: boolean
  /** Spanish label is longer — grow only as far as the purple wash allows. */
  fitCtaToWash?: boolean
}) {
  const playingFinale = !(instant || replayFinale)
  const showHeadline = playingFinale || beat !== 'cta'
  const showPoints = beat === 'points' || beat === 'cta'
  const showCta = beat === 'cta'
  const skipCtaMotion = instant || replayFinale
  const targetCtaScale = fitCtaToWash
    ? Math.min(timings.ctaGrowScale, ES_CTA_GROW_SCALE)
    : timings.ctaGrowScale
  const headlineTravelMs = finaleHeadlineTravelMs(timings)
  const arriveAt = timings.finaleIn / headlineTravelMs
  const lingerAt =
    (timings.finaleIn + timings.finaleHeadlineHold) / headlineTravelMs
  const headlineAnimate = useMemo(
    () =>
      instant
        ? FINALE_FLY.rest
        : {
            opacity: [
              FINALE_FLY.hidden.opacity,
              FINALE_FLY.shown.opacity,
              FINALE_FLY.linger.opacity,
              FINALE_FLY.away.opacity,
            ],
            scale: [
              FINALE_FLY.hidden.scale,
              FINALE_FLY.shown.scale,
              FINALE_FLY.linger.scale,
              FINALE_FLY.away.scale,
            ],
            rotateX: [
              FINALE_FLY.hidden.rotateX,
              FINALE_FLY.shown.rotateX,
              FINALE_FLY.linger.rotateX,
              FINALE_FLY.away.rotateX,
            ],
            z: [
              FINALE_FLY.hidden.z,
              FINALE_FLY.shown.z,
              FINALE_FLY.linger.z,
              FINALE_FLY.away.z,
            ],
            transformPerspective: 1100,
          },
    [instant]
  )
  const headlineTransition = useMemo(
    () =>
      instant
        ? { duration: 0 }
        : {
            duration: headlineTravelMs / 1000,
            times: [0, arriveAt, lingerAt, 1],
            ease: [FINALE_IN_EASE, FINALE_LINGER_EASE, FINALE_AWAY_EASE],
            opacity: {
              duration: headlineTravelMs / 1000,
              times: [0, arriveAt, lingerAt, 1],
              ease: [
                'easeOut',
                FINALE_LINGER_FADE_EASE,
                FINALE_AWAY_FADE_EASE,
              ] as const,
            },
          },
    [instant, headlineTravelMs, arriveAt, lingerAt]
  )
  const stageRef = useRef<HTMLDivElement>(null)
  const ctaSlotRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const offsetXRef = useRef(0)
  const [ctaTopPx, setCtaTopPx] = useState<number | null>(null)
  const [offsetX, setOffsetX] = useState(0)
  // Start at the grown size so the first CTA frame never jumps 1 → 1.5.
  const [ctaScale, setCtaScale] = useState(targetCtaScale)
  const [ctaAligned, setCtaAligned] = useState(skipCtaMotion)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const slot = ctaSlotRef.current
    const pricing = document.getElementById('pricing')
    if (!stage || !slot || !pricing) return

    const align = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        offsetXRef.current = 0
        setCtaTopPx(null)
        setOffsetX(0)
        setCtaScale(1)
        setCtaAligned(true)
        return
      }

      const stageBox = stage.getBoundingClientRect()
      const priceBox = pricing.getBoundingClientRect()
      const slotHeight = Math.max(slot.offsetHeight, 84)
      const priceCenter = priceBox.top + priceBox.height / 2
      const rawTop = priceCenter - stageBox.top - slotHeight / 2
      const maxTop = Math.max(stageBox.height - slotHeight - 12, 12)
      const nextTop = Math.max(12, Math.min(rawTop, maxTop))
      setCtaTopPx((prev) =>
        prev != null && Math.abs(prev - nextTop) < 0.5 ? prev : nextTop
      )

      const scale = fitCtaToWash
        ? Math.min(timings.ctaGrowScale, ES_CTA_GROW_SCALE)
        : timings.ctaGrowScale
      setCtaScale((prev) => (Math.abs(prev - scale) >= 0.01 ? scale : prev))

      // Prefer the live CTA; otherwise measure an invisible twin so
      // offsetX is already correct for the headline, then the button.
      const cta = ctaRef.current ?? measureRef.current
      if (!cta) return
      const box = cta.getBoundingClientRect()
      const midY = box.top + box.height / 2
      const edgeX = washEdgeXAtY(midY)
      if (edgeX == null) return

      // Grown size from layout width, not the already-scaled box — so a
      // return visit (scale already 1.5) matches first play.
      const grownWidth = cta.offsetWidth * scale
      const layoutCenter = box.left + box.width / 2 - offsetXRef.current
      const naturalLeft = layoutCenter - grownWidth / 2
      // Center in the purple band: equal air from the wash edge and the
      // right of the screen. Vertical seat (ctaTopPx) stays put.
      const targetLeft = edgeX + (window.innerWidth - edgeX - grownWidth) / 2
      const nextX = targetLeft - naturalLeft
      if (Math.abs(nextX - offsetXRef.current) >= 0.5) {
        offsetXRef.current = nextX
        setOffsetX(nextX)
      }
      setCtaAligned(true)
    }

    align()
    const observer = new ResizeObserver(align)
    observer.observe(pricing)
    observer.observe(slot)
    observer.observe(stage)
    window.addEventListener('resize', align)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', align)
    }
  }, [beat, timings.ctaGrowScale, fitCtaToWash, showCta, skipCtaMotion])

  return (
    <div
      ref={stageRef}
      className="relative w-full px-4 py-5 sm:py-8 lg:absolute lg:inset-0 lg:px-0 lg:py-0"
      style={{ perspective: 1100, perspectiveOrigin: '50% 46%' }}
    >
      {/* Recap + CTA share one column so the button stays centered under the points. */}
      <div
        className={cn(
          'relative flex w-full shrink-0 justify-center px-2',
          'lg:absolute lg:left-0 lg:right-0 lg:px-5'
        )}
        style={
          ctaTopPx != null
            ? { top: ctaTopPx, transformStyle: 'preserve-3d' }
            : { transformStyle: 'preserve-3d' }
        }
      >
        <div
          className="relative flex w-full max-w-[26rem] flex-col items-center"
          style={{
            ...(offsetX ? { left: offsetX } : {}),
            // Same idea as the CTA: don't paint the headline at x:0, then
            // snap it into the wash. Hold until the first layout measure.
            visibility:
              skipCtaMotion || ctaAligned ? 'visible' : 'hidden',
          }}
        >
          {showPoints ? (
            <div className="pointer-events-none relative mb-5 flex w-max justify-center sm:mb-6 lg:absolute lg:bottom-full lg:left-1/2 lg:mb-0 lg:pb-5 lg:-translate-x-1/2">
              <FinaleRecap recap={recap} timings={timings} instant={instant} />
            </div>
          ) : null}

          <div
            ref={ctaSlotRef}
            className="relative flex min-h-[5.25rem] w-full items-center justify-center"
          >
          {/* In-flow width lock — the live headline is absolute, so without
              this the slot collapses. CTA is overlaid (absolute) so it never
              sits beside this spacer and shoves the button off-center. */}
          <span
            aria-hidden
            className="invisible font-display max-w-[22rem] px-1 text-center text-2xl leading-[1.28] tracking-tight sm:max-w-[24rem] sm:text-3xl lg:text-[1.7rem] lg:leading-[1.25]"
          >
            <FinaleHeadlineMark rest={threeStepsRest} />
          </span>
          <AnimatePresence>
            {showHeadline ? (
              <motion.h2
                key="finale-headline"
                className="font-display origin-center pointer-events-none absolute inset-0 flex items-center justify-center px-1 text-center text-2xl leading-[1.28] tracking-tight text-gray-900 antialiased sm:text-3xl lg:text-[1.7rem] lg:leading-[1.25]"
                initial={instant ? false : FINALE_FLY.hidden}
                animate={headlineAnimate}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={headlineTransition}
                style={{
                  backfaceVisibility: 'hidden',
                  willChange:
                    playingFinale && beat !== 'cta'
                      ? 'transform, opacity'
                      : undefined,
                }}
                transformTemplate={keepLayer}
                aria-hidden={showCta || undefined}
                aria-label={showCta ? undefined : threeSteps}
              >
                <FinaleHeadlineMark rest={threeStepsRest} />
              </motion.h2>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showCta ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <motion.div
                  key="finale-cta"
                  ref={ctaRef}
                  className="w-full origin-center max-w-sm [backface-visibility:hidden] lg:w-auto lg:max-w-none"
                  initial={
                    skipCtaMotion
                      ? false
                      : FINALE_FLY.away
                  }
                  animate={{
                    opacity: 1,
                    scale: ctaScale,
                    rotateX: 0,
                    z: 0,
                    transformPerspective: 1100,
                  }}
                  transition={
                    skipCtaMotion
                      ? { duration: 0 }
                      : {
                          opacity: {
                            duration: timings.ctaIn / 1000,
                            ease: SMOOTH_EASE,
                          },
                          scale: {
                            duration: timings.ctaGrow / 1000,
                            ease: CTA_GROW_EASE,
                          },
                          rotateX: {
                            duration: timings.ctaGrow / 1000,
                            ease: CTA_GROW_EASE,
                          },
                          z: {
                            duration: timings.ctaGrow / 1000,
                            ease: CTA_GROW_EASE,
                          },
                        }
                  }
                  style={{
                    transformOrigin: '50% 50%',
                    // Hold invisible until wash offset is known — avoids a
                    // first-frame flash at x:0 then a jump into place.
                    visibility:
                      skipCtaMotion || ctaAligned ? 'visible' : 'hidden',
                  }}
                  transformTemplate={keepLayer}
                >
                  <SpectrumFlipCta
                    href={ctaHref}
                    className={cn(
                      'w-full whitespace-nowrap rounded-full max-lg:px-7 max-lg:py-4 max-lg:text-2xl max-lg:shadow-[0_10px_22px_-6px_rgba(20,50,90,0.38),0_4px_10px_-3px_rgba(20,50,90,0.22)] lg:w-auto lg:rounded-full lg:px-8 lg:py-3.5 lg:text-lg lg:shadow-[0_14px_28px_-8px_oklch(32%_0.08_310/0.5),0_6px_12px_-4px_rgba(28,12,48,0.28)]',
                      fitCtaToWash && 'lg:px-6 lg:text-base'
                    )}
                  >
                    {ctaLabel}
                  </SpectrumFlipCta>
                </motion.div>
              </div>
            ) : (
              // Invisible twin from the first finale frame so the headline
              // arrives already wash-aligned — not at x:0, then a jump right.
              <div
                ref={measureRef}
                aria-hidden
                className="pointer-events-none invisible absolute inset-0 z-0 flex items-center justify-center"
              >
                <div className="w-full max-w-sm lg:w-auto lg:max-w-none">
                  <SpectrumFlipCta
                    className={cn(
                      'w-full whitespace-nowrap rounded-full max-lg:px-7 max-lg:py-4 max-lg:text-2xl lg:w-auto lg:rounded-full lg:px-8 lg:py-3.5 lg:text-lg',
                      fitCtaToWash && 'lg:px-6 lg:text-base'
                    )}
                  >
                    {ctaLabel}
                  </SpectrumFlipCta>
                </div>
              </div>
            )}
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
  const phoneStage = usePhoneStage()
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
            className="font-display relative origin-center mt-3 text-5xl font-semibold leading-none text-[oklch(68%_0.15_230)] antialiased sm:text-6xl lg:mt-3.5 lg:text-7xl lg:text-[oklch(58%_0.14_310)]"
            initial={{
              scale: INTRO_FLY.hidden.scale,
              rotateX: INTRO_FLY.hidden.rotateX,
              z: INTRO_FLY.hidden.z,
              transformPerspective: INTRO_FLY.hidden.transformPerspective,
            }}
            animate={
              leaving
                ? {
                    scale: phoneStage ? 1.22 : 1.88,
                    rotateX: phoneStage ? -6 : -11,
                    z: phoneStage ? 36 : 150,
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
            className="font-display origin-center mt-4 w-[min(20.5rem,calc(100vw-3.25rem))] px-3 text-[1.2rem] leading-[1.35] tracking-tight text-gray-900 antialiased [backface-visibility:hidden] sm:text-2xl lg:mt-5 lg:w-auto lg:max-w-[22rem] lg:px-1 lg:text-xl lg:leading-[1.25]"
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
      headingFadeMs={
        step === 2 || step === 3
          ? timings.headingDriftFade
          : timings.headingFade
      }
      captionLeadMs={
        step === 1
          ? timings.step1CaptionLead
          : step === 2
            ? timings.step2CaptionLead
            : timings.step3CaptionLead
      }
      headingVacate={step === 1}
      artDuringEnter={step === 2}
      artDelayMs={step === 2 ? timings.step2ArtDelay : 0}
      captionDuringEnter={step === 2}
      headingRestMs={
        step === 2 || step === 3 ? timings.headingDriftRest : undefined
      }
      headingDrift={step === 2 || step === 3}
      headingFadeDelayMs={
        step === 2 ? timings.step2HeadingFadeDelay : undefined
      }
      headingFadeOn={
        step === 3 ? STEP3_HEADING_FADE_BEATS.has(reviewBeat) : undefined
      }
      sinkExit={step === 3}
      preSinkAfterMs={
        step === 3
          ? Math.max(0, timings.step3Screens - timings.step3CaptionFloat)
          : undefined
      }
      preSinkDurationMs={
        step === 3
          ? timings.step3CaptionFloat + timings.step3Glow
          : undefined
      }
      staggeredExit={
        step === 1
          ? {
              settleMs: timings.step1CopySettle,
              holdMs: timings.step1CopyHold,
              fadeMs: timings.step1CopyFade,
              delayMs: timings.step1CopyDelay,
              copyEarlyMs: timings.step1CopyEarly,
              artOutMs: timings.step1ArtOut,
              artFadeMs: timings.step1ArtFade,
            }
          : undefined
      }
      copy={<HiwStepCopy n={copy.n} label={copy.label} Icon={copy.Icon} />}
      caption={captionForStep(step, previewBeat, reviewBeat, dict, timings.step3Switch)}
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
            adjustMs={timings.step3Adjust}
            tuneMs={timings.step3Tune}
            finallyMs={timings.step3Finally}
            switchMs={timings.step3Switch}
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
  const { href, locale } = useLocale()
  const dict = getDictionary(locale)
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

  const recapSteps = useMemo(
    () =>
      processSteps.map((step) =>
        step.n === '3'
          ? { ...step, label: dict.landing.steps.workingWebsite.recapLabel }
          : step
      ),
    [processSteps, dict]
  )

  const handlePreviewBeat = useCallback((beat: PreviewBeat) => {
    setPreviewBeat(beat)
  }, [])

  const handleReviewBeat = useCallback((beat: ReviewBeat) => {
    setReviewBeat(beat)
  }, [])

  const hiwDebug =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('hiw')
      : null

  useEffect(() => {
    if (phase.name === 'finale' && phase.beat === 'cta') {
      onCtaAppear?.()
    }
  }, [phase, onCtaAppear])

  useEffect(() => {
    if (hiwDebug === 'build') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = {
        ...scaleTimings(scale),
        step2Sketch: 120000,
      }
      setTimings(t)
      setPreviewBeat('building')
      setPhase({ name: 'step', step: 2, pose: 'play' })
      return
    }
    if (hiwDebug === 'review') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      setTimings(scaleTimings(scale))
      setReviewBeat('review')
      setPhase({ name: 'step', step: 3, pose: 'play' })
      return
    }
    if (hiwDebug === 'house') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = {
        ...scaleTimings(scale),
        step3Review: 0,
        step3CaptionGap: 0,
        step3Revise: 0,
        step3Adjust: 120000,
        step3House: 120000,
      }
      setTimings(t)
      setReviewBeat('house')
      setPhase({ name: 'step', step: 3, pose: 'play' })
      return
    }
    if (hiwDebug === 'tune') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = {
        ...scaleTimings(scale),
        step3Review: 0,
        step3CaptionGap: 0,
        step3Revise: 0,
        step3Adjust: 0,
        step3Tune: 120000,
        step3House: 120000,
      }
      setTimings(t)
      setReviewBeat('fineTune')
      setPhase({ name: 'step', step: 3, pose: 'play' })
      return
    }
    if (hiwDebug === 'finally') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = {
        ...scaleTimings(scale),
        step3Review: 0,
        step3CaptionGap: 0,
        step3Revise: 0,
        step3Adjust: 0,
        step3Tune: 0,
        step3Finally: 120000,
        step3House: 120000,
      }
      setTimings(t)
      setReviewBeat('andFinally')
      setPhase({ name: 'step', step: 3, pose: 'play' })
      return
    }
    if (hiwDebug === 'switch') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = {
        ...scaleTimings(scale),
        step3Review: 0,
        step3CaptionGap: 0,
        step3Revise: 0,
        step3House: 0,
        step3Adjust: 0,
        step3Tune: 0,
        step3Finally: 0,
        step3Switch: 120000,
      }
      setTimings(t)
      setReviewBeat('switch')
      setPhase({ name: 'step', step: 3, pose: 'play' })
      return
    }
    if (hiwDebug === 'screens') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = scaleTimings(scale)
      setTimings({
        ...t,
        step3Review: 0,
        step3CaptionGap: 0,
        step3Revise: 0,
        step3House: 0,
        step3Adjust: 0,
        step3Tune: 0,
        step3Finally: 0,
        step3Switch: 0,
        step3Play: t.step3Screens,
      })
      setReviewBeat('screens')
      setPhase({ name: 'step', step: 3, pose: 'play' })
      const timers: number[] = []
      let clock = 0
      const at = (delay: number, fn: () => void) => {
        clock += delay
        timers.push(window.setTimeout(fn, clock))
      }
      at(t.step3Screens, () => setPhase({ name: 'step', step: 3, pose: 'glow' }))
      at(t.step3Glow, () => setPhase({ name: 'step', step: 3, pose: 'exit' }))
      at(t.step3Exit, () => setPhase({ name: 'finale', beat: 'headline' }))
      at(t.finaleIn, () => setPhase({ name: 'finale', beat: 'points' }))
      at(t.finaleHeadlineHold, () => onCtaAppear?.())
      at(t.finaleTextOut, () => setPhase({ name: 'finale', beat: 'cta' }))
      return () => {
        for (const id of timers) window.clearTimeout(id)
      }
    }
    if (hiwDebug === 'headline') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      setTimings(scaleTimings(scale))
      setPhase({ name: 'finale', beat: 'headline' })
      return
    }
    if (hiwDebug === 'finale') {
      const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
      const t = scaleTimings(scale)
      setTimings(t)
      setPhase({ name: 'finale', beat: 'headline' })
      const timers: number[] = []
      let clock = 0
      const at = (delay: number, fn: () => void) => {
        clock += delay
        timers.push(window.setTimeout(fn, clock))
      }
      at(t.finaleIn, () => setPhase({ name: 'finale', beat: 'points' }))
      at(t.finaleHeadlineHold, () => onCtaAppear?.())
      at(t.finaleTextOut, () => setPhase({ name: 'finale', beat: 'cta' }))
      return () => {
        for (const id of timers) window.clearTimeout(id)
      }
    }
    if (instant || replayFinale) {
      setPhase({ name: 'finale', beat: 'cta' })
      return
    }
    if (!started) return

    const scale = window.matchMedia('(max-width: 1023px)').matches ? 0.68 : 1
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
    at(t.finaleIn, () => setPhase({ name: 'finale', beat: 'points' }))
    at(t.finaleHeadlineHold, () => onCtaAppear?.())
    at(t.finaleTextOut, () => setPhase({ name: 'finale', beat: 'cta' }))

    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [started, instant, replayFinale, hiwDebug, onCtaAppear])

  const stepCaption =
    phase.name === 'step'
      ? captionForStep(phase.step, previewBeat, reviewBeat, dict, timings.step3Switch)
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
          ? `${recapSteps.map((step) => step.label).join('. ')}. ${
              dict.landing.getFreePreview
            }`
          : phase.name === 'finale' && phase.beat === 'points'
            ? `${dict.landing.threeSteps}. ${recapSteps
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
    <div className="relative flex w-full flex-col items-center justify-start overflow-visible px-2 py-2 max-lg:min-h-[24rem] max-lg:[overflow-anchor:none] sm:px-3 lg:h-full lg:min-h-0 lg:justify-center lg:overflow-visible lg:px-2 lg:py-1">
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
                  // Phone: every point is pinned so a fade/unmount cannot
                  // change stage height. Never `relative` here: StepScene is
                  // `lg:absolute`, and a 0-height relative wrapper becomes its
                  // containing block — the form snaps to the bottom and clips.
                  'w-full max-lg:absolute max-lg:inset-0',
                  incoming && 'pointer-events-none z-[2]',
                  overlapping && !incoming && 'z-[1] lg:absolute lg:inset-0 lg:z-[1]'
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
            threeStepsRest={dict.landing.threeStepsRest}
            recap={recapSteps}
            ctaLabel={dict.landing.getFreePreview}
            ctaHref={href('/introspect')}
            timings={timings}
            instant={instant || hiwDebug === 'headline'}
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
  captionDuringEnter = false,
  headingRestMs,
  headingDrift = false,
  headingVacate = false,
  headingFadeDelayMs = 0,
  headingFadeOn,
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
  /** Point 2 copy can start while the heading is still arriving. */
  captionDuringEnter?: boolean
  /** After enter, wait this long before fading the heading. Defaults to split + hold. */
  headingRestMs?: number
  /** Points 2 and 3 — keep the heading up and ease it right. */
  headingDrift?: boolean
  /** Point 1 — lift the heading out of the caption slot as it fades. */
  headingVacate?: boolean
  /** Extra hold after rest before the heading fade. Ignored when fade is signaled. */
  headingFadeDelayMs?: number
  /** When set, fade the heading on this signal instead of the rest timer. */
  headingFadeOn?: boolean
  sinkExit?: boolean
  preSinkAfterMs?: number
  preSinkDurationMs?: number
  staggeredExit?: {
    settleMs: number
    holdMs: number
    fadeMs: number
    delayMs: number
    copyEarlyMs: number
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
  const [headingDrifting, setHeadingDrifting] = useState(false)
  const [captionOn, setCaptionOn] = useState(false)
  const fadeBySignal = headingFadeOn != null
  const [captionPreSink, setCaptionPreSink] = useState(false)
  const [captionEarlyLeave, setCaptionEarlyLeave] = useState(false)
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
    if (leaving) return
    if (arriving) {
      setHeadingOff(false)
      setHeadingDrifting(false)
      setCaptionOn(false)
      if (!captionDuringEnter) return
      const captionTimer = window.setTimeout(
        () => setCaptionOn(true),
        Math.max(0, artDelayMs + captionLeadMs)
      )
      return () => window.clearTimeout(captionTimer)
    }
    const restAt = headingRestMs ?? splitMs + headingHoldMs
    const driftTimer = headingDrift
      ? window.setTimeout(() => setHeadingDrifting(true), restAt)
      : 0
    const headingTimer = fadeBySignal
      ? 0
      : window.setTimeout(
          () => setHeadingOff(true),
          restAt + headingFadeDelayMs
        )
    const captionTimer = window.setTimeout(
      () => setCaptionOn(true),
      restAt + captionLeadMs
    )
    return () => {
      if (driftTimer) window.clearTimeout(driftTimer)
      if (headingTimer) window.clearTimeout(headingTimer)
      window.clearTimeout(captionTimer)
    }
  }, [
    arriving,
    leaving,
    splitMs,
    headingHoldMs,
    headingRestMs,
    captionLeadMs,
    captionDuringEnter,
    artDelayMs,
    headingDrift,
    headingFadeDelayMs,
    fadeBySignal,
  ])

  useEffect(() => {
    if (headingFadeOn) setHeadingOff(true)
  }, [headingFadeOn])

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

  useEffect(() => {
    if (!staggeredExit || caption?.placement !== 'form') {
      setCaptionEarlyLeave(false)
      return
    }
    if (pose === 'exit') {
      setCaptionEarlyLeave(true)
      return
    }
    if (pose !== 'glow') {
      setCaptionEarlyLeave(false)
      return
    }
    const leadMs = Math.max(0, glowMs - staggeredExit.copyEarlyMs)
    const id = window.setTimeout(() => setCaptionEarlyLeave(true), leadMs)
    return () => window.clearTimeout(id)
  }, [staggeredExit, caption?.placement, pose, glowMs])

  const copyDuration =
    pose === 'enter' ? enterMs / 1000 : pose === 'exit' ? exitMs / 1000 : splitMs / 1000
  const headingSliding = headingDrift && (headingDrifting || headingOff) && !leaving
  const headingVacating = headingVacate && headingOff && !leaving
  const headingFadeS = headingFadeMs / 1000
  const headingTransition =
    headingSliding
      ? {
          opacity: { duration: headingFadeS, ease: FADE_EASE },
          x: { duration: HEADING_DRIFT_S, ease: SMOOTH_EASE },
          y: { duration: copyDuration, ease: SMOOTH_EASE },
          scale: { duration: headingFadeS, ease: FADE_EASE },
        }
      : headingVacating
        ? {
            opacity: { duration: headingFadeS, ease: EASE },
            x: { duration: headingFadeS, ease: EASE },
            y: { duration: headingFadeS, ease: EASE },
            scale: { duration: headingFadeS, ease: EASE },
          }
        : headingOff && !leaving
          ? { duration: headingFadeS, ease: FADE_EASE }
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
  const artFadeDelay = sinking ? SCREENS_ART_FADE_DELAY_S : 0
  const pulseMs = glowMs + (staggeredExit?.artFadeMs ?? 0)
  const phoneStage = usePhoneStage()
  const isPhoneCaption = caption?.placement === 'phone'
  const isPreviewCaption = caption?.placement === 'preview'
  const isBuildCaption = caption?.placement === 'build'
  const isTableCaption =
    caption?.placement === 'review' || caption?.placement === 'revise'
  const isHouseCaption =
    caption?.placement === 'house' ||
    caption?.placement === 'fineTune' ||
    caption?.placement === 'andFinally'
  const phoneSketchCaption =
    isPhoneCaption || (!phoneStage && isPreviewCaption) ? caption : null
  const artCaption =
    isHouseCaption ||
    isBuildCaption ||
    (phoneStage && isTableCaption)
      ? caption
      : null
  const flowCaption =
    phoneStage &&
    caption &&
    !isPhoneCaption &&
    !isHouseCaption &&
    !isBuildCaption &&
    !isTableCaption
      ? caption
      : null
  const overlayCaption =
    !phoneStage &&
    caption &&
    !isPhoneCaption &&
    !isPreviewCaption &&
    !isHouseCaption &&
    !isBuildCaption
      ? caption
      : null
  const captionLeaving = leaving || sinking || captionEarlyLeave

  return (
    <div className="relative flex flex-col items-center overflow-visible px-1 pt-2 pb-2 sm:px-2 sm:pt-4 lg:absolute lg:inset-0 lg:pt-2 lg:pb-0">
      <div className="relative z-[2] flex w-full shrink-0 justify-center lg:justify-start lg:pl-1">
        <div className="relative w-full max-w-[22rem] overflow-visible min-h-[2.85rem] max-lg:h-[3.75rem] sm:min-h-[3.1rem] lg:max-w-[24rem] lg:min-h-[3.4rem]">
          <div className="max-lg:absolute max-lg:inset-0 max-lg:flex max-lg:items-center max-lg:justify-center">
            <motion.div
              className="mx-auto w-max origin-center will-change-transform [backface-visibility:hidden] lg:mx-0"
              initial={{ opacity: 0, x: SLIDE.copyIn, y: 92 }}
              animate={{
                opacity: headingOff || leaving ? 0 : 1,
                x:
                  leaving && !formExit && !headingOff
                    ? SLIDE.copyOut
                    : headingSliding
                      ? HEADING_DRIFT_X
                      : headingVacating
                        ? phoneStage
                          ? 0
                          : HEADING_VACATE_X
                        : 0,
                y: headingVacating
                  ? phoneStage
                    ? HEADING_VACATE_PHONE_Y
                    : HEADING_VACATE_Y
                  : 0,
                scale: leaving && !formExit && !headingOff ? 0.96 : 1,
              }}
              exit={formExit || headingOff ? { opacity: 0 } : { opacity: 0, x: SLIDE.copyOut }}
              transition={headingTransition}
              transformTemplate={keepLayer}
            >
              {copy}
            </motion.div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center lg:hidden">
            <AnimatePresence initial={false}>
              {captionOn && flowCaption ? (
                <HiwCaption
                  key={`${flowCaption.placement}-${flowCaption.text}`}
                  text={flowCaption.text}
                  placement={flowCaption.placement}
                  prefix={flowCaption.prefix}
                  prefixDelayMs={flowCaption.prefixDelayMs}
                  suffix={flowCaption.suffix}
                  suffixDelayMs={flowCaption.suffixDelayMs}
                  suffixBreak={flowCaption.suffixBreak}
                  ellipsis={flowCaption.ellipsis}
                  ellipsisDelayMs={flowCaption.ellipsisDelayMs}
                  enterDelayMs={flowCaption.enterDelayMs}
                  leaving={captionLeaving}
                  preSink={captionPreSink}
                  leaveMs={sinkExit ? sinkMs : undefined}
                  preSinkMs={preSinkDurationMs ?? glowMs}
                  flow
                />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[8] overflow-visible">
        <AnimatePresence>
          {captionOn && overlayCaption ? (
            <HiwCaption
              key={`${overlayCaption.placement}-${overlayCaption.text}`}
              text={overlayCaption.text}
              placement={overlayCaption.placement}
              prefix={overlayCaption.prefix}
              prefixDelayMs={overlayCaption.prefixDelayMs}
              suffix={overlayCaption.suffix}
              suffixDelayMs={overlayCaption.suffixDelayMs}
              suffixBreak={overlayCaption.suffixBreak}
              ellipsis={overlayCaption.ellipsis}
              ellipsisDelayMs={overlayCaption.ellipsisDelayMs}
              enterDelayMs={overlayCaption.enterDelayMs}
              leaving={captionLeaving}
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
            className="relative mt-2 flex w-full flex-col items-center justify-center will-change-transform [backface-visibility:hidden] sm:mt-3 lg:mt-5"
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
                {captionOn && artCaption ? (
                  <HiwCaption
                    key={`${artCaption.placement}-${artCaption.text}`}
                    text={artCaption.text}
                    placement={artCaption.placement}
                    prefix={artCaption.prefix}
                    prefixDelayMs={artCaption.prefixDelayMs}
                    suffix={artCaption.suffix}
                    suffixDelayMs={artCaption.suffixDelayMs}
                    suffixBreak={artCaption.suffixBreak}
                    ellipsis={artCaption.ellipsis}
                    ellipsisDelayMs={artCaption.ellipsisDelayMs}
                    enterDelayMs={artCaption.enterDelayMs}
                    leaving={captionLeaving}
                    preSink={captionPreSink}
                    leaveMs={sinkExit ? sinkMs : undefined}
                    preSinkMs={preSinkDurationMs ?? glowMs}
                  />
                ) : null}
                {captionOn && phoneSketchCaption ? (
                  <HiwCaption
                    key={phoneSketchCaption.placement}
                    text={phoneSketchCaption.text}
                    placement={phoneSketchCaption.placement}
                    leaving={captionLeaving}
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
