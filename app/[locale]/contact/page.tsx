import type { Metadata } from 'next'
import { ContactBoard } from '@/components/sections/ContactBoard'
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
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
    path: '/contact',
  })
}

export default function ContactPage() {
  return (
    <main>
      <ContactBoard />
    </main>
  )
}
