'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion } from 'framer-motion'
import { C } from '@/components/pricing/ExampleScreenRotator'

/**
 * Shop serve — owner behind a cafe counter, customer in left profile at the
 * near edge. Her right arm stays hidden behind the torso; the left arm is
 * one piece, hand holding a card to the POS. One floor shadow under the scene.
 *
 * Same toolkit: two-bone IK, SVG rotate around the joint, painter's algorithm.
 */

const EASE = [0.22, 1, 0.36, 1] as const
const SETTLE = { duration: 0.78, ease: [0.18, 0.72, 0.22, 1] as const }
const REACH = { duration: 0.7, ease: EASE }
const TAP = { duration: 0.28, ease: [0.18, 0.72, 0.22, 1] as const }
const REST = { duration: 0.52, ease: EASE }
/** Slow lift — still moving as the shop dissolves. */
const RETRACT = { duration: 1.42, ease: [0.38, 0.04, 0.22, 1] as const }
const SCENE_FADE = { duration: 1.55, ease: [0.42, 0, 0.58, 1] as const }

const SET_AT_MS = 180
const PLACED_AT_MS = SET_AT_MS + Math.round(SETTLE.duration * 1000) + 60
/** Early reach — only used when the shop is held for inspection. */
const REACH_AT_MS = PLACED_AT_MS + 220
const TAP_AT_MS = REACH_AT_MS + Math.round(REACH.duration * 1000) + 40
const PAID_AT_MS = TAP_AT_MS + Math.round(TAP.duration * 1000)
/** Brief check on the POS, then the arm starts up. */
const PAID_HOLD_MS = 560
/** Lift is already underway this long before opacity starts falling. */
const FADE_AFTER_LIFT_MS = 180
/** Shop fade begins this long before the beat ends so the rush starts mid-dissolve. */
const DISSOLVE_LEAD_MS = 520 + FADE_AFTER_LIFT_MS
const REACH_LEAD_MS = Math.round(REACH.duration * 1000) + 40

const DRESS = 'oklch(62% 0.13 18)'
const DRESS_D = 'oklch(54% 0.12 16)'
const BLOUSE = 'oklch(96% 0.012 85)'
const OWNER_SKIN = 'oklch(66% 0.09 52)'
const OWNER_SKIN_D = 'oklch(58% 0.08 50)'
const SKIN = 'oklch(82% 0.06 55)'
const SKIN_D = 'oklch(74% 0.055 52)'
const BLONDE = 'oklch(88% 0.08 88)'
const BLONDE_D = 'oklch(80% 0.09 82)'
const BLONDE_L = 'oklch(94% 0.04 92)'
const SWEATER = 'oklch(62% 0.07 195)'
const SWEATER_D = 'oklch(52% 0.06 198)'
const PANT = 'oklch(74% 0.05 72)'
const PANT_D = 'oklch(66% 0.048 68)'
const SHOE = 'oklch(28% 0.04 50)'
const WOOD = 'oklch(62% 0.08 62)'
const WOOD_D = 'oklch(48% 0.07 55)'
const WOOD_L = 'oklch(74% 0.06 70)'
const WOOD_EDGE = 'oklch(42% 0.06 52)'
const BAKELITE = 'oklch(22% 0.02 260)'
const STEEL = 'oklch(52% 0.02 250)'
const STEEL_D = 'oklch(40% 0.02 255)'
const TEA = 'oklch(58% 0.09 50)'
const TEA_L = 'oklch(70% 0.08 55)'
const CUP = 'oklch(96% 0.01 85)'
const CUP_D = 'oklch(86% 0.02 80)'
const PLATE = 'oklch(95% 0.012 85)'
const PLATE_D = 'oklch(86% 0.02 78)'
const PASTRY = 'oklch(76% 0.09 70)'
const PASTRY_D = 'oklch(62% 0.08 58)'
const PASTRY_L = 'oklch(86% 0.07 78)'

