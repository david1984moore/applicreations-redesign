'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type ProjectCategory = 'all' | 'simple' | 'business' | 'ecommerce' | 'portfolio';

interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  features: string[];
  image: string;
  link?: string;
  tech: string[];
}

// Demo projects data
const projects: Project[] = [
  // Simple Applications
  {
    id: '1',
    title: 'Mortgage Calculator',
    category: 'simple',
    description: 'Simple, clean calculator for real estate agents to help clients estimate monthly payments.',
    features: ['Payment Calculator', 'Amortization Schedule', 'Print Results', 'Mobile Friendly'],
    image: '/placeholder-calculator.jpg',
    tech: ['React', 'Tailwind', 'Chart.js'],
  },
  {
    id: '2',
    title: 'Event RSVP Page',
    category: 'simple',
    description: 'Single-page application for wedding or event RSVPs with guest management.',
    features: ['RSVP Form', 'Guest List', 'Meal Preferences', 'Admin Dashboard'],
    image: '/placeholder-rsvp.jpg',
    tech: ['Next.js', 'Tailwind', 'Airtable'],
  },
  {
    id: '3',
    title: 'Simple Portfolio Site',
    category: 'portfolio',
    description: 'Clean, minimal portfolio for freelancer with contact form and project showcase.',
    features: ['Project Gallery', 'About Section', 'Contact Form', 'Resume Download'],
    image: '/placeholder-simple-portfolio.jpg',
    tech: ['Next.js', 'Tailwind', 'Netlify'],
  },
  
  // Medium Complexity
  {
    id: '4',
    title: 'Restaurant Website',
    category: 'business',
    description: 'Modern restaurant site with online ordering integration and real-time menu updates.',
    features: ['Online Menu', 'Mobile Ordering', 'Reservation System', 'Location Map'],
    image: '/placeholder-restaurant.jpg',
    tech: ['Next.js', 'Tailwind', 'Stripe'],
  },
  {
    id: '5',
    title: 'Fitness Class Booking',
    category: 'business',
    description: 'Class scheduling system for yoga studio with member management and payments.',
    features: ['Class Schedule', 'Online Booking', 'Member Profiles', 'Payment Processing'],
    image: '/placeholder-fitness.jpg',
    tech: ['React', 'Stripe', 'Calendar API'],
  },
  {
    id: '6',
    title: 'Boutique Online Shop',
    category: 'ecommerce',
    description: 'Elegant e-commerce site for fashion boutique with lookbook and size guides.',
    features: ['Lookbook', 'Size Guides', 'Wishlist', 'Gift Cards'],
    image: '/placeholder-boutique.jpg',
    tech: ['Shopify', 'React', 'Tailwind'],
  },
  
  // Complex Applications
  {
    id: '7',
    title: 'E-commerce Platform',
    category: 'ecommerce',
    description: 'Full-featured online store with inventory management, analytics, and multi-vendor support.',
    features: ['Product Catalog', 'Inventory Management', 'Analytics Dashboard', 'Multi-vendor Support'],
    image: '/placeholder-ecommerce.jpg',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
  },
  {
    id: '8',
    title: 'Professional Services CRM',
    category: 'business',
    description: 'Complete client management system for law office with document handling and billing.',
    features: ['Client Portal', 'Case Management', 'Document Upload', 'Billing Integration'],
    image: '/placeholder-law.jpg',
    tech: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: '9',
    title: 'Home Services Platform',
    category: 'business',
    description: 'Lead-generating website for HVAC company with advanced quote calculator and CRM.',
    features: ['Quote Calculator', 'Service Area Map', 'CRM Integration', 'Reviews Management'],
    image: '/placeholder-hvac.jpg',
    tech: ['Next.js', 'Google Maps', 'Salesforce'],
  },
];

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'simple', label: 'Simple Tools' },
  { id: 'business', label: 'Business Sites' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'portfolio', label: 'Portfolios' },
] as const;

export default function DemosPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Logo Header */}
      <div className="fixed top-0 left-0 z-50 p-6">
        <Link 
          href="/" 
          className="block hover:scale-110 transition-transform duration-200 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:shadow-xl"
        >
          <Image 
            src="/logo.png" 
            alt="Applicreations Logo" 
            width={48} 
            height={48}
          />
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-linear-to-b from-primary-50 to-white dark:from-primary-950 dark:to-neutral-900 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Our Work
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Real websites we&apos;ve built for real businesses. Each one custom-designed
              to meet specific goals and deliver measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as ProjectCategory)}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700'
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    variant="elevated"
                    className="h-full flex flex-col overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Project Image Placeholder */}
                    <div className="w-full h-48 bg-linear-to-br from-primary-400 to-primary-600 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium">View Details</span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                          {project.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-4 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Key Features:
                        </h4>
                        <ul className="space-y-1">
                          {project.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
                            >
                              <svg
                                className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        {project.tech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Ready to bring your vision to life? Contact us to discuss your project
              and get a custom solution tailored to your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="#contact"
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100 border-none"
              >
                Contact Us
              </Button>
              <Button
                href="/#services"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                View Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

