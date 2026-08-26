import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'
import { LocaleTransitionGuard } from '@/components/i18n/LocaleTransitionGuard'
import { Navigation } from '@/components/ui/Navigation'
import { RouteCover } from '@/components/ui/RouteCover'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { isLocale, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { pageMetadata } from '@/lib/page-metadata'

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
  return pageMetadata({
    locale,
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    path: '/',
  })
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
      <RouteCover />
      <Navigation />
      <div className="site-page">
        {children}
        <SiteFooter />
      </div>
    </LocaleProvider>
  )
}
