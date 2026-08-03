import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { en } from '@/lib/i18n/dictionaries/en'
import { es } from '@/lib/i18n/dictionaries/es'

const dictionaries: Record<Locale, Dictionary> = { en, es }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en
}
