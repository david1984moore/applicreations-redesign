'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { IconContact } from '@/components/ui/BrandNavLinks'
import { SITE_VIEWPORT_BELOW_NAV_CLASS } from '@/components/ui/Navigation'
import {
  galleryShotLabel,
  galleryShotShape,
  gallerySrc,
  projects,
  type GalleryShape,
  type GalleryShot,
  type Project,
} from '@/lib/projects'

const SLIDE_HOLD_MS = 3800
const SLIDE_FADE_S = 0.85

function brandTitleClass(project: Project) {
  if (project.brandFont === 'caramel') return 'font-caramel font-medium'
  if (project.brandFont === 'mi-gente') return 'font-mi-gente font-semibold tracking-tight'
  return 'font-display'
}

function GallerySlideshow({
  shots,
  title,
  defaultShape,
}: {
  shots: GalleryShot[]
  title: string
  defaultShape: GalleryShape
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setIndex(0)
    setPaused(false)
  }, [shots])

  useEffect(() => {
    if (paused || shots.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % shots.length)
    }, SLIDE_HOLD_MS)
    return () => window.clearInterval(id)
  }, [paused, shots.length])

  const selectShot = (i: number) => {
    setIndex(i)
    setPaused(true)
  }

  const shot = shots[index]
  const src = gallerySrc(shot)
  const shape = galleryShotShape(shot, defaultShape)
  const isPhone = shape === 'phone'

  return (
    <div className="flex flex-col items-center gap-3 md:hidden">
      {shots.length > 1 ? (
        <div
          role="tablist"
          aria-label={`${title} screens`}
          className="flex items-end justify-center gap-2"
        >
          {shots.map((thumb, i) => {
            const thumbSrc = gallerySrc(thumb)
            const thumbShape = galleryShotShape(thumb, defaultShape)
            const thumbPhone = thumbShape === 'phone'
            const active = i === index
            const label = galleryShotLabel(thumb)

            return (
              <button
                key={thumbSrc}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={
                  label
                    ? `Show ${label}`
                    : `Show screen ${i + 1} of ${shots.length}`
                }
                onClick={() => selectShot(i)}
                className={`relative shrink-0 overflow-hidden rounded-md cursor-pointer transition-[opacity,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                  thumbPhone ? 'w-9 aspect-[9/16]' : 'w-12 aspect-[4/3]'
                } ${active ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}`}
              >
                <Image
                  src={thumbSrc}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="36px"
                />
              </button>
            )
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={
          paused
            ? `Resume ${title} screenshots`
            : `Pause ${title} screenshots`
        }
        className={`relative overflow-hidden rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
          isPhone
            ? 'w-[min(72vw,260px)] aspect-[9/16]'
            : 'w-full max-w-xl aspect-[4/3]'
        }`}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SLIDE_FADE_S, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={`${title} — screen ${index + 1} of ${shots.length}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 72vw, 260px"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </button>
      <p className="text-xs text-gray-400" aria-live="polite">
        {paused ? 'Paused — tap image to resume' : 'Tap a thumbnail or tap image to pause'}
      </p>
    </div>
  )
}

/** Desktop: open walkthrough of screens — no slideshow, no card grid */
function GalleryWalkthrough({
  shots,
  title,
  defaultShape,
}: {
  shots: GalleryShot[]
  title: string
  defaultShape: GalleryShape
}) {
  return (
    <div className="hidden md:block">
      <ul className="flex flex-wrap items-end gap-x-5 gap-y-8 lg:gap-x-7">
        {shots.map((shot, index) => {
          const src = gallerySrc(shot)
          const shape = galleryShotShape(shot, defaultShape)
          const label = galleryShotLabel(shot)
          const isPhone = shape === 'phone'
          const isLead = index === 0

          return (
            <motion.li
              key={src}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.06 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-sand/40 shadow-[0_18px_40px_-28px_rgba(40,50,70,0.45)] ${
                  isPhone
                    ? isLead
                      ? 'w-[200px] lg:w-[220px] aspect-[9/16]'
                      : 'w-[148px] lg:w-[160px] aspect-[9/16]'
                    : isLead
                      ? 'w-[320px] lg:w-[360px] aspect-[4/3]'
                      : 'w-[240px] lg:w-[260px] aspect-[4/3]'
                }`}
              >
                <Image
                  src={src}
                  alt={
                    label
                      ? `${title} — ${label}`
                      : `${title} — screen ${index + 1}`
                  }
                  fill
                  className="object-cover object-top"
                  sizes={isLead ? '220px' : '160px'}
                  priority={isLead}
                />
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  const shots = project.gallery?.length ? project.gallery : [project.image]
  const defaultShape: GalleryShape = project.galleryShape ?? 'phone'
  const siteHost = project.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className="pt-2 pb-2">
      <header className="mb-7 max-w-xl mx-auto md:mx-0 text-center md:text-left">
        <h2
          className={`${brandTitleClass(project)} text-3xl sm:text-4xl text-gray-900 leading-none`}
        >
          {project.title}
        </h2>

        <div className="mt-2.5 flex flex-wrap items-baseline justify-center md:justify-start gap-x-2 gap-y-0.5 text-sm">
          <a
            href={project.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-medium text-primary-700 hover:text-primary-800 underline underline-offset-2"
          >
            {siteHost}
          </a>
          <span className="text-gray-300" aria-hidden>
            ·
          </span>
          <Link
            href="/pricing"
            className="cursor-pointer text-gray-500 hover:text-primary-700"
          >
            {project.packageLabel}
          </Link>
        </div>

        <p className="mt-3 text-primary-700 leading-relaxed">{project.description}</p>

        <ul className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-left">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: project.accent }}
                aria-hidden
              />
              {feature}
            </li>
          ))}
        </ul>
      </header>

      <GallerySlideshow
        shots={shots}
        title={project.title}
        defaultShape={defaultShape}
      />
      <GalleryWalkthrough
        shots={shots}
        title={project.title}
        defaultShape={defaultShape}
      />

      <div className="mt-7 flex justify-center md:justify-start">
        <a
          href={project.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer inline-flex h-12 items-center justify-center rounded-md border border-gray-300 px-6 text-base font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-sand/40"
        >
          Visit {project.shortTitle ?? project.title}
        </a>
      </div>
    </div>
  )
}

export default function DemosPage() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && projects.some((p) => p.id === hash)) {
      setActiveId(hash)
    }
  }, [])

  const activeProject = projects.find((p) => p.id === activeId) ?? null
  const collapsed = !activeProject

  // Collapsed view must fit in one screen — no page scroll
  useEffect(() => {
    if (!collapsed) return
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [collapsed])

  const selectProject = (id: string) => {
    const next = activeId === id ? null : id
    if (next) {
      window.history.replaceState(null, '', `#${next}`)
    } else {
      window.history.replaceState(null, '', window.location.pathname)
    }
    setActiveId(next)
  }

  return (
    <main
      className={
        collapsed
          ? `${SITE_VIEWPORT_BELOW_NAV_CLASS} overflow-hidden`
          : 'pb-10'
      }
    >
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,oklch(92%_0.03_230/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_10%,oklch(93%_0.03_80/0.5),transparent_50%)]" />
        <div className="absolute inset-0 bg-paper" />
      </div>

      <section className={`px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 ${collapsed ? 'pb-5' : 'pb-6'}`}>
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl text-gray-900 mb-1.5">
              Our work
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-snug mb-4 max-w-xl">
              Pick a project to see how it looks and what went into it.
            </p>

            <div
              role="tablist"
              aria-label="Choose a project"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {projects.map((project) => {
                const selected = activeId === project.id
                return (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`project-panel-${project.id}`}
                    id={`project-tab-${project.id}`}
                    onClick={() => selectProject(project.id)}
                    className={`cursor-pointer flex items-center gap-2.5 rounded-lg border bg-white px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 ${
                      selected
                        ? 'border-primary-600/50 ring-1 ring-primary-600/20'
                        : 'border-gray-200 hover:border-primary-600/35'
                    }`}
                  >
                    {project.logo ? (
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white">
                        <Image
                          src={project.logo}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span
                        className={`block text-base leading-tight text-gray-900 ${brandTitleClass(project)}`}
                      >
                        {project.shortTitle ?? project.title}
                      </span>
                      <span className="block text-xs sm:text-sm text-gray-500 mt-0.5 leading-snug">
                        {project.caption}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                id={`project-panel-${activeProject.id}`}
                role="tabpanel"
                aria-labelledby={`project-tab-${activeProject.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <ProjectDetail project={activeProject} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`border-t border-gray-200/80 ${
              collapsed ? 'mt-5 pt-4' : 'mt-8 pt-5'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl text-gray-900 leading-tight">
                  Want something like this?
                </h2>
                <p className="text-sm text-gray-600 leading-snug mt-0.5">
                  Start with Introspect — or email us directly.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/introspect"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-2.5 font-sans text-base font-bold tracking-tight text-primary-800 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28),0_2px_8px_-2px_rgba(0,0,0,0.12)] ring-1 ring-primary-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 cursor-pointer"
                >
                  <span className="relative inline-flex items-center gap-3">
                    <span className="relative z-0 h-2 w-2 shrink-0" aria-hidden>
                      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(58%_0.14_310)] shadow-[0_0_0_0_oklch(58%_0.14_310)] transition-[box-shadow] duration-200 ease-in-out group-hover:shadow-[0_0_0_220px_oklch(58%_0.14_310)] group-focus-visible:shadow-[0_0_0_220px_oklch(58%_0.14_310)]" />
                      <span className="relative z-20 block h-2 w-2 rounded-full bg-[oklch(58%_0.14_310)] transition-colors duration-200 ease-in-out group-hover:bg-white group-focus-visible:bg-white" />
                    </span>
                    <span className="relative z-10 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-visible:text-white">
                      Begin Introspect
                    </span>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="group flex flex-col items-center gap-1 rounded-md px-3 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                >
                  <span className="inline-flex text-gray-900 transition-colors duration-200 group-hover:text-gray-600">
                    <IconContact className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-semibold tracking-tight text-gray-900 group-hover:text-gray-600">
                    Contact
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
