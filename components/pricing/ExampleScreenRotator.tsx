'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import type { PlanId } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export type ExampleSceneId =
  | 'about'
  | 'portfolio'
  | 'gallery'
  | 'services'
  | 'products'
  | 'contact'
  | 'home'
  | 'homeAbout'
  | 'homeServices'
  | 'homeMenu'

export const EXAMPLE_SCENES_BY_PLAN: Partial<Record<PlanId, ExampleSceneId[]>> = {
  starter: ['about', 'portfolio', 'gallery', 'services', 'products', 'contact'],
  basic: ['homeAbout', 'homeServices', 'homeMenu'],
  business: ['home', 'about', 'services', 'gallery', 'contact'],
}

const FADE_S = 0.75
const DETAIL_OPEN_S = 0.92
const DETAIL_CLOSE_S = 0.8
const DETAIL_EXPAND: Ease = [0.16, 1, 0.3, 1]
const DETAIL_COLLAPSE: Ease = [0.4, 0, 0.2, 1]
const PAGE_SCROLL_MAX = 76
const COMPANY = 'Cedar Co.'
type Ease = [number, number, number, number]

const EASE_CLICK: Ease = [0.32, 0.06, 0.2, 1]
const SCROLL_EASE_DEFAULT: Ease = [0.3, 0, 0.28, 1]

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

function jitterSpot(spot: { x: number; y: number }) {
  const left = spot.x < 114
  return {
    x: left
      ? Math.min(10, Math.max(5, spot.x + rand(-2, 2)))
      : Math.min(216, Math.max(200, spot.x + rand(-3, 3))),
    y: Math.min(118, Math.max(64, spot.y + rand(-8, 8))),
  }
}

function sideOf(spot: { x: number }) {
  return spot.x < 114 ? 'left' : 'right'
}

function pickNextHover(
  spots: readonly { x: number; y: number }[],
  last: { x: number; y: number } | null,
  prefer: 'same' | 'other' | 'any'
) {
  if (!last) return pick(spots)
  const far = (spot: { x: number; y: number }) =>
    Math.hypot(spot.x - last.x, spot.y - last.y) > 18
  const same = spots.filter((spot) => sideOf(spot) === sideOf(last) && far(spot))
  const other = spots.filter((spot) => sideOf(spot) !== sideOf(last))
  if (prefer === 'same' && same.length > 0) return pick(same)
  if (prefer === 'other' && other.length > 0) return pick(other)
  const rest = spots.filter(far)
  return pick(rest.length > 0 ? rest : spots)
}

function randomEase(): Ease {
  const flavor = Math.random()
  if (flavor < 0.25) {
    return [rand(0.12, 0.34), rand(0.0, 0.16), rand(0.0, 0.24), 1]
  }
  if (flavor < 0.48) {
    return [rand(0.38, 0.58), rand(0.0, 0.14), rand(0.32, 0.56), 1]
  }
  if (flavor < 0.7) {
    return [rand(0.48, 0.72), 0, rand(0.1, 0.32), 1]
  }
  if (flavor < 0.88) {
    return [rand(0.16, 0.34), rand(0.52, 0.98), rand(0.18, 0.42), 1]
  }
  return [rand(0.22, 0.42), rand(0.82, 1.14), rand(0.12, 0.34), 1]
}

function pickScrollFrac() {
  const roll = Math.random()
  if (roll < 0.42) return rand(0.22, 0.44)
  if (roll < 0.78) return rand(0.5, 0.78)
  return rand(0.94, 1)
}

function randomScrollEase(): Ease {
  return [rand(0.2, 0.48), rand(0.0, 0.08), rand(0.16, 0.42), 1]
}

function arcThrough(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const sign = Math.random() < 0.5 ? -1 : 1
  const mag = rand(8, Math.min(42, 10 + len * 0.16))
  const t = rand(0.32, 0.64)
  return {
    x: Math.min(214, Math.max(8, from.x + dx * t + nx * sign * mag)),
    y: Math.min(110, Math.max(6, from.y + dy * t + ny * sign * mag)),
    t,
  }
}

type MoveTiming = {
  duration: number
  durationY: number
  ease: Ease
  easeY: Ease
  via?: { x: number; y: number }
  viaT: number
  viaTY: number
}

function moveTiming(from: { x: number; y: number }, to: { x: number; y: number }): MoveTiming {
  const dist = Math.hypot(to.x - from.x, to.y - from.y)
  const duration = Math.min(2.3, Math.max(0.72, 0.52 + dist * 0.0108 + rand(-0.2, 0.32)))
  const durationY = duration * rand(0.84, 1.2)
  const ease = randomEase()
  const easeY = randomEase()
  if (dist < 26) {
    return { duration, durationY, ease, easeY, viaT: 0.5, viaTY: 0.5 }
  }
  const via = arcThrough(from, to)
  return {
    duration,
    durationY,
    ease,
    easeY,
    via: { x: via.x, y: via.y },
    viaT: via.t,
    viaTY: Math.min(0.78, Math.max(0.28, via.t + rand(-0.12, 0.14))),
  }
}

/** Left/right margins only — never on titles, prices, or main artwork. */
const PAGE_HOVERS: Record<ExampleSceneId, { x: number; y: number }[]> = {
  about: [
    { x: 7, y: 78 },
    { x: 7, y: 108 },
    { x: 208, y: 68 },
    { x: 210, y: 108 },
  ],
  portfolio: [
    { x: 7, y: 88 },
    { x: 7, y: 112 },
    { x: 210, y: 70 },
    { x: 208, y: 108 },
  ],
  gallery: [
    { x: 7, y: 86 },
    { x: 7, y: 112 },
    { x: 210, y: 72 },
    { x: 208, y: 108 },
  ],
  services: [
    { x: 7, y: 80 },
    { x: 7, y: 110 },
    { x: 208, y: 68 },
    { x: 210, y: 108 },
  ],
  products: [
    { x: 7, y: 84 },
    { x: 7, y: 112 },
    { x: 208, y: 70 },
    { x: 210, y: 108 },
  ],
  contact: [
    { x: 7, y: 82 },
    { x: 7, y: 112 },
    { x: 210, y: 72 },
    { x: 208, y: 108 },
  ],
  home: [
    { x: 7, y: 80 },
    { x: 7, y: 110 },
    { x: 210, y: 68 },
    { x: 208, y: 108 },
  ],
  homeAbout: [
    { x: 7, y: 86 },
    { x: 7, y: 112 },
    { x: 208, y: 70 },
    { x: 210, y: 108 },
  ],
  homeServices: [
    { x: 7, y: 78 },
    { x: 7, y: 110 },
    { x: 208, y: 72 },
    { x: 210, y: 108 },
  ],
  homeMenu: [
    { x: 7, y: 84 },
    { x: 7, y: 112 },
    { x: 210, y: 68 },
    { x: 208, y: 108 },
  ],
}

type DetailIconId =
  | 'chair'
  | 'table'
  | 'pendant'
  | 'scarf'
  | 'succulent'
  | 'painting'
  | 'candle'
  | 'pillow'
  | 'fern'
  | 'vase'
  | 'floorLamp'
  | 'basket'
  | 'teapot'
  | 'brush'
  | 'gift'
  | 'watering'
  | 'mug'
  | 'tote'
  | 'soap'
  | 'tin'
  | 'cup'
  | 'palette'
  | 'ribbon'
  | 'spray'
  | 'soup'
  | 'salad'
  | 'tart'
  | 'scone'

type DetailTarget = {
  icon: DetailIconId
  x: number
  y: number
  name: string
  price: string
  blurb: string
  wash: string
  scale?: number
  layout?: 'grid' | 'photo' | 'row' | 'feature'
}

export function useRotatingIndex(length: number) {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const advance = useCallback(() => {
    if (length <= 1) return
    setIndex((current) => (current + 1) % length)
  }, [length])

  return { index, setIndex, advance, setPaused, paused, prefersReducedMotion }
}

export const C = {
  paper: 'oklch(99% 0.008 85)',
  sand: 'oklch(92% 0.02 80)',
  sandDeep: 'oklch(78% 0.05 75)',
  sky: 'oklch(82% 0.07 230)',
  skySoft: 'oklch(90% 0.04 230)',
  navy: 'oklch(38% 0.10 260)',
  primary: 'oklch(50% 0.13 255)',
  seafoam: 'oklch(72% 0.06 200)',
  gold: 'oklch(78% 0.10 85)',
  coral: 'oklch(70% 0.12 25)',
  blush: 'oklch(78% 0.10 20)',
  lip: 'oklch(62% 0.14 18)',
  line: 'oklch(86% 0.02 80)',
  skin: 'oklch(86% 0.05 55)',
  hair: 'oklch(36% 0.08 48)',
  hairSoft: 'oklch(48% 0.09 52)',
  cream: 'oklch(97% 0.012 85)',
  ink: 'oklch(24% 0.06 260)',
  muted: 'oklch(46% 0.03 60)',
}

