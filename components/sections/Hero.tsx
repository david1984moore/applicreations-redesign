'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { DURATIONS, EASING } from '@/lib/animations'
import Image from 'next/image'

const HERO_CONTENT = {
  mainHeadline: "Your vision, our pride",
  subheadline: "Custom apps and websites",
  
  primaryCTA: {
    text: "Get Instant Quote",
    href: "/quote",
    ariaLabel: "Get an instant custom quote for your project"
  },
  
  secondaryCTA: {
    text: "See Demo Sites",
    href: "/demos",
    ariaLabel: "View our demo websites"
  }
}

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Background - Subtle */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-8">
        
        {/* Decorative Butterfly */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut }}
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))'
          }}
        >
          <Image 
            src="/logo.png"
            alt="Decorative butterfly"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
          />
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-4 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut, delay: 0.1 }}
        >
          {HERO_CONTENT.mainHeadline}
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p 
          className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut, delay: 0.15 }}
        >
          {HERO_CONTENT.subheadline}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
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
      </div>
    </section>
  )
}

