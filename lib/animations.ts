/**
 * Animation constants following iOS design principles
 * RULES:
 * - Only animate transform and opacity
 * - Always provide reduced motion fallback
 * - Use spring physics for natural feel
 */

export const SPRING_PHYSICS = {
  stiffness: 300,
  damping: 20,
  mass: 0.8,
}

export const DURATIONS = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.3,
}

export const EASING = {
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATIONS.normal, ease: EASING.easeOut },
}

export const scaleOnHover = {
  whileHover: { 
    scale: 1.02, 
    y: -8,
  },
  whileTap: { 
    scale: 0.98,
  },
  transition: { 
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
}

// Framer Motion variants for scroll animations
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.easeOut,
    },
  },
}

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