/** Extra sky above the heads so the go-live line never sits on the hair. */
const VIEW = { x: 104, y: 18, w: 176, h: 124 }

const OWNER_HIP = { x: 138, y: 104 }
const OWNER_SCALE = 1.62
const OWNER_TEA_SHOULDER = { x: -7.4, y: -24.8 }
const OWNER_FOOD_SHOULDER = { x: 8.2, y: -24.4 }
const OWNER_UPPER = 10.2
const OWNER_LOWER = 10.8
const TEA_OFFER = { x: 0.6, y: -8.8 }
const TEA_SET = { x: -1.8, y: -8.4 }
const TEA_REST = { x: -8.4, y: -16.4 }
const FOOD_OFFER = { x: 14.8, y: -8.2 }
const FOOD_SET = { x: 11.8, y: -6.6 }
const FOOD_REST = { x: 9.6, y: -16.8 }

const CUST_HIP = { x: 218, y: 109 }
const CUST_SCALE = 2.18
/** Left shoulder — the only visible arm, on the counter side of the torso. */
const CUST_PAY = { x: -4.6, y: -12.6 }
const CUST_UPPER = 5.8
const CUST_LOWER = 6.6
const CARD_IDLE = { x: -11.2, y: -13.8 }
const CARD_REACH = { x: -13.2, y: -8.6 }
const CARD_TAP = { x: -14.4, y: -8.0 }

const POS_AT = { x: 180, y: 85.5 }
const POS_SCALE = 0.78
const TAP_AT = { x: POS_AT.x + 8.2 * POS_SCALE, y: POS_AT.y + 6.4 * POS_SCALE }

type ShopPose = 'offer' | 'set' | 'placed' | 'reach' | 'tap' | 'paid' | 'retract'

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

function useAnimated(from: number, to: number, running: boolean, tween: {
  duration: number
  ease: readonly [number, number, number, number]
}) {
  const [value, setValue] = useState(from)
  const ref = useRef(from)

  useEffect(() => {
    if (!running) {
      ref.current = from
      setValue(from)
      return
    }
    const controls = animate(ref.current, to, {
      duration: tween.duration,
      ease: tween.ease,
      onUpdate: (next) => {
        ref.current = next
        setValue(next)
      },
    })
    return () => controls.stop()
  }, [from, running, to, tween.duration, tween.ease])

  return value
}

