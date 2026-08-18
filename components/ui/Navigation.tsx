'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { stripLocale } from '@/lib/i18n/paths'

/**
 * Keep in sync with spacer + page scroll offsets.
 * In this design system h-12 = --spacing-12 = 6rem (not Tailwind’s default 3rem).
 */
export const SITE_NAV_HEIGHT_CLASS = 'h-12'
/**
 * Viewport height minus the nav spacer and site footer —
 * use for no-scroll subpages. Keep footer offset in sync with SiteFooter.
 */
export const SITE_VIEWPORT_BELOW_NAV_CLASS =
  'h-[calc(100svh-var(--spacing-12)-1.75rem)]'

export function Navigation() {
  const pathname = usePathname()
  const { dict, href } = useLocale()
  const onHome = stripLocale(pathname || '/') === '/'

  // Landing uses its own brand chrome — no global nav
  if (onHome) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper/85 backdrop-blur-md">
        <nav className="max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${SITE_NAV_HEIGHT_CLASS}`}>
            <Link
              href={href('/')}
              className="relative flex items-center cursor-pointer group z-10 shrink-0"
              aria-label={dict.nav.homeAria}
            >
              <Image
                src="/logo-mark.png"
                alt={dict.brand.name}
                width={40}
                height={40}
                className="relative z-10 h-9 w-9 object-contain"
                priority
              />
              {/* Soft ground shadow — oval under the mark; umbra biased left */}
              <svg
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[calc(100%+1px)] z-0 h-3.5 w-10 -translate-x-[46%] overflow-visible"
                viewBox="0 0 40 14"
              >
                <defs>
                  <filter
                    id="nav-mark-shadow-blur"
                    x="-50%"
                    y="-80%"
                    width="200%"
                    height="260%"
                  >
                    <feGaussianBlur stdDeviation="1.4" />
                  </filter>
                  <radialGradient
                    id="nav-mark-shadow-grad"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="32%"
                    fy="45%"
                  >
                    <stop offset="0%" stopColor="rgb(32 28 24)" stopOpacity="0.6" />
                    <stop offset="16%" stopColor="rgb(32 28 24)" stopOpacity="0.48" />
                    <stop offset="50%" stopColor="rgb(32 28 24)" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="rgb(32 28 24)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse
                  cx="20"
                  cy="7"
                  rx="18.5"
                  ry="6"
                  fill="url(#nav-mark-shadow-grad)"
                  filter="url(#nav-mark-shadow-blur)"
                />
              </svg>
            </Link>

            {/* Always-visible links (mobile + desktop). No hamburger / dropdown on subpages. */}
            <div className="shrink-0">
              <BrandNavLinks variant="subpage" />
            </div>
          </div>
        </nav>
      </header>

      {/* Reserves space under the fixed bar so content is never clipped */}
      <div className={SITE_NAV_HEIGHT_CLASS} aria-hidden />
    </>
  )
}
