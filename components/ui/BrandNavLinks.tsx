'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { stripLocale } from '@/lib/i18n/paths'
import { cn } from '@/lib/utils'

function IconIntrospect({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M6.2 11.2c0-3.1 2.3-5.2 4.8-5.2s4.8 2.1 4.8 4.8c0 2.4-1.6 3.5-3.2 4.4-1.3.7-2.1 1.6-2.1 3.5v1.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="24.6" r="1.45" fill="currentColor" />
      <path
        d="M18.5 15.5 22.2 19.2 28.2 11.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconProjects({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="4.5" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <rect x="11.5" y="12" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M11.5 15.5h16" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function IconPricing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 3.5v23"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M21 9.5c0-2.5-2.2-4.5-5-4.5s-5 2-5 4.5c0 3.8 10 2.2 10 8.5 0 2.5-2.2 4.5-5 4.5s-5-2-5-4.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconAbout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="10.5" r="4.2" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M8.5 26c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconContact({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="4.5" y="8.5" width="23" height="15" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M5.5 10.5 16 17.5 26.5 10.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

const NAV_DEFS = [
  { href: '/introspect', key: 'introspect' as const, icon: IconIntrospect, match: '/introspect' },
  { href: '/demos', key: 'projects' as const, icon: IconProjects, match: '/demos' },
  { href: '/pricing', key: 'pricing' as const, icon: IconPricing, match: '/pricing' },
  { href: '/about', key: 'about' as const, icon: IconAbout, match: '/about' },
  { href: '/contact', key: 'contact' as const, icon: IconContact, match: '/contact' },
] as const

/** Landing page items — no Pricing (section + full pricing details link on board) */
const LANDING_KEYS = new Set(['introspect', 'projects', 'about', 'contact'])

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
    iconSize ?? (variant === 'landing' ? 'h-5 w-5 lg:h-6 lg:w-6' : 'h-4 w-4')

  useEffect(() => {
    for (const item of items) {
      if (item.href.startsWith('/')) router.prefetch(item.href)
    }
  }, [items, router])

  return (
    <div className={cn('contents', className)}>
      {items.map(({ href, label, icon: Icon, match }) => {
        const active =
          variant === 'subpage' &&
          (barePath === match || barePath.startsWith(`${match}/`))

        const linkClass =
          variant === 'landing'
            ? 'group flex flex-col items-center gap-1.5 text-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
            : cn(
                'group flex flex-col items-center gap-0.5 text-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                active && 'hidden'
              )

        const labelClass =
          variant === 'landing'
            ? 'text-[0.8125rem] lg:text-[0.9375rem] font-bold tracking-tight text-gray-900 group-hover:text-gray-700'
            : 'text-[0.625rem] font-medium tracking-tight text-gray-900 group-hover:text-gray-600'

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
      <LanguageToggle variant={variant} />
    </div>
  )
}

/** @deprecated Prefer dict.nav — kept for any stray imports */
export const BRAND_NAV_ITEMS = NAV_DEFS
export const LANDING_NAV_ITEMS = NAV_DEFS.filter((i) => LANDING_KEYS.has(i.key))