export function HiwShopSketch({
  playing,
  duration = 8400,
}: {
  playing: boolean
  duration?: number
}) {
  const [pose, setPose] = useState<ShopPose>('offer')
  const holdPaid = duration > 20000

  useEffect(() => {
    if (!playing) {
      setPose('offer')
      return
    }
    setPose('offer')
    const retractAt = duration - DISSOLVE_LEAD_MS
    const paidAt = holdPaid
      ? PAID_AT_MS
      : Math.max(PAID_AT_MS, retractAt - PAID_HOLD_MS)
    const tapAt = holdPaid
      ? TAP_AT_MS
      : paidAt - Math.round(TAP.duration * 1000)
    const reachAt = holdPaid
      ? REACH_AT_MS
      : Math.max(PLACED_AT_MS + 280, tapAt - REACH_LEAD_MS)
    const timers = [
      window.setTimeout(() => setPose('set'), SET_AT_MS),
      window.setTimeout(() => setPose('placed'), PLACED_AT_MS),
      window.setTimeout(() => setPose('reach'), reachAt),
      window.setTimeout(() => setPose('tap'), tapAt),
      window.setTimeout(() => setPose('paid'), paidAt),
    ]
    if (!holdPaid) {
      timers.push(window.setTimeout(() => setPose('retract'), retractAt))
    }
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, holdPaid, duration])

  const serving = pose === 'offer' || pose === 'set'
  const setDown = pose !== 'offer'
  const placed =
    pose === 'placed' ||
    pose === 'reach' ||
    pose === 'tap' ||
    pose === 'paid' ||
    pose === 'retract'
  const tapping = pose === 'tap' || pose === 'paid'
  const reaching = pose === 'reach' || tapping
  const retracting = pose === 'retract'
  const glowing = tapping

  const ownerLean = useAnimated(
    -2,
    setDown ? (placed ? -4 : -9) : -2,
    playing,
    setDown && !placed ? SETTLE : REST,
  )
  const teaTarget = pose === 'offer' ? TEA_OFFER : placed ? TEA_REST : TEA_SET
  const foodTarget = pose === 'offer' ? FOOD_OFFER : placed ? FOOD_REST : FOOD_SET
  const teaTween = placed ? REST : setDown ? SETTLE : REST
  const teaX = useAnimated(TEA_OFFER.x, teaTarget.x, playing, teaTween)
  const teaY = useAnimated(TEA_OFFER.y, teaTarget.y, playing, teaTween)
  const foodX = useAnimated(FOOD_OFFER.x, foodTarget.x, playing, teaTween)
  const foodY = useAnimated(FOOD_OFFER.y, foodTarget.y, playing, teaTween)
  const cardTween = retracting ? RETRACT : tapping ? TAP : reaching ? REACH : REST
  const custLean = useAnimated(
    -2,
    retracting ? -2 : tapping ? -4 : reaching ? -3 : -2,
    playing,
    cardTween,
  )
  const cardX = useAnimated(
    CARD_IDLE.x,
    tapping ? CARD_TAP.x : reaching ? CARD_REACH.x : CARD_IDLE.x,
    playing,
    cardTween,
  )
  const cardY = useAnimated(
    CARD_IDLE.y,
    tapping ? CARD_TAP.y : reaching ? CARD_REACH.y : CARD_IDLE.y,
    playing,
    cardTween,
  )

  const teaLocal = rotateAround(teaX, teaY, 0, 0, -ownerLean)
  const foodLocal = rotateAround(foodX, foodY, 0, 0, -ownerLean)
  const teaArm = twoBoneIk(
    OWNER_TEA_SHOULDER.x,
    OWNER_TEA_SHOULDER.y,
    teaLocal.x,
    teaLocal.y,
    OWNER_UPPER,
    OWNER_LOWER,
    1,
  )
  const foodArm = twoBoneIk(
    OWNER_FOOD_SHOULDER.x,
    OWNER_FOOD_SHOULDER.y,
    foodLocal.x,
    foodLocal.y,
    OWNER_UPPER,
    OWNER_LOWER,
    -1,
  )
  const cardLocal = rotateAround(cardX, cardY, 0, 0, -custLean)
  const cardArm = twoBoneIk(
    CUST_PAY.x,
    CUST_PAY.y,
    cardLocal.x,
    cardLocal.y,
    CUST_UPPER,
    CUST_LOWER,
    1,
  )

  return (
    <motion.svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMax meet"
      className="h-auto w-full max-h-[8rem] shrink-0 overflow-visible sm:max-h-[10rem] lg:max-h-[11rem]"
      aria-hidden
      initial={false}
      animate={{ opacity: retracting ? 0 : 1 }}
      transition={{
        ...SCENE_FADE,
        delay: retracting ? FADE_AFTER_LIFT_MS / 1000 : 0,
      }}
    >
      <ellipse cx="176" cy="138" rx="56" ry="6.4" fill="oklch(78% 0.03 75 / 0.32)" />

      <g transform={`translate(${OWNER_HIP.x} ${OWNER_HIP.y}) scale(${OWNER_SCALE})`}>
        <OwnerBody lean={ownerLean} />
      </g>

      <ShopCounter />

      <g transform={`translate(${OWNER_HIP.x} ${OWNER_HIP.y}) scale(${OWNER_SCALE})`}>
        <g transform={`rotate(${ownerLean})`}>
          <ShopArm
            x={OWNER_TEA_SHOULDER.x}
            y={OWNER_TEA_SHOULDER.y}
            shoulder={teaArm.shoulder}
            elbow={teaArm.elbow}
            upper={OWNER_UPPER}
            lower={OWNER_LOWER}
            r1={2.45}
            r2={2.1}
            r3={1.85}
            fill={OWNER_SKIN}
            sleeve={3.8}
            sleeveFill={BLOUSE}
            upright={-(ownerLean + teaArm.shoulder + teaArm.elbow)}
          >
            {serving ? <TeaCup /> : null}
          </ShopArm>
          <ShopArm
            x={OWNER_FOOD_SHOULDER.x}
            y={OWNER_FOOD_SHOULDER.y}
            shoulder={foodArm.shoulder}
            elbow={foodArm.elbow}
            upper={OWNER_UPPER}
            lower={OWNER_LOWER}
            r1={2.5}
            r2={2.15}
            r3={1.9}
            fill={OWNER_SKIN}
            sleeve={3.8}
            sleeveFill={BLOUSE}
            upright={-(ownerLean + foodArm.shoulder + foodArm.elbow)}
          >
            {serving ? <PastryPlate /> : null}
          </ShopArm>
        </g>
      </g>

      {placed ? (
        <>
          <g transform="translate(135 90.5) scale(1.85)">
            <TeaCup settled />
          </g>
          <g transform="translate(157 93.3) scale(1.85)">
            <PastryPlate settled />
          </g>
        </>
      ) : null}

      <g transform={`translate(${CUST_HIP.x} ${CUST_HIP.y}) scale(${CUST_SCALE})`}>
        <CustomerBody lean={custLean} />
      </g>

      <PosTerminal paid={pose === 'paid' || retracting} />

      <g transform={`translate(${CUST_HIP.x} ${CUST_HIP.y}) scale(${CUST_SCALE})`}>
        <CustomerReach lean={custLean} near={cardArm} glowing={glowing} />
      </g>

      <TapWaves active={tapping} paid={pose === 'paid' || retracting} />
    </motion.svg>
  )
}

