'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerChildren, slideInFromTop } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    answer: "After launch, your site is yours to keep forever. You'll have included support for any tweaks or questions (30-90 days depending on your package*). After that, you can manage updates yourself or choose from our comprehensive hosting & maintenance packages starting at $75/month with work credits included."
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

function FAQItem({ item, index }: { item: FAQItem; index: number }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.2, 
        duration: 0.6,
        ease: "easeOut"
      }}
      className="mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-2 shrink-0"></div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {item.question}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const [showAllFAQs, setShowAllFAQs] = useState(false);
  const displayedFAQs = showAllFAQs ? faqs : faqs.slice(0, 4);

  return (
    <section id="faq" className="py-8 bg-white dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
          className="text-center mb-4"
        >
          <motion.h2
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2"
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

        <div className="space-y-0">
          {displayedFAQs.map((faq, index) => (
            <FAQItem key={`faq-${index}-${displayedFAQs.length}`} item={faq} index={index} />
          ))}
        </div>

        {/* Show More/Less Button */}
        {faqs.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-4"
          >
            <button
              onClick={() => setShowAllFAQs(!showAllFAQs)}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              {showAllFAQs ? 'Show Less' : `Show ${faqs.length - 4} More Questions`}
              {showAllFAQs ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          className="mt-6 text-center"
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Still have questions?
          </p>
          <Button variant="primary" size="md" href="#contact">
            Contact Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

