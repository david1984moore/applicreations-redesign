import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { withLocale } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/config'
import { getSiteUrl } from '@/lib/site'

const OG_IMAGE = {
  url: '/og-image.png?v=20260824',
  width: 1200,
  height: 630,
} as const

/** Page metadata with branded Open Graph / iMessage / Slack link preview. */
export function pageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale
  title: string
  description: string
  path: string
}): Metadata {
  const dict = getDictionary(locale)
  const url = `${getSiteUrl()}${withLocale(path, locale)}`
  const imageAlt = `${dict.brand.name} — ${dict.landing.tagline}`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      // Match the hostname so iMessage's footer is only applicreations.com.
      siteName: 'applicreations.com',
      title: 'applicreations.com',
      description,
      url,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [{ ...OG_IMAGE, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  }
}
