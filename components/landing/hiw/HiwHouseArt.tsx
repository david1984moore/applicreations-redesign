import { C } from '@/components/pricing/ExampleScreenRotator'
import type { PlanId } from '@/lib/pricing'

const ROOF = 'oklch(40% 0.08 40)'
const ROOF_EDGE = 'oklch(32% 0.07 38)'
const ROOF_FINE = 'oklch(44% 0.1 38)'
const CONCRETE = 'oklch(72% 0.03 75)'
const CONCRETE_DARK = 'oklch(62% 0.035 70)'
const WOOD = 'oklch(62% 0.08 62)'
const WOOD_D = 'oklch(48% 0.07 55)'
const TRUNK = 'oklch(46% 0.09 55)'
const LEAF = 'oklch(58% 0.12 145)'
const LEAF_D = 'oklch(50% 0.11 150)'
const LEAF_L = 'oklch(66% 0.11 140)'
const ASPHALT = 'oklch(58% 0.02 260)'
const ASPHALT_L = 'oklch(68% 0.02 260)'
const CAR = 'oklch(42% 0.08 255)'
const SMOKE = 'oklch(88% 0.008 80)'
const SMOKE_EDGE = 'oklch(62% 0.02 70)'

/** WalkHouse polish: 0 built house, 1 paint + flowers, 2 shutters + yard, 3 garage + car. */
export type HousePolish = 0 | 1 | 2 | 3

/** Shared vertical crop so CSS height is a true size step, not a crop artifact.
 *  Horizontal crop is per-tier: Starter/Basic/Business center on the house (x=217);
 *  Pro keeps the full yard (garage, car, trees). */
const VIEW_Y = 48
const VIEW_H = 118
const VIEW: Record<PlanId, string> = {
  starter: `163 ${VIEW_Y} 108 ${VIEW_H}`,
  basic: `163 ${VIEW_Y} 108 ${VIEW_H}`,
  business: `163 ${VIEW_Y} 108 ${VIEW_H}`,
  pro: `114 ${VIEW_Y} 158 ${VIEW_H}`,
}

const POLISH: Record<Exclude<PlanId, 'pro'>, HousePolish> = {
  starter: 0,
  basic: 1,
  business: 2,
}

/**
 * Static frames of the How-it-works house — same geometry as the cinema,
 * no motion. Starter is the finished build; each tier adds the walkthrough details.
 */
export function PlanHouseSketch({
  planId,
  className,
}: {
  planId: PlanId
  className?: string
}) {
  return (
    <svg
      viewBox={VIEW[planId]}
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden
    >
      {planId === 'pro' ? (
        <HiwHouseMark polish={3} smoke />
      ) : (
        <HiwHouseMark polish={POLISH[planId]} />
      )}
    </svg>
  )
}

