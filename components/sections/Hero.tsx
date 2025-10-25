'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { DURATIONS, EASING } from '@/lib/animations'
import Image from 'next/image'
import { useState } from 'react'

const HERO_CONTENT = {
  mainHeadline: "Your vision, our pride",
  subheadline: "Custom apps and websites",
  
  primaryCTA: {
    text: "Get Started",
    href: "#contact",
    ariaLabel: "Contact us to get started on your project"
  },
  
  secondaryCTA: {
    text: "See Demo Sites",
    href: "/demos",
    ariaLabel: "View our demo websites"
  }
}

export function Hero() {
  const [blotchState, setBlotchState] = useState<'visible' | 'converging' | 'hidden'>('visible')

  const handleLogoClick = () => {
    if (blotchState === 'visible') {
      // Start convergence
      setBlotchState('converging')
      // After convergence completes, set to hidden
      setTimeout(() => setBlotchState('hidden'), 2000)
    } else if (blotchState === 'hidden') {
      // Bring them back
      setBlotchState('visible')
    }
  }
  return (
    <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Solid Background with Subtle Texture */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" />
      
      {/* Color-Shifting Spray Paint Blotches - Floating Animation (Behind Content) */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-[15%] left-[10%] w-32 h-32"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            blotchState === 'hidden' ? {
              left: 'calc(50vw - 64px)',
              top: 'calc(50vh - 200px)',
              scale: 0,
              opacity: 0,
              filter: 'blur(24px)'
            } :
            blotchState === 'converging' ? {
              left: 'calc(50vw - 64px)',
              top: 'calc(50vh - 200px)',
              x: 0,
              y: 0,
              scale: 0,
              opacity: [null, 0.5, 0],
              filter: 'blur(24px)'
            } : { 
            opacity: [0.5, 0.3, 0.55, 0.35, 0.5],
            scale: [1, 1.2, 0.9, 1.1, 1],
            backgroundColor: ['#a78bfa', '#fb923c', '#60a5fa', '#a78bfa'],
            borderRadius: ['50%', '40%', '60%', '45%', '50%'],
            filter: ['blur(24px)', 'blur(2px)', 'blur(32px)', 'blur(4px)', 'blur(28px)', 'blur(3px)', 'blur(24px)'],
            x: ['0vw', '45vw', '-35vw', '20vw', '50vw', '-15vw', '-28vw', '38vw', '10vw', '0vw'],
            y: ['0vh', '-20vh', '35vh', '-40vh', '15vh', '30vh', '-35vh', '42vh', '-10vh', '0vh']
          }}
          transition={
            blotchState === 'hidden' ? {
              duration: 0.01
            } :
            blotchState === 'converging' ? {
              duration: 2,
              ease: [0.32, 0, 0.67, 0]
            } : { 
            opacity: { duration: 40, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 40, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 45, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 35, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 85, repeat: Infinity, ease: "easeInOut", delay: 0 },
            x: { duration: 300, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] },
            y: { duration: 320, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] }
          }}
        />
        <motion.div
          className="absolute top-[25%] right-[15%] w-24 h-24"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            blotchState === 'hidden' ? {
              left: 'calc(50vw - 48px)',
              top: 'calc(50vh - 200px)',
              right: 'auto',
              scale: 0,
              opacity: 0,
              filter: 'blur(16px)'
            } :
            blotchState === 'converging' ? {
              left: 'calc(50vw - 48px)',
              top: 'calc(50vh - 200px)',
              right: 'auto',
              x: 0,
              y: 0,
              scale: 0,
              opacity: [null, 0.5, 0],
              filter: 'blur(16px)'
            } : { 
            opacity: [0.45, 0.6, 0.35, 0.5, 0.45],
            scale: [1, 0.85, 1.15, 0.95, 1],
            backgroundColor: ['#60a5fa', '#a78bfa', '#fb923c', '#60a5fa'],
            borderRadius: ['50%', '55%', '42%', '48%', '50%'],
            filter: ['blur(16px)', 'blur(36px)', 'blur(3px)', 'blur(28px)', 'blur(1px)', 'blur(20px)', 'blur(16px)'],
            x: ['0vw', '-55vw', '18vw', '35vw', '-45vw', '8vw', '48vw', '-22vw', '-38vw', '0vw'],
            y: ['0vh', '25vh', '45vh', '-18vh', '-38vh', '40vh', '12vh', '-30vh', '48vh', '0vh']
          }}
          transition={
            blotchState === 'hidden' ? {
              duration: 0.01
            } :
            blotchState === 'converging' ? {
              duration: 2,
              ease: [0.32, 0, 0.67, 0]
            } : { 
            opacity: { duration: 38, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 38, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 42, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 33, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 110, repeat: Infinity, ease: "easeInOut", delay: 22 },
            x: { duration: 330, repeat: Infinity, ease: [0.65, 0, 0.35, 1] },
            y: { duration: 350, repeat: Infinity, ease: [0.33, 0.67, 0.67, 0.33] }
          }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[20%] w-20 h-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            blotchState === 'hidden' ? {
              left: 'calc(50vw - 40px)',
              top: 'calc(50vh - 200px)',
              bottom: 'auto',
              scale: 0,
              opacity: 0,
              filter: 'blur(24px)'
            } :
            blotchState === 'converging' ? {
              left: 'calc(50vw - 40px)',
              top: 'calc(50vh - 200px)',
              bottom: 'auto',
              x: 0,
              y: 0,
              scale: 0,
              opacity: [null, 0.5, 0],
              filter: 'blur(24px)'
            } : { 
            opacity: [0.4, 0.55, 0.3, 0.5, 0.4],
            scale: [1, 1.1, 0.85, 1.05, 1],
            backgroundColor: ['#fb923c', '#60a5fa', '#a78bfa', '#fb923c'],
            borderRadius: ['50%', '43%', '58%', '47%', '50%'],
            filter: ['blur(24px)', 'blur(4px)', 'blur(30px)', 'blur(2px)', 'blur(26px)', 'blur(5px)', 'blur(24px)'],
            x: ['0vw', '15vw', '40vw', '-25vw', '-48vw', '30vw', '5vw', '-52vw', '42vw', '0vw'],
            y: ['0vh', '-45vh', '18vh', '38vh', '-22vh', '-42vh', '32vh', '8vh', '-38vh', '0vh']
          }}
          transition={
            blotchState === 'hidden' ? {
              duration: 0.01
            } :
            blotchState === 'converging' ? {
              duration: 2,
              ease: [0.32, 0, 0.67, 0]
            } : { 
            opacity: { duration: 45, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 45, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 48, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 38, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 95, repeat: Infinity, ease: "easeInOut", delay: 47 },
            x: { duration: 310, repeat: Infinity, ease: [0.17, 0.67, 0.83, 0.33] },
            y: { duration: 360, repeat: Infinity, ease: [0.76, 0.14, 0.24, 0.86] }
          }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[25%] w-28 h-28"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            blotchState === 'hidden' ? {
              left: 'calc(50vw - 56px)',
              top: 'calc(50vh - 200px)',
              right: 'auto',
              bottom: 'auto',
              scale: 0,
              opacity: 0,
              filter: 'blur(16px)'
            } :
            blotchState === 'converging' ? {
              left: 'calc(50vw - 56px)',
              top: 'calc(50vh - 200px)',
              right: 'auto',
              bottom: 'auto',
              x: 0,
              y: 0,
              scale: 0,
              opacity: [null, 0.5, 0],
              filter: 'blur(16px)'
            } : { 
            opacity: [0.48, 0.35, 0.58, 0.4, 0.48],
            scale: [1, 0.9, 1.2, 0.95, 1],
            backgroundColor: ['#a78bfa', '#fb923c', '#60a5fa', '#a78bfa'],
            borderRadius: ['50%', '46%', '54%', '49%', '50%'],
            filter: ['blur(16px)', 'blur(32px)', 'blur(3px)', 'blur(28px)', 'blur(1px)', 'blur(22px)', 'blur(16px)'],
            x: ['0vw', '-38vw', '22vw', '48vw', '-12vw', '-50vw', '32vw', '8vw', '-42vw', '0vw'],
            y: ['0vh', '42vh', '-25vh', '-48vh', '38vh', '18vh', '-35vh', '50vh', '-8vh', '0vh']
          }}
          transition={
            blotchState === 'hidden' ? {
              duration: 0.01
            } :
            blotchState === 'converging' ? {
              duration: 2,
              ease: [0.32, 0, 0.67, 0]
            } : { 
            opacity: { duration: 43, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 43, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 46, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 36, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 125, repeat: Infinity, ease: "easeInOut", delay: 68 },
            x: { duration: 355, repeat: Infinity, ease: [0.87, 0.13, 0.13, 0.87] },
            y: { duration: 325, repeat: Infinity, ease: [0.42, 0.58, 0.58, 0.42] }
          }}
        />
        <motion.div
          className="absolute top-[40%] right-[8%] w-16 h-16"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            blotchState === 'hidden' ? {
              left: 'calc(50vw - 32px)',
              top: 'calc(50vh - 200px)',
              right: 'auto',
              scale: 0,
              opacity: 0,
              filter: 'blur(24px)'
            } :
            blotchState === 'converging' ? {
              left: 'calc(50vw - 32px)',
              top: 'calc(50vh - 200px)',
              right: 'auto',
              x: 0,
              y: 0,
              scale: 0,
              opacity: [null, 0.5, 0],
              filter: 'blur(24px)'
            } : { 
            opacity: [0.43, 0.53, 0.32, 0.48, 0.43],
            scale: [1, 1.15, 0.88, 1.08, 1],
            backgroundColor: ['#60a5fa', '#a78bfa', '#fb923c', '#60a5fa'],
            borderRadius: ['50%', '44%', '56%', '48%', '50%'],
            filter: ['blur(24px)', 'blur(2px)', 'blur(34px)', 'blur(1px)', 'blur(30px)', 'blur(4px)', 'blur(24px)'],
            x: ['0vw', '-50vw', '15vw', '38vw', '-20vw', '-42vw', '52vw', '5vw', '-35vw', '0vw'],
            y: ['0vh', '-48vh', '22vh', '40vh', '-15vh', '45vh', '-42vh', '30vh', '52vh', '0vh']
          }}
          transition={
            blotchState === 'hidden' ? {
              duration: 0.01
            } :
            blotchState === 'converging' ? {
              duration: 2,
              ease: [0.32, 0, 0.67, 0]
            } : { 
            opacity: { duration: 42, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 42, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 44, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 37, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 105, repeat: Infinity, ease: "easeInOut", delay: 35 },
            x: { duration: 340, repeat: Infinity, ease: [0.55, 0.25, 0.75, 0.45] },
            y: { duration: 370, repeat: Infinity, ease: [0.15, 0.85, 0.85, 0.15] }
          }}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-8">
        
        {/* Decorative Butterfly */}
        <motion.div
          className="flex justify-center mb-8 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: DURATIONS.normal, ease: EASING.easeOut }}
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 150, 200, 0.12)) drop-shadow(0 4px 8px rgba(0, 100, 150, 0.08))'
          }}
          onClick={handleLogoClick}
        >
          <Image 
            src="/logo.png"
            alt="Decorative butterfly - Click to see magic"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 outline-none focus:outline-none"
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

