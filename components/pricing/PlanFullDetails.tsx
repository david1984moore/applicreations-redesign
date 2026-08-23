'use client'

import type { ReactNode } from 'react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { PlanChecklist } from '@/components/pricing/PlanChecklist'
import { ExcludedMark, IncludedMark } from '@/components/pricing/PlanMarks'
import type {
  PlanChecklistItem,
  PlanDetailGroup,
  PlanDetailSegment,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

type ItemKind = 'included' | 'optional' | 'excluded'

type Bullet = {
  term: string
  plain?: string
  kind: ItemKind
}

function splitItem(item: string): { kind: ItemKind; text: string } {
  const notIncluded = item.match(/^Not included:\s*(.*)$/i)
  if (notIncluded?.[1] != null) return { kind: 'excluded', text: notIncluded[1] }
  const optional = item.match(/^Optional:\s*(.*)$/i)
  if (optional?.[1] != null) return { kind: 'optional', text: optional[1] }
  return { kind: 'included', text: item }
}

function isExampleLead(lead?: string) {
  return Boolean(lead && /common examples|ejemplos comunes/i.test(lead))
}

function isPlusLead(lead?: string) {
  return Boolean(
    lead && /^(everything in|todo lo de)\s+\w+,?\s+(plus|más):\s*$/i.test(lead)
  )
}

function segmentsOf(group?: PlanDetailGroup): PlanDetailSegment[] {
  if (!group) return []
  if (group.segments) return group.segments
  if (group.items.length > 0 || group.lead) {
    return [{ lead: group.lead, items: group.items }]
  }
  return []
}

function findGroup(groups: PlanDetailGroup[], id: string) {
  return groups.find((group) => group.id === id)
}

function stripPlusLead(text: string) {
  return text.replace(/,\s*(plus|más):\s*$/i, '').trim()
}

function splitTermPlain(text: string): { term: string; plain?: string } {
  const dash = text.indexOf(' — ')
  if (dash > 0) {
    return {
      term: text.slice(0, dash).trim(),
      plain: text.slice(dash + 3).trim() || undefined,
    }
  }
  return { term: text.trim() }
}

function toBullet(text: string, kind: ItemKind): Bullet {
  const { term, plain } = splitTermPlain(text)
  return { term, plain, kind }
}

function ItemText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\(#[^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\((#[^)]+)\)$/)
        if (link?.[1] != null && link[2] != null) {
          return (
            <a
              key={i}
              href={link[2]}
              className="cursor-pointer font-medium text-primary-700 hover:text-primary-800"
            >
              {link[1]}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function Mark({ kind }: { kind: ItemKind }) {
  if (kind === 'excluded') {
    return <ExcludedMark className="mt-0.5" />
  }
  return (
    <IncludedMark
      className={cn('mt-0.5', kind === 'optional' && 'opacity-70')}
    />
  )
}

function StackedIncluded({ items }: { items: PlanChecklistItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={`${item.icon}-${item.term}`} className="flex gap-1.5">
          <IncludedMark className="mt-0.5" />
          <div className="min-w-0">
            <p
              className={cn(
                'text-sm leading-snug text-gray-900',
                item.emphasis ? 'font-semibold' : 'font-medium'
              )}
            >
              {item.term}
            </p>
            {item.example ? (
              <p className="mt-0.5 text-xs leading-snug text-gray-500">{item.example}</p>
            ) : null}
            <p className="mt-0.5 text-xs leading-snug text-gray-600">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function BulletList({ items }: { items: Bullet[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const full = item.plain ? `${item.term} — ${item.plain}` : item.term
        return (
          <li
            key={`${item.kind}-${item.term}-${item.plain ?? ''}`}
            title={full}
            className={cn(
              'flex gap-1.5 text-[clamp(0.875rem,1.35vh,0.95rem)] leading-tight text-left',
              item.kind === 'excluded' && 'text-gray-700',
              item.kind === 'optional' && 'text-gray-600',
              item.kind === 'included' && 'text-gray-800'
            )}
          >
            <Mark kind={item.kind} />
            <span className="min-w-0">
              <span className="font-semibold text-gray-900">
                <ItemText text={item.term} />
              </span>
              {item.plain ? (
                <span className="mt-0.5 block font-normal text-[clamp(0.75rem,1.15vh,0.8125rem)] leading-snug text-gray-500">
                  {item.plain}
                </span>
              ) : null}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

const sectionHeadingClass =
  'mb-2.5 text-sm font-extrabold uppercase tracking-[0.08em] leading-none text-gray-400'

const plusHeadingClass =
  'mb-1 text-sm font-extrabold leading-snug text-gray-900'

/** Keeps Not included / After launch on one horizontal line across the four cards. */
const NOT_INCLUDED_MIN = 'min-h-[7.25rem] max-xl:min-h-0'
const AFTER_LAUNCH_MIN = 'min-h-[4rem] max-xl:min-h-0'

function Section({
  title,
  kicker,
  items,
  className,
  reserveSpace = false,
}: {
  title: string
  kicker?: string
  items: Bullet[]
  className?: string
  reserveSpace?: boolean
}) {
  if (items.length === 0 && !kicker && !reserveSpace) return null
  return (
    <div className={cn('min-w-0 text-left', className)}>
      {items.length > 0 || kicker ? (
        <p className={sectionHeadingClass}>{title}</p>
      ) : null}
      {kicker ? <p className={plusHeadingClass}>{kicker}</p> : null}
      {items.length > 0 ? <BulletList items={items} /> : null}
    </div>
  )
}

function includedFromLooksLike(group?: PlanDetailGroup): {
  kicker?: string
  items: Bullet[]
} {
  const bullets: Bullet[] = []
  let kicker: string | undefined
  for (const segment of segmentsOf(group)) {
    if (isExampleLead(segment.lead)) continue
    if (segment.lead && segment.items.length === 0) {
      if (isPlusLead(segment.lead)) {
        kicker = stripPlusLead(segment.lead)
        continue
      }
      bullets.push(toBullet(segment.lead, 'included'))
      continue
    }
    for (const item of segment.items) {
      const { kind, text } = splitItem(item)
      if (kind !== 'included') continue
      bullets.push(toBullet(text, 'included'))
    }
  }
  return { kicker, items: bullets }
}

function excludedFromLooksLike(group?: PlanDetailGroup): Bullet[] {
  const bullets: Bullet[] = []
  for (const segment of segmentsOf(group)) {
    if (isExampleLead(segment.lead)) continue
    for (const item of segment.items) {
      const { kind, text } = splitItem(item)
      if (kind === 'included') continue
      bullets.push(toBullet(text, 'excluded'))
    }
  }
  return bullets
}

function bulletsFromItems(group?: PlanDetailGroup, kind: ItemKind = 'included'): Bullet[] {
  return segmentsOf(group).flatMap((segment) =>
    segment.items.map((item) => {
      const parsed = splitItem(item)
      return toBullet(parsed.text, kind === 'included' ? parsed.kind : kind)
    })
  )
}

export function PlanFullDetails({
  groups,
  included,
  includedLead,
  showIncludedHeading = true,
  planId,
  afterLabel,
  className,
  stacked = false,
}: {
  groups: PlanDetailGroup[]
  included?: PlanChecklistItem[]
  includedLead?: string
  showIncludedHeading?: boolean
  planId?: string
  afterLabel?: string
  className?: string
  /** Mobile accordion — show every included line, not the desktop click-reveal. */
  stacked?: boolean
}): ReactNode {
  const { dict } = useLocale()
  const p = dict.pricingPage
  const howBig = findGroup(groups, 'how-big')
  const looksLike = findGroup(groups, 'looks-like')
  const youManage = findGroup(groups, 'you-manage')
  const helpAfter = findGroup(groups, 'help-after')

  const looks = includedFromLooksLike(looksLike)
  const fallbackIncluded: Bullet[] = [
    ...bulletsFromItems(howBig),
    ...looks.items,
    ...bulletsFromItems(youManage),
  ]
  const notIncluded = excludedFromLooksLike(looksLike)
  const after = bulletsFromItems(helpAfter)
  const useReveal = Boolean(included && included.length > 0)

  return (
    <div className={cn('flex h-full min-h-0 flex-1 flex-col', className)}>
      {useReveal ? (
        <div className="min-w-0 shrink-0 text-left">
          {showIncludedHeading ? (
            <p className={cn(sectionHeadingClass, 'shrink-0')}>
              {p.whatsIncluded}
            </p>
          ) : null}
          {stacked ? (
            <StackedIncluded items={included!} />
          ) : (
            <PlanChecklist items={included!} lead={includedLead} planId={planId} />
          )}
        </div>
      ) : (
        <Section
          title={p.whatsIncluded}
          kicker={looks.kicker ?? includedLead}
          items={fallbackIncluded}
          className="shrink-0"
        />
      )}
      <Section
        title={dict.common.notIncluded}
        items={notIncluded}
        reserveSpace
        className={cn(
          'shrink-0',
          notIncluded.length > 0
            ? 'mt-2.5 border-t border-gray-200/80 pt-2.5'
            : 'mt-2.5',
          NOT_INCLUDED_MIN
        )}
      />
      {after.length > 0 ? (
        <div
          className={cn(
            'mt-2.5 min-w-0 shrink-0 border-t border-gray-200/80 pt-2.5 text-left',
            AFTER_LAUNCH_MIN
          )}
        >
          <p className={sectionHeadingClass}>{afterLabel ?? p.afterLaunch}</p>
          <p className="text-[clamp(0.8rem,1.25vh,0.875rem)] leading-snug text-gray-600">
            {after.map((item, index) => (
              <span key={`${item.term}-${item.plain ?? ''}`}>
                {index > 0 ? ' ' : null}
                <ItemText
                  text={item.plain ? `${item.term} — ${item.plain}` : item.term}
                />
              </span>
            ))}
          </p>
        </div>
      ) : null}
      <div className="min-h-0 flex-1" aria-hidden />
    </div>
  )
}
