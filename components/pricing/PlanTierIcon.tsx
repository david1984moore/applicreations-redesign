import { PlanHouseSketch } from '@/components/landing/hiw/HiwHouseArt'
import type { PlanId } from '@/lib/pricing'

/**
 * Static frames of the How-it-works house.
 * Starter  finished build
 * Basic    paint, walkway, flower boxes
 * Business shutters, mailbox, grounded shrubs
 * Pro      garage + car + static chimney smoke
 */
export function PlanTierIcon({
  planId,
  className,
}: {
  planId: PlanId
  className?: string
}) {
  return <PlanHouseSketch planId={planId} className={className} />
}
