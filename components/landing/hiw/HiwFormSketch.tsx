'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { C } from '@/components/pricing/ExampleScreenRotator'

const FIELDS = [
  { label: 'Your name', value: 'Maya Chen' },
  { label: 'Business', value: 'Cedar Co.' },
  { label: 'What you do', value: 'Tea, cake, a quiet table' },
  { label: 'Email', value: 'hello@cedar.co' },
] as const

type HiwFormSketchProps = {
  playing: boolean
  duration: number
}

export function HiwFormSketch({ playing, duration }: HiwFormSketchProps) {
  const [filled, setFilled] = useState(0)

  useEffect(() => {
    if (!playing) {
      setFilled(0)
      return
    }
    const step = Math.max(280, duration / (FIELDS.length + 0.6))
    const timers = FIELDS.map((_, i) => window.setTimeout(() => setFilled(i + 1), step * (i + 0.15)))
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playing, duration])

  return (
    <svg
      viewBox="0 0 200 176"
      className="h-auto w-[11.5rem] drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)] sm:w-[13rem] lg:w-[14.5rem]"
      aria-hidden
    >
      <rect x="4" y="4" width="192" height="168" rx="14" fill={C.paper} stroke={C.line} />
      <rect x="4" y="4" width="192" height="28" rx="14" fill={C.sand} />
      <rect x="4" y="18" width="192" height="14" fill={C.sand} />
      <text
        x="100"
        y="22"
        textAnchor="middle"
        fill={C.primary}
        fontSize="7.5"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={700}
        letterSpacing="0.8"
      >
        INTROSPECT
      </text>
      {FIELDS.map((field, i) => {
        const y = 46 + i * 30
        const on = filled > i
        return (
          <g key={field.label}>
            <text
              x="16"
              y={y}
              fill={C.muted}
              fontSize="6.5"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight={500}
              letterSpacing="0.3"
            >
              {field.label}
            </text>
            <rect
              x="16"
              y={y + 4}
              width="168"
              height="16"
              rx="5"
              fill={C.cream}
              stroke={C.line}
            />
            <motion.rect
              x="16"
              y={y + 4}
              width="168"
              height="16"
              rx="5"
              fill={C.skySoft}
              initial={false}
              animate={{ opacity: on ? 0.35 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.text
              x="22"
              y={y + 15}
              fill={C.ink}
              fontSize="8"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight={600}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {field.value}
            </motion.text>
          </g>
        )
      })}
    </svg>
  )
}
