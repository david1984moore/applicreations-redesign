'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { C } from '@/components/pricing/ExampleScreenRotator'

const FIELDS = [
  { label: 'Your name', value: 'Maya Chen' },
  { label: 'Business', value: 'Cedar Co.' },
  { label: 'What you do', value: 'Tea, cake, a quiet table' },
  { label: 'Email', value: 'hello@cedar.co' },
] as const

const TEXT_X = 22
const CARET_GAP = 0.9
const CHAR_MS = 40
const FIELD_PAUSE = 150
const FIELD_START = 90
const CARET_BLINK = {
  duration: 1.06,
  repeat: Infinity,
  ease: 'linear' as const,
  times: [0, 0.49, 0.5, 1],
}

type HiwFormSketchProps = {
  playing: boolean
  duration: number
}

/** Time from first keystroke until the last character of the last field. */
export function hiwFormGlowAtMs() {
  let ms = 0
  for (let i = 0; i < FIELDS.length; i++) {
    ms += FIELD_START + FIELDS[i]!.value.length * CHAR_MS
    if (i < FIELDS.length - 1) ms += FIELD_PAUSE
  }
  return ms
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function TypedField({
  label,
  value,
  shown,
  active,
  y,
}: {
  label: string
  value: string
  shown: string
  active: boolean
  y: number
}) {
  const textRef = useRef<SVGTextElement>(null)
  const [caretX, setCaretX] = useState(TEXT_X)
  const started = shown.length > 0 || active
  const typing = active && shown.length < value.length

  useLayoutEffect(() => {
    const width = textRef.current?.getComputedTextLength() ?? 0
    setCaretX(TEXT_X + width + (shown.length > 0 ? CARET_GAP : 0))
  }, [shown])

  return (
    <g>
      <text
        x="16"
        y={y}
        fill={C.muted}
        fontSize="6.5"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={500}
        letterSpacing="0.3"
      >
        {label}
      </text>
      <rect
        x="16"
        y={y + 4}
        width="168"
        height="16"
        rx="5"
        fill={C.cream}
        stroke={active ? C.primary : C.line}
      />
      <motion.rect
        x="16"
        y={y + 4}
        width="168"
        height="16"
        rx="5"
        fill={C.skySoft}
        initial={false}
        animate={{ opacity: started ? 0.28 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <text
        ref={textRef}
        x={TEXT_X}
        y={y + 15}
        fill={C.ink}
        fontSize="8"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={600}
      >
        {shown}
      </text>
      {active ? (
        <motion.g
          initial={false}
          animate={{ opacity: typing ? 1 : [1, 1, 0, 0] }}
          transition={typing ? { duration: 0 } : CARET_BLINK}
        >
          <rect
            x={caretX}
            y={y + 6.4}
            width="1.2"
            height="10.4"
            rx="0.35"
            fill={C.ink}
          />
        </motion.g>
      ) : null}
    </g>
  )
}

export function HiwFormSketch({ playing }: HiwFormSketchProps) {
  const [typed, setTyped] = useState(() => FIELDS.map(() => 0))
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (!playing) {
      setTyped(FIELDS.map(() => 0))
      setActive(-1)
      return
    }

    let cancelled = false
    const lengths = FIELDS.map(() => 0)
    const charMs = CHAR_MS

    const run = async () => {
      for (let i = 0; i < FIELDS.length; i++) {
        if (cancelled) return
        setActive(i)
        await wait(FIELD_START)
        if (cancelled) return
        const value = FIELDS[i]!.value
        for (let c = 1; c <= value.length; c++) {
          await wait(charMs)
          if (cancelled) return
          lengths[i] = c
          setTyped([...lengths])
        }
        await wait(FIELD_PAUSE)
        if (cancelled) return
      }
      setActive(-1)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [playing])

  return (
    <div
      className="origin-center"
      style={{
        transform: 'perspective(900px) rotateY(-8deg) rotateX(4deg)',
        transformStyle: 'preserve-3d',
      }}
    >
    <svg
      viewBox="0 0 200 176"
      className="h-auto w-[18rem] max-w-full drop-shadow-[0_12px_22px_oklch(20%_0.03_260/0.2)] sm:w-[22rem] lg:w-[26rem]"
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
      {FIELDS.map((field, i) => (
        <TypedField
          key={field.label}
          label={field.label}
          value={field.value}
          shown={field.value.slice(0, typed[i] ?? 0)}
          active={active === i}
          y={46 + i * 30}
        />
      ))}
    </svg>
    </div>
  )
}
