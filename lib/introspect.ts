import type { PlanId, PricingPlan, SupportPlanId } from '@/lib/pricing'
import {
  getPlans,
  getSupportPlans,
  isPlanId,
  isSupportPlanId,
} from '@/lib/pricing'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { en } from '@/lib/i18n/dictionaries/en'
import { interpolate } from '@/lib/i18n/interpolate'
import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { withLocale } from '@/lib/i18n/paths'
import { getSiteUrl } from '@/lib/site'
import {
  countryDisplayName,
  DEFAULT_COUNTRY,
  isCountryCode,
  isLikelyCountryName,
} from '@/lib/countries'
import { matchUsState } from '@/lib/us-places'

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

export type IntrospectVariant = 'new-site' | 'redesign'

export type QuestionId =
  | 'about-you'
  | 'business'
  | 'online'
  | 'logo'
  | 'keep-change'
  | 'visitor-actions'
  | 'site-depth'
  | 'design'
  | 'avoid'
  | 'extras'

export type KeepItem =
  | 'logo'
  | 'colors'
  | 'photos'
  | 'words'
  | 'pages'
  | 'contact'
  | 'start-fresh'

export type ChangePriority =
  | 'looks-old'
  | 'hard-on-phone'
  | 'hard-to-find'
  | 'easier-to-update'
  | 'new-things'
  | 'words-off'
  | 'hard-to-search'
  | 'slow-or-broken'

const NEW_SITE_QUESTIONS: QuestionId[] = [
  'about-you',
  'business',
  'online',
  'logo',
  'visitor-actions',
  'site-depth',
  'design',
  'avoid',
  'extras',
]

const REDESIGN_QUESTIONS: QuestionId[] = [
  'about-you',
  'business',
  'online',
  'logo',
  'keep-change',
  'visitor-actions',
  'site-depth',
  'design',
  'avoid',
  'extras',
]

export function getQuestionSequence(variant: IntrospectVariant): QuestionId[] {
  return variant === 'redesign' ? [...REDESIGN_QUESTIONS] : [...NEW_SITE_QUESTIONS]
}

export function isRedesignVariant(variant: unknown): variant is IntrospectVariant {
  return variant === 'redesign'
}

export const VISITOR_ACTION_IDS = [
  'call-you',
  'email-you',
  'chat',
  'ask-a-question',
  'fill-out-a-form',
  'find-you',
  'get-directions',
  'see-hours',
  'see-what-you-offer',
  'see-prices',
  'see-a-menu',
  'see-a-portfolio',
  'see-photos',
  'browse-a-gallery',
  'watch-a-video',
  'listen',
  'meet-the-people',
  'read-about-you',
  'see-events',
  'see-a-calendar',
  'read-updates',
  'read-stories',
  'search-the-site',
  'download-a-file',
  'book-a-visit',
  'make-a-reservation',
  'schedule-an-appointment',
  'sign-up-for-a-class',
  'rsvp',
  'volunteer',
  'buy-something',
  'place-an-order',
  'pay-online',
  'request-a-quote',
  'donate',
  'apply',
  'create-an-account',
  'join-email-list',
  'share',
  'leave-a-review',
] as const

export type VisitorAction = (typeof VISITOR_ACTION_IDS)[number]

const VISITOR_ACTION_ID_SET = new Set<string>(VISITOR_ACTION_IDS)

function isVisitorAction(value: string): value is VisitorAction {
  return VISITOR_ACTION_ID_SET.has(value)
}

