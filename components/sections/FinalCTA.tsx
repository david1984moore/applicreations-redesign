'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn, staggerChildren } from '@/lib/animations';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-linear-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <motion.h2
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Grow Your Business Online?
          </motion.h2>
          
          <motion.p
            variants={fadeIn}
            className="text-xl text-primary-50 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Let's build a website that works as hard as you do. Use our quote tool to design your perfect site and get instant pricing - no pressure, no obligations.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              href="/quote"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 border-0"
            >
              Get Instant Quote
            </Button>
            <Button
              href="/demos"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10"
            >
              See Demo Sites
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-primary-500/30"
          >
            {/* Trust indicator 1 */}
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-primary-200 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                Quick Turnaround
              </h3>
              <p className="text-primary-100 text-sm">
                Most sites launch in 2-4 weeks
              </p>
            </div>

            {/* Trust indicator 2 */}
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-primary-200 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                You Own Everything
              </h3>
              <p className="text-primary-100 text-sm">
                Full ownership, no platform lock-in
              </p>
            </div>

            {/* Trust indicator 3 */}
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-primary-200 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ongoing Support
              </h3>
              <p className="text-primary-100 text-sm">
                30 days included, optional maintenance
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

