'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { DURATIONS, EASING } from '@/lib/animations'
import Image from 'next/image'

const HERO_CONTENT = {
  headline: "Custom Apps and Websites",
  subheadline: "Professional web development for businesses ready to grow online. Clean code, modern design, built to perform.",
  
  primaryCTA: {
    text: "View Services",
    href: "/services",
    ariaLabel: "View our web development services"
  },
  
  secondaryCTA: {
    text: "Get Started",
    href: "/contact",
    ariaLabel: "Contact us to get started"
  },
  
  trustIndicators: [
    "Custom Solutions",
    "Modern Technology",
    "Expert Development"
  ]
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Background - Subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-20">
        
        {/* Logo and Brand */}
        <motion.div
          className="relative inline-block mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut }}
        >
          <div className="relative pt-8">
            <Image 
              src="/logo.png"
              alt="Applicreations Logo"
              width={80}
              height={80}
              className="absolute top-[-5px] left-[20%] sm:left-[21%] lg:left-[22%] w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 z-10"
              priority
            />
            <h1 className="text-[43px] sm:text-[51px] lg:text-[60px] font-bold leading-tight text-gray-900 dark:text-gray-50 text-center relative tracking-wide">
              Applicreations
            </h1>
            <p className="text-[18px] sm:text-[20px] lg:text-[21px] text-gray-600 dark:text-gray-400 italic text-left ml-[38%] sm:ml-[39%] lg:ml-[40%] mt-[-4px]">
              Custom apps & websites
            </p>
          </div>
        </motion.div>
        
        {/* Subheadline */}
        <motion.p 
          className="text-lg sm:text-xl lg:text-[21px] leading-normal text-gray-700 dark:text-gray-300 mb-10 max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut, delay: 0.1 }}
        >
          {HERO_CONTENT.subheadline}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut, delay: 0.2 }}
        >
          <Button 
            variant="primary" 
            size="lg"
            href={HERO_CONTENT.primaryCTA.href}
            aria-label={HERO_CONTENT.primaryCTA.ariaLabel}
            className="min-w-full sm:min-w-[200px] h-14"
          >
            {HERO_CONTENT.primaryCTA.text}
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg"
            href={HERO_CONTENT.secondaryCTA.href}
            aria-label={HERO_CONTENT.secondaryCTA.ariaLabel}
            className="min-w-full sm:min-w-[200px] h-14"
          >
            {HERO_CONTENT.secondaryCTA.text}
          </Button>
        </motion.div>
        
        {/* Trust Indicators */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut, delay: 0.3 }}
        >
          {HERO_CONTENT.trustIndicators.map((indicator, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
            >
              <svg 
                className="w-4 h-4 text-action shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="whitespace-nowrap">{indicator}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

