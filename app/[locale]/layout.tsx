import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'
import { Navigation } from '@/components/ui/Navigation'
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
  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
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
      <Navigation />
      {children}
    </LocaleProvider>
  )
}