const DETAIL_TARGETS: Partial<Record<ExampleSceneId, DetailTarget[]>> = {
  portfolio: [
    { icon: 'chair', x: 46, y: 72, name: 'Chair', price: '$48', blurb: 'A quiet seat by the window', wash: C.sand, scale: 1.45, layout: 'grid' },
    { icon: 'table', x: 114, y: 72, name: 'Table', price: '$62', blurb: 'Small enough for tea for two', wash: C.gold, scale: 1.35, layout: 'grid' },
    { icon: 'pendant', x: 182, y: 70, name: 'Lamp', price: '$40', blurb: 'Warm light for late pages', wash: C.skySoft, scale: 1.4, layout: 'grid' },
    { icon: 'scarf', x: 46, y: 128, name: 'Scarf', price: '$28', blurb: 'Soft wool from this winter', wash: C.coral, scale: 1.35, layout: 'grid' },
    { icon: 'succulent', x: 114, y: 128, name: 'Aloe', price: '$16', blurb: 'A little green for the counter', wash: C.seafoam, scale: 1.4, layout: 'grid' },
    { icon: 'painting', x: 182, y: 128, name: 'Print', price: '$22', blurb: 'Harbor light, on paper', wash: C.sky, scale: 1.25, layout: 'grid' },
    { icon: 'candle', x: 46, y: 184, name: 'Candle', price: '$12', blurb: 'Cedar and orange peel', wash: C.cream, scale: 1.4, layout: 'grid' },
    { icon: 'pillow', x: 114, y: 184, name: 'Pillow', price: '$18', blurb: 'For the chair by the kettle', wash: C.coral, scale: 1.3, layout: 'grid' },
  ],
  gallery: [
    { icon: 'fern', x: 63, y: 98, name: 'Fern', price: '$32', blurb: 'From this week’s shelf', wash: C.sky, scale: 1.35, layout: 'photo' },
    { icon: 'vase', x: 165, y: 98, name: 'Vase', price: '$44', blurb: 'Glazed in the back room', wash: C.seafoam, scale: 1.4, layout: 'photo' },
    { icon: 'floorLamp', x: 63, y: 170, name: 'Lamp', price: '$54', blurb: 'A tall glow for reading', wash: C.gold, scale: 1.15, layout: 'photo' },
    { icon: 'basket', x: 165, y: 170, name: 'Basket', price: '$19', blurb: 'For bread, or the market', wash: C.coral, scale: 1.4, layout: 'photo' },
  ],
  products: [
    { icon: 'mug', x: 52, y: 90, name: 'Ceramic mug', price: '$14', blurb: 'Handmade here, for slow mornings', wash: C.skySoft, scale: 1.7, layout: 'feature' },
    { icon: 'tote', x: 46, y: 162, name: 'Tote', price: '$36', blurb: 'Sturdy canvas, cedar tag', wash: C.coral, scale: 1.35, layout: 'grid' },
    { icon: 'soap', x: 114, y: 162, name: 'Soap', price: '$11', blurb: 'Sea salt and rosemary', wash: C.seafoam, scale: 1.45, layout: 'grid' },
    { icon: 'tin', x: 182, y: 162, name: 'Tea', price: '$7', blurb: 'The house blend, in a tin', wash: C.gold, scale: 1.4, layout: 'grid' },
  ],
  services: [
    { icon: 'teapot', x: 72, y: 74, name: 'Tea tasting', price: '$18', blurb: 'A quiet hour with the kettle', wash: C.skySoft, scale: 1.45, layout: 'row' },
    { icon: 'brush', x: 72, y: 100, name: 'Made to order', price: '$40+', blurb: 'Tell us what you need made', wash: C.sand, scale: 1.4, layout: 'row' },
    { icon: 'gift', x: 72, y: 126, name: 'Gift wrap', price: '$6', blurb: 'Ribbon, paper, a little note', wash: C.coral, scale: 1.4, layout: 'row' },
    { icon: 'watering', x: 72, y: 152, name: 'Plant care', price: '$12', blurb: 'We keep your greens happy', wash: C.seafoam, scale: 1.35, layout: 'row' },
  ],
  homeServices: [
    { icon: 'cup', x: 46, y: 76, name: 'Latte class', price: '$22', blurb: 'Foam, pour, and a quiet hour', wash: C.sand, scale: 1.45, layout: 'grid' },
    { icon: 'palette', x: 114, y: 76, name: 'Paint night', price: '$28', blurb: 'Colors, tea, and no rush', wash: C.skySoft, scale: 1.4, layout: 'grid' },
    { icon: 'ribbon', x: 182, y: 76, name: 'Bow & wrap', price: '$8', blurb: 'Leave the ribbons to us', wash: C.coral, scale: 1.45, layout: 'grid' },
    { icon: 'spray', x: 46, y: 138, name: 'Leaf shine', price: '$10', blurb: 'A little spa for the plants', wash: C.seafoam, scale: 1.35, layout: 'grid' },
  ],
  homeMenu: [
    { icon: 'soup', x: 72, y: 86, name: 'Tomato soup', price: '$9', blurb: 'Warm, with a thick slice', wash: C.coral, scale: 1.5, layout: 'row' },
    { icon: 'salad', x: 72, y: 110, name: 'Garden bowl', price: '$11', blurb: 'Greens from the morning market', wash: C.seafoam, scale: 1.4, layout: 'row' },
    { icon: 'tart', x: 72, y: 154, name: 'Berry tart', price: '$7', blurb: 'Baked before the door opened', wash: C.gold, scale: 1.45, layout: 'row' },
    { icon: 'scone', x: 72, y: 178, name: 'Lemon scone', price: '$4', blurb: 'Best with the house tea', wash: C.cream, scale: 1.5, layout: 'row' },
  ],
}

const DETAIL_PARKS = [
  { x: 216, y: 24 },
  { x: 216, y: 118 },
  { x: 8, y: 118 },
] as const

function clampCursor(pos: { x: number; y: number }) {
  return {
    x: Math.min(216, Math.max(6, pos.x)),
    y: Math.min(118, Math.max(22, pos.y)),
  }
}

function targetClickPos(target: DetailTarget, scrollY: number) {
  const layout = target.layout ?? 'grid'
  let x = target.x
  let y = target.y
  if (layout === 'grid') {
    x = target.x + 22
    y = target.y + 18
  } else if (layout === 'photo') {
    x = target.x + 50
    y = target.y - 20
  } else if (layout === 'row') {
    x = 152
    y = target.y - 8
  } else {
    x = 30
    y = 68
  }
  return clampCursor({
    x: x + rand(-2, 2),
    y: y + scrollY + rand(-2, 2),
  })
}

const INSPECT_CHANCE: Partial<Record<ExampleSceneId, number>> = {
  portfolio: 0.7,
  gallery: 1,
  products: 1,
  services: 0.55,
  homeServices: 0.75,
  homeMenu: 0.85,
}

function itemInView(pageY: number, scrollY: number) {
  const y = pageY + scrollY
  return y >= 32 && y <= 108
}

function navLayout(count: number) {
  const n = Math.max(count, 1)
  const w = n >= 6 ? 13 : n >= 5 ? 15 : 18
  const gap = n >= 6 ? 5 : 6
  const start = 12
  return Array.from({ length: n }, (_, i) => {
    const x = start + i * (w + gap)
    return { x, w, cx: x + w / 2 }
  })
}

function navCursorPoint(count: number, index: number) {
  const items = navLayout(count)
  const item = items[Math.min(Math.max(index, 0), items.length - 1)]
  if (!item) return { x: 20, y: 6 }
  return { x: item.cx, y: 6 }
}

type CursorShape = 'arrow' | 'hand'

type CursorPos = {
  x: number
  y: number
  via?: { x: number; y: number }
  viaT?: number
  viaTY?: number
  clicking: boolean
  duration: number
  durationY: number
  ease: Ease
  easeY: Ease
  shape: CursorShape
}

type ScrollStep = { y: number; at: number; duration: number; ease: Ease }

type VisitInspect = {
  target: DetailTarget
  origin: { x: number; y: number }
  clickPos: { x: number; y: number }
  onItemAt: number
  clickAt: number
  openAt: number
  closeAt: number
}

