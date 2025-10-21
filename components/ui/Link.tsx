import * as React from "react"
import NextLink from "next/link"
import { cn } from "@/lib/utils"

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children?: React.ReactNode
  external?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, external, ...props }, ref) => {
    const baseStyles = "text-blue-deep hover:text-blue-navy underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-deep focus-visible:ring-offset-2 rounded-sm transition-colors"
    
    // Auto-detect external links
    const isExternal = external ?? (href.startsWith("http") || href.startsWith("//"))
    
    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(baseStyles, className)}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      )
    }
    
    return (
      <NextLink
        ref={ref}
        href={href}
        className={cn(baseStyles, className)}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = "Link"

export { Link }

