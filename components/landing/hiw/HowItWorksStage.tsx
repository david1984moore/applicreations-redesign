'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardList, Eye, Globe2 } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { HiwStepCopy } from '@/components/landing/hiw/HiwStepCopy'
import { HiwFormSketch } from '@/components/landing/hiw/HiwFormSketch'
import {
  HiwLivePreviewSketch,
  HiwWorkingWebsiteSketch,
} from '@/components/landing/hiw/HiwDeviceSketch'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'

const EASE = [0.22, 1, 0.36, 1] as const

const DESKTOP_MS = {
  introIn: 1100,
  introHold: 1400,
  introOut: 1000,
  enter: 1200,
  split: 850,
  step1Play: 3500,
  step2Play: 5000,
  step3Play: 4000,
  glow: 800,
  exit: 1100,
  finaleIn: 800,
} as const

type CinemaPhase =
  | { name: 'idle' }
  | { name: 'intro'; shown: boolean }
  | { name: 'step'; step: 1 | 2 | 3; pose: 'enter' | 'split' | 'play' | 'glow' | 'exit' }
  | { name: 'finale' }

type HowItWorksStageProps = {
  started: boolean
  instant: boolean
}

function scaleTimings(scale: number) {
  return {
    introIn: Math.round(DESKTOP_MS.introIn * scale),
    introHold: Math.round(DESKTOP_MS.introHold * scale),
    introOut: Math.round(DESKTOP_MS.introOut * scale),
    enter: Math.round(DESKTOP_MS.enter * scale),
    split: Math.round(DESKTOP_MS.split * scale),
    step1Play: Math.round(DESKTOP_MS.step1Play * scale),
    step2Play: Math.round(DESKTOP_MS.step2Play * scale),
    step3Play: Math.round(DESKTOP_MS.step3Play * scale),
    glow: Math.round(DESKTOP_MS.glow * scale),
    exit: Math.round(DESKTOP_MS.exit * scale),
    finaleIn: Math.round(DESKTOP_MS.finaleIn * scale),
  }
}

function IntroTitle({
  howItWorks,
  threeSteps,
}: {
  howItWorks: string
  threeSteps: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-base font-bold tracking-[0.14em] uppercase text-primary-600 lg:text-sm">
        {howItWorks}
      </p>
      <p className="font-display mt-1 text-6xl font-semibold leading-none text-gray-900 lg:text-7xl">
        3
      </p>
      <h2 className="font-display mt-2 max-w-[22rem] text-xl leading-[1.2] tracking-tight text-gray-900 sm:text-2xl lg:text-xl lg:leading-[1.15]">
        {threeSteps}
      </h2>
    </div>
  )
}

