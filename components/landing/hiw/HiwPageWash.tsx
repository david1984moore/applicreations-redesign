'use client'

import { useId, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const
const FADE_MS = 1.15

type Edge = {
  /** Viewport % — just right of the wordmark, at the top of the page. */
  top: number
  /** Viewport % — gutter between pricing and the Get Free Preview button. */
  gutter: number
}

const DEFAULT_EDGE: Edge = { top: 51, gutter: 60 }
/** Air past the language toggle and pricing card. Same shift on top + gutter keeps the cubic. */
export const WASH_CLEAR_PX = 44

/** Pixel X of the wash cubic: `top` at the wordmark, `gutter` down the pricing / CTA gap. */
export function measureWashEdgePx(): { top: number; gutter: number } | null {
  const brand = document.querySelector('.landing-board h1')
  const nav = document.querySelector('.landing-board nav[aria-label="Primary"]')
  const pricing = document.getElementById('pricing')
  const hiw = document.getElementById('introspect')
  if (!brand || !pricing || !hiw) return null

  const brandBox = brand.getBoundingClientRect()
  const priceBox = pricing.getBoundingClientRect()
  const hiwBox = hiw.getBoundingClientRect()
  const navBox = nav?.getBoundingClientRect()

  const topRaw = brandBox.right + 14
  const aroundNav = navBox ? navBox.right + 10 : topRaw
  const betweenCards = (priceBox.right + hiwBox.left) / 2
  const gutterRaw = Math.max(aroundNav, betweenCards)
  const topBase = Math.min(topRaw, gutterRaw)
  const minTop = navBox ? navBox.right + WASH_CLEAR_PX : topBase
  const minGutter = priceBox.right + WASH_CLEAR_PX
  const shift = Math.max(0, minTop - topBase, minGutter - gutterRaw)
  return { top: topBase + shift, gutter: gutterRaw + shift }
}

type HiwPageWashProps = {
  visible: boolean
  instant: boolean
}

function fillPath({ top, gutter }: Edge) {
  // One cubic: start near Applicreations, ease right around the nav,
  // then run down the pricing / CTA gap. No middle bulge, no extra waves.
  return [
    `M ${fmt(top)} -1.2`,
    `C ${fmt(top)} 10 ${fmt(gutter)} 24 ${fmt(gutter)} 101.2`,
    `L 102 101.2 L 102 -1.2 Z`,
  ].join(' ')
}

function fmt(n: number) {
  return n.toFixed(2)
}

function pct(x: number) {
  return (x / window.innerWidth) * 100
}

/**
 * Full-viewport purple panel. Edge is the fill only — no stroke.
 * Hue 310 matches the logo / HIW violet.
 */
export function HiwPageWash({ visible, instant }: HiwPageWashProps) {
  const reactId = useId()
  const gradId = `hiw-wash-${reactId.replace(/:/g, '')}`
  const [edge, setEdge] = useState<Edge>(DEFAULT_EDGE)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)

    const measure = () => {
      const edgePx = measureWashEdgePx()
      if (!edgePx) return
      const top = pct(edgePx.top)
      const gutter = pct(edgePx.gutter)

      if (
        Number.isFinite(top) &&
        Number.isFinite(gutter) &&
        top > 20 &&
        gutter < 85
      ) {
        setEdge({ top, gutter })
      }
    }

    measure()
    const observer = new ResizeObserver(measure)
    const brand = document.querySelector('.landing-board h1')
    const nav = document.querySelector('.landing-board nav[aria-label="Primary"]')
    const pricing = document.getElementById('pricing')
    const hiw = document.getElementById('introspect')
    if (brand) observer.observe(brand)
    if (nav) observer.observe(nav)
    if (pricing) observer.observe(pricing)
    if (hiw) observer.observe(hiw)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      initial={instant ? false : { opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{
        duration: instant ? 0 : FADE_MS,
        ease: EASE,
      }}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1={fmt(edge.gutter)}
            y1="0"
            x2="100"
            y2="12"
          >
            <stop offset="0%" stopColor="oklch(77% 0.078 310)" />
            <stop offset="100%" stopColor="oklch(70% 0.10 310)" />
          </linearGradient>
        </defs>
        <path d={fillPath(edge)} fill={`url(#${gradId})`} />
      </svg>
    </motion.div>,
    document.body
  )
}
