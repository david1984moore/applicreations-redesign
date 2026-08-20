'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { C } from '@/components/pricing/ExampleScreenRotator'
import {
  PHONE_CAPTION_LEAD_S,
  PHONE_IN_S,
} from '@/components/landing/hiw/HiwDeviceSketch'
import { cn } from '@/lib/utils'

const ENTER_EASE = [0.22, 1, 0.36, 1] as const
const EXIT_EASE = [0.4, 0, 0.68, 1] as const
/** One continuous arc — never applied per keyframe, or motion stops at each waypoint. */
const FLOAT_EASE = [0.4, 0, 0.2, 1] as const
/** Matches the phone rising onto the stage. */
const PHONE_FLOW = [0.42, 0, 0.22, 1] as const

function keepLayer(_latest: unknown, generated: string) {
  return generated.includes('translateZ') ? generated : `${generated} translateZ(0)`
}

function floatTransition(
  duration: number,
  ease: readonly [number, number, number, number] = FLOAT_EASE
) {
  return {
    opacity: { duration: 1.1, ease: ENTER_EASE },
    scale: { duration: 1.35, ease: ENTER_EASE },
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

/** Matches the phone rising in; finishes before “Even on your phone.” */
const PREVIEW_LEAVE = {
  opacity: { duration: PHONE_IN_S - PHONE_CAPTION_LEAD_S, ease: EXIT_EASE },
  scale: { duration: PHONE_IN_S - PHONE_CAPTION_LEAD_S, ease: EXIT_EASE },
  x: { duration: PHONE_IN_S - PHONE_CAPTION_LEAD_S, ease: FLOAT_EASE },
  y: { duration: PHONE_IN_S - PHONE_CAPTION_LEAD_S, ease: FLOAT_EASE },
} as const

/** Slow downward commit — still moving when the screens join. */
const DRIFT_EASE = [0.22, 0, 0.4, 1] as const
/** Accelerate into the drop, then vanish. */
const SINK_EASE = [0.52, 0.02, 0.88, 0.08] as const
const SINK_FADE_EASE = [0.62, 0, 0.22, 1] as const

function sinkLeaveTransition(duration: number) {
  return {
    opacity: {
      duration: Math.min(0.34, duration * 0.48),
      ease: SINK_FADE_EASE,
      delay: 0.02,
    },
    scale: { duration, ease: SINK_EASE },
    x: { duration, ease: SINK_EASE },
    y: { duration, ease: SINK_EASE },
  }
}

function screensDriftTransition(duration: number) {
  return {
    opacity: { duration: 0 },
    scale: { duration, ease: DRIFT_EASE },
    x: { duration, ease: DRIFT_EASE },
    y: { duration, ease: DRIFT_EASE },
  }
}

const SCREENS_LEAVE = sinkLeaveTransition(0.72)

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
  | 'phone'
  | 'review'
  | 'house'
  | 'screens'

type CaptionPose = { opacity: number; y?: number; x?: number; scale: number }

type CaptionStyle = {
  seat: 'heading' | 'stage'
  slot: string
  initial: CaptionPose
  animate: CaptionPose
  /** Visible downward drift before the joint drop. */
  preSink?: CaptionPose
  exit: CaptionPose
  leave: CaptionPose
  transition: ReturnType<typeof floatTransition>
  exitTransition?: ReturnType<typeof floatTransition>
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
  },
  build: {
    seat: 'stage',
    slot: 'absolute left-[70%] top-[8.15rem] right-[4%] origin-left text-left sm:left-[72%] sm:top-[9.5rem] sm:right-[5%] lg:left-[74%] lg:top-[11.5rem] lg:right-[5.5%]',
    initial: { opacity: 0, y: 14, scale: 0.98 },
    animate: { opacity: 1, y: -18, scale: 1 },
    exit: { opacity: 0, y: -28, scale: 1.02 },
    leave: { opacity: 0, y: -28, scale: 1.02 },
    transition: floatTransition(14),
  },
  preview: {
    seat: 'stage',
    slot: 'absolute left-[4%] top-[calc(min(84cqw,36rem)*176/252+1.35rem)] w-[min(11.25rem,42%)] origin-left text-left sm:left-[5%]',
    initial: { opacity: 0, x: -6, y: 5, scale: 0.99 },
    animate: { opacity: 1, x: 16, y: -6, scale: 1 },
    exit: { opacity: 0, x: 28, y: -10, scale: 1.01 },
    leave: { opacity: 0, x: 28, y: -10, scale: 1.01 },
    transition: floatTransition(12),
    exitTransition: PREVIEW_LEAVE,
  },
  phone: {
    seat: 'stage',
    slot:
      'absolute top-[30%] left-[calc(50%+5.55rem)] right-[0.9rem] origin-left text-left sm:top-[28%] sm:left-[calc(50%+6.4rem)] sm:right-[1.05rem] lg:top-[26%] lg:left-[calc(50%+6.95rem)] lg:right-[1.2rem]',
    initial: { opacity: 0, y: 28, scale: 0.96 },
    animate: { opacity: 1, y: -22, scale: 1 },
    exit: { opacity: 0, y: -36, scale: 1.02 },
    leave: { opacity: 0, y: -36, scale: 1.02 },
    transition: floatTransition(9.5, PHONE_FLOW),
  },
  review: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[7.35rem] mx-auto w-[14rem] origin-bottom text-center sm:top-[7.85rem] sm:w-[15rem]',
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: -14, scale: 1 },
    exit: { opacity: 0, y: -24, scale: 1.02 },
    leave: { opacity: 0, y: -24, scale: 1.02 },
    transition: floatTransition(7.2),
  },
  house: {
    seat: 'stage',
    slot: 'absolute left-[16%] top-[11.6rem] w-max max-w-[78%] origin-left whitespace-nowrap text-left sm:left-[20%] sm:top-[12.35rem] lg:left-[18%] lg:top-[12.1rem]',
    initial: { opacity: 0, x: -6, y: 6, scale: 0.99 },
    animate: { opacity: 1, x: 64, y: -8, scale: 1 },
    exit: { opacity: 0, x: 88, y: -12, scale: 1.01 },
    leave: { opacity: 0, x: 88, y: -12, scale: 1.01 },
    transition: floatTransition(8.6),
  },
  screens: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[2.15rem] mx-auto w-[min(92%,20.5rem)] origin-bottom text-center sm:top-[2.3rem] lg:top-[2.45rem]',
    initial: { opacity: 0, y: 8, scale: 0.99 },
    animate: { opacity: 1, y: -6, scale: 1 },
    preSink: { opacity: 1, y: 56, scale: 1 },
    exit: { opacity: 0, y: 280, scale: 0.82 },
    leave: { opacity: 0, y: 280, scale: 0.82 },
    transition: floatTransition(1.8, ENTER_EASE),
    exitTransition: SCREENS_LEAVE,
  },
}

