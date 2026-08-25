import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * One paper sheet for the landing 4-up price list.
 * Hairline dividers run the full bay height. Most popular sits on the top edge.
 */
export function LandingPricingRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-visible bg-card',
        'rounded-l-2xl rounded-r-[1.85rem]',
        'border border-gray-200/80',
        'shadow-[0_8px_20px_rgba(40,28,16,0.10),0_2px_6px_rgba(40,28,16,0.06)]',
        className
      )}
    >
      <div
        className={cn(
          'grid grid-cols-2 items-stretch lg:grid-cols-4 lg:grid-rows-1',
          '[&>*]:border-gray-200/90',
          '[&>*:nth-child(odd)]:border-r',
          '[&>*:nth-child(-n+2)]:border-b',
          'lg:[&>*:nth-child(-n+2)]:border-b-0',
          'lg:[&>*:nth-child(2)]:border-r',
          /* Match outer sheet radius on each corner cell (Basic’s fill needs its own TR radius on mobile). */
          '[&>*:nth-child(1)]:rounded-tl-2xl lg:[&>*:nth-child(1)]:rounded-bl-2xl',
          '[&>*:nth-child(2)]:rounded-tr-[1.85rem] lg:[&>*:nth-child(2)]:rounded-none',
          '[&>*:nth-child(3)]:rounded-bl-2xl lg:[&>*:nth-child(3)]:rounded-none',
          '[&>*:nth-child(4)]:rounded-br-[1.85rem] lg:[&>*:nth-child(4)]:rounded-tr-[1.85rem]'
        )}
      >
        {children}
      </div>
    </div>
  )
}
