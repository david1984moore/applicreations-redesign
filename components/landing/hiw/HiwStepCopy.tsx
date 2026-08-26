'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { C } from '@/components/pricing/ExampleScreenRotator'
import { PREVIEW_CAPTION_OUT_S } from '@/components/landing/hiw/HiwDeviceSketch'
import { cn } from '@/lib/utils'

const ENTER_EASE = [0.22, 1, 0.36, 1] as const
const EXIT_EASE = [0.4, 0, 0.68, 1] as const
/** One continuous arc — never applied per keyframe, or motion stops at each waypoint. */
const FLOAT_EASE = [0.4, 0, 0.2, 1] as const
/** Matches the phone rising onto the stage. */
const PHONE_FLOW = [0.42, 0, 0.22, 1] as const
/** One shared clock — mismatched opacity/transform times read as a hitch. */
const PHONE_SOFT = [0.4, 0, 0.2, 1] as const
const PHONE_ENTER = {
  opacity: { duration: 0.42, ease: PHONE_SOFT },
  scale: { duration: 0.42, ease: PHONE_SOFT },
  x: { duration: 0.42, ease: PHONE_SOFT },
  y: { duration: 0.42, ease: PHONE_SOFT },
} as const
const PHONE_LEAVE = {
  opacity: { duration: 0.72, ease: PHONE_SOFT },
  scale: { duration: 0.72, ease: PHONE_SOFT },
  x: { duration: 0.72, ease: PHONE_SOFT },
  y: { duration: 0.72, ease: PHONE_SOFT },
} as const

function keepLayer(_latest: unknown, generated: string) {
  return generated.includes('translateZ') ? generated : `${generated} translateZ(0)`
}

