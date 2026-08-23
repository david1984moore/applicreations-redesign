'use client'

import type { ReactNode } from 'react'
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

/** Preview line fades out before the laptop leaves and before the phone arrives. */
const PREVIEW_LEAVE = {
  opacity: { duration: PREVIEW_CAPTION_OUT_S, ease: EXIT_EASE },
  scale: { duration: PREVIEW_CAPTION_OUT_S, ease: EXIT_EASE },
  x: { duration: PREVIEW_CAPTION_OUT_S, ease: FLOAT_EASE },
  y: { duration: PREVIEW_CAPTION_OUT_S, ease: FLOAT_EASE },
} as const

/** Descent that holds pace and slowly picks up — never eases to a stop. */
const DRIFT_EASE = [0.28, 0.06, 0.82, 0.52] as const
/** Accelerate into the drop, then vanish. */
const SINK_EASE = [0.52, 0.02, 0.88, 0.08] as const
const SINK_FADE_EASE = [0.62, 0, 0.22, 1] as const
/** Shared screens + go-live fade — keep them locked, clip out quickly. */
export const SCREENS_SINK_FADE_S = 0.3
/** Fixed travel time so earlier fades do not speed up the drop. */
const SCREENS_DROP_S = 2.38

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

const SCREENS_LEAVE = sinkLeaveTransition(0.46)

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
  | 'revise'
  | 'justRight'
  | 'house'
  | 'screens'

export type HiwCaptionContent = {
  text: string
  placement: HiwCaptionPlacement
  prefix?: string
  prefixDelayMs?: number
  suffix?: string
  suffixDelayMs?: number
  ellipsis?: boolean
  ellipsisDelayMs?: number
}

type CaptionPose = { opacity: number; y?: number; x?: number; scale: number }

type CaptionEase = readonly [number, number, number, number]

type CaptionTransition = {
  opacity: { duration: number; ease: CaptionEase; delay?: number }
  scale: { duration: number; ease: CaptionEase }
  x: { duration: number; ease: CaptionEase }
  y: { duration: number; ease: CaptionEase }
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
    slot: 'absolute left-[4%] top-[calc(min(84cqw,36rem)*176/252+1.35rem)] w-[min(14.5rem,48%)] origin-left text-left sm:left-[5%]',
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
      'absolute top-[30%] left-[calc(50%+7.7rem)] w-max max-w-[8.75rem] origin-left text-left sm:top-[28%] sm:left-[calc(50%+8.7rem)] lg:top-[26%] lg:left-[calc(50%+9.5rem)]',
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
  revise: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[7.35rem] mx-auto w-[14rem] origin-bottom text-center sm:top-[7.85rem] sm:w-[15rem]',
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: -14, scale: 1 },
    exit: { opacity: 0, y: -24, scale: 1.02 },
    leave: { opacity: 0, y: -24, scale: 1.02 },
    transition: floatTransition(7.2),
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
    slot: 'absolute left-[16%] top-[11.6rem] w-max max-w-[78%] origin-left whitespace-nowrap text-left sm:left-[20%] sm:top-[12.35rem] lg:left-[18%] lg:top-[12.1rem]',
    initial: { opacity: 0, x: -6, y: 6, scale: 0.99 },
    animate: { opacity: 1, x: 64, y: -8, scale: 1 },
    exit: { opacity: 0, x: 88, y: -12, scale: 1.01 },
    leave: { opacity: 0, x: 88, y: -12, scale: 1.01 },
    transition: floatTransition(8.6),
  },
  screens: {
    seat: 'stage',
    slot: 'absolute left-0 right-0 top-[1.7rem] mx-auto w-[min(92%,20.5rem)] origin-bottom text-center sm:top-[1.85rem] lg:top-[2rem]',
    initial: { opacity: 0, y: 8, scale: 0.99 },
    animate: { opacity: 1, y: -6, scale: 1 },
    /** Same destination as leave — one continuous drop, never a rest pose. */
    preSink: { opacity: 1, y: 280, scale: 0.82 },
    exit: { opacity: 0, y: 280, scale: 0.82 },
    leave: { opacity: 0, y: 280, scale: 0.82 },
    transition: floatTransition(1.8, ENTER_EASE),
    exitTransition: SCREENS_LEAVE,
  },
}

const PREFIX_IN = { duration: 0.48, ease: ENTER_EASE } as const
const ELLIPSIS_DOT_MS = 220

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
  ellipsis?: boolean
  ellipsisDelayMs?: number
  leaving?: boolean
  preSink?: boolean
  leaveMs?: number
  preSinkMs?: number
}

export function HiwCaption({
  text,
  placement,
  prefix,
  prefixDelayMs = 820,
  suffix,
  suffixDelayMs = 1680,
  ellipsis = false,
  ellipsisDelayMs = 880,
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
  const screensDrop = Boolean(style.preSink && (preSink || leaving))
  const fadeDelayS = Math.max(0, (preSinkMs ?? 2100) / 1000)
  const dropTransition = screensDropTransition(SCREENS_DROP_S, fadeDelayS)
  const dropPose = style.leave

  return (
    <motion.div
      className={cn(
        'hiw-blurb pointer-events-none will-change-transform [backface-visibility:hidden]',
        style.slot,
        heading ? 'text-center lg:text-left' : 'z-[6]',
        (placement === 'house' || placement === 'preview') && 'hiw-blurb-over',
      )}
      initial={style.initial}
      animate={screensDrop ? dropPose : leaving ? style.leave : style.animate}
      exit={{
        ...style.exit,
        transition: screensDrop ? dropTransition : leaveTransition,
      }}
      transition={
        screensDrop
          ? dropTransition
          : leaving
            ? leaveTransition
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
        {prefix ? (
          <RevealSpan delayMs={prefixDelayMs} leaving={leaving}>
            {prefix}
            {'\u00a0'}
          </RevealSpan>
        ) : null}
        {text}
        {ellipsis
          ? ['.', '.', '.'].map((dot, index) => (
              <RevealSpan
                key={`dot-${index}`}
                delayMs={ellipsisDelayMs + index * ELLIPSIS_DOT_MS}
                leaving={leaving}
              >
                {dot}
              </RevealSpan>
            ))
          : null}
        {suffix ? (
          <RevealSpan delayMs={suffixDelayMs} leaving={leaving}>
            {'\u00a0'}
            {suffix}
          </RevealSpan>
        ) : null}
      </p>
    </motion.div>
  )
}