export type IntrospectAnswers = {
  fullName: string
  email: string
  phone: string
  businessName: string
  aboutBusiness: string
  /** Combined "City, State, Country" for display / older drafts. */
  location: string
  city: string
  state: string
  /** ISO 3166-1 alpha-2; defaults to United States. */
  country: string
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
  visitorActions: VisitorAction[]
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
  /** Which Introspect entry the client used. */
  variant: IntrospectVariant
  /** Redesign — what to honor from the current site. */
  keepItems: KeepItem[]
  /** Redesign — what needs to change the most. */
  changePriorities: ChangePriority[]
  /** Redesign — keep the current site’s overall look. */
  keepCurrentLook: boolean
  /** Redesign — optional notes about the current site. */
  currentSiteNotes: string
  /** Carried from /pricing when the client already chose a package. */
  selectedPlanId: PlanId | ''
  /** Carried from /pricing when the client already chose monthly care. */
  selectedSupportId: SupportPlanId | ''
  /** Carried from /pricing when the client chose one-time build & hand off. */
  selectedBuildHandoff: boolean
}

export const emptyAnswers: IntrospectAnswers = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  aboutBusiness: '',
  location: '',
  city: '',
  state: '',
  country: DEFAULT_COUNTRY,
  hasOnlinePresence: '',
  websiteUrl: '',
  socialMediaLinks: [''],
  admiredWebsiteLinks: [''],
  hasLogo: '',
  hasPhotos: '',
  needsPhotosTaken: '',
  logoFileName: '',
  photoFileNames: [],
  visitorActions: [],
  siteDepth: '',
  designFeels: [],
  designFeelNoPreference: false,
  colorPalettes: [],
  colorPaletteNoPreference: false,
  colorPaletteFromLogo: false,
  colorNotes: '',
  designAvoidances: '',
  businessExtras: '',
  variant: 'new-site',
  keepItems: [],
  changePriorities: [],
  keepCurrentLook: false,
  currentSiteNotes: '',
  selectedPlanId: '',
  selectedSupportId: '',
  selectedBuildHandoff: false,
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

const KEEP_ITEM_IDS = new Set<string>([
  'logo',
  'colors',
  'photos',
  'words',
  'pages',
  'contact',
  'start-fresh',
])

const CHANGE_PRIORITY_IDS = new Set<string>([
  'looks-old',
  'hard-on-phone',
  'hard-to-find',
  'easier-to-update',
  'new-things',
  'words-off',
  'hard-to-search',
  'slow-or-broken',
])

function asKeepItemList(value: unknown): KeepItem[] {
  if (!Array.isArray(value)) return []
  return value.filter((id): id is KeepItem => typeof id === 'string' && KEEP_ITEM_IDS.has(id))
}

function asChangePriorityList(value: unknown): ChangePriority[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (id): id is ChangePriority => typeof id === 'string' && CHANGE_PRIORITY_IDS.has(id)
  )
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

function splitLegacyLocation(location: string): { city: string; state: string } {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  while (parts.length > 0 && isLikelyCountryName(parts[parts.length - 1] ?? '')) {
    parts.pop()
  }
  if (parts.length >= 2) {
    return { city: parts[0] ?? '', state: parts.slice(1).join(', ') }
  }
  const only = parts[0] ?? ''
  if (!only) return { city: '', state: '' }
  if (matchUsState(only)) return { city: '', state: only }
  if (isLikelyCountryName(only)) return { city: '', state: '' }
  return { city: only, state: '' }
}

function applyLegacyLocation(
  merged: IntrospectAnswers,
  parsed: Pick<LegacyDraft, 'location' | 'city' | 'state'>
) {
  const hasStructured =
    (typeof parsed.city === 'string' && parsed.city.trim().length > 0) ||
    (typeof parsed.state === 'string' && parsed.state.trim().length > 0)
  if (
    !hasStructured &&
    typeof parsed.location === 'string' &&
    parsed.location.trim().length > 0
  ) {
    const split = splitLegacyLocation(parsed.location)
    merged.city = split.city
    merged.state = split.state
  }
  merged.city = typeof merged.city === 'string' ? merged.city : ''
  merged.state = typeof merged.state === 'string' ? merged.state : ''
  if (isLikelyCountryName(merged.city)) {
    merged.city = ''
  }
  const matchedState = matchUsState(merged.state)
  if (matchedState) {
    merged.state = matchedState.name
  } else if (isLikelyCountryName(merged.state)) {
    merged.state = ''
  }
  merged.location = formatLocation(merged)
}