type HiwCaptionProps = {
  text: string
  placement: HiwCaptionPlacement
  leaving?: boolean
  preSink?: boolean
  leaveMs?: number
  preSinkMs?: number
}

export function HiwCaption({
  text,
  placement,
  leaving = false,
  preSink = false,
  leaveMs,
  preSinkMs,
}: HiwCaptionProps) {
  const style = CAPTION_STYLE[placement]
  const heading = style.seat === 'heading'
  const leaveTransition = leaveMs
    ? sinkLeaveTransition(leaveMs / 1000)
    : (style.exitTransition ?? LEAVE_TRANSITION)
  const drifting = Boolean(preSink && style.preSink && !leaving)
  const driftMs = Math.max(0.8, ((preSinkMs ?? 2100) - 80) / 1000)

  return (
    <motion.div
      className={cn(
        'hiw-blurb pointer-events-none will-change-transform [backface-visibility:hidden]',
        style.slot,
        heading ? 'text-center lg:text-left' : 'z-[6]',
        (placement === 'house' || placement === 'preview') && 'hiw-blurb-over',
      )}
      initial={style.initial}
      animate={
        leaving ? style.leave : drifting ? (style.preSink ?? style.animate) : style.animate
      }
      exit={{
        ...style.exit,
        transition: leaveTransition,
      }}
      transition={
        leaving
          ? leaveTransition
          : drifting
            ? screensDriftTransition(driftMs)
            : style.transition
      }
      transformTemplate={keepLayer}
    >
      <p
        className={cn(
          'relative font-medium leading-[1.35] tracking-[0.01em] antialiased',
          placement === 'phone'
            ? 'text-[1.12rem] leading-[1.28] sm:text-[1.2rem]'
            : placement === 'screens'
              ? 'text-[1.15rem] leading-[1.32] tracking-[0.012em] sm:text-[1.25rem]'
              : placement === 'form' || placement === 'preview' || heading
                ? 'text-[1.0625rem] sm:text-[1.18rem]'
                : 'text-[1.0625rem] sm:text-[1.15rem]',
          placement === 'form' && 'sm:whitespace-nowrap',
        )}
        style={{
          color: C.ink,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}
