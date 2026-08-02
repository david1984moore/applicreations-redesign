'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'

/**
 * Keep in sync with spacer + page scroll offsets.
 * In this design system h-12 = --spacing-12 = 6rem (not Tailwind’s default 3rem).
 */
export const SITE_NAV_HEIGHT_CLASS = 'h-12'
/** Viewport height minus the nav spacer — use for no-scroll subpages */
export const SITE_VIEWPORT_BELOW_NAV_CLASS =
  'h-[calc(100svh-var(--spacing-12))]'

export function Navigation() {
  const pathname = usePathname()
  const onHome = pathname === '/'

  // Landing uses its own brand chrome — no global nav
  if (onHome) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper/85 backdrop-blur-md">
        <nav className="max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${SITE_NAV_HEIGHT_CLASS}`}>
            <Link
              href="/"
              className="flex items-center cursor-pointer group z-10 shrink-0"
              aria-label="Applicreations home"
            >
              <Image
                src="/logo-mark.png"
                alt="Applicreations"
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
                priority
              />
            </Link>

            {/* Always-visible links (mobile + desktop). No hamburger / dropdown on subpages. */}
            <div className="flex items-center gap-3 sm:gap-5">
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
