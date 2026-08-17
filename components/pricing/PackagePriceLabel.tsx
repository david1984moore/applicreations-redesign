import { cn } from '@/lib/utils'

interface PackagePriceLabelProps {
  label: string
  className?: string
}

const MONTHLY_SUFFIX = /^(\$[\d,]+)(\/(?:mo|mes))$/i

/** Package price with a smaller /mo (or /mes) suffix when present. */
export function PackagePriceLabel({ label, className }: PackagePriceLabelProps) {
  const match = label.match(MONTHLY_SUFFIX)

  if (!match) {
    return <span className={className}>{label}</span>
  }

  const [, amount, suffix] = match

  return (
    <span className={cn('tabular-nums', className)}>
      {amount}
      <span className="text-[0.5em] font-sans font-normal text-gray-500 align-baseline">
        {suffix}
      </span>
    </span>
  )
}
