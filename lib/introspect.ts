import type { PlanId, SupportPlanId } from '@/lib/pricing'
import {
  getPlans,
  getSupportPlans,
  isPlanId,
  isSupportPlanId,
} from '@/lib/pricing'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { en } from '@/lib/i18n/dictionaries/en'
import { interpolate } from '@/lib/i18n/interpolate'

export type SiteDepth = 'basics' | 'a-few-pages' | 'fuller-site'

export type DesignFeel =
  | 'clean-simple'
  | 'warm-friendly'
  | 'bold-modern'
  | 'classic-calm'
  | 'playful-fun'
  | 'elegant-refined'
  | 'rustic-natural'
  | 'dark-dramatic'
  | 'airy-light'
  | 'editorial'

export type ColorPalette =
  | 'ocean-blues'
  | 'coastal-teal'
  | 'warm-earth'
  | 'sunset-coral'
  | 'fresh-greens'
  | 'soft-neutrals'
  | 'charcoal-gold'
  | 'soft-blush'
  | 'bright-cheerful'
  | 'deep-jewel'
  | 'custom'

export type YesNoUnsure = 'yes' | 'no' | 'unsure'

export type IntrospectAnswers = {
  fullName: string
  email: string
  phone: string
  businessName: string
  aboutBusiness: string
  location: string
  hasOnlinePresence: YesNoUnsure | ''
  websiteUrl: string
  socialMediaLinks: string[]
  admiredWebsiteLinks: string[]
  hasLogo: YesNoUnsure | ''
  hasPhotos: YesNoUnsure | ''
  needsPhotosTaken: YesNoUnsure | ''
  /** Client-selected file names only (binaries are not persisted in localStorage). */
  logoFileName: string
  photoFileNames: string[]
  visitorActions: string[]
  siteDepth: SiteDepth | ''
  /** Multi-select — clients often want a mix (e.g. clean + classic). */
  designFeels: DesignFeel[]
  /** When true, client leaves design feel to Applicreations. */
  designFeelNoPreference: boolean
  /** Multi-select — leanings, not a final brand palette. */
  colorPalettes: ColorPalette[]
  /** When true, client leaves color direction to Applicreations. */
  colorPaletteNoPreference: boolean
  /** When true, site colors should be built to work with the client's logo. */
  colorPaletteFromLogo: boolean
  colorNotes: string
  /** Optional — looks, tones, or approaches to skip. */
  designAvoidances: string
  /** Optional freeform notes at the end of the flow. */
  businessExtras: string
  /** Carried from /pricing when the client already chose a package. */
  selectedPlanId: PlanId | ''
  /** Carried from /pricing when the client already chose monthly care. */
  selectedSupportId: SupportPlanId | ''
}

export const emptyAnswers: IntrospectAnswers = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  aboutBusiness: '',
  location: '',
  hasOnlinePresence: '',
  websiteUrl: '',
  socialMediaLinks: [''],
  admiredWebsiteLinks: [''],
  hasLogo: '',
  hasPhotos: '',
  needsPhotosTaken: '',
  logoFileName: '',
  photoFileNames: [],
  visitorActions: [''],
  siteDepth: '',
  designFeels: [],
  designFeelNoPreference: false,
  colorPalettes: [],
  colorPaletteNoPreference: false,
  colorPaletteFromLogo: false,
  colorNotes: '',
  designAvoidances: '',
  businessExtras: '',
  selectedPlanId: '',
  selectedSupportId: '',
}

type LegacyDraft = Partial<
  Omit<
    IntrospectAnswers,
    | 'websiteUrl'
    | 'socialMediaLinks'
    | 'admiredWebsiteLinks'
    | 'visitorActions'
    | 'designFeels'
    | 'colorPalettes'
  >
> & {
  currentWebsiteLinks?: string
  websiteUrl?: string
  socialMediaLinks?: string[]
  admiredWebsiteLinks?: string | string[]
  visitorActions?: string | string[]
  designFeels?: DesignFeel[] | DesignFeel | string
  colorPalettes?: ColorPalette[] | ColorPalette | string
  /** Older single-select fields */
  designFeel?: DesignFeel | string
  colorPalette?: ColorPalette | string
  /** Removed from the flow; ignored when loading older drafts. */
  siteKinds?: unknown
}

