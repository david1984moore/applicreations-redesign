'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion } from 'framer-motion'
import { C } from '@/components/pricing/ExampleScreenRotator'
import { Backdrop, Rocks, Worker } from '@/components/landing/hiw/HiwConstructionSketch'
import { HiwWorkingWebsiteSketch } from '@/components/landing/hiw/HiwDeviceSketch'

const EASE = [0.22, 1, 0.36, 1] as const
const CROSS = { duration: 1.05, ease: EASE }
const SCREENS_CROSS = { duration: 1.12, ease: EASE }
const SOFT = { duration: 0.86, ease: EASE }

/** Keep a fading layer mounted through its opacity out, then drop it so it cannot flash later. */
function useKeepMounted(active: boolean, holdMs: number) {
  const [held, setHeld] = useState(active)

  useEffect(() => {
    if (active) {
      setHeld(true)
      return
    }
    const id = window.setTimeout(() => setHeld(false), holdMs)
    return () => window.clearTimeout(id)
  }, [active, holdMs])

  return active || held
}

const HAT = 'oklch(84% 0.17 92)'
const HAT_BRIM = 'oklch(76% 0.15 88)'
const VEST = 'oklch(66% 0.19 48)'
const STRIPE = 'oklch(97% 0.012 95)'
const PANTS = 'oklch(28% 0.07 255)'
const PANT_D = 'oklch(24% 0.06 252)'
const BOOT = 'oklch(22% 0.04 250)'
const SKIN = 'oklch(82% 0.06 55)'
const SKIN_D = 'oklch(74% 0.055 52)'
const WOOD = 'oklch(62% 0.08 62)'
const WOOD_D = 'oklch(48% 0.07 55)'
const WOOD_L = 'oklch(70% 0.07 68)'
const ROOF = 'oklch(40% 0.08 40)'
const ROOF_EDGE = 'oklch(32% 0.07 38)'
const ROOF_FINE = 'oklch(44% 0.1 38)'
const CONCRETE = 'oklch(72% 0.03 75)'
const CONCRETE_DARK = 'oklch(62% 0.035 70)'
const DRESS = 'oklch(62% 0.13 18)'
const DRESS_D = 'oklch(54% 0.12 16)'
const BLOUSE = 'oklch(96% 0.012 85)'
const FIGURE = 1.28
/** Color washes — slow dissolve so paint never stamps on. */
const WASH = { duration: 1.02, ease: [0.22, 1, 0.36, 1] as const }
/** Additive pieces rise into place after the wash has started. */
const SETTLE = { duration: 1.16, ease: [0.16, 1, 0.28, 1] as const }
/** Last item in a polish cascade. Keep stage gaps longer than this. */
const POLISH_TAIL_S = 0.3
/** Authored against the desktop house beat. Scaled to `duration`. */
const HOUSE_POLISH_CLOCK_MS = 9800
/** Paint + flowers, then shutters + yard, then garage + car. */
const HOUSE_POLISH_AT_MS = [1100, 3180, 5260] as const
/** Smoke starts this far before the house-to-screens cut, so it reads as “lived in.” */
const HOUSE_SMOKE_LEAD_MS = 2800
/** Authored against the desktop switch beat. Scaled to `duration`. */
const SWITCH_CLOCK_MS = 5200
const SWITCH_GRAB_AT_MS = 1080
const SWITCH_THROW_AT_MS = 1980
const SWITCH_LIVE_AT_MS = 2860
const THROW = { duration: 0.82, ease: [0.18, 0.72, 0.22, 1] as const }
const REACH = { duration: 0.7, ease: EASE }
const COPPER = 'oklch(62% 0.12 55)'
const COPPER_D = 'oklch(48% 0.11 50)'
const BAKELITE = 'oklch(22% 0.02 260)'
const STEEL = 'oklch(52% 0.02 250)'
const STEEL_D = 'oklch(40% 0.02 255)'
const ZAP_CORE = 'oklch(90% 0.14 95)'
/** Canonical zigzag (u along the wire). The same corners stretch, then get eaten from the box. */
const ZAP_ZIGS = [
  { u: 0, side: 0, amp: 0 },
  { u: 0.13, side: 1, amp: 6.4 },
  { u: 0.3, side: -1, amp: 9.2 },
  { u: 0.46, side: 1, amp: 4.2 },
  { u: 0.56, side: 1, amp: 8.1 },
  { u: 0.74, side: -1, amp: 8.8 },
  { u: 0.89, side: 1, amp: 5.6 },
  { u: 1, side: 0, amp: 0 },
] as const
const TRUNK = 'oklch(46% 0.09 55)'
const LEAF = 'oklch(58% 0.12 145)'
const LEAF_D = 'oklch(50% 0.11 150)'
const LEAF_L = 'oklch(66% 0.11 140)'
const ASPHALT = 'oklch(58% 0.02 260)'
const ASPHALT_L = 'oklch(68% 0.02 260)'
const CAR = 'oklch(42% 0.08 255)'

export type ReviewBeat =
  | 'review'
  | 'clear'
  | 'revise'
  | 'house'
  | 'houseGap'
  | 'fineTune'
  | 'andFinally'
  | 'switch'
  | 'screens'
type PointAt = 'window' | 'door' | 'roof'
type SwitchPose = 'reach' | 'grab' | 'throw' | 'live'

type HiwStep3CinemaProps = {
  playing: boolean
  reviewMs: number
  captionGapMs: number
  reviseMs: number
  /** “Adjusting” holds this long, then a caption gap, then “Fine-tuning”. */
  adjustMs: number
  /** “Fine-tuning” holds this long, then a caption gap, then “… and then”. */
  tuneMs: number
  /** Dots, then “and then”, then this beat cuts to the switch. */
  finallyMs: number
  switchMs: number
  screensMs: number
  onBeat?: (beat: ReviewBeat) => void
}