export function usePhoneStage() {
  const [phone, setPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => setPhone(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return phone
}

function floatTransition(
  duration: number,
  ease: readonly [number, number, number, number] = FLOAT_EASE
) {
  return {
    opacity: { duration: 0.48, ease: ENTER_EASE },
    scale: { duration: 1.05, ease: ENTER_EASE },
    x: { duration, ease },
    y: { duration, ease },
  }
}

const LEAVE_TRANSITION = {
  opacity: { duration: 0.82, ease: EXIT_EASE },
  scale: { duration: 0.82, ease: EXIT_EASE },
  x: { duration: 0.95, ease: FLOAT_EASE },
  y: { duration: 0.95, ease: FLOAT_EASE },
} as const

/** Table lines — quicker in/out than the shared float so the review beat does not linger. */
const REVIEW_IN = {
  opacity: { duration: 0.34, ease: ENTER_EASE },
  scale: { duration: 0.46, ease: ENTER_EASE },
  x: { duration: 5.4, ease: FLOAT_EASE },
  y: { duration: 5.4, ease: FLOAT_EASE },
} as const
const REVIEW_LEAVE = {
  opacity: { duration: 0.32, ease: EXIT_EASE },
  scale: { duration: 0.32, ease: EXIT_EASE },
  x: { duration: 0.44, ease: FLOAT_EASE },
  y: { duration: 0.44, ease: FLOAT_EASE },
} as const

/** House lines — same family as review, a touch more air so they still float. */
const HOUSE_IN = {
  opacity: { duration: 0.36, ease: ENTER_EASE },
  scale: { duration: 0.72, ease: ENTER_EASE },
  x: { duration: 6.2, ease: FLOAT_EASE },
  y: { duration: 6.2, ease: FLOAT_EASE },
} as const
const HOUSE_LEAVE = {
  opacity: { duration: 0.38, ease: EXIT_EASE },
  scale: { duration: 0.38, ease: EXIT_EASE },
  x: { duration: 0.5, ease: FLOAT_EASE },
  y: { duration: 0.5, ease: FLOAT_EASE },
} as const

/** Go-live line — fade in place so the next caption cannot morph over it. */
const SWITCH_LEAVE = {
  opacity: { duration: 0.44, ease: EXIT_EASE },
  scale: { duration: 0.44, ease: EXIT_EASE },
  x: { duration: 0.44, ease: FLOAT_EASE },
  y: { duration: 0.44, ease: FLOAT_EASE },
} as const
export const SWITCH_CAPTION_OUT_S = SWITCH_LEAVE.opacity.duration
/** Air after the go-live line is gone, before “And you're in business”. */
export const SCREENS_CAPTION_IN_DELAY_MS = Math.round(SWITCH_CAPTION_OUT_S * 1000) + 90

/** Step-1 form line — quick out, slightly ahead of the form slide. */
const FORM_LEAVE = {
  opacity: { duration: 0.68, ease: EXIT_EASE },
  scale: { duration: 0.68, ease: EXIT_EASE },
  x: { duration: 0.68, ease: FLOAT_EASE },
  y: { duration: 0.68, ease: FLOAT_EASE },
} as const

/** Preview line fades out before the laptop leaves and before the phone arrives. */
const PREVIEW_LEAVE = {
  opacity: { duration: PREVIEW_CAPTION_OUT_S, ease: EXIT_EASE },
  scale: { duration: PREVIEW_CAPTION_OUT_S, ease: EXIT_EASE },
  x: { duration: PREVIEW_CAPTION_OUT_S, ease: FLOAT_EASE },
  y: { duration: PREVIEW_CAPTION_OUT_S, ease: FLOAT_EASE },
} as const

/** “…we get to work” — soft dissolve while barely still rising. */
const BUILD_LEAVE = {
  opacity: { duration: 0.62, ease: EXIT_EASE },
  scale: { duration: 0.62, ease: EXIT_EASE },
  x: { duration: 0.62, ease: FLOAT_EASE },
  y: { duration: 0.78, ease: FLOAT_EASE },
} as const

/** Descent that holds pace and slowly picks up — never eases to a stop. */
const DRIFT_EASE = [0.28, 0.06, 0.82, 0.52] as const
/** Accelerate into the drop, then vanish. */
const SINK_EASE = [0.52, 0.02, 0.88, 0.08] as const
/** Slow dissolve while the line is still drifting. */
const SINK_FADE_EASE = [0.42, 0, 0.48, 1] as const
/** Shared screens + go-live fade — long enough to read the drift. */
export const SCREENS_SINK_FADE_S = 1.2
/** Fixed travel time so earlier fades do not speed up the drop. */
const SCREENS_DROP_S = 4.6

function sinkLeaveTransition(duration: number) {
  return {
    opacity: {
      duration: SCREENS_SINK_FADE_S,
      ease: SINK_FADE_EASE,
      delay: 0.02,
    },
    scale: { duration, ease: SINK_EASE },
    x: { duration, ease: SINK_EASE },
    y: { duration, ease: SINK_EASE },
  }
}

function screensDropTransition(duration: number, fadeDelay: number) {
  return {
    opacity: {
      duration: SCREENS_SINK_FADE_S,
      ease: SINK_FADE_EASE,
      delay: fadeDelay,
    },
    scale: { duration, ease: DRIFT_EASE },
    x: { duration, ease: DRIFT_EASE },
    y: { duration, ease: DRIFT_EASE },
  }
}

/** Rise, then down — still moving at the peak so the line never parks. */
const SCREENS_UP_EASE = [0.25, 0.08, 0.4, 0.75] as const
const SCREENS_DOWN_EASE = [0.3, 0.13, 0.58, 1] as const
/** One arc for “And you're in business!” — fade finishes before the screens sink. */
const SCREENS_ARC_S = 5.4
const SCREENS_ARC_Y = [16, -34, 42] as const
const SCREENS_ARC_Y_PHONE = [10, -18, 28] as const

function screensArcAnimate(phone: boolean) {
  return {
    opacity: [0, 1, 1, 0],
    x: 0,
    y: phone ? [...SCREENS_ARC_Y_PHONE] : [...SCREENS_ARC_Y],
    scale: 1,
  }
}

function screensArcTransition(delayMs: number | undefined) {
  const delay = (delayMs ?? 0) / 1000
  return {
    opacity: {
      duration: SCREENS_ARC_S,
      times: [0, 0.07, 0.7, 1],
      ease: [ENTER_EASE, [0, 0, 1, 1] as const, SINK_FADE_EASE],
      delay,
    },
    scale: { duration: 0.48, ease: ENTER_EASE, delay },
    x: { duration: SCREENS_ARC_S, ease: FLOAT_EASE, delay },
    y: {
      duration: SCREENS_ARC_S,
      times: [0, 0.32, 1],
      ease: [SCREENS_UP_EASE, SCREENS_DOWN_EASE],
      delay,
    },
  }
}

const SCREENS_LEAVE = {
  opacity: { duration: 0.5, ease: EXIT_EASE },
  scale: { duration: 0.5, ease: EXIT_EASE },
  x: { duration: 0.5, ease: FLOAT_EASE },
  y: { duration: 0.8, ease: SCREENS_DOWN_EASE },
} as const

type HiwStepCopyProps = {
  n: string
  label: string
  Icon: LucideIcon
}

export function HiwStepCopy({ n, label, Icon }: HiwStepCopyProps) {
  return (
    <div className="flex items-center gap-3 text-left antialiased [backface-visibility:hidden] lg:gap-3.5">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[oklch(68%_0.15_230/0.45)] bg-[oklch(68%_0.15_230)] text-white lg:h-12 lg:w-12 lg:border-[oklch(78%_0.08_310/0.45)] lg:bg-[oklch(58%_0.14_310)]">
        <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.6} aria-hidden />
      </span>
      <p className="flex items-baseline gap-2.5 font-display text-xl font-semibold leading-none tracking-tight text-gray-900 lg:text-[1.35rem]">
        <span className="origin-center inline-block text-3xl font-semibold leading-none tabular-nums text-[oklch(68%_0.15_230)] [transform:translateZ(0)] lg:text-4xl lg:text-[oklch(58%_0.14_310)]">
          {n}
        </span>
        {label}
      </p>
    </div>
  )
}

export type HiwCaptionPlacement =
  | 'form'
  | 'build'
  | 'preview'
  | 'works'
  | 'phone'
  | 'review'
  | 'revise'
  | 'justRight'
  | 'house'
  | 'fineTune'
  | 'andFinally'
  | 'switch'
  | 'screens'

/** Phone sketch-only pockets — sit next to the art, never in a distant heading band. */
const PHONE_SKETCH_SLOT: Record<HiwCaptionPlacement, string> = {
  form: 'absolute inset-x-3 top-1 origin-top text-center',
  build:
    'absolute right-[1%] bottom-[5.85rem] w-[5.1rem] origin-bottom-right text-right',
  preview: 'absolute inset-x-3 top-1 origin-top text-center',
  works: 'absolute inset-x-3 top-1 origin-top text-center',
  phone:
    'absolute top-[38%] left-[calc(50%+3.05rem)] w-[min(7.25rem,calc(50%-3.35rem))] origin-left text-left',
  review: 'absolute inset-x-4 top-[12%] origin-top text-center',
  revise: 'absolute inset-x-4 top-[12%] origin-top text-center',
  justRight: 'absolute inset-x-3 bottom-[9.4rem] origin-bottom text-center',
  house:
    'absolute left-[33%] top-[-2.35rem] w-max origin-bottom text-left',
  fineTune:
    'absolute left-[39%] top-[-2.95rem] w-max origin-bottom text-left',
  andFinally:
    'absolute inset-x-[14%] top-[-2.6rem] mx-auto w-max origin-bottom text-center',
  switch: 'absolute inset-x-3 top-1 origin-top text-center',
  screens: 'absolute inset-x-3 top-1 origin-top text-center',
}

/** Reserved heading band on phone — absolute so caption swaps never reflow the sketch. */
const PHONE_FLOW_SLOT =
  'absolute inset-0 flex items-center justify-center origin-center px-2 text-center'

export type HiwCaptionContent = {
  text: string
  placement: HiwCaptionPlacement
  prefix?: string
  prefixDelayMs?: number
  suffix?: string
  suffixDelayMs?: number
  suffixBreak?: boolean
  /** Default true — house line. Punchline wants “…that”. */
  suffixSpace?: boolean
  ellipsis?: boolean
  ellipsisDelayMs?: number
  /** Hold at `initial` this long before the enter transition. */
  enterDelayMs?: number
}

type CaptionPose = { opacity: number; y?: number; x?: number; scale: number }

type CaptionEase = readonly [number, number, number, number]

type CaptionTransition = {
  opacity: { duration: number; ease: CaptionEase; delay?: number }
  scale: { duration: number; ease: CaptionEase; delay?: number }
  x: { duration: number; ease: CaptionEase; delay?: number }
  y: { duration: number; ease: CaptionEase; delay?: number }
}

type CaptionStyle = {
  seat: 'heading' | 'stage'
  slot: string
  initial: CaptionPose
  animate: CaptionPose
  /** Visible downward drift before the joint drop. */
  preSink?: CaptionPose
  exit: CaptionPose
  leave: CaptionPose
  transition: CaptionTransition
  exitTransition?: CaptionTransition
}

/** Safe pockets only — never on the sketch, cable, or devices.
 *  Position uses a single target (not keyframe waypoints) so the caption
 *  never eases to a stop mid-flight. Drift duration is longer than the beat
 *  so the line is still moving when it hands off. */
export const CAPTION_STYLE: Record<HiwCaptionPlacement, CaptionStyle> = {
  form: {
    seat: 'stage',
    slot: 'absolute left-[max(0.5rem,calc(50%-9rem))] top-[2.55rem] w-[min(calc(100%-1rem),18rem)] origin-left text-left sm:left-[max(0.5rem,calc(50%-11rem))] sm:top-[3.1rem] sm:w-[22rem] lg:left-[max(0.5rem,calc(50%-13rem))] lg:top-[3.15rem] lg:w-[26rem]',
    initial: { opacity: 0, x: -10, y: 4, scale: 0.99 },
    animate: { opacity: 1, x: 56, y: 0, scale: 1 },
    exit: { opacity: 0, x: 88, y: 0, scale: 1 },
    leave: { opacity: 0, x: 88, y: 0, scale: 1 },
    transition: floatTransition(11.5),
    exitTransition: FORM_LEAVE,
  },
  build: {
    seat: 'stage',
    slot: 'absolute right-[1.5%] bottom-[5.35rem] w-[min(8.5rem,23%)] origin-bottom-right text-right sm:right-[1.75%] sm:bottom-[5.55rem] lg:right-[1.25%] lg:bottom-[5.7rem]',
    initial: { opacity: 0, y: 10, scale: 0.99 },
    animate: { opacity: 1, y: -14, scale: 1 },
    exit: { opacity: 0, y: -18, scale: 1 },
    leave: { opacity: 0, y: -18, scale: 1 },
    transition: floatTransition(6.4),
    exitTransition: BUILD_LEAVE,
  },
  preview: {
    seat: 'stage',
    slot: 'absolute left-[4%] top-[calc(min(84cqw,36rem)*176/252+2rem)] w-[min(14.5rem,48%)] origin-left text-left sm:left-[5%]',
    initial: { opacity: 0, x: -6, y: 5, scale: 0.99 },
    animate: { opacity: 1, x: 16, y: -2, scale: 1 },
    exit: { opacity: 0, x: 28, y: -6, scale: 1.01 },
    leave: { opacity: 0, x: 28, y: -6, scale: 1.01 },
    transition: floatTransition(12),
    exitTransition: PREVIEW_LEAVE,
  },
  works: {
    seat: 'stage',
    slot: 'absolute left-[4%] top-[calc(min(84cqw,36rem)*176/252+2rem)] w-[min(16rem,52%)] origin-left whitespace-nowrap text-left sm:left-[5%]',
    initial: { opacity: 0, x: 16, y: 2, scale: 0.99 },
    animate: { opacity: 1, x: 16, y: -4, scale: 1 },
    exit: { opacity: 0, x: 28, y: -8, scale: 1.01 },
    leave: { opacity: 0, x: 28, y: -8, scale: 1.01 },
    transition: {
      opacity: { duration: 0.18, ease: ENTER_EASE },
      scale: { duration: 0.28, ease: ENTER_EASE },
      x: { duration: 8, ease: FLOAT_EASE },
      y: { duration: 8, ease: FLOAT_EASE },
    },
    exitTransition: PREVIEW_LEAVE,
  },
  phone: {
    seat: 'stage',
    slot:
      'absolute top-[30%] left-[calc(50%+7.7rem)] w-max max-w-[8.75rem] origin-left text-left sm:top-[28%] sm:left-[calc(50%+8.7rem)] lg:top-[26%] lg:left-[calc(50%+9.5rem)]',
    initial: { opacity: 0, y: 28, scale: 0.96 },
    animate: { opacity: 1, y: -22, scale: 1 },
    exit: { opacity: 0, y: -36, scale: 1.02 },
    leave: { opacity: 0, y: -36, scale: 1.02 },
    transition: floatTransition(9.5, PHONE_FLOW),
  },
  /** Drift down toward the table — never up into “Going live”. */
  review: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[9.15rem] mx-auto w-[14rem] origin-top text-center sm:top-[9.65rem] sm:w-[15rem]',
    initial: { opacity: 0, y: 2, scale: 0.98 },
    animate: { opacity: 1, y: 20, scale: 1 },
    exit: { opacity: 0, y: 34, scale: 1.02 },
    leave: { opacity: 0, y: 34, scale: 1.02 },
    transition: REVIEW_IN,
    exitTransition: REVIEW_LEAVE,
  },
  revise: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[9.15rem] mx-auto w-[14rem] origin-top text-center sm:top-[9.65rem] sm:w-[15rem]',
    initial: { opacity: 0, y: 2, scale: 0.98 },
    animate: { opacity: 1, y: 20, scale: 1 },
    exit: { opacity: 0, y: 34, scale: 1.02 },
    leave: { opacity: 0, y: 34, scale: 1.02 },
    transition: REVIEW_IN,
    exitTransition: REVIEW_LEAVE,
  },
  justRight: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[7.35rem] mx-auto w-[20rem] origin-bottom whitespace-nowrap text-center sm:top-[7.85rem] sm:w-[22rem]',
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: -14, scale: 1 },
    exit: { opacity: 0, y: -24, scale: 1.02 },
    leave: { opacity: 0, y: -24, scale: 1.02 },
    transition: floatTransition(7.2),
  },
  house: {
    seat: 'stage',
    slot: 'absolute left-[14%] bottom-[calc(100cqw*178/492+6rem)] w-max origin-left whitespace-nowrap text-left sm:left-[16%] lg:left-[18%]',
    initial: { opacity: 0, x: -12, y: 6, scale: 0.98 },
    animate: { opacity: 1, x: 10, y: 0, scale: 1 },
    exit: { opacity: 0, x: 18, y: -5, scale: 1.01 },
    leave: { opacity: 0, x: 18, y: -5, scale: 1.01 },
    transition: HOUSE_IN,
    exitTransition: HOUSE_LEAVE,
  },
  fineTune: {
    seat: 'stage',
    slot: 'absolute right-[14%] bottom-[calc(100cqw*178/492+6rem)] w-max origin-right whitespace-nowrap text-right sm:right-[16%] lg:right-[18%]',
    initial: { opacity: 0, x: 12, y: 6, scale: 0.98 },
    animate: { opacity: 1, x: -10, y: 0, scale: 1 },
    exit: { opacity: 0, x: -18, y: -5, scale: 1.01 },
    leave: { opacity: 0, x: -18, y: -5, scale: 1.01 },
    transition: HOUSE_IN,
    exitTransition: HOUSE_LEAVE,
  },
  andFinally: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 bottom-[calc(100cqw*178/492+6rem)] mx-auto w-max max-w-[min(22rem,92%)] origin-bottom text-center',
    initial: { opacity: 0, y: 6, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1.14 },
    exit: { opacity: 0, y: -8, scale: 1.18 },
    leave: { opacity: 0, y: -8, scale: 1.18 },
    transition: {
      opacity: { duration: 0.36, ease: ENTER_EASE },
      scale: { duration: 1.05, ease: ENTER_EASE, delay: 0.16 },
      x: { duration: 1.05, ease: ENTER_EASE },
      y: { duration: 0.36, ease: ENTER_EASE },
    },
    exitTransition: HOUSE_LEAVE,
  },
  switch: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[1.7rem] mx-auto w-[min(92%,20.5rem)] origin-bottom text-center sm:top-[1.85rem] lg:top-[2rem]',
    initial: { opacity: 0, y: 10, scale: 0.99 },
    animate: { opacity: 1, y: -6, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 1 },
    leave: { opacity: 0, y: -6, scale: 1 },
    transition: {
      opacity: { duration: 0.32, ease: ENTER_EASE },
      scale: { duration: 0.55, ease: ENTER_EASE },
      x: { duration: 5.4, ease: FLOAT_EASE },
      y: { duration: 5.4, ease: FLOAT_EASE },
    },
    exitTransition: SWITCH_LEAVE,
  },
  screens: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[1.7rem] mx-auto w-[min(92%,20.5rem)] origin-bottom text-center sm:top-[1.85rem] lg:top-[2rem]',
    initial: { opacity: 0, y: 16, scale: 0.99 },
    animate: { opacity: 1, y: -34, scale: 1 },
    exit: { opacity: 0, y: 42, scale: 1 },
    leave: { opacity: 0, y: 42, scale: 1 },
    transition: floatTransition(1.8, ENTER_EASE),
    exitTransition: SCREENS_LEAVE,
  },
}