function planVisit(
  scene: ExampleSceneId,
  navIndex: number,
  nextNavIndex: number,
  navCount: number
) {
  const from = navCursorPoint(navCount, navIndex)
  const next = navCursorPoint(navCount, nextNavIndex)
  const spots = PAGE_HOVERS[scene]
  const hovers: (CursorPos & { at: number })[] = []
  const scrolls: ScrollStep[] = []

  let t = rand(1000, 1500)
  let cursor = from
  let lastScrollY = 0

  const addHover = (spot: { x: number; y: number }, drift = true) => {
    const pos = jitterSpot(spot)
    const timing = moveTiming(cursor, pos)
    hovers.push({
      ...pos,
      clicking: false,
      shape: 'arrow',
      at: t,
      ...timing,
    })
    t += Math.max(timing.duration, timing.durationY) * 1000 + rand(220, 980)
    cursor = pos
    if (drift && Math.random() < 0.62) {
      const left = pos.x < 114
      const rest = {
        x: left
          ? Math.min(10, Math.max(5, pos.x + rand(-2, 2)))
          : Math.min(216, Math.max(200, pos.x + rand(-3, 3))),
        y: Math.min(118, Math.max(64, pos.y + rand(-6, 6))),
      }
      const idleDuration = rand(0.7, 1.55)
      const idle: MoveTiming = {
        duration: idleDuration,
        durationY: idleDuration * rand(0.9, 1.22),
        ease: randomEase(),
        easeY: randomEase(),
        viaT: 0.5,
        viaTY: 0.5,
      }
      t += rand(40, 220)
      hovers.push({
        ...rest,
        clicking: false,
        shape: 'arrow',
        at: t,
        ...idle,
      })
      t += Math.max(idle.duration, idle.durationY) * 1000 + rand(160, 860)
      cursor = rest
    }
  }

  const addScroll = (y: number) => {
    const dist = Math.abs(y - lastScrollY)
    const duration = Math.min(
      2.55,
      Math.max(1.15, 0.88 + (dist / PAGE_SCROLL_MAX) * 1.2 + rand(-0.1, 0.22))
    )
    scrolls.push({ y, at: t, duration, ease: randomScrollEase() })
    t += duration * 1000 + rand(240, 920)
    lastScrollY = y
  }

  const downFrac = pickScrollFrac()
  const down = -PAGE_SCROLL_MAX * downFrac
  addScroll(down)

  const hoverAfter = Math.random() < 0.32 ? 1 : 2
  addHover(pickNextHover(spots, null, 'any'))
  if (hoverAfter === 2) {
    const relation = pick(['other', 'same', 'same', 'any'] as const)
    addHover(pickNextHover(spots, cursor, relation))
  }

  let pageScroll = down
  const bounceChance = downFrac >= 0.9 ? 0.55 : 0.78
  if (Math.random() < bounceChance) {
    const restFrac =
      downFrac >= 0.9 ? rand(0.55, 0.88) : rand(0.12, downFrac * 0.9)
    pageScroll = -PAGE_SCROLL_MAX * restFrac
    addScroll(pageScroll)
  }

  let inspect: VisitInspect | null = null
  const chance = INSPECT_CHANCE[scene] ?? 0
  const visible = (DETAIL_TARGETS[scene] ?? []).filter((item) => itemInView(item.y, pageScroll))
  if (chance > 0 && visible.length > 0 && Math.random() < chance) {
    const target = pick(visible)
    const clickPos = targetClickPos(target, pageScroll)
    const origin = clampCursor({
      x: target.x,
      y: target.y + pageScroll,
    })
    const timing = moveTiming(cursor, clickPos)
    hovers.push({
      ...clickPos,
      clicking: false,
      shape: 'arrow',
      at: t,
      ...timing,
    })
    t += Math.max(timing.duration, timing.durationY) * 1000
    cursor = clickPos
    const onItemAt = t + rand(70, 160)
    const clickAt = onItemAt + rand(140, 240)
    const openAt = clickAt + 180
    const parkPos = pick(DETAIL_PARKS)
    const parkAt = openAt + rand(280, 520)
    const parkTiming = moveTiming(clickPos, parkPos)
    hovers.push({
      ...parkPos,
      clicking: false,
      shape: 'arrow',
      at: parkAt,
      ...parkTiming,
    })
    cursor = parkPos
    const closeAt = parkAt + Math.max(parkTiming.duration, parkTiming.durationY) * 1000 + rand(900, 1600)
    t = closeAt + DETAIL_CLOSE_S * 1000 + rand(160, 320)
    inspect = { target, origin, clickPos, onItemAt, clickAt, openAt, closeAt }
  }

  const last = hovers[hovers.length - 1] ?? cursor
  const toNav = moveTiming(last, next)
  const toNavAt = t + rand(160, 640)
  const onChipAt = toNavAt + Math.max(toNav.duration, toNav.durationY) * 1000
  const clickAt = onChipAt + rand(160, 340)

  return { next, hovers, scrolls, toNavAt, toNav, onChipAt, clickAt, inspect }
}

function useScenePlay(
  scene: ExampleSceneId,
  navIndex: number,
  nextNavIndex: number,
  navCount: number,
  paused: boolean,
  reduced: boolean | null,
  onCursor: (pos: CursorPos) => void,
  onNavigate: () => void
) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDuration, setScrollDuration] = useState(0.01)
  const [scrollEase, setScrollEase] = useState<Ease>(SCROLL_EASE_DEFAULT)
  const [litNav, setLitNav] = useState(navIndex)
  const [detail, setDetail] = useState<{
    target: DetailTarget
    origin: { x: number; y: number }
  } | null>(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const onCursorRef = useRef(onCursor)
  onCursorRef.current = onCursor
  const onNavigateRef = useRef(onNavigate)
  onNavigateRef.current = onNavigate

  useEffect(() => {
    const visit = planVisit(scene, navIndex, nextNavIndex, navCount)
    setLitNav(navIndex)
    setScrollY(0)
    setScrollDuration(0.01)
    setScrollEase(SCROLL_EASE_DEFAULT)
    setDetail(null)
    if (reduced) return

    let cancelled = false
    const timers: number[] = []
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms))
    }

    for (const hover of visit.hovers) {
      later(hover.at, () => {
        if (cancelled) return
        onCursorRef.current({
          x: hover.x,
          y: hover.y,
          via: hover.via,
          viaT: hover.viaT,
          viaTY: hover.viaTY,
          clicking: false,
          duration: hover.duration,
          durationY: hover.durationY,
          ease: hover.ease,
          easeY: hover.easeY,
          shape: 'arrow',
        })
      })
    }

    for (const step of visit.scrolls) {
      later(step.at, () => {
        if (cancelled) return
        setScrollDuration(step.duration)
        setScrollEase(step.ease)
        setScrollY(step.y)
      })
    }

    if (visit.inspect) {
      const look = visit.inspect
      later(look.onItemAt, () => {
        if (cancelled) return
        onCursorRef.current({
          ...look.clickPos,
          clicking: false,
          duration: 0.16,
          durationY: 0.16,
          ease: EASE_CLICK,
          easeY: EASE_CLICK,
          shape: 'hand',
        })
      })
      later(look.clickAt, () => {
        if (cancelled) return
        onCursorRef.current({
          ...look.clickPos,
          clicking: true,
          duration: 0.12,
          durationY: 0.12,
          ease: EASE_CLICK,
          easeY: EASE_CLICK,
          shape: 'hand',
        })
      })
      later(look.openAt, () => {
        if (cancelled) return
        setDetail({ target: look.target, origin: look.origin })
        onCursorRef.current({
          ...look.clickPos,
          clicking: false,
          duration: 0.16,
          durationY: 0.16,
          ease: EASE_CLICK,
          easeY: EASE_CLICK,
          shape: 'arrow',
        })
      })
      later(look.closeAt, () => {
        if (cancelled) return
        setDetail(null)
      })
    }

    later(visit.toNavAt, () => {
      if (cancelled) return
      onCursorRef.current({
        ...visit.next,
        via: visit.toNav.via,
        viaT: visit.toNav.viaT,
        viaTY: visit.toNav.viaTY,
        clicking: false,
        duration: visit.toNav.duration,
        durationY: visit.toNav.durationY,
        ease: visit.toNav.ease,
        easeY: visit.toNav.easeY,
        shape: 'arrow',
      })
    })

    later(visit.onChipAt, () => {
      if (cancelled) return
      onCursorRef.current({
        ...visit.next,
        clicking: false,
        duration: 0.16,
        durationY: 0.16,
        ease: EASE_CLICK,
        easeY: EASE_CLICK,
        shape: 'hand',
      })
    })

    later(visit.clickAt, () => {
      const fire = () => {
        if (cancelled) return
        if (pausedRef.current) {
          later(200, fire)
          return
        }
        setLitNav(nextNavIndex)
        onCursorRef.current({
          ...visit.next,
          clicking: true,
          duration: 0.12,
          durationY: 0.12,
          ease: EASE_CLICK,
          easeY: EASE_CLICK,
          shape: 'hand',
        })
        onNavigateRef.current()
      }
      fire()
    })

    return () => {
      cancelled = true
      for (const id of timers) window.clearTimeout(id)
    }
  }, [scene, navIndex, nextNavIndex, navCount, reduced])

  return { scrollY, scrollDuration, scrollEase, litNav, detail }
}

function Tiny({
  x,
  y,
  size = 9,
  fill = C.ink,
  anchor = 'start',
  weight = 600,
  tracking = 0,
  children,
}: {
  x: number
  y: number
  size?: number
  fill?: string
  anchor?: 'start' | 'middle' | 'end'
  weight?: number
  tracking?: number
  children: string
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      textAnchor={anchor}
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight={weight}
      letterSpacing={tracking}
    >
      {children}
    </text>
  )
}

function Leader({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <line
      x1={x1}
      y1={y}
      x2={x2}
      y2={y}
      stroke={C.line}
      strokeWidth="1.1"
      strokeDasharray="1.4 2.6"
      strokeLinecap="round"
    />
  )
}

function PageHead({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <g>
      <Tiny x={16} y={36} size={7.5} fill={C.muted} weight={500} tracking={0.45}>
        {eyebrow}
      </Tiny>
      <Tiny x={16} y={52} size={13} weight={700}>
        {title}
      </Tiny>
    </g>
  )
}

