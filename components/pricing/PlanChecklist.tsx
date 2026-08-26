'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { IncludedMark } from '@/components/pricing/PlanMarks'
import type { PlanChecklistItem } from '@/lib/pricing'
import { cn } from '@/lib/utils'

/** First-visit default: Basic “1–2 pages” is the only open feature. */
const DEFAULT_REVEAL_PLAN = 'basic'
const DEFAULT_REVEAL_ICON = 'pages-1-2'

type FeatureReveal = { planId: string; icon: string }

const FeatureRevealContext = createContext<{
  reveal: FeatureReveal | null
  select: (next: FeatureReveal) => void
} | null>(null)

export function PlanFeatureRevealProvider({
  children,
  defaultReveal,
}: {
  children: ReactNode
  defaultReveal?: FeatureReveal | null
}) {
  const [reveal, setReveal] = useState<FeatureReveal | null>(
    defaultReveal === undefined
      ? { planId: DEFAULT_REVEAL_PLAN, icon: DEFAULT_REVEAL_ICON }
      : defaultReveal
  )
  const select = useCallback((next: FeatureReveal) => {
    setReveal(next)
  }, [])
  const value = useMemo(() => ({ reveal, select }), [reveal, select])
  return (
    <FeatureRevealContext.Provider value={value}>
      {children}
    </FeatureRevealContext.Provider>
  )
}

/** Landing glance list — always three rows so the pricing card never resizes. */
const CHECKLIST_MAX_ROWS = 3
const CHECKLIST_ROW =
  'flex min-w-0 items-center gap-2.5 overflow-visible text-[0.75rem] leading-[1.125rem] text-gray-900 h-[1.125rem] sm:text-[0.8125rem]'
const FLIP_FACE =
  'absolute inset-0 flex min-w-0 items-center gap-2.5 [backface-visibility:hidden]'

/** Filled board sits, then row 2 flips; later waves wait longer. */
const INITIAL_HOLD_MS = 3200
const HOLD_MS = 8500
const FLIP_HALF_S = 0.28
const FLIP_MS = FLIP_HALF_S * 2 * 1000
const COLUMN_STAGGER_MS: Record<string, number> = {
  starter: 0,
  basic: 260,
  business: 520,
  pro: 780,
}
const MAX_COLUMN_STAGGER_MS = 780

type VisualRow = 1 | 2 | 3
type RowTicks = Record<VisualRow, number>

const LandingCycleContext = createContext<{
  tick: RowTicks
} | null>(null)

/** Shared clocks so row 2 (then row 3) flip together across all four packages. */
export function LandingFeatureCycleProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const [tick, setTick] = useState<RowTicks>({ 1: 0, 2: 0, 3: 0 })

  useEffect(() => {
    if (prefersReducedMotion) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms)
      })

    const flipRow = async (row: VisualRow) => {
      if (cancelled) return
      setTick((current) => ({ ...current, [row]: current[row] + 1 }))
      await wait(FLIP_MS + MAX_COLUMN_STAGGER_MS + 60)
    }

    const run = async () => {
      await wait(INITIAL_HOLD_MS)
      while (!cancelled) {
        await flipRow(2)
        if (cancelled) return
        await wait(HOLD_MS)
        if (cancelled) return
        await flipRow(3)
        if (cancelled) return
        await wait(HOLD_MS)
      }
    }

    void run()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [prefersReducedMotion])

  const value = useMemo(() => ({ tick }), [tick])
  return (
    <LandingCycleContext.Provider value={value}>{children}</LandingCycleContext.Provider>
  )
}

function CheckLabel({
  text,
  emphasis = false,
  sizer = false,
}: {
  text: string
  emphasis?: boolean
  sizer?: boolean
}) {
  return (
    <>
      <IncludedMark
        className="size-[0.72rem] text-[oklch(74%_0.24_146)]"
        strokeWidth={6}
      />
      <span
        className={cn(
          'inline-block overflow-visible pb-px text-left leading-[1.125rem] whitespace-nowrap',
          !sizer && 'min-w-0',
          emphasis ? 'font-semibold' : 'font-normal'
        )}
      >
        {text}
      </span>
    </>
  )
}

