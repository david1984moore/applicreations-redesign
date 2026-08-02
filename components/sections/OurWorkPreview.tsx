'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'

const featured = [
  {
    id: 'caramel-jo',
    title: 'Caramel & Jo',
    caption: 'A warm bakery site that feels at home on a phone.',
    image: '/images/caramel-jo/homepage.jpg',
  },
  {
    id: 'mi-gente',
    title: 'Mi Gente Bonita Market',
    caption: 'A friendly market presence with room to grow.',
    image: '/images/mi-gente/homepage.jpg',
  },
]

export function OurWorkPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="work" className="relative py-20 md:py-28 bg-paper coastal-grain" ref={ref}>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14"
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide uppercase text-primary-600 mb-3">
              Our work
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-3">
              A peek at what we&apos;ve built
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Real projects for real businesses — shown simply, so you can picture your own.
            </p>
          </div>
          <Button href="/demos" variant="outline" className="self-start md:self-auto">
            See more work
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {featured.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Link href="/demos" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand mb-4">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <h3 className="font-display text-2xl text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{project.caption}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
