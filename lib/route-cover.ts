/**
 * Full-viewport cover that persists across a client navigation.
 * Used so Introspect success can fade the whole page (including site nav)
 * before the landing chrome mounts, then lift the cover on the resting home.
 */

type Listener = (covered: boolean) => void

const listeners = new Set<Listener>()
let covered = false

function emit() {
  for (const fn of listeners) fn(covered)
}

export function getRouteCovered() {
  return covered
}

export function subscribeRouteCover(fn: Listener) {
  listeners.add(fn)
  fn(covered)
  return () => {
    listeners.delete(fn)
  }
}

export function setRouteCovered(next: boolean) {
  if (covered === next) return
  covered = next
  emit()
}

export function coverRoute(durationMs: number): Promise<void> {
  setRouteCovered(true)
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs)
  })
}

export function uncoverRoute(afterMs = 50) {
  window.setTimeout(() => setRouteCovered(false), afterMs)
}
