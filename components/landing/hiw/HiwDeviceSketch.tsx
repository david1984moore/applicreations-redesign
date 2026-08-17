'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  C,
  ScenePage,
  type ExampleSceneId,
} from '@/components/pricing/ExampleScreenRotator'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const
const SCENE_FADE = 0.95
const SCROLL_S = 1.9
const DEVICE_FADE = 1.05
const LIVE_SCENES: ExampleSceneId[] = ['home', 'about', 'gallery', 'services']
const PHONE_SCENES: ExampleSceneId[] = ['gallery', 'products', 'contact']

function SiteScreen({ scene }: { scene: ExampleSceneId }) {
  return (
    <svg
      viewBox="0 0 228 200"
      className="block h-full w-full"
      style={{ textRendering: 'geometricPrecision' }}
    >
      <rect width="228" height="200" fill={C.paper} />
      <ScenePage scene={scene} />
    </svg>
  )
}

function ScreenNav({ count, active }: { count: number; active: number }) {
  const n = Math.max(count, 1)
  const w = n >= 6 ? 13 : n >= 5 ? 15 : 18
  const gap = n >= 6 ? 5 : 6
  const start = 12
  return (
    <svg
      viewBox="0 0 228 18"
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-auto w-full"
    >
      <rect width="228" height="18" fill={C.sand} />
      {Array.from({ length: n }, (_, i) => {
        const x = start + i * (w + gap)
        return (
          <rect
            key={x}
            x={x}
            y="5"
            width={w}
            height="7"
            rx="3.5"
            fill={i === active ? C.primary : C.line}
          />
        )
      })}
    </svg>
  )
}

function ScreenViewport({
  scene,
  scroll,
  navCount,
  navIndex,
}: {
  scene: ExampleSceneId
  scroll: number
  navCount: number
  navIndex: number
}) {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 w-full will-change-transform"
          style={{ height: '175%' }}
          animate={{ y: `${scroll}%` }}
          transition={{ duration: SCROLL_S, ease: EASE }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={scene}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: SCENE_FADE, ease: EASE }}
            >
              <SiteScreen scene={scene} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <ScreenNav count={navCount} active={navIndex} />
    </>
  )
}

function LaptopChrome({
  scene,
  scroll = 0,
  navCount,
  navIndex,
  className,
}: {
  scene: ExampleSceneId
  scroll?: number
  navCount: number
  navIndex: number
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 252 176"
        className="h-auto w-full drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)]"
      >
        <rect
          x="4"
          y="4"
          width="244"
          height="160"
          rx="16"
          fill="oklch(94% 0.015 80)"
          stroke="oklch(84% 0.03 80)"
        />
        <rect x="4" y="4" width="244" height="24" rx="16" fill="oklch(90% 0.02 80)" />
        <rect x="4" y="16" width="244" height="12" fill="oklch(90% 0.02 80)" />
        <circle cx="20" cy="16" r="3.5" fill="oklch(70% 0.12 25)" />
        <circle cx="32" cy="16" r="3.5" fill="oklch(78% 0.10 85)" />
        <circle cx="44" cy="16" r="3.5" fill="oklch(68% 0.10 155)" />
        <rect x="58" y="11" width="120" height="10" rx="5" fill="oklch(98% 0.008 85)" />
        <text
          x="118"
          y="18.4"
          textAnchor="middle"
          fill="oklch(55% 0.02 55)"
          fontSize="6.2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          cedar.co
        </text>
        <rect x="12" y="32" width="228" height="124" rx="10" fill={C.paper} />
        <rect x="96" y="166" width="60" height="6" rx="2" fill="oklch(88% 0.02 80)" />
      </svg>
      <div className="absolute overflow-hidden rounded-[10px] left-[4.76%] top-[18.18%] h-[70.45%] w-[90.48%]">
        <ScreenViewport
          scene={scene}
          scroll={scroll}
          navCount={navCount}
          navIndex={navIndex}
        />
      </div>
    </div>
  )
}

function PhoneChrome({
  scene,
  scroll = 0,
  navCount,
  navIndex,
  className,
}: {
  scene: ExampleSceneId
  scroll?: number
  navCount: number
  navIndex: number
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 132 248"
        className="h-auto w-full drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)]"
      >
        <rect x="4" y="4" width="124" height="240" rx="22" fill="oklch(28% 0.04 260)" />
        <rect x="10" y="14" width="112" height="220" rx="14" fill={C.paper} />
        <rect x="48" y="8" width="36" height="8" rx="4" fill="oklch(22% 0.03 260)" />
        <circle cx="66" cy="18" r="2.2" fill="oklch(18% 0.03 260)" />
        <rect x="54" y="232" width="24" height="4" rx="2" fill="oklch(78% 0.02 80)" />
      </svg>
      <div className="absolute overflow-hidden rounded-[12px] left-[7.6%] top-[5.65%] h-[88.7%] w-[84.8%]">
        <ScreenViewport
          scene={scene}
          scroll={scroll}
          navCount={navCount}
          navIndex={navIndex}
        />
      </div>
    </div>
  )
}