/** Exact house from HiwReviewSketch WalkHouse, with polish as presence instead of fades. */
export function HiwHouseMark({
  polish,
  smoke = false,
}: {
  polish: HousePolish
  smoke?: boolean
}) {
  const painted = polish >= 1
  const finished = polish >= 2
  const expanded = polish >= 3

  return (
    <g>
      {expanded ? (
        <>
          <YardTree x={128} y={154} s={0.92} round />
          <YardTree x={262} y={154} s={0.72} />
        </>
      ) : null}

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
      {painted ? (
        <path
          d="M215 162 L222 152 L230 152 L248 162 Z"
          fill="oklch(78% 0.04 70)"
          stroke={CONCRETE_DARK}
          strokeWidth="0.6"
        />
      ) : null}

      {expanded ? (
        <g>
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
        </g>
      ) : null}

      <rect
        x="182"
        y="104"
        width="70"
        height="50"
        fill={C.cream}
        stroke={C.navy}
        strokeWidth="1.15"
      />
      {painted ? (
        <rect
          x="182"
          y="104"
          width="70"
          height="50"
          fill="oklch(94% 0.03 75)"
          opacity="0.92"
        />
      ) : null}
      <rect x="186" y="108" width="62" height="4" fill={finished ? C.coral : C.sand} />

      <rect
        x="208"
        y="126"
        width="14"
        height="28"
        rx="1"
        fill={painted ? C.coral : 'oklch(42% 0.06 55)'}
        stroke={C.navy}
        strokeWidth="0.8"
      />
      <circle cx="219.5" cy="141" r="1.05" fill={C.gold} />

      <Window x={188} y={114} />
      <Window x={226} y={114} />
      {painted ? (
        <>
          <FlowerBox x={186} y={126} />
          <FlowerBox x={224} y={126} />
        </>
      ) : null}
      {finished ? (
        <g>
          <Shutter x={182.6} y={114} />
          <Shutter x={204.2} y={114} />
          <Shutter x={220.6} y={114} />
          <Shutter x={242.2} y={114} />
          <circle cx="201.6" cy="132" r="2.4" fill={C.gold} opacity="0.9" />
          <path d="M201.6 134.4 V146" stroke={C.navy} strokeWidth="0.7" />
          <rect x="198.8" y="144.6" width="5.6" height="7.4" rx="0.6" fill={WOOD} />
          <Shrub x={174} y={162} />
          <Shrub x={250} y={162} flip />
          <rect x="264.2" y="146" width="1.5" height="16" rx="0.4" fill={WOOD_D} />
          <rect x="262.4" y="142.4" width="5.4" height="4.2" rx="0.7" fill={C.navy} />
          <rect x="266.6" y="143.6" width="1.6" height="1.5" rx="0.3" fill={C.coral} />
        </g>
      ) : null}

      <path d="M176 106 L217 70 L258 106 Z" fill={finished ? ROOF_FINE : ROOF} />
      <path d="M182 106 L217 76 L252 106 Z" fill={ROOF_EDGE} opacity="0.35" />
      <rect x="190" y="78" width="8" height="16" fill={C.navy} />
      {finished ? (
        <rect x="190" y="74" width="8" height="4" fill={C.coral} />
      ) : null}
      {smoke ? <ChimneySmoke /> : null}
    </g>
  )
}

/** Two leaf clumps sitting on the slab — not climbing the wall, not floating. */
function Shrub({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1}, 1)`}>
      <rect x="-1" y="-6" width="1.8" height="6" rx="0.5" fill={TRUNK} />
      <ellipse cx="-3.2" cy="-7.2" rx="4.4" ry="5.2" fill={LEAF_D} />
      <ellipse cx="3.4" cy="-6.4" rx="3.8" ry="4.6" fill={LEAF_L} />
      <ellipse cx="0.2" cy="-10.2" rx="4.6" ry="5.4" fill={LEAF} />
    </g>
  )
}

function ChimneySmoke() {
  return (
    <g>
      <ellipse
        cx="194.2"
        cy="68"
        rx="2.3"
        ry="1.9"
        fill={SMOKE}
        stroke={SMOKE_EDGE}
        strokeWidth="0.4"
        opacity="0.82"
      />
      <ellipse
        cx="197.4"
        cy="60.4"
        rx="3.1"
        ry="2.6"
        fill={SMOKE}
        stroke={SMOKE_EDGE}
        strokeWidth="0.35"
        opacity="0.62"
      />
      <ellipse
        cx="201.2"
        cy="52.2"
        rx="3.8"
        ry="3.2"
        fill={SMOKE}
        stroke={SMOKE_EDGE}
        strokeWidth="0.3"
        opacity="0.4"
      />
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
      <rect
        width="5.2"
        height="13"
        rx="0.5"
        fill={C.seafoam}
        stroke={C.navy}
        strokeWidth="0.5"
      />
      <path d="M1 3.2 H4.2 M1 6.5 H4.2 M1 9.8 H4.2" stroke={C.navy} strokeWidth="0.45" />
    </g>
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
