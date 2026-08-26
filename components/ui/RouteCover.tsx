'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'framer-motion'
import { subscribeRouteCover } from '@/lib/route-cover'
import { cn } from '@/lib/utils'

const FADE_MS = 850

/** Paper cream — matches the landing / introspect page wash. */
const COVER_BG = 'bg-[oklch(98%_0.012_85)]'

export function RouteCover() {
  const reduce = useReducedMotion()
  const [covered, setCovered] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    return subscribeRouteCover((next) => {
      setCovered(next)
      if (next) setRendered(true)
    })
  }, [])

  useEffect(() => {
    if (covered || !rendered) return
    const ms = reduce ? 0 : FADE_MS
    const id = window.setTimeout(() => setRendered(false), ms)
    return () => window.clearTimeout(id)
  }, [covered, rendered, reduce])

  if (!ready || !rendered) return null

  return createPortal(
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-[100]',
        COVER_BG,
        covered ? 'opacity-100' : 'opacity-0',
        reduce
          ? 'duration-0'
          : 'transition-opacity duration-[850ms] ease-[cubic-bezier(0.33,0,0.2,1)]',
        covered ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    />,
    document.body
  )
}

export const ROUTE_COVER_FADE_MS = FADE_MS
