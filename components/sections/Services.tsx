'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';

const services = [
  {
    id: 'websites',
    title: 'Custom Websites',
    tagline: 'Built for your brand',
    description: 'Professional websites that establish credibility, attract your ideal customers, and convert visitors into leads. Built with modern technology and optimized for search engines.',
    icon: (
      <svg
        className="w-12 h-12 text-primary/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    price: 'Starting at $1,900',
    cta: 'View Examples',
    ctaHref: '/demos',
  },
  {
    id: 'webapps',
    title: 'Custom Applications',
    tagline: 'Custom tools that work',
    description: 'From simple tools to complex business systems - custom applications that solve real problems and save time. Whether it\'s a basic calculator or a full CRM system.',
    icon: (
      <svg
        className="w-12 h-12 text-primary/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    price: 'Starting at $6,250',
    cta: 'See What\'s Possible',
    ctaHref: '/demos',
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      ref={ref}
      className="py-6 px-4 sm:px-6 lg:px-8 bg-background"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-3"
        >
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
          >
            What We Build
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional web solutions designed to grow your business and streamline your operations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Icon */}
              <div className="mb-3">{service.icon}</div>

              {/* Title & Tagline */}
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {service.title}
              </h3>
              <p className="text-xs text-primary font-medium mb-2">
                {service.tagline}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

              {/* Pricing & CTA */}
              <div className="border-t border-border pt-3 mt-auto text-center">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Starting at <span className="text-lg font-bold">${service.price.split('$')[1]}</span>
                </p>
                <Button
                  variant="primary"
                  size="md"
                  href={service.ctaHref}
                  className="w-full"
                >
                  {service.cta}
                </Button>
              </div>
            </motion.article>
          ))}
        </div>


        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Not sure which option fits your needs?
          </h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-2xl mx-auto">
            Contact us to discuss your project needs and get a custom solution
            tailored to your business.
          </p>
          <Button variant="primary" size="lg" href="#contact">
            Get Started Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

