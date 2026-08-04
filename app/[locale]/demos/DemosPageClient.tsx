'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { IconContact } from '@/components/ui/BrandNavLinks'
import { SITE_VIEWPORT_BELOW_NAV_CLASS } from '@/components/ui/Navigation'
import {
  galleryShotLabel,
  galleryShotShape,
  gallerySrc,
  getProjects,
  type GalleryShape,
  type GalleryShot,
  type Project,
} from '@/lib/projects'

const SLIDE_HOLD_MS = 3800
const SLIDE_FADE_S = 0.85
const ZOOM_MIN = 1
const ZOOM_MAX = 4
const DOUBLE_TAP_MS = 280

function brandTitleClass(project: Project) {
  if (project.brandFont === 'caramel') return 'font-caramel font-medium'
  if (project.brandFont === 'mi-gente') return 'font-mi-gente font-semibold tracking-tight'
  return 'font-display'
}

function touchDistance(a: Touch, b: Touch) {
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
}

function touchMidpoint(a: Touch, b: Touch) {
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  }
}

/** Mobile-only fullscreen photo viewer with pinch-zoom / pan (desktop unused). */
function MobilePhotoZoom({
  src,
  alt,
  onClose,
  closeLabel,
  zoomHint,
}: {
  src: string
  alt: string
  onClose: () => void
  closeLabel: string
  zoomHint: string
}) {
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(1)
  const offsetRef = useRef({ x: 0, y: 0 })
  const pinchStartDist = useRef(0)
  const pinchStartScale = useRef(1)
  const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null
  )
  const lastTap = useRef(0)
  const closeTimer = useRef<number | null>(null)
  const moved = useRef(false)

  const applyTransform = () => {
    const el = imgWrapRef.current
    if (!el) return
    const { x, y } = offsetRef.current
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleRef.current})`
  }

  const commitTransform = (nextScale: number, nextOffset: { x: number; y: number }) => {
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextScale))
    scaleRef.current = clamped
    offsetRef.current = clamped <= 1.01 ? { x: 0, y: 0 } : nextOffset
    applyTransform()
  }

  useEffect(() => {
    setMounted(true)
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Native listeners so preventDefault works for pinch/pan (React touchmove is passive).
  useEffect(() => {
    if (!mounted) return
    const stage = stageRef.current
    if (!stage) return

    const onTouchStart = (e: TouchEvent) => {
      moved.current = false
      const a = e.touches.item(0)
      const b = e.touches.item(1)
      if (a && b) {
        if (closeTimer.current != null) {
          window.clearTimeout(closeTimer.current)
          closeTimer.current = null
        }
        pinchStartDist.current = touchDistance(a, b)
        pinchStartScale.current = scaleRef.current
        panStart.current = null
        return
      }
      if (a && e.touches.length === 1) {
        panStart.current = {
          x: a.clientX,
          y: a.clientY,
          ox: offsetRef.current.x,
          oy: offsetRef.current.y,
        }
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      const a = e.touches.item(0)
      const b = e.touches.item(1)
      if (a && b) {
        e.preventDefault()
        moved.current = true
        const dist = touchDistance(a, b)
        if (pinchStartDist.current <= 0) return
        const nextScale = (pinchStartScale.current * dist) / pinchStartDist.current
        const mid = touchMidpoint(a, b)
        const prev = scaleRef.current || 1
        const ratio = nextScale / prev
        commitTransform(nextScale, {
          x: mid.x - (mid.x - offsetRef.current.x) * ratio,
          y: mid.y - (mid.y - offsetRef.current.y) * ratio,
        })
        return
      }
      if (a && panStart.current && scaleRef.current > 1.01) {
        e.preventDefault()
        const dx = a.clientX - panStart.current.x
        const dy = a.clientY - panStart.current.y
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true
        commitTransform(scaleRef.current, {
          x: panStart.current.ox + dx,
          y: panStart.current.oy + dy,
        })
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const tap = e.changedTouches.item(0)
      if (e.touches.length === 0 && tap && !moved.current) {
        const now = Date.now()
        if (now - lastTap.current < DOUBLE_TAP_MS) {
          if (closeTimer.current != null) {
            window.clearTimeout(closeTimer.current)
            closeTimer.current = null
          }
          if (scaleRef.current > 1.05) {
            commitTransform(1, { x: 0, y: 0 })
          } else {
            const targetScale = 2.4
            commitTransform(targetScale, {
              x: (window.innerWidth / 2 - tap.clientX) * (targetScale - 1),
              y: (window.innerHeight / 2 - tap.clientY) * (targetScale - 1),
            })
          }
          lastTap.current = 0
        } else if (scaleRef.current <= 1.01) {
          lastTap.current = now
          closeTimer.current = window.setTimeout(() => {
            if (lastTap.current === now) onClose()
          }, DOUBLE_TAP_MS)
        } else {
          lastTap.current = now
        }
      }
      if (e.touches.length < 2) pinchStartDist.current = 0
      if (e.touches.length === 0) panStart.current = null
    }

    stage.addEventListener('touchstart', onTouchStart, { passive: true })
    stage.addEventListener('touchmove', onTouchMove, { passive: false })
    stage.addEventListener('touchend', onTouchEnd)
    stage.addEventListener('touchcancel', onTouchEnd)
    return () => {
      stage.removeEventListener('touchstart', onTouchStart)
      stage.removeEventListener('touchmove', onTouchMove)
      stage.removeEventListener('touchend', onTouchEnd)
      stage.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [mounted, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[200] md:hidden bg-black/95 touch-none"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <p className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 z-10 text-center text-xs text-white/55 px-4">
        {zoomHint}
      </p>

      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          ref={imgWrapRef}
          className="relative h-full w-full will-change-transform"
          style={{ transform: 'translate3d(0px, 0px, 0) scale(1)' }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain pointer-events-none select-none"
            sizes="100vw"
            priority
            draggable={false}
          />
        </div>
      </div>
    </div>,
    document.body
  )
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
  const { dict, t } = useLocale()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    setIndex(0)
    setPaused(false)
    setZoomOpen(false)
  }, [shots])

  useEffect(() => {
    if (paused || zoomOpen || shots.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % shots.length)
    }, SLIDE_HOLD_MS)
    return () => window.clearInterval(id)
  }, [paused, zoomOpen, shots.length])

  const selectShot = (i: number) => {
    setIndex(i)
    setPaused(true)
  }

  const openZoom = () => {
    setPaused(true)
    setZoomOpen(true)
  }

  const shot = shots[index] ?? shots[0]
  if (!shot) return null

  const src = gallerySrc(shot)
  const shape = galleryShotShape(shot, defaultShape)
  const isPhone = shape === 'phone'
  const alt = t(dict.demos.imageAltScreenOf, {
    title,
    index: index + 1,
    total: shots.length,
  })

  return (
    <div className="flex flex-col items-center gap-3 md:hidden">
      {shots.length > 1 ? (
        <div
          role="tablist"
          aria-label={t(dict.demos.screensAria, { title })}
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
                    ? t(dict.demos.showLabel, { label })
                    : t(dict.demos.showScreenOf, { index: i + 1, total: shots.length })
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
        onClick={openZoom}
        aria-label={t(dict.demos.openPhotoZoom, { title })}
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
              alt={alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 72vw, 260px"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </button>
      <p className="text-xs text-gray-400" aria-live="polite">
        {paused ? dict.demos.pausedHint : dict.demos.playHint}
      </p>

      {zoomOpen ? (
        <MobilePhotoZoom
          src={src}
          alt={alt}
          onClose={() => setZoomOpen(false)}
          closeLabel={dict.demos.closePhotoZoom}
          zoomHint={dict.demos.zoomHint}
        />
      ) : null}
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
  const { dict, t } = useLocale()

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
                      ? t(dict.demos.imageAltLabeled, { title, label })
                      : t(dict.demos.imageAltScreen, { title, index: index + 1 })
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
  const { dict, t, href } = useLocale()
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
            href={href('/pricing')}
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
          {t(dict.demos.visit, { name: project.shortTitle ?? project.title })}
        </a>
      </div>
    </div>
  )
}

export default function DemosPageClient() {
  const { dict, href, locale } = useLocale()
  const projects = useMemo(() => getProjects(dict, locale), [dict, locale])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && projects.some((p) => p.id === hash)) {
      setActiveId(hash)
    }
  }, [projects])

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
              {dict.demos.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-snug mb-4 max-w-xl">
              {dict.demos.intro}
            </p>

            <div
              role="tablist"
              aria-label={dict.demos.chooseProjectAria}
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
                  {dict.demos.wantLikeThis}
                </h2>
                <p className="text-sm text-gray-600 leading-snug mt-0.5">
                  {dict.demos.startOrEmail}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href={href('/introspect')}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-2.5 font-sans text-base font-bold tracking-tight shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28),0_2px_8px_-2px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer bg-[oklch(50%_0.09_198)] text-white ring-1 ring-[oklch(50%_0.09_198)/0.35] focus-visible:ring-[oklch(50%_0.09_198)/0.45] lg:bg-white lg:text-primary-800 lg:ring-primary-300/70 lg:focus-visible:ring-primary/40"
                >
                  <span className="relative inline-flex items-center gap-3">
                    <span className="relative z-0 hidden h-2 w-2 shrink-0 lg:block" aria-hidden>
                      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(58%_0.14_310)] shadow-[0_0_0_0_oklch(58%_0.14_310)] transition-[box-shadow] duration-200 ease-in-out group-hover:shadow-[0_0_0_220px_oklch(58%_0.14_310)] group-focus-visible:shadow-[0_0_0_220px_oklch(58%_0.14_310)]" />
                      <span className="relative z-20 block h-2 w-2 rounded-full bg-[oklch(58%_0.14_310)] transition-colors duration-200 ease-in-out group-hover:bg-white group-focus-visible:bg-white" />
                    </span>
                    <span className="relative z-10 lg:transition-colors lg:duration-200 lg:ease-in-out lg:group-hover:text-white lg:group-focus-visible:text-white">
                      {dict.demos.beginIntrospect}
                    </span>
                  </span>
                </Link>
                <Link
                  href={href('/contact')}
                  className="group flex flex-col items-center gap-1 rounded-md px-3 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                >
                  <span className="inline-flex text-gray-900 transition-colors duration-200 group-hover:text-gray-600">
                    <IconContact className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-semibold tracking-tight text-gray-900 group-hover:text-gray-600">
                    {dict.demos.contact}
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
