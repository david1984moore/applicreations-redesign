import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Shared ink check — used on landing cards, plan details, and the comparison grid. */
export function IncludedMark({
  className,
  size = 'sm',
}: {
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <Check
      className={cn(
        'shrink-0 text-[oklch(42%_0.17_155)]',
        size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5',
        className
      )}
      strokeWidth={2.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      absoluteStrokeWidth
      aria-hidden
    />
  )
}

/** Bold red X for missing features — heavier than the check so exclusions scan. */
export function ExcludedMark({
  className,
  size = 'sm',
}: {
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <X
      className={cn(
        'shrink-0 text-red-600',
        size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5',
        className
      )}
      strokeWidth={3.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      absoluteStrokeWidth
      aria-hidden
    />
  )
}
