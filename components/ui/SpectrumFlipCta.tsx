'use client'

import Link from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'
import { cn } from '@/lib/utils'

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
 * Spectrum-flip CTA — matches Begin Introspect / Get Started.
 * Mobile (< lg): solid soft turquoise, no dot animation.
 * Desktop (lg+): white button with purple spectrum-flip from the dot (unchanged).
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
    'group relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-sans font-bold tracking-tight cursor-pointer',
    'shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28),0_2px_8px_-2px_rgba(0,0,0,0.12)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
    // Mobile: soft turquoise; desktop: white + purple spectrum flip (unchanged)
    'bg-[oklch(50%_0.09_198)] text-white ring-1 ring-[oklch(50%_0.09_198)/0.35] focus-visible:ring-[oklch(50%_0.09_198)/0.45]',
    'lg:bg-white lg:text-primary-800 lg:ring-primary-300/70 lg:focus-visible:ring-primary/40',
    size === 'sm' ? 'px-5 py-2.5 text-sm' : 'px-8 py-3 text-base',
    className
  )

  const content = (
    <span className="relative inline-flex items-center gap-3">
      <span className="relative z-0 hidden h-2 w-2 shrink-0 lg:block" aria-hidden>
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(58%_0.14_310)] shadow-[0_0_0_0_oklch(58%_0.14_310)] transition-[box-shadow] duration-200 ease-in-out group-hover:shadow-[0_0_0_220px_oklch(58%_0.14_310)] group-focus-visible:shadow-[0_0_0_220px_oklch(58%_0.14_310)]" />
        <span className="relative z-20 block h-2 w-2 rounded-full bg-[oklch(58%_0.14_310)] transition-colors duration-200 ease-in-out group-hover:bg-white group-focus-visible:bg-white" />
      </span>
      <span className="relative z-10 lg:transition-colors lg:duration-200 lg:ease-in-out lg:group-hover:text-white lg:group-focus-visible:text-white">
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