export function formatLocation(
  answers: Pick<IntrospectAnswers, 'city' | 'state' | 'country'>,
  locale: Locale = defaultLocale
): string {
  const country = isCountryCode(answers.country)
    ? countryDisplayName(answers.country, locale)
    : ''
  return [answers.city.trim(), answers.state.trim(), country].filter(Boolean).join(', ')
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
    variant: parsed.variant === 'redesign' ? 'redesign' : 'new-site',
    keepItems: asKeepItemList(parsed.keepItems),
    changePriorities: asChangePriorityList(parsed.changePriorities),
    keepCurrentLook: Boolean(parsed.keepCurrentLook),
    currentSiteNotes:
      typeof parsed.currentSiteNotes === 'string' ? parsed.currentSiteNotes : '',
    selectedPlanId: isPlanId(parsed.selectedPlanId) ? parsed.selectedPlanId : '',
    selectedSupportId: isSupportPlanId(parsed.selectedSupportId)
      ? parsed.selectedSupportId
      : '',
    selectedBuildHandoff: parsed.selectedBuildHandoff === true,
    country: isCountryCode(parsed.country) ? parsed.country : DEFAULT_COUNTRY,
  }

  applyLegacyLocation(merged, parsed)

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
    merged.visitorActions = visitorActions.filter(
      (a): a is VisitorAction => typeof a === 'string' && isVisitorAction(a)
    )
  } else if (typeof visitorActions === 'string') {
    merged.visitorActions = visitorActions
      .split(/[\n,;]/)
      .map((a) => a.trim())
      .filter(isVisitorAction)
  } else {
    merged.visitorActions = []
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

const KEEP_ITEM_ORDER: KeepItem[] = [
  'logo',
  'colors',
  'photos',
  'words',
  'pages',
  'contact',
  'start-fresh',
]
const CHANGE_PRIORITY_ORDER: ChangePriority[] = [
  'looks-old',
  'hard-on-phone',
  'hard-to-find',
  'easier-to-update',
  'new-things',
  'words-off',
  'hard-to-search',
  'slow-or-broken',
]

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

export function getVisitorActionOptions(dict: Dictionary = en): {
  id: VisitorAction
  label: string
}[] {
  return VISITOR_ACTION_IDS.map((id) => ({
    id,
    label: dict.introspectOptions.visitorActions[id],
  }))
}

export function formatVisitorActionLabels(
  ids: readonly string[],
  dict: Dictionary = en,
  fallback = ''
): string {
  const labels = ids
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) =>
      isVisitorAction(id) ? dict.introspectOptions.visitorActions[id] : id
    )
  return labels.length > 0 ? labels.join(', ') : fallback
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

export function getKeepItemOptions(dict: Dictionary = en): {
  id: KeepItem
  label: string
}[] {
  return KEEP_ITEM_ORDER.map((id) => ({
    id,
    label: dict.introspectOptions.keepItems[id],
  }))
}

export function getChangePriorityOptions(dict: Dictionary = en): {
  id: ChangePriority
  label: string
}[] {
  return CHANGE_PRIORITY_ORDER.map((id) => ({
    id,
    label: dict.introspectOptions.changePriorities[id],
  }))
}

export function formatKeepItemLabels(
  ids: readonly string[],
  dict: Dictionary = en,
  fallback = ''
): string {
  const labels = ids
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) =>
      KEEP_ITEM_IDS.has(id) ? dict.introspectOptions.keepItems[id as KeepItem] : id
    )
  return labels.length > 0 ? labels.join(', ') : fallback
}

