import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import DemosPageClient from './DemosPageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'en'
  const dict = getDictionary(locale)
  return {
    title: dict.meta.demosTitle,
    description: dict.meta.demosDescription,
  }
}

export default function DemosPage() {
  return <DemosPageClient />
}
