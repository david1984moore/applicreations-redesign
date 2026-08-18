'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

const EASE = [0.4, 0, 0.2, 1] as const

type HiwStepCopyProps = {
  n: string
  label: string
  detail: string
  Icon: LucideIcon
  revealDetail?: boolean
  suffix?: string
  tail?: string
}

export function HiwStepCopy({
  n,
  label,
  detail,
  Icon,
  revealDetail = true,
  suffix,
  tail,
}: HiwStepCopyProps) {
  return (
    <div className="flex max-w-[18.5rem] gap-3 text-left antialiased [backface-visibility:hidden] lg:max-w-[20rem] lg:gap-3.5">
      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[oklch(78%_0.08_310/0.45)] bg-[oklch(58%_0.14_310)] text-white lg:h-12 lg:w-12">
        <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.6} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="flex items-baseline gap-2 text-lg font-semibold leading-tight text-gray-900 lg:text-xl">
          <span className="font-display origin-center inline-block text-3xl font-semibold leading-none tabular-nums text-[oklch(58%_0.14_310)] [transform:translateZ(0)] lg:text-4xl">
            {n}
          </span>
          {label}
        </p>
        <div className={revealDetail ? 'relative mt-1.5 min-h-[3.6rem] lg:mt-2 lg:min-h-[4.1rem]' : 'relative mt-1.5'}>
          <AnimatePresence mode="wait">
            {revealDetail ? (
              <motion.p
                key={detail}
                className="text-base leading-snug text-gray-800 lg:text-[1.0625rem]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.76, ease: EASE }}
              >
                {detail}
                <AnimatePresence>
                  {suffix ? (
                    <motion.span
                      key={suffix}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.15, ease: EASE }}
                    >
                      {` ${suffix}`}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
                <AnimatePresence>
                  {tail ? (
                    <motion.span
                      key={tail}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.15, ease: EASE }}
                    >
                      {` ${tail}`}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
