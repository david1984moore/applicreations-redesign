'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden">
      {/* Full-bleed coastal visual */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-coastal.svg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/55 to-paper/15 md:bg-gradient-to-r md:from-paper/90 md:via-paper/55 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="text-sm font-medium tracking-[0.14em] uppercase text-primary-700 mb-4">
            Custom apps and websites
          </p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-gray-900 leading-[1.05] tracking-tight mb-5">
            Applicreations
          </h1>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 max-w-md">
            Simple sites for local businesses — clear, friendly, and built around how you actually work.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button href="/introspect" variant="primary" size="lg">
              Introspect
            </Button>
            <Button href="#work" variant="outline" size="lg">
              See our work
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
