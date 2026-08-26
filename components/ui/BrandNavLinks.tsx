'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { stripLocale } from '@/lib/i18n/paths'
import { cn } from '@/lib/utils'

/** Shared ink-sketch stroke — round caps, slightly heavy for small sizes. */
const sk = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.85,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function IconIntrospect({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      {/* Sketchy ? */}
      <path
        {...sk}
        d="M6.8 10.8c.2-3.4 2.6-5.6 5.2-5.4 2.8.2 4.6 2.4 4.5 5-.1 2.6-1.9 3.4-3.6 4.4-1.4.8-2.4 1.7-2.3 3.8v.9"
      />
      {/* Ink blot period */}
      <path
        fill="currentColor"
        stroke="none"
        d="M10.2 23.8c.1-1.1 1-1.8 2-1.7 1 .1 1.7 1 1.6 2-.1 1-1.1 1.7-2 1.6-.9-.1-1.6-1-1.6-1.9z"
      />
      {/* Sketchy check — slightly crooked */}
      <path {...sk} d="M17.8 16.2c1.4 1.2 2.8 2.6 3.8 3.4 2.2-3.2 4.6-6.4 7.2-8.8" />
    </svg>
  )
}

function IconProjects({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      {/* Back window — uneven rect */}
      <path
        {...sk}
        d="M5.2 9.2c-.2-.8.4-1.6 1.3-1.7l13.8-.6c.9-.1 1.7.6 1.8 1.5l.5 10.2c.1.9-.6 1.7-1.5 1.8l-13.6.8c-.9.1-1.7-.6-1.8-1.5L5.2 9.2z"
      />
      {/* Front window — offset, imperfect */}
      <path
        {...sk}
        d="M11.8 12.6c-.1-.7.5-1.4 1.2-1.5l14-.8c.8-.1 1.5.6 1.6 1.3l.7 11c.1.8-.5 1.5-1.3 1.6l-13.8.9c-.8.1-1.6-.5-1.7-1.3l-.7-11.2z"
      />
      {/* Title bar scribble */}
      <path {...sk} strokeWidth={1.55} d="M12.4 15.4c4.6-.3 9.2-.5 14.2-.8" />
    </svg>
  )
}

function IconPricing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      {/* Stem — not perfectly straight */}
      <path {...sk} d="M15.6 3.8c.3 3.8.5 8.2.4 12.4.1 3.6.2 7.2.5 10.6" />
      {/* Sketchy S of dollar */}
      <path
        {...sk}
        d="M21.4 9.2c.1-2.8-2.4-4.8-5.2-4.6-2.9.2-5 2.2-4.9 4.6.2 3.4 4.2 3.2 7.2 4.6 3.2 1.5 4.2 3.4 3.8 5.8-.5 2.9-3 4.8-6.1 4.6-3-.2-5.2-2.2-5.4-4.8"
      />
    </svg>
  )
}

function IconAbout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      {/* Head — imperfect oval */}
      <path
        {...sk}
        d="M16.2 5.4c2.6-.3 5.2 1.6 5.4 4.4.2 2.6-1.8 5-4.5 5.2-2.8.2-5.3-1.8-5.4-4.5-.2-2.8 2-5 4.5-5.1z"
      />
      {/* Shoulders — loose arc */}
      <path
        {...sk}
        d="M7.8 26.4c.4-4.6 3.6-7.8 8.2-7.9 4.4-.1 8.2 2.8 8.8 7.4"
      />
    </svg>
  )
}

export function IconContact({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      {/* Envelope — corners overshoot a bit */}
      <path
        {...sk}
        d="M4.8 9.4c-.2-.7.3-1.4 1-1.5l20.6-1.2c.8-.1 1.5.6 1.5 1.4l.6 13.6c0 .8-.6 1.5-1.4 1.5H6.2c-.8 0-1.5-.6-1.5-1.4L4.8 9.4z"
      />
      {/* Flap — slightly crooked V */}
      <path {...sk} d="M5.6 9.2c3.6 3.2 7.2 5.8 10.6 7.2 3.2-1.6 7-4.4 10.8-7.6" />
    </svg>
  )
}

