'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ClipboardList, Eye, Globe2, type LucideIcon } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { HiwStepCopy } from '@/components/landing/hiw/HiwStepCopy'
import { HiwFormSketch, hiwFormGlowAtMs } from '@/components/landing/hiw/HiwFormSketch'
import { HiwLivePreviewSketch } from '@/components/landing/hiw/HiwDeviceSketch'
import {
  HiwStep3Cinema,
  type ReviewBeat,
} from '@/components/landing/hiw/HiwReviewSketch'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const
const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const
const EXIT_EASE = [0.36, 0, 0.52, 0.22] as const
const FADE_EASE = [0.4, 0, 0.7, 1] as const

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
  /** Tagline follows the 3, keeps growing slowly, pauses, then fades as step 1 arrives. */
  introFollowDelay: 500,
  introTaglineTravel: 800,
  introTaglineHold: 900,
  introTaglineFade: 720,
  /** Keep intro mounted through the tagline fade. */
  introOut: 2920,
  introFade: 520,
  /** Form starts after the tagline has already faded some, so they overlap less. */
  introHandoff: 2520,
  /** Typing starts shortly after the form begins to appear. */
  step1PlayLead: 280,
  step1Enter: 1900,
  enter: 1450,
  split: 1100,
  /** Form illustration eases in slower than other step art. */
  step1Art: 1600,
  /** Glow starts as the last character is typed in the last field. */
  step1Play: hiwFormGlowAtMs(),
  /** Hold while the form stays fully glowing, then exit fade begins. */
  step1Glow: 2000,
  /** Form leaves first — opacity drops faster than the slide so copy never lands on it. */
  step1ArtOut: 1080,
  step1ArtFade: 720,
  /** Copy waits until the form is already thinning, then eases down. */
  step1CopyDelay: 280,
  step1CopySettle: 1680,
  /** Centered copy sits alone after the form is gone. */
  step1CopyHold: 820,
  step1CopyFade: 960,
  step2Play: 30000,
  step3Review: 5400,
  step3House: 7200,
  step3Screens: 11500,
  glow: 2200,
  exit: 1100,
  /** Headline zooms in from the viewer, then sits. */
  finaleIn: 1100,
  finaleHeadlineHold: 800,
  finalePointsIn: 560,
  finalePointsStagger: 220,
  finalePointsHold: 2000,
  finaleTextOut: 720,
  ctaIn: 900,
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
  /** Copy eases down into the space the form is leaving. */
  copyCenterY: 124,
} as const

type IntroPose = 'enter' | 'glow' | 'exit'
type FinaleBeat = 'headline' | 'points' | 'cta'

type CinemaPhase =
  | { name: 'idle' }
  | { name: 'intro'; pose: IntroPose }
  | {
      name: 'step'
      step: 1 | 2 | 3
      pose: 'enter' | 'split' | 'play' | 'glow' | 'exit'
      introExit?: boolean
    }
  | { name: 'finale'; beat: FinaleBeat }

type HowItWorksStageProps = {
  started: boolean
  instant: boolean
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
    step2Play: Math.round(DESKTOP_MS.step2Play * scale),
    step3Review: Math.round(DESKTOP_MS.step3Review * scale),
    step3House: Math.round(DESKTOP_MS.step3House * scale),
    step3Screens: Math.round(DESKTOP_MS.step3Screens * scale),
    step3Play:
      Math.round(DESKTOP_MS.step3Review * scale) +
      Math.round(DESKTOP_MS.step3House * scale) +
      Math.round(DESKTOP_MS.step3Screens * scale),
    glow: Math.round(DESKTOP_MS.glow * scale),
    exit: Math.round(DESKTOP_MS.exit * scale),
    finaleIn: Math.round(DESKTOP_MS.finaleIn * scale),
    finaleHeadlineHold: Math.round(DESKTOP_MS.finaleHeadlineHold * scale),
    finalePointsIn: Math.round(DESKTOP_MS.finalePointsIn * scale),
    finalePointsStagger: Math.round(DESKTOP_MS.finalePointsStagger * scale),
    finalePointsHold: Math.round(DESKTOP_MS.finalePointsHold * scale),
    finaleTextOut: Math.round(DESKTOP_MS.finaleTextOut * scale),
    ctaIn: Math.round(DESKTOP_MS.ctaIn * scale),
  }
}

type IntroTimings = ReturnType<typeof scaleTimings>

