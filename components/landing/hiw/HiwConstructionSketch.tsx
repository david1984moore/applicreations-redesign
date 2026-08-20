'use client'

import { useEffect, useRef, useState, type Ref } from 'react'
import { animate, motion } from 'framer-motion'
import { C } from '@/components/pricing/ExampleScreenRotator'

const EASE = [0.22, 1, 0.36, 1] as const
const SOFT = { duration: 0.78, ease: EASE }
const POSE_OUT = { duration: 0.7, ease: EASE }
const POSE_IN = { duration: 0.74, delay: 0.72, ease: EASE }

const HAT = 'oklch(84% 0.17 92)'
const HAT_BRIM = 'oklch(76% 0.15 88)'
const VEST = 'oklch(66% 0.19 48)'
const STRIPE = 'oklch(97% 0.012 95)'
const PANTS = 'oklch(28% 0.07 255)'
const PANT_D = 'oklch(24% 0.06 252)'
const BOOT = 'oklch(22% 0.04 250)'
const CONCRETE = 'oklch(72% 0.03 75)'
const CONCRETE_DARK = 'oklch(62% 0.035 70)'
const ROOF = 'oklch(40% 0.08 40)'
const ROOF_EDGE = 'oklch(32% 0.07 38)'
const HANDLE = 'oklch(48% 0.07 55)'
const STEEL = 'oklch(52% 0.02 250)'
const SKIN = 'oklch(82% 0.06 55)'
const TRUNK = 'oklch(46% 0.09 55)'
const LEAF = 'oklch(58% 0.12 145)'
const LEAF_D = 'oklch(50% 0.11 150)'
const LEAF_L = 'oklch(66% 0.11 140)'
const ROCK = 'oklch(64% 0.02 70)'
const ROCK_D = 'oklch(56% 0.022 65)'
const ROCK_L = 'oklch(74% 0.018 75)'

export type BuildShot = 'foundation' | 'walls' | 'roof'
export type WorkerPhase = 'arrive' | 'kneel' | 'walls' | 'climb' | 'roof'

type HiwConstructionSketchProps = {
  shot: BuildShot
  phase: WorkerPhase
  showFoundation: boolean
  swinging: boolean
  jackRef?: Ref<SVGRectElement | null>
}

export function HiwConstructionSketch({
  shot,
  phase,
  showFoundation,
  swinging,
  jackRef,
}: HiwConstructionSketchProps) {
  const walls = shot === 'walls' || shot === 'roof'
  const roof = shot === 'roof'
  const slab = showFoundation || walls
  const onLadder = phase === 'climb' || phase === 'roof'

  return (
    <svg
      viewBox="164 12 292 164"
      preserveAspectRatio="xMidYMax meet"
      className="h-auto w-full overflow-visible"
      aria-hidden
    >
      <Backdrop />
      <House foundation={slab} walls={walls} roof={roof} jackRef={jackRef} />
      <Ladder visible={onLadder} />
      <Worker phase={phase} swinging={swinging} />
      <Rocks />
    </svg>
  )
}

function House({
  foundation,
  walls,
  roof,
  jackRef,
}: {
  foundation: boolean
  walls: boolean
  roof: boolean
  jackRef?: Ref<SVGRectElement | null>
}) {
  return (
    <g>
      <motion.g
        initial={false}
        animate={{ opacity: foundation ? 1 : 0 }}
        transition={SOFT}
      >
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
        <rect
          ref={jackRef}
          x="166.6"
          y="154"
          width="11.6"
          height="6"
          rx="1.15"
          fill="oklch(22% 0.015 50)"
        />
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: walls ? 1 : 0, y: walls ? 0 : 10 }}
        transition={{ duration: 0.7, delay: walls ? 0.72 : 0, ease: EASE }}
        transformTemplate={({ y }) => `translateY(${y}px)`}
      >
        <rect
          x="182"
          y="104"
          width="70"
          height="50"
          fill={C.cream}
          stroke={C.navy}
          strokeWidth="1.15"
        />
        <rect x="186" y="108" width="62" height="4" fill={C.sand} />
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
        <circle cx="219.5" cy="141" r="1.05" fill={C.gold} />
        <Window x={188} y={114} />
        <Window x={226} y={114} />
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: roof ? 1 : 0, y: roof ? 0 : -14 }}
        transition={{ duration: 0.7, delay: roof ? 0.72 : 0, ease: EASE }}
        transformTemplate={({ y }) => `translateY(${y}px)`}
      >
        <path d="M176 106 L217 70 L258 106 Z" fill={ROOF} />
        <path d="M182 106 L217 76 L252 106 Z" fill={ROOF_EDGE} opacity="0.35" />
        <rect x="190" y="78" width="8" height="16" fill={C.navy} />
      </motion.g>
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

