'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { plans } from '@/lib/pricing';

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="pricing"
      className="relative coastal-wash coastal-grain py-20 md:py-28"
      ref={ref}
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <p className="text-sm font-medium tracking-wide uppercase text-primary-600 mb-3">
            Simple pricing
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
            Pick what fits your business
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Three clear options. No jargon. No surprise add-ons buried in fine print.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
              className={`relative flex flex-col items-center text-center rounded-xl p-6 sm:p-7 ${
                plan.highlighted
                  ? 'bg-fade-pro border-2 border-[oklch(80%_0.05_215)] shadow-sm'
                  : 'bg-white/70 border border-gray-200'
              }`}
            >
              <h3 className="font-display text-2xl text-gray-900 mb-1">{plan.name}</h3>
              <p className="font-display text-4xl text-primary-700 mb-3">
                {plan.priceLabel}
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {plan.summary}
              </p>

              <ul className="space-y-2.5 mb-6 flex-1 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-gray-700 justify-center">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                href={plan.ctaHref}
                variant={plan.highlighted ? 'primary' : 'outline'}
                className={
                  plan.highlighted
                    ? 'w-full !bg-[oklch(91%_0.04_210)] hover:!bg-[oklch(86%_0.045_210)] !text-gray-900 focus-visible:!ring-[oklch(80%_0.05_215)/40]'
                    : 'w-full'
                }
              >
                {plan.cta}
              </Button>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 text-center text-sm text-gray-600 max-w-xl mx-auto"
        >
          Need ongoing help after launch?{' '}
          <Link
            href="/pricing#support"
            className="cursor-pointer font-medium text-primary-700 hover:text-primary-800"
          >
            See hosting &amp; support options
          </Link>
          .
        </motion.p>
      </div>
    </section>
  );
}