function FinaleRecap({
  recap,
  timings,
  instant,
}: {
  recap: readonly { label: string }[]
  timings: IntroTimings
  instant: boolean
}) {
  const pointsIn = timings.finalePointsIn / 1000
  const pointsStagger = timings.finalePointsStagger / 1000

  return (
    <ul className="flex flex-col items-start gap-3.5 sm:gap-3">
      {recap.map((step, index) => (
        <motion.li
          key={step.label}
          className={cn(
            'flex items-center gap-2.5 antialiased [backface-visibility:hidden]',
            index === 1 && 'lg:ml-[1.15rem]',
            index === 2 && 'lg:ml-[2.3rem]'
          )}
          initial={instant ? false : { opacity: 0, x: -12, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            duration: pointsIn,
            delay: instant ? 0 : index * pointsStagger,
            ease: SMOOTH_EASE,
          }}
          transformTemplate={keepLayer}
        >
          <motion.span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[oklch(58%_0.14_310)] text-white shadow-[0_4px_14px_-3px_oklch(58%_0.14_310/0.55)]"
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
            aria-hidden
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
          </motion.span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-gray-900 whitespace-nowrap sm:text-xl">
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
}: {
  beat: FinaleBeat
  threeSteps: string
  recap: readonly { label: string; Icon: LucideIcon }[]
  ctaLabel: string
  ctaHref: string
  timings: IntroTimings
  instant: boolean
}) {
  const showHeadline = beat !== 'cta'
  const showPoints = beat === 'points' || beat === 'cta'
  const showCta = beat === 'cta'

  return (
    <div
      className="relative px-4 py-8 lg:absolute lg:inset-0 lg:px-5 lg:py-4"
      style={{ perspective: 1100, perspectiveOrigin: '50% 46%' }}
    >
      <div className="flex items-center justify-center lg:h-full">
        <div
          className="relative flex w-full max-w-[26rem] flex-col items-center px-2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="pointer-events-none relative mb-5 flex w-full justify-center sm:mb-6 lg:absolute lg:bottom-full lg:w-[26rem]">
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

          <div className="relative flex min-h-[5.25rem] w-full items-center justify-center">
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
                  className="absolute"
                  initial={instant ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: timings.ctaIn / 1000,
                    delay: instant ? 0 : 0.12,
                    ease: EASE,
                  }}
                >
                  <SpectrumFlipCta href={ctaHref}>{ctaLabel}</SpectrumFlipCta>
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
  const taglineTravel = timings.introTaglineTravel
  const taglineHold = timings.introTaglineHold
  const taglineFade = timings.introTaglineFade
  const taglineTotal = taglineTravel + taglineHold + taglineFade

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
            className="font-display relative origin-center mt-3 text-6xl font-semibold leading-none text-[oklch(58%_0.14_310)] antialiased lg:mt-3.5 lg:text-7xl"
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
                ? { ...INTRO_FLY.shown, opacity: 0, scale: 1, rotateX: 0, z: 0 }
                : INTRO_FLY.shown
            }
            transition={
              leaving
                ? {
                    duration: 0,
                    opacity: {
                      delay:
                        (timings.introFollowDelay + taglineTravel + taglineHold) /
                        1000,
                      duration: taglineFade / 1000,
                      ease: FADE_EASE,
                    },
                  }
                : pieceIn(2)
            }
            transformTemplate={keepLayer}
          >
            <span
              className={leaving ? 'hiw-tagline-grow' : undefined}
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
          </motion.h2>
        </div>
      </div>
    </div>
  )
}

export function HowItWorksStage({ started, instant }: HowItWorksStageProps) {
  const { dict, href } = useLocale()
  const [phase, setPhase] = useState<CinemaPhase>(() =>
    instant ? { name: 'finale', beat: 'cta' } : { name: 'idle' }
  )
  const [timings, setTimings] = useState(() => scaleTimings(1))
  const [previewBeat, setPreviewBeat] = useState<'build' | 'preview' | 'phone'>(
    'build'
  )
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

  const handlePreviewBeat = useCallback(
    (beat: 'build' | 'preview' | 'phone') => {
      setPreviewBeat(beat)
    },
    []
  )

  const handleReviewBeat = useCallback((beat: ReviewBeat) => {
    setReviewBeat(beat)
  }, [])

  useEffect(() => {
    if (instant) {
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
    at(t.step1Glow, () => setPhase({ name: 'step', step: 1, pose: 'exit' }))
    at(t.step1Exit, () => {
      setPreviewBeat('build')
      setPhase({ name: 'step', step: 2, pose: 'enter' })
    })
    at(t.enter, () => setPhase({ name: 'step', step: 2, pose: 'split' }))
    at(t.split, () => setPhase({ name: 'step', step: 2, pose: 'play' }))
    at(t.step2Play, () => setPhase({ name: 'step', step: 2, pose: 'glow' }))
    at(t.glow, () => setPhase({ name: 'step', step: 2, pose: 'exit' }))
    at(t.exit, () => {
      setReviewBeat('review')
      setPhase({ name: 'step', step: 3, pose: 'enter' })
    })
    at(t.enter, () => setPhase({ name: 'step', step: 3, pose: 'split' }))
    at(t.split, () => setPhase({ name: 'step', step: 3, pose: 'play' }))
    at(t.step3Play, () => setPhase({ name: 'step', step: 3, pose: 'glow' }))
    at(t.glow, () => setPhase({ name: 'step', step: 3, pose: 'exit' }))
    at(t.exit, () => setPhase({ name: 'finale', beat: 'headline' }))
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
  }, [started, instant])

  const liveRegion =
    phase.name === 'intro'
      ? `${dict.landing.howItWorks}. ${dict.landing.threeSteps}`
      : phase.name === 'step'
        ? `${processSteps[phase.step - 1]!.label}. ${
            phase.step === 2 && previewBeat === 'build'
              ? dict.landing.steps.livePreview.building
              :             phase.step === 2 && previewBeat === 'phone'
                ? `${dict.landing.steps.livePreview.detail} ${dict.landing.steps.livePreview.phoneSuffix}`
                : phase.step === 3 && reviewBeat === 'review'
                  ? dict.landing.steps.workingWebsite.review
                  : phase.step === 3 && reviewBeat === 'house'
                    ? `${dict.landing.steps.workingWebsite.review} ${dict.landing.steps.workingWebsite.revise}`
                    : processSteps[phase.step - 1]!.detail
          }`
        : phase.name === 'finale' && phase.beat === 'cta'
          ? `${processSteps.map((step) => step.label).join('. ')}. ${
              dict.introspectUi.getStarted
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
    <div className="relative flex min-h-[18rem] w-full flex-col items-center justify-center overflow-visible px-2 py-3 sm:min-h-[20rem] sm:px-3 lg:h-full lg:min-h-0 lg:px-2 lg:py-1">
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

      <AnimatePresence>
        {phase.name === 'step' ? (
          <StepScene
            key={`step-${phase.step}`}
            pose={phase.pose}
            enterMs={phase.step === 1 ? timings.step1Enter : timings.enter}
            splitMs={timings.split}
            exitMs={phase.step === 1 ? timings.step1Exit : timings.exit}
            glowMs={phase.step === 1 ? timings.step1Glow : timings.glow}
            pulseGlow={phase.step === 1}
            artMs={phase.step === 1 ? timings.step1Art : timings.split}
            staggeredExit={
              phase.step === 1
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
            copy={
              <HiwStepCopy
                n={processSteps[phase.step - 1]!.n}
                label={processSteps[phase.step - 1]!.label}
                detail={
                  phase.step === 2 && previewBeat === 'build'
                    ? dict.landing.steps.livePreview.building
                    : phase.step === 3
                      ? dict.landing.steps.workingWebsite.review
                      : processSteps[phase.step - 1]!.detail
                }
                suffix={
                  phase.step === 2 && previewBeat === 'phone'
                    ? dict.landing.steps.livePreview.phoneSuffix
                    : phase.step === 3 &&
                        (reviewBeat === 'house' || reviewBeat === 'screens')
                      ? dict.landing.steps.workingWebsite.revise
                      : undefined
                }
                tail={
                  phase.step === 3 && reviewBeat === 'screens'
                    ? dict.landing.steps.workingWebsite.suffix
                    : undefined
                }
                Icon={processSteps[phase.step - 1]!.Icon}
                revealDetail={phase.step === 3 || phase.pose !== 'enter'}
              />
            }
            illustration={
              phase.step === 1 ? (
                <HiwFormSketch
                  playing={
                    phase.pose === 'play' ||
                    phase.pose === 'glow' ||
                    phase.pose === 'exit'
                  }
                  duration={timings.step1Play}
                />
              ) : phase.step === 2 ? (
                <HiwLivePreviewSketch
                  playing={phase.pose === 'play' || phase.pose === 'glow'}
                  duration={timings.step2Play}
                  onBeat={handlePreviewBeat}
                />
              ) : (
                <HiwStep3Cinema
                  playing={phase.pose === 'play' || phase.pose === 'glow'}
                  reviewMs={timings.step3Review}
                  houseMs={timings.step3House}
                  screensMs={timings.step3Screens}
                  onBeat={handleReviewBeat}
                />
              )
            }
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase.name === 'finale' ? (
          <FinaleCinema
            key="finale"
            beat={phase.beat}
            threeSteps={dict.landing.threeSteps}
            recap={processSteps}
            ctaLabel={dict.introspectUi.getStarted}
            ctaHref={href('/introspect')}
            timings={timings}
            instant={instant}
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
  staggeredExit,
  copy,
  illustration,
}: {
  pose: 'enter' | 'split' | 'play' | 'glow' | 'exit'
  enterMs: number
  splitMs: number
  exitMs: number
  glowMs: number
  pulseGlow?: boolean
  artMs: number
  staggeredExit?: {
    settleMs: number
    holdMs: number
    fadeMs: number
    delayMs: number
    artOutMs: number
    artFadeMs: number
  }
  copy: ReactNode
  illustration: ReactNode
}) {
  const showArt = pose !== 'enter'
  const glowing = pose === 'glow' || pose === 'exit'
  const leaving = pose === 'exit'
  const arriving = pose === 'enter'
  const toCenter = Boolean(staggeredExit) && leaving
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const [centerX, setCenterX] = useState(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    const item = itemRef.current
    if (!track || !item) return

    const measure = () => {
      setCenterX((track.clientWidth - item.offsetWidth) / 2 - item.offsetLeft)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(item)
    return () => ro.disconnect()
  }, [])

  const copyDuration =
    pose === 'enter' ? enterMs / 1000 : pose === 'exit' ? exitMs / 1000 : splitMs / 1000
  const copyTransition = toCenter && staggeredExit
    ? {
        duration: staggeredExit.settleMs / 1000,
        ease: SMOOTH_EASE,
        x: {
          delay: staggeredExit.delayMs / 1000,
          duration: staggeredExit.settleMs / 1000,
          ease: SMOOTH_EASE,
        },
        y: {
          delay: staggeredExit.delayMs / 1000,
          duration: staggeredExit.settleMs / 1000,
          ease: SMOOTH_EASE,
        },
        scale: {
          delay: staggeredExit.delayMs / 1000,
          duration: staggeredExit.settleMs / 1000,
          ease: SMOOTH_EASE,
        },
        opacity: {
          delay:
            (staggeredExit.delayMs +
              staggeredExit.settleMs +
              staggeredExit.holdMs) /
            1000,
          duration: staggeredExit.fadeMs / 1000,
          ease: FADE_EASE,
        },
      }
    : { duration: copyDuration, ease: SMOOTH_EASE }
  const artDuration = leaving
    ? (staggeredExit?.artOutMs ?? artMs) / 1000
    : artMs / 1000
  const artFadeDuration = leaving
    ? (staggeredExit?.artFadeMs ?? staggeredExit?.artOutMs ?? artMs) / 1000
    : artMs / 1000
  const pulseMs = glowMs + (staggeredExit?.artFadeMs ?? 0)

  return (
    <div className="relative flex flex-col items-center overflow-visible px-1 pt-3 pb-8 sm:px-2 sm:pt-4 lg:absolute lg:inset-0 lg:pt-2 lg:pb-0">
      <div
        ref={trackRef}
        className="relative z-[2] flex w-full shrink-0 justify-center lg:justify-start lg:pl-1"
      >
        <motion.div
          ref={itemRef}
          className="w-max origin-center will-change-transform [backface-visibility:hidden]"
          initial={{ opacity: 0, x: SLIDE.copyIn, y: 92 }}
          animate={{
            opacity: leaving ? 0 : 1,
            x: leaving && !toCenter ? SLIDE.copyOut : toCenter ? centerX : 0,
            y: arriving ? 92 : toCenter ? SLIDE.copyCenterY : 0,
            scale: leaving && !toCenter ? 0.96 : toCenter ? 1.04 : 1,
          }}
          exit={toCenter ? { opacity: 0 } : { opacity: 0, x: SLIDE.copyOut }}
          transition={copyTransition}
          transformTemplate={keepLayer}
        >
          {copy}
        </motion.div>
      </div>
      <AnimatePresence>
        {showArt ? (
          <motion.div
            key="art"
            className="relative mt-3 flex w-full items-center justify-center will-change-transform [backface-visibility:hidden] sm:mt-4 lg:mt-5"
            initial={{ opacity: 0, x: SLIDE.artIn }}
            animate={{
              opacity: leaving ? 0 : 1,
              x: leaving ? (toCenter ? SLIDE.formOut : SLIDE.artIn) : 0,
            }}
            exit={{
              opacity: 0,
              x: toCenter ? SLIDE.formOut : SLIDE.artIn,
            }}
            transition={{
              duration: artDuration,
              ease: SMOOTH_EASE,
              opacity: {
                duration: artFadeDuration,
                ease: FADE_EASE,
              },
            }}
            transformTemplate={keepLayer}
            aria-hidden
          >
            <div className="relative w-full">
              {glowing && pulseGlow ? (
                <span
                  className="hiw-glow-pulse"
                  style={{ animationDuration: `${pulseMs / 1000}s` }}
                />
              ) : null}
              <div
                className={
                  glowing && !pulseGlow
                    ? 'hiw-glow-build relative z-[1] w-full'
                    : 'relative z-[1] w-full'
                }
                style={
                  glowing && !pulseGlow
                    ? { animationDuration: `${glowMs / 1000}s` }
                    : undefined
                }
              >
                {illustration}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
