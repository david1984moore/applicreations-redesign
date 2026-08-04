'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Check,
  Headset,
  LayoutTemplate,
  LifeBuoy,
  Mail,
  MousePointerClick,
  Package,
  Palette,
  Settings2,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import type { PlanDetailGroup } from '@/lib/pricing'
import { cn } from '@/lib/utils'

interface DetailGroupsProps {
  groups: PlanDetailGroup[]
  className?: string
}

type GroupStyle = {
  icon: LucideIcon
  accent: string
}

/**
 * Per-section icon accents keyed by detail group id so the same category
 * matches across Basic / Pro / Business in every language.
 */
const GROUP_STYLES: Record<string, GroupStyle> = {
  'how-big': {
    icon: LayoutTemplate,
    accent: 'text-[oklch(40%_0.12_255)]',
  },
  'looks-like': {
    icon: Palette,
    accent: 'text-[oklch(42%_0.09_75)]',
  },
  'customers-use': {
    icon: MousePointerClick,
    accent: 'text-[oklch(38%_0.09_200)]',
  },
  'you-manage': {
    icon: Settings2,
    accent: 'text-[oklch(36%_0.10_260)]',
  },
  'help-after': {
    icon: LifeBuoy,
    accent: 'text-[oklch(36%_0.10_160)]',
  },
  'whats-included': {
    icon: Package,
    accent: 'text-[oklch(40%_0.12_255)]',
  },
  'fix-or-update': {
    icon: Wrench,
    accent: 'text-[oklch(42%_0.09_75)]',
  },
  'how-contact': {
    icon: Mail,
    accent: 'text-[oklch(38%_0.09_200)]',
  },
  'who-for': {
    icon: Users,
    accent: 'text-[oklch(36%_0.10_260)]',
  },
}

const FALLBACK: GroupStyle = {
  icon: Headset,
  accent: 'text-gray-900',
}

function styleFor(id: string): GroupStyle {
  return GROUP_STYLES[id] ?? FALLBACK
}

type ItemKind = 'included' | 'optional' | 'excluded'

function splitItem(item: string): { kind: ItemKind; text: string } {
  const notIncluded = item.match(/^Not included:\s*(.*)$/i)
  if (notIncluded?.[1] != null) return { kind: 'excluded', text: notIncluded[1] }
  const optional = item.match(/^Optional:\s*(.*)$/i)
  if (optional?.[1] != null) return { kind: 'optional', text: optional[1] }
  return { kind: 'included', text: item }
}

/** Render plain text with optional `[label](#href)` inline links */
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
              className="cursor-pointer font-bold text-primary-700 hover:text-primary-800"
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

/** Soft rounded green check — tube-like stroke, no glow */
function TubeCheck({ dimmed }: { dimmed?: boolean }) {
  return (
    <Check
      className={cn(
        'mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(52%_0.14_155)]',
        dimmed && 'opacity-70'
      )}
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      absoluteStrokeWidth
      aria-hidden
    />
  )
}

/** Soft rounded red X — matches TubeCheck weight, signals exclusion */
function TubeX() {
  return (
    <X
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(48%_0.18_25)]"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      absoluteStrokeWidth
      aria-hidden
    />
  )
}

function itemListVariant(
  groupId: string,
  segmentLead?: string
): 'check' | 'bullet' {
  if (groupId === 'customers-use') return 'bullet'
  if (segmentLead) return 'bullet'
  return 'check'
}

function DetailItemList({
  items,
  variant = 'check',
}: {
  items: string[]
  variant?: 'check' | 'bullet'
}) {
  const { dict } = useLocale()

  if (variant === 'bullet') {
    return (
      <ul className="list-disc space-y-0.5 pl-4 marker:text-gray-500">
        {items.map((item) => {
          const { kind, text } = splitItem(item)
          return (
            <li
              key={item}
              className={cn(
                'text-sm leading-snug',
                kind === 'excluded' && 'text-gray-900 font-medium',
                kind === 'optional' && 'text-gray-600',
                kind === 'included' && 'text-gray-900'
              )}
            >
              {kind === 'optional' ? (
                <>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-600 mr-1.5">
                    {dict.common.optional}
                  </span>
                  <ItemText text={text} />
                </>
              ) : kind === 'excluded' ? (
                <>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(48%_0.18_25)] mr-1.5">
                    {dict.common.notIncluded}
                  </span>
                  <ItemText text={text} />
                </>
              ) : (
                <ItemText text={text} />
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const { kind, text } = splitItem(item)
        return (
          <li
            key={item}
            className={cn(
              'flex gap-2 text-sm leading-snug',
              kind === 'excluded' && 'text-gray-900 font-medium',
              kind === 'optional' && 'text-gray-600',
              kind === 'included' && 'text-gray-900'
            )}
          >
            {kind === 'excluded' ? <TubeX /> : <TubeCheck dimmed={kind === 'optional'} />}
            <span>
              {kind === 'optional' ? (
                <>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-600 mr-1.5">
                    {dict.common.optional}
                  </span>
                  <ItemText text={text} />
                </>
              ) : kind === 'excluded' ? (
                <>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(48%_0.18_25)] mr-1.5">
                    {dict.common.notIncluded}
                  </span>
                  <ItemText text={text} />
                </>
              ) : (
                <ItemText text={text} />
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function DetailGroup({ group }: { group: PlanDetailGroup }) {
  const style = styleFor(group.id)
  const Icon = style.icon
  const segments =
    group.segments ??
    (group.items.length > 0 || group.lead
      ? [{ lead: group.lead, items: group.items }]
      : [])

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon
          className={cn('h-4 w-4 shrink-0', style.accent)}
          strokeWidth={2.35}
          aria-hidden
        />
        <p className="text-sm font-bold leading-none text-gray-900">
          {group.label}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {segments.map((segment, i) => (
          <div key={`${group.id}-seg-${i}`}>
            {segment.lead ? (
              <p className="mb-1 text-xs font-medium text-gray-600">{segment.lead}</p>
            ) : null}
            {segment.items.length > 0 ? (
              <DetailItemList
                items={segment.items}
                variant={itemListVariant(group.id, segment.lead)}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Layman labels with short list items — easy to scan, not middot prose */
export function DetailGroups({ groups, className }: DetailGroupsProps) {
  // Website: size + look | use → manage → help after
  // Support: included + fix/update | contact → who for
  const leftIds = new Set([
    'how-big',
    'looks-like',
    'whats-included',
    'fix-or-update',
  ])
  const left = groups.filter((g) => leftIds.has(g.id))
  const right = groups.filter((g) => !leftIds.has(g.id))

  // Avoid an empty left column pushing everything to the right
  if (left.length === 0 || right.length === 0) {
    return (
      <div className={cn('flex flex-col gap-3.5', className)}>
        {groups.map((group) => (
          <DetailGroup key={group.id} group={group} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5',
        className
      )}
    >
      <div className="flex flex-col gap-3.5">
        {left.map((group) => (
          <DetailGroup key={group.id} group={group} />
        ))}
      </div>
      <div className="flex flex-col gap-3.5">
        {right.map((group) => (
          <DetailGroup key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}
