'use client'

import React from 'react'
import { motion } from 'framer-motion'

const SECTION_INTRO = {
  eyebrow: "",
  headline: "Built for Today, Engineered for the Future",
  subheadline: "",
}

const OPPORTUNITY_SOLUTIONS = [
  {
    icon: "search",
    title: "Discoverable Now & Tomorrow",
    opportunity: "SEO-optimized for today's search engines, structured for tomorrow's AI agents. When customers search or ask AI assistants, you'll be found.",
    solution: "Show Up in Local Searches",
    benefit: "Get found by ready-to-buy customers",
    features: [
      "Local SEO optimization",
      "Google Business integration", 
      "Mobile-first design (most searches happen on phones)",
      "Semantic HTML and JSON-LD schema"
    ],
    color: "var(--color-primary)"
  },
  {
    icon: "trust",
    title: "Professional Credibility",
    opportunity: "Custom design that builds trust instantly. Showcase expertise, display testimonials, and present your brand professionally.",
    solution: "Look Professional, Be Credible", 
    benefit: "Win customers before they call",
    features: [
      "Modern, clean design",
      "Fast loading (under 2 seconds)",
      "Professional copy that converts",
      "Customer testimonials integration"
    ],
    color: "var(--color-warning)"
  },
  {
    icon: "future",
    title: "Own Your Growth",
    opportunity: "The internet is evolving. AI assistants are becoming how people discover businesses. Future-proof your visibility while owning your customer relationships.",
    solution: "Own Your Customer Relationships",
    benefit: "Build a business, not just a following",
    features: [
      "Lead capture forms",
      "Email marketing integration", 
      "Analytics dashboard",
      "AI-ready structured data"
    ],
    color: "#8b5cf6"
  },
]

// Simple working version using exact pattern from demos
function FeatureItem({ feature, color, index }: { feature: string, color: string, index: number }) {
  return (
    <motion.li 
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div 
        className="w-2 h-2 rounded-full mt-2 shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {feature}
      </span>
    </motion.li>
  )
}

function FeatureBox({ features, color }: { features: string[], color: string }) {
  return (
    <>
      <motion.h4 
        className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        What You Get:
      </motion.h4>
      <ul className="space-y-3">
        {features.map((feature, featureIndex) => (
          <FeatureItem 
            key={feature} 
            feature={feature} 
            color={color} 
            index={featureIndex}
          />
        ))}
      </ul>
    </>
  )
}

export default function OpportunitySolution() {

  return (
    <section
      className="py-12 md:py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="opportunity-solution-heading"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Intro */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            id="opportunity-solution-heading"
            className="text-[32px] md:text-[42px] lg:text-[48px] font-bold leading-tight mb-2"
            style={{ color: 'oklch(72% 0.18 240)' }}
          >
            {SECTION_INTRO.headline}
          </h2>
          
          {/* Simple test to see if anything renders */}
          <div className="p-4 bg-red-500 text-white text-center">
            🔴 BASIC TEST: If you can see this red box, React is working
          </div>
        </div>

        {/* Simplified Content - Just the feature boxes */}
        <div className="space-y-16">
          {OPPORTUNITY_SOLUTIONS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <FeatureBox features={item.features} color={item.color} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

