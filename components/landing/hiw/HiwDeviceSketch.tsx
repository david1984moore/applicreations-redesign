'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  C,
  ScenePage,
  type ExampleSceneId,
} from '@/components/pricing/ExampleScreenRotator'
import {
  HiwBuildPage,
  HiwConstructionSketch,
  type BuildShot,
  type WorkerPhase,
} from '@/components/landing/hiw/HiwConstructionSketch'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const
const SCROLL_EASE = [0.4, 0, 0.2, 1] as const
const FLICK_EASE = [0.18, 0.86, 0.22, 1] as const
const PAN_EASE = [0.42, 0.02, 0.22, 1] as const
const CRAWL_EASE = [0.45, 0, 0.4, 1] as const
const LAPTOP_OUT_EASE = [0.58, 0, 0.42, 0.28] as const
const PHONE_IN_EASE = [0.22, 1, 0.36, 1] as const
const SCENE_FADE = 1.05
const SCROLL_S = 2.6
const LIVE_SCROLL_S = 2.8
const LAPTOP_OUT_S = 1.15
export const PHONE_IN_S = 1.2
/** Preview line and laptop start fading together. */
export const PREVIEW_CAPTION_LEAD_S = 0
/** Preview line fade — done before the phone starts in. */
export const PREVIEW_CAPTION_OUT_S = 0.52
/** Readable hold on “You get a custom demo site”, then fade. */
const PREVIEW_LINE_HOLD_S = 2.9
/** Empty beat after that line is gone, before “…that actually works”. */
const WORKS_LINE_GAP_S = 0.34
/** Gap after the punchline is gone, then the phone starts. */
const PHONE_AFTER_CAPTION_S = 0.04
/** Caption starts this long before the handset has fully settled. */
export const PHONE_CAPTION_EARLY_S = 0.78
const GROW_S = 2.15
const HOUSE_FADE_S = 2.15
/** Whole cord fades in as one piece — no draw-on. */
const WIRE_FADE_S = 1.15
/** Partial retract + fade as the house sequence leaves. */
const WIRE_OUT_S = 1.8
/** Leave the loop and port on screen — fade finishes the exit. */
const WIRE_RETRACT_TO = 0.5
const WIRE_OUT_FADE_S = 1.25
const WIRE_OUT_FADE_DELAY_S = 0.16
const WIRE_HOLD_S = WIRE_OUT_S + WIRE_OUT_FADE_DELAY_S + 0.1
const LAND = [0.16, 1, 0.3, 1] as const
/** Slow start so the laptop eases into the grow instead of jumping. */
const GROW_EASE = [0.42, 0.0, 0.22, 1] as const
const WIRE_FADE_EASE = [0.4, 0, 0.2, 1] as const
const WIRE_RETRACT_EASE = [0.32, 0.0, 0.18, 1] as const
const WIRE_OUT_FADE_EASE = [0.28, 0.1, 0.36, 1] as const
const PREVIEW_AT = 0.086
const SWING_KNEEL_AT = 0
/**
 * Slab fade is keyed to when the crew is on screen, not the play clock.
 * Play waits through enter + split (~2s); tying the slab to that left him
 * swinging at empty ground. One hammer cycle, then the foundation eases in.
 */
const FOUNDATION_IN_MS = 420
/** Laptop is in the DOM; cord fades in as a complete line. */
const WIRE_AT = 0.097
/** Retract as he leaves the walls — fade finishes while the laptop grows. */
const WIRE_OUT_AT = 0.168
const STAND_AT = 0.11
/** Work line lands as he finishes the foundation and starts to stand. */
const THEN_HOLD_AT = 0.105
/** “…we get to work” — readable hold, then dissolve before the climb. */
const BUILD_LINE_OUT_AT = 0.152
const LADDER_AT = 0.165
const CLIMB_AT = 0.171
const WALLS_PAGE_AT = 0.148
/** Laptop roof lands with the climb, then the grow overlay takes over. */
const DETAIL_AT = 0.165
/** Grow starts as he reaches the roof — keep swinging through the house fade. */
const GROW_AT = 0.171
const GROWN_AT = 0.261
/** Grown site keeps browsing until the phone crossfade. */
const LAPTOP_FADE_AT = 0.435
/** Settled phone + readable line, then the stage glows out. */
const PHONE_HOLD_MS = 1900
/** First pan on the products feed after the handset lands. */
const PHONE_SCROLL_IN_MS = 1180
const PHONE_SCROLL_IN_S = 0.7
const PHONE_SCROLL_IN_Y = -22
/**
 * Keep the feed moving through glow + exit. Longer than the fade so the
 * page is still traveling while the handset thins out.
 */
const PHONE_SCROLL_FADE_AT_MS = 1680
const PHONE_SCROLL_FADE_S = 2.6
const PHONE_SCROLL_FADE_Y = -52

export function hiwPhoneInMs(duration: number) {
  const laptopFadeMs = duration * LAPTOP_FADE_AT
  const captionClearMs = laptopFadeMs - PREVIEW_CAPTION_LEAD_S * 1000
  return captionClearMs + (PREVIEW_CAPTION_OUT_S + PHONE_AFTER_CAPTION_S) * 1000
}

function previewWorksTimes(duration: number) {
  const scale = duration / 30_000
  const previewOutMs = duration * GROW_AT + PREVIEW_LINE_HOLD_S * 1000 * scale
  const worksInMs =
    previewOutMs + (PREVIEW_CAPTION_OUT_S + WORKS_LINE_GAP_S * scale) * 1000
  return { previewOutMs, worksInMs }
}

export function hiwStep2PlayMs(sketchMs: number) {
  return Math.round(hiwPhoneInMs(sketchMs) + PHONE_HOLD_MS)
}

type ScrollEase = readonly [number, number, number, number]
const LIVE_SCENES: ExampleSceneId[] = ['home', 'about', 'gallery', 'services']
const LIVE_PHONE_SCENES: ExampleSceneId[] = ['home', 'about', 'gallery', 'products', 'contact']

const PAGE_W = 228
const PAGE_H = 340
const PAGE_STACK = 2.3
const HOME_TEA_SCROLL = -44
const GALLERY_STOOL_SCROLL = -47

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

/** Inner screen overlay is 228×124. Aim at the pill, not the bar’s geometric center —
 *  a down-right cursor on y=8.5 reads as the bottom-right corner of a 7-tall pill. */
const SCREEN_OVERLAY_H = 124
const NAV_PILL_CY = (6.2 / SCREEN_OVERLAY_H) * 100

function navCursor(count: number, index: number) {
  const w = count >= 6 ? 13 : count >= 5 ? 15 : 18
  const gap = count >= 6 ? 5 : 6
  const cx = 12 + index * (w + gap) + w / 2
  return { x: (cx / PAGE_W) * 100, y: NAV_PILL_CY }
}

function pageCursor(x: number, y: number, scroll = 0) {
  return {
    x: (x / PAGE_W) * 100,
    y: (y / PAGE_H + scroll / 100) * PAGE_STACK * 100,
  }
}

const HIT = {
  open: pageCursor(160, 81),
  homeTea: pageCursor(63, 227, HOME_TEA_SCROLL),
  galleryStool: pageCursor(63, 235, GALLERY_STOOL_SCROLL),
}

type ScreenCard = {
  title: string
  price?: string
  note?: string
  wash: string
}

const SCENE_CARDS: Partial<Record<ExampleSceneId, ScreenCard[]>> = {
  home: [
    { title: 'House tea', price: '$4', note: 'Steeped to order', wash: C.sand },
    { title: 'Slice of cake', price: '$8', note: 'Baked this morning', wash: C.coral },
  ],
  about: [{ title: 'Hours', note: 'Tue–Sun, 8–4', wash: C.skySoft }],
  gallery: [
    { title: 'Cedar stool', price: '$38', note: 'A quiet seat by the window', wash: C.cream },
    { title: 'Linen throw', price: '$26', note: 'Soft enough for the sofa', wash: C.sand },
  ],
  services: [{ title: 'A table', note: 'Save a seat this weekend', wash: C.skySoft }],
  products: [
    { title: 'Cedar plate', price: '$22', note: 'Pair it with tea', wash: C.cream },
    { title: 'Tea tin', price: '$14', note: 'Also in shop', wash: C.gold },
  ],
  contact: [{ title: 'Visit', note: '14 Harbor Lane', wash: C.sand }],
}

