import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { withLocale } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/config'
import { getSiteUrl } from '@/lib/site'

const TWITTER_IMAGE = '/og-image.png?v=20260901'

function shortOgTitle(title: string, brandName: string): string {
  const beforeDash = title.split(' — ')[0]?.trim()
  return beforeDash || brandName
}

/** Page metadata with a compact Open Graph / iMessage / Slack link preview. */
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
  const ogTitle = shortOgTitle(title, dict.brand.name)

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: dict.brand.name,
      title: ogTitle,
      description,
      url,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      // Omit og:image so iMessage stays the compact icon+title bubble.
      // A 900px+ image is what produces the large square card.
    },
    twitter: {
      card: 'summary',
      title: ogTitle,
      description,
      images: [TWITTER_IMAGE],
    },
  }
}