const NAV_DEFS = [
  { href: '/contact', key: 'contact' as const, icon: IconContact, match: '/contact' },
  { href: '/introspect', key: 'introspect' as const, icon: IconIntrospect, match: '/introspect' },
  { href: '/demos', key: 'projects' as const, icon: IconProjects, match: '/demos' },
  { href: '/pricing', key: 'pricing' as const, icon: IconPricing, match: '/pricing' },
  { href: '/about', key: 'about' as const, icon: IconAbout, match: '/about' },
] as const

const LANDING_KEYS = new Set(['contact', 'introspect', 'projects', 'pricing', 'about'])

type BrandNavLinksProps = {
  variant?: 'landing' | 'subpage'
  className?: string
  iconSize?: string
  onNavigate?: () => void
}

export function BrandNavLinks({
  variant = 'subpage',
  className = '',
  iconSize,
  onNavigate,
}: BrandNavLinksProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { dict, href: localizedHref } = useLocale()
  const barePath = stripLocale(pathname || '/')

  const items = NAV_DEFS.filter((item) =>
    variant === 'landing' ? LANDING_KEYS.has(item.key) : true
  ).map((item) => ({
    ...item,
    label: dict.nav[item.key],
    href: localizedHref(item.href),
  }))

  const resolvedIconSize =
    iconSize ??
    (variant === 'landing'
      ? 'h-5 w-5 lg:h-6 lg:w-6 max-lg:[&>path]:[stroke-width:2.25]'
      : 'h-4 w-4')

  useEffect(() => {
    for (const item of items) {
      if (item.href.startsWith('/')) router.prefetch(item.href)
    }
  }, [items, router])

  return (
    <div
      className={cn(
        variant === 'landing'
          ? 'grid w-full min-w-0 grid-cols-6 items-start justify-items-center gap-x-0 sm:gap-x-2 lg:gap-x-3'
          : 'grid w-full min-w-0 grid-cols-6 items-start justify-items-center gap-x-0 sm:flex sm:w-auto sm:items-center sm:gap-x-10',
        className
      )}
    >
      <div
        className={
          variant === 'subpage'
            ? 'contents sm:flex sm:items-center sm:gap-x-6'
            : 'contents'
        }
      >
        {items.map(({ href, label, icon: Icon, match }) => {
          const active =
            variant === 'subpage' &&
            (barePath === match ||
              barePath.startsWith(`${match}/`) ||
              (match === '/introspect' && barePath === '/redesign'))

          const linkClass =
            variant === 'landing'
              ? 'group flex min-w-0 w-full flex-col items-center gap-1.5 text-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
              : 'group flex min-w-0 w-full flex-col items-center gap-0.5 text-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 sm:w-auto'

          const labelClass =
            variant === 'landing'
              ? 'text-[0.75rem] leading-none tracking-tight sm:text-[0.8125rem] sm:leading-normal lg:text-[0.9375rem] font-bold text-gray-900 group-hover:text-gray-700 whitespace-nowrap'
              : 'text-[0.5625rem] sm:text-[0.625rem] font-medium tracking-tight text-gray-900 group-hover:text-gray-600 whitespace-nowrap'

          return (
            <Link
              key={match}
              href={href}
              prefetch
              aria-current={active ? 'page' : undefined}
              className={linkClass}
              onClick={() => onNavigate?.()}
            >
              <span className="inline-flex text-gray-900 transition-colors duration-200 group-hover:text-gray-600">
                <Icon className={resolvedIconSize} />
              </span>
              <span className={labelClass}>{label}</span>
            </Link>
          )
        })}
      </div>
      <LanguageToggle
        variant={variant}
        className={variant === 'subpage' ? 'w-full sm:w-auto' : undefined}
      />
    </div>
  )
}

/** @deprecated Prefer dict.nav — kept for any stray imports */
export const BRAND_NAV_ITEMS = NAV_DEFS
export const LANDING_NAV_ITEMS = NAV_DEFS.filter((i) => LANDING_KEYS.has(i.key))
