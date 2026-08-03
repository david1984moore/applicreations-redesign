import type { Metadata } from 'next'
import { AboutBoard } from '@/components/sections/AboutBoard'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'en'
  const dict = getDictionary(locale)
  return {
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
  }
}

export default function AboutPage() {
  return (
    <main>
      <AboutBoard />
    </main>
  )
}