export function Backdrop() {
  return (
    <g>
      <g transform="translate(470 174.2) scale(1.42)">
        <rect x="-2.2" y="-18" width="4.4" height="18" rx="1.2" fill={TRUNK} />
        <path d="M0 -48 L14 -22 H-14 Z" fill={LEAF_D} />
        <path d="M0 -40 L12 -18 H-12 Z" fill={LEAF} />
        <path d="M0 -30 L10.5 -8 H-10.5 Z" fill={LEAF_L} />
      </g>
      <g transform="translate(414 167.8) scale(2.18)">
        <rect x="-3.2" y="-28" width="6.4" height="28" rx="1.6" fill={TRUNK} />
        <circle cx="-8" cy="-32" r="11" fill={LEAF_D} />
        <circle cx="8" cy="-31" r="10.5" fill={LEAF_L} />
        <circle cx="0" cy="-40" r="13" fill={LEAF} />
      </g>
    </g>
  )
}

const BOULDER_SHAPES = [
  'M-13.2 4.8 L-12.6 -1.4 L-9.2 -7.8 L-3.4 -11.2 L3.8 -10 L9.6 -7.2 L13.6 -1.2 L12.4 4.6 L6.8 7.4 L-2.2 7.2 L-8.8 6 Z',
  'M-10.8 5.2 L-12 -0.6 L-8.6 -6.4 L-2.8 -9.4 L4.2 -9.8 L10.2 -5.2 L11.6 1.4 L8.2 6.2 L1.6 7.4 L-5.4 6.8 Z',
  'M-8.8 4.2 L-9.8 -1.8 L-6 -7.2 L0.8 -8.8 L7.4 -5.8 L9.8 0.4 L6.8 5.2 L-0.4 6 L-6.4 5.2 Z',
] as const

const BOULDER_EDGES = [
  'M-7.4 -6.8 L-2.2 -9.4 L4.6 -8.2 L8.8 -4.6',
  'M-6.2 -5.8 L-1.4 -8.2 L5.2 -8.4',
  'M-5.2 -4.8 L0.4 -7.4 L5.6 -5.2',
] as const

function Boulder({
  x,
  y,
  s = 1,
  fill = ROCK,
  variant = 0,
}: {
  x: number
  y: number
  s?: number
  fill?: string
  variant?: 0 | 1 | 2
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={BOULDER_SHAPES[variant]} fill={fill} />
      <path
        d={BOULDER_EDGES[variant]}
        fill="none"
        stroke={ROCK_L}
        strokeWidth="1.15"
        strokeLinejoin="round"
        strokeLinecap="square"
        opacity="0.7"
      />
    </g>
  )
}

export function Rocks() {
  return (
    <g>
      <Boulder x={384} y={169.8} s={1.24} fill={ROCK_D} variant={0} />
      <Boulder x={400} y={172.2} s={0.52} fill={ROCK} variant={1} />
    </g>
  )
}

function Ladder({ visible }: { visible: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={visible ? POSE_IN : POSE_OUT}
    >
      <g transform="translate(261 102) rotate(-11)">
        <rect x="0" y="0" width="2.2" height="52" rx="1" fill={HANDLE} />
        <rect x="10.5" y="0" width="2.2" height="52" rx="1" fill={HANDLE} />
        {[8, 18, 28, 38, 48].map((yy) => (
          <rect key={yy} x="0" y={yy} width="12.7" height="1.8" rx="0.6" fill={HANDLE} />
        ))}
      </g>
    </motion.g>
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

function Boot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x + 2.2} cy={y} rx="5.2" ry="2.4" fill={BOOT} />
      <rect x={x - 2.2} y={y - 3.2} width="6.4" height="3.4" rx="1.4" fill={BOOT} />
    </g>
  )
}

function Hammer() {
  return (
    <g>
      <rect x="0" y="-1" width="12.2" height="2" rx="0.8" fill={HANDLE} />
      <rect x="10.4" y="-3.8" width="3.4" height="7.6" rx="0.7" fill={STEEL} />
    </g>
  )
}