type SketchProps = {
  playing: boolean
  duration: number
}

export function HiwLivePreviewSketch({ playing, duration }: SketchProps) {
  const [device, setDevice] = useState<'laptop' | 'phone'>('laptop')
  const [scene, setScene] = useState<ExampleSceneId>('home')
  const [scroll, setScroll] = useState(0)
  const [navIndex, setNavIndex] = useState(0)

  useEffect(() => {
    if (!playing) {
      setDevice('laptop')
      setScene('home')
      setScroll(0)
      setNavIndex(0)
      return
    }
    const timers = [
      window.setTimeout(() => {
        setScroll(-16)
      }, duration * 0.12),
      window.setTimeout(() => {
        setScene(LIVE_SCENES[1]!)
        setNavIndex(1)
        setScroll(0)
      }, duration * 0.28),
      window.setTimeout(() => setScroll(-22), duration * 0.4),
      window.setTimeout(() => {
        setScene(LIVE_SCENES[2]!)
        setNavIndex(2)
        setScroll(-8)
      }, duration * 0.5),
      window.setTimeout(() => {
        setDevice('phone')
        setScene(PHONE_SCENES[0]!)
        setNavIndex(0)
        setScroll(0)
      }, duration * 0.58),
      window.setTimeout(() => setScroll(-26), duration * 0.7),
      window.setTimeout(() => {
        setScene(PHONE_SCENES[1]!)
        setNavIndex(1)
        setScroll(-10)
      }, duration * 0.82),
      window.setTimeout(() => setScroll(-24), duration * 0.9),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration])

  const laptopNav = LIVE_SCENES.length
  const phoneNav = PHONE_SCENES.length

  return (
    <div className="relative flex h-[11rem] w-[14rem] items-center justify-center sm:h-[12.5rem] sm:w-[16rem] lg:h-[14rem] lg:w-[17.5rem]">
      <AnimatePresence mode="wait" initial={false}>
        {device === 'laptop' ? (
          <motion.div
            key="laptop"
            className="relative w-[14rem] sm:w-[16rem] lg:w-[17.5rem]"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: DEVICE_FADE, ease: EASE }}
          >
            <LaptopChrome
              scene={scene}
              scroll={scroll}
              navCount={laptopNav}
              navIndex={navIndex}
              className="relative"
            />
          </motion.div>
        ) : (
          <motion.div
            key="phone"
            className="relative w-[6.75rem] sm:w-[7.5rem] lg:w-[8.25rem]"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: DEVICE_FADE, ease: EASE }}
          >
            <PhoneChrome
              scene={scene}
              scroll={scroll}
              navCount={phoneNav}
              navIndex={navIndex}
              className="relative"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HiwWorkingWebsiteSketch({ playing, duration }: SketchProps) {
  const [laptopScene, setLaptopScene] = useState<ExampleSceneId>('home')
  const [phoneScene, setPhoneScene] = useState<ExampleSceneId>('about')
  const [laptopScroll, setLaptopScroll] = useState(0)
  const [phoneScroll, setPhoneScroll] = useState(0)
  const [laptopNav, setLaptopNav] = useState(0)
  const [phoneNav, setPhoneNav] = useState(1)

  useEffect(() => {
    if (!playing) {
      setLaptopScene('home')
      setPhoneScene('about')
      setLaptopScroll(0)
      setPhoneScroll(0)
      setLaptopNav(0)
      setPhoneNav(1)
      return
    }
    const timers = [
      window.setTimeout(() => setLaptopScroll(-14), duration * 0.14),
      window.setTimeout(() => setPhoneScroll(-18), duration * 0.18),
      window.setTimeout(() => {
        setLaptopScene('about')
        setLaptopNav(1)
        setLaptopScroll(-6)
      }, duration * 0.36),
      window.setTimeout(() => {
        setPhoneScene('gallery')
        setPhoneNav(2)
        setPhoneScroll(-8)
      }, duration * 0.48),
      window.setTimeout(() => setPhoneScroll(-22), duration * 0.64),
      window.setTimeout(() => {
        setLaptopScene('contact')
        setLaptopNav(4)
        setLaptopScroll(0)
      }, duration * 0.72),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration])

  return (
    <div className="flex items-end gap-2 sm:gap-3 lg:gap-4">
      <div className="relative w-[10.5rem] sm:w-[12rem] lg:w-[13.5rem]">
        <LaptopChrome
          scene={laptopScene}
          scroll={laptopScroll}
          navCount={5}
          navIndex={laptopNav}
          className="relative"
        />
      </div>
      <div className="relative w-[5.75rem] sm:w-[6.5rem] lg:w-[7rem]">
        <PhoneChrome
          scene={phoneScene}
          scroll={phoneScroll}
          navCount={5}
          navIndex={phoneNav}
          className="relative"
        />
      </div>
    </div>
  )
}