function GridItem({
  x,
  y,
  name,
  price,
  children,
}: {
  x: number
  y: number
  name: string
  price: string
  children: ReactNode
}) {
  return (
    <g>
      {children}
      <Tiny x={x} y={y + 28} size={7.5} fill={C.muted} weight={500} anchor="middle">
        {name}
      </Tiny>
      <Tiny x={x} y={y + 40} size={9} fill={C.primary} weight={700} anchor="middle">
        {price}
      </Tiny>
    </g>
  )
}

function Photo({
  x,
  y,
  w,
  h,
  wash,
  name,
  price,
  children,
}: {
  x: number
  y: number
  w: number
  h: number
  wash: string
  name: string
  price: string
  children: ReactNode
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={C.cream} stroke={C.line} />
      <rect x={x + 5} y={y + 5} width={w - 10} height={h - 22} rx="3" fill={wash} />
      {children}
      <Tiny x={x + 7} y={y + h - 6} size={7} weight={600}>
        {name}
      </Tiny>
      <Tiny x={x + w - 7} y={y + h - 6} size={7} fill={C.primary} weight={700} anchor="end">
        {price}
      </Tiny>
    </g>
  )
}

function OfferRow({
  y,
  name,
  price,
  children,
}: {
  y: number
  name: string
  price: string
  children: ReactNode
}) {
  return (
    <g>
      {children}
      <Tiny x={42} y={y + 4} size={9} weight={500}>
        {name}
      </Tiny>
      <Leader x1={118} x2={176} y={y + 1} />
      <Tiny x={208} y={y + 4} size={10} fill={C.primary} weight={700} anchor="end">
        {price}
      </Tiny>
    </g>
  )
}

function NavPills({
  count,
  active = 0,
}: {
  count: number
  active?: number
}) {
  const items = navLayout(count)
  return (
    <g>
      <rect x="0" y="0" width="228" height="18" fill={C.sand} />
      {items.map((item, i) => (
        <rect
          key={item.x}
          x={item.x}
          y="5"
          width={item.w}
          height="7"
          rx="3.5"
          fill={i === active ? C.primary : C.line}
        />
      ))}
    </g>
  )
}

function IconHangingPlant({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-1" y="-14" width="2" height="8" fill={C.navy} />
      <path d="M-6 -6 H6 L4 8 H-4 Z" fill={C.coral} />
      <ellipse cx="-5" cy="10" rx="5" ry="7" fill={C.seafoam} />
      <ellipse cx="5" cy="10" rx="5" ry="7" fill={C.seafoam} />
      <ellipse cy="12" rx="6" ry="8" fill={C.seafoam} />
    </g>
  )
}

function IconStool({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cy="-6" rx="9" ry="3.2" fill={C.sandDeep} />
      <rect x="-7" y="-4" width="2.2" height="14" rx="1" fill={C.gold} />
      <rect x="4.8" y="-4" width="2.2" height="14" rx="1" fill={C.gold} />
      <path d="M-6 4 H6" stroke={C.sandDeep} strokeWidth="1.6" />
    </g>
  )
}

function IconJournal({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-11" y="-8" width="10" height="16" rx="1.2" fill={C.paper} stroke={C.navy} strokeWidth="1" />
      <rect x="1" y="-8" width="10" height="16" rx="1.2" fill={C.paper} stroke={C.navy} strokeWidth="1" />
      <path d="M-8 -3 H-4 M-8 1 H-3 M3 -3 H7" stroke={C.line} strokeWidth="1" />
    </g>
  )
}

function IconCake({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-9" y="-2" width="18" height="10" rx="2" fill={C.coral} />
      <rect x="-9" y="-8" width="18" height="7" rx="2" fill={C.cream} />
      <rect x="-9" y="-3" width="18" height="2" fill={C.gold} />
      <path d="M-4 -8 V-12 M2 -8 V-12" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="-4" cy="-13" r="1.4" fill={C.coral} />
      <circle cx="2" cy="-13" r="1.4" fill={C.seafoam} />
    </g>
  )
}

function IconChair({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-8" y="-12" width="16" height="10" rx="2" fill={C.sandDeep} />
      <rect x="-8" y="-2" width="16" height="4" rx="1.5" fill={C.gold} />
      <rect x="-7" y="2" width="3" height="10" rx="1" fill={C.sandDeep} />
      <rect x="4" y="2" width="3" height="10" rx="1" fill={C.sandDeep} />
    </g>
  )
}

function IconTable({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-14" y="-4" width="28" height="5" rx="2" fill={C.sandDeep} />
      <rect x="-12" y="1" width="3" height="10" rx="1" fill={C.gold} />
      <rect x="9" y="1" width="3" height="10" rx="1" fill={C.gold} />
    </g>
  )
}

function IconPendant({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-0.8" y="-16" width="1.6" height="8" fill={C.navy} />
      <path d="M-8 -8 H8 L5 4 H-5 Z" fill={C.gold} />
      <ellipse cy="4" rx="5" ry="2" fill={C.cream} />
    </g>
  )
}

function IconScarf({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-8 -8 Q0 -14 8 -8 Q4 2 6 12 Q0 6 -6 12 Q-4 2 -8 -8 Z" fill={C.coral} />
      <path d="M-3 -6 Q0 -2 3 -6" fill="none" stroke={C.gold} strokeWidth="1.2" />
    </g>
  )
}

function IconSucculent({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-6" y="4" width="12" height="8" rx="1.5" fill={C.sandDeep} />
      <ellipse cx="-5" cy="-2" rx="4" ry="7" fill={C.seafoam} transform="rotate(-28 -5 -2)" />
      <ellipse cx="5" cy="-2" rx="4" ry="7" fill={C.seafoam} transform="rotate(28 5 -2)" />
      <ellipse cy="-6" rx="4.5" ry="8" fill={C.seafoam} />
    </g>
  )
}

function IconPainting({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-12" y="-10" width="24" height="20" rx="1.5" fill={C.gold} />
      <rect x="-9" y="-7" width="18" height="14" fill={C.sky} />
      <circle cx="4" cy="-3" r="3" fill={C.gold} />
      <path d="M-9 7 L-3 1 L2 5 L9 0 V7 Z" fill={C.sandDeep} />
    </g>
  )
}

function IconCandle({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-5" y="2" width="10" height="8" rx="1.5" fill={C.sandDeep} />
      <rect x="-3" y="-8" width="6" height="12" rx="1.5" fill={C.cream} stroke={C.navy} strokeWidth="0.9" />
      <ellipse cy="-10" rx="1.6" ry="3" fill={C.gold} />
    </g>
  )
}

function IconPillow({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-11" y="-8" width="22" height="16" rx="5" fill={C.coral} />
      <rect x="-7" y="-4" width="14" height="8" rx="3" fill={C.gold} opacity="0.7" />
    </g>
  )
}

function IconFern({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-8" y="10" width="16" height="12" rx="3" fill={C.sandDeep} />
      <path d="M0 10 C-16 -6 -6 -18 0 -8 C6 -18 16 -6 0 10 Z" fill={C.seafoam} />
      <path d="M0 8 C-10 0 -4 -12 0 -2" fill="none" stroke={C.sandDeep} strokeWidth="1.2" />
    </g>
  )
}

function IconVase({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-6 -10 Q-11 4 -5 14 H5 Q11 4 6 -10 Z" fill={C.cream} stroke={C.navy} strokeWidth="1.1" />
      <ellipse cy="-10" rx="7" ry="3" fill={C.coral} />
      <ellipse cy="2" rx="3" ry="2" fill={C.gold} />
    </g>
  )
}

function IconFloorLamp({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-11 0 L-6 -14 H6 L11 0 Z" fill={C.paper} stroke={C.navy} strokeWidth="1" />
      <rect x="-1.4" y="0" width="2.8" height="16" rx="1" fill={C.navy} />
      <ellipse cy="16" rx="8" ry="2.2" fill={C.navy} />
    </g>
  )
}

function IconJar({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-7" y="-6" width="14" height="16" rx="3" fill={C.gold} />
      <rect x="-5" y="-11" width="10" height="6" rx="1.5" fill={C.sandDeep} />
      <path d="M-4 0 Q0 4 4 0" fill="none" stroke={C.cream} strokeWidth="1.3" />
    </g>
  )
}

function IconBasket({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-4 -8 Q0 -14 4 -8" fill="none" stroke={C.sandDeep} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M-10 -6 L-7 10 H7 L10 -6 Z" fill={C.gold} />
      <path d="M-8 -2 H8 M-7 4 H7" stroke={C.sandDeep} strokeWidth="1.1" />
    </g>
  )
}

function IconTeapot({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cy="2" rx="10" ry="8" fill={C.coral} />
      <rect x="-3" y="-10" width="6" height="5" rx="2" fill={C.coral} />
      <path d="M10 0 Q16 2 10 7" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" />
      <path d="M-2 -12 Q0 -16 2 -12" fill="none" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" />
    </g>
  )
}

function IconBrush({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-2" y="-12" width="4" height="14" rx="1.5" fill={C.sandDeep} />
      <path d="M-6 2 H6 L4 10 H-4 Z" fill={C.primary} />
    </g>
  )
}