const DESIGN_FEEL_IDS = new Set<string>([
  'clean-simple',
  'warm-friendly',
  'bold-modern',
  'classic-calm',
  'playful-fun',
  'elegant-refined',
  'rustic-natural',
  'dark-dramatic',
  'airy-light',
  'editorial',
])

const COLOR_PALETTE_IDS = new Set<string>([
  'ocean-blues',
  'coastal-teal',
  'warm-earth',
  'sunset-coral',
  'fresh-greens',
  'soft-neutrals',
  'charcoal-gold',
  'soft-blush',
  'bright-cheerful',
  'deep-jewel',
  'custom',
])

function asDesignFeelList(value: unknown, legacy?: unknown): DesignFeel[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string' && value
      ? [value]
      : typeof legacy === 'string' && legacy
        ? [legacy]
        : []
  return raw.filter((id): id is DesignFeel => typeof id === 'string' && DESIGN_FEEL_IDS.has(id))
}

function asColorPaletteList(value: unknown, legacy?: unknown): ColorPalette[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string' && value
      ? [value]
      : typeof legacy === 'string' && legacy
        ? [legacy]
        : []
  return raw.filter((id): id is ColorPalette => typeof id === 'string' && COLOR_PALETTE_IDS.has(id))
}

/** Merge saved draft with defaults; supports older single-textarea link fields. */
export function mergeDraftAnswers(parsed: LegacyDraft): IntrospectAnswers {
  const {
    currentWebsiteLinks,
    websiteUrl,
    socialMediaLinks,
    admiredWebsiteLinks,
    visitorActions,
    designFeels,
    colorPalettes,
    designFeel,
    colorPalette,
    siteKinds: _legacySiteKinds,
    ...rest
  } = parsed

  const merged: IntrospectAnswers = {
    ...emptyAnswers,
    ...rest,
    logoFileName: typeof parsed.logoFileName === 'string' ? parsed.logoFileName : '',
    photoFileNames: Array.isArray(parsed.photoFileNames)
      ? parsed.photoFileNames.filter((n): n is string => typeof n === 'string')
      : [],
    designFeels: asDesignFeelList(designFeels, designFeel),
    designFeelNoPreference: Boolean(parsed.designFeelNoPreference),
    colorPalettes: asColorPaletteList(colorPalettes, colorPalette),
    colorPaletteNoPreference: Boolean(parsed.colorPaletteNoPreference),
    colorPaletteFromLogo: Boolean(parsed.colorPaletteFromLogo),
    selectedPlanId: isPlanId(parsed.selectedPlanId) ? parsed.selectedPlanId : '',
    selectedSupportId: isSupportPlanId(parsed.selectedSupportId)
      ? parsed.selectedSupportId
      : '',
  }

  if (websiteUrl === undefined && typeof currentWebsiteLinks === 'string') {
    const lines = currentWebsiteLinks
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    merged.websiteUrl = lines[0] ?? ''
    merged.socialMediaLinks = lines.length > 1 ? lines.slice(1) : ['']
  } else {
    merged.websiteUrl = websiteUrl ?? ''
    merged.socialMediaLinks =
      Array.isArray(socialMediaLinks) && socialMediaLinks.length > 0
        ? socialMediaLinks
        : ['']
  }

  if (Array.isArray(admiredWebsiteLinks)) {
    merged.admiredWebsiteLinks =
      admiredWebsiteLinks.length > 0 ? admiredWebsiteLinks : ['']
  } else if (typeof admiredWebsiteLinks === 'string') {
    const admired = admiredWebsiteLinks
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    merged.admiredWebsiteLinks = admired.length > 0 ? admired : ['']
  } else {
    merged.admiredWebsiteLinks = ['']
  }

  if (Array.isArray(visitorActions)) {
    const actions = visitorActions.filter((a): a is string => typeof a === 'string')
    merged.visitorActions = actions.length > 0 ? actions : ['']
  } else if (typeof visitorActions === 'string') {
    const actions = visitorActions
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean)
    merged.visitorActions = actions.length > 0 ? actions : ['']
  } else {
    merged.visitorActions = ['']
  }

  return merged
}

