import type { Metadata } from 'next'
import { IntrospectBoard } from '@/components/sections/IntrospectBoard'
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
    title: dict.meta.introspectTitle,
    description: dict.meta.introspectDescription,
  }
}

export default function IntrospectPage() {
  return (
    <main>
      <IntrospectBoard />
    </main>
  )
}
