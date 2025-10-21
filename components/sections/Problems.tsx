'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SECTION_INTRO = {
  eyebrow: "The Problem",
  headline: "Your Business Deserves Better Than a Facebook Page",
  subheadline: "You're losing customers to competitors with real websites. Here's why:",
}

const PROBLEMS = [
  {
    icon: "search",
    title: "You're Invisible to Google",
    description: "Facebook posts don't show up in local searches. When customers search \"[your service] near me\", your competitors appear. You don't.",
    color: "var(--color-error)"
  },
  {
    icon: "trust",
    title: "You Look Less Professional",
    description: "Customers judge credibility in seconds. A Facebook page signals \"side hustle.\" A real website signals \"established business.\"",
    color: "var(--color-warning)"
  },
  {
    icon: "control",
    title: "Facebook Owns Your Presence",
    description: "Algorithm changes kill your reach. Account restrictions lock you out. Facebook controls your business visibility—you don't.",
    color: "var(--color-error)"
  },
  {
    icon: "growth",
    title: "You Can't Capture Leads",
    description: "No email list. No analytics. No way to retarget visitors. You're building on rented land with zero ownership of your customer relationships.",
    color: "var(--color-primary)"
  },
]

// Icon components (inline SVG)
const ICONS = {
  search: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  trust: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  control: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  growth: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
}

export default function Problems() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4"
      aria-labelledby="problems-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Intro */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[12px] uppercase tracking-[0.05em] text-blue-sky mb-3 font-semibold">
            {SECTION_INTRO.eyebrow}
          </p>
          <h2
            id="problems-heading"
            className="text-[28px] md:text-[38px] font-bold mb-4 leading-tight"
          >
            {SECTION_INTRO.headline}
          </h2>
          <p className="text-[18px] max-w-[600px] mx-auto text-gray-600 dark:text-gray-300">
            {SECTION_INTRO.subheadline}
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROBLEMS.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: index * 0.075,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.article
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 h-full flex flex-col transition-shadow duration-300"
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.2)',
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Icon */}
                <div
                  className="mb-4"
                  style={{ color: problem.color }}
                  aria-hidden="true"
                >
                  {ICONS[problem.icon as keyof typeof ICONS]}
                </div>

                {/* Title */}
                <h3 className="text-[21px] font-semibold mb-3 leading-tight">
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.6] text-gray-600 dark:text-gray-300">
                  {problem.description}
                </p>
              </motion.article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