function IconGift({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-8" y="-2" width="16" height="12" rx="2" fill={C.coral} />
      <rect x="-2" y="-2" width="4" height="12" fill={C.gold} />
      <rect x="-8" y="-6" width="16" height="5" rx="1.5" fill={C.gold} />
    </g>
  )
}

function IconWatering({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cy="2" rx="8" ry="6" fill={C.seafoam} />
      <path d="M6 0 L14 -4" stroke={C.seafoam} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="15" cy="-5" r="2" fill={C.seafoam} />
      <path d="M-4 -6 Q-8 -8 -6 2" fill="none" stroke={C.navy} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )
}

function IconMug({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-7" y="-8" width="14" height="16" rx="3" fill={C.paper} stroke={C.navy} strokeWidth="1.4" />
      <path d="M7 -2 Q13 0 7 6" fill="none" stroke={C.navy} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-3 -12 Q-1 -16 1 -12" fill="none" stroke={C.line} strokeWidth="1.1" />
    </g>
  )
}

function IconTote({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-9 -2 L-6 14 H6 L9 -2 Z" fill={C.coral} />
      <path d="M-5 -2 Q0 -12 5 -2" fill="none" stroke={C.navy} strokeWidth="1.7" strokeLinecap="round" />
      <rect x="-4" y="4" width="8" height="4" rx="1" fill={C.gold} />
    </g>
  )
}

function IconSoap({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-9" y="-2" width="18" height="10" rx="4" fill={C.seafoam} />
      <ellipse cy="-6" rx="6" ry="3" fill={C.cream} />
      <circle cx="5" cy="-10" r="2.4" fill={C.paper} opacity="0.8" />
    </g>
  )
}

function IconCroissant({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-12 4 Q-8 -10 4 -8 Q12 -2 10 6 Q0 0 -12 4 Z" fill={C.gold} />
      <path d="M-6 0 Q0 -6 6 0" fill="none" stroke={C.sandDeep} strokeWidth="1.1" />
    </g>
  )
}

function IconTin({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-8" y="-6" width="16" height="14" rx="2" fill={C.primary} />
      <ellipse cy="-6" rx="8" ry="3.2" fill={C.gold} />
      <rect x="-3" y="-1" width="6" height="5" rx="1" fill={C.cream} />
    </g>
  )
}

function IconTag({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-2 -10 L10 -4 L4 10 L-8 4 Z" fill={C.coral} />
      <circle cx="5" cy="-5" r="1.6" fill={C.cream} />
    </g>
  )
}

function IconEnvelope({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-12" y="-8" width="24" height="16" rx="2" fill={C.paper} stroke={C.navy} strokeWidth="1.3" />
      <path d="M-12 -8 L0 2 L12 -8" fill="none" stroke={C.navy} strokeWidth="1.3" />
    </g>
  )
}

function IconPhone({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-6" y="-11" width="12" height="22" rx="3" fill={C.navy} />
      <rect x="-4" y="-8" width="8" height="12" rx="1" fill={C.skySoft} />
      <circle cy="8" r="1.4" fill={C.paper} />
    </g>
  )
}

function IconTree({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-2" y="4" width="4" height="8" rx="1" fill={C.sandDeep} />
      <ellipse cy="-2" rx="10" ry="12" fill={C.seafoam} />
    </g>
  )
}

function IconAwning({ x, y, w }: { x: number; y: number; w: number }) {
  const n = 6
  const stripe = w / n
  return (
    <g>
      <rect x={x} y={y} width={w} height="12" rx="3" fill={C.coral} />
      {Array.from({ length: n }, (_, i) =>
        i % 2 === 0 ? null : (
          <rect key={i} x={x + i * stripe} y={y} width={stripe} height="12" fill={C.gold} />
        )
      )}
    </g>
  )
}

function IconKettle({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cy="2" rx="9" ry="7" fill={C.primary} />
      <rect x="-3" y="-8" width="6" height="5" rx="1.5" fill={C.gold} />
      <path d="M9 0 L15 -4" stroke={C.primary} strokeWidth="2" strokeLinecap="round" />
      <path d="M-6 -4 Q-12 -6 -8 4" fill="none" stroke={C.navy} strokeWidth="1.5" />
    </g>
  )
}

function IconRug({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse rx="18" ry="7" fill={C.coral} />
      <ellipse rx="12" ry="4" fill={C.gold} />
    </g>
  )
}

function IconCoat({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-1" y="-14" width="2" height="6" fill={C.navy} />
      <path d="M-8 -8 Q0 -12 8 -8 L10 10 Q0 6 -10 10 Z" fill={C.seafoam} />
      <rect x="-2" y="-6" width="4" height="12" fill={C.gold} />
    </g>
  )
}

function IconCup({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-6 -8 H6 L4 8 H-4 Z" fill={C.seafoam} />
      <path d="M6 -4 Q11 -2 6 4" fill="none" stroke={C.navy} strokeWidth="1.4" />
      <ellipse cy="-8" rx="6" ry="2" fill={C.cream} />
    </g>
  )
}

function IconLatte({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-5 -9 H5 L7 10 H-7 Z" fill={C.cream} stroke={C.navy} strokeWidth="1.1" />
      <ellipse cy="-2" rx="4.5" ry="2" fill={C.gold} />
      <ellipse cy="4" rx="5" ry="2.4" fill={C.sandDeep} />
      <path d="M-2 -14 Q0 -18 2 -14" fill="none" stroke={C.line} strokeWidth="1.1" />
    </g>
  )
}

function IconPalette({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse rx="11" ry="8" fill={C.sand} />
      <circle cx="8" cy="0" r="3" fill={C.paper} />
      <circle cx="-4" cy="-3" r="2" fill={C.coral} />
      <circle cx="1" cy="-3" r="2" fill={C.gold} />
      <circle cx="-2" cy="3" r="2" fill={C.seafoam} />
    </g>
  )
}

function IconRibbon({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M0 -4 L-8 8 H-3 L0 2 L3 8 H8 Z" fill={C.coral} />
      <circle r="4" fill={C.gold} />
    </g>
  )
}

function IconSpray({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-5" y="-2" width="10" height="14" rx="3" fill={C.sky} />
      <rect x="-2" y="-8" width="4" height="6" rx="1" fill={C.navy} />
      <path d="M2 -8 L8 -12" stroke={C.navy} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="-13" r="1.2" fill={C.skySoft} />
    </g>
  )
}

function IconSoup({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cy="-2" rx="10" ry="4" fill={C.gold} />
      <path d="M-11 -2 Q-9 10 0 11 Q9 10 11 -2" fill={C.coral} />
      <path d="M-2 -8 Q0 -14 3 -9" fill="none" stroke={C.line} strokeWidth="1.2" />
    </g>
  )
}

function IconSalad({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cy="6" rx="11" ry="4" fill={C.paper} stroke={C.navy} strokeWidth="1.1" />
      <ellipse cx="-3" cy="0" rx="6" ry="5" fill={C.seafoam} />
      <ellipse cx="4" cy="1" rx="5" ry="4" fill={C.seafoam} />
      <circle cx="2" cy="-2" r="2" fill={C.coral} />
    </g>
  )
}

function IconTart({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M-10 4 L-7 -6 H7 L10 4 Z" fill={C.gold} />
      <ellipse cy="-2" rx="6" ry="4" fill={C.coral} />
      <circle cy="-2" r="2" fill={C.cream} />
    </g>
  )
}

function IconScone({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse rx="10" ry="7" fill={C.sandDeep} />
      <ellipse cy="-1" rx="7" ry="4" fill={C.gold} />
      <circle cx="-3" cy="-1" r="1.1" fill={C.cream} />
    </g>
  )
}