function ProfileHead() {
  return (
    <g>
      <circle cx="0.4" cy="1.6" r="6.4" fill={SKIN} />
      <ellipse cx="0.6" cy="-3.8" rx="8.8" ry="1.8" fill={HAT_BRIM} />
      <path
        d="M-5.4 -4 C-5.6 -11.2 -1.2 -15.4 1.6 -15.6 C5.4 -15.8 8.2 -11.4 7.8 -4 Z"
        fill={HAT}
      />
    </g>
  )
}

function ProfileTorso() {
  return (
    <g>
      <rect x="-6.2" y="-12.4" width="14.4" height="25.2" rx="7" fill={VEST} />
      <rect x="-4.8" y="-3.2" width="11.6" height="3.6" rx="1.6" fill={STRIPE} />
      <rect x="-4.8" y="3.4" width="11.6" height="3.6" rx="1.6" fill={STRIPE} />
    </g>
  )
}

export function Worker({ phase, swinging }: { phase: WorkerPhase; swinging: boolean }) {
  const kneeling = phase === 'kneel'
  const onWalls = phase === 'walls'
  const onLadder = phase === 'climb' || phase === 'roof'

  return (
    <>
      <motion.g
        initial={false}
        animate={{ opacity: kneeling ? 1 : 0 }}
        transition={POSE_OUT}
      >
        <g transform="translate(290 168) scale(-1.34, 1.34)">
          <PoseGround swinging={kneeling && swinging} kneel={1} />
        </g>
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: onWalls ? 1 : 0 }}
        transition={onWalls ? POSE_IN : POSE_OUT}
      >
        <g transform="translate(278 168) scale(-1.34, 1.34)">
          <PoseGround swinging={onWalls && swinging} kneel={0} />
        </g>
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: onLadder ? 1 : 0 }}
        transition={onLadder ? POSE_IN : POSE_OUT}
      >
        <g transform="translate(261 102) rotate(-11)">
          <g transform="translate(11.2 1) scale(-1 1)">
            <PoseRoof swinging={onLadder && swinging} />
          </g>
        </g>
      </motion.g>
    </>
  )
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function easeInCubic(t: number) {
  return t * t * t
}

/** 0 = strike in front of the chest, 1 = hammer cocked by the ear. */
function hammerCockFromCycle(t: number) {
  if (t < 0.34) return easeOutCubic(t / 0.34)
  if (t < 0.38) return 1
  if (t < 0.62) return 1 - easeInCubic((t - 0.38) / 0.24)
  return 0
}

function SwingArm({
  x,
  y,
  cock,
  strike,
  raised,
  elbowStrike,
  elbowRaised,
}: {
  x: number
  y: number
  cock: number
  strike: number
  raised: number
  elbowStrike: number
  elbowRaised: number
}) {
  const rot = lerp(strike, raised, cock)
  const elbow = lerp(elbowStrike, elbowRaised, cock)

  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Limb x1={0} y1={0} x2={8.8} y2={0} r1={3.4} r2={2.8} fill={SKIN} />
      <circle cx={0} cy={0} r={3.6} fill={VEST} />
      <g transform={`translate(8.8 0) rotate(${elbow})`}>
        <Limb x1={0} y1={0} x2={9.8} y2={0} r1={2.7} r2={2.2} fill={SKIN} />
        <g transform="translate(8.4 0)">
          <Hammer />
          <circle cx="1.4" cy="0" r="2.15" fill={SKIN} />
        </g>
      </g>
    </g>
  )
}

function IdleArm({
  x,
  y,
  cock,
  hang = 82,
}: {
  x: number
  y: number
  cock: number
  hang?: number
}) {
  const shoulder = lerp(hang, hang - 14, cock)
  const elbow = lerp(18, 32, cock)

  return (
    <g transform={`translate(${x} ${y}) rotate(${shoulder})`}>
      <Limb x1={0} y1={0} x2={7.2} y2={0} r1={3.2} r2={2.7} fill={SKIN} />
      <g transform={`translate(7.2 0) rotate(${elbow})`}>
        <Limb x1={0} y1={0} x2={7.6} y2={0} r1={2.7} r2={2.3} fill={SKIN} />
        <circle cx={7.6} cy={0} r={2.3} fill={SKIN} />
      </g>
      <circle cx={0} cy={0} r={3.5} fill={VEST} />
    </g>
  )
}