function pickCard(scene: ExampleSceneId, slot = 0): ScreenCard {
  const cards = SCENE_CARDS[scene]
  return cards?.[slot % cards.length] ?? { title: 'Cedar Co.', note: 'Come sit a while', wash: C.cream }
}

type SiteFinish = 'preview' | 'live'
type ScreenLayout = 'desktop' | 'mobile'

function PerspectiveShell({
  children,
  rotateY = 10,
  rotateX = 5,
  className,
}: {
  children: ReactNode
  rotateY?: number
  rotateX?: number
  className?: string
}) {
  return (
    <div
      className={cn('origin-center', className)}
      style={{
        transform: `perspective(980px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}

function SiteScreen({ scene, layout = 'desktop' }: { scene: ExampleSceneId; layout?: ScreenLayout }) {
  const mobile = layout === 'mobile'
  const h = mobile ? 760 : 340
  return (
    <svg
      viewBox={`0 0 228 ${h}`}
      preserveAspectRatio="xMidYMin meet"
      className={mobile ? 'block h-auto w-full' : 'block h-full w-full'}
      style={{ textRendering: 'geometricPrecision' }}
    >
      <rect width="228" height={h} fill={C.paper} />
      <g transform={mobile ? 'translate(0 -22)' : undefined}>
        <ScenePage scene={scene} />
      </g>
      {mobile ? <MobileSceneContinue scene={scene} /> : <DesktopSceneContinue scene={scene} />}
    </svg>
  )
}

function ContinueBlock({
  x,
  y,
  w,
  h,
  wash,
  label,
  title,
  price,
}: {
  x: number
  y: number
  w: number
  h: number
  wash: string
  label?: string
  title: string
  price?: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={wash} />
      {label ? (
        <text
          x={x + 10}
          y={y + 16}
          fill={C.muted}
          fontSize="7"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight={500}
        >
          {label}
        </text>
      ) : null}
      <text
        x={x + 10}
        y={y + (label ? 32 : 22)}
        fill={C.ink}
        fontSize="10"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={700}
      >
        {title}
      </text>
      {price ? (
        <text
          x={x + 10}
          y={y + (label ? 46 : 36)}
          fill={C.primary}
          fontSize="9"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight={700}
        >
          {price}
        </text>
      ) : null}
    </g>
  )
}

function DesktopSceneContinue({ scene }: { scene: ExampleSceneId }) {
  if (scene === 'gallery') {
    return (
      <g>
        <ContinueBlock x={16} y={206} w={94} h={58} wash={C.cream} label="New" title="Cedar stool" price="$38" />
        <ContinueBlock x={118} y={206} w={94} h={58} wash={C.sand} label="New" title="Linen throw" price="$26" />
        <ContinueBlock x={16} y={274} w={196} h={52} wash={C.skySoft} label="This week" title="Quiet pieces for the table" />
      </g>
    )
  }
  if (scene === 'products') {
    return (
      <g>
        <ContinueBlock x={16} y={206} w={196} h={52} wash={C.cream} label="Pair it with" title="Cedar plate · $22" />
        <ContinueBlock x={16} y={268} w={94} h={56} wash={C.sand} title="Napkin" price="$9" />
        <ContinueBlock x={118} y={268} w={94} h={56} wash={C.skySoft} title="Spoon" price="$6" />
      </g>
    )
  }
  if (scene === 'about') {
    return (
      <g>
        <ContinueBlock x={16} y={206} w={196} h={58} wash={C.skySoft} label="Hours" title="Tue–Sun, 8–4" />
        <ContinueBlock x={16} y={274} w={196} h={52} wash={C.cream} label="Visit" title="14 Harbor Lane" />
      </g>
    )
  }
  if (scene === 'contact') {
    return (
      <g>
        <ContinueBlock x={16} y={196} w={196} h={58} wash={C.skySoft} label="A table" title="Save a seat this weekend" />
        <ContinueBlock x={16} y={264} w={94} h={60} wash={C.sand} label="Walk-ins" title="Always welcome" />
        <ContinueBlock x={118} y={264} w={94} h={60} wash={C.cream} label="Notes" title="Kettle’s on" />
      </g>
    )
  }
  if (scene === 'home') {
    return (
      <g>
        <ContinueBlock x={16} y={196} w={94} h={62} wash={C.sand} label="Today" title="House tea" price="$4" />
        <ContinueBlock x={118} y={196} w={94} h={62} wash={C.coral} label="Today" title="Slice of cake" price="$8" />
        <ContinueBlock x={16} y={268} w={196} h={56} wash={C.skySoft} label="Stay a while" title="A quiet table by the window" />
      </g>
    )
  }
  return (
    <g>
      <ContinueBlock x={16} y={206} w={196} h={58} wash={C.skySoft} label="Hours" title="Tue–Sun, 8–4" />
      <ContinueBlock x={16} y={274} w={196} h={52} wash={C.cream} title="Save a table" />
    </g>
  )
}

function MobilePageTail({ y }: { y: number }) {
  return (
    <g>
      <ContinueBlock x={16} y={y} w={94} h={70} wash={C.sand} label="Today" title="House tea" price="$4" />
      <ContinueBlock x={118} y={y} w={94} h={70} wash={C.coral} label="Today" title="Slice of cake" price="$8" />
      <ContinueBlock x={16} y={y + 82} w={196} h={64} wash={C.skySoft} label="This week" title="A quiet table by the window" />
      <ContinueBlock x={16} y={y + 158} w={94} h={70} wash={C.gold} label="Shelf" title="Lamp" price="$54" />
      <ContinueBlock x={118} y={y + 158} w={94} h={70} wash={C.cream} label="Shelf" title="Basket" price="$19" />
      <ContinueBlock x={16} y={y + 240} w={196} h={68} wash={C.sand} label="Visit" title="14 Harbor Lane" />
    </g>
  )
}

function MobileSceneContinue({ scene }: { scene: ExampleSceneId }) {
  if (scene === 'gallery') {
    return (
      <g>
        <rect x="16" y="188" width="94" height="64" rx="8" fill={C.sand} />
        <rect x="118" y="188" width="94" height="64" rx="8" fill={C.skySoft} />
        <text x="24" y="226" fill={C.ink} fontSize="8" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
          Linen
        </text>
        <text x="126" y="226" fill={C.ink} fontSize="8" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
          Bowl
        </text>
        <rect x="16" y="262" width="196" height="52" rx="8" fill={C.cream} />
        <text x="28" y="286" fill={C.muted} fontSize="7" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={500}>
          New this week
        </text>
        <text x="28" y="302" fill={C.ink} fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
          Quiet pieces for the table
        </text>
        <ContinueBlock x={16} y={326} w={94} h={70} wash={C.gold} label="Shelf" title="Lamp" price="$54" />
        <ContinueBlock x={118} y={326} w={94} h={70} wash={C.coral} label="Shelf" title="Basket" price="$19" />
        <MobilePageTail y={410} />
      </g>
    )
  }
  if (scene === 'products') {
    return (
      <g>
        <rect x="16" y="188" width="196" height="58" rx="8" fill={C.cream} />
        <text x="28" y="210" fill={C.muted} fontSize="7" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={500}>
          Pair it with
        </text>
        <text x="28" y="228" fill={C.ink} fontSize="11" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
          Cedar plate · $22
        </text>
        <rect x="16" y="256" width="94" height="58" rx="8" fill={C.sand} />
        <rect x="118" y="256" width="94" height="58" rx="8" fill={C.skySoft} />
        <text x="28" y="290" fill={C.ink} fontSize="8" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
          Napkin
        </text>
        <text x="130" y="290" fill={C.ink} fontSize="8" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
          Spoon
        </text>
        <ContinueBlock x={16} y={326} w={196} h={72} wash={C.skySoft} label="Also in shop" title="Tea tin · soap · tote" />
        <MobilePageTail y={412} />
      </g>
    )
  }
  if (scene === 'home') {
    return (
      <g>
        <ContinueBlock x={16} y={176} w={94} h={70} wash={C.sand} label="Today" title="House tea" price="$4" />
        <ContinueBlock x={118} y={176} w={94} h={70} wash={C.coral} label="Today" title="Slice of cake" price="$8" />
        <ContinueBlock x={16} y={258} w={196} h={64} wash={C.skySoft} label="Stay a while" title="A quiet table by the window" />
        <MobilePageTail y={336} />
      </g>
    )
  }
  return (
    <g>
      <rect x="16" y="176" width="196" height="70" rx="8" fill={C.skySoft} />
      <text x="28" y="202" fill={C.muted} fontSize="7" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={500}>
        Hours
      </text>
      <text x="28" y="220" fill={C.ink} fontSize="11" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
        Tue–Sun, 8–4
      </text>
      <rect x="16" y="258" width="196" height="52" rx="8" fill={C.cream} />
      <text x="28" y="282" fill={C.muted} fontSize="7" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={500}>
        A table
      </text>
      <text x="28" y="298" fill={C.ink} fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={700}>
        Save a seat this weekend
      </text>
      <ContinueBlock x={16} y={322} w={94} h={70} wash={C.sand} label="Walk-ins" title="Always welcome" />
      <ContinueBlock x={118} y={322} w={94} h={70} wash={C.cream} label="Notes" title="Kettle’s on" />
      <MobilePageTail y={406} />
    </g>
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

function MobileSiteHeader({ finish }: { finish: SiteFinish }) {
  return (
    <svg
      viewBox="0 0 228 26"
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-auto w-full"
    >
      <rect width="228" height="26" fill={finish === 'preview' ? C.sand : C.cream} />
      <rect x="10" y="8" width="14" height="1.7" rx="0.85" fill={C.navy} />
      <rect x="10" y="12.2" width="14" height="1.7" rx="0.85" fill={C.navy} />
      <rect x="10" y="16.4" width="10" height="1.7" rx="0.85" fill={C.navy} />
      <text
        x="114"
        y="16.8"
        textAnchor="middle"
        fill={C.ink}
        fontSize="8.2"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={700}
      >
        Cedar Co.
      </text>
      {finish === 'preview' ? (
        <circle cx="206" cy="13" r="3.2" fill="oklch(78% 0.04 80)" />
      ) : (
        <>
          <circle cx="206" cy="13" r="3.2" fill="oklch(68% 0.14 155)" />
          <path
            d="M204.8 13.4 205.7 14.4 207.6 11.8"
            fill="none"
            stroke="white"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  )
}

function MobileTabBar({ count, active }: { count: number; active: number }) {
  const n = Math.max(count, 1)
  const w = 228 / n
  return (
    <svg
      viewBox="0 0 228 22"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-auto w-full"
    >
      <rect width="228" height="22" fill={C.cream} />
      <rect y="0" width="228" height="0.8" fill={C.line} />
      {Array.from({ length: n }, (_, i) => {
        const cx = w * i + w / 2
        const on = i === active
        return (
          <g key={cx}>
            <rect
              x={cx - 7}
              y="4.2"
              width="14"
              height="8"
              rx="3"
              fill={on ? C.primary : C.sand}
            />
            <rect
              x={cx - 9}
              y="14.5"
              width="18"
              height="3.2"
              rx="1.6"
              fill={on ? C.navy : C.line}
            />
          </g>
        )
      })}
    </svg>
  )
}

function ScreenPanel({ card }: { card: ScreenCard | null }) {
  return (
    <AnimatePresence>
      {card ? (
        <motion.div
          key={card.title}
          className="absolute inset-0 z-[4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'oklch(28% 0.02 50 / 0.2)' }}
          />
          <motion.div
            className="absolute inset-[8%]"
            initial={{ scale: 0.78, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.88, y: 8 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <svg
              viewBox="0 0 200 148"
              className="h-full w-full drop-shadow-[0_8px_18px_oklch(18%_0.04_260/0.28)]"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                width="200"
                height="148"
                rx="14"
                fill={C.paper}
                stroke={C.line}
                strokeWidth="1.2"
              />
              <rect x="12" y="12" width="176" height="74" rx="10" fill={card.wash} />
              <text
                x="16"
                y="108"
                fill={C.ink}
                fontSize="13"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight={700}
              >
                {card.title}
              </text>
              {card.price ? (
                <text
                  x="16"
                  y="126"
                  fill={C.primary}
                  fontSize="12"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fontWeight={700}
                >
                  {card.price}
                </text>
              ) : null}
              {card.note ? (
                <text
                  x="16"
                  y={card.price ? 142 : 126}
                  fill={C.muted}
                  fontSize="8.5"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fontWeight={500}
                >
                  {card.note}
                </text>
              ) : null}
            </svg>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ScreenViewport({
  scene,
  scroll,
  navCount,
  navIndex,
  scrollDuration = SCROLL_S,
  scrollEase = SCROLL_EASE,
  layout = 'desktop',
  finish = 'live',
  card = null,
  pageFill = 'scroll',
}: {
  scene: ExampleSceneId
  scroll: number
  navCount: number
  navIndex: number
  scrollDuration?: number
  scrollEase?: ScrollEase
  layout?: ScreenLayout
  finish?: SiteFinish
  card?: ScreenCard | null
  pageFill?: 'scroll' | 'fit'
}) {
  const mobile = layout === 'mobile'
  const pageHeight =
    pageFill === 'fit' ? '100%' : mobile ? 'auto' : '230%'
  // Phone scroll is CSS, not Framer: the stage fade animates transform +
  // opacity on a parent, which cancels in-flight Framer `y` on this page.
  const page = mobile ? (
    <div
      key={scene}
      className="absolute inset-x-0 top-0 w-full will-change-transform"
      style={{
        height: pageHeight,
        transform: `translate3d(0, ${scroll}%, 0)`,
        transition:
          scrollDuration > 0
            ? `transform ${scrollDuration}s cubic-bezier(${scrollEase.join(', ')})`
            : 'none',
      }}
    >
      <SiteScreen scene={scene} layout={layout} />
    </div>
  ) : (
    <motion.div
      key={scene}
      className="absolute inset-x-0 top-0 w-full will-change-transform"
      style={{ height: pageHeight }}
      initial={{ opacity: 0, y: '0%' }}
      animate={{ opacity: 1, y: `${scroll}%` }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: SCENE_FADE, ease: EASE },
        y: { duration: scrollDuration, ease: scrollEase },
      }}
    >
      <SiteScreen scene={scene} layout={layout} />
    </motion.div>
  )
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {mobile ? (
          page
        ) : (
          <AnimatePresence initial={false}>{page}</AnimatePresence>
        )}
      </div>
      {layout === 'desktop' ? (
        <ScreenNav count={navCount} active={navIndex} />
      ) : (
        <>
          <MobileSiteHeader finish={finish} />
          <MobileTabBar count={navCount} active={navIndex} />
        </>
      )}
      <ScreenPanel card={card} />
    </>
  )
}

const CURSOR_ACT_S = 0.4
const CURSOR_GLIDE_S = 2.2
/** Swap to the hand once the pointer is over the control, before travel ends. */
const CURSOR_HOVER_AT = 0.55
const CURSOR_MARK =
  'h-3 w-3 drop-shadow-[0_0.5px_0.5px_oklch(20%_0.02_45/0.45)]'

function ArrowMark() {
  return (
    <svg viewBox="0 0 24 24" className={`${CURSOR_MARK} -translate-x-[2.3px] -translate-y-[1.55px]`}>
      <path
        d="M4.6 3.1 6.2 20.5 11.1 15.3 15.6 23.1 18.3 21.7 13.7 13.8 20.8 13.3Z"
        fill="white"
        stroke="oklch(22% 0.02 45)"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HandMark() {
  return (
    <svg viewBox="0 0 24 24" className={`${CURSOR_MARK} -translate-x-[5.5px] -translate-y-[1.1px]`}>
      <path
        d="M9.2 13.4V4.15c0-1.05.82-1.9 1.88-1.9 1.05 0 1.87.85 1.87 1.9V11.2h.35V6.7c0-1 .78-1.82 1.8-1.82 1 0 1.8.82 1.8 1.82v6.05h.28V8.85c0-.95.76-1.72 1.72-1.72.96 0 1.73.77 1.73 1.72V16.4c0 2.55-1.7 4.35-4.55 4.35h-2.7c-1.7 0-3.05-.7-3.85-2.05L7.1 15.4c-.48-.7-.32-1.65.38-2.14.7-.48 1.62-.32 2.1.38l.62.92v-.16Z"
        fill="white"
        stroke="oklch(22% 0.02 45)"
        strokeWidth="1.35"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SketchCursor({
  x,
  y,
  click,
  intent = 'glide',
}: {
  x: number
  y: number
  click: boolean
  intent?: 'glide' | 'act'
}) {
  const [over, setOver] = useState(false)
  const travel = intent === 'act' ? CURSOR_ACT_S : CURSOR_GLIDE_S
  const ease = intent === 'act' ? EASE : ([0.4, 0.02, 0.2, 1] as const)

  useEffect(() => {
    setOver(false)
    if (intent !== 'act') return
    const id = window.setTimeout(() => setOver(true), travel * CURSOR_HOVER_AT * 1000)
    return () => window.clearTimeout(id)
  }, [x, y, intent, travel])

  const hand = over || click

  return (
    <motion.div
      className="pointer-events-none absolute z-[6] h-0 w-0 origin-top-left"
      initial={{ left: `${x}%`, top: `${y}%`, opacity: 0, scale: 1 }}
      animate={{
        left: `${x}%`,
        top: click ? `calc(${y}% + 1px)` : `${y}%`,
        opacity: 1,
        scale: click ? 0.86 : 1,
      }}
      transition={{
        left: { duration: travel, ease },
        top: { duration: click ? 0.14 : travel, ease: click ? EASE : ease },
        opacity: { duration: 0.32 },
        scale: { duration: click ? 0.14 : 0.22, ease: EASE },
      }}
    >
      <motion.div
        className="absolute left-0 top-0"
        initial={false}
        animate={{ opacity: hand ? 0 : 1 }}
        transition={{ duration: 0.12, ease: EASE }}
      >
        <ArrowMark />
      </motion.div>
      <motion.div
        className="absolute left-0 top-0"
        initial={false}
        animate={{ opacity: hand ? 1 : 0 }}
        transition={{ duration: 0.12, ease: EASE }}
      >
        <HandMark />
      </motion.div>
    </motion.div>
  )
}

type CursorPose = {
  x: number
  y: number
  click: boolean
  intent?: 'glide' | 'act'
}

function LaptopChrome({
  scene,
  scroll = 0,
  navCount,
  navIndex,
  className,
  scrollDuration,
  scrollEase,
  cursor,
  finish = 'live',
  card = null,
  cablePort,
  portRef,
  children,
}: {
  scene: ExampleSceneId
  scroll?: number
  navCount: number
  navIndex: number
  className?: string
  scrollDuration?: number
  scrollEase?: ScrollEase
  cursor?: CursorPose | null
  finish?: SiteFinish
  card?: ScreenCard | null
  cablePort?: boolean
  portRef?: RefObject<SVGRectElement | null>
  children?: ReactNode
}) {
  const preview = finish === 'preview'
  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 252 176"
        className="h-auto w-full overflow-visible drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)]"
      >
        <rect
          x="4"
          y="4"
          width="244"
          height="160"
          rx="16"
          fill={preview ? 'oklch(93% 0.018 80)' : 'oklch(94% 0.015 80)'}
          stroke={preview ? 'oklch(80% 0.04 75)' : 'oklch(84% 0.03 80)'}
        />
        <rect
          x="4"
          y="4"
          width="244"
          height="24"
          rx="16"
          fill={preview ? 'oklch(88% 0.03 80)' : 'oklch(90% 0.02 80)'}
        />
        <rect
          x="4"
          y="16"
          width="244"
          height="12"
          fill={preview ? 'oklch(88% 0.03 80)' : 'oklch(90% 0.02 80)'}
        />
        <circle cx="20" cy="16" r="3.5" fill="oklch(70% 0.12 25)" />
        <circle cx="32" cy="16" r="3.5" fill="oklch(78% 0.10 85)" />
        <circle cx="44" cy="16" r="3.5" fill="oklch(68% 0.10 155)" />
        <rect
          x="58"
          y="11"
          width={preview ? 136 : 128}
          height="10"
          rx="5"
          fill="oklch(98% 0.008 85)"
        />
        {preview ? (
          <text
            x="126"
            y="18.4"
            textAnchor="middle"
            fill="oklch(48% 0.03 55)"
            fontSize="5.6"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            preview.cedar.co
          </text>
        ) : (
          <>
            <path
              d="M64 17.2v-1.4a3.1 3.1 0 0 1 6.2 0v1.4"
              fill="none"
              stroke="oklch(55% 0.08 155)"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
            <rect x="63.2" y="17" width="7.8" height="2.6" rx="0.7" fill="oklch(55% 0.08 155)" />
            <text
              x="128"
              y="18.4"
              textAnchor="middle"
              fill="oklch(38% 0.04 55)"
              fontSize="6.2"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight={600}
            >
              cedar.co
            </text>
            <circle cx="178" cy="16" r="2.4" fill="oklch(68% 0.14 155)" />
          </>
        )}
        <rect x="12" y="32" width="228" height="124" rx="10" fill={C.paper} />
        <rect x="90" y="164" width="72" height="8" rx="2.2" fill="oklch(88% 0.02 80)" />
        {typeof cablePort === 'boolean' ? (
          <motion.g
            initial={false}
            animate={{ opacity: cablePort ? 1 : 0 }}
            transition={{
              duration: cablePort ? WIRE_FADE_S : WIRE_OUT_FADE_S,
              ease: cablePort ? WIRE_FADE_EASE : WIRE_OUT_FADE_EASE,
              delay: cablePort ? 0 : WIRE_OUT_FADE_DELAY_S,
            }}
          >
            <rect
              ref={portRef}
              x="168"
              y="165.4"
              width="10.8"
              height="6.2"
              rx="1.2"
              fill="oklch(22% 0.01 55)"
            />
          </motion.g>
        ) : null}
      </svg>
      <div className="absolute overflow-hidden rounded-[10px] left-[4.76%] top-[18.18%] h-[70.45%] w-[90.48%]">
        <ScreenViewport
          scene={scene}
          scroll={scroll}
          navCount={navCount}
          navIndex={navIndex}
          scrollDuration={scrollDuration}
          scrollEase={scrollEase}
          finish={finish}
          card={card}
        />
        {children}
        {cursor ? (
          <SketchCursor
            x={cursor.x}
            y={cursor.y}
            click={cursor.click}
            intent={cursor.intent}
          />
        ) : null}
      </div>
    </div>
  )
}

function PhoneStatusBar({ finish }: { finish: SiteFinish }) {
  return (
    <svg
      viewBox="0 0 112 16"
      className="pointer-events-none absolute inset-x-0 top-0 z-[8] h-auto w-full"
    >
      <text
        x="8"
        y="11.2"
        fill={finish === 'preview' ? 'oklch(32% 0.04 55)' : 'oklch(18% 0.03 260)'}
        fontSize="6.4"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={700}
      >
        9:41
      </text>
      <rect x="78" y="6.2" width="3.2" height="4.4" rx="0.5" fill="oklch(22% 0.03 260)" />
      <rect x="82.2" y="5.2" width="3.2" height="5.4" rx="0.5" fill="oklch(22% 0.03 260)" />
      <rect x="86.4" y="4.2" width="3.2" height="6.4" rx="0.5" fill="oklch(22% 0.03 260)" />
      <rect x="90.6" y="3.4" width="3.2" height="7.2" rx="0.5" fill="oklch(22% 0.03 260)" />
      <path
        d="M96.2 8.4c1.6-1.6 4.2-1.6 5.8 0"
        fill="none"
        stroke="oklch(22% 0.03 260)"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <rect
        x="103.4"
        y="5.4"
        width="6.4"
        height="5.6"
        rx="1.1"
        fill="none"
        stroke="oklch(22% 0.03 260)"
        strokeWidth="0.9"
      />
      <rect
        x="104.1"
        y="6.2"
        width="5"
        height="4"
        rx="0.6"
        fill="oklch(62% 0.14 155)"
      />
    </svg>
  )
}

function PhoneChrome({
  scene,
  scroll = 0,
  navCount,
  navIndex,
  className,
  scrollDuration,
  scrollEase,
  finish = 'live',
  card = null,
}: {
  scene: ExampleSceneId
  scroll?: number
  navCount: number
  navIndex: number
  className?: string
  scrollDuration?: number
  scrollEase?: ScrollEase
  finish?: SiteFinish
  card?: ScreenCard | null
}) {
  const preview = finish === 'preview'
  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 140 252"
        className="h-auto w-full drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)]"
      >
        <rect x="3" y="58" width="5.2" height="20" rx="1.6" fill="oklch(20% 0.03 260)" />
        <rect x="3" y="84" width="5.2" height="13" rx="1.6" fill="oklch(20% 0.03 260)" />
        <rect x="131.8" y="70" width="5.2" height="28" rx="1.6" fill="oklch(20% 0.03 260)" />
        <rect
          x="8"
          y="6"
          width="124"
          height="240"
          rx="26"
          fill={preview ? 'oklch(30% 0.03 70)' : 'oklch(22% 0.04 260)'}
        />
        <rect
          x="10.5"
          y="8.5"
          width="119"
          height="235"
          rx="24"
          fill={preview ? 'oklch(36% 0.03 70)' : 'oklch(28% 0.04 260)'}
        />
        <rect x="14" y="16" width="112" height="220" rx="18" fill={C.paper} />
        <rect x="52" y="20" width="36" height="8" rx="4" fill="oklch(16% 0.03 260)" />
        <circle cx="80" cy="24" r="2.1" fill="oklch(38% 0.06 230)" />
        <rect x="58" y="232" width="24" height="3.4" rx="1.7" fill="oklch(78% 0.02 80)" />
      </svg>
      <div className="absolute overflow-hidden rounded-[16px] left-[10%] top-[6.35%] h-[87.3%] w-[80%]">
        <div className="absolute inset-x-0 top-0 z-[8] h-[7.2%]">
          <PhoneStatusBar finish={finish} />
        </div>
        <div className="absolute inset-x-0 top-[7.2%] bottom-[5.5%] overflow-hidden">
          <ScreenViewport
            scene={scene}
            scroll={scroll}
            navCount={navCount}
            navIndex={navIndex}
            scrollDuration={scrollDuration}
            scrollEase={scrollEase}
            layout="mobile"
            finish={finish}
            card={card}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[8] flex h-[5.5%] items-center justify-center">
          <span className="h-[3px] w-8 rounded-full bg-[oklch(28%_0.03_260/0.45)]" />
        </div>
      </div>
    </div>
  )
}

function TabletChrome({
  scene,
  navCount,
  navIndex,
  className,
  finish = 'live',
}: {
  scene: ExampleSceneId
  navCount: number
  navIndex: number
  className?: string
  finish?: SiteFinish
}) {
  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 176 236"
        className="h-auto w-full drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)]"
      >
        <rect
          x="5"
          y="5"
          width="166"
          height="226"
          rx="20"
          fill={finish === 'preview' ? 'oklch(30% 0.03 70)' : 'oklch(22% 0.04 260)'}
        />
        <rect
          x="9"
          y="9"
          width="158"
          height="218"
          rx="16"
          fill={finish === 'preview' ? 'oklch(36% 0.03 70)' : 'oklch(28% 0.04 260)'}
        />
        <rect x="14" y="18" width="148" height="200" rx="8" fill={C.paper} />
        <circle cx="88" cy="13.5" r="1.7" fill="oklch(38% 0.05 230)" />
        <rect x="80" y="222" width="16" height="3.2" rx="1.6" fill="oklch(78% 0.02 80)" />
      </svg>
      <div className="absolute overflow-hidden rounded-[8px] left-[8%] top-[8.5%] bottom-[10.2%] w-[84.09%]">
        <ScreenViewport
          scene={scene}
          scroll={0}
          navCount={navCount}
          navIndex={navIndex}
          finish={finish}
          pageFill="fit"
        />
      </div>
    </div>
  )
}

type SketchProps = {
  playing: boolean
  duration: number
}

/**
 * LOCKED Aug 18 2026 (final) — live-preview cord. User: “absolutely perfect.”
 * Do not edit wirePath, keyedPath, PreviewWire stroke/SVG, or port/jack math.
 */
type Pt = readonly [number, number]

type WireGeom = {
  d: string
}

type Key = { p: Pt; t: Pt }

function pt(x: number, y: number): Pt {
  return [x, y]
}

function fmt(x: number, y: number) {
  return `${x.toFixed(1)} ${y.toFixed(1)}`
}

function keyedPath(keys: Key[], move = true): string {
  if (keys.length < 2) return ''
  const start = keys[0]!
  const parts: string[] = move ? [`M ${fmt(start.p[0], start.p[1])}`] : []
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!
    const b = keys[i + 1]!
    parts.push(
      `C ${fmt(a.p[0] + a.t[0], a.p[1] + a.t[1])} ${fmt(b.p[0] - b.t[0], b.p[1] - b.t[1])} ${fmt(b.p[0], b.p[1])}`
    )
  }
  return parts.join(' ')
}

function wirePath(x1: number, y1: number, x2: number, y2: number): WireGeom {
  const s = Math.max(0.84, Math.min(1.2, Math.max(y2 - y1, 110) / 140))
  const rx = 16 * s
  const ry = 12 * s
  const ovalK = 0.55228475 * rx
  const X = (x: number) => x1 + x * s
  const Y = (y: number) => y1 + y * s
  const top = pt(X(-50), Y(66) - ry)
  const bot = pt(X(-50), Y(66) + ry)

  const intoLoop: Key[] = [
    { p: pt(x1, y1), t: pt(0, 44 * s) },
    { p: pt(top[0] + 28 * s, top[1]), t: pt(-34 * s, 0) },
    { p: pt(top[0], top[1]), t: pt(-ovalK, 0) },
  ]
  const outOfLoop: Key[] = [
    { p: pt(top[0], top[1]), t: pt(-28 * s, 0) },
    { p: pt(X(-74), Y(112)), t: pt(12 * s, 40 * s) },
    { p: pt(X(22), Y(152)), t: pt(56 * s, 0) },
    { p: pt(x2, y2), t: pt(44 * s, 0) },
  ]

  const d = [
    keyedPath(intoLoop),
    `A ${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${fmt(bot[0], bot[1])}`,
    `A ${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${fmt(top[0], top[1])}`,
    keyedPath(outOfLoop, false),
  ].join(' ')

  return { d }
}

function PreviewWire({
  visible,
  fromRef,
  toRef,
}: {
  visible: boolean
  fromRef: RefObject<SVGRectElement | null>
  toRef: RefObject<SVGRectElement | null>
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [d, setD] = useState('')
  const [stroke, setStroke] = useState(8)
  const [size, setSize] = useState({ w: 100, h: 100 })
  const endsRef = useRef<{ x1: number; y1: number; x2: number; y2: number } | null>(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host || !visible) return

    const update = () => {
      const from = fromRef.current
      const to = toRef.current
      const box = host.getBoundingClientRect()
      if (!from || !to || box.width < 4 || box.height < 4) return
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      if (a.width < 1 || b.width < 1) return
      const x1 = a.left + a.width / 2 - box.left
      const y1 = a.top + a.height / 2 - box.top
      const x2 = b.left + b.width * 0.42 - box.left
      const y2 = b.top + b.height / 2 - box.top
      const prev = endsRef.current
      const jumped = !prev
        || Math.hypot(x1 - prev.x1, y1 - prev.y1) > 2
        || Math.hypot(x2 - prev.x2, y2 - prev.y2) > 2
      if (!jumped) return
      endsRef.current = { x1, y1, x2, y2 }
      const nextStroke = Math.max(7, Math.min(9.5, b.height * 0.7))
      const geom = wirePath(x1, y1, x2, y2)
      setSize({ w: box.width, h: box.height })
      setD(geom.d)
      setStroke(nextStroke)
    }

    update()
    const delays = [32, 80, 160, 320, 640, 1000, 1600].map((ms) => window.setTimeout(update, ms))
    const ro = new ResizeObserver(update)
    ro.observe(host)
    const from = fromRef.current
    const to = toRef.current
    if (from) ro.observe(from)
    if (to) ro.observe(to)
    window.addEventListener('resize', update)
    return () => {
      for (const id of delays) window.clearTimeout(id)
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [visible, fromRef, toRef])

  const keepWire = useKeepMounted(visible && Boolean(d), WIRE_HOLD_S * 1000)

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 z-[2] overflow-visible"
      aria-hidden
    >
      <svg
        width={size.w}
        height={size.h}
        className="overflow-visible"
      >
        {d && keepWire ? (
          <motion.path
            ref={(node) => {
              if (node) node.setAttribute('pathLength', '1')
            }}
            d={d}
            fill="none"
            stroke="oklch(22% 0.015 50)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, strokeDasharray: '1 1' }}
            animate={{
              opacity: visible ? 1 : 0,
              strokeDasharray: visible ? '1 1' : `${WIRE_RETRACT_TO} 1`,
            }}
            transition={{
              strokeDasharray: {
                duration: visible ? 0 : WIRE_OUT_S,
                ease: WIRE_RETRACT_EASE,
              },
              opacity: {
                duration: visible ? WIRE_FADE_S : WIRE_OUT_FADE_S,
                ease: visible ? WIRE_FADE_EASE : WIRE_OUT_FADE_EASE,
                delay: visible ? 0 : WIRE_OUT_FADE_DELAY_S,
              },
            }}
          />
        ) : null}
      </svg>
    </div>
  )
}

export type PreviewBeat =
  | 'build'
  | 'building'
  | 'preview'
  | 'works'
  | 'clear'
  | 'phone'

export function HiwLivePreviewSketch({
  playing,
  duration,
  onBeat,
}: SketchProps & { onBeat?: (beat: PreviewBeat) => void }) {
  const [device, setDevice] = useState<'build' | 'phone'>('build')
  const [shot, setShot] = useState<BuildShot>('foundation')
  const [phase, setPhase] = useState<WorkerPhase>('kneel')
  const [showFoundation, setShowFoundation] = useState(false)
  const [showWire, setShowWire] = useState(false)
  const [swinging, setSwinging] = useState(true)
  const [previewLevel, setPreviewLevel] = useState(0)
  const [houseGone, setHouseGone] = useState(false)
  const [grown, setGrown] = useState(false)
  const [laptopGone, setLaptopGone] = useState(false)
  const [scene, setScene] = useState<ExampleSceneId>('home')
  const [scroll, setScroll] = useState(0)
  const [scrollDuration, setScrollDuration] = useState(LIVE_SCROLL_S)
  const [scrollEase, setScrollEase] = useState<ScrollEase>(SCROLL_EASE)
  const [navIndex, setNavIndex] = useState(0)
  const [cursor, setCursor] = useState<CursorPose | null>(null)
  const [card, setCard] = useState<ScreenCard | null>(null)
  const [phoneScene, setPhoneScene] = useState<ExampleSceneId>('about')
  const [phoneScroll, setPhoneScroll] = useState(0)
  const [phoneScrollDuration, setPhoneScrollDuration] = useState(2.4)
  const [phoneScrollEase, setPhoneScrollEase] = useState<ScrollEase>(CRAWL_EASE)
  const [phoneNav, setPhoneNav] = useState(1)
  const [phoneCard, setPhoneCard] = useState<ScreenCard | null>(null)
  const portRef = useRef<SVGRectElement>(null)
  const jackRef = useRef<SVGRectElement>(null)
  const onBeatRef = useRef(onBeat)
  onBeatRef.current = onBeat

  useEffect(() => {
    const id = window.setTimeout(() => setShowFoundation(true), FOUNDATION_IN_MS)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!playing) {
      // Keep the phone on screen. Resetting here replays the kneeling worker.
      return
    }

    const laptopNavCount = LIVE_SCENES.length
    const galleryNav = navCursor(laptopNavCount, 2)
    const aboutNav = navCursor(laptopNavCount, 1)
    const phoneAbout = LIVE_PHONE_SCENES.indexOf('about')
    const phoneProducts = LIVE_PHONE_SCENES.indexOf('products')
    const laptopFadeMs = duration * LAPTOP_FADE_AT
    const captionClearMs = laptopFadeMs - PREVIEW_CAPTION_LEAD_S * 1000
    const phoneInMs = hiwPhoneInMs(duration)
    const { previewOutMs, worksInMs } = previewWorksTimes(duration)

    const timers = [
      window.setTimeout(() => setSwinging(true), duration * SWING_KNEEL_AT),
      window.setTimeout(() => setShowWire(true), duration * WIRE_AT),
      window.setTimeout(() => setShowWire(false), duration * WIRE_OUT_AT),
      window.setTimeout(() => setPreviewLevel(1), duration * PREVIEW_AT),
      window.setTimeout(() => setSwinging(false), duration * (STAND_AT - 0.012)),
      window.setTimeout(() => {
        onBeatRef.current?.('building')
      }, duration * THEN_HOLD_AT),
      window.setTimeout(() => {
        onBeatRef.current?.('clear')
      }, duration * BUILD_LINE_OUT_AT),
      window.setTimeout(() => {
        setPhase('walls')
        setShot('walls')
        setSwinging(true)
      }, duration * STAND_AT),
      window.setTimeout(() => setPreviewLevel(2), duration * WALLS_PAGE_AT),
      window.setTimeout(() => setSwinging(false), duration * LADDER_AT),
      window.setTimeout(() => {
        setShot('roof')
        setPhase('roof')
        setSwinging(true)
      }, duration * CLIMB_AT),
      window.setTimeout(() => setPreviewLevel(3), duration * DETAIL_AT),
      window.setTimeout(() => {
        setHouseGone(true)
        setGrown(true)
        setScrollDuration(GROW_S)
        setScrollEase(PAN_EASE)
        setScroll(HOME_TEA_SCROLL * 0.4)
        setCursor({ x: HIT.open.x, y: HIT.open.y, click: false, intent: 'glide' })
        onBeatRef.current?.('preview')
      }, duration * GROW_AT),
      window.setTimeout(() => {
        onBeatRef.current?.('clear')
      }, previewOutMs),
      window.setTimeout(() => {
        onBeatRef.current?.('works')
      }, worksInMs),
      window.setTimeout(() => {
        setScrollDuration(1.6)
        setScrollEase(PAN_EASE)
        setScroll(HOME_TEA_SCROLL)
        setCursor({ x: HIT.homeTea.x, y: HIT.homeTea.y, click: false, intent: 'act' })
      }, duration * GROWN_AT),
      window.setTimeout(() => {
        setCursor({ x: HIT.homeTea.x, y: HIT.homeTea.y, click: true, intent: 'act' })
      }, duration * 0.302),
      window.setTimeout(() => {
        setCursor({ x: HIT.homeTea.x, y: HIT.homeTea.y, click: false, intent: 'act' })
      }, duration * 0.305),
      window.setTimeout(() => {
        setCard(pickCard('home', 0))
      }, duration * 0.306),
      window.setTimeout(() => {
        setCard(null)
        setCursor({ x: galleryNav.x, y: galleryNav.y, click: false, intent: 'act' })
      }, duration * 0.323),
      window.setTimeout(() => {
        setCursor({ x: galleryNav.x, y: galleryNav.y, click: true, intent: 'act' })
      }, duration * 0.340),
      window.setTimeout(() => {
        setCursor({ x: galleryNav.x, y: galleryNav.y, click: false, intent: 'act' })
        setScene('gallery')
        setNavIndex(2)
        setScroll(0)
        setScrollDuration(0.7)
        setScrollEase(SCROLL_EASE)
      }, duration * 0.342),
      window.setTimeout(() => {
        setScrollDuration(1.35)
        setScrollEase(PAN_EASE)
        setScroll(GALLERY_STOOL_SCROLL * 0.42)
      }, duration * 0.355),
      window.setTimeout(() => {
        setScrollDuration(1.1)
        setScrollEase(PAN_EASE)
        setScroll(GALLERY_STOOL_SCROLL)
        setCursor({ x: HIT.galleryStool.x, y: HIT.galleryStool.y, click: false, intent: 'act' })
      }, duration * 0.371),
      window.setTimeout(() => {
        setCursor({ x: HIT.galleryStool.x, y: HIT.galleryStool.y, click: true, intent: 'act' })
      }, duration * 0.387),
      window.setTimeout(() => {
        setCursor({ x: HIT.galleryStool.x, y: HIT.galleryStool.y, click: false, intent: 'act' })
        setCard(pickCard('gallery', 0))
      }, duration * 0.390),
      window.setTimeout(() => {
        setCard(null)
        setCursor({ x: aboutNav.x, y: aboutNav.y, click: false, intent: 'act' })
      }, duration * 0.410),
      window.setTimeout(() => {
        setCursor({ x: aboutNav.x, y: aboutNav.y, click: true, intent: 'act' })
      }, duration * 0.426),
      window.setTimeout(() => {
        setCursor({ x: aboutNav.x, y: aboutNav.y, click: false, intent: 'act' })
        setScene('about')
        setNavIndex(1)
        setScroll(0)
        setScrollDuration(0.55)
        setScrollEase(SCROLL_EASE)
      }, duration * 0.430),
      window.setTimeout(() => {
        onBeatRef.current?.('clear')
      }, captionClearMs),
      window.setTimeout(() => {
        setLaptopGone(true)
        setCursor(null)
      }, laptopFadeMs),
      window.setTimeout(() => {
        setDevice('phone')
        setPhoneCard(null)
        setPhoneScene('about')
        setPhoneNav(phoneAbout)
        setPhoneScroll(0)
        setPhoneScrollDuration(0)
        setPhoneScrollEase(SCROLL_EASE)
      }, phoneInMs),
      window.setTimeout(
        () => onBeatRef.current?.('phone'),
        phoneInMs + (PHONE_IN_S - PHONE_CAPTION_EARLY_S) * 1000
      ),
      window.setTimeout(() => {
        setPhoneScene('products')
        setPhoneNav(phoneProducts)
        setPhoneScroll(0)
        setPhoneScrollDuration(0.35)
        setPhoneScrollEase(SCROLL_EASE)
      }, phoneInMs + 720),
      window.setTimeout(() => {
        setPhoneScrollDuration(PHONE_SCROLL_IN_S)
        setPhoneScrollEase(PAN_EASE)
        setPhoneScroll(PHONE_SCROLL_IN_Y)
      }, phoneInMs + PHONE_SCROLL_IN_MS),
      window.setTimeout(() => {
        setPhoneScrollDuration(PHONE_SCROLL_FADE_S)
        setPhoneScrollEase(CRAWL_EASE)
        setPhoneScroll(PHONE_SCROLL_FADE_Y)
      }, phoneInMs + PHONE_SCROLL_FADE_AT_MS),
    ]

    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration])

  const laptopNavCount = LIVE_SCENES.length
  const phoneNavCount = LIVE_PHONE_SCENES.length
  const showPhone = device === 'phone'
  const laptopOn = previewLevel > 0 && !laptopGone && !showPhone
  const houseOn = !houseGone && !laptopGone && !showPhone
  const keepLaptop = useKeepMounted(laptopOn, LAPTOP_OUT_S * 1000)
  const keepHouse = useKeepMounted(houseOn, HOUSE_FADE_S * 1000)
  const wireOn = showWire && !laptopGone && !showPhone
  const growTransition = {
    duration: grown ? GROW_S : 0.55,
    ease: grown ? GROW_EASE : EASE,
  }

  return (
    <div className="relative isolate w-full min-h-[13.5rem] sm:min-h-[16.5rem] lg:min-h-[18rem]">
      {keepLaptop ? (
        <motion.div
          className="absolute left-0 top-0 z-[1] flex origin-center items-start justify-start"
          initial={{ opacity: 0, width: '68%', maxWidth: '30rem', scale: 1 }}
          animate={{
            width: grown ? '84%' : '68%',
            maxWidth: grown ? '36rem' : '30rem',
            opacity: laptopOn ? 1 : 0,
            scale: laptopOn ? 1 : 1.08,
          }}
          transition={{
            width: growTransition,
            maxWidth: growTransition,
            opacity: {
              duration: laptopOn ? 0.45 : LAPTOP_OUT_S,
              ease: laptopOn ? EASE : LAPTOP_OUT_EASE,
            },
            scale: {
              duration: laptopOn ? 0.45 : LAPTOP_OUT_S,
              ease: laptopOn ? EASE : LAPTOP_OUT_EASE,
            },
          }}
        >
          {previewLevel > 0 ? (
            <PerspectiveShell rotateY={11} rotateX={5} className="w-full">
              <LaptopChrome
                scene={scene}
                scroll={scroll}
                navCount={laptopNavCount}
                navIndex={navIndex}
                scrollDuration={scrollDuration}
                scrollEase={scrollEase}
                cursor={grown && laptopOn ? cursor : null}
                finish="preview"
                card={laptopOn ? card : null}
                cablePort={wireOn}
                portRef={portRef}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: grown || !laptopOn ? 0 : 1 }}
                  transition={{
                    duration: grown || !laptopOn ? GROW_S : 0.4,
                    ease: grown || !laptopOn ? GROW_EASE : EASE,
                  }}
                >
                  <HiwBuildPage level={previewLevel} />
                </motion.div>
              </LaptopChrome>
            </PerspectiveShell>
          ) : null}
        </motion.div>
      ) : null}

      <PreviewWire visible={wireOn} fromRef={portRef} toRef={jackRef} />

      {keepHouse ? (
        <motion.div
          className="absolute bottom-[-0.2rem] right-0 z-[3] w-[50%] overflow-visible sm:w-[48%] lg:w-[46%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: houseOn ? 1 : 0 }}
          transition={{
            duration: houseOn ? 0.28 : HOUSE_FADE_S,
            ease: houseOn ? EASE : GROW_EASE,
          }}
        >
          <HiwConstructionSketch
            shot={shot}
            phase={phase}
            showFoundation={showFoundation}
            swinging={swinging}
            jackRef={jackRef}
          />
        </motion.div>
      ) : null}

      <motion.div
        className="absolute inset-0 z-[4] flex items-center justify-center pt-2 sm:pt-3"
        initial={{ opacity: 0, y: 48, scale: 0.72 }}
        animate={{
          opacity: showPhone ? 1 : 0,
          y: showPhone ? 0 : 48,
          scale: showPhone ? 1 : 0.72,
        }}
        transition={{ duration: PHONE_IN_S, ease: PHONE_IN_EASE }}
        style={{ pointerEvents: 'none' }}
      >
        {grown || laptopGone || showPhone ? (
          <div className="w-[8.25rem] origin-center max-lg:-translate-x-10 sm:w-[11.5rem] lg:w-[12.5rem] lg:translate-x-0">
            <PerspectiveShell rotateY={-11} rotateX={5}>
              <PhoneChrome
                scene={phoneScene}
                scroll={phoneScroll}
                navCount={phoneNavCount}
                navIndex={phoneNav}
                scrollDuration={phoneScrollDuration}
                scrollEase={phoneScrollEase}
                finish="preview"
                card={phoneCard}
                className="relative"
              />
            </PerspectiveShell>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}

function useWanderScroll(playing: boolean, resetKey: string | number) {
  const [scroll, setScroll] = useState(0)
  const [scrollDuration, setScrollDuration] = useState(2.4)
  const [scrollEase, setScrollEase] = useState<ScrollEase>(SCROLL_EASE)

  useEffect(() => {
    if (!playing) {
      return
    }
    setScroll(0)
    let cancelled = false
    let id = 0
    let pos = -2

    const tick = () => {
      if (cancelled) return
      const roll = Math.random()

      if (roll < 0.2) {
        id = window.setTimeout(tick, 850 + Math.random() * 1500)
        return
      }

      let dur = 2.2
      let delta = -10
      let ease: ScrollEase = PAN_EASE
      let pause = 500

      if (roll < 0.46) {
        dur = 0.48 + Math.random() * 0.42
        delta = (Math.random() < 0.78 ? -1 : 1) * (7 + Math.random() * 14)
        ease = FLICK_EASE
        pause = 720 + Math.random() * 1100
      } else if (roll < 0.78) {
        dur = 1.9 + Math.random() * 1.5
        delta = (Math.random() < 0.82 ? -1 : 1) * (9 + Math.random() * 16)
        ease = PAN_EASE
        pause = 380 + Math.random() * 720
      } else {
        dur = 3.1 + Math.random() * 2.1
        delta = (Math.random() < 0.72 ? -1 : 1) * (3 + Math.random() * 7)
        ease = CRAWL_EASE
        pause = 900 + Math.random() * 1400
      }

      pos = Math.max(-40, Math.min(-1, pos + delta))
      setScrollDuration(dur)
      setScrollEase(ease)
      setScroll(pos)
      id = window.setTimeout(tick, dur * 1000 + pause)
    }

    id = window.setTimeout(tick, 480 + Math.random() * 900)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [playing, resetKey])

  return { scroll, scrollDuration, scrollEase }
}

export function HiwWorkingWebsiteSketch({
  playing,
  duration,
  entrance = 'land',
  size = 'live',
}: SketchProps & { entrance?: 'land' | 'fade'; size?: 'live' | 'compact' }) {
  const fadeIn = entrance === 'fade'
  const compact = size === 'compact'
  const land = {
    duration: fadeIn ? (compact ? 0.42 : 1.48) : 0.92,
    ease: fadeIn ? ([0.4, 0, 0.2, 1] as const) : LAND,
  } as const
  const fadeDelay = (late: number) => (fadeIn ? (compact ? late * 0.42 : late) : 0)
  const [laptopScene, setLaptopScene] = useState<ExampleSceneId>('home')
  const [phoneScene, setPhoneScene] = useState<ExampleSceneId>('products')
  const [tabletScene, setTabletScene] = useState<ExampleSceneId>('services')
  const [laptopNav, setLaptopNav] = useState(0)
  const [phoneNav, setPhoneNav] = useState(3)
  const [tabletNav, setTabletNav] = useState(3)
  const [cursor, setCursor] = useState<CursorPose | null>(null)
  const [laptopCard, setLaptopCard] = useState<ScreenCard | null>(null)
  const [phoneCard, setPhoneCard] = useState<ScreenCard | null>(null)
  const [pinScroll, setPinScroll] = useState<number | null>(null)

  const laptopWander = useWanderScroll(playing && pinScroll === null, laptopScene)
  const phoneWander = useWanderScroll(playing, phoneScene)
  const laptopNavCount = LIVE_SCENES.length
  const laptopScroll = pinScroll ?? laptopWander.scroll
  const laptopScrollDuration = pinScroll === null ? laptopWander.scrollDuration : 2.1
  const laptopScrollEase = pinScroll === null ? laptopWander.scrollEase : PAN_EASE

  useEffect(() => {
    if (!playing) {
      return
    }
    const aboutNav = navCursor(laptopNavCount, 1)
    const galleryNav = navCursor(laptopNavCount, 2)
    const timers = [
      window.setTimeout(() => {
        setPinScroll(0)
        setCursor({ x: HIT.open.x, y: HIT.open.y, click: false, intent: 'glide' })
      }, duration * 0.05),
      window.setTimeout(() => {
        setPinScroll(HOME_TEA_SCROLL)
        setCursor({ x: HIT.homeTea.x, y: HIT.homeTea.y, click: false, intent: 'act' })
      }, duration * 0.12),
      window.setTimeout(() => {
        setCursor({ x: HIT.homeTea.x, y: HIT.homeTea.y, click: true, intent: 'act' })
      }, duration * 0.2),
      window.setTimeout(() => {
        setCursor({ x: HIT.homeTea.x, y: HIT.homeTea.y, click: false, intent: 'act' })
        setLaptopCard(pickCard('home', 0))
      }, duration * 0.22),
      window.setTimeout(() => {
        setLaptopCard(null)
        setPhoneCard(pickCard('products', 0))
      }, duration * 0.3),
      window.setTimeout(() => {
        setPhoneCard(null)
        setPhoneScene('gallery')
        setPhoneNav(2)
      }, duration * 0.36),
      window.setTimeout(() => {
        setCursor({ ...galleryNav, click: false, intent: 'act' })
        setTabletScene('about')
        setTabletNav(1)
      }, duration * 0.4),
      window.setTimeout(() => {
        setCursor({ ...galleryNav, click: true, intent: 'act' })
      }, duration * 0.48),
      window.setTimeout(() => {
        setCursor({ ...galleryNav, click: false, intent: 'act' })
        setLaptopScene('gallery')
        setLaptopNav(2)
        setPinScroll(0)
      }, duration * 0.5),
      window.setTimeout(() => {
        setPinScroll(GALLERY_STOOL_SCROLL)
        setCursor({ x: HIT.galleryStool.x, y: HIT.galleryStool.y, click: false, intent: 'act' })
        setPhoneScene('home')
        setPhoneNav(0)
      }, duration * 0.58),
      window.setTimeout(() => {
        setCursor({ x: HIT.galleryStool.x, y: HIT.galleryStool.y, click: true, intent: 'act' })
        setTabletScene('gallery')
        setTabletNav(2)
      }, duration * 0.66),
      window.setTimeout(() => {
        setCursor({ x: HIT.galleryStool.x, y: HIT.galleryStool.y, click: false, intent: 'act' })
        setLaptopCard(pickCard('gallery', 0))
      }, duration * 0.68),
      window.setTimeout(() => {
        setLaptopCard(null)
        setCursor({ ...aboutNav, click: false, intent: 'act' })
        setPhoneScene('about')
        setPhoneNav(1)
      }, duration * 0.76),
      window.setTimeout(() => {
        setCursor({ ...aboutNav, click: true, intent: 'act' })
        setTabletScene('home')
        setTabletNav(0)
      }, duration * 0.84),
      window.setTimeout(() => {
        setCursor({ ...aboutNav, click: false, intent: 'act' })
        setLaptopScene('about')
        setLaptopNav(1)
        setPinScroll(null)
      }, duration * 0.86),
    ]
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration, laptopNavCount])

  return (
    <div
      className={
        fadeIn
          ? compact
            ? 'mt-0 flex flex-col items-center'
            : 'flex flex-col items-center'
          : 'flex -translate-y-2 flex-col items-center sm:-translate-y-3 lg:-translate-y-5'
      }
    >
      <div className={`flex items-end justify-center ${compact ? 'gap-3 sm:gap-4 lg:gap-5' : fadeIn ? 'gap-2.5 sm:gap-4' : 'gap-2 sm:gap-3'}`}>
        <motion.div
          className={
            compact
              ? 'relative w-[5.55rem] origin-bottom sm:w-[7.7rem] lg:w-[8.45rem]'
              : fadeIn
                ? 'relative w-[9.25rem] origin-bottom sm:w-[14.25rem] lg:w-[15.75rem]'
                : 'relative w-[10.25rem] origin-bottom sm:w-[16rem] lg:w-[18rem]'
          }
          initial={fadeIn ? { opacity: 0, y: 8 } : { x: -96, y: -34, scale: 0.56, opacity: 0 }}
          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={{ ...land, delay: fadeIn ? fadeDelay(0.1) : 0 }}
        >
          <PerspectiveShell rotateY={compact ? 14 : fadeIn ? 16 : 12} rotateX={compact ? 4 : fadeIn ? 3 : 5}>
            <LaptopChrome
              scene={laptopScene}
              scroll={laptopScroll}
              scrollDuration={laptopScrollDuration}
              scrollEase={laptopScrollEase}
              navCount={laptopNavCount}
              navIndex={laptopNav}
              finish="live"
              cursor={cursor}
              card={laptopCard}
              className="relative"
            />
          </PerspectiveShell>
        </motion.div>
        <motion.div
          className={
            compact
              ? 'relative w-[2.55rem] origin-bottom sm:w-[3.55rem] lg:w-[3.9rem]'
              : fadeIn
                ? 'relative w-[4.35rem] origin-bottom sm:w-[6.75rem] lg:w-[7.35rem]'
                : 'relative w-[5rem] origin-bottom sm:w-[7.75rem] lg:w-[8.5rem]'
          }
          initial={fadeIn ? { opacity: 0, y: 10 } : { x: 96, y: -30, scale: 0.56, opacity: 0 }}
          animate={{ x: 0, y: fadeIn || compact ? 5 : 2, scale: 1, opacity: 1 }}
          transition={{ ...land, delay: fadeIn ? fadeDelay(0.24) : 0.06 }}
        >
          <PerspectiveShell rotateY={compact ? -20 : fadeIn ? -24 : -13} rotateX={compact ? 7 : fadeIn ? 8 : 5}>
            <PhoneChrome
              scene={phoneScene}
              scroll={phoneWander.scroll}
              scrollDuration={phoneWander.scrollDuration}
              scrollEase={phoneWander.scrollEase}
              navCount={LIVE_PHONE_SCENES.length}
              navIndex={phoneNav}
              finish="live"
              card={phoneCard}
              className="relative"
            />
          </PerspectiveShell>
        </motion.div>
      </div>
      <motion.div
        className={
            compact
            ? 'relative z-0 mt-2.5 w-[3.7rem] origin-bottom sm:mt-3 sm:w-[5.25rem] lg:w-[5.75rem]'
            : fadeIn
              ? 'relative z-0 mt-2 w-[6.15rem] origin-bottom sm:mt-3 sm:w-[9.25rem] lg:w-[10.25rem]'
              : 'relative z-0 -mt-1 w-[6.75rem] origin-bottom sm:mt-0 sm:w-[10.25rem] lg:w-[11.25rem]'
        }
        initial={fadeIn ? { opacity: 0, y: 9 } : { y: -22, scale: 0.5, opacity: 0 }}
        animate={{ y: fadeIn || compact ? 0 : -8, scale: 1, opacity: 1 }}
        transition={{ ...land, delay: fadeIn ? fadeDelay(0.38) : 0.1 }}
      >
        <PerspectiveShell rotateY={compact ? 3 : fadeIn ? 2 : 8} rotateX={compact ? 10 : fadeIn ? 12 : 7}>
          <TabletChrome
            scene={tabletScene}
            navCount={LIVE_SCENES.length}
            navIndex={tabletNav}
            finish="live"
            className="relative"
          />
        </PerspectiveShell>
      </motion.div>
    </div>
  )
}
