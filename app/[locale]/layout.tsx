import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'
import { LocaleTransitionGuard } from '@/components/i18n/LocaleTransitionGuard'
import { Navigation } from '@/components/ui/Navigation'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { isLocale, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'en'
  const dict = getDictionary(locale)
  const title = dict.meta.homeTitle
  const description = dict.meta.homeDescription
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: dict.brand.name,
      title,
      description,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${dict.brand.name} — ${dict.landing.tagline}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const dictionary = getDictionary(raw)

  return (
    <LocaleProvider locale={raw} dictionary={dictionary}>
      <LocaleTransitionGuard />
      <Navigation />
      {children}
      <SiteFooter />
    </LocaleProvider>
  )
}