const COLOR_SWATCHES: Record<ColorPalette, string[]> = {
  'ocean-blues': ['#0B3D5C', '#2E7DA6', '#7EB8D4', '#E8F4F8'],
  'coastal-teal': ['#1A4A4A', '#2A9D8F', '#A8DADC', '#F1FAEE'],
  'warm-earth': ['#4A2C0A', '#B87333', '#E8C4A0', '#FAF3EB'],
  'sunset-coral': ['#8B3A2A', '#E07A5F', '#F2CC8F', '#FDF6F0'],
  'fresh-greens': ['#1B4332', '#40916C', '#95D5B2', '#F0FAF4'],
  'soft-neutrals': ['#3D3D3D', '#8A8580', '#D4CFC8', '#F7F5F2'],
  'charcoal-gold': ['#1C1C1C', '#C9A227', '#E8D5A3', '#F5F2EA'],
  'soft-blush': ['#5C3D4A', '#C97B84', '#F2D5D8', '#FDF8F7'],
  'bright-cheerful': ['#C45C26', '#E9B44C', '#3D8BDB', '#FFF8E7'],
  'deep-jewel': ['#1B263B', '#415A77', '#778DA9', '#E0E1DD'],
  custom: ['#2D2D2D', '#6B6B6B', '#A8A8A8', '#EDEDED'],
}

const SITE_DEPTH_IDS: SiteDepth[] = ['basics', 'a-few-pages', 'fuller-site']
const DESIGN_FEEL_ORDER: DesignFeel[] = [
  'clean-simple',
  'warm-friendly',
  'bold-modern',
  'classic-calm',
  'playful-fun',
  'elegant-refined',
  'rustic-natural',
  'dark-dramatic',
  'airy-light',
  'editorial',
]
const COLOR_PALETTE_ORDER: ColorPalette[] = [
  'ocean-blues',
  'coastal-teal',
  'warm-earth',
  'sunset-coral',
  'fresh-greens',
  'soft-neutrals',
  'charcoal-gold',
  'soft-blush',
  'bright-cheerful',
  'deep-jewel',
  'custom',
]

export function getSiteDepthOptions(dict: Dictionary = en): {
  id: SiteDepth
  title: string
  description: string
}[] {
  return SITE_DEPTH_IDS.map((id) => ({
    id,
    title: dict.introspectOptions.siteDepth[id].title,
    description: dict.introspectOptions.siteDepth[id].description,
  }))
}

export function getDesignFeelOptions(dict: Dictionary = en): {
  id: DesignFeel
  title: string
  description: string
}[] {
  return DESIGN_FEEL_ORDER.map((id) => ({
    id,
    title: dict.introspectOptions.designFeels[id].title,
    description: dict.introspectOptions.designFeels[id].description,
  }))
}

export function getColorPaletteOptions(dict: Dictionary = en): {
  id: ColorPalette
  title: string
  swatches: string[]
}[] {
  return COLOR_PALETTE_ORDER.map((id) => ({
    id,
    title: dict.introspectOptions.colorPalettes[id].title,
    swatches: COLOR_SWATCHES[id],
  }))
}

export function getYesNoUnsure(dict: Dictionary = en): {
  id: YesNoUnsure
  label: string
}[] {
  return [
    { id: 'yes', label: dict.introspectOptions.yesNoUnsure.yes },
    { id: 'no', label: dict.introspectOptions.yesNoUnsure.no },
    { id: 'unsure', label: dict.introspectOptions.yesNoUnsure.unsure },
  ]
}

/** English defaults — prefer get*Options(dict) in UI */
export const SITE_DEPTH_OPTIONS = getSiteDepthOptions(en)
export const DESIGN_FEEL_OPTIONS = getDesignFeelOptions(en)
export const COLOR_PALETTE_OPTIONS = getColorPaletteOptions(en)
export const YES_NO_UNSURE = getYesNoUnsure(en)