export function formatChangePriorityLabels(
  ids: readonly string[],
  dict: Dictionary = en,
  fallback = ''
): string {
  const labels = ids
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) =>
      CHANGE_PRIORITY_IDS.has(id)
        ? dict.introspectOptions.changePriorities[id as ChangePriority]
        : id
    )
  return labels.length > 0 ? labels.join(', ') : fallback
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
    /order|shop|buy|purchase|account|login|book|reserv|cart|checkout|pay-online|donate|appointment|pedido|comprar|cuenta|reserv/.test(
      actionText
    )

  if (answers.siteDepth === 'fuller-site') {
    return { planId: 'pro', reason: r.pro }
  }

  if (answers.siteDepth === 'a-few-pages' || wantsInteractive || answers.needsPhotosTaken === 'yes') {
    return {
      planId: 'business',
      reason: wantsInteractive
        ? r.businessInteractive
        : answers.siteDepth === 'a-few-pages'
          ? r.businessPages
          : r.businessPhotos,
    }
  }

  return { planId: 'basic', reason: r.basic }
}

export function formatAnswersForEmail(
  answers: IntrospectAnswers,
  recommendation: { planId: PlanId; reason: string },
  dict: Dictionary = en,
  locale: Locale = defaultLocale
): string {
  const L = dict.introspectOptions.emailLabels
  const depthOptions = getSiteDepthOptions(dict)
  const designOptions = getDesignFeelOptions(dict)
  const colorOptions = getColorPaletteOptions(dict)
  const plans = getPlans(dict, locale)
  const supportPlans = getSupportPlans(dict, locale)

  const depthLabel =
    depthOptions.find((o) => o.id === answers.siteDepth)?.title ||
    answers.siteDepth ||
    L.notAnswered

  const pricingPlanLabel = answers.selectedPlanId
    ? plans.find((p) => p.id === answers.selectedPlanId)?.name ?? answers.selectedPlanId
    : null
  const pricingSupportLabel = answers.selectedBuildHandoff
    ? dict.pricingPage.buildHandoffName
    : answers.selectedSupportId
      ? supportPlans.find((p) => p.id === answers.selectedSupportId)?.name ??
        answers.selectedSupportId
      : null

  const lines = [
    ...(answers.variant === 'redesign' ? [`${L.flow}: ${L.flowRedesign}`, ''] : []),
    `${L.recommendedPackage}: ${formatPlanNameWithPrice(recommendation.planId, plans, dict.pricingPage.oneTime)}`,
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
    `${L.location}: ${formatLocation(answers, locale)}`,
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
    ...(answers.variant === 'redesign'
      ? [
          `${L.keepItems}: ${formatKeepItemLabels(answers.keepItems, dict, L.none)}`,
          `${L.changePriorities}: ${formatChangePriorityLabels(answers.changePriorities, dict, L.none)}`,
          `${L.currentSiteNotes}: ${answers.currentSiteNotes.trim() || L.none}`,
          '',
        ]
      : []),
    `${L.hasLogo}: ${answers.hasLogo || L.notAnswered}`,
    `${L.logoUpload}: ${answers.logoFileName.trim() || L.none}`,
    `${L.hasPhotos}: ${answers.hasPhotos || L.notAnswered}`,
    `${L.photoUploads}: ${
      answers.photoFileNames.map((n) => n.trim()).filter(Boolean).join(', ') || L.none
    }`,
    `${L.needsPhotosTaken}: ${answers.needsPhotosTaken || L.notAnswered}`,
    '',
    `${L.visitorActions}: ${
      formatVisitorActionLabels(answers.visitorActions, dict, L.none)
    }`,
    '',
    `${L.howDeveloped}: ${
      answers.selectedPlanId ? `${depthLabel} ${L.fromPricingSelection}` : depthLabel
    }`,
    `${L.designFeel}: ${
      answers.keepCurrentLook
        ? L.keepCurrentLook
        : answers.designFeelNoPreference
          ? L.noPreference
          : answers.designFeels
              .map((id) => designOptions.find((o) => o.id === id)?.title || id)
              .join(', ') || L.notAnswered
    }`,
    `${L.colorPalette}: ${
      answers.keepCurrentLook
        ? L.keepCurrentLook
        : answers.colorPaletteFromLogo
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

/** Short branded confirmation for the client (not the full owner dump). */
function joinTrimmed(items: string[], fallback: string): string {
  const joined = items.map((s) => s.trim()).filter(Boolean).join(', ')
  return joined || fallback
}

type IntrospectEmailLabelKey = keyof typeof en.introspectOptions.emailLabels

function introspectLabel(dict: Dictionary, key: IntrospectEmailLabelKey): string {
  return (
    dict.introspectOptions.emailLabels[key] ??
    en.introspectOptions.emailLabels[key] ??
    key
  )
}

function formatYesNo(value: YesNoUnsure | '', dict: Dictionary): string {
  if (!value) return introspectLabel(dict, 'notAnswered')
  return dict.introspectOptions.yesNoUnsure[value] ?? value
}

function formatPlanNameWithPrice(
  planId: PlanId,
  plans: PricingPlan[],
  oneTimeLabel: string
): string {
  const plan = plans.find((p) => p.id === planId)
  if (!plan) return planId.toUpperCase()
  const price = plan.contactForPricing
    ? plan.priceLabel
    : `${plan.priceLabel} ${oneTimeLabel}`
  return `${plan.name} — ${price}`
}

export function buildIntrospectClientSections(
  answers: IntrospectAnswers,
  recommendation: { planId: PlanId; reason: string },
  dict: Dictionary = en,
  locale: Locale = defaultLocale
): { title: string; rows: { label: string; value: string; accent?: boolean }[] }[] {
  const L = (key: IntrospectEmailLabelKey) => introspectLabel(dict, key)
  const api = dict.api.introspect
  const depthOptions = getSiteDepthOptions(dict)
  const designOptions = getDesignFeelOptions(dict)
  const colorOptions = getColorPaletteOptions(dict)
  const plans = getPlans(dict, locale)
  const supportPlans = getSupportPlans(dict, locale)

  const recommendedName = formatPlanNameWithPrice(
    recommendation.planId,
    plans,
    dict.pricingPage.oneTime
  )

  const pricingPlanLabel = answers.selectedPlanId
    ? plans.find((p) => p.id === answers.selectedPlanId)?.name ?? answers.selectedPlanId
    : null
  const pricingSupportLabel = answers.selectedBuildHandoff
    ? dict.pricingPage.buildHandoffName
    : answers.selectedSupportId
      ? supportPlans.find((p) => p.id === answers.selectedSupportId)?.name ??
        answers.selectedSupportId
      : null
  const pricingSelection =
    [pricingPlanLabel && `${pricingPlanLabel} ${L('package')}`, pricingSupportLabel]
      .filter(Boolean)
      .join(' + ') || null

  const depthLabel =
    depthOptions.find((o) => o.id === answers.siteDepth)?.title ||
    answers.siteDepth ||
    L('notAnswered')

  const designFeelValue = answers.keepCurrentLook
    ? L('keepCurrentLook')
    : answers.designFeelNoPreference
      ? L('noPreference')
      : joinTrimmed(
          answers.designFeels.map(
            (id) => designOptions.find((o) => o.id === id)?.title || id
          ),
          L('notAnswered')
        )

  const colorPaletteValue = answers.keepCurrentLook
    ? L('keepCurrentLook')
    : answers.colorPaletteFromLogo
      ? L('matchLogo')
      : answers.colorPaletteNoPreference
        ? L('noPreference')
        : joinTrimmed(
            answers.colorPalettes.map(
              (id) => colorOptions.find((o) => o.id === id)?.title || id
            ),
            L('notAnswered')
          )

  const howDevelopedValue = answers.selectedPlanId
    ? `${depthLabel} ${L('fromPricingSelection')}`
    : depthLabel

  const recommendationRows: { label: string; value: string; accent?: boolean }[] = [
    { label: api.clientEmailRecommendedLabel, value: recommendedName, accent: true },
    { label: L('why'), value: recommendation.reason },
  ]
  if (pricingSelection) {
    recommendationRows.push({
      label: api.clientEmailPricingLabel,
      value: pricingSelection,
      accent: true,
    })
  }

  return [
    {
      title: api.clientEmailSectionRecommendation,
      rows: recommendationRows,
    },
    {
      title: api.clientEmailSectionContact,
      rows: [
        { label: L('name'), value: answers.fullName.trim() },
        { label: L('email'), value: answers.email.trim() },
        { label: L('phone'), value: answers.phone.trim() },
        { label: L('businessProject'), value: answers.businessName.trim() },
        { label: L('location'), value: formatLocation(answers, locale) },
        { label: L('whatItDoes'), value: answers.aboutBusiness.trim() },
      ],
    },
    {
      title: api.clientEmailSectionOnline,
      rows: [
        ...(answers.variant === 'redesign'
          ? []
          : [
              {
                label: L('onlinePresence'),
                value: formatYesNo(answers.hasOnlinePresence, dict),
              },
            ]),
        { label: L('website'), value: answers.websiteUrl.trim() || L('none') },
        {
          label: L('socialLinks'),
          value: joinTrimmed(answers.socialMediaLinks, L('none')),
        },
        {
          label: L('admiredSites'),
          value: joinTrimmed(answers.admiredWebsiteLinks, L('none')),
        },
      ],
    },
    ...(answers.variant === 'redesign'
      ? [
          {
            title: api.clientEmailSectionKeepChange,
            rows: [
              {
                label: L('keepItems'),
                value: formatKeepItemLabels(answers.keepItems, dict, L('none')),
              },
              {
                label: L('changePriorities'),
                value: formatChangePriorityLabels(answers.changePriorities, dict, L('none')),
              },
              {
                label: L('currentSiteNotes'),
                value: answers.currentSiteNotes.trim() || L('none'),
              },
            ],
          },
        ]
      : []),
    {
      title: api.clientEmailSectionAssets,
      rows: [
        { label: L('hasLogo'), value: formatYesNo(answers.hasLogo, dict) },
        { label: L('logoUpload'), value: answers.logoFileName.trim() || L('none') },
        { label: L('hasPhotos'), value: formatYesNo(answers.hasPhotos, dict) },
        {
          label: L('photoUploads'),
          value: joinTrimmed(answers.photoFileNames, L('none')),
        },
        {
          label: L('needsPhotosTaken'),
          value: formatYesNo(answers.needsPhotosTaken, dict),
        },
      ],
    },
    {
      title: api.clientEmailSectionDirection,
      rows: [
        {
          label: L('visitorActions'),
          value: formatVisitorActionLabels(answers.visitorActions, dict, L('none')),
        },
        { label: L('howDeveloped'), value: howDevelopedValue },
        { label: L('designFeel'), value: designFeelValue },
        { label: L('colorPalette'), value: colorPaletteValue },
        { label: L('colorNotes'), value: answers.colorNotes.trim() || L('none') },
        {
          label: L('steerClearOf'),
          value: answers.designAvoidances.trim() || L('none'),
        },
        {
          label: L('anythingElse'),
          value: answers.businessExtras.trim() || L('none'),
        },
      ],
    },
  ]
}

export function formatClientIntrospectEmail(
  answers: IntrospectAnswers,
  recommendation: { planId: PlanId; reason: string },
  dict: Dictionary = en,
  locale: Locale = defaultLocale
): {
  subject: string
  text: string
  title: string
  intro: string
  sections: { title: string; rows: { label: string; value: string; accent?: boolean }[] }[]
  signoff: string
  linkHref: string
  linkLabel: string
  footer: string
} {
  const api = dict.api.introspect
  const redesign = answers.variant === 'redesign'
  const sections = buildIntrospectClientSections(answers, recommendation, dict, locale)
  const fullSummary = formatAnswersForEmail(answers, recommendation, dict, locale)
  const path = redesign ? '/redesign' : '/introspect'

  const text = [
    redesign ? api.clientEmailTitleRedesign : api.clientEmailTitle,
    '',
    redesign ? api.clientEmailIntroRedesign : api.clientEmailIntro,
    '',
    fullSummary,
    '',
    api.clientEmailSignoff,
    `${getSiteUrl()}${withLocale(path, locale)}`,
  ].join('\n')

  return {
    subject: redesign ? api.clientEmailSubjectRedesign : api.clientEmailSubject,
    text,
    title: redesign ? api.clientEmailTitleRedesign : api.clientEmailTitle,
    intro: redesign ? api.clientEmailIntroRedesign : api.clientEmailIntro,
    sections,
    signoff: api.clientEmailSignoff,
    linkHref: `${getSiteUrl()}${withLocale(path, locale)}`,
    linkLabel: api.clientEmailLinkLabel,
    footer: api.emailQuestions,
  }
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

/**
 * Accept a typed website/social entry without requiring https://.
 * `aptlycreations.com` becomes `https://aptlycreations.com`. Empty stays empty.
 * Does not reject input — @handles and odd notes are left as typed.
 */
export function normalizeWebsiteEntry(raw: string): string {
  const value = raw.trim()
  if (!value) return ''

  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`
  if (value.startsWith('@')) return value

  if (!/\s/.test(value) && value.includes('.')) {
    return `https://${value}`
  }

  return value
}

export function withNormalizedWebsiteUrls(
  answers: IntrospectAnswers
): IntrospectAnswers {
  const social = answers.socialMediaLinks.map(normalizeWebsiteEntry)
  const admired = answers.admiredWebsiteLinks.map(normalizeWebsiteEntry)
  return {
    ...answers,
    websiteUrl: normalizeWebsiteEntry(answers.websiteUrl),
    socialMediaLinks: social.length > 0 ? social : [''],
    admiredWebsiteLinks: admired.length > 0 ? admired : [''],
  }
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

/** Redesign step — current site URL is required. */
export function websiteUrlRequiredError(
  value: string,
  message: string
): string | undefined {
  const normalized = normalizeWebsiteEntry(value)
  if (!normalized || !normalized.includes('.')) return message
  return undefined
}

/** Step 2 — business / project name. */
export const BUSINESS_NAME_MIN = 2
/** Step 2 — what the business does (needs a real phrase, not a keystroke). */
export const ABOUT_BUSINESS_MIN = 10
/** Step 2 — city (one character is never enough). */
export const LOCATION_CITY_MIN = 2

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

export function locationFieldErrors(
  answers: Pick<IntrospectAnswers, 'city' | 'state' | 'country'>,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): Partial<Record<'city' | 'state' | 'country', string>> {
  const errors: Partial<Record<'city' | 'state' | 'country', string>> = {}
  const city = answers.city.trim()
  if (city.length === 0 || isLikelyCountryName(city)) {
    errors.city = messages.locationCityEmpty
  } else if (city.length < LOCATION_CITY_MIN) {
    errors.city = messages.locationCityShort
  }

  const state = answers.state.trim()
  const country = isCountryCode(answers.country) ? answers.country : ''
  if (!country) {
    errors.country = messages.locationCountryEmpty
  }
  if (country === DEFAULT_COUNTRY && !matchUsState(state)) {
    errors.state = messages.locationStateEmpty
  }

  return errors
}

export function locationError(
  answers: Pick<IntrospectAnswers, 'city' | 'state' | 'country'>,
  messages: Dictionary['introspectValidation'] = en.introspectValidation
): string | undefined {
  const fields = locationFieldErrors(answers, messages)
  return fields.city ?? fields.state ?? fields.country
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