function ShopCounter() {
  return (
    <g>
      <path d="M114 90.4 L122 98.2 L122 136.6 L114 129.2 Z" fill={WOOD_D} />
      <path
        d="M222 90.8 L238 95.0 L238 137.0 L234 137.4 L234 98.6 Z"
        fill={WOOD_D}
      />
      <path d="M122 98.2 L234 98.6 L234 137.4 L122 136.6 Z" fill={WOOD} />
      <path
        d="M122 112.2 L234 112.8 L234 114.2 L122 113.6 Z"
        fill={WOOD_D}
        opacity="0.5"
      />
      <path d="M122 129.4 L234 130.2 L234 137.4 L122 136.6 Z" fill={WOOD_D} />
      <path d="M114 90.4 L222 90.8 L234 98.6 L122 98.2 Z" fill={WOOD_L} />
      <path
        d="M114 90.4 L222 90.8 L221.2 92.4 L114.6 91.8 Z"
        fill="oklch(80% 0.05 72 / 0.55)"
      />
      <path d="M122 98.2 L234 98.6 L234 101.6 L122 101.0 Z" fill={WOOD_EDGE} />
    </g>
  )
}

function PosTerminal({ paid }: { paid: boolean }) {
  return (
    <g transform={`translate(${POS_AT.x} ${POS_AT.y}) scale(${POS_SCALE})`}>
      <ellipse cx="7.2" cy="14.0" rx="6.2" ry="1.25" fill="oklch(50% 0.04 55 / 0.18)" />
      <path d="M2 12.2 L13.4 11.0 L14.6 13.8 L3.2 15.0 Z" fill={STEEL_D} />
      <path d="M5.6 8.8 L9.0 8.2 L9.6 12.6 L6.2 13.2 Z" fill={STEEL} />
      <path d="M0.2 0.8 L14.6 -2.2 L16.6 11.2 L2.2 14.2 Z" fill={BAKELITE} />
      <path
        d="M1.6 2 L13.2 -0.6 L14.8 10.2 L3.2 12.8 Z"
        fill={paid ? C.gold : 'oklch(26% 0.04 230)'}
      />
      {paid ? (
        <path
          d="M5.4 6.6 L7.4 8.8 L11.6 3.6"
          fill="none"
          stroke={C.navy}
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <rect x="4.6" y="4.6" width="7.4" height="1.05" rx="0.4" fill={C.cream} opacity="0.55" />
          <rect x="4.6" y="6.9" width="5.0" height="0.95" rx="0.4" fill={C.cream} opacity="0.4" />
        </>
      )}
    </g>
  )
}