export function HiwStep3Cinema({
  playing,
  reviewMs,
  captionGapMs,
  reviseMs,
  adjustMs,
  tuneMs,
  finallyMs,
  switchMs,
  screensMs,
  onBeat,
}: HiwStep3CinemaProps) {
  const [beat, setBeat] = useState<ReviewBeat>('review')
  const [screensReady, setScreensReady] = useState(false)
  const onBeatRef = useRef(onBeat)
  onBeatRef.current = onBeat

  const tableOn = beat === 'review' || beat === 'clear' || beat === 'revise'
  const houseOn =
    beat === 'house' ||
    beat === 'houseGap' ||
    beat === 'fineTune' ||
    beat === 'andFinally'
  const switchOn = beat === 'switch'
  const screensOn = beat === 'screens'
  const showReview = useKeepMounted(tableOn, CROSS.duration * 1000)
  const showHouse = useKeepMounted(houseOn, CROSS.duration * 1000)
  const showSwitch = useKeepMounted(switchOn, CROSS.duration * 1000)
  const showScreens = useKeepMounted(screensOn, SCREENS_CROSS.duration * 1000)

  useEffect(() => {
    if (!playing) return

    setBeat('review')
    setScreensReady(false)
    onBeatRef.current?.('review')

    const reviseAt = reviewMs + captionGapMs
    const houseAt = reviseAt + reviseMs + captionGapMs
    const finallyAt = houseAt + adjustMs + captionGapMs + tuneMs + captionGapMs
    const switchAt = finallyAt + finallyMs
    const timers = [
      window.setTimeout(() => {
        setBeat('clear')
        onBeatRef.current?.('clear')
      }, reviewMs),
      window.setTimeout(() => {
        setBeat('revise')
        onBeatRef.current?.('revise')
      }, reviseAt),
      window.setTimeout(() => {
        setBeat('clear')
        onBeatRef.current?.('clear')
      }, reviseAt + reviseMs),
      window.setTimeout(() => {
        setBeat('house')
        onBeatRef.current?.('house')
      }, houseAt),
      window.setTimeout(() => {
        setBeat('houseGap')
        onBeatRef.current?.('houseGap')
      }, houseAt + adjustMs),
      window.setTimeout(() => {
        setBeat('fineTune')
        onBeatRef.current?.('fineTune')
      }, houseAt + adjustMs + captionGapMs),
      window.setTimeout(() => {
        setBeat('houseGap')
        onBeatRef.current?.('houseGap')
      }, houseAt + adjustMs + captionGapMs + tuneMs),
      window.setTimeout(() => {
        setBeat('andFinally')
        onBeatRef.current?.('andFinally')
      }, finallyAt),
      window.setTimeout(() => {
        setBeat('switch')
        onBeatRef.current?.('switch')
      }, switchAt),
      window.setTimeout(() => {
        setBeat('screens')
        setScreensReady(true)
        onBeatRef.current?.('screens')
      }, switchAt + switchMs),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [
    playing,
    reviewMs,
    captionGapMs,
    reviseMs,
    adjustMs,
    tuneMs,
    finallyMs,
    switchMs,
  ])

  return (
    <div className="relative isolate w-full min-h-[13.75rem] overflow-visible sm:min-h-[16rem] lg:min-h-[18.5rem]">
      {showReview ? (
        <motion.div
          className="absolute inset-0 flex items-end justify-center max-lg:items-start"
          initial={false}
          animate={{ opacity: tableOn ? 1 : 0 }}
          transition={CROSS}
          aria-hidden
        >
          <TableReview playing={playing && tableOn} />
        </motion.div>
      ) : null}

      {showHouse ? (
        <motion.div
          className="absolute inset-0 flex items-end justify-center max-lg:items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: houseOn ? 1 : 0 }}
          transition={CROSS}
          aria-hidden
        >
          <HouseWalkthrough
            playing={playing && houseOn}
            duration={adjustMs + captionGapMs + tuneMs + captionGapMs + finallyMs}
          />
        </motion.div>
      ) : null}

      {showSwitch ? (
        <motion.div
          className="absolute inset-0 flex items-end justify-center max-lg:items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: switchOn ? 1 : 0 }}
          transition={CROSS}
          aria-hidden
        >
          <SwitchThrow
            playing={playing && switchOn}
            duration={Math.min(switchMs, SWITCH_CLOCK_MS)}
          />
        </motion.div>
      ) : null}

      {showScreens ? (
        <motion.div
          className="absolute inset-0 flex items-start justify-center overflow-visible pt-1 sm:pt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: screensOn ? 1 : 0 }}
          transition={SCREENS_CROSS}
          aria-hidden
        >
          {screensReady ? (
            <HiwWorkingWebsiteSketch
              playing={playing && screensOn}
              duration={screensMs}
              entrance="fade"
            />
          ) : null}
        </motion.div>
      ) : null}
    </div>
  )
}

function TableReview({ playing }: { playing: boolean }) {
  const talk = useTalkCycle(playing)

  return (
    <svg
      viewBox="48 16 284 168"
      preserveAspectRatio="xMidYMax meet"
      className="h-auto w-full overflow-visible"
      aria-hidden
    >
      <ellipse cx="186" cy="176" rx="108" ry="7" fill="oklch(78% 0.03 75 / 0.32)" />

      <SideChair x={98} y={156} />
      <SideChair x={274} y={156} flip />

      <rect x="136" y="136" width="6" height="40.6" rx="1.1" fill={WOOD_D} />
      <rect x="152" y="136" width="5.2" height="40.6" rx="1" fill={WOOD} />
      <rect x="220" y="136" width="5.2" height="40.6" rx="1" fill={WOOD} />
      <rect x="236" y="136" width="6" height="40.6" rx="1.1" fill={WOOD_D} />
      <rect x="130" y="126" width="118" height="10" rx="2" fill={WOOD} />
      <rect x="132" y="124.6" width="114" height="3.2" rx="1.3" fill={WOOD_L} />

      <ReviewLaptop x={161} y={98} />
      <ellipse cx="206" cy="127" rx="6.2" ry="2.3" fill={C.cream} stroke={C.navy} strokeWidth="0.7" />
      <ellipse cx="206" cy="124.6" rx="4" ry="1.4" fill={C.skySoft} />

      <SitClient x={102} talking={talk < 0.5} />
      <SitBuilder x={272} talking={talk >= 0.5} />

      <SpeechDots x={103} y={48} visible={talk < 0.5} />
      <SpeechDots x={272} y={32} visible={talk >= 0.5} />
    </svg>
  )
}

function HouseWalkthrough({
  playing,
  duration,
}: {
  playing: boolean
  duration: number
}) {
  const [polish, setPolish] = useState(0)
  const [point, setPoint] = useState<PointAt>('window')
  const [smoking, setSmoking] = useState(false)
  const talk = useTalkCycle(playing)

  useEffect(() => {
    if (!playing) {
      setPolish(0)
      setPoint('window')
      return
    }
    setSmoking(false)
    const clock = duration / HOUSE_POLISH_CLOCK_MS
    const at = (ms: number) => Math.round(ms * clock)
    const paintAt = at(HOUSE_POLISH_AT_MS[0])
    const yardAt = at(HOUSE_POLISH_AT_MS[1])
    const garageAt = at(HOUSE_POLISH_AT_MS[2])
    const polishInMs = (SETTLE.duration + POLISH_TAIL_S) * 1000
    const smokeAt = Math.max(
      garageAt + polishInMs + 400,
      duration - HOUSE_SMOKE_LEAD_MS,
    )
    const timers = [
      window.setTimeout(() => {
        setPolish(1)
        setPoint('door')
      }, paintAt),
      window.setTimeout(() => {
        setPolish(2)
        setPoint('roof')
      }, yardAt),
      window.setTimeout(() => {
        setPolish(3)
      }, garageAt),
      window.setTimeout(() => {
        setSmoking(true)
      }, smokeAt),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration])

  return (
    <svg
      viewBox="16 4 492 178"
      preserveAspectRatio="xMidYMax meet"
      className="h-auto w-full overflow-visible"
      aria-hidden
    >
      <ellipse cx="220" cy="172" rx="168" ry="7" fill="oklch(78% 0.03 75 / 0.28)" />
      <g transform="translate(412 172) scale(1.36) translate(-384 -170)">
        <Backdrop />
        <Rocks />
      </g>

      <g transform="translate(208 170) scale(1.48) translate(-217 -162)">
        <WalkHouse polish={polish} smoking={smoking} />
      </g>

      <ClientWoman talking={talk < 0.5} point={point} />
      <g transform="translate(0 9)">
        <Worker phase="walls" swinging={playing} />
      </g>

      <SpeechDots x={62} y={34} visible={playing && talk < 0.5} />
      <SpeechDots x={292} y={12} visible={playing && talk >= 0.5} />
    </svg>
  )
}

/** Wall knife-switch. Box placement is locked. 0° = handle straight up. */
const SWITCH_PIVOT = { x: 122, y: 116 }
const SWITCH_OPEN = 40
const SWITCH_CLOSED = 6
const SWITCH_GRIP = 42.4
const SWITCH_WIRE = 'M114.8 66.8 C112.6 48.4 113.8 30.2 116.8 10'
const WIRE_INK = 'oklch(16% 0.02 260)'

/**
 * Switch-beat worker, authored in construction-man local units (hip = origin),
 * then placed with SWITCH_HIP / SWITCH_SCALE. Facing the box (left).
 */
const SWITCH_HIP = { x: 192, y: 120 }
const SWITCH_SCALE = 1.78
const SWITCH_REACH = { x: -6.8, y: -20.4 }
const SWITCH_IDLE = { x: 9.2, y: -18.8 }
const SWITCH_UPPER = 11.2
const SWITCH_LOWER = 12.2

function leverGrip(deg: number) {
  const r = (deg * Math.PI) / 180
  return {
    x: SWITCH_PIVOT.x + SWITCH_GRIP * Math.sin(r),
    y: SWITCH_PIVOT.y - SWITCH_GRIP * Math.cos(r),
  }
}

function rotateAround(
  x: number,
  y: number,
  ox: number,
  oy: number,
  deg: number,
) {
  const r = (deg * Math.PI) / 180
  const dx = x - ox
  const dy = y - oy
  return {
    x: ox + dx * Math.cos(r) - dy * Math.sin(r),
    y: oy + dx * Math.sin(r) + dy * Math.cos(r),
  }
}

function twoBoneIk(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  upper: number,
  lower: number,
  bend: 1 | -1,
) {
  const dx = tx - sx
  const dy = ty - sy
  const reach = upper + lower
  const d = Math.min(Math.max(Math.hypot(dx, dy), 1.2), reach - 0.4)
  const base = (Math.atan2(dy, dx) * 180) / Math.PI
  const cosA = (upper * upper + d * d - lower * lower) / (2 * upper * d)
  const cosB = (upper * upper + lower * lower - d * d) / (2 * upper * lower)
  const a = (Math.acos(Math.min(1, Math.max(-1, cosA))) * 180) / Math.PI
  const b = (Math.acos(Math.min(1, Math.max(-1, cosB))) * 180) / Math.PI
  return {
    shoulder: base - bend * a,
    elbow: bend * (180 - b),
  }
}

function SwitchThrow({
  playing,
  duration,
}: {
  playing: boolean
  duration: number
}) {
  const [pose, setPose] = useState<SwitchPose>('reach')
  const [leverDeg, setLeverDeg] = useState(SWITCH_OPEN)
  const leverRef = useRef(SWITCH_OPEN)
  const [idleShoulder, setIdleShoulder] = useState(58)
  const [idleElbow, setIdleElbow] = useState(12)
  const [leanDeg, setLeanDeg] = useState(-3)
  const idleShoulderRef = useRef(58)
  const idleElbowRef = useRef(12)
  const leanRef = useRef(-3)

  useEffect(() => {
    if (!playing) {
      setPose('reach')
      return
    }
    const clock = duration / SWITCH_CLOCK_MS
    const at = (ms: number) => Math.round(ms * clock)
    const timers = [
      window.setTimeout(() => setPose('grab'), at(SWITCH_GRAB_AT_MS)),
      window.setTimeout(() => setPose('throw'), at(SWITCH_THROW_AT_MS)),
      window.setTimeout(() => setPose('live'), at(SWITCH_LIVE_AT_MS)),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration])

  useEffect(() => {
    if (!playing) {
      leverRef.current = SWITCH_OPEN
      setLeverDeg(SWITCH_OPEN)
      return
    }
    const dest = pose === 'throw' || pose === 'live' ? SWITCH_CLOSED : SWITCH_OPEN
    const controls = animate(leverRef.current, dest, {
      ...(dest === SWITCH_CLOSED ? THROW : REACH),
      onUpdate: (value) => {
        leverRef.current = value
        setLeverDeg(value)
      },
    })
    return () => controls.stop()
  }, [playing, pose])

  useEffect(() => {
    if (!playing) {
      idleShoulderRef.current = 58
      idleElbowRef.current = 12
      leanRef.current = -3
      setIdleShoulder(58)
      setIdleElbow(12)
      setLeanDeg(-3)
      return
    }
    const destShoulder = pose === 'throw' || pose === 'live' ? 50 : 58
    const destElbow = pose === 'throw' || pose === 'live' ? 22 : 12
    const destLean = pose === 'throw' || pose === 'live' ? -16 : pose === 'grab' ? -8 : -3
    const ease = pose === 'throw' || pose === 'live' ? THROW : REACH
    const a = animate(idleShoulderRef.current, destShoulder, {
      ...ease,
      onUpdate: (value) => {
        idleShoulderRef.current = value
        setIdleShoulder(value)
      },
    })
    const b = animate(idleElbowRef.current, destElbow, {
      ...ease,
      onUpdate: (value) => {
        idleElbowRef.current = value
        setIdleElbow(value)
      },
    })
    const c = animate(leanRef.current, destLean, {
      ...ease,
      onUpdate: (value) => {
        leanRef.current = value
        setLeanDeg(value)
      },
    })
    return () => {
      a.stop()
      b.stop()
      c.stop()
    }
  }, [playing, pose])

  const grabbed = pose !== 'reach'
  const live = pose === 'live'
  const lean = leanDeg
  const grip = leverGrip(leverDeg)
  const shoulderWorld = {
    x: SWITCH_HIP.x + SWITCH_REACH.x * SWITCH_SCALE,
    y: SWITCH_HIP.y + SWITCH_REACH.y * SWITCH_SCALE,
  }
  const worldTarget = grabbed
    ? grip
    : {
        x: grip.x + (shoulderWorld.x - grip.x) * 0.08,
        y: grip.y + (shoulderWorld.y - grip.y) * 0.08,
      }
  const localTarget = rotateAround(
    (worldTarget.x - SWITCH_HIP.x) / SWITCH_SCALE,
    (worldTarget.y - SWITCH_HIP.y) / SWITCH_SCALE,
    0,
    0,
    -lean,
  )
  const reach = twoBoneIk(
    SWITCH_REACH.x,
    SWITCH_REACH.y,
    localTarget.x,
    localTarget.y,
    SWITCH_UPPER,
    SWITCH_LOWER,
    1,
  )
  const leverAt = `translate(${SWITCH_PIVOT.x} ${SWITCH_PIVOT.y}) rotate(${leverDeg})`

  return (
    <svg
      viewBox="92 16 180 160"
      preserveAspectRatio="xMidYMid meet"
      className="h-auto w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <clipPath id="hiw-switch-frame">
          <rect x="92" y="16" width="180" height="160" />
        </clipPath>
      </defs>

      <ellipse cx="176" cy="168" rx="54" ry="7.6" fill="oklch(78% 0.03 75 / 0.34)" />

      <KnifeSwitchBase />

      <g clipPath="url(#hiw-switch-frame)">
        <SwitchLead />
      </g>

      <g transform={leverAt}>
        <KnifeLever />
      </g>

      <g transform={`translate(${SWITCH_HIP.x} ${SWITCH_HIP.y}) scale(${SWITCH_SCALE})`}>
        <SwitchLegs />
        <g transform={`rotate(${lean})`}>
          <SwitchArm
            x={SWITCH_IDLE.x}
            y={SWITCH_IDLE.y}
            shoulder={idleShoulder}
            elbow={idleElbow}
            upper={7.4}
            lower={7.8}
            r1={2.7}
            r2={2.3}
            r3={2}
            fill={SKIN_D}
            sleeve={2.4}
          />
          <SwitchTorso />
          <SwitchArm
            x={SWITCH_REACH.x}
            y={SWITCH_REACH.y}
            shoulder={reach.shoulder}
            elbow={reach.elbow}
            upper={SWITCH_UPPER}
            lower={SWITCH_LOWER}
            r1={2.9}
            r2={2.4}
            r3={2}
            fill={SKIN}
            sleeve={2.8}
            hand={!grabbed}
          />
          <SwitchHead />
        </g>
      </g>

      {grabbed ? (
        <g transform={leverAt}>
          <GripHand />
        </g>
      ) : null}

      <SwitchZap live={live} duration={duration} />
    </svg>
  )
}

function SwitchLegs() {
  return (
    <g>
      <Limb x1={1.8} y1={0} x2={4.4} y2={14.2} r1={3.9} r2={3.2} fill={PANT_D} />
      <Limb x1={4.4} y1={14.2} x2={6} y2={27} r1={3.2} r2={2.6} fill={PANT_D} />
      <SwitchBoot x={6} y={27} />

      <Limb x1={-2} y1={0} x2={-7} y2={14} r1={4} r2={3.3} fill={PANTS} />
      <Limb x1={-7} y1={14} x2={-10.2} y2={27.2} r1={3.3} r2={2.6} fill={PANTS} />
      <SwitchBoot x={-10.2} y={27.2} flip />

      <path
        d="M-5.2 -1.6 C-4.6 2.2 5.2 2.4 5.8 -1.6 C4.8 -4.2 -4.2 -4.4 -5.2 -1.6 Z"
        fill={PANTS}
      />
    </g>
  )
}

function SwitchBoot({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1}, 1)`}>
      <ellipse cx="2.2" cy="0" rx="5.2" ry="2.4" fill={BOOT} />
      <rect x="-2.2" y="-3.2" width="6.4" height="3.4" rx="1.4" fill={BOOT} />
    </g>
  )
}

function SwitchTorso() {
  return (
    <g>
      <g transform="translate(0.2 -12.2)">
        <rect x="-7.2" y="-13" width="16.4" height="27.4" rx="6.2" fill={VEST} />
        <rect x="-5.4" y="-3.4" width="13" height="3.6" rx="1.6" fill={STRIPE} />
        <rect x="-5.4" y="3.6" width="13" height="3.6" rx="1.6" fill={STRIPE} />
      </g>
      <ellipse cx={SWITCH_IDLE.x} cy={SWITCH_IDLE.y} rx="3.4" ry="3.1" fill={VEST} />
      <ellipse cx={SWITCH_REACH.x} cy={SWITCH_REACH.y} rx="3.6" ry="3.2" fill={VEST} />
      <ellipse cx="0.3" cy="-25" rx="2.5" ry="3.8" fill={SKIN} />
    </g>
  )
}

/** Same language as the construction worker: beige circle, hat, no face ink. */
function SwitchHead() {
  return (
    <g transform="translate(0.5 -31.4) rotate(-10)">
      <circle cx="0.4" cy="2.4" r="7.4" fill={SKIN} />
      <circle cx="-6.9" cy="3.7" r="2" fill={SKIN} />
      <ellipse cx="0.6" cy="-3.8" rx="9.2" ry="1.95" fill={HAT_BRIM} />
      <path
        d="M-5.4 -4 C-5.6 -11.2 -1.2 -15.4 1.6 -15.6 C5.4 -15.8 8.2 -11.4 7.8 -4 Z"
        fill={HAT}
      />
    </g>
  )
}

/** Same joint math as the construction worker — SVG rotate around the shoulder, not the limb bbox. */
function SwitchArm({
  x,
  y,
  shoulder,
  elbow,
  upper,
  lower,
  r1,
  r2,
  r3,
  fill,
  sleeve = 0,
  hand = false,
}: {
  x: number
  y: number
  shoulder: number
  elbow: number
  upper: number
  lower: number
  r1: number
  r2: number
  r3: number
  fill: string
  sleeve?: number
  hand?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${shoulder})`}>
      <Limb x1={0} y1={0} x2={upper} y2={0} r1={r1} r2={r2} fill={fill} />
      {sleeve > 0 ? (
        <Limb x1={0} y1={0} x2={sleeve} y2={0} r1={r1 + 0.55} r2={r2 + 0.15} fill={VEST} />
      ) : null}
      <g transform={`translate(${upper} 0) rotate(${elbow})`}>
        <Limb x1={0} y1={0} x2={lower} y2={0} r1={r2} r2={r3} fill={fill} />
        <circle cx={lower} cy={0} r={r3} fill={fill} />
        {hand ? (
          <ellipse cx={lower + 2.1} cy={-0.1} rx="1.3" ry="1.1" fill={fill} />
        ) : null}
      </g>
    </g>
  )
}

function KnifeSwitchBase() {
  return (
    <g>
      <path
        d="M98 72 L134 64 L140 70 L104 78 Z"
        fill="oklch(30% 0.02 255)"
        stroke={C.navy}
        strokeWidth="1.05"
        strokeLinejoin="round"
      />
      <path
        d="M134 64 L140 70 L142 122 L136 116 Z"
        fill="oklch(26% 0.02 255)"
        stroke={C.navy}
        strokeWidth="0.95"
        strokeLinejoin="round"
      />
      <path
        d="M104 78 L140 70 L142 122 L106 130 Z"
        fill="oklch(38% 0.02 255)"
        stroke={C.navy}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />

      <rect x="116.4" y="112.6" width="6.2" height="7" rx="1" fill={STEEL_D} stroke={C.navy} strokeWidth="0.7" />
      <rect x="124.8" y="110.8" width="6.2" height="7" rx="1" fill={STEEL} stroke={C.navy} strokeWidth="0.7" />
      <circle cx="119.5" cy="116.2" r="1.2" fill={C.gold} />
      <circle cx="127.9" cy="114.4" r="1.2" fill={C.gold} />

      <ContactJaw x={112.4} y={86.2} />
      <ContactJaw x={124.6} y={83.4} />

      <ellipse
        cx="114.8"
        cy="66.8"
        rx="3.1"
        ry="1.6"
        fill={WIRE_INK}
        stroke={C.navy}
        strokeWidth="0.7"
      />
      <ellipse cx="114.8" cy="66.8" rx="1.35" ry="0.7" fill={COPPER} />
    </g>
  )
}

function ContactJaw({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-1.4" y="2.4" width="6.2" height="6.4" rx="0.8" fill={WOOD_D} stroke={C.navy} strokeWidth="0.6" />
      <path
        d="M-2 2.6 L-2 -8.4 L0.4 -9.2 L0.4 2.4 Z"
        fill={COPPER}
        stroke={C.navy}
        strokeWidth="0.7"
      />
      <path
        d="M3.2 2.6 L3.2 -8.4 L5.6 -9.2 L5.6 2.4 Z"
        fill={COPPER_D}
        stroke={C.navy}
        strokeWidth="0.7"
      />
      <path d="M0.4 -7.2 H3.2" stroke={C.gold} strokeWidth="0.85" />
    </g>
  )
}

function KnifeLever() {
  return (
    <g>
      <rect x="-8.2" y="-30.6" width="5" height="29" rx="1.3" fill={COPPER_D} stroke={C.navy} strokeWidth="0.85" />
      <rect x="3.2" y="-30.6" width="5" height="29" rx="1.3" fill={COPPER} stroke={C.navy} strokeWidth="0.85" />
      <rect x="-9.4" y="-34.6" width="18.8" height="5.6" rx="1.4" fill={STEEL} stroke={C.navy} strokeWidth="0.9" />
      <rect x="-7.6" y="-33.6" width="15.2" height="2" rx="0.7" fill={STEEL_D} />
      <rect x="-3.4" y="-52.8" width="6.8" height="20.8" rx="2.6" fill={BAKELITE} stroke={C.navy} strokeWidth="0.85" />
      <rect x="-1.8" y="-50.6" width="1.8" height="16.4" rx="0.8" fill="oklch(32% 0.015 260)" />
      <ellipse cx="0" cy="-52.4" rx="3.5" ry="3.2" fill={BAKELITE} stroke={C.navy} strokeWidth="0.8" />
    </g>
  )
}

function GripHand() {
  return (
    <g transform="translate(0 -42.4)">
      <ellipse cx="0.2" cy="1.2" rx="3.8" ry="2.9" fill={SKIN} />
      <ellipse cx="-2.8" cy="-0.1" rx="1.15" ry="1.85" fill={SKIN} />
      <ellipse cx="-0.9" cy="-1.55" rx="1.05" ry="2" fill={SKIN} />
      <ellipse cx="0.8" cy="-1.6" rx="1" ry="1.9" fill={SKIN} />
      <ellipse cx="2.4" cy="-0.75" rx="0.95" ry="1.65" fill={SKIN} />
    </g>
  )
}

function SwitchLead() {
  return (
    <g>
      <path
        d={SWITCH_WIRE}
        fill="none"
        stroke={C.navy}
        strokeWidth="4.2"
        strokeLinecap="butt"
      />
      <path
        d={SWITCH_WIRE}
        fill="none"
        stroke={WIRE_INK}
        strokeWidth="2.7"
        strokeLinecap="butt"
      />
    </g>
  )
}

function cubic(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

function dcubic(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2)
}

function alongSwitchWire(t: number) {
  const x = cubic(t, 114.8, 112.6, 113.8, 116.8)
  const y = cubic(t, 66.8, 48.4, 30.2, 10)
  const tx = dcubic(t, 114.8, 112.6, 113.8, 116.8)
  const ty = dcubic(t, 66.8, 48.4, 30.2, 10)
  const len = Math.hypot(tx, ty) || 1
  return { x, y, nx: -ty / len, ny: tx / len }
}

type ZapPt = { t: number; x: number; y: number }

function zapPoint(t: number, side: number, amp: number, ampK: number): ZapPt {
  const p = alongSwitchWire(t)
  const a = amp * ampK
  return { t, x: p.x + p.nx * a * side, y: p.y + p.ny * a * side }
}

function lerpZap(a: ZapPt, b: ZapPt, t: number): ZapPt {
  const span = Math.max(b.t - a.t, 1e-6)
  const f = (t - a.t) / span
  return {
    t,
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
  }
}

function atZapT(pts: ZapPt[], t: number) {
  const first = pts[0]
  if (!first) return { t, x: 114.8, y: 66.8 }
  if (t <= first.t) return first
  for (let i = 1; i < pts.length; i++) {
    const curr = pts[i]
    const prev = pts[i - 1]
    if (!curr || !prev) continue
    if (t <= curr.t) return lerpZap(prev, curr, t)
  }
  return pts[pts.length - 1] ?? first
}

/** Same zigzag stretched from the box to `head`, then clipped from `tail` so it eats itself. */
function zapZigzag(tail: number, head: number) {
  const span = Math.max(head, 0.001)
  const ampK = 0.4 + 0.6 * Math.min(span / 0.3, 1)
  const pts = ZAP_ZIGS.map(({ u, side, amp }) => zapPoint(u * span, side, amp, ampK))
  const from = Math.max(0, Math.min(tail, head))
  const to = Math.max(from, head)
  if (to - from < 0.012) return 'M114.8 66.8'

  const out: ZapPt[] = [atZapT(pts, from)]
  for (const p of pts) {
    if (p.t > from && p.t < to) out.push(p)
  }
  out.push(atZapT(pts, to))

  return out.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}

/**
 * Grow out of the box, stretch, then shoot. The box end stays put until the
 * shoot is underway, then retracts slowly and accelerates up the cord.
 */
function zapWindow(p: number) {
  let head: number
  if (p <= 0.22) {
    const u = p / 0.22
    head = 0.28 * (1 - (1 - u) * (1 - u))
  } else if (p <= 0.52) {
    const u = (p - 0.22) / 0.3
    head = 0.28 + 0.72 * u * u
  } else {
    head = 1
  }

  let tail: number
  if (p <= 0.28) {
    tail = 0
  } else if (p <= 0.52) {
    const u = (p - 0.28) / 0.24
    tail = 0.16 * u * u
  } else {
    const u = (p - 0.52) / 0.48
    tail = 0.16 + 0.84 * u * u
  }

  return { head, tail }
}

function SwitchZap({ live, duration }: { live: boolean; duration: number }) {
  const [clock, setClock] = useState(0)

  useEffect(() => {
    if (!live) {
      setClock(0)
      return
    }

    const zapS = 0.4
    const controls = animate(0, 1, {
      duration: zapS,
      ease: 'linear',
      onUpdate: setClock,
    })
    return () => controls.stop()
  }, [live, duration])

  const { head, tail } = zapWindow(clock)
  const span = Math.max(0, head - tail)
  const on = live && span > 0.02
  const d = on ? zapZigzag(tail, head) : 'M114.8 66.8'

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={C.navy}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={on ? 1 : 0}
      />
      <path
        d={d}
        fill="none"
        stroke={C.gold}
        strokeWidth="2.05"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={on ? 1 : 0}
      />
      <path
        d={d}
        fill="none"
        stroke={ZAP_CORE}
        strokeWidth="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={on ? 0.95 : 0}
      />
    </g>
  )
}

