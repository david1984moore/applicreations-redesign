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
    features: [
      'SEO-optimized from day one for maximum visibility',
      'Lightning-fast loading speeds for better user experience',
      'Mobile-first responsive design that works everywhere',
      'Easy content management system for updates',
      'Analytics integration to track performance',
    ],
    icon: (
      <svg
        className="w-16 h-16 text-primary/60"
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
    title: 'Web Apps',
    tagline: 'Custom tools that work',
    description: 'From simple tools to complex business systems - custom applications that solve real problems and save time. Whether it\'s a basic calculator or a full CRM system.',
    features: [
      'Simple tools: calculators, forms, landing pages',
      'Business automation: workflows, dashboards, reporting',
      'Data management: databases, user accounts, file handling',
      'Integration: APIs, payment processing, email systems',
      'Mobile-responsive design for any device',
    ],
    icon: (
      <svg
        className="w-16 h-16 text-primary/60"
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
      ref={ref}
      className="py-32 px-4 sm:px-6 lg:px-8 bg-background"
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
            Professional web solutions designed to grow your business and streamline your operations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="bg-card border border-border rounded-xl p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Icon */}
              <div className="mb-6">{service.icon}</div>

              {/* Title & Tagline */}
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-primary font-medium mb-4">
                {service.tagline}
              </p>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{service.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-6 grow" aria-label={`${service.title} features`}>
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Pricing & CTA */}
              <div className="border-t border-border pt-6 mt-auto text-center">
                <p className="text-lg font-semibold text-foreground mb-4">
                  Starting at <span className="text-2xl font-bold">${service.price.split('$')[1]}</span>
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

        {/* Web Apps Detail Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-50 rounded-2xl p-8 sm:p-12 mb-16"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-foreground mb-6 text-center">
              Turn Business Pain Points Into Competitive Advantages
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground mb-6">
                  Every business has unique challenges—manual processes that eat up time, 
                  data scattered across spreadsheets, or workflows that require constant oversight. 
                  We build custom web applications that solve these exact problems.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-foreground">Automate Repetitive Tasks</h4>
                      <p className="text-sm text-muted-foreground">Replace manual data entry, report generation, and routine processes with smart automation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-foreground">Centralize Your Data</h4>
                      <p className="text-sm text-muted-foreground">Connect all your business systems into one unified dashboard with real-time insights.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-foreground">Scale Your Operations</h4>
                      <p className="text-sm text-muted-foreground">Handle more volume without hiring more staff through intelligent workflow optimization.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Common Applications We Build:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Simple calculators and quote generators</li>
                  <li>• Customer relationship management (CRM) systems</li>
                  <li>• Event RSVP and registration forms</li>
                  <li>• Inventory tracking and management tools</li>
                  <li>• Contact forms and lead capture pages</li>
                  <li>• Employee scheduling and time tracking</li>
                  <li>• Project management and collaboration platforms</li>
                  <li>• Financial reporting and analytics dashboards</li>
                  <li>• Document management and approval workflows</li>
                  <li>• Custom e-commerce and booking systems</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Not sure which option fits your needs?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
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

