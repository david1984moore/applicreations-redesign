import type { ReactNode } from 'react'

const RENDER_HREF = 'https://render.com'

const renderLinkClass =
  'font-medium text-primary-700 hover:text-primary-800'

/**
 * Renders a string with every “Render” turned into an external link.
 */
export function LinkRenderText({
  text,
  className,
}: {
  text: string
  className?: string
}): ReactNode {
  const parts = text.split(/(Render)/g)
  if (parts.length === 1) return text

  return parts.map((part, i) =>
    part === 'Render' ? (
      <a
        key={i}
        href={RENDER_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={className ?? renderLinkClass}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}
