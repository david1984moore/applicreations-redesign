'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';

const plans = [
  {
    id: 'starter',
    name: 'Starter Website',
    tagline: 'Perfect for small businesses',
    price: '$1,900',
    duration: 'one-time',
    description: 'A professional 5-page website that gets you online fast.',
    features: [
      '5 custom pages',
      'Mobile-responsive design',
      'SEO optimization',
      'Contact form',
      'Google Analytics',
      '30 days support*',
      'Up to 3 feature selections *features priced separately',
    ],
    cta: 'Get Started',
    ctaHref: '#contact',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional Website',
    tagline: 'Best value for growing businesses',
    price: '$3,250',
    duration: 'one-time',
    description: 'Everything you need to compete online and capture leads.',
    features: [
      'Up to 8 custom pages',
      'Advanced SEO setup',
      'Lead capture forms',
      'Email integration',
      'CMS for easy updates',
      'Social media integration',
      '60 days support*',
      'Performance optimization',
      'Up to 5 feature selections *features priced separately',
    ],
    cta: 'Get Started',
    ctaHref: '#contact',
    popular: true,
  },
  {
    id: 'custom',
    name: 'Custom Web App',
    tagline: 'Built for your needs',
    price: '$6,250',
    duration: 'one-time',
    description: 'Complex applications with custom functionality.',
    features: [
      'Unlimited pages',
      'Custom features',
      'Database integration',
      'User authentication',
      'API development',
      'Cloud hosting setup',
      '90 days support',
      'Ongoing maintenance available',
      'Up to 8 feature selections *8 features are included in the base custom price. Additional features priced separately.',
    ],
    cta: 'Get Quote',
    ctaHref: '#contact',
    popular: false,
  },
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-32 px-4 sm:px-6 lg:px-8 bg-background"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            id="pricing-heading"
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No monthly charges. You own what we build.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className={`relative bg-card border rounded-xl p-10 shadow-sm transition-shadow flex flex-col ${
                plan.popular ? 'border-accent-warm border-2' : 'border-border'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-accent-warm text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-6">
                  {plan.tagline}
                </p>
                
                {/* Price Display - Redesigned */}
                <div className="mb-6">
                  {plan.price.startsWith('Starting at') ? (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground/70 uppercase tracking-wide mb-1">
                        Starting at
                      </div>
                      <div className="text-5xl font-bold text-foreground mb-1">
                        {plan.price.replace('Starting at ', '')}
                      </div>
                      {plan.duration === 'one-time' && (
                        <div className="text-sm text-muted-foreground">one-time</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl font-bold text-foreground mb-1">
                        {plan.price}
                      </div>
                      {plan.duration === 'one-time' && (
                        <div className="text-sm text-muted-foreground">one-time</div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground text-center">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow" aria-label={`${plan.name} features`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                size="lg"
                href={plan.ctaHref}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.article>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">No Hidden Fees</h3>
              <p className="text-sm text-muted-foreground">
                All costs discussed upfront. No surprise charges.
              </p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">You Own Everything</h3>
              <p className="text-sm text-muted-foreground">
                Full ownership of your site, code, and content.
              </p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Support Included</h3>
              <p className="text-sm text-muted-foreground">
                Post-launch support to ensure everything runs smoothly.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Have questions? Want a custom quote?
          </p>
          <Button variant="primary" size="lg" href="#contact">
            Contact Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

