'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

/**
 * APPROVED BRAND LOCKUP — do not adjust without explicit approval.
 *
 * Butterfly sits centered horizontally above the "l" and "i" in "Applicreations".
 * Bottom edge is clearly separated from the letter tops (no overlap/obstruction).
 *
 * Locked 18 Aug 2026 from the approved screenshot. These class strings are the
 * single source of truth — do not restyle the mark inline elsewhere.
 */
export const BRAND_LOCKUP = {
  /** Wordmark type. */
  nameClass:
    'font-display text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl text-gray-900 leading-[1.05] tracking-tight',
  /** Clearance above the letters so the lifted mark does not clip. */
  headingClearanceClass: 'pt-7 sm:pt-8 lg:pt-9',
  /**
   * Anchor: `relative` on "li" + `inset-x-0` + `justify-center` centers the mark
   * on those two letters. Lift: `-translate-y-[80%]` of mark height.
   */
  markAnchorClass:
    'pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center overflow-visible -translate-y-[80%]',
  /** Mark box: 2.75rem / 3rem / 3.5rem. Intrinsic asset 56×56. */
  markSizeClass:
    'block h-11 w-11 shrink-0 origin-center sm:h-12 sm:w-12 lg:h-14 lg:w-14',
  markImageClass: '!h-full !w-full object-contain',
  markSrc: '/logo-mark.png',
  markPx: 56,
} as const

type BrandLockupProps = {
  name: string
  /** Skip entrance animation (locale swap / reduced motion). */
  skipIntro?: boolean
  priority?: boolean
}

export function BrandLockup({
  name,
  skipIntro = false,
  priority = true,
}: BrandLockupProps) {
  return (
    <h1
      className={`${BRAND_LOCKUP.nameClass} ${BRAND_LOCKUP.headingClearanceClass}`}
      aria-label={name}
    >
      {/*
        Tight "App"+"li"+"creations" concatenation is required — extra JSX
        whitespace would split the word. Mark is a child of "li", not a sibling
        of the whole name.
      */}
      <span aria-hidden="true">
        App<span className="relative inline-block">li<span className={BRAND_LOCKUP.markAnchorClass}>
            <motion.span
              initial={skipIntro ? false : { opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={BRAND_LOCKUP.markSizeClass}
            >
              <Image
                src={BRAND_LOCKUP.markSrc}
                alt=""
                width={BRAND_LOCKUP.markPx}
                height={BRAND_LOCKUP.markPx}
                priority={priority}
                className={BRAND_LOCKUP.markImageClass}
              />
            </motion.span>
          </span></span>creations
      </span>
    </h1>
  )
}
