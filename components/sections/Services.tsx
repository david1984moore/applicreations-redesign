'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';

const services = [
  {
    id: 'websites',
    title: 'Custom Websites',
    tagline: 'Built for your brand',
    description: 'Professional websites designed to convert visitors into customers.',
    features: [
      'SEO-optimized from day one',
      'Fast loading speeds',
      'Mobile-first design',
      'Easy content updates',
      'Analytics integration',
    ],
    icon: (
      <svg
        className="w-16 h-16 text-primary"
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
    price: 'Starting at $2,500',
    cta: 'View Website Examples',
    ctaHref: '#portfolio',
  },
  {
    id: 'webapps',
    title: 'Web Apps',
    tagline: 'Custom tools that work',
    description: 'Interactive applications built to solve your specific business challenges.',
    features: [
      'Custom dashboards',
      'Database integration',
      'User authentication',
      'API connections',
      'Cloud hosting included',
    ],
    icon: (
      <svg
        className="w-16 h-16 text-primary"
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
    price: 'Starting at $5,000',
    cta: 'See What\'s Possible',
    ctaHref: '#portfolio',
  },
  {
    id: 'mobile',
    title: 'Mobile-Ready',
    tagline: 'Works on every device',
    description: 'Every site we build looks perfect on phones, tablets, and desktops.',
    features: [
      'Responsive layouts',
      'Touch-optimized',
      'App-like performance',
      'Offline capabilities',
      'Progressive web apps',
    ],
    icon: (
      <svg
        className="w-16 h-16 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    price: 'Included in all projects',
    cta: 'Learn More',
    ctaHref: '#mobile',
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-background"
      aria-labelledby="services-heading"
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
            id="services-heading"
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            What We Build
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional web solutions tailored to your business needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="mb-6">{service.icon}</div>

              {/* Title & Tagline */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-primary font-medium mb-4">
                {service.tagline}
              </p>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{service.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-6" aria-label={`${service.title} features`}>
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
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

              {/* Pricing */}
              <div className="border-t border-border pt-6 mb-6">
                <p className="text-lg font-semibold text-foreground">
                  {service.price}
                </p>
              </div>

              {/* CTA */}
              <Button
                variant="outline"
                size="md"
                href={service.ctaHref}
                className="w-full"
              >
                {service.cta}
              </Button>
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
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Not sure which option fits your needs?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get a free consultation and we&apos;ll recommend the best solution for your
            business.
          </p>
          <Button variant="primary" size="lg" href="#contact">
            Schedule Free Consultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

