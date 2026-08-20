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
}

/**
 * CTA — matches Begin Introspect / Get Free Preview.
 * Mobile (< lg): solid coastal blue, no mark.
 * Desktop (lg+): white button with a sky-blue origin dot.
 * Hover/focus: fill blooms from the dot; the dot becomes an enlarged check.
 * Slot stays 8px so hover does not reserve extra white width at the end.
 */
export function SpectrumFlipCta({
  children,
  href,
  onClick,
  disabled = false,
  className,
  size = 'md',
  type = 'button',
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

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-4">
        <span
          className="relative z-0 hidden h-2 w-2 shrink-0 overflow-visible lg:block"
          aria-hidden
        >
          {/* Fill scales from this slot’s center so it tracks padding and stays edge-to-edge. */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2">
            <span
              className={cn(
                'absolute inset-0 origin-center rounded-full bg-[oklch(68%_0.15_230)] scale-0 transition-transform',
                'group-hover:scale-[70] group-focus-visible:scale-[70]',
                morphEase
              )}
            />
          </span>

          {/* Rest-state core — fades as the check takes over. */}
          <span
            className={cn(
              'absolute inset-0 z-[1] rounded-full bg-[oklch(68%_0.15_230)] transition-opacity',
              'group-hover:opacity-0 group-focus-visible:opacity-0',
              morphEase
            )}
          />

          <BoldCheck
            className={cn(
              'pointer-events-none absolute left-1/2 top-1/2 z-[2] hidden -translate-x-1/2 -translate-y-1/2 text-white',
              'group-hover:block group-focus-visible:block',
              size === 'sm' ? 'h-[2rem] w-[2rem]' : 'h-[2.5rem] w-[2.5rem]'
            )}
          />
        </span>
        <span className="relative z-10 whitespace-nowrap lg:transition-colors lg:duration-300 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:text-white lg:group-focus-visible:text-white motion-reduce:lg:transition-none">
          {children}
        </span>
      </span>
    </>
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
