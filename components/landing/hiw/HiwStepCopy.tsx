'use client'

import type { LucideIcon } from 'lucide-react'

type HiwStepCopyProps = {
  n: string
  label: string
  detail: string
  Icon: LucideIcon
}

export function HiwStepCopy({ n, label, detail, Icon }: HiwStepCopyProps) {
  return (
    <div className="flex max-w-[16.5rem] gap-2.5 text-left lg:max-w-[18rem] lg:gap-3">
      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[oklch(78%_0.08_310/0.45)] bg-[oklch(58%_0.14_310)] text-white lg:h-11 lg:w-11">
        <Icon className="h-5 w-5 lg:h-[1.35rem] lg:w-[1.35rem]" strokeWidth={1.6} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="flex items-baseline gap-1.5 text-base font-semibold leading-tight text-gray-900 lg:text-lg">
          <span className="font-display text-2xl font-semibold leading-none tabular-nums text-[oklch(58%_0.14_310)] lg:text-3xl">
            {n}
          </span>
          {label}
        </p>
        <p className="mt-1 text-[0.9375rem] leading-snug text-gray-700 lg:mt-1.5 lg:text-base">
          {detail}
        </p>
      </div>
    </div>
  )
}
