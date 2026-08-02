'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 75,
    tagline: 'Essential maintenance',
    description: 'Security monitoring, updates, and 1 hour monthly work credit.',
  },
  {
    id: 'professional',
    name: 'Pro',
    price: 150,
    tagline: 'Perfect for most businesses',
    description: 'Everything in Basic plus performance monitoring and 2 hours monthly work credit.',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 300,
    tagline: 'Maximum peace of mind',
    description: 'White-glove service with 4 hours monthly work credit and priority support.',
  },
];

export function MaintenanceCondensed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      ref={ref}
      className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50"
      aria-labelledby="maintenance-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Condensed Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2
            id="maintenance-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
          >
            Hosting & Maintenance
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-4">
            Keep your website secure and up-to-date with monthly work credits included.
          </p>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Show Less' : 'View Packages & Pricing'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Quick Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`relative bg-card border rounded-lg p-4 text-center ${
                      pkg.popular ? 'border-primary border-2' : 'border-border'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {pkg.name}
                    </h3>
                    <div className="text-2xl font-bold text-primary mb-2">
                      ${pkg.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pkg.description}
                    </p>
                    <Button
                      variant={pkg.popular ? 'primary' : 'outline'}
                      size="sm"
                      href="#contact"
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Key Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-card border border-border rounded-lg p-6 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Work Credits Roll Over</h4>
                    <p className="text-sm text-muted-foreground">Unused credits roll over for up to 3 months</p>
                  </div>
                  
                  <div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Fast Response</h4>
                    <p className="text-sm text-muted-foreground">Most requests completed within 24-48 hours</p>
                  </div>
                  
                  <div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Cancel Anytime</h4>
                    <p className="text-sm text-muted-foreground">No long-term contracts required</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about maintenance packages?
                </p>
                <Button variant="primary" size="md" href="#contact">
                  Contact Us
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
