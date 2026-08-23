import type { SupportPlanId } from '@/lib/pricing'
import { cn } from '@/lib/utils'

const SCALE: Record<SupportPlanId, string> = {
  support: 'h-[72%]',
  'business-support': 'h-[86%]',
  ultimate: 'h-full',
}

/**
 * Hosting-card mark — a live site on a care pad.
 * Basic is the hosted site; Business adds a priority badge; Pro adds a 24h ring.
 */
export function SupportTierIcon({
  planId,
  className,
}: {
  planId: SupportPlanId
  className?: string
}) {
  const isBusiness = planId === 'business-support' || planId === 'ultimate'
  const isUltimate = planId === 'ultimate'

  return (
    <svg
      viewBox="0 0 88 88"
      className={cn('w-auto max-w-full', SCALE[planId], className)}
      aria-hidden
    >
      {isUltimate ? (
        <circle
          cx="44"
          cy="40"
          r="36"
          fill="none"
          stroke="oklch(62% 0.08 230)"
          strokeWidth="1.4"
          strokeDasharray="4 5"
        />
      ) : null}

      <path
        d="M16 72h56"
        stroke="oklch(62% 0.035 70)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M22 68h44"
        stroke="oklch(72% 0.03 75)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <rect
        x="24"
        y="18"
        width="40"
        height="36"
        rx="5"
        fill="oklch(96% 0.015 80)"
        stroke="oklch(40% 0.08 40)"
        strokeWidth="1.7"
      />
      <rect
        x="28"
        y="23"
        width="32"
        height="18"
        rx="2"
        fill="oklch(78% 0.07 230)"
      />
      <path
        d="M31 46h10M31 50h18"
        stroke="oklch(40% 0.08 40)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {isBusiness ? (
        <g>
          <circle
            cx="60"
            cy="22"
            r="9"
            fill="oklch(90% 0.07 230)"
            stroke="oklch(42% 0.12 230)"
            strokeWidth="1.4"
          />
          <path
            d="M56.5 22.2l2.4 2.4 4.6-5"
            fill="none"
            stroke="oklch(38% 0.12 155)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}

      {isUltimate ? (
        <text
          x="44"
          y="14"
          textAnchor="middle"
          fill="oklch(38% 0.1 230)"
          fontSize="8"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          24h
        </text>
      ) : null}
    </svg>
  )
}
