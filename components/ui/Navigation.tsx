'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === '/'

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

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
              onClick={() => setMobileOpen(false)}
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

            <div className="hidden md:flex items-center gap-4 sm:gap-5">
              <BrandNavLinks variant="subpage" onNavigate={() => setMobileOpen(false)} />
            </div>

            <button
              type="button"
              className="z-10 inline-flex md:hidden items-center justify-center rounded-md h-8 w-8 text-gray-800 hover:bg-sand/70 cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <div className="relative w-4 h-3">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform ${
                    mobileOpen ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity ${
                    mobileOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[10px] h-0.5 w-4 bg-current transition-transform ${
                    mobileOpen ? '-translate-y-[5px] -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-paper/98 backdrop-blur-md"
            >
              <div className="px-4 py-3 flex items-center justify-center gap-4 sm:gap-5">
                <BrandNavLinks variant="subpage" onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Reserves space under the fixed bar so content is never clipped */}
      <div className={SITE_NAV_HEIGHT_CLASS} aria-hidden />
    </>
  )
}