function TapWaves({ active, paid }: { active: boolean; paid: boolean }) {
  if (!active) return null
  const stroke = paid ? C.gold : C.navy
  return (
    <g transform={`translate(${TAP_AT.x} ${TAP_AT.y}) rotate(-28)`}>
      {[0, 1, 2].map((i) => {
        const r = 2.4 + i * 2.15
        return (
          <motion.path
            key={i}
            d={`M ${-r * 0.15} ${-r} A ${r} ${r} 0 0 1 ${-r * 0.15} ${r}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1.05"
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0.2 }}
            animate={{ opacity: [0.95, 0.15, 0], pathLength: 1 }}
            transition={{
              duration: 0.62,
              ease: EASE,
              delay: i * 0.09,
              repeat: paid ? 0 : 1,
            }}
          />
        )
      })}
    </g>
  )
}

function OwnerBody({ lean }: { lean: number }) {
  return (
    <g>
      <ellipse cx="1.2" cy="0.4" rx="5.4" ry="2" fill={C.hair} />
      <rect x="-4.2" y="-9.6" width="5.2" height="10.4" rx="2.1" fill="oklch(42% 0.04 260)" />
      <rect x="0.4" y="-9.4" width="5.4" height="10.2" rx="2.1" fill="oklch(36% 0.04 255)" />
      <g transform={`rotate(${lean})`}>
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
        <ellipse cx="1" cy="-28.2" rx="2.15" ry="2.4" fill={OWNER_SKIN} />
        <g transform="translate(1 -31.4)">
          <circle cx="0" cy="0" r="6.2" fill={OWNER_SKIN} />
          <ellipse cx="2.8" cy="1.6" rx="2.4" ry="2.1" fill={OWNER_SKIN_D} />
          <OwnerHair />
          <ellipse cx="2.7" cy="-0.3" rx="1.05" ry="1.3" fill={C.ink} />
          <path d="M1.6 2.6 Q2.8 3.4 4.1 2.5" fill="none" stroke={C.lip} strokeWidth="0.7" />
        </g>
      </g>
    </g>
  )
}

function OwnerHair() {
  return (
    <g>
      <ellipse cx="-5.8" cy="1.4" rx="3.3" ry="3.1" fill={C.hair} />
      <path
        d="M-5.6 2.2
           C-7.2 -3.8 -3.4 -8.8 0.2 -9.1
           C2.2 -9.2 3.4 -6.8 2.4 -4.8
           C1.2 -6.6 -1.4 -5.8 -3.6 -2.6
           C-4.8 -0.6 -5.6 2.2 -5.6 2.2 Z"
        fill={C.hair}
      />
    </g>
  )
}

function CustomerBody({ lean }: { lean: number }) {
  return (
    <g>
      <Limb x1={1.2} y1={4.4} x2={2.15} y2={11.2} r1={2.9} r2={2.4} fill={PANT_D} />
      <Limb x1={2.15} y1={11.2} x2={2.5} y2={18.6} r1={2.4} r2={2.05} fill={PANT_D} />
      <ellipse cx="2.85" cy="19.35" rx="2.95" ry="1.12" fill={SHOE} />

      <Limb x1={-1.55} y1={4.2} x2={-2.45} y2={11.4} r1={3.15} r2={2.55} fill={PANT} />
      <Limb x1={-2.45} y1={11.4} x2={-2.8} y2={18.8} r1={2.55} r2={2.1} fill={PANT} />
      <ellipse cx="-3.05" cy="19.55" rx="3.05" ry="1.18" fill={SHOE} />

      <g transform={`rotate(${lean})`}>
        <path
          d="M-5.5 0.2
             C-6.0 3.8 -4.2 7.4 -1.4 8.2
             C1.2 8.8 4.0 7.4 5.4 4.0
             C5.8 1.4 4.4 -1.6 1.6 -2.6
             C-1.0 -3.5 -4.0 -2.8 -5.5 0.2 Z"
          fill={PANT}
        />
        <path
          d="M-1.6 1.4 C-1.2 5.0 2.6 5.2 3.5 1.8 C2.2 -0.4 -0.6 -0.5 -1.6 1.4 Z"
          fill={PANT_D}
        />
        <ellipse cx="1.65" cy="-12.2" rx="1.7" ry="1.6" fill={SWEATER_D} />
        <g transform="translate(-0.15 -6.4)">
          <path
            d="M-4.2 -7.5
               C-6.0 -5.2 -5.8 2.0 -4.6 7.6
               C-3.2 9.1 2.6 8.9 3.7 6.4
               C4.8 1.6 3.9 -5.0 1.5 -7.7
               C0.2 -4.9 -2.3 -4.7 -4.2 -7.5 Z"
            fill={SWEATER}
          />
          <path
            d="M0.1 -7.3
               C1.7 -5.4 2.3 1.4 1.9 6.2
               C1.5 7.3 2.6 7.1 2.8 5.7
               C3.4 1.3 2.9 -4.7 1.1 -7.5 Z"
            fill={SWEATER_D}
          />
        </g>
        <ellipse cx={CUST_PAY.x} cy={CUST_PAY.y} rx="2.45" ry="2.25" fill={SWEATER} />
        <ellipse cx="-1.0" cy="-15.1" rx="1.55" ry="2.15" fill={SKIN} />
        <CustomerHead />
      </g>
    </g>
  )
}

function CustomerReach({
  lean,
  near,
  glowing = false,
}: {
  lean: number
  near: { shoulder: number; elbow: number }
  glowing?: boolean
}) {
  return (
    <g transform={`rotate(${lean})`}>
      <ShopArm
        x={CUST_PAY.x}
        y={CUST_PAY.y}
        shoulder={near.shoulder}
        elbow={near.elbow}
        upper={CUST_UPPER}
        lower={CUST_LOWER}
        r1={2.45}
        r2={2.2}
        r3={2.05}
        fill={SKIN}
        sleeve={5.5}
        sleeveFill={SWEATER}
        childPad={1.15}
        palmExtend={0}
        forearmCuff={3.35}
      >
        <PayHand glowing={glowing} />
      </ShopArm>
    </g>
  )
}

/** Left profile — hair covers the skull and forehead; beige face keeps the eye and mouth. */
function CustomerHead() {
  return (
    <g transform="translate(-1.0 -20.4)">
      <ellipse cx="0.5" cy="1.8" rx="5.4" ry="6.1" fill={SKIN} />
      <CustomerHair layer="back" />
      <CustomerHair layer="front" />
      <path
        d="M-4.35 0.95
           C-5.05 1.18 -5.2 1.78 -4.85 2.22
           C-4.6 2.42 -4.32 2.22 -4.22 1.85
           C-4.2 1.42 -4.24 1.12 -4.35 0.95 Z"
        fill={SKIN}
      />
      <ellipse cx="-3.2" cy="1.1" rx="0.68" ry="0.88" fill={C.ink} />
      <path
        d="M-3.52 3.48
           C-3.88 3.64 -3.92 4.02 -3.62 4.18
           C-3.18 4.32 -2.82 4.02 -2.80 3.70
           C-2.98 3.50 -3.26 3.36 -3.52 3.48 Z"
        fill={C.lip}
      />
    </g>
  )
}

/** Crown and back of the head, plus a short fall — leaves the front of the face open. */
function CustomerHair({ layer }: { layer: 'back' | 'front' }) {
  if (layer === 'back') {
    return (
      <g>
        <ellipse cx="3.15" cy="0.15" rx="4.7" ry="6.15" fill={BLONDE} />
        <path
          d="M3.6 -2.2
             C6.8 -3.2 8.4 0.2 8.0 3.6
             C7.4 7.0 5.4 9.6 2.8 10.0
             C0.6 10.2 -0.6 8.2 0.0 6.4
             C1.8 7.2 4.6 5.4 5.6 2.2
             C6.2 -0.2 5.2 -2.8 3.6 -2.2 Z"
          fill={BLONDE}
        />
        <path
          d="M5.2 -1.8
             C7.2 -2.2 8.0 0.8 7.4 3.6
             C6.8 6.2 5.0 7.8 3.8 7.4
             C5.0 4.2 5.4 0.6 5.2 -1.8 Z"
          fill={BLONDE_D}
        />
      </g>
    )
  }
  return (
    <g>
      <path
        d="M-4.15 -1.35
           C-3.6 -6.4 1.6 -9.0 5.4 -6.6
           C7.6 -4.8 7.6 -1.0 5.6 1.15
           C3.4 -1.6 0.0 -3.4 -2.4 -2.45
           C-3.4 -1.85 -4.15 -0.45 -4.15 -1.35 Z"
        fill={BLONDE}
      />
      <path
        d="M-0.8 -5.6
           C1.6 -8.0 5.2 -7.2 6.2 -3.6
           C3.8 -6.2 0.4 -6.6 -0.8 -5.6 Z"
        fill={BLONDE_L}
        opacity="0.78"
      />
    </g>
  )
}

function ShopArm({
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
  sleeveFill,
  childPad = 1.6,
  showLimb = true,
  upright = 0,
  palmExtend = 0,
  forearmCuff = 0,
  children,
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
  sleeveFill?: string
  childPad?: number
  showLimb?: boolean
  upright?: number
  palmExtend?: number
  forearmCuff?: number
  children?: ReactNode
}) {
  const reach = lower + palmExtend
  return (
    <g transform={`translate(${x} ${y}) rotate(${shoulder})`}>
      {showLimb ? (
        <>
          <Limb x1={0} y1={0} x2={upper} y2={0} r1={r1} r2={r2} fill={fill} />
          {sleeve > 0 && sleeveFill ? (
            <Limb x1={0} y1={0} x2={sleeve} y2={0} r1={r1 + 0.55} r2={r2 + 0.2} fill={sleeveFill} />
          ) : null}
        </>
      ) : null}
      <g transform={`translate(${upper} 0) rotate(${elbow})`}>
        {showLimb ? (
          <>
            <Limb x1={0} y1={0} x2={reach} y2={0} r1={r2} r2={r3} fill={fill} />
            <circle cx={reach} cy={0} r={r3} fill={fill} />
            {forearmCuff > 0 && sleeveFill ? (
              <Limb
                x1={0}
                y1={0}
                x2={forearmCuff}
                y2={0}
                r1={r2 + 0.4}
                r2={r3 + 0.15}
                fill={sleeveFill}
              />
            ) : null}
          </>
        ) : null}
        <g transform={`translate(${lower + childPad} 0) rotate(${upright})`}>{children}</g>
      </g>
    </g>
  )
}

function TeaCup({ settled = false }: { settled?: boolean }) {
  return (
    <g>
      {settled ? null : (
        <ellipse cx="0.15" cy="3.55" rx="5.4" ry="1.05" fill="oklch(50% 0.04 55 / 0.16)" />
      )}
      <ellipse cx="0" cy="3.15" rx="5.5" ry="1.15" fill={PLATE} />
      <ellipse cx="0" cy="3.05" rx="3.85" ry="0.72" fill={PLATE_D} />
      <path d="M-2.85 -0.85 L-2.35 2.55 Q0 3.25 2.35 2.55 L2.85 -0.85 Z" fill={CUP} />
      <path d="M1.35 -0.8 L1.15 2.6 Q1.95 3.0 2.35 2.55 L2.85 -0.85 Z" fill={CUP_D} />
      <ellipse cx="0" cy="-0.85" rx="2.95" ry="0.95" fill={CUP_D} />
      <ellipse cx="0" cy="-0.78" rx="2.35" ry="0.7" fill={TEA} />
      <ellipse cx="-0.65" cy="-0.9" rx="0.85" ry="0.22" fill={TEA_L} opacity="0.7" />
      <path
        d="M2.75 -0.25
           C4.85 -0.95 5.55 0.95 4.15 1.75
           C5.35 0.75 4.75 -0.45 2.75 -0.25 Z"
        fill={CUP}
      />
      <path
        d="M2.9 -0.1
           C4.35 -0.6 4.85 0.7 3.95 1.25
           C4.65 0.55 4.25 -0.25 2.9 -0.1 Z"
        fill={CUP_D}
      />
      {!settled ? (
        <>
          <path d="M-0.55 -2.35 C-0.9 -4.05 -0.15 -5.25 0.3 -6.15" fill="none" stroke={C.muted} strokeWidth="0.5" opacity="0.5" />
          <path d="M0.85 -2.15 C1.25 -3.75 0.6 -5.05 1.2 -6.0" fill="none" stroke={C.muted} strokeWidth="0.45" opacity="0.35" />
        </>
      ) : null}
    </g>
  )
}

function PastryPlate({ settled = false }: { settled?: boolean }) {
  return (
    <g>
      {settled ? null : (
        <ellipse cx="0.2" cy="2.15" rx="7.0" ry="1.25" fill="oklch(50% 0.04 55 / 0.16)" />
      )}
      <ellipse cx="0" cy="1.55" rx="7.2" ry="1.45" fill={PLATE} />
      <ellipse cx="0" cy="1.7" rx="6.5" ry="1.15" fill={PLATE_D} />
      <ellipse cx="0" cy="1.35" rx="5.25" ry="0.95" fill={PLATE} />
      <ellipse cx="0.15" cy="0.95" rx="3.7" ry="1.15" fill={PASTRY_D} />
      <ellipse cx="0" cy="0.55" rx="3.55" ry="1.2" fill={PASTRY} />
      <path
        d="M-2.6 0.4
           C-1.8 -0.5 -0.2 -0.7 1.1 -0.3
           C2.2 0.05 3.1 0.65 3.2 1.2"
        fill="none"
        stroke={PASTRY_D}
        strokeWidth="0.55"
        strokeLinecap="round"
      />
      <path
        d="M-2.1 -0.05
           C-0.8 -0.6 1.0 -0.65 2.35 0.05"
        fill="none"
        stroke={PASTRY_L}
        strokeWidth="0.45"
        strokeLinecap="round"
        opacity="0.8"
      />
      <ellipse cx="-1.05" cy="0.2" rx="1.15" ry="0.32" fill={PASTRY_L} opacity="0.55" />
    </g>
  )
}

function PayHand({ glowing }: { glowing: boolean }) {
  return (
    <g>
      <ellipse cx="1.05" cy="0.08" rx="2.55" ry="2.2" fill={SKIN} />
      <g transform="translate(2.05 0) rotate(-18)">
        <rect
          x="0.15"
          y="-1.65"
          width="4.7"
          height="3.2"
          rx="0.5"
          fill={C.navy}
          stroke={C.ink}
          strokeWidth="0.42"
        />
        <rect
          x="2.7"
          y="-0.95"
          width="1.45"
          height="1.2"
          rx="0.22"
          fill={glowing ? 'oklch(88% 0.11 90)' : C.gold}
        />
        <path d="M0.7 -0.75 H2.05 M0.7 0.1 H1.6" stroke={C.cream} strokeWidth="0.35" />
      </g>
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
