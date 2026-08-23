import type { Metadata } from 'next'
import { IntrospectBoard } from '@/components/sections/IntrospectBoard'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { pageMetadata } from '@/lib/page-metadata'

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
    title: dict.meta.introspectTitle,
    description: dict.meta.introspectDescription,
    path: '/introspect',
  })
}

export default function IntrospectPage() {
  return (
    <main>
      <IntrospectBoard />
    </main>
  )
}
