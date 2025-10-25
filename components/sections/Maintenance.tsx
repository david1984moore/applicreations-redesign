'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 75,
    workCredit: 1,
    tagline: 'Essential maintenance',
    description: 'Perfect for simple sites that need basic upkeep.',
    features: [
      '1 hour work credit per month',
      'Security monitoring',
      'Uptime monitoring',
      'Basic analytics reports',
      'Email support',
      'Plugin/software updates',
      'Monthly backup verification',
    ],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Pro',
    price: 150,
    workCredit: 2,
    tagline: 'Perfect for most businesses',
    description: 'Comprehensive support for growing businesses.',
    features: [
      '2 hours work credit per month',
      'Advanced security scans',
      'Performance monitoring',
      'Detailed analytics reports',
      'Priority email support',
      'Content updates included',
      'SEO health monitoring',
      'Weekly backup verification',
      'Minor feature additions',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 300,
    workCredit: 4,
    tagline: 'Maximum peace of mind',
    description: 'White-glove service for mission-critical sites.',
    features: [
      '4 hours work credit per month',
      'Proactive security hardening',
      'Real-time performance alerts',
      'Custom analytics dashboards',
      'Phone + email support',
      'Content strategy consultation',
      'Advanced SEO optimization',
      'Daily backup verification',
      'Feature development included',
      'Emergency response (2hr)',
    ],
    popular: false,
  },
];

const durations = [
  { months: 3, label: '3 Months', discount: 0 },
  { months: 6, label: '6 Months', discount: 5 },
  { months: 12, label: '12 Months', discount: 10 },
];

export function Maintenance() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedDuration, setSelectedDuration] = useState(6); // Default to 6 months

  const calculatePrice = (basePrice: number, months: number) => {
    const duration = durations.find(d => d.months === months);
    if (!duration) return basePrice * months;
    
    const discountedPrice = basePrice * (1 - duration.discount / 100);
    return Math.round(discountedPrice * months);
  };

  const getMonthlyPrice = (basePrice: number, months: number) => {
    const duration = durations.find(d => d.months === months);
    if (!duration) return basePrice;
    
    return Math.round(basePrice * (1 - duration.discount / 100));
  };

  return (
    <section
      ref={ref}
      className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50"
      aria-labelledby="maintenance-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            id="maintenance-heading"
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Hosting & Maintenance Packages
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Keep your website secure, fast, and up-to-date with our comprehensive maintenance packages. 
            Each includes monthly work credits for updates and improvements.
          </p>

          {/* Duration Selector */}
          <div className="inline-flex bg-white border border-border rounded-lg p-1 shadow-sm">
            {durations.map((duration) => (
              <button
                key={duration.months}
                onClick={() => setSelectedDuration(duration.months)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedDuration === duration.months
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {duration.label}
                {duration.discount > 0 && (
                  <span className="ml-1 text-xs">
                    (-{duration.discount}%)
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => {
            const totalPrice = calculatePrice(pkg.price, selectedDuration);
            const monthlyPrice = getMonthlyPrice(pkg.price, selectedDuration);
            const savings = selectedDuration > 3 ? pkg.price * selectedDuration - totalPrice : 0;

            return (
              <motion.article
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className={`relative bg-card border rounded-xl p-8 shadow-sm transition-shadow flex flex-col h-full ${
                  pkg.popular ? 'border-accent-warm border-2' : 'border-border'
                }`}
              >
                {/* Most Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-accent-warm text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {/* Package Header */}
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-foreground mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-4">
                    {pkg.tagline}
                  </p>
                
                  {/* Price Display */}
                  <div className="mb-4 text-center">
                    <div className="text-5xl font-bold text-foreground mb-1">
                      ${monthlyPrice}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${totalPrice} total for {selectedDuration} months
                    </div>
                    {savings > 0 && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        Save ${savings}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">{pkg.description}</p>
                </div>

                {/* Work Credit Highlight */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-5">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-1 h-6 flex items-center justify-center">
                      {pkg.workCredit}
                    </div>
                    <div className="text-sm font-medium text-primary mb-1 h-4 flex items-center justify-center">
                      Hour{pkg.workCredit > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monthly Work Credit
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 grow" aria-label={`${pkg.name} features`}>
                  {pkg.features.map((feature, idx) => (
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
                  variant={pkg.popular ? 'primary' : 'outline'}
                  size="lg"
                  href="#contact"
                  className="w-full"
                >
                  Get Started
                </Button>
              </motion.article>
            );
          })}
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Rollover Credits</h3>
              <p className="text-sm text-muted-foreground">
                Unused work credits roll over for up to 3 months.
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Fast Response</h3>
              <p className="text-sm text-muted-foreground">
                Most requests completed within 24-48 hours.
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Cancel Anytime</h3>
              <p className="text-sm text-muted-foreground">
                No long-term contracts. Cancel with 30 days notice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Asterisk Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-blue-800">
            <strong>*Support Period:</strong> All website projects include complimentary support for the specified period (30-90 days depending on package). 
            After this period, ongoing maintenance is available through our hosting & maintenance packages above.
          </p>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Questions about our maintenance packages?
          </p>
          <Button variant="primary" size="lg" href="#contact">
            Contact Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