/** Map questionnaire answers to a suggested package for Applicreations review. */
export function recommendPlan(
  answers: IntrospectAnswers,
  dict: Dictionary = en
): {
  planId: PlanId
  reason: string
} {
  const plans = getPlans(dict)
  const r = dict.introspectOptions.recommend

  if (answers.selectedPlanId) {
    const name =
      plans.find((p) => p.id === answers.selectedPlanId)?.name ?? answers.selectedPlanId
    return {
      planId: answers.selectedPlanId,
      reason: interpolate(r.choseOnPricing, { name }),
    }
  }

  const actionText = answers.visitorActions.join(' ').toLowerCase()
  const wantsInteractive =
    /order|shop|buy|purchase|account|login|book|reserv|cart|checkout|pedido|comprar|cuenta|reserv/.test(
      actionText
    )

  if (answers.siteDepth === 'fuller-site') {
    return { planId: 'business', reason: r.business }
  }

  if (answers.siteDepth === 'a-few-pages' || wantsInteractive || answers.needsPhotosTaken === 'yes') {
    return {
      planId: 'pro',
      reason: wantsInteractive
        ? r.proInteractive
        : answers.siteDepth === 'a-few-pages'
          ? r.proPages
          : r.proPhotos,
    }
  }

  return { planId: 'basic', reason: r.basic }
}

export function formatAnswersForEmail(
  answers: IntrospectAnswers,
  recommendation: { planId: PlanId; reason: string },
  dict: Dictionary = en
): string {
  const L = dict.introspectOptions.emailLabels
  const depthOptions = getSiteDepthOptions(dict)
  const designOptions = getDesignFeelOptions(dict)
  const colorOptions = getColorPaletteOptions(dict)
  const plans = getPlans(dict)
  const supportPlans = getSupportPlans(dict)

  const depthLabel =
    depthOptions.find((o) => o.id === answers.siteDepth)?.title ||
    answers.siteDepth ||
    L.notAnswered

  const pricingPlanLabel = answers.selectedPlanId
    ? plans.find((p) => p.id === answers.selectedPlanId)?.name ?? answers.selectedPlanId
    : null
  const pricingSupportLabel = answers.selectedSupportId
    ? supportPlans.find((p) => p.id === answers.selectedSupportId)?.name ??
      answers.selectedSupportId
    : null

  const lines = [
    `${L.recommendedPackage}: ${recommendation.planId.toUpperCase()}`,
    `${L.why}: ${recommendation.reason}`,
    '',
    ...(pricingPlanLabel || pricingSupportLabel
      ? [
          `${L.pricingSelection}: ${
            [pricingPlanLabel && `${pricingPlanLabel} ${L.package}`, pricingSupportLabel]
              .filter(Boolean)
              .join(' + ') || L.none
          }`,
          '',
        ]
      : []),
    `${L.name}: ${answers.fullName}`,
    `${L.email}: ${answers.email}`,
    `${L.phone}: ${answers.phone}`,
    `${L.businessProject}: ${answers.businessName}`,
    `${L.location}: ${answers.location}`,
    '',
    `${L.whatItDoes}: ${answers.aboutBusiness}`,
    '',
    `${L.onlinePresence}: ${answers.hasOnlinePresence || L.notAnswered}`,
    `${L.website}: ${answers.websiteUrl.trim() || L.none}`,
    `${L.socialLinks}: ${
      answers.socialMediaLinks.map((l) => l.trim()).filter(Boolean).join(', ') || L.none
    }`,
    `${L.admiredSites}: ${
      answers.admiredWebsiteLinks.map((l) => l.trim()).filter(Boolean).join(', ') || L.none
    }`,
    '',
    `${L.hasLogo}: ${answers.hasLogo || L.notAnswered}`,
    `${L.logoUpload}: ${answers.logoFileName.trim() || L.none}`,
    `${L.hasPhotos}: ${answers.hasPhotos || L.notAnswered}`,
    `${L.photoUploads}: ${
      answers.photoFileNames.map((n) => n.trim()).filter(Boolean).join(', ') || L.none
    }`,
    `${L.needsPhotosTaken}: ${answers.needsPhotosTaken || L.notAnswered}`,
    '',
    `${L.visitorActions}: ${
      answers.visitorActions.map((a) => a.trim()).filter(Boolean).join('; ') || L.none
    }`,
    '',
    `${L.howDeveloped}: ${
      answers.selectedPlanId ? `${depthLabel} ${L.fromPricingSelection}` : depthLabel
    }`,
    `${L.designFeel}: ${
      answers.designFeelNoPreference
        ? L.noPreference
        : answers.designFeels
            .map((id) => designOptions.find((o) => o.id === id)?.title || id)
            .join(', ') || L.notAnswered
    }`,
    `${L.colorPalette}: ${
      answers.colorPaletteFromLogo
        ? L.matchLogo
        : answers.colorPaletteNoPreference
          ? L.noPreference
          : answers.colorPalettes
              .map((id) => colorOptions.find((o) => o.id === id)?.title || id)
              .join(', ') || L.notAnswered
    }`,
    `${L.colorNotes}: ${answers.colorNotes || L.none}`,
    '',
    `${L.steerClearOf}: ${answers.designAvoidances.trim() || L.none}`,
    `${L.anythingElse}: ${answers.businessExtras.trim() || L.none}`,
  ]

  return lines.join('\n')
}

