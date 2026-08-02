'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn, staggerChildren } from '@/lib/animations';

export default function FinalCTA() {
  return (
    <section id="contact" className="relative py-20 md:py-24 overflow-hidden coastal-grain">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,oklch(78%_0.06_230/0.25),transparent_50%)]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerChildren}
        >
          <motion.h2
            variants={fadeIn}
            className="font-display text-3xl md:text-4xl text-white mb-4"
          >
            Ready when you are
          </motion.h2>

          <motion.p
            variants={fadeIn}
            className="text-lg text-primary-50 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Reach out anytime. We&apos;ll listen first, then help you choose the path that fits —
            Basic, Pro, or Business.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button
              href="mailto:hello@applicreations.com"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Email us
            </Button>
            <Button
              href="/introspect"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-white border-white/50 hover:bg-white/10 hover:border-white/80"
            >
              Introspect
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