function ClipMaya({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cx="-9" cy="10" rx="4.8" ry="13" fill={C.hair} />
      <ellipse cx="9" cy="10" rx="4.8" ry="13" fill={C.hair} />
      <circle cx="-3" cy="-16" r="4.2" fill={C.hair} />
      <circle cx="2" cy="-17" r="3.4" fill={C.hair} />
      <ellipse cy="18" rx="13.5" ry="11.5" fill={C.coral} />
      <path d="M-9 8 L-11 22 H11 L9 8 Z" fill={C.cream} />
      <path d="M-4 8 L-5 22 M4 8 L5 22" stroke={C.gold} strokeWidth="1.1" />
      <ellipse cy="8" rx="5.2" ry="3.4" fill={C.skin} />
      <circle cy="-7" r="7.6" fill={C.skin} />
      <path d="M-7.4 -12.6 Q-1 -18.5 7.2 -13.2 Q3.6 -10.2 -0.6 -11.4 Q-4.8 -10.8 -7.4 -12.6" fill={C.hair} />
      <path d="M-4.6 -11.2 Q-2.6 -12.2 -1.2 -11" fill="none" stroke={C.hair} strokeWidth="0.85" strokeLinecap="round" />
      <path d="M1.4 -11 Q3.4 -12.4 5.2 -11.1" fill="none" stroke={C.hair} strokeWidth="0.85" strokeLinecap="round" />
      <circle cx="-2.5" cy="-7.4" r="1.05" fill={C.hair} />
      <circle cx="2.6" cy="-7.4" r="1.05" fill={C.hair} />
      <path d="M-3.4 -7.1 L-4.2 -8.2 M-1.6 -7.1 L-1.1 -8.2" stroke={C.hair} strokeWidth="0.55" strokeLinecap="round" />
      <path d="M1.7 -7.1 L1.2 -8.2 M3.5 -7.1 L4.3 -8.2" stroke={C.hair} strokeWidth="0.55" strokeLinecap="round" />
      <circle cx="-2.1" cy="-7.7" r="0.28" fill={C.paper} />
      <circle cx="3" cy="-7.7" r="0.28" fill={C.paper} />
      <path d="M0 -6.2 L0.8 -4.7 L-0.7 -4.7 Z" fill={C.blush} />
      <ellipse cx="-3.6" cy="-5.2" rx="1.5" ry="0.9" fill={C.blush} opacity="0.7" />
      <ellipse cx="3.8" cy="-5.2" rx="1.5" ry="0.9" fill={C.blush} opacity="0.7" />
      <path d="M-2.2 -3.6 Q0 -1.7 2.3 -3.6 Q0 -2.6 -2.2 -3.6 Z" fill={C.lip} />
      <circle cx="6.2" cy="-3.8" r="1.05" fill="none" stroke={C.gold} strokeWidth="0.85" />
    </g>
  )
}

function SceneAbout() {
  return (
    <g>
      <PageHead eyebrow="ABOUT" title="Meet Maya" />
      <circle cx="48" cy="92" r="26" fill={C.sand} />
      <ClipMaya cx={48} cy={94} />
      <Tiny x={88} y={80} size={8} fill={C.muted} weight={500}>
        Shop owner
      </Tiny>
      <Tiny x={88} y={96} size={9} weight={500}>
        I keep the kettle on
      </Tiny>
      <Tiny x={88} y={110} size={9} weight={500}>
        and the door open.
      </Tiny>
      <line x1="16" y1="132" x2="212" y2="132" stroke={C.line} strokeWidth="1" />
      <Tiny x={16} y={150} size={7.5} fill={C.muted} weight={500} tracking={0.4}>
        THIS WEEKEND
      </Tiny>
      <IconCake cx={36} cy={174} scale={0.85} />
      <Tiny x={58} y={170} size={9} weight={600}>
        Slice of cake
      </Tiny>
      <Tiny x={58} y={184} size={12} fill={C.primary} weight={700}>
        $8
      </Tiny>
    </g>
  )
}

function ScenePortfolio() {
  return (
    <g>
      <PageHead eyebrow="SHOP" title="In the shop" />
      <GridItem x={46} y={72} name="Chair" price="$48">
        <IconChair cx={46} cy={72} scale={0.85} />
      </GridItem>
      <GridItem x={114} y={72} name="Table" price="$62">
        <IconTable cx={114} cy={72} scale={0.85} />
      </GridItem>
      <GridItem x={182} y={72} name="Lamp" price="$40">
        <IconPendant cx={182} cy={70} scale={0.85} />
      </GridItem>
      <GridItem x={46} y={128} name="Scarf" price="$28">
        <IconScarf cx={46} cy={126} scale={0.75} />
      </GridItem>
      <GridItem x={114} y={128} name="Aloe" price="$16">
        <IconSucculent cx={114} cy={126} scale={0.85} />
      </GridItem>
      <GridItem x={182} y={128} name="Print" price="$22">
        <IconPainting cx={182} cy={126} scale={0.62} />
      </GridItem>
      <GridItem x={46} y={184} name="Candle" price="$12">
        <IconCandle cx={46} cy={182} scale={0.8} />
      </GridItem>
      <GridItem x={114} y={184} name="Pillow" price="$18">
        <IconPillow cx={114} cy={182} scale={0.75} />
      </GridItem>
    </g>
  )
}

function SceneGallery() {
  return (
    <g>
      <PageHead eyebrow="GALLERY" title="From the shop" />
      <Photo x={16} y={62} w={94} h={72} wash={C.sky} name="Fern" price="$32">
        <IconFern cx={63} cy={88} scale={0.7} />
      </Photo>
      <Photo x={118} y={62} w={94} h={72} wash={C.seafoam} name="Vase" price="$44">
        <IconVase cx={165} cy={90} scale={0.7} />
      </Photo>
      <Photo x={16} y={142} w={94} h={56} wash={C.gold} name="Lamp" price="$54">
        <IconFloorLamp cx={63} cy={162} scale={0.55} />
      </Photo>
      <Photo x={118} y={142} w={94} h={56} wash={C.coral} name="Basket" price="$19">
        <IconBasket cx={165} cy={162} scale={0.7} />
      </Photo>
    </g>
  )
}

function SceneServices() {
  return (
    <g>
      <PageHead eyebrow="SERVICES" title="What we offer" />
      <OfferRow y={74} name="Tea tasting" price="$18">
        <IconTeapot cx={24} cy={74} scale={0.55} />
      </OfferRow>
      <OfferRow y={100} name="Made to order" price="$40+">
        <IconBrush cx={24} cy={100} scale={0.55} />
      </OfferRow>
      <OfferRow y={126} name="Gift wrap" price="$6">
        <IconGift cx={24} cy={126} scale={0.55} />
      </OfferRow>
      <OfferRow y={152} name="Plant care" price="$12">
        <IconWatering cx={24} cy={152} scale={0.55} />
      </OfferRow>
      <Tiny x={16} y={184} size={8} fill={C.muted} weight={500}>
        Open Tue–Sun, 8–4
      </Tiny>
    </g>
  )
}

function SceneProducts() {
  return (
    <g>
      <PageHead eyebrow="GOODS" title="For the table" />
      <rect x="16" y="64" width="72" height="56" rx="8" fill={C.skySoft} />
      <IconMug cx={52} cy={90} />
      <Tiny x={100} y={82} size={8} fill={C.muted} weight={500}>
        Ceramic mug
      </Tiny>
      <Tiny x={100} y={100} size={16} fill={C.primary} weight={700}>
        $14
      </Tiny>
      <Tiny x={100} y={114} size={8} weight={500}>
        Handmade here
      </Tiny>
      <Tiny x={16} y={140} size={7.5} fill={C.muted} weight={500} tracking={0.4}>
        ALSO IN SHOP
      </Tiny>
      <GridItem x={46} y={162} name="Tote" price="$36">
        <IconTote cx={46} cy={160} scale={0.7} />
      </GridItem>
      <GridItem x={114} y={162} name="Soap" price="$11">
        <IconSoap cx={114} cy={160} scale={0.8} />
      </GridItem>
      <GridItem x={182} y={162} name="Tea" price="$7">
        <IconTin cx={182} cy={160} scale={0.7} />
      </GridItem>
    </g>
  )
}

function SceneContact() {
  return (
    <g>
      <PageHead eyebrow="CONTACT" title="Come by" />
      <Tiny x={16} y={74} size={7.5} fill={C.muted} weight={500}>
        Email
      </Tiny>
      <Tiny x={16} y={88} size={11} fill={C.primary} weight={700}>
        hello@cedar.co
      </Tiny>
      <Tiny x={16} y={110} size={7.5} fill={C.muted} weight={500}>
        Phone
      </Tiny>
      <Tiny x={16} y={124} size={11} weight={600}>
        (555) 014–2019
      </Tiny>
      <line x1="16" y1="140" x2="212" y2="140" stroke={C.line} strokeWidth="1" />
      <Tiny x={16} y={160} size={12} weight={700}>
        14 Harbor Lane
      </Tiny>
      <Tiny x={16} y={176} size={8.5} fill={C.muted} weight={500}>
        Tue–Sun, 8–4
      </Tiny>
      <IconEnvelope cx={188} cy={82} scale={0.7} />
      <IconPhone cx={188} cy={164} scale={0.65} />
    </g>
  )
}

function SceneHome() {
  return (
    <g>
      <rect x="0" y="18" width="228" height="86" fill={C.sky} />
      <circle cx="196" cy="38" r="10" fill={C.gold} />
      <rect x="36" y="56" width="156" height="48" fill={C.sand} />
      <IconAwning x={36} y={48} w={156} />
      <Tiny x={114} y={44} size={10} weight={700} tracking={0.25} anchor="middle">
        {COMPANY}
      </Tiny>
      <rect x="50" y="66" width="50" height="30" rx="2" fill={C.paper} stroke={C.line} />
      <rect x="54" y="69" width="42" height="24" fill={C.skySoft} />
      <ClipMaya cx={75} cy={84} scale={0.45} />
      <rect x="110" y="70" width="22" height="34" rx="2" fill={C.coral} />
      <rect x="116" y="86" width="6" height="6" rx="1" fill={C.gold} />
      <rect x="142" y="70" width="36" height="16" rx="2" fill={C.cream} />
      <Tiny x={160} y={81} size={7.5} fill={C.primary} weight={700} tracking={0.5} anchor="middle">
        OPEN
      </Tiny>
      <IconTree cx={208} cy={82} scale={0.5} />
      <Tiny x={16} y={128} size={13} weight={700}>
        Come sit a while
      </Tiny>
      <Tiny x={16} y={146} size={8} fill={C.muted} weight={500}>
        Open 8–4  ·  Harbor Lane
      </Tiny>
      <line x1="16" y1="160" x2="212" y2="160" stroke={C.line} strokeWidth="1" />
      <Tiny x={16} y={178} size={8} weight={500}>
        Tea, cake, and a quiet table
      </Tiny>
    </g>
  )
}

