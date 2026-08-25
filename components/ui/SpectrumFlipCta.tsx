'use client'

import Link from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'
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
  const classes = cn(
    'group relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-sans font-bold tracking-tight whitespace-nowrap cursor-pointer',
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

  // Slot stays the origin-dot size so the pill hugs the label. The check
  // overlays (overflows left) and the cluster nudges right so the unit
  // stays centered without stretching the button.
  const checkNudge =
    checkOnHover &&
    (size === 'sm'
      ? 'lg:group-hover:translate-x-3 lg:group-focus-visible:translate-x-3'
      : 'lg:group-hover:translate-x-4 lg:group-focus-visible:translate-x-4')

  const content = (
    <span
      className={cn(
        'relative z-10 inline-flex items-center gap-2',
        checkOnHover &&
          cn(
            'lg:transition-transform',
            morphEase,
            checkNudge
          )
      )}
    >
      <span
        className="pointer-events-none relative hidden h-2 w-2 shrink-0 overflow-visible lg:block"
        aria-hidden
      >
        {/* Fill blooms from the origin so it tracks the mark. */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2">
          <span
            className={cn(
              'absolute inset-0 origin-center rounded-full bg-[oklch(68%_0.15_230)] scale-0 transition-transform',
              'group-hover:scale-[70] group-focus-visible:scale-[70]',
              morphEase
            )}
          />
        </span>

        {/* Rest-state core — fades when the check takes over; turns white if it stays. */}
        <span
          className={cn(
            'absolute left-1/2 top-1/2 z-[1] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(68%_0.15_230)]',
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
              'pointer-events-none absolute right-0 top-1/2 z-[2] hidden -translate-y-1/2 text-white',
              'group-hover:block group-focus-visible:block',
              size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
            )}
          />
        )}
      </span>
      <span className="relative z-10 whitespace-nowrap lg:transition-colors lg:duration-300 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:text-white lg:group-focus-visible:text-white motion-reduce:lg:transition-none">
        {children}
      </span>
    </span>
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}
