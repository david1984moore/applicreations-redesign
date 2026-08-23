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
const SNAP = { duration: 0.48, ease: EASE }
/** Smoke starts this far before the house-to-screens cut, so it reads as “lived in.” */
const HOUSE_SMOKE_LEAD_MS = 2800
const HOUSE_SMOKE_MIN_MS = 2400
const TRUNK = 'oklch(46% 0.09 55)'
const LEAF = 'oklch(58% 0.12 145)'
const LEAF_D = 'oklch(50% 0.11 150)'
const LEAF_L = 'oklch(66% 0.11 140)'
const ASPHALT = 'oklch(58% 0.02 260)'
const ASPHALT_L = 'oklch(68% 0.02 260)'
const CAR = 'oklch(42% 0.08 255)'

export type ReviewBeat = 'review' | 'clear' | 'revise' | 'house' | 'screens'
type PointAt = 'window' | 'door' | 'roof'

type HiwStep3CinemaProps = {
  playing: boolean
  reviewMs: number
  captionGapMs: number
  reviseMs: number
  houseMs: number
  screensMs: number
  onBeat?: (beat: ReviewBeat) => void
}

export function HiwStep3Cinema({
  playing,
  reviewMs,
  captionGapMs,
  reviseMs,
  houseMs,
  screensMs,
  onBeat,
}: HiwStep3CinemaProps) {
  const [beat, setBeat] = useState<ReviewBeat>('review')
  const [screensReady, setScreensReady] = useState(false)
  const onBeatRef = useRef(onBeat)
  onBeatRef.current = onBeat

  const tableOn = beat === 'review' || beat === 'clear' || beat === 'revise'
  const houseOn = beat === 'house'
  const screensOn = beat === 'screens'
  const showReview = useKeepMounted(tableOn, CROSS.duration * 1000)
  const showHouse = useKeepMounted(houseOn, CROSS.duration * 1000)
  const showScreens = useKeepMounted(screensOn, SCREENS_CROSS.duration * 1000)

  useEffect(() => {
    if (!playing) return

    setBeat('review')
    setScreensReady(false)
    onBeatRef.current?.('review')

    const reviseAt = reviewMs + captionGapMs
    const houseAt = reviseAt + reviseMs + captionGapMs
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
        setBeat('screens')
        setScreensReady(true)
        onBeatRef.current?.('screens')
      }, houseAt + houseMs),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, reviewMs, captionGapMs, reviseMs, houseMs])

  return (
    <div className="relative isolate w-full min-h-[17rem] sm:min-h-[18.5rem]">
      {showReview ? (
        <motion.div
          className="absolute inset-0 flex items-end justify-center"
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
          className="absolute inset-0 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: houseOn ? 1 : 0 }}
          transition={CROSS}
          aria-hidden
        >
          <HouseWalkthrough playing={playing && houseOn} duration={houseMs} />
        </motion.div>
      ) : null}

      {showScreens ? (
        <motion.div
          className="absolute inset-0 flex items-start justify-center pt-2 sm:pt-3"
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
    const smokeAt = Math.max(HOUSE_SMOKE_MIN_MS, duration - HOUSE_SMOKE_LEAD_MS)
    const timers = [
      window.setTimeout(() => {
        setPolish(1)
        setPoint('door')
      }, 360),
      window.setTimeout(() => {
        setPolish(2)
        setPoint('roof')
      }, 820),
      window.setTimeout(() => {
        setPolish(3)
      }, 1280),
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

function WalkHouse({ polish, smoking }: { polish: number; smoking: boolean }) {
  const painted = polish >= 1
  const finished = polish >= 2
  const expanded = polish >= 3

  return (
    <g>
      <motion.g initial={false} animate={{ opacity: expanded ? 1 : 0 }} transition={SNAP}>
        <YardTree x={128} y={154} s={0.92} round />
        <YardTree x={262} y={154} s={0.72} />
      </motion.g>

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
        initial={false}
        animate={{ opacity: painted ? 1 : 0 }}
        transition={SNAP}
      />

      <motion.g initial={false} animate={{ opacity: expanded ? 1 : 0 }} transition={SNAP}>
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
        <ParkedCar x={132} y={150} />
      </motion.g>

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
        initial={false}
        animate={{ opacity: painted ? 0.92 : 0 }}
        transition={SNAP}
      />
      <rect x="186" y="108" width="62" height="4" fill={C.sand} />
      <motion.rect
        x="186"
        y="108"
        width="62"
        height="4"
        fill={C.coral}
        initial={false}
        animate={{ opacity: finished ? 1 : 0 }}
        transition={SNAP}
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
        initial={false}
        animate={{ opacity: painted ? 1 : 0 }}
        transition={SNAP}
      />
      <circle cx="219.5" cy="141" r="1.05" fill={C.gold} />

      <Window x={188} y={114} />
      <Window x={226} y={114} />
      <motion.g initial={false} animate={{ opacity: painted ? 1 : 0 }} transition={SNAP}>
        <FlowerBox x={186} y={126} />
        <FlowerBox x={224} y={126} />
      </motion.g>
      <motion.g initial={false} animate={{ opacity: finished ? 1 : 0 }} transition={SNAP}>
        <Shutter x={182.6} y={114} />
        <Shutter x={204.2} y={114} />
        <Shutter x={220.6} y={114} />
        <Shutter x={242.2} y={114} />
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
      </motion.g>

      <path d="M176 106 L217 70 L258 106 Z" fill={ROOF} />
      <path d="M182 106 L217 76 L252 106 Z" fill={ROOF_EDGE} opacity="0.35" />
      <motion.path
        d="M176 106 L217 70 L258 106 Z"
        fill={ROOF_FINE}
        initial={false}
        animate={{ opacity: finished ? 0.85 : 0 }}
        transition={SNAP}
      />
      <rect x="190" y="78" width="8" height="16" fill={C.navy} />
      <motion.rect
        x="190"
        y="74"
        width="8"
        height="4"
        fill={C.coral}
        initial={false}
        animate={{ opacity: finished ? 1 : 0 }}
        transition={SNAP}
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
      transition={{ duration: 0.55, ease: EASE }}
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
