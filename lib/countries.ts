import type { Locale } from '@/lib/i18n/config'

/** Default Introspect country — always selected until the user chooses otherwise. */
export const DEFAULT_COUNTRY = 'US'

/**
 * ISO 3166-1 alpha-2 codes (UN members + common territories).
 * Display names come from Intl so EN/ES stay localized without a giant dictionary.
 */
const COUNTRY_CODES = [
  'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU',
  'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO',
  'BA', 'BW', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'KY',
  'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI',
  'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ',
  'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA',
  'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN',
  'GW', 'GY', 'HT', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM',
  'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG',
  'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MG', 'MW', 'MY',
  'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN',
  'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE',
  'NG', 'NU', 'NF', 'MK', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY',
  'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH',
  'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL',
  'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR',
  'SJ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT',
  'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU',
  'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW', 'XK',
] as const

export type CountryCode = (typeof COUNTRY_CODES)[number]

const COUNTRY_CODE_SET = new Set<string>(COUNTRY_CODES)

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && COUNTRY_CODE_SET.has(value)
}

export function countryDisplayName(code: string, locale: Locale): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

export function countryOptions(locale: Locale): { code: CountryCode; name: string }[] {
  const rest = COUNTRY_CODES.filter((code) => code !== DEFAULT_COUNTRY)
    .map((code) => ({ code, name: countryDisplayName(code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale))

  return [
    { code: DEFAULT_COUNTRY, name: countryDisplayName(DEFAULT_COUNTRY, locale) },
    ...rest,
  ]
}

const COUNTRY_NAME_ALIASES = new Set([
  'united states',
  'united states of america',
  'usa',
  'u.s.',
  'u.s.a.',
  'us',
  'estados unidos',
  'ee.uu.',
  'eeuu',
])

export function isLikelyCountryName(value: string, locale: Locale = 'en'): boolean {
  const t = value.trim().toLowerCase()
  if (!t) return false
  if (COUNTRY_NAME_ALIASES.has(t)) return true
  return COUNTRY_CODES.some((code) => countryDisplayName(code, locale).toLowerCase() === t)
}
