'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const FADE_DURATION = 1.15
const HOLD_MS = 4500
const SLIDE_OFFSET = 28
/** 3 lines of text-base / leading-snug — keeps cards from resizing on rotate */
const RESERVED_LINES_MOBILE =
  'max-lg:min-h-[calc(1rem*1.375*3)] max-lg:h-[calc(1rem*1.375*3)]'

type PlanFeatureRotatorProps = {
  messages: string[]
  ariaLabel: string
  /** Stagger when cycling begins so cards on the page don’t stay in sync */
  startDelay?: number
  className?: string
}

export function PlanFeatureRotator({
  messages,
  ariaLabel,
  startDelay = 0,
  className,
}: PlanFeatureRotatorProps) {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion || messages.length <= 1) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const scheduleAdvance = (isFirst: boolean) => {
      const wait = isFirst
        ? startDelay + FADE_DURATION * 1000 + HOLD_MS
        : 2 * FADE_DURATION * 1000 + HOLD_MS

      timer = setTimeout(() => {
        if (cancelled) return
        setIndex((current) => (current + 1) % messages.length)
        scheduleAdvance(false)
      }, wait)
    }

    scheduleAdvance(true)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [messages.length, prefersReducedMotion, startDelay])

  if (messages.length === 0) return null

  if (prefersReducedMotion || messages.length === 1) {
    return (
      <div
        className={cn('min-w-0 w-full', RESERVED_LINES_MOBILE, className)}
        aria-label={ariaLabel}
      >
        <p className="text-base text-gray-600 leading-snug max-lg:line-clamp-3">
          {messages[0]}
        </p>
      </div>
    )
  }

  const message = messages[index]

  return (
    <div
      className={cn(
        'relative min-w-0 w-full overflow-x-hidden max-lg:overflow-hidden',
        RESERVED_LINES_MOBILE,
        className
      )}
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={`${index}-${message}`}
          initial={{ opacity: 0, x: -SLIDE_OFFSET }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: SLIDE_OFFSET }}
          transition={{
            duration: FADE_DURATION,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-base text-gray-600 leading-snug max-lg:absolute max-lg:inset-x-0 max-lg:top-0 max-lg:line-clamp-3"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
