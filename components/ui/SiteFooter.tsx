'use client'

import { useLocale } from '@/components/i18n/LocaleProvider'

/** Keep in sync with viewport height calcs that reserve space for this footer. */
export const SITE_FOOTER_OFFSET = '1.75rem'
export const SITE_FOOTER_HEIGHT_CLASS = 'h-[1.75rem]'

const COPYRIGHT_YEAR = 2026

export function SiteFooter() {
  const { dict } = useLocale()

  return (
    <footer
      className={`relative z-10 ${SITE_FOOTER_HEIGHT_CLASS} flex shrink-0 items-center justify-center px-4`}
      role="contentinfo"
    >
      <p className="text-[0.6875rem] sm:text-xs text-gray-500 tracking-wide">
        © {COPYRIGHT_YEAR} {dict.brand.name}
      </p>
    </footer>
  )
}