function dealToSlots(items: string[], slotCount: number): string[][] {
  const slots = Array.from({ length: slotCount }, () => [] as string[])
  items.forEach((item, i) => slots[i % slotCount].push(item))
  return slots
}

function RotatingCheckSlot({
  items,
  visualRow,
  staggerMs,
  staticFallback,
}: {
  items: string[]
  visualRow: VisualRow
  staggerMs: number
  staticFallback: boolean
}) {
  const cycle = useContext(LandingCycleContext)
  const tick = cycle?.tick[visualRow] ?? 0
  const [rest, setRest] = useState(items[0] ?? '')
  const [flip, setFlip] = useState<{ from: string; to: string } | null>(null)
  const [incoming, setIncoming] = useState(false)
  const tickRef = useRef(tick)
  const restRef = useRef(rest)
  const itemsRef = useRef(items)
  restRef.current = rest
  itemsRef.current = items

  useEffect(() => {
    if (staticFallback || itemsRef.current.length <= 1) return
    if (tick === tickRef.current) return
    const list = itemsRef.current
    const next = list[tick % list.length]
    const from = restRef.current
    if (!next || next === from) {
      tickRef.current = tick
      if (next) setRest(next)
      return
    }

    const timer = setTimeout(() => {
      tickRef.current = tick
      setIncoming(false)
      setFlip({ from, to: next })
    }, staggerMs)
    return () => clearTimeout(timer)
  }, [staticFallback, staggerMs, tick])

  useEffect(() => {
    if (!flip) return
    const timer = setTimeout(() => {
      setRest(flip.to)
      setFlip(null)
      setIncoming(false)
    }, FLIP_MS + 80)
    return () => clearTimeout(timer)
  }, [flip])

  const finishFlip = () => {
    setFlip((current) => {
      if (current) setRest(current.to)
      return null
    })
    setIncoming(false)
  }

  if (!items[0]) return <li className={CHECKLIST_ROW} aria-hidden />

  if (staticFallback || items.length === 1 || !cycle) {
    return (
      <li className={CHECKLIST_ROW}>
        <CheckLabel text={items[0]} />
      </li>
    )
  }

  if (flip) {
    return (
      <li className={cn(CHECKLIST_ROW, 'relative w-full overflow-hidden')}>
        <div className="absolute inset-0" style={{ perspective: 220 }}>
          {!incoming ? (
            <motion.div
              aria-hidden
              className={FLIP_FACE}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 90 }}
              transition={{
                duration: FLIP_HALF_S,
                ease: [0.55, 0.06, 0.9, 0.19],
              }}
              style={{ transformOrigin: '50% 100%' }}
              onAnimationComplete={() => setIncoming(true)}
            >
              <CheckLabel text={flip.from} />
            </motion.div>
          ) : (
            <motion.div
              className={FLIP_FACE}
              initial={{ rotateX: -95 }}
              animate={{ rotateX: 0 }}
              transition={{
                duration: FLIP_HALF_S,
                ease: [0.16, 0.72, 0.28, 1],
              }}
              style={{ transformOrigin: '50% 0%' }}
              onAnimationComplete={finishFlip}
            >
              <CheckLabel text={flip.to} />
            </motion.div>
          )}
        </div>
      </li>
    )
  }

  return (
    <li className={CHECKLIST_ROW}>
      <CheckLabel text={rest} />
    </li>
  )
}