function UpperBody({
  swinging,
  strike,
  raised,
  elbowStrike,
  elbowRaised,
  idle,
  leanStrike = 1,
  leanRaised = -6,
  swingX = -3.4,
  hang = 90,
}: {
  swinging: boolean
  strike: number
  raised: number
  elbowStrike: number
  elbowRaised: number
  idle: { x: number; y: number }
  leanStrike?: number
  leanRaised?: number
  swingX?: number
  hang?: number
}) {
  const cock = useHammerCock(swinging)
  const lean = lerp(leanStrike, leanRaised, cock)

  return (
    <g transform={`rotate(${lean})`}>
      <IdleArm x={idle.x} y={idle.y} cock={cock} hang={hang} />
      <g transform="translate(0.4 -11.6)">
        <ProfileTorso />
      </g>
      <ellipse cx="1.2" cy="-22.4" rx="2.2" ry="3.2" fill={SKIN} />
      <g transform="translate(1.6 -29.2)">
        <ProfileHead />
      </g>
      <SwingArm
        x={swingX}
        y={-19.8}
        cock={cock}
        strike={strike}
        raised={raised}
        elbowStrike={elbowStrike}
        elbowRaised={elbowRaised}
      />
    </g>
  )
}

function PoseGround({ swinging, kneel }: { swinging: boolean; kneel: number }) {
  const t = kneel
  const hipY = lerp(0, 12.6, t)

  const backHipX = lerp(-1.8, -3.4, t)
  const backKneeX = lerp(-3.4, -9.8, t)
  const backKneeY = lerp(14.2, 26.6, t)
  const backFootX = lerp(-3.6, -17.8, t)
  const backFootY = lerp(27.2, 26.5, t)

  const frontHipX = lerp(2, 3.8, t)
  const frontKneeX = lerp(3.6, 12.4, t)
  const frontKneeY = lerp(14, 19.2, t)
  const frontFootX = lerp(4.4, 11.4, t)
  const frontFootY = lerp(27, 27.2, t)

  return (
    <g transform="translate(1 -32)">
      <Limb
        x1={backHipX}
        y1={hipY}
        x2={backKneeX}
        y2={backKneeY}
        r1={lerp(4.4, 4.1, t)}
        r2={lerp(3.6, 3.4, t)}
        fill={PANT_D}
      />
      <Limb
        x1={backKneeX}
        y1={backKneeY}
        x2={backFootX}
        y2={backFootY}
        r1={lerp(3.6, 3.3, t)}
        r2={2.9}
        fill={PANT_D}
      />
      <Boot x={backFootX} y={backFootY} />

      <Limb
        x1={frontHipX}
        y1={hipY}
        x2={frontKneeX}
        y2={frontKneeY}
        r1={lerp(4.5, 4.2, t)}
        r2={lerp(3.7, 3.5, t)}
        fill={PANTS}
      />
      <Limb
        x1={frontKneeX}
        y1={frontKneeY}
        x2={frontFootX}
        y2={frontFootY}
        r1={lerp(3.7, 3.4, t)}
        r2={2.9}
        fill={PANTS}
      />
      <Boot x={frontFootX} y={frontFootY} />

      <path
        d={`M${lerp(-4.2, -6.2, t)} ${hipY - 1.8}
            C${lerp(-3.8, -5.6, t)} ${hipY + 2}
            ${lerp(4.8, 6.8, t)} ${hipY + 2.2}
            ${lerp(5.2, 7.2, t)} ${hipY - 1.8}
            C${lerp(4.2, 6.2, t)} ${hipY - 4}
            ${lerp(-3.4, -5.2, t)} ${hipY - 4.2}
            ${lerp(-4.2, -6.2, t)} ${hipY - 1.8} Z`}
        fill={PANTS}
      />

      <g transform={`translate(0 ${hipY})`}>
        <UpperBody
          swinging={swinging}
          strike={lerp(38, 44, t)}
          raised={lerp(-42, -16, t)}
          elbowStrike={lerp(-58, -20, t)}
          elbowRaised={lerp(-102, -78, t)}
          leanStrike={lerp(1, 18, t)}
          swingX={lerp(-3.4, 1.2, t)}
          hang={90}
          idle={{
            x: lerp(7.4, 6.6, t),
            y: lerp(-18.4, -16.0, t),
          }}
        />
      </g>
    </g>
  )
}

