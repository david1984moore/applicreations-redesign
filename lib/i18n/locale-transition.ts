/**
 * Soft locale switches: preserve scroll and skip entrance animations so
 * `/` ↔ `/es` (and subpages) don't flash or jump.
 *
 * Uses sessionStorage so the flag survives loading.tsx → page remounts.
 */

const SCROLL_KEY = 'applicreations:locale-scroll'
const SKIP_KEY = 'applicreations:locale-skip-intro'

export function beginLocaleTransition() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      SCROLL_KEY,
      String(window.scrollY || window.pageYOffset || 0)
    )
    sessionStorage.setItem(SKIP_KEY, '1')
  } catch {
    /* private mode / blocked storage */
  }
}

/** True while a locale navigation should skip entrance motion. */
export function isLocaleTransition(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(SKIP_KEY) === '1'
  } catch {
    return false
  }
}

/** Restore scroll and schedule clearing the skip flag after mounts settle. */
export function endLocaleTransition(): number {
  if (typeof window === 'undefined') return 0
  let y = 0
  try {
    y = Number(sessionStorage.getItem(SCROLL_KEY) || 0)
    sessionStorage.removeItem(SCROLL_KEY)
    // Keep SKIP_KEY briefly so loading → real page can still read it
    window.setTimeout(() => {
      try {
        sessionStorage.removeItem(SKIP_KEY)
      } catch {
        /* ignore */
      }
    }, 400)
  } catch {
    /* ignore */
  }
  return y
}
