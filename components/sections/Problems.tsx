'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SECTION_INTRO = {
  eyebrow: "The Problem",
  headline: "Your Business Deserves a Real Web Presence",
  subheadline: "You're losing customers to competitors with professional websites. Here's why:",
}

const PROBLEMS = [
  {
    icon: "search",
    title: "You're Invisible to Search Engines",
    description: "Without a website, you don't appear in local searches. When customers search \"[your service] near me\", your competitors show up. You don't.",
    color: "var(--color-error)"
  },
  {
    icon: "trust",
    title: "You Look Less Professional",
    description: "Customers judge credibility instantly. Social media profiles signal \"side hustle.\" A professional website signals \"established business.\"",
    color: "var(--color-warning)"
  },
  {
    icon: "control",
    title: "You Don't Own Your Platform",
    description: "Relying on Facebook, Instagram, or other platforms means algorithm changes can kill your reach overnight. You need a presence you control.",
    color: "var(--color-error)"
  },
  {
    icon: "growth",
    title: "You Can't Capture Leads Effectively",
    description: "No email list. Limited analytics. No way to retarget visitors. You're missing opportunities to build lasting customer relationships.",
    color: "var(--color-primary)"
  },
]


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
        <div className="text-center mb-10 md:mb-12">
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

        {/* Problem Items Staggered List */}
        <div className="max-w-6xl mx-auto space-y-12">
          {PROBLEMS.map((problem, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -40 : 40 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
              >
                <article
                  className={`flex items-start gap-6 group cursor-default max-w-2xl ${
                    isEven ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Icon with colored background */}
                  <div className="shrink-0">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
                        isEven ? 'group-hover:rotate-6' : 'group-hover:-rotate-6'
                      }`}
                      style={{ 
                        backgroundColor: `color-mix(in srgb, ${problem.color} 15%, transparent)`,
                        border: `2px solid color-mix(in srgb, ${problem.color} 30%, transparent)`
                      }}
                    >
                      <div
                        className="w-8 h-8"
                        style={{ color: problem.color }}
                        aria-hidden="true"
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {problem.icon === 'search' && (
                            <>
                              <circle cx="11" cy="11" r="8"/>
                              <path d="m21 21-4.35-4.35"/>
                            </>
                          )}
                          {problem.icon === 'trust' && (
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          )}
                          {problem.icon === 'control' && (
                            <>
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </>
                          )}
                          {problem.icon === 'growth' && (
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                          )}
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pt-2 ${isEven ? 'text-left' : 'text-right'} group-hover:cursor-pointer`}>
                    <h3 className="text-[24px] font-semibold mb-3 leading-tight text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors duration-300">
                      {problem.title}
                    </h3>
                    <p className="text-[17px] leading-[1.7] text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-300">
                      {problem.description}
                    </p>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