const PREFIX_IN = { duration: 0.34, ease: ENTER_EASE } as const
/** Stagger between ellipsis dots — synced with HowItWorksStage caption timing. */
export const ELLIPSIS_DOT_MS = 210
export const ELLIPSIS_TAIL_MS = ELLIPSIS_DOT_MS * 2
/** House beat: trailing dots after the phrase has landed. */
export const HOUSE_ELLIPSIS_DELAY_MS = 50
export const HOUSE_AND_THEN_DELAY_MS =
  HOUSE_ELLIPSIS_DELAY_MS + ELLIPSIS_TAIL_MS + 240
/** Punchline: dots land, then “that actually works”. */
export const WORKS_ELLIPSIS_DELAY_MS = 120
export const WORKS_SUFFIX_DELAY_MS =
  WORKS_ELLIPSIS_DELAY_MS + ELLIPSIS_TAIL_MS + 480 + 200
const ELLIPSIS_IN = { duration: 0.48, ease: [0.16, 1, 0.32, 1] as const }

function withEnterDelay(
  transition: CaptionTransition,
  delayMs: number | undefined,
  skip: boolean,
): CaptionTransition {
  if (!delayMs || skip) return transition
  const delay = delayMs / 1000
  return {
    opacity: { ...transition.opacity, delay: (transition.opacity.delay ?? 0) + delay },
    scale: { ...transition.scale, delay: (transition.scale.delay ?? 0) + delay },
    x: { ...transition.x, delay: (transition.x.delay ?? 0) + delay },
    y: { ...transition.y, delay: (transition.y.delay ?? 0) + delay },
  }
}