function SideChair({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1}, 1)`}>
      <rect x="-11" y="-58" width="11" height="54" rx="3.2" fill={WOOD_D} />
      <rect x="-8.6" y="-54" width="6.2" height="46" rx="2.2" fill={WOOD} />
      <rect x="-5.4" y="-48" width="2.2" height="34" rx="1" fill={WOOD_L} opacity="0.7" />
      <rect x="-11" y="-10" width="34" height="7" rx="2" fill={WOOD} />
      <rect x="-10" y="-9" width="32" height="2.4" rx="1" fill={WOOD_L} />
      <rect x="-8.4" y="-3.4" width="4.6" height="24" rx="1.2" fill={WOOD_D} />
      <rect x="14.2" y="-3.4" width="4.6" height="24" rx="1.2" fill={WOOD_D} />
      <rect x="-4.2" y="-3.4" width="3.2" height="20" rx="1" fill={WOOD} />
      <rect x="10.4" y="-3.4" width="3.2" height="20" rx="1" fill={WOOD} />
    </g>
  )
}

function polishWash(on: boolean, opacity = 1, delay = 0) {
  return {
    initial: false as const,
    animate: { opacity: on ? opacity : 0 },
    transition: { ...WASH, delay },
  }
}

function PolishArrive({
  on,
  delay = 0,
  rise = 5,
  children,
}: {
  on: boolean
  delay?: number
  rise?: number
  children: ReactNode
}) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : rise }}
      transition={{ ...SETTLE, delay }}
    >
      {children}
    </motion.g>
  )
}

function WalkHouse({ polish, smoking }: { polish: number; smoking: boolean }) {
  const painted = polish >= 1
  const finished = polish >= 2
  const expanded = polish >= 3

  return (
    <g>
      <PolishArrive on={expanded} rise={7}>
        <YardTree x={128} y={154} s={0.92} round />
        <YardTree x={262} y={154} s={0.72} />
      </PolishArrive>

      <rect
        x="176"
        y="152"
        width="82"
        height="10"
        rx="1.2"
        fill={CONCRETE}
        stroke={CONCRETE_DARK}
        strokeWidth="0.8"
      />
      <motion.path
        d="M215 162 L222 152 L230 152 L248 162 Z"
        fill="oklch(78% 0.04 70)"
        stroke={CONCRETE_DARK}
        strokeWidth="0.6"
        {...polishWash(painted, 1, 0.08)}
      />

      <PolishArrive on={expanded} delay={0.12} rise={6}>
        <path d="M118 162 L146 154 L182 154 L176 162 Z" fill={ASPHALT} />
        <path d="M118 162 L176 162 L168 166 L112 166 Z" fill={ASPHALT_L} />
        <rect
          x="144"
          y="154"
          width="38"
          height="8"
          rx="1"
          fill={CONCRETE}
          stroke={CONCRETE_DARK}
          strokeWidth="0.7"
        />
        <rect
          x="148"
          y="122"
          width="34"
          height="34"
          fill={C.cream}
          stroke={C.navy}
          strokeWidth="1.05"
        />
        <rect
          x="148"
          y="122"
          width="34"
          height="34"
          fill="oklch(94% 0.03 75)"
          opacity="0.92"
        />
        <path d="M145 124 L165 106 L185 124 Z" fill={ROOF_FINE} />
        <path d="M150 124 L165 110 L180 124 Z" fill={ROOF_EDGE} opacity="0.32" />
        <rect
          x="154"
          y="132"
          width="22"
          height="24"
          rx="0.8"
          fill="oklch(48% 0.04 250)"
          stroke={C.navy}
          strokeWidth="0.75"
        />
        <path
          d="M165 132 V156 M154 140 H176 M154 148 H176"
          stroke={C.navy}
          strokeWidth="0.55"
          opacity="0.7"
        />
        <rect x="174.4" y="142" width="1.5" height="2.2" rx="0.3" fill={C.gold} />
      </PolishArrive>
      <PolishArrive on={expanded} delay={POLISH_TAIL_S} rise={4}>
        <ParkedCar x={132} y={150} />
      </PolishArrive>

      <rect
        x="182"
        y="104"
        width="70"
        height="50"
        fill={C.cream}
        stroke={C.navy}
        strokeWidth="1.15"
      />
      <motion.rect
        x="182"
        y="104"
        width="70"
        height="50"
        fill="oklch(94% 0.03 75)"
        {...polishWash(painted, 0.92)}
      />
      <rect x="186" y="108" width="62" height="4" fill={C.sand} />
      <motion.rect
        x="186"
        y="108"
        width="62"
        height="4"
        fill={C.coral}
        {...polishWash(finished)}
      />

      <rect
        x="208"
        y="126"
        width="14"
        height="28"
        rx="1"
        fill="oklch(42% 0.06 55)"
        stroke={C.navy}
        strokeWidth="0.8"
      />
      <motion.rect
        x="208"
        y="126"
        width="14"
        height="28"
        rx="1"
        fill={C.coral}
        {...polishWash(painted, 1, 0.12)}
      />
      <circle cx="219.5" cy="141" r="1.05" fill={C.gold} />

      <Window x={188} y={114} />
      <Window x={226} y={114} />
      <PolishArrive on={painted} delay={0.22} rise={3}>
        <FlowerBox x={186} y={126} />
        <FlowerBox x={224} y={126} />
      </PolishArrive>
      <PolishArrive on={finished} delay={0.1} rise={3}>
        <Shutter x={182.6} y={114} />
        <Shutter x={204.2} y={114} />
        <Shutter x={220.6} y={114} />
        <Shutter x={242.2} y={114} />
      </PolishArrive>
      <PolishArrive on={finished} delay={POLISH_TAIL_S} rise={4}>
        <circle cx="201.6" cy="132" r="2.4" fill={C.gold} opacity="0.9" />
        <path d="M201.6 134.4 V146" stroke={C.navy} strokeWidth="0.7" />
        <rect x="198.8" y="144.6" width="5.6" height="7.4" rx="0.6" fill={WOOD} />
        <path
          d="M170 154 C174 146 180 144 184 148"
          fill="none"
          stroke="oklch(52% 0.12 145)"
          strokeWidth="1.4"
        />
        <ellipse cx="172" cy="146" rx="4.4" ry="5.2" fill={LEAF} />
        <ellipse cx="178" cy="143" rx="3.6" ry="4.4" fill={LEAF_L} />
        <ellipse cx="248" cy="148" rx="5" ry="5.6" fill={LEAF} />
        <ellipse cx="256" cy="150" rx="4.2" ry="4.6" fill={LEAF_L} />
        <rect x="264.2" y="146" width="1.5" height="8" rx="0.4" fill={WOOD_D} />
        <rect x="262.4" y="142.4" width="5.4" height="4.2" rx="0.7" fill={C.navy} />
        <rect x="266.6" y="143.6" width="1.6" height="1.5" rx="0.3" fill={C.coral} />
      </PolishArrive>

      <path d="M176 106 L217 70 L258 106 Z" fill={ROOF} />
      <path d="M182 106 L217 76 L252 106 Z" fill={ROOF_EDGE} opacity="0.35" />
      <motion.path
        d="M176 106 L217 70 L258 106 Z"
        fill={ROOF_FINE}
        {...polishWash(finished, 0.85, 0.08)}
      />
      <rect x="190" y="78" width="8" height="16" fill={C.navy} />
      <motion.rect
        x="190"
        y="74"
        width="8"
        height="4"
        fill={C.coral}
        {...polishWash(finished, 1, 0.16)}
      />
      <ChimneySmoke on={smoking} />
    </g>
  )
}

function ChimneySmoke({ on }: { on: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx={194}
          cy={72}
          rx={2.1}
          ry={1.8}
          fill="oklch(88% 0.008 80)"
          stroke="oklch(62% 0.02 70)"
          strokeWidth="0.4"
          animate={{
            cx: [194, 196.4, 199.6],
            cy: [72, 61, 48],
            rx: [1.3, 2.7, 4.1],
            ry: [1.1, 2.5, 3.7],
            opacity: [0, 0.72, 0],
          }}
          transition={{
            duration: 2.45,
            delay: i * 0.72,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.g>
  )
}

function YardTree({
  x,
  y,
  s = 1,
  round = false,
}: {
  x: number
  y: number
  s?: number
  round?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {round ? (
        <>
          <rect x="-2.4" y="-18" width="4.8" height="18" rx="1.3" fill={TRUNK} />
          <circle cx="-7" cy="-22" r="8.4" fill={LEAF_D} />
          <circle cx="7.2" cy="-21" r="7.8" fill={LEAF_L} />
          <circle cx="0" cy="-28" r="10.2" fill={LEAF} />
        </>
      ) : (
        <>
          <rect x="-1.7" y="-14" width="3.4" height="14" rx="1" fill={TRUNK} />
          <path d="M0 -34 L10.5 -15 H-10.5 Z" fill={LEAF_D} />
          <path d="M0 -28 L9 -12 H-9 Z" fill={LEAF} />
          <path d="M0 -20 L7.4 -6 H-7.4 Z" fill={LEAF_L} />
        </>
      )}
    </g>
  )
}

function ParkedCar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="14" cy="10.2" rx="13" ry="1.5" fill="oklch(70% 0.03 75 / 0.4)" />
      <rect x="1.2" y="3.4" width="24.6" height="6.2" rx="1.6" fill={CAR} />
      <path d="M6.2 3.4 L9.2 -1.6 H18.6 L22.4 3.4 Z" fill={CAR} />
      <path d="M9.6 -0.8 H18 L20.6 3.2 H7.8 Z" fill={C.skySoft} />
      <path d="M13.6 -0.8 V3.2" stroke={C.navy} strokeWidth="0.45" />
      <circle cx="7.2" cy="9.2" r="2.35" fill={C.ink} />
      <circle cx="7.2" cy="9.2" r="1" fill={C.muted} />
      <circle cx="20.6" cy="9.2" r="2.35" fill={C.ink} />
      <circle cx="20.6" cy="9.2" r="1" fill={C.muted} />
      <rect x="24.2" y="4.4" width="1.5" height="1.8" rx="0.3" fill={C.gold} />
      <rect x="1.4" y="4.6" width="1.2" height="1.6" rx="0.3" fill={C.coral} />
    </g>
  )
}

function Window({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width="16"
        height="13"
        rx="1"
        fill={C.skySoft}
        stroke={C.navy}
        strokeWidth="0.8"
      />
      <path d="M8 0 V13 M0 6.5 H16" stroke={C.navy} strokeWidth="0.7" />
    </g>
  )
}

function FlowerBox({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="20" height="4.2" rx="0.8" fill={WOOD_D} />
      <circle cx="4" cy="-1.2" r="2.1" fill={C.coral} />
      <circle cx="10" cy="-1.8" r="2.3" fill={C.gold} />
      <circle cx="16" cy="-1.1" r="2" fill={C.blush} />
    </g>
  )
}

function Shutter({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="5.2" height="13" rx="0.5" fill={C.seafoam} stroke={C.navy} strokeWidth="0.5" />
      <path d="M1 3.2 H4.2 M1 6.5 H4.2 M1 9.8 H4.2" stroke={C.navy} strokeWidth="0.45" />
    </g>
  )
}

function WomanHair({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx - 5.8} cy={cy + 1.4} rx="3.3" ry="3.1" fill={C.hair} />
      <path
        d={`M${cx - 5.6} ${cy + 2.2}
            C${cx - 7.2} ${cy - 3.8} ${cx - 3.4} ${cy - 8.8} ${cx + 0.2} ${cy - 9.1}
            C${cx + 2.2} ${cy - 9.2} ${cx + 3.4} ${cy - 6.8} ${cx + 2.4} ${cy - 4.8}
            C${cx + 1.2} ${cy - 6.6} ${cx - 1.4} ${cy - 5.8} ${cx - 3.6} ${cy - 2.6}
            C${cx - 4.8} ${cy - 0.6} ${cx - 5.6} ${cy + 2.2} ${cx - 5.6} ${cy + 2.2} Z`}
        fill={C.hair}
      />
    </g>
  )
}

function BodyLean({
  talking,
  children,
  pivot,
  amount,
}: {
  talking: boolean
  children: ReactNode
  pivot: { x: number; y: number }
  amount: number
}) {
  return (
    <g transform={`translate(${pivot.x} ${pivot.y})`}>
      <motion.g
        initial={false}
        animate={{ rotate: talking ? amount : 0 }}
        transition={SOFT}
      >
        <g transform={`translate(${-pivot.x} ${-pivot.y})`}>{children}</g>
      </motion.g>
    </g>
  )
}

function ClientWoman({ talking, point }: { talking: boolean; point: PointAt }) {
  const pose =
    point === 'window'
      ? { shoulder: -8, elbow: -18 }
      : point === 'door'
        ? { shoulder: 10, elbow: -22 }
        : { shoulder: -20, elbow: -24 }

  return (
    <g transform={`translate(46 170) scale(1.92)`}>
      <ellipse cx="1.4" cy="0.6" rx="5.6" ry="2.1" fill={C.hair} />
      <rect x="-4" y="-10" width="5.4" height="11" rx="2.2" fill="oklch(42% 0.04 260)" />
      <rect x="0.6" y="-9.8" width="5.6" height="10.8" rx="2.2" fill="oklch(36% 0.04 255)" />
      <BodyLean talking={talking} pivot={{ x: 0.6, y: -16 }} amount={-2.4}>
        <JointedArm
          x={-7.6}
          y={-24.6}
          shoulder={talking ? 102 : 108}
          elbow={talking ? 16 : 10}
          upper={7.2}
          lower={7.6}
          r1={2.4}
          r2={2.05}
          r3={1.8}
          fill={C.skin}
          sleeve={3.6}
          sleeveFill={BLOUSE}
        />
        <path
          d="M-6.6 -16.4 C-7.4 -6.8 -4.4 -2.4 0.4 -1.8 C6 -2.6 7.6 -8.6 6.4 -17 C4.8 -9.2 -3.6 -8.6 -6.6 -16.4 Z"
          fill={DRESS}
        />
        <path d="M-5.4 -16.8 C-4.8 -11.2 5.4 -11 6 -17 Z" fill={DRESS_D} />
        <path
          d="M-4.8 -16.4
             C-6.8 -18.6 -8.2 -21.6 -8.0 -24.6
             C-7.8 -26.6 -6.0 -28.2 -3.4 -28.6
             C-1.0 -29.0 3.2 -29.0 5.4 -28.4
             C7.8 -27.8 8.6 -26.2 8.4 -24.4
             C8.6 -21.4 7.2 -18.4 5.4 -16.2
             C2.2 -15.4 -1.8 -15.4 -4.8 -16.4 Z"
          fill={BLOUSE}
        />
        <ellipse cx="-7.4" cy="-24.6" rx="3.2" ry="2.8" fill={BLOUSE} />
        <ellipse cx="8.0" cy="-24.4" rx="3.2" ry="2.8" fill={BLOUSE} />
        <ellipse cx="1" cy="-28.2" rx="2.15" ry="2.4" fill={C.skin} />
        <JointedArm
          x={8.0}
          y={-24.4}
          shoulder={pose.shoulder + (talking ? -4 : 0)}
          elbow={pose.elbow + (talking ? -5 : 0)}
          upper={8.0}
          lower={8.2}
          r1={2.5}
          r2={2.15}
          r3={1.9}
          fill={C.skin}
          cap={BLOUSE}
          sleeve={3.8}
          sleeveFill={BLOUSE}
          duration={0.9}
          hand
        />
        <motion.g animate={{ rotate: talking ? -3 : 0, y: talking ? -0.5 : 0 }} transition={SOFT}>
          <circle cx="1" cy="-31.4" r="6.2" fill={C.skin} />
          <WomanHair cx={1} cy={-31.4} />
          <ellipse cx="3.6" cy="-31.8" rx="1.05" ry="1.3" fill={C.ink} />
          <path d="M2.6 -28.6 Q3.8 -27.8 5 -28.7" fill="none" stroke={C.lip} strokeWidth="0.7" />
        </motion.g>
      </BodyLean>
    </g>
  )
}

function SitClient({ x, talking }: { x: number; talking: boolean }) {
  return (
    <g transform={`translate(${x} 148) scale(${FIGURE})`}>
      <rect x="6.4" y="6.2" width="5.4" height="16.4" rx="2.4" fill="oklch(42% 0.04 260)" />
      <rect x="1.4" y="6.4" width="5.4" height="16.2" rx="2.4" fill="oklch(36% 0.04 255)" />
      <BodyLean talking={talking} pivot={{ x: 1, y: -3 }} amount={-2.2}>
        <JointedArm
          x={-7.4}
          y={-13.2}
          shoulder={talking ? 96 : 102}
          elbow={talking ? 28 : 34}
          upper={6.8}
          lower={7.2}
          r1={2.45}
          r2={2.1}
          r3={1.85}
          fill={C.skin}
          sleeve={3.4}
          sleeveFill={BLOUSE}
        />
        <path
          d="M-6.8 -2.4
           C-7.8 3.2 -4.2 7.6 1.6 8.2
           C8.4 8.6 13.6 6.2 14.2 1.8
           C12.8 -1.4 5.2 -3.6 0.2 -3.8
           C-3.4 -3.8 -6.2 -3.2 -6.8 -2.4 Z"
          fill={DRESS}
        />
        <path
          d="M-5.0 -2.6
             C-6.8 -5.6 -8.0 -9.6 -7.6 -13.2
             C-7.4 -15.2 -5.6 -16.8 -3.2 -17.0
             C-0.6 -17.2 3.4 -17.0 5.6 -16.4
             C7.8 -15.8 8.4 -14.2 8.2 -12.6
             C8.4 -9.0 7.0 -5.4 5.2 -2.4
             C2.0 -1.6 -2.0 -1.6 -5.0 -2.6 Z"
          fill={BLOUSE}
        />
        <ellipse cx="-7.2" cy="-13.2" rx="3.15" ry="2.7" fill={BLOUSE} />
        <ellipse cx="8.0" cy="-13.0" rx="3.15" ry="2.7" fill={BLOUSE} />
        <ellipse cx="1.2" cy="-17.2" rx="2.1" ry="2.2" fill={C.skin} />
        <JointedArm
          x={8.0}
          y={-13.0}
          shoulder={talking ? -6 : 2}
          elbow={talking ? -40 : -48}
          upper={7.4}
          lower={7.6}
          r1={2.55}
          r2={2.2}
          r3={1.95}
          fill={C.skin}
          cap={BLOUSE}
          sleeve={3.6}
          sleeveFill={BLOUSE}
        />
        <motion.g animate={{ rotate: talking ? -4 : 0, y: talking ? -0.6 : 0 }} transition={SOFT}>
          <circle cx="1.2" cy="-21.8" r="6.2" fill={C.skin} />
          <WomanHair cx={1.2} cy={-21.8} />
          <ellipse cx="4.2" cy="-22.2" rx="1.05" ry="1.3" fill={C.ink} />
          <path d="M3.2 -19 Q4.4 -18.2 5.6 -19.1" fill="none" stroke={C.lip} strokeWidth="0.75" />
        </motion.g>
      </BodyLean>
    </g>
  )
}

function SitBuilder({ x, talking }: { x: number; talking: boolean }) {
  return (
    <g transform={`translate(${x} 148) scale(-${FIGURE}, ${FIGURE})`}>
      <rect x="6.6" y="6" width="5.6" height="16.6" rx="2.4" fill={PANT_D} />
      <rect x="1.4" y="6.2" width="5.6" height="16.4" rx="2.4" fill={PANTS} />
      <BodyLean talking={talking} pivot={{ x: 1, y: -3 }} amount={-2.2}>
        <JointedArm
          x={-4.6}
          y={-12.2}
          shoulder={talking ? 80 : 86}
          elbow={talking ? 16 : 22}
          upper={6.6}
          lower={7.2}
          r1={2.7}
          r2={2.25}
          r3={1.95}
          fill={SKIN_D}
        />
        <path
          d="M-6.6 -1.8
           C-7.4 3.6 -3.2 8 2.2 8.4
           C8.6 8.6 13.8 6 14.4 1.6
           C13 -1.6 5.6 -3.2 0.6 -3.4
           C-3 -3.4 -6 -3 -6.6 -1.8 Z"
          fill={VEST}
        />
        <rect x="-6.2" y="-16.6" width="14.4" height="16.4" rx="6.2" fill={VEST} />
        <rect x="-4.4" y="-7.2" width="11" height="3.2" rx="1.3" fill={STRIPE} />
        <rect x="-4.4" y="-1.4" width="11" height="3.2" rx="1.3" fill={STRIPE} />
        <JointedArm
          x={5.0}
          y={-12.6}
          shoulder={talking ? -10 : 4}
          elbow={talking ? -32 : -42}
          upper={7.4}
          lower={7.8}
          r1={2.85}
          r2={2.35}
          r3={2.05}
          fill={SKIN}
          cap={VEST}
        />
        <motion.g animate={{ rotate: talking ? -5 : 0, y: talking ? -0.5 : 0 }} transition={SOFT}>
          <circle cx="1.2" cy="-22" r="6.2" fill={SKIN} />
          <ellipse cx="1.4" cy="-27.6" rx="8.4" ry="1.65" fill={HAT_BRIM} />
          <path
            d="M-4.6 -27.8 C-4.8 -35.2 -0.4 -39.2 2.4 -39.4 C6.2 -39.6 9 -35.2 8.6 -27.8 Z"
            fill={HAT}
          />
          <ellipse cx="4.2" cy="-22.4" rx="1.05" ry="1.3" fill={C.ink} />
        </motion.g>
      </BodyLean>
    </g>
  )
}

function ReviewLaptop({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="8" width="46" height="16" rx="1.4" fill={C.navy} />
      <rect x="4" y="0" width="38" height="24" rx="1.6" fill={C.navy} />
      <rect x="5.4" y="1.6" width="35.2" height="20.6" fill={C.paper} />
      <rect x="5.4" y="1.6" width="35.2" height="4.2" fill={C.coral} />
      <rect x="8" y="8" width="12" height="8" fill={C.skySoft} />
      <rect x="22" y="8" width="15" height="3.2" fill={C.sand} />
      <rect x="22" y="12.4" width="11" height="2.4" fill={C.line} />
      <rect x="2" y="23.4" width="42" height="3.2" rx="1" fill="oklch(32% 0.04 260)" />
    </g>
  )
}

function SpeechDots({
  x,
  y,
  visible,
}: {
  x: number
  y: number
  visible: boolean
}) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <g transform={`translate(${x} ${y})`}>
        <path
          d="M-18 0 h36 a7.5 7.5 0 0 1 7.5 7.5 v8 a7.5 7.5 0 0 1 -7.5 7.5 h-13.5 l-4.5 4 -4.5 -4 h-13.5 a7.5 7.5 0 0 1 -7.5 -7.5 v-8 a7.5 7.5 0 0 1 7.5 -7.5 z"
          fill={C.paper}
          stroke={C.navy}
          strokeWidth="0.9"
        />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={-7 + i * 7}
            cy={11.4}
            r="1.7"
            fill={C.ink}
            animate={{ opacity: visible ? [0.25, 1, 0.25] : 0.25 }}
            transition={{ duration: 1.05, delay: i * 0.14, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </g>
    </motion.g>
  )
}

function JointedArm({
  x,
  y,
  shoulder,
  elbow,
  upper = 6.6,
  lower = 7.2,
  r1 = 2.45,
  r2 = 2.05,
  r3 = 1.85,
  fill,
  cap,
  sleeve = 0,
  sleeveFill,
  duration = 0.78,
  hand = false,
}: {
  x: number
  y: number
  shoulder: number
  elbow: number
  upper?: number
  lower?: number
  r1?: number
  r2?: number
  r3?: number
  fill: string
  cap?: string
  sleeve?: number
  sleeveFill?: string
  duration?: number
  hand?: boolean
}) {
  const ease = { duration, ease: EASE } as const

  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g initial={false} animate={{ rotate: shoulder }} transition={ease}>
        <Limb x1={0} y1={0} x2={upper} y2={0} r1={r1} r2={r2} fill={fill} />
        <g transform={`translate(${upper} 0)`}>
          <motion.g initial={false} animate={{ rotate: elbow }} transition={ease}>
            <Limb x1={0} y1={0} x2={lower} y2={0} r1={r2} r2={r3} fill={fill} />
            <circle cx={lower} cy={0} r={r3} fill={fill} />
            {hand ? (
              <ellipse cx={lower + 2.2} cy={-0.15} rx="1.35" ry="1.15" fill={fill} />
            ) : null}
          </motion.g>
        </g>
        {sleeve > 0 && sleeveFill ? (
          <Limb
            x1={0}
            y1={0}
            x2={sleeve}
            y2={0}
            r1={r1 + 0.45}
            r2={r2 + 0.15}
            fill={sleeveFill}
          />
        ) : null}
        {cap || sleeveFill ? (
          <circle cx={0} cy={0} r={r1 + 0.7} fill={cap ?? sleeveFill} />
        ) : null}
      </motion.g>
    </g>
  )
}

function Limb({
  x1,
  y1,
  x2,
  y2,
  r1,
  r2,
  fill,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  r1: number
  r2: number
  fill: string
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len
  const py = dx / len
  return (
    <g>
      <path
        d={`M ${x1 + px * r1} ${y1 + py * r1}
            L ${x2 + px * r2} ${y2 + py * r2}
            A ${r2} ${r2} 0 0 1 ${x2 - px * r2} ${y2 - py * r2}
            L ${x1 - px * r1} ${y1 - py * r1}
            A ${r1} ${r1} 0 0 1 ${x1 + px * r1} ${y1 + py * r1} Z`}
        fill={fill}
      />
      <circle cx={x1} cy={y1} r={r1} fill={fill} />
      <circle cx={x2} cy={y2} r={r2} fill={fill} />
    </g>
  )
}

function useTalkCycle(playing: boolean) {
  const [talk, setTalk] = useState(0)

  useEffect(() => {
    if (!playing) {
      setTalk(0)
      return
    }
    const controls = animate(0, 1, {
      duration: 2.35,
      repeat: Infinity,
      ease: 'linear',
      onUpdate: setTalk,
    })
    return () => controls.stop()
  }, [playing])

  return talk
}
