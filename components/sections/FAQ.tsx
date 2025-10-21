'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerChildren } from '@/lib/animations';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long does it take to build a custom website?",
    answer: "Most projects take 2-4 weeks from start to launch. Simple websites can be ready in as little as 1 week, while complex web applications may take 4-6 weeks. Our quote tool will give you an exact timeline based on the features you select."
  },
  {
    question: "Do I need to know how to code to manage my site?",
    answer: "Not at all! We build user-friendly admin panels that let you update content, add pages, and manage your site without touching any code. If you can use email or social media, you can manage your website. We also provide training and documentation to help you get started."
  },
  {
    question: "What's the difference between a template site and a custom site?",
    answer: "Template sites (like Wix or Squarespace) force you into their predetermined designs and limitations. Custom sites are built specifically for your business, giving you complete control over design, functionality, and your data. You own everything, and there are no monthly platform fees."
  },
  {
    question: "Can you help me with content and images?",
    answer: "Yes! We can help you refine your messaging, organize your content, and source professional stock images. If you have existing content, we'll polish it for the web. If you're starting from scratch, we'll guide you through the process to ensure your site effectively communicates your value."
  },
  {
    question: "Will my website work on mobile phones?",
    answer: "Absolutely. Every site we build is mobile-responsive, meaning it automatically adapts to look great on phones, tablets, and desktops. With over 60% of web traffic coming from mobile devices, this is a critical feature we never skip."
  },
  {
    question: "What happens after my site launches?",
    answer: "After launch, your site is yours to keep forever. You'll have 30 days of included support for any tweaks or questions. After that, you can manage updates yourself or work with us on an as-needed basis. We also offer monthly maintenance packages if you prefer hands-off management."
  },
  {
    question: "Can I see examples of your work?",
    answer: "Yes! We have demo sites that showcase our capabilities. You can browse our demos to see examples of different features and designs. Every project is unique, but demos give you a sense of quality and possibilities you can include in your custom site."
  },
  {
    question: "Do you offer hosting, or do I need to arrange that?",
    answer: "We can handle everything for you. Our pricing includes hosting setup, or you can use your own hosting if you prefer. We'll recommend reliable, affordable hosting options that match your site's needs and traffic expectations."
  }
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={fadeIn}
      className="border-b border-neutral-200 dark:border-neutral-700"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start justify-between text-left gap-4 group hover:opacity-80 transition-opacity"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pr-8">
          {item.question}
        </h3>
        <span className="shrink-0 mt-1">
          <svg
            className={`w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-lg text-neutral-600 dark:text-neutral-400"
          >
            Everything you need to know about working with us
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
          className="space-y-0"
        >
          {faqs.map((faq, index) => (
            <FAQAccordion key={index} item={faq} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          className="mt-16 text-center"
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Still have questions?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
          >
            Get in touch
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