function EllipsisDot({
  delayMs,
  leaving,
}: {
  delayMs: number
  leaving: boolean
}) {
  return (
    <motion.span
      className="inline-block origin-bottom"
      initial={{ opacity: 0, y: 6, scale: 0.28 }}
      animate={{
        opacity: leaving ? 0 : 1,
        y: leaving ? 0 : 0,
        scale: leaving ? 1 : 1,
      }}
      transition={{
        opacity: { ...ELLIPSIS_IN, delay: leaving ? 0 : delayMs / 1000 },
        y: { ...ELLIPSIS_IN, delay: leaving ? 0 : delayMs / 1000 },
        scale: { ...ELLIPSIS_IN, delay: leaving ? 0 : delayMs / 1000 },
      }}
    >
      .
    </motion.span>
  )
}

function RevealSpan({
  children,
  delayMs,
  leaving,
}: {
  children: ReactNode
  delayMs: number
  leaving: boolean
}) {
  return (
    <motion.span
      className="inline"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{
        ...PREFIX_IN,
        delay: leaving ? 0 : delayMs / 1000,
      }}
    >
      {children}
    </motion.span>
  )
}

type HiwCaptionProps = {
  text: string
  placement: HiwCaptionPlacement
  prefix?: string
  prefixDelayMs?: number
  suffix?: string
  suffixDelayMs?: number
  suffixBreak?: boolean
  suffixSpace?: boolean
  ellipsis?: boolean
  ellipsisDelayMs?: number
  enterDelayMs?: number
  leaving?: boolean
  preSink?: boolean
  leaveMs?: number
  preSinkMs?: number
  /** Sit in the heading band (phone) instead of the stage overlay. */
  flow?: boolean
}

