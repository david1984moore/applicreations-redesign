'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

function BoldCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3.2 12.8 9.7 20.4 20.8 3.8"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type SpectrumFlipCtaProps = {
  children: ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  disabled?: boolean
  className?: string
  /** Compact for side rails / cards */
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
  /** Desktop hover/focus: origin morphs into a check. Off = origin stays a dot. */
  checkOnHover?: boolean
}

/**
 * LOCKED Aug 25 2026 (final) — Get Started / Start Re-design.
 * User: likes exactly how they act. Do not retune layout, origin, hover
 * check, nudge, bloom, or sizes. checkOnHover={false} is the only variant.
 *
 * Mobile (< lg): solid coastal blue, no mark.
 * Desktop (lg+): white button with a sky-blue origin dot.
 * Hover/focus: fill blooms from the dot; optional check replaces the dot.
 * Mark + label are one in-flow unit (fixed gap), centered in the pill.
 */
export function SpectrumFlipCta({
  children,
  href,
  onClick,
  disabled = false,
  className,
  size = 'md',
  type = 'button',
  checkOnHover = true,
}: SpectrumFlipCtaProps) {
  const bloomRef = useRef<HTMLSpanElement>(null)
  const restTimerRef = useRef<number>(0)

  const cancelBloomRest = useCallback(() => {
    window.clearTimeout(restTimerRef.current)
  }, [])

  const snapBloomRest = useCallback(() => {
    const bloom = bloomRef.current
    const host = bloom?.closest('a, button')
    if (!bloom || !host) return
    if (host.matches(':hover') || host.matches(':focus-visible')) return
    bloom.style.transition = 'none'
    bloom.style.scale = '0'
    bloom.style.transform = 'scale(0)'
    void bloom.offsetWidth
    bloom.style.transition = ''
    bloom.style.scale = ''
    bloom.style.transform = ''
  }, [])

  const scheduleBloomRest = useCallback(() => {
    cancelBloomRest()
    // Morph is 300ms. If a compositor layer is still mid-bloom after that,
    // snap to rest so a leftover slab cannot linger.
    restTimerRef.current = window.setTimeout(snapBloomRest, 320)
  }, [cancelBloomRest, snapBloomRest])

  useEffect(() => () => cancelBloomRest(), [cancelBloomRest])

  const classes = cn(
    'group relative isolate inline-flex items-center justify-center overflow-hidden rounded-2xl font-sans font-bold tracking-tight whitespace-nowrap cursor-pointer',
    'shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28),0_2px_8px_-2px_rgba(0,0,0,0.12)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
    'bg-[oklch(68%_0.15_230)] text-white ring-1 ring-[oklch(68%_0.15_230)/0.35] focus-visible:ring-[oklch(68%_0.15_230)/0.45]',
    'lg:bg-white lg:text-primary-800 lg:ring-primary-300/70 lg:focus-visible:ring-primary/40',
    size === 'sm' ? 'px-5 py-2.5 text-sm' : 'px-8 py-3 text-base',
    className
  )

  const morphEase =
    'duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

  // Same 12px / 16px cluster shift as translate-x-3 / translate-x-4.
  // `left` does not promote a compositor layer, so a w-full pill cannot
  // rest as a leftover white slab with a smeared origin.
  const checkNudge =
    checkOnHover &&
    (size === 'sm'
      ? 'lg:group-hover:left-3 lg:group-focus-visible:left-3'
      : 'lg:group-hover:left-4 lg:group-focus-visible:left-4')

  const content = (
    <span
      className={cn(
        'relative z-10 inline-flex items-center gap-2 left-0',
        checkOnHover && cn('lg:transition-[left]', morphEase, checkNudge)
      )}
    >
      <span
        className="pointer-events-none relative hidden h-2 w-2 shrink-0 overflow-visible lg:block"
        aria-hidden
      >
        {/* Fill blooms from the origin so it tracks the mark.
            Center with margin, not translate — a transform on this 8px
            wrapper rasterizes the scale-[70] fill into a leftover slab. */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-2 w-2 -ml-1 -mt-1">
          <span
            ref={bloomRef}
            className={cn(
              'absolute inset-0 origin-center rounded-full bg-[oklch(68%_0.15_230)] scale-0 transition-[transform,scale]',
              'group-hover:scale-[70] group-focus-visible:scale-[70]',
              morphEase
            )}
          />
        </span>

        {/* Rest-state core — fades when the check takes over; turns white if it stays. */}
        <span
          className={cn(
            'absolute left-1/2 top-1/2 z-[1] h-2 w-2 -ml-1 -mt-1 rounded-full bg-[oklch(68%_0.15_230)]',
            checkOnHover
              ? cn(
                  'transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0',
                  morphEase
                )
              : cn(
                  'transition-colors group-hover:bg-white group-focus-visible:bg-white',
                  morphEase
                )
          )}
        />

        {checkOnHover && (
          <BoldCheck
            className={cn(
              'pointer-events-none absolute right-0 top-1/2 z-[2] hidden text-white',
              'group-hover:block group-focus-visible:block',
              size === 'sm' ? 'h-8 w-8 -mt-4' : 'h-10 w-10 -mt-5'
            )}
          />
        )}
      </span>
      <span className="relative z-10 whitespace-nowrap lg:transition-colors lg:duration-300 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:text-white lg:group-focus-visible:text-white motion-reduce:lg:transition-none">
        {children}
      </span>
    </span>
  )

  const hoverSafety = {
    onPointerEnter: cancelBloomRest,
    onPointerLeave: scheduleBloomRest,
    onPointerCancel: scheduleBloomRest,
    onBlur: scheduleBloomRest,
  }

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...hoverSafety}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...hoverSafety}
    >
      {content}
    </button>
  )
}