function SceneHomeAbout() {
  return (
    <g>
      <PageHead eyebrow="OUR STORY" title="A slow little shop" />
      <circle cx="48" cy="92" r="24" fill={C.sand} />
      <ClipMaya cx={48} cy={94} scale={0.9} />
      <Tiny x={86} y={82} size={9} weight={500}>
        Maya opened Cedar Co.
      </Tiny>
      <Tiny x={86} y={96} size={9} weight={500}>
        to make a quiet place
      </Tiny>
      <Tiny x={86} y={110} size={9} weight={500}>
        for tea and small goods.
      </Tiny>
      <line x1="16" y1="132" x2="212" y2="132" stroke={C.line} strokeWidth="1" />
      <Tiny x={16} y={154} size={8} fill={C.muted} weight={500}>
        Est. 2019
      </Tiny>
      <Tiny x={16} y={170} size={10} weight={600}>
        Harbor Lane
      </Tiny>
      <IconKettle cx={188} cy={160} scale={0.85} />
    </g>
  )
}

function SceneHomeServices() {
  return (
    <g>
      <PageHead eyebrow="CLASSES" title="This week" />
      <GridItem x={46} y={78} name="Latte class" price="$22">
        <IconCup cx={46} cy={76} scale={0.7} />
      </GridItem>
      <GridItem x={114} y={78} name="Paint night" price="$28">
        <IconPalette cx={114} cy={76} scale={0.8} />
      </GridItem>
      <GridItem x={182} y={78} name="Bow & wrap" price="$8">
        <IconRibbon cx={182} cy={76} scale={0.85} />
      </GridItem>
      <GridItem x={46} y={140} name="Leaf shine" price="$10">
        <IconSpray cx={46} cy={138} scale={0.7} />
      </GridItem>
    </g>
  )
}

function SceneHomeMenu() {
  return (
    <g>
      <PageHead eyebrow="MENU" title="Today" />
      <Tiny x={16} y={68} size={7.5} fill={C.muted} weight={500} tracking={0.45}>
        KITCHEN
      </Tiny>
      <OfferRow y={86} name="Tomato soup" price="$9">
        <IconSoup cx={24} cy={86} scale={0.5} />
      </OfferRow>
      <OfferRow y={110} name="Garden bowl" price="$11">
        <IconSalad cx={24} cy={110} scale={0.5} />
      </OfferRow>
      <Tiny x={16} y={136} size={7.5} fill={C.muted} weight={500} tracking={0.45}>
        SWEETS
      </Tiny>
      <OfferRow y={154} name="Berry tart" price="$7">
        <IconTart cx={24} cy={154} scale={0.5} />
      </OfferRow>
      <OfferRow y={178} name="Lemon scone" price="$4">
        <IconScone cx={24} cy={178} scale={0.65} />
      </OfferRow>
    </g>
  )
}

export function ScenePage({ scene }: { scene: ExampleSceneId }) {
  switch (scene) {
    case 'about':
      return <SceneAbout />
    case 'portfolio':
      return <ScenePortfolio />
    case 'gallery':
      return <SceneGallery />
    case 'services':
      return <SceneServices />
    case 'products':
      return <SceneProducts />
    case 'contact':
      return <SceneContact />
    case 'home':
      return <SceneHome />
    case 'homeAbout':
      return <SceneHomeAbout />
    case 'homeServices':
      return <SceneHomeServices />
    case 'homeMenu':
      return <SceneHomeMenu />
  }
}

function DetailIcon({
  icon,
  cx,
  cy,
  scale = 1,
}: {
  icon: DetailIconId
  cx: number
  cy: number
  scale?: number
}) {
  switch (icon) {
    case 'chair':
      return <IconChair cx={cx} cy={cy} scale={scale} />
    case 'table':
      return <IconTable cx={cx} cy={cy} scale={scale} />
    case 'pendant':
      return <IconPendant cx={cx} cy={cy} scale={scale} />
    case 'scarf':
      return <IconScarf cx={cx} cy={cy} scale={scale} />
    case 'succulent':
      return <IconSucculent cx={cx} cy={cy} scale={scale} />
    case 'painting':
      return <IconPainting cx={cx} cy={cy} scale={scale} />
    case 'candle':
      return <IconCandle cx={cx} cy={cy} scale={scale} />
    case 'pillow':
      return <IconPillow cx={cx} cy={cy} scale={scale} />
    case 'fern':
      return <IconFern cx={cx} cy={cy} scale={scale} />
    case 'vase':
      return <IconVase cx={cx} cy={cy} scale={scale} />
    case 'floorLamp':
      return <IconFloorLamp cx={cx} cy={cy} scale={scale} />
    case 'basket':
      return <IconBasket cx={cx} cy={cy} scale={scale} />
    case 'teapot':
      return <IconTeapot cx={cx} cy={cy} scale={scale} />
    case 'brush':
      return <IconBrush cx={cx} cy={cy} scale={scale} />
    case 'gift':
      return <IconGift cx={cx} cy={cy} scale={scale} />
    case 'watering':
      return <IconWatering cx={cx} cy={cy} scale={scale} />
    case 'mug':
      return <IconMug cx={cx} cy={cy} scale={scale} />
    case 'tote':
      return <IconTote cx={cx} cy={cy} scale={scale} />
    case 'soap':
      return <IconSoap cx={cx} cy={cy} scale={scale} />
    case 'tin':
      return <IconTin cx={cx} cy={cy} scale={scale} />
    case 'cup':
      return <IconCup cx={cx} cy={cy} scale={scale} />
    case 'palette':
      return <IconPalette cx={cx} cy={cy} scale={scale} />
    case 'ribbon':
      return <IconRibbon cx={cx} cy={cy} scale={scale} />
    case 'spray':
      return <IconSpray cx={cx} cy={cy} scale={scale} />
    case 'soup':
      return <IconSoup cx={cx} cy={cy} scale={scale} />
    case 'salad':
      return <IconSalad cx={cx} cy={cy} scale={scale} />
    case 'tart':
      return <IconTart cx={cx} cy={cy} scale={scale} />
    case 'scone':
      return <IconScone cx={cx} cy={cy} scale={scale} />
  }
}

function DetailSheet({
  target,
  origin,
  reduced,
}: {
  target: DetailTarget
  origin: { x: number; y: number }
  reduced: boolean | null
}) {
  const ox = `${(origin.x / 228) * 100}%`
  const oy = `${(origin.y / 124) * 100}%`
  return (
    <motion.div
      className="absolute inset-0 z-[1] overflow-hidden"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.22, ease: DETAIL_EXPAND } }}
      exit={{
        opacity: [1, 1, 0],
        transition: { duration: DETAIL_CLOSE_S, times: [0, 0.72, 1], ease: DETAIL_COLLAPSE },
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'oklch(28% 0.02 50 / 0.16)' }}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, ease: DETAIL_EXPAND } }}
        exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.28, ease: DETAIL_COLLAPSE } }}
      />
      <motion.div
        className="absolute inset-0 origin-center will-change-transform"
        style={{ transformOrigin: `${ox} ${oy}` }}
        initial={reduced ? false : { scale: 0.18, opacity: 0.45 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            scale: { duration: DETAIL_OPEN_S, ease: DETAIL_EXPAND },
            opacity: { duration: 0.38, ease: DETAIL_EXPAND },
          },
        }}
        exit={{
          scale: 0.18,
          opacity: 0.4,
          transition: {
            scale: { duration: DETAIL_CLOSE_S, ease: DETAIL_COLLAPSE },
            opacity: { duration: 0.36, delay: 0.34, ease: DETAIL_COLLAPSE },
          },
        }}
      >
        <svg
          viewBox="0 0 228 124"
          className="h-full w-full"
          style={{ textRendering: 'geometricPrecision' }}
        >
          <rect width="228" height="124" fill={C.paper} />
          <rect
            x="10"
            y="22"
            width="208"
            height="92"
            rx="10"
            fill={C.cream}
            stroke={C.line}
          />
          <rect x="18" y="30" width="82" height="76" rx="8" fill={target.wash} />
          <motion.g
            initial={reduced ? false : { opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.42, delay: 0.36, ease: DETAIL_EXPAND },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: DETAIL_COLLAPSE } }}
          >
            <DetailIcon
              icon={target.icon}
              cx={59}
              cy={68}
              scale={target.scale ?? 1.35}
            />
            <Tiny x={114} y={46} size={7.5} fill={C.muted} weight={500} tracking={0.45}>
              DETAILS
            </Tiny>
            <Tiny x={114} y={66} size={14} weight={700}>
              {target.name}
            </Tiny>
            <Tiny x={114} y={84} size={13} fill={C.primary} weight={700}>
              {target.price}
            </Tiny>
            <Tiny x={114} y={102} size={8} fill={C.muted} weight={500}>
              {target.blurb}
            </Tiny>
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  )
}