/** Format as (XXX) XXX-XXXX while typing (US). Strips a leading country code 1. */
export function formatPhoneUS(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.length >= 11 && digits.startsWith('1')) {
    digits = digits.slice(1)
  }
  digits = digits.slice(0, 10)

  if (digits.length === 0) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function phoneDigits(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  return digits
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

/** Live email check — quiet until the user has typed something meaningful. */
export function liveEmailError(
  email: string,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): string | undefined {
  const t = email.trim()
  if (!t) return undefined
  if (!t.includes('@')) {
    if (t.length >= 4) return messages.liveEmailAt
    return undefined
  }
  const [, domain = ''] = t.split('@')
  if (!domain.includes('.')) {
    return messages.liveEmailComplete
  }
  if (!EMAIL_RE.test(t)) {
    return messages.liveEmailValid
  }
  return undefined
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}

/** Step 2 — business / project name. */
export const BUSINESS_NAME_MIN = 2
/** Step 2 — what the business does (needs a real phrase, not a keystroke). */
export const ABOUT_BUSINESS_MIN = 10
/** Step 2 — location (city/area; one character is never enough). */
export const LOCATION_MIN = 3

export function businessNameError(
  value: string,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): string | undefined {
  const t = value.trim()
  if (t.length < BUSINESS_NAME_MIN) {
    return messages.businessName
  }
  return undefined
}

export function aboutBusinessError(
  value: string,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): string | undefined {
  const t = value.trim()
  if (t.length === 0) {
    return messages.aboutBusinessEmpty
  }
  if (t.length < ABOUT_BUSINESS_MIN) {
    return messages.aboutBusinessShort
  }
  return undefined
}

export function locationError(
  value: string,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): string | undefined {
  const t = value.trim()
  if (t.length === 0) {
    return messages.locationEmpty
  }
  if (t.length < LOCATION_MIN) {
    return messages.locationShort
  }
  return undefined
}

/** Hard fail: too short or not enough letters. */
export function nameHardError(
  name: string,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): string | undefined {
  const t = name.trim()
  if (t.length < 2) return messages.nameHardShort
  const letters = (t.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) || []).length
  if (letters < 2) return messages.nameHardLetters
  return undefined
}

/**
 * Soft check — looks odd for a person name (digits, weird symbols).
 * Caller should confirm once before continuing.
 */
export function nameLooksSuspicious(name: string): boolean {
  const t = name.trim()
  if (nameHardError(t)) return false
  if (/\d/.test(t)) return true
  // Allow letters (incl. Spanish), spaces, hyphens, apostrophes, periods
  if (/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]/.test(t)) return true
  // Mostly consonants / no space and very short random-looking: optional
  if (t.length >= 3 && !/[aeiouAEIOUáéíóúüÁÉÍÓÚÜ]/.test(t) && !/\s/.test(t)) return true
  return false
}

export const NAME_SOFT_WARNING = en.introspectValidation.nameSoftWarning

export function nameSoftWarning(dict: Dictionary = en): string {
  return dict.introspectValidation.nameSoftWarning
}
