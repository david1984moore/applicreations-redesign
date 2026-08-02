'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'

export function IntrospectTeaser() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="introspect"
      className="relative py-20 md:py-24 coastal-wash coastal-grain"
      ref={ref}
    >
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium tracking-wide uppercase text-primary-600 mb-3">
            Introspect
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
            Tell us about your business
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto">
            A short questionnaire about your business — who you are, what you do, and how
            you&apos;d like your site to feel. We use your answers to build a preview.
          </p>
          <Button href="/introspect" variant="primary" size="lg">
            Begin Introspect
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
