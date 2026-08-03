import type { Metadata } from 'next'
import { ContactBoard } from '@/components/sections/ContactBoard'
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
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
  }
}

export default function ContactPage() {
  return (
    <main>
      <ContactBoard />
    </main>
  )
}
