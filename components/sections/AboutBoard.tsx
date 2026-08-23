'use client'

import Image from 'next/image'
import { useLocale } from '@/components/i18n/LocaleProvider'

export function AboutBoard() {
  const { dict } = useLocale()

  return (
    <section className="about-board relative overflow-x-clip bg-paper lg:min-h-[calc(100svh-var(--spacing-12)-1.75rem)] flex items-start">
      <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-6 lg:pb-3">
        <div className="relative rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-primary-600 text-center mb-2">
            {dict.about.eyebrow}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
            <div className="shrink-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-2 ring-gray-200/80 ring-offset-2 ring-offset-white/80">
                <Image
                  src="/images/david-moore-headshot.png"
                  alt={dict.about.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2 text-[0.9375rem] sm:text-[0.9rem] text-gray-700 leading-relaxed sm:leading-snug">
              <div>
                <h1 className="font-display text-lg sm:text-xl text-gray-900 mb-0.5">
                  {dict.about.name}
                </h1>
                <p className="text-sm font-medium text-primary-600 tracking-wide">
                  {dict.about.role}
                </p>
              </div>

              <p>{dict.about.p1}</p>
              <p>{dict.about.p2}</p>
              <p>{dict.about.p3}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
