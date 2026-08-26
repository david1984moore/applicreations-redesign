'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'framer-motion'

/**
 * Full-viewport Introspect wash — muted sky/lavender regions that wander
 * and reshape so slowly the motion is almost subliminal.
 *
 * Motion model: constant-speed random wander (tiny acceleration, hard speed
 * cap). No easing, no loops, no catch-up after a backgrounded tab.
 */
type Blob = {
  x: number
  y: number
  rx: number
  ry: number
  hue: number
  chroma: number
  light: number
  alpha: number
  vx: number
  vy: number
  vrx: number
  vry: number
  vhue: number
  vchroma: number
  valpha: number
}

const PAPER = 'oklch(99.2% 0.006 85)'

const POS_MAX = 0.0028
const SIZE_MAX = 0.0018
const HUE_MAX = 0.055
const CHROMA_MAX = 0.000012
const ALPHA_MAX = 0.00035
const POS_ACCEL = 0.00045
const SIZE_ACCEL = 0.00028
const HUE_ACCEL = 0.012
const CHROMA_ACCEL = 0.0000024
const ALPHA_ACCEL = 0.00007
const DT_CAP = 1 / 24

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function wander(
  value: number,
  vel: number,
  min: number,
  max: number,
  maxSpeed: number,
  accel: number,
  dt: number
): [number, number] {
  let nextVel = vel + (Math.random() * 2 - 1) * accel * dt
  nextVel = clamp(nextVel, -maxSpeed, maxSpeed)
  let next = value + nextVel * dt
  if (next < min) {
    next = min
    nextVel = Math.abs(nextVel)
  } else if (next > max) {
    next = max
    nextVel = -Math.abs(nextVel)
  }
  return [next, nextVel]
}

function seedBlobs(): Blob[] {
  const seeds: Array<Partial<Blob> & Pick<Blob, 'x' | 'y' | 'rx' | 'ry' | 'hue'>> = [
    { x: 0.08, y: 0.02, rx: 0.52, ry: 0.42, hue: 228, chroma: 0.03, light: 93, alpha: 0.4 },
    { x: 0.92, y: 0.12, rx: 0.44, ry: 0.36, hue: 292, chroma: 0.024, light: 94, alpha: 0.32 },
    { x: 0.38, y: 0.58, rx: 0.4, ry: 0.34, hue: 248, chroma: 0.022, light: 94, alpha: 0.22 },
    { x: 0.78, y: 0.72, rx: 0.36, ry: 0.3, hue: 274, chroma: 0.026, light: 93, alpha: 0.26 },
    { x: 0.18, y: 0.88, rx: 0.42, ry: 0.32, hue: 236, chroma: 0.02, light: 95, alpha: 0.2 },
  ]

  return seeds.map((s) => ({
    chroma: 0.024,
    light: 93.5,
    alpha: 0.28,
    vx: rand(-POS_MAX, POS_MAX) * 0.4,
    vy: rand(-POS_MAX, POS_MAX) * 0.4,
    vrx: rand(-SIZE_MAX, SIZE_MAX) * 0.35,
    vry: rand(-SIZE_MAX, SIZE_MAX) * 0.35,
    vhue: rand(-HUE_MAX, HUE_MAX) * 0.35,
    vchroma: rand(-CHROMA_MAX, CHROMA_MAX) * 0.35,
    valpha: rand(-ALPHA_MAX, ALPHA_MAX) * 0.35,
    ...s,
  }))
}

function stepBlob(blob: Blob, dt: number) {
  ;[blob.x, blob.vx] = wander(blob.x, blob.vx, -0.12, 1.12, POS_MAX, POS_ACCEL, dt)
  ;[blob.y, blob.vy] = wander(blob.y, blob.vy, -0.18, 1.12, POS_MAX, POS_ACCEL, dt)
  ;[blob.rx, blob.vrx] = wander(blob.rx, blob.vrx, 0.28, 0.72, SIZE_MAX, SIZE_ACCEL, dt)
  ;[blob.ry, blob.vry] = wander(blob.ry, blob.vry, 0.22, 0.62, SIZE_MAX, SIZE_ACCEL, dt)
  ;[blob.hue, blob.vhue] = wander(blob.hue, blob.vhue, 222, 308, HUE_MAX, HUE_ACCEL, dt)
  ;[blob.chroma, blob.vchroma] = wander(
    blob.chroma,
    blob.vchroma,
    0.016,
    0.038,
    CHROMA_MAX,
    CHROMA_ACCEL,
    dt
  )
  ;[blob.alpha, blob.valpha] = wander(
    blob.alpha,
    blob.valpha,
    0.14,
    0.44,
    ALPHA_MAX,
    ALPHA_ACCEL,
    dt
  )
}

function paint(ctx: CanvasRenderingContext2D, blobs: Blob[], w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
  const span = Math.max(w, h)

  for (const blob of blobs) {
    const cx = blob.x * w
    const cy = blob.y * h
    const rx = blob.rx * span
    const ry = blob.ry * span
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(rx, ry)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    const core = `oklch(${blob.light}% ${blob.chroma} ${blob.hue} / ${blob.alpha})`
    const mid = `oklch(${blob.light}% ${blob.chroma} ${blob.hue} / ${blob.alpha * 0.45})`
    gradient.addColorStop(0, core)
    gradient.addColorStop(0.28, mid)
    gradient.addColorStop(0.55, `oklch(${blob.light}% ${blob.chroma} ${blob.hue} / 0)`)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function IntrospectMorphWash() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef = useRef<Blob[] | null>(null)
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    if (!blobsRef.current) blobsRef.current = seedBlobs()
    const blobs = blobsRef.current

    let frame = 0
    let last = performance.now()
    let width = 0
    let height = 0

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      const scale = 0.55
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.max(1, Math.round(width * dpr * scale))
      canvas.height = Math.max(1, Math.round(height * dpr * scale))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0)
      paint(ctx, blobs, width, height)
    }

    fit()

    if (prefersReducedMotion) {
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    }

    const tick = (now: number) => {
      const hidden = document.hidden
      const raw = (now - last) / 1000
      last = now
      if (!hidden && width > 0) {
        const dt = Math.min(Math.max(raw, 0), DT_CAP)
        for (const blob of blobs) stepBlob(blob, dt)
        paint(ctx, blobs, width, height)
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    window.addEventListener('resize', fit)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', fit)
    }
  }, [mounted, prefersReducedMotion])

  if (!mounted) return null

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
      data-complex-animation
    >
      <div className="absolute inset-0" style={{ background: PAPER }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'blur(32px)' }}
      />
      <div className="coastal-grain absolute inset-0 opacity-60" />
    </div>,
    document.body
  )
}
