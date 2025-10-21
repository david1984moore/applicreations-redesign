import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps {
  variant?: "default" | "elevated" | "interactive"
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, onClick }, ref) => {
    const baseStyles = "rounded-lg p-6 bg-white border"
    
    const variants = {
      default: "border-gray-200",
      elevated: "border-gray-200 shadow-lg",
      interactive: "border-gray-200 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:translate-y-0",
    }
    
    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        onClick={onClick}
        style={variant === "interactive" ? {
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'subpixel-antialiased',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        } : undefined}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export { Card }

