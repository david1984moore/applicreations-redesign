'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const HOW_IT_WORKS = {
  headline: "How It Works",
  steps: [
    {
      number: "01",
      title: "Get Your Quote",
      description: "Select the features you need and get instant pricing and project specifications.",
      duration: "5 minutes"
    },
    {
      number: "02", 
      title: "We Build Your Site",
      description: "Professional design, compelling copy, and technical optimization. You review and approve.",
      duration: "2-3 weeks"
    },
    {
      number: "03",
      title: "Launch & Grow", 
      description: "We handle hosting, security, and updates. You focus on getting customers.",
      duration: "Ongoing"
    },
  ]
}

export function HowItWorks() {
  const [isTimelineVisible, setIsTimelineVisible] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timelineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsTimelineVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    if (timelineRef.current) {
      timelineObserver.observe(timelineRef.current)
    }

    return () => {
      timelineObserver.disconnect()
    }
  }, [])

  return (
    <section
      className="py-12 md:py-16 px-4 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="how-it-works-heading"
    >
      <div ref={timelineRef} className="max-w-[900px] mx-auto">
        <h2 
          id="how-it-works-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-gray-100"
        >
          {HOW_IT_WORKS.headline}
        </h2>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block relative">
          {/* Connection Line */}
          <div className="absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-linear-to-r from-gray-200 via-amber-200/60 to-gray-200 dark:from-gray-700 dark:via-amber-800/40 dark:to-gray-700" aria-hidden="true" />

          <div className="grid grid-cols-3 gap-6">
            {HOW_IT_WORKS.steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isTimelineVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative"
              >
                {/* Step Number Circle */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 flex items-center justify-center text-[28px] font-bold mb-1.5 relative z-10 shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
                    {step.number}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {step.duration}
                  </span>
                </div>

                {/* Step Content */}
                <div className="text-center">
                  <h3 className="text-[17px] font-semibold mb-1.5 text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-[1.6]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-6">
          {HOW_IT_WORKS.steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={isTimelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex gap-3"
            >
              {/* Step Number */}
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 flex items-center justify-center text-[20px] font-bold shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[17px] font-semibold text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    ({step.duration})
                  </span>
                </div>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-[1.6]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