function Scrollbar({ progress }: { progress: MotionValue<number> }) {
  const trackTop = 22
  const trackH = 96
  const thumbH = 28
  const thumbY = useTransform(progress, (p) => {
    const clamped = Math.min(1, Math.max(0, p))
    return trackTop + (trackH - thumbH) * clamped
  })
  return (
    <g>
      <rect x="220" y={trackTop} width="4" height={trackH} rx="2" fill={C.sand} />
      <motion.rect
        x="220"
        y={thumbY}
        width="4"
        height={thumbH}
        rx="2"
        fill={C.line}
      />
    </g>
  )
}

function SceneChrome({
  navCount,
  activeNav,
  progress,
  hideScroll = false,
}: {
  navCount: number
  activeNav: number
  progress: MotionValue<number>
  hideScroll?: boolean
}) {
  return (
    <svg viewBox="0 0 228 124" className="pointer-events-none absolute inset-0 h-full w-full">
      <NavPills count={navCount} active={activeNav} />
      <motion.g
        animate={{ opacity: hideScroll ? 0 : 1 }}
        transition={{
          duration: hideScroll ? 0.35 : 0.5,
          delay: hideScroll ? 0 : 0.28,
          ease: hideScroll ? DETAIL_EXPAND : DETAIL_COLLAPSE,
        }}
      >
        <Scrollbar progress={progress} />
      </motion.g>
    </svg>
  )
}

function ClipCursor({
  clicking,
  shape,
}: {
  clicking: boolean
  shape: CursorShape
}) {
  const fill = 'oklch(99% 0.008 85)'
  const stroke = 'oklch(32% 0.08 260)'
  return (
    <motion.svg
      width="13"
      height="16"
      viewBox="0 0 16 20"
      animate={{ scale: clicking ? 0.92 : 1 }}
      transition={{ duration: 0.14, ease: [0.4, 0, 0.55, 1] }}
      className="overflow-visible drop-shadow-[0_1px_1px_oklch(28%_0.02_50/0.28)]"
    >
      <motion.g
        animate={{ opacity: shape === 'arrow' ? 1 : 0 }}
        transition={{ duration: 0.12, ease: [0.25, 0.08, 0.18, 1] }}
      >
        <path
          d="M1.1 1.2 L1.4 16.4 L5.6 12.2 L8.8 19.2 L11.8 17.8 L8.5 10.9 L13.8 10.7 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </motion.g>
      <motion.g
        animate={{ opacity: shape === 'hand' ? 1 : 0 }}
        transition={{ duration: 0.12, ease: [0.25, 0.08, 0.18, 1] }}
      >
        <path
          d="M6.1 1.3 C7.2 1.3 8 2.2 8 3.3 L8 8.1 L8.7 8.1 L8.7 4.9 C8.7 3.9 9.5 3.2 10.5 3.2 C11.5 3.2 12.2 4 12.2 5 L12.2 8.5 L12.8 8.5 L12.8 6.3 C12.8 5.4 13.6 4.9 14.4 5.1 C15.1 5.3 15.5 6.1 15.3 6.9 L14 14.1 C13.5 16.4 11.5 18 9.1 18 L5.8 18 C3.8 18 2.3 16.4 2.3 14.4 L2.3 10 C2.3 8.8 3.2 8 4.3 8 L5.4 8 L5.4 3.3 C5.4 2.2 5.1 1.3 6.1 1.3 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.svg>
  )
}

type ExampleScreenRotatorProps = {
  scene: ExampleSceneId
  navIndex: number
  nextNavIndex: number
  navCount: number
  paused?: boolean
  onNavigate?: () => void
  onHoverPause?: (paused: boolean) => void
  className?: string
}

function ScenePlayView({
  scene,
  navIndex,
  nextNavIndex,
  navCount,
  paused,
  reduced,
  onCursor,
  onNavigate,
}: {
  scene: ExampleSceneId
  navIndex: number
  nextNavIndex: number
  navCount: number
  paused: boolean
  reduced: boolean | null
  onCursor: (pos: CursorPos) => void
  onNavigate: () => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [unit, setUnit] = useState(1)
  const { scrollY, scrollDuration, scrollEase, litNav, detail } = useScenePlay(
    scene,
    navIndex,
    nextNavIndex,
    navCount,
    paused,
    reduced,
    onCursor,
    onNavigate
  )
  const scrollMV = useMotionValue(0)
  const unitRef = useRef(unit)
  unitRef.current = unit
  const pageY = useTransform(scrollMV, (value) => (reduced ? 0 : value) * unitRef.current)
  const progress = useTransform(scrollMV, (value) =>
    Math.min(1, Math.abs(value) / PAGE_SCROLL_MAX)
  )

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const sync = () => setUnit(el.clientHeight / 124)
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) {
      scrollMV.set(0)
      return
    }
    const controls = animate(scrollMV, scrollY, {
      duration: scrollDuration,
      ease: scrollEase,
    })
    return () => controls.stop()
  }, [reduced, scrollDuration, scrollEase, scrollMV, scrollY])

  return (
    <motion.div
      ref={frameRef}
      className="absolute inset-0"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: FADE_S, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 overflow-hidden [contain:paint]">
        <motion.div
          className="absolute inset-x-0 top-0 will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ y: pageY }}
        >
          <svg
            viewBox="0 0 228 200"
            className="block w-full"
            style={{ height: `${(200 / 124) * 100}%`, textRendering: 'geometricPrecision' }}
          >
            <rect width="228" height="200" fill={C.paper} />
            <ScenePage scene={scene} />
          </svg>
        </motion.div>
      </div>
      <AnimatePresence>
        {detail ? (
          <DetailSheet
            key={`${detail.target.icon}-${detail.target.name}`}
            target={detail.target}
            origin={detail.origin}
            reduced={reduced}
          />
        ) : null}
      </AnimatePresence>
      <SceneChrome
        navCount={navCount}
        activeNav={litNav}
        progress={progress}
        hideScroll={detail != null}
      />
    </motion.div>
  )
}

export function ExampleScreenRotator({
  scene,
  navIndex,
  nextNavIndex,
  navCount,
  paused = false,
  onNavigate,
  onHoverPause,
  className,
}: ExampleScreenRotatorProps) {
  const prefersReducedMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState({ w: 200, h: 140 })
  const [cursor, setCursor] = useState<CursorPos>(() => ({
    x: 48,
    y: 72,
    clicking: false,
    duration: 1.1,
    durationY: 1.15,
    ease: EASE_CLICK,
    easeY: EASE_CLICK,
    shape: 'arrow',
  }))

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const sync = () => setFrame({ w: el.clientWidth, h: el.clientHeight })
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const cursorX = (4.76 / 100) * frame.w + (cursor.x / 228) * 0.9048 * frame.w - 1
  const cursorY = (18.18 / 100) * frame.h + (cursor.y / 124) * 0.7045 * frame.h - 1
  const viaX =
    cursor.via == null
      ? null
      : (4.76 / 100) * frame.w + (cursor.via.x / 228) * 0.9048 * frame.w - 1
  const viaY =
    cursor.via == null
      ? null
      : (18.18 / 100) * frame.h + (cursor.via.y / 124) * 0.7045 * frame.h - 1
  const curved = viaX != null && viaY != null

  return (
    <div
      className={cn('pointer-events-auto w-[200px] max-w-full', className)}
      aria-hidden
      onMouseEnter={() => onHoverPause?.(true)}
      onMouseLeave={() => onHoverPause?.(false)}
    >
      <div ref={frameRef} className="relative">
        <svg
          viewBox="0 0 252 176"
          className="h-auto w-full drop-shadow-[0_10px_20px_oklch(28%_0.02_50/0.10)]"
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
          <AnimatePresence mode="wait" initial={false}>
            <ScenePlayView
              key={scene}
              scene={scene}
              navIndex={navIndex}
              nextNavIndex={nextNavIndex}
              navCount={navCount}
              paused={paused}
              reduced={prefersReducedMotion}
              onCursor={setCursor}
              onNavigate={onNavigate ?? (() => {})}
            />
          </AnimatePresence>
        </div>
        {prefersReducedMotion ? null : (
          <motion.div
            className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform [backface-visibility:hidden]"
            animate={{
              x: curved ? [null, viaX, cursorX] : cursorX,
              y: curved ? [null, viaY, cursorY] : cursorY,
            }}
            transition={{
              x: {
                duration: cursor.duration,
                ease: curved ? [cursor.ease, cursor.easeY] : cursor.ease,
                times: curved ? [0, cursor.viaT ?? 0.48, 1] : undefined,
              },
              y: {
                duration: cursor.durationY,
                ease: curved ? [cursor.easeY, cursor.ease] : cursor.easeY,
                times: curved ? [0, cursor.viaTY ?? 0.56, 1] : undefined,
              },
            }}
            transformTemplate={(_, generated) => `${generated} translateZ(0)`}
          >
            <ClipCursor clicking={cursor.clicking} shape={cursor.shape} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
