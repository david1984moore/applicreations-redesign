/**
 * How it works cinema: play once per JavaScript lifetime.
 *
 * An in-memory flag survives Next.js client navigations (home → other page →
 * home shows the finale). A refresh tears down the JS heap, so the cinema
 * plays again — including refresh-on-/about then click home.
 */

let playedThisLoad = false
/** Skip cinema AND recap stagger — resting three points + Get Started. */
let staticFinaleThisLoad = false

const LEGACY_SESSION_KEY = 'applicreations:hiw-cinema-played'

function dropLegacySessionFlag() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(LEGACY_SESSION_KEY)
  } catch {
    /* private mode / blocked storage */
  }
}

export function hasPlayedHiwCinema(): boolean {
  return playedThisLoad
}

export function markHiwCinemaPlayed() {
  playedThisLoad = true
  dropLegacySessionFlag()
}

/** After Introspect success: land on the resting finale, no cinema. */
export function requestStaticHiwFinale() {
  playedThisLoad = true
  staticFinaleThisLoad = true
  dropLegacySessionFlag()
}

export function shouldUseStaticHiwFinale(): boolean {
  return staticFinaleThisLoad
}
