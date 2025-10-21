'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SECTION_INTRO = {
  eyebrow: "The Solution",
  headline: "A Website That Works as Hard as You Do",
  subheadline: "We build fast, search-optimized websites that turn visitors into customers.",
}

const SOLUTIONS = [
  {
    icon: "rocket",
    title: "Show Up in Local Searches",
    description: "SEO-optimized from day one. We structure your site so Google understands your services and location. You appear when customers search.",
    benefit: "Get found by ready-to-buy customers",
    features: [
      "Local SEO optimization",
      "Google Business integration",
      "Mobile-first design (most searches happen on phones)"
    ]
  },
  {
    icon: "diamond",
    title: "Look Professional, Be Credible",
    description: "Custom design that reflects your brand. Professional photography placement. Customer testimonials. Every element builds trust.",
    benefit: "Win customers before they call",
    features: [
      "Modern, clean design",
      "Fast loading (under 2 seconds)",
      "Professional copy that converts"
    ]
  },
  {
    icon: "growth",
    title: "Own Your Customer Relationships",
    description: "Built-in contact forms. Email capture. Analytics that show what's working. You own your data, your leads, your growth.",
    benefit: "Build a business, not just a following",
    features: [
      "Lead capture forms",
      "Email marketing integration",
      "Analytics dashboard"
    ]
  },
]

const HOW_IT_WORKS = {
  headline: "How It Works",
  steps: [
    {
      number: "01",
      title: "Quick Consultation",
      description: "15-minute call to understand your business, goals, and customers.",
      duration: "15 minutes"
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

// Icon components (inline SVG)
const ICONS = {
  rocket: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  diamond: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>
    </svg>
  ),
  growth: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
      <path d="m14 9 5 0 0 5"/>
    </svg>
  ),
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Solutions() {
  const [isVisible, setIsVisible] = useState(false)
  const [isTimelineVisible, setIsTimelineVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

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

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current)
    }

    if (timelineRef.current) {
      timelineObserver.observe(timelineRef.current)
    }

    return () => {
      sectionObserver.disconnect()
      timelineObserver.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-linear-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="solutions-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Intro */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[12px] uppercase tracking-[0.05em] text-blue-sky mb-3 font-semibold">
            {SECTION_INTRO.eyebrow}
          </p>
          <h2
            id="solutions-heading"
            className="text-[28px] md:text-[38px] font-bold mb-4 leading-tight"
          >
            {SECTION_INTRO.headline}
          </h2>
          <p className="text-[18px] max-w-[600px] mx-auto text-gray-600 dark:text-gray-300">
            {SECTION_INTRO.subheadline}
          </p>
        </div>

        {/* Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {SOLUTIONS.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 h-full flex flex-col">
                {/* Icon */}
                <div
                  className="mb-4 text-blue-sky"
                  aria-hidden="true"
                >
                  {ICONS[solution.icon as keyof typeof ICONS]}
                </div>

                {/* Title */}
                <h3 className="text-[21px] font-semibold mb-3 leading-tight">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.6] text-gray-600 dark:text-gray-300 mb-4">
                  {solution.description}
                </p>

                {/* Benefit Callout */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-sky px-4 py-3 mb-4 rounded-r">
                  <p className="text-[14px] font-semibold text-blue-deep dark:text-blue-sky">
                    {solution.benefit}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-2 mt-auto">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 shrink-0 mt-0.5">
                        <CheckIcon />
                      </span>
                      <span className="text-[14px] text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </motion.div>
          ))}
        </div>

        {/* How It Works Timeline */}
        <div ref={timelineRef} className="max-w-[900px] mx-auto">
          <h3 className="text-[28px] md:text-[32px] font-bold text-center mb-12">
            {HOW_IT_WORKS.headline}
          </h3>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block relative">
            {/* Connection Line */}
            <div className="absolute top-[48px] left-[10%] right-[10%] h-0.5 bg-blue-200 dark:bg-blue-800" aria-hidden="true" />

            <div className="grid grid-cols-3 gap-8">
              {HOW_IT_WORKS.steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isTimelineVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="relative"
                >
                  {/* Step Number Circle */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-blue-sky text-white flex items-center justify-center text-[32px] font-bold mb-2 relative z-10">
                      {step.number}
                    </div>
                    <span className="text-[12px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {step.duration}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="text-center">
                    <h4 className="text-[18px] font-semibold mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-[1.6]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-8">
            {HOW_IT_WORKS.steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={isTimelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="flex gap-4"
              >
                {/* Step Number */}
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-sky text-white flex items-center justify-center text-[24px] font-bold">
                    {step.number}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[18px] font-semibold">
                      {step.title}
                    </h4>
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">
                      ({step.duration})
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-[1.6]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

