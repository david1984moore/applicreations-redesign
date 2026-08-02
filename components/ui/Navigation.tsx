'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { IntrospectButton } from '@/components/ui/IntrospectButton'

const NAV_ITEMS = [
  { label: 'Work', href: '/demos' },
  { label: 'Contact', href: '/contact' },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const onHome = pathname === '/'
  const onContact = pathname.startsWith('/contact')
  const onWork = pathname.startsWith('/demos')
  const navItems = NAV_ITEMS.filter(
    (item) =>
      !(onWork && item.href === '/demos') && !(onContact && item.href === '/contact')
  )

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const goToSection = (href: string) => {
    if (href.startsWith('/') && !href.startsWith('/#')) {
      router.push(href)
      setMobileOpen(false)
      return
    }

    const hash = href.includes('#') ? href.slice(href.indexOf('#')) : href
    if (!onHome) {
      router.push(`/${hash}`)
      setMobileOpen(false)
      return
    }

    const element = document.getElementById(hash.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    setMobileOpen(false)
  }

  // Landing + contact use their own brand chrome — no global nav
  if (onHome || onContact) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/85 backdrop-blur-md border-b border-gray-200/60">
      <nav className="max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8 md:h-9">
          <Link
            href="/"
            className="flex items-center cursor-pointer group z-10"
            onClick={() => setMobileOpen(false)}
            aria-label="Applicreations home"
          >
            <Image
              src="/logo-mark.png"
              alt="Applicreations"
              width={28}
              height={28}
              className="h-6 w-6 md:h-7 md:w-7"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => goToSection(item.href)}
                className="cursor-pointer text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <IntrospectButton
              variant="primary"
              size="sm"
              className="!h-7 !min-h-0 !min-w-0 px-3 text-xs cursor-pointer"
              href={onHome ? '#introspect' : '/#introspect'}
              onClick={() => goToSection('#introspect')}
              popoverSide="bottom"
            />
          </div>

          <button
            type="button"
            className="md:hidden z-10 inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-800 hover:bg-sand/70 cursor-pointer"
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
            className="md:hidden border-t border-gray-200 bg-paper/98 backdrop-blur-md"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => goToSection(item.href)}
                  className="cursor-pointer text-left px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-sand/50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