function PoseRoof({ swinging }: { swinging: boolean }) {
  return (
    <g transform="translate(4.8 2) scale(1.18)">
      <Limb x1={-1.6} y1={0} x2={-2} y2={14} r1={4} r2={3.2} fill={PANT_D} />
      <Limb x1={-2} y1={14} x2={-1.8} y2={25.8} r1={3.2} r2={2.6} fill={PANT_D} />
      <Boot x={-1.8} y={26} />

      <Limb x1={1.8} y1={0} x2={2.4} y2={10.6} r1={4.1} r2={3.3} fill={PANTS} />
      <Limb x1={2.4} y1={10.6} x2={2.8} y2={19.4} r1={3.3} r2={2.6} fill={PANTS} />
      <Boot x={2.8} y={19.6} />

      <path
        d="M-3.2 -1.4 C-2.8 1.4 3.8 1.6 4.2 -1.4 C3.4 -3.2 -2.6 -3.4 -3.2 -1.4 Z"
        fill={PANTS}
      />

      <UpperBody
        swinging={swinging}
        strike={28}
        raised={-46}
        elbowStrike={-62}
        elbowRaised={-104}
        hang={90}
        idle={{ x: 7.2, y: -16.6 }}
      />
    </g>
  )
}

function useHammerCock(playing: boolean) {
  const [cock, setCock] = useState(0.16)
  const cockRef = useRef(0.16)

  useEffect(() => {
    const set = (value: number) => {
      cockRef.current = value
      setCock(value)
    }
    if (playing) {
      const controls = animate(0, 1, {
        duration: 0.56,
        repeat: Infinity,
        ease: 'linear',
        onUpdate: (t) => set(hammerCockFromCycle(t)),
      })
      return () => controls.stop()
    }
    const controls = animate(cockRef.current, 0.16, {
      duration: 0.32,
      ease: EASE,
      onUpdate: set,
    })
    return () => controls.stop()
  }, [playing])

  return cock
}

export function HiwBuildPage({ level }: { level: number }) {
  return (
    <svg
      viewBox="0 0 108 66"
      className="h-full w-full"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
    >
      <rect width="108" height="66" fill={C.cream} />
      <motion.g
        initial={false}
        animate={{ opacity: level >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <rect x="0" y="0" width="108" height="38" fill={C.sky} />
        <circle cx="92" cy="10" r="5.2" fill={C.gold} />
        <rect x="14" y="20" width="78" height="22" fill={C.sand} />
        <rect x="20" y="24" width="22" height="14" rx="1.2" fill={C.paper} />
        <rect x="22" y="26" width="18" height="10" fill={C.skySoft} />
        <rect x="48" y="26" width="11" height="16" rx="1" fill={C.coral} />
        <rect x="64" y="26" width="20" height="9" rx="1.4" fill={C.cream} />
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: level >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <rect x="14" y="16" width="78" height="7" rx="1.5" fill={C.coral} />
        <rect x="27" y="16" width="13" height="7" fill={C.gold} />
        <rect x="53" y="16" width="13" height="7" fill={C.gold} />
        <text
          x="53"
          y="15"
          textAnchor="middle"
          fill={C.ink}
          fontSize="5.4"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight={700}
        >
          Cedar Co.
        </text>
        <circle cx="29" cy="30" r="2.4" fill={SKIN} />
        <ellipse cx="29" cy="34.4" rx="3.4" ry="2.6" fill={C.coral} />
        <rect x="51" y="34" width="3.2" height="3.2" rx="0.5" fill={C.gold} />
        <text
          x="74"
          y="32.6"
          textAnchor="middle"
          fill={C.primary}
          fontSize="4.4"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight={700}
        >
          OPEN
        </text>
        <path
          d="M95 36 C97 30 101 30 103 36 L103 42 L95 42 Z"
          fill="oklch(58% 0.08 145)"
        />
        <rect x="0" y="42" width="108" height="24" fill={C.paper} />
        <text
          x="8"
          y="54"
          fill={C.ink}
          fontSize="7.2"
          fontFamily="ui-serif, Georgia, serif"
          fontWeight={700}
        >
          Come sit a while
        </text>
        <text
          x="8"
          y="63"
          fill={C.muted}
          fontSize="4.6"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Open 8–4  ·  Harbor Lane
        </text>
      </motion.g>
    </svg>
  )
}
