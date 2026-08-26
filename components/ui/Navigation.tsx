'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandNavLinks } from '@/components/ui/BrandNavLinks'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { stripLocale } from '@/lib/i18n/paths'
import { cn } from '@/lib/utils'

const SCROLL_IDLE_MS = 1100
/** Cinematic chrome (video players, fullscreen viewers): hide after ~2s of no pointer motion. */
const CURSOR_IDLE_MS = 2000
const AT_TOP_PX = 8

function pageScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0
}

function isAtPageTop() {
  return pageScrollY() <= AT_TOP_PX
}

function useSubpageNavVisibility(enabled: boolean, resetKey: string) {
  const [visible, setVisible] = useState(true)
  const heldRef = useRef(false)
  const atTopRef = useRef(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    atTopRef.current = isAtPageTop()
    setVisible(true)
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [resetKey])

  useEffect(() => {
    if (!enabled) return

    const clearTimer = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const scheduleHide = () => {
      clearTimer()
      if (heldRef.current || atTopRef.current) return
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        if (!heldRef.current && !atTopRef.current) setVisible(false)
      }, SCROLL_IDLE_MS)
    }

    const onScrollActivity = () => {
      atTopRef.current = isAtPageTop()
      setVisible(true)
      if (atTopRef.current) {
        clearTimer()
        return
      }
      scheduleHide()
    }

    atTopRef.current = isAtPageTop()
    document.addEventListener('scroll', onScrollActivity, { capture: true, passive: true })

    return () => {
      document.removeEventListener('scroll', onScrollActivity, true)
      clearTimer()
    }
  }, [enabled, resetKey])

  const hold = () => {
    heldRef.current = true
    setVisible(true)
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const release = () => {
    heldRef.current = false
    if (atTopRef.current) return
    if (timerRef.current != null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      if (!heldRef.current && !atTopRef.current) setVisible(false)
    }, SCROLL_IDLE_MS)
  }

  return { visible, hold, release }
}

function useCursorIdleNavVisibility(enabled: boolean, resetKey: string, frozen = false) {
  const [visible, setVisible] = useState(true)
  const heldRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const scheduleHide = () => {
    clearTimer()
    if (!enabledRef.current || heldRef.current) return
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      if (!heldRef.current && enabledRef.current) setVisible(false)
    }, CURSOR_IDLE_MS)
  }

  useEffect(() => {
    heldRef.current = false
    if (frozen) return
    setVisible(true)
    clearTimer()
  }, [resetKey, frozen])

  useEffect(() => {
    if (!enabled) {
      setVisible(true)
      clearTimer()
      return
    }
    if (frozen) {
      clearTimer()
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      setVisible(true)
      scheduleHide()
    }

    scheduleHide()
    window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove, true)
      clearTimer()
    }
  }, [enabled, resetKey, frozen])

  const hold = () => {
    heldRef.current = true
    setVisible(true)
    clearTimer()
  }

  const release = () => {
    heldRef.current = false
    scheduleHide()
  }

  return { visible, hold, release }
}

/**
 * Cursor-idle hide is desktop-mouse only. Default false so SSR / phones /
 * iPads never start the hide timer (the old max-lg hook hydrated as desktop).
 */
function useDesktopCursorNav() {
  const [desktopCursor, setDesktopCursor] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
    )
    const sync = () => setDesktopCursor(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return desktopCursor
}

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
  const barePath = stripLocale(pathname || '/')
  const onHome = barePath === '/'
  const onIntrospect = barePath === '/introspect' || barePath === '/redesign'
  const [successLock, setSuccessLock] = useState(false)

  useEffect(() => {
    if (!onIntrospect) {
      setSuccessLock(false)
      return
    }
    const root = document.documentElement
    const sync = () => setSuccessLock(root.dataset.introspect === 'success')
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-introspect'] })
    return () => observer.disconnect()
  }, [onIntrospect])

  const desktopCursor = useDesktopCursorNav()
  // Touch / narrow viewports have no cursor to revive chrome — keep the bar pinned.
  const scrollNav = useSubpageNavVisibility(!onHome && !onIntrospect, pathname || '/')
  const idleNav = useCursorIdleNavVisibility(
    onIntrospect && desktopCursor,
    pathname || '/',
    successLock
  )
  const { visible, hold, release } = onIntrospect ? idleNav : scrollNav
  const navVisible = onIntrospect && !desktopCursor ? true : visible

  // Landing uses its own brand chrome — no global nav
  if (onHome) return null

  return (
    <>
      <header
        onMouseEnter={hold}
        onMouseLeave={release}
        onFocus={hold}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            release()
          }
        }}
        className={cn(
          'site-nav fixed top-0 left-0 right-0 z-50 bg-paper/85 backdrop-blur-md',
          'transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          navVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none max-lg:!translate-y-0 max-lg:!opacity-100 max-lg:!pointer-events-auto'
        )}
      >
        <nav className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
          <div className={`flex w-full min-w-0 items-start justify-between gap-x-1 pt-3 sm:items-center sm:pt-0 ${SITE_NAV_HEIGHT_CLASS}`}>
            <Link
              href={href('/')}
              className="relative z-10 flex shrink-0 cursor-pointer items-center self-start group sm:self-center"
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

            {/* Mobile: fill leftover space evenly. Desktop: cluster on the right. */}
            <div className="min-w-0 flex-1 sm:flex-none">
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
