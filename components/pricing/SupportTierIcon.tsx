import type { SupportPlanId } from '@/lib/pricing'
import { cn } from '@/lib/utils'

const SCALE: Record<SupportPlanId, string> = {
  support: 'h-[72%]',
  'business-support': 'h-[86%]',
  ultimate: 'h-full',
}

const WOOD = 'oklch(40% 0.08 40)'
const WOOD_SOFT = 'oklch(62% 0.035 70)'
const PAD = 'oklch(72% 0.03 75)'
const CREAM = 'oklch(96% 0.015 80)'
const SKY = 'oklch(78% 0.07 230)'
const SKY_SOFT = 'oklch(90% 0.07 230)'
const SKY_LINE = 'oklch(62% 0.08 230)'
const CHECK = 'oklch(38% 0.12 155)'

/**
 * Hosting-card mark — a live site that gains care as the plan steps up.
 * Basic: hosted laptop. Business: live page + priority check. Pro: full-coverage ring.
 */
export function SupportTierIcon({
  planId,
  className,
}: {
  planId: SupportPlanId
  className?: string
}) {
  const isBusiness = planId === 'business-support' || planId === 'ultimate'
  const isPro = planId === 'ultimate'

  return (
    <svg
      viewBox="0 0 88 88"
      className={cn('w-auto max-w-full', SCALE[planId], className)}
      aria-hidden
    >
      {isPro ? (
        <circle
          cx="44"
          cy="44"
          r="34"
          fill="none"
          stroke={SKY_LINE}
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
      ) : null}

      <path
        d="M18 74h52"
        stroke={WOOD_SOFT}
        strokeWidth={isPro ? 3.6 : 3.2}
        strokeLinecap="round"
      />
      <path
        d="M24 70h40"
        stroke={PAD}
        strokeWidth={isBusiness ? 6.5 : 5.5}
        strokeLinecap="round"
      />

      <rect
        x="24"
        y="20"
        width="40"
        height="36"
        rx="5"
        fill={CREAM}
        stroke={WOOD}
        strokeWidth="1.7"
      />
      <rect
        x="28"
        y="25"
        width="32"
        height={isPro ? 17 : 16}
        rx="2"
        fill={SKY}
      />

      {isPro ? (
        <rect x="30" y="27" width="16" height="3" rx="1" fill={CREAM} opacity="0.9" />
      ) : null}

      <path
        d={
          isPro
            ? 'M31 47h11M31 51.5h18'
            : isBusiness
              ? 'M31 47h10M31 51.5h16'
              : 'M31 48h12'
        }
        stroke={WOOD}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {isBusiness ? (
        <g>
          <circle
            cx="60"
            cy="24"
            r="9"
            fill={SKY_SOFT}
            stroke={SKY_LINE}
            strokeWidth="1.4"
          />
          <path
            d="M56.5 24.2l2.4 2.4 4.6-5"
            fill="none"
            stroke={CHECK}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </svg>
  )
}