export function HowItWorksStage({ started, instant }: HowItWorksStageProps) {
  const { dict, href } = useLocale()
  const [phase, setPhase] = useState<CinemaPhase>(() =>
    instant ? { name: 'finale' } : { name: 'idle' }
  )
  const [timings, setTimings] = useState(() => scaleTimings(1))

  const processSteps = useMemo(
    () =>
      [
        { n: '1' as const, ...dict.landing.steps.introspect, Icon: ClipboardList },
        { n: '2' as const, ...dict.landing.steps.livePreview, Icon: Eye },
        { n: '3' as const, ...dict.landing.steps.workingWebsite, Icon: Globe2 },
      ] as const,
    [dict]
  )

  useEffect(() => {
    if (instant) {
      setPhase({ name: 'finale' })
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

    setPhase({ name: 'intro', shown: true })
    at(t.introIn + t.introHold, () => setPhase({ name: 'intro', shown: false }))
    at(t.introOut, () => setPhase({ name: 'step', step: 1, pose: 'enter' }))
    at(t.enter, () => setPhase({ name: 'step', step: 1, pose: 'split' }))
    at(t.split, () => setPhase({ name: 'step', step: 1, pose: 'play' }))
    at(t.step1Play, () => setPhase({ name: 'step', step: 1, pose: 'glow' }))
    at(t.glow, () => setPhase({ name: 'step', step: 1, pose: 'exit' }))
    at(t.exit, () => setPhase({ name: 'step', step: 2, pose: 'enter' }))
    at(t.enter, () => setPhase({ name: 'step', step: 2, pose: 'split' }))
    at(t.split, () => setPhase({ name: 'step', step: 2, pose: 'play' }))
    at(t.step2Play, () => setPhase({ name: 'step', step: 2, pose: 'glow' }))
    at(t.glow, () => setPhase({ name: 'step', step: 2, pose: 'exit' }))
    at(t.exit, () => setPhase({ name: 'step', step: 3, pose: 'enter' }))
    at(t.enter, () => setPhase({ name: 'step', step: 3, pose: 'split' }))
    at(t.split, () => setPhase({ name: 'step', step: 3, pose: 'play' }))
    at(t.step3Play, () => setPhase({ name: 'step', step: 3, pose: 'glow' }))
    at(t.glow, () => setPhase({ name: 'step', step: 3, pose: 'exit' }))
    at(t.exit, () => setPhase({ name: 'finale' }))

    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [started, instant])

  const liveRegion =
    phase.name === 'intro'
      ? `${dict.landing.howItWorks}. ${dict.landing.threeSteps}`
      : phase.name === 'step'
        ? `${processSteps[phase.step - 1]!.label}. ${processSteps[phase.step - 1]!.detail}`
        : `${dict.landing.howItWorks}. ${dict.landing.beginIntrospect}`

  return (
    <div className="relative flex h-full min-h-[18rem] w-full flex-col items-center justify-center overflow-hidden px-3 py-3 sm:min-h-[20rem] sm:px-5 lg:min-h-0 lg:py-2">
      <p className="sr-only" aria-live="polite">
        {liveRegion}
      </p>

      <AnimatePresence>
        {phase.name === 'intro' ? (
          <motion.div
            key="intro"
            className="absolute inset-0 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase.shown ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: (phase.shown ? timings.introIn : timings.introOut) / 1000,
              ease: EASE,
            }}
          >
            <IntroTitle
              howItWorks={dict.landing.howItWorks}
              threeSteps={dict.landing.threeSteps}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase.name === 'step' ? (
          <StepScene
            key={`step-${phase.step}`}
            pose={phase.pose}
            enterMs={timings.enter}
            splitMs={timings.split}
            exitMs={timings.exit}
            copy={
              <HiwStepCopy
                n={processSteps[phase.step - 1]!.n}
                label={processSteps[phase.step - 1]!.label}
                detail={processSteps[phase.step - 1]!.detail}
                Icon={processSteps[phase.step - 1]!.Icon}
              />
            }
            illustration={
              phase.step === 1 ? (
                <HiwFormSketch
                  playing={phase.pose === 'play' || phase.pose === 'glow'}
                  duration={timings.step1Play}
                />
              ) : phase.step === 2 ? (
                <HiwLivePreviewSketch
                  playing={phase.pose === 'play' || phase.pose === 'glow'}
                  duration={timings.step2Play}
                />
              ) : (
                <HiwWorkingWebsiteSketch
                  playing={phase.pose === 'play' || phase.pose === 'glow'}
                  duration={timings.step3Play}
                />
              )
            }
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase.name === 'finale' ? (
          <motion.div
            key="finale"
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4"
            initial={instant ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: timings.finaleIn / 1000, ease: EASE }}
          >
            <IntroTitle
              howItWorks={dict.landing.howItWorks}
              threeSteps={dict.landing.threeSteps}
            />
            {instant ? (
              <ol className="flex flex-col gap-1 text-center text-sm text-gray-700 sm:flex-row sm:gap-5">
                {processSteps.map((step) => (
                  <li key={step.n}>
                    <span className="font-semibold text-gray-900">
                      {step.n} {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
            <SpectrumFlipCta href={href('/introspect')}>
              {dict.landing.beginIntrospect}
            </SpectrumFlipCta>
          </motion.div>
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
  copy,
  illustration,
}: {
  pose: 'enter' | 'split' | 'play' | 'glow' | 'exit'
  enterMs: number
  splitMs: number
  exitMs: number
  copy: ReactNode
  illustration: ReactNode
}) {
  const showArt = pose !== 'enter'
  const glowing = pose === 'glow'
  const leaving = pose === 'exit'
  const copyDuration =
    pose === 'enter' ? enterMs / 1000 : pose === 'exit' ? exitMs / 1000 : splitMs / 1000

  return (
    <div className="absolute inset-0 grid grid-cols-1 items-center gap-5 px-3 sm:px-6 lg:grid-cols-2 lg:gap-0">
      <motion.div
        className="flex justify-center lg:justify-end lg:pr-8"
        initial={{ opacity: 0, x: -240 }}
        animate={{
          opacity: leaving ? 0 : 1,
          x: leaving ? 96 : 0,
        }}
        exit={{ opacity: 0, x: 96 }}
        transition={{ duration: copyDuration, ease: EASE }}
      >
        <div className={glowing ? 'hiw-glow' : undefined}>{copy}</div>
      </motion.div>
      <motion.div
        className="flex justify-center lg:justify-start lg:pl-8"
        initial={{ opacity: 0, x: 36 }}
        animate={{
          opacity: showArt && !leaving ? 1 : 0,
          x: showArt && !leaving ? 0 : 36,
        }}
        exit={{ opacity: 0, x: 36 }}
        transition={{ duration: splitMs / 1000, ease: EASE }}
        aria-hidden
      >
        <div className={glowing ? 'hiw-glow' : undefined}>{illustration}</div>
      </motion.div>
    </div>
  )
}