/** Sequential fade: out → brief blank → in. Fast enough to scan. */
const REVEAL_OUT_S = 0.11
const REVEAL_GAP_S = 0.03
const REVEAL_IN_S = 0.18
const REVEAL_EASE = [0.4, 0, 0.2, 1] as const
/** Keep last-item copy above the What’s included divider. */
const DESC_BOTTOM_GUTTER_PX = 8
/** Non-first items: lift so the first description line sits just above the selected row. */
const DESC_NUDGE_UP_RATIO = 0.85

const PURPLE_WASH = 'bg-[oklch(96%_0.04_295)]'
const DESCRIPTION_INK = 'text-[oklch(38%_0.12_295)]'

function isStructured(
  items: string[] | PlanChecklistItem[]
): items is PlanChecklistItem[] {
  return items.length > 0 && typeof items[0] !== 'string'
}

function DetailBody({ item }: { item: PlanChecklistItem }) {
  return (
    <p
      className={cn(
        'px-1.5 py-[clamp(0.06rem,0.2vh,0.14rem)] text-center font-sans font-normal text-[clamp(0.9rem,1.45vh,1.05rem)] leading-snug text-pretty',
        DESCRIPTION_INK
      )}
    >
      {item.description}
    </p>
  )
}

function LandingChecklist({
  items,
  planId,
  className,
}: {
  items: string[]
  planId?: string
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const pinPageCount = planId !== 'pro'
  const pinned = pinPageCount ? items[0] : undefined
  const rotating = useMemo(
    () => (pinPageCount ? items.slice(1) : items),
    [items, pinPageCount]
  )
  const slotCount = pinned ? CHECKLIST_MAX_ROWS - 1 : CHECKLIST_MAX_ROWS
  const slots = useMemo(
    () => dealToSlots(rotating, slotCount),
    [rotating, slotCount]
  )
  const freeze = Boolean(prefersReducedMotion)

  if (items.length === 0) return null

  const sizerItems = pinned ? [pinned, ...rotating] : rotating

  return (
    <div
      className={cn(
        'mx-auto grid max-w-full grid-cols-[max-content] justify-center',
        className
      )}
    >
      <div aria-hidden className="h-0 w-max overflow-visible">
        {sizerItems.map((item) => (
          <div key={item} className={cn(CHECKLIST_ROW, 'invisible')}>
            <CheckLabel text={item} emphasis={item === pinned} sizer />
          </div>
        ))}
      </div>
      <ul
        className="flex w-full min-w-0 flex-col gap-1 lg:gap-[0.35rem]"
        aria-label={items.join(', ')}
      >
        {pinned ? (
          <li className={CHECKLIST_ROW}>
            <CheckLabel text={pinned} emphasis />
          </li>
        ) : null}
        {slots.map((slotItems, slotIndex) => {
          const visualRow = (pinned ? 2 + slotIndex : 1 + slotIndex) as VisualRow
          return (
            <RotatingCheckSlot
              key={`slot-${slotIndex}`}
              items={slotItems}
              visualRow={visualRow}
              staggerMs={COLUMN_STAGGER_MS[planId ?? ''] ?? 0}
              staticFallback={freeze}
            />
          )
        })}
      </ul>
    </div>
  )
}

function itemButtonClass(active: boolean, emphasis = false) {
  return cn(
    'flex w-full cursor-pointer items-center rounded-sm px-1.5 py-[clamp(0.06rem,0.2vh,0.14rem)] text-left text-[clamp(0.8rem,1.2vh,0.875rem)] leading-tight text-gray-900',
    emphasis ? 'font-extrabold' : 'font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(52%_0.16_295/0.35)]',
    active ? PURPLE_WASH : 'hover:bg-[oklch(97%_0.02_295)]'
  )
}

function RevealChecklist({
  items,
  lead,
  planId,
  className,
}: {
  items: PlanChecklistItem[]
  lead?: string
  planId?: string
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const baseId = useId()
  const shared = useContext(FeatureRevealContext)
  const [localActive, setLocalActive] = useState<number | null>(
    planId === DEFAULT_REVEAL_PLAN
      ? Math.max(
          0,
          items.findIndex((item) => item.icon === DEFAULT_REVEAL_ICON)
        )
      : null
  )
  const listRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const [descStyle, setDescStyle] = useState<CSSProperties>({ top: 0 })

  const active = shared
    ? shared.reveal && shared.reveal.planId === planId
      ? items.findIndex((item) => item.icon === shared.reveal?.icon)
      : -1
    : localActive ?? -1

  const selectItem = (index: number) => {
    const item = items[index]
    if (!item) return
    if (shared && planId) {
      shared.select({ planId, icon: item.icon })
      return
    }
    setLocalActive(index)
  }

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const place = () => {
      const desc = descRef.current
      const button = list.querySelector<HTMLElement>(`[role="tab"][aria-selected="true"]`)
      if (!desc || !button) return

      const listHeight = list.clientHeight
      const descHeight = Math.max(desc.offsetHeight, desc.scrollHeight)
      const rowTop =
        button.getBoundingClientRect().top - list.getBoundingClientRect().top
      const firstTab = list.querySelector<HTMLElement>('[role="tab"]')
      const isFirst = firstTab === button
      const nudge = isFirst ? 0 : Math.round(button.offsetHeight * DESC_NUDGE_UP_RATIO)
      const preferred = rowTop - nudge
      const maxTop = Math.max(0, listHeight - descHeight - DESC_BOTTOM_GUTTER_PX)
      setDescStyle({ top: Math.min(Math.max(0, preferred), maxTop) })
    }

    place()
    const frame = requestAnimationFrame(place)
    const ro = new ResizeObserver(place)
    ro.observe(list)
    if (descRef.current) ro.observe(descRef.current)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
  }, [active, items])

  if (items.length === 0) return null

  const activeItem = active >= 0 ? items[active] : undefined

  return (
    <div className={cn('min-w-0', className)}>
      {lead ? (
        <p className="mb-1 shrink-0 text-sm font-extrabold leading-snug text-gray-900">
          {lead}
        </p>
      ) : null}

      <div className="grid grid-cols-[minmax(6.75rem,0.46fr)_minmax(0,1fr)] items-stretch gap-x-1.5">
        <div
          ref={listRef}
          role="tablist"
          aria-orientation="vertical"
          className="flex min-w-0 flex-col gap-px"
        >
          {items.map((item, index) => {
            const selected = active === index
            return (
              <button
                key={`${item.icon}-${item.term}`}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected || (active < 0 && index === 0) ? 0 : -1}
                className={itemButtonClass(selected, item.emphasis)}
                onClick={() => selectItem(index)}
              >
                <span className="flex min-w-0 flex-col">
                  <span>{item.term}</span>
                  {item.example ? (
                    <span className="mt-0.5 font-normal text-[clamp(0.7rem,1.05vh,0.75rem)] leading-snug text-gray-500">
                      {item.example}
                    </span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative h-full min-h-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {activeItem ? (
              <motion.div
                key={activeItem.term}
                ref={descRef}
                id={`${baseId}-panel`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${active}`}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: prefersReducedMotion ? 0 : REVEAL_OUT_S,
                    ease: REVEAL_EASE,
                  },
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: REVEAL_IN_S,
                        delay: REVEAL_GAP_S,
                        ease: REVEAL_EASE,
                      }
                }
                className="absolute inset-x-0"
                style={descStyle}
              >
                <DetailBody item={activeItem} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function PlanChecklist({
  items,
  lead,
  planId,
  className,
}: {
  items: string[] | PlanChecklistItem[]
  lead?: string
  planId?: string
  className?: string
}) {
  if (isStructured(items)) {
    return (
      <RevealChecklist
        items={items}
        lead={lead}
        planId={planId}
        className={className}
      />
    )
  }
  return (
    <LandingChecklist items={items} planId={planId} className={className} />
  )
}
