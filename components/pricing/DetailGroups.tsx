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
} from 'lucide-react'
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
 * Per-section icon accents keyed by label so the same category
 * matches across Basic / Pro / Business.
 */
const GROUP_STYLES: Record<string, GroupStyle> = {
  'How big is the site': {
    icon: LayoutTemplate,
    accent: 'text-[oklch(40%_0.12_255)]',
  },
  'What it looks like': {
    icon: Palette,
    accent: 'text-[oklch(42%_0.09_75)]',
  },
  'How customers use it': {
    icon: MousePointerClick,
    accent: 'text-[oklch(38%_0.09_200)]',
  },
  'How you manage it': {
    icon: Settings2,
    accent: 'text-[oklch(36%_0.10_260)]',
  },
  "Help after it's live": {
    icon: LifeBuoy,
    accent: 'text-[oklch(36%_0.10_160)]',
  },
  "Help after it’s live": {
    icon: LifeBuoy,
    accent: 'text-[oklch(36%_0.10_160)]',
  },
  "What's included": {
    icon: Package,
    accent: 'text-[oklch(40%_0.12_255)]',
  },
  "What’s included": {
    icon: Package,
    accent: 'text-[oklch(40%_0.12_255)]',
  },
  'What we fix or update': {
    icon: Wrench,
    accent: 'text-[oklch(42%_0.09_75)]',
  },
  'How you contact us': {
    icon: Mail,
    accent: 'text-[oklch(38%_0.09_200)]',
  },
  "Who it's for": {
    icon: Users,
    accent: 'text-[oklch(36%_0.10_260)]',
  },
  "Who it’s for": {
    icon: Users,
    accent: 'text-[oklch(36%_0.10_260)]',
  },
}

const FALLBACK: GroupStyle = {
  icon: Headset,
  accent: 'text-gray-900',
}

function styleFor(label: string): GroupStyle {
  return GROUP_STYLES[label] ?? FALLBACK
}

function splitOptional(item: string): { optional: boolean; text: string } {
  const match = item.match(/^Optional:\s*(.*)$/i)
  if (match) return { optional: true, text: match[1] }
  return { optional: false, text: item }
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

function DetailGroup({ group }: { group: PlanDetailGroup }) {
  const style = styleFor(group.label)
  const Icon = style.icon

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
      {group.lead ? (
        <p className="mb-1 text-xs font-medium text-gray-600">{group.lead}</p>
      ) : null}
      <ul className="space-y-0.5">
        {group.items.map((item) => {
          const { optional, text } = splitOptional(item)
          return (
            <li
              key={item}
              className={cn(
                'flex gap-2 text-sm leading-snug text-gray-900',
                optional && 'text-gray-600'
              )}
            >
              <TubeCheck dimmed={optional} />
              <span>
                {optional ? (
                  <>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-600 mr-1.5">
                      Optional
                    </span>
                    {text}
                  </>
                ) : (
                  text
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Layman labels with short list items — easy to scan, not middot prose */
export function DetailGroups({ groups, className }: DetailGroupsProps) {
  // Split into columns so short groups don’t leave row-aligned dead space
  const left = groups.filter((_, i) => i % 2 === 0)
  const right = groups.filter((_, i) => i % 2 === 1)

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5',
        className
      )}
    >
      <div className="flex flex-col gap-3.5">
        {left.map((group) => (
          <DetailGroup key={group.label} group={group} />
        ))}
      </div>
      <div className="flex flex-col gap-3.5">
        {right.map((group) => (
          <DetailGroup key={group.label} group={group} />
        ))}
      </div>
    </div>
  )
}