export function HiwCaption({
  text,
  placement,
  prefix,
  prefixDelayMs = 820,
  suffix,
  suffixDelayMs = 1680,
  suffixBreak = false,
  suffixSpace = true,
  ellipsis = false,
  ellipsisDelayMs = 880,
  enterDelayMs,
  leaving = false,
  preSink = false,
  leaveMs,
  preSinkMs,
  flow = false,
}: HiwCaptionProps) {
  const phoneStage = usePhoneStage()
  const style = CAPTION_STYLE[placement]
  const heading = style.seat === 'heading'
  const slot = flow
    ? PHONE_FLOW_SLOT
    : phoneStage
      ? PHONE_SKETCH_SLOT[placement]
      : style.slot
  const phoneBeside = phoneStage && placement === 'phone'
  /** Build + go-live punchline keep their authored rise on phone. */
  const riseOnPhone = placement === 'build' || placement === 'screens'
  const plantOnPhone = phoneStage && !riseOnPhone
  const restPose = plantOnPhone
    ? { opacity: 1, x: 0, y: 0, scale: style.animate.scale }
    : style.animate
  const leavePose = plantOnPhone
    ? { opacity: 0, x: 0, y: 0, scale: 1 }
    : style.leave
  const exitPose = plantOnPhone
    ? { opacity: 0, x: 0, y: 0, scale: 1 }
    : style.exit
  const dropPose = phoneStage
    ? { opacity: 0, x: 0, y: 20, scale: 1 }
    : style.leave
  const leaveTransition =
    placement === 'screens'
      ? style.exitTransition ?? SCREENS_LEAVE
      : leaveMs
        ? sinkLeaveTransition(leaveMs / 1000)
        : style.exitTransition
          ?? (phoneStage && !riseOnPhone ? PHONE_LEAVE : LEAVE_TRANSITION)
  const screensDrop = Boolean(style.preSink && (preSink || leaving))
  const screensArc = placement === 'screens' && !leaving && !screensDrop
  const fadeDelayS = Math.max(0, (preSinkMs ?? 2100) / 1000)
  const dropTransition = screensDropTransition(SCREENS_DROP_S, fadeDelayS)
  const step3Caption =
    placement === 'review' ||
    placement === 'revise' ||
    placement === 'house' ||
    placement === 'fineTune' ||
    placement === 'andFinally'
  const enterTransition = withEnterDelay(
    phoneStage
      ? placement === 'andFinally'
        ? { ...PHONE_ENTER, scale: style.transition.scale }
        : riseOnPhone || step3Caption || placement === 'works'
          ? style.transition
          : PHONE_ENTER
      : style.transition,
    enterDelayMs,
    leaving || screensDrop || screensArc,
  )

  return (
    <motion.div
      className={cn(
        'hiw-blurb pointer-events-none will-change-transform [backface-visibility:hidden]',
        slot,
        heading ? 'text-center lg:text-left' : 'z-[6]',
        (placement === 'house' ||
          placement === 'fineTune' ||
          placement === 'andFinally' ||
          placement === 'build' ||
          placement === 'preview' ||
          placement === 'works' ||
          placement === 'switch' ||
          placement === 'screens') &&
          'hiw-blurb-over',
        phoneStage && 'max-lg:whitespace-normal',
      )}
      initial={
        phoneStage && !riseOnPhone
          ? { opacity: 0, x: phoneBeside ? -10 : 0, y: phoneBeside ? 0 : 0, scale: 1 }
          : style.initial
      }
      animate={
        screensArc
          ? screensArcAnimate(phoneStage)
          : screensDrop
            ? dropPose
            : leaving
              ? leavePose
              : restPose
      }
      exit={{
        ...exitPose,
        transition: screensDrop ? dropTransition : leaveTransition,
      }}
      transition={
        screensArc
          ? screensArcTransition(enterDelayMs)
          : screensDrop
            ? dropTransition
            : leaving
              ? leaveTransition
              : enterTransition
      }
      transformTemplate={keepLayer}
    >
      <p
        className={cn(
          'relative font-medium leading-[1.35] tracking-[0.01em] antialiased',
          placement === 'phone'
            ? 'text-[1.12rem] leading-[1.28] sm:text-[1.2rem]'
            : placement === 'screens' || placement === 'switch'
              ? 'text-[1.15rem] leading-[1.32] tracking-[0.012em] sm:text-[1.25rem]'
              : placement === 'form' || placement === 'preview' || placement === 'works' || heading
                ? 'text-[1.0625rem] sm:text-[1.18rem]'
                : 'text-[1.0625rem] sm:text-[1.15rem]',
          placement === 'form' && !phoneStage && 'sm:whitespace-nowrap',
          phoneStage && 'whitespace-normal',
        )}
        style={{
          color: C.ink,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {prefix ? (
          <RevealSpan delayMs={prefixDelayMs} leaving={leaving}>
            {prefix}
            {'\u00a0'}
          </RevealSpan>
        ) : null}
        {text}
        {ellipsis
          ? ['.', '.', '.'].map((dot, index) => (
              <EllipsisDot
                key={`dot-${index}`}
                delayMs={ellipsisDelayMs + index * ELLIPSIS_DOT_MS}
                leaving={leaving}
              />
            ))
          : null}
        {suffix ? (
          <RevealSpan delayMs={suffixDelayMs} leaving={leaving}>
            {suffixBreak ? <br /> : suffixSpace ? '\u00a0' : null}
            {suffix}
          </RevealSpan>
        ) : null}
      </p>
    </motion.div>
  )
}
