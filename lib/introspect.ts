import type { PlanId, SupportPlanId } from '@/lib/pricing'
import { isPlanId, isSupportPlanId, plans, supportPlans } from '@/lib/pricing'

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

export const SITE_DEPTH_OPTIONS: {
  id: SiteDepth
  title: string
  description: string
}[] = [
  {
    id: 'basics',
    title: 'The basics',
    description:
      'One clear page: who you are, what you offer, hours or details that matter, and how people reach you.',
  },
  {
    id: 'a-few-pages',
    title: 'A few pages and some tools',
    description:
      'A small set of pages with room to breathe — for example Home, About, Services or Menu, Gallery, and Contact.',
  },
  {
    id: 'fuller-site',
    title: 'The ultimate site, custom tools and more',
    description:
      'Multiple pages plus things people (or you) interact with — like ordering, booking, accounts, or tools to update the site. Custom features built around how you work fit here too.',
  },
]

export const DESIGN_FEEL_OPTIONS: {
  id: DesignFeel
  title: string
  description: string
}[] = [
  {
    id: 'clean-simple',
    title: 'Clean & simple',
    description: 'Open space, easy reading',
  },
  {
    id: 'warm-friendly',
    title: 'Warm & friendly',
    description: 'Welcoming, neighborhood feel',
  },
  {
    id: 'bold-modern',
    title: 'Bold & modern',
    description: 'Strong contrast, clear shapes',
  },
  {
    id: 'classic-calm',
    title: 'Classic & calm',
    description: 'Steady, polished, timeless',
  },
  {
    id: 'playful-fun',
    title: 'Playful & fun',
    description: 'Lighthearted, energetic',
  },
  {
    id: 'elegant-refined',
    title: 'Elegant & refined',
    description: 'Quiet luxury, careful detail',
  },
  {
    id: 'rustic-natural',
    title: 'Rustic & natural',
    description: 'Organic, grounded, handmade',
  },
  {
    id: 'dark-dramatic',
    title: 'Dark & dramatic',
    description: 'Moody, high impact',
  },
  {
    id: 'airy-light',
    title: 'Airy & light',
    description: 'Bright, breezy, open',
  },
  {
    id: 'editorial',
    title: 'Editorial',
    description: 'Magazine-like, expressive type',
  },
]

export const COLOR_PALETTE_OPTIONS: {
  id: ColorPalette
  title: string
  swatches: string[]
}[] = [
  {
    id: 'ocean-blues',
    title: 'Ocean blues',
    swatches: ['#0B3D5C', '#2E7DA6', '#7EB8D4', '#E8F4F8'],
  },
  {
    id: 'coastal-teal',
    title: 'Coastal teal',
    swatches: ['#1A4A4A', '#2A9D8F', '#A8DADC', '#F1FAEE'],
  },
  {
    id: 'warm-earth',
    title: 'Warm earth',
    swatches: ['#4A2C0A', '#B87333', '#E8C4A0', '#FAF3EB'],
  },
  {
    id: 'sunset-coral',
    title: 'Sunset coral',
    swatches: ['#8B3A2A', '#E07A5F', '#F2CC8F', '#FDF6F0'],
  },
  {
    id: 'fresh-greens',
    title: 'Fresh greens',
    swatches: ['#1B4332', '#40916C', '#95D5B2', '#F0FAF4'],
  },
  {
    id: 'soft-neutrals',
    title: 'Soft neutrals',
    swatches: ['#3D3D3D', '#8A8580', '#D4CFC8', '#F7F5F2'],
  },
  {
    id: 'charcoal-gold',
    title: 'Charcoal & gold',
    swatches: ['#1C1C1C', '#C9A227', '#E8D5A3', '#F5F2EA'],
  },
  {
    id: 'soft-blush',
    title: 'Soft blush',
    swatches: ['#5C3D4A', '#C97B84', '#F2D5D8', '#FDF8F7'],
  },
  {
    id: 'bright-cheerful',
    title: 'Bright & cheerful',
    swatches: ['#C45C26', '#E9B44C', '#3D8BDB', '#FFF8E7'],
  },
  {
    id: 'deep-jewel',
    title: 'Deep jewel',
    swatches: ['#1B263B', '#415A77', '#778DA9', '#E0E1DD'],
  },
  {
    id: 'custom',
    title: 'I have my own',
    swatches: ['#2D2D2D', '#6B6B6B', '#A8A8A8', '#EDEDED'],
  },
]

export const YES_NO_UNSURE: { id: YesNoUnsure; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: 'Not sure' },
]

/** Map questionnaire answers to a suggested package for Applicreations review. */
export function recommendPlan(answers: IntrospectAnswers): {
  planId: PlanId
  reason: string
} {
  if (answers.selectedPlanId) {
    const name =
      plans.find((p) => p.id === answers.selectedPlanId)?.name ?? answers.selectedPlanId
    return {
      planId: answers.selectedPlanId,
      reason: `Client already chose ${name} on the pricing page.`,
    }
  }

  const actionText = answers.visitorActions.join(' ').toLowerCase()
  const wantsInteractive = /order|shop|buy|purchase|account|login|book|reserv|cart|checkout/.test(
    actionText
  )

  if (answers.siteDepth === 'fuller-site') {
    return {
      planId: 'business',
      reason:
        'You described a fuller site with interactive pieces or custom tools — that usually fits Business.',
    }
  }

  if (answers.siteDepth === 'a-few-pages' || wantsInteractive || answers.needsPhotosTaken === 'yes') {
    return {
      planId: 'pro',
      reason: wantsInteractive
        ? 'You want visitors to do more than read (order, book, accounts, etc.) — that usually fits Pro.'
        : answers.siteDepth === 'a-few-pages'
          ? 'A multi-page site usually fits Pro.'
          : 'A site that needs new photos or more room to grow usually fits Pro.',
    }
  }

  return {
    planId: 'basic',
    reason: 'A clear one-page site with the essentials usually fits Basic.',
  }
}

export function formatAnswersForEmail(
  answers: IntrospectAnswers,
  recommendation: { planId: PlanId; reason: string }
): string {
  const depthLabel =
    SITE_DEPTH_OPTIONS.find((o) => o.id === answers.siteDepth)?.title ||
    answers.siteDepth ||
    '(not answered)'

  const pricingPlanLabel = answers.selectedPlanId
    ? plans.find((p) => p.id === answers.selectedPlanId)?.name ?? answers.selectedPlanId
    : null
  const pricingSupportLabel = answers.selectedSupportId
    ? supportPlans.find((p) => p.id === answers.selectedSupportId)?.name ??
      answers.selectedSupportId
    : null

  const lines = [
    `Recommended package: ${recommendation.planId.toUpperCase()}`,
    `Why: ${recommendation.reason}`,
    '',
    ...(pricingPlanLabel || pricingSupportLabel
      ? [
          `Pricing page selection: ${
            [pricingPlanLabel && `${pricingPlanLabel} package`, pricingSupportLabel]
              .filter(Boolean)
              .join(' + ') || '(none)'
          }`,
          '',
        ]
      : []),
    `Name: ${answers.fullName}`,
    `Email: ${answers.email}`,
    `Phone: ${answers.phone}`,
    `Business / project: ${answers.businessName}`,
    `Location: ${answers.location}`,
    '',
    `What it does / offers: ${answers.aboutBusiness}`,
    '',
    `Online presence: ${answers.hasOnlinePresence || '(not answered)'}`,
    `Website: ${answers.websiteUrl.trim() || '(none)'}`,
    `Social links: ${
      answers.socialMediaLinks.map((l) => l.trim()).filter(Boolean).join(', ') || '(none)'
    }`,
    `Admired sites: ${
      answers.admiredWebsiteLinks.map((l) => l.trim()).filter(Boolean).join(', ') || '(none)'
    }`,
    '',
    `Has logo: ${answers.hasLogo || '(not answered)'}`,
    `Logo upload: ${answers.logoFileName.trim() || '(none)'}`,
    `Has photos: ${answers.hasPhotos || '(not answered)'}`,
    `Photo uploads: ${
      answers.photoFileNames.map((n) => n.trim()).filter(Boolean).join(', ') || '(none)'
    }`,
    `Needs photos taken: ${answers.needsPhotosTaken || '(not answered)'}`,
    '',
    `What people should be able to do: ${
      answers.visitorActions.map((a) => a.trim()).filter(Boolean).join('; ') || '(none)'
    }`,
    '',
    `How developed: ${
      answers.selectedPlanId ? `${depthLabel} (from pricing selection)` : depthLabel
    }`,
    `Design feel: ${
      answers.designFeelNoPreference
        ? 'No preference — you decide'
        : answers.designFeels
            .map((id) => DESIGN_FEEL_OPTIONS.find((o) => o.id === id)?.title || id)
            .join(', ') || '(not answered)'
    }`,
    `Color palette: ${
      answers.colorPaletteFromLogo
        ? 'Match colors from my logo'
        : answers.colorPaletteNoPreference
          ? 'No preference — you decide'
          : answers.colorPalettes
              .map((id) => COLOR_PALETTE_OPTIONS.find((o) => o.id === id)?.title || id)
              .join(', ') || '(not answered)'
    }`,
    `Color notes: ${answers.colorNotes || '(none)'}`,
    '',
    `Things to steer clear of: ${
      answers.designAvoidances.trim() || '(none)'
    }`,
    `Anything else about the business: ${
      answers.businessExtras.trim() || '(none)'
    }`,
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
export function liveEmailError(email: string): string | undefined {
  const t = email.trim()
  if (!t) return undefined
  if (!t.includes('@')) {
    if (t.length >= 4) return 'Please include an @ in your email'
    return undefined
  }
  const [, domain = ''] = t.split('@')
  if (!domain.includes('.')) {
    return 'Please enter a complete email (like jane@example.com)'
  }
  if (!EMAIL_RE.test(t)) {
    return 'Please enter a valid email (like jane@example.com)'
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

export function businessNameError(value: string): string | undefined {
  const t = value.trim()
  if (t.length < BUSINESS_NAME_MIN) {
    return 'Please enter the name of your business or project'
  }
  return undefined
}

export function aboutBusinessError(value: string): string | undefined {
  const t = value.trim()
  if (t.length === 0) {
    return 'Please tell us what your business or project does'
  }
  if (t.length < ABOUT_BUSINESS_MIN) {
    return 'Please add a bit more — a short sentence helps us get started'
  }
  return undefined
}

export function locationError(value: string): string | undefined {
  const t = value.trim()
  if (t.length === 0) {
    return 'Please tell us where you are located'
  }
  if (t.length < LOCATION_MIN) {
    return 'Please enter a real place — city, town, or area you serve'
  }
  return undefined
}

/** Hard fail: too short or not enough letters. */
export function nameHardError(name: string): string | undefined {
  const t = name.trim()
  if (t.length < 2) return 'Please enter your name'
  const letters = (t.match(/[A-Za-z]/g) || []).length
  if (letters < 2) return 'Please enter a real name (letters, not just numbers or symbols)'
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
  // Allow letters, spaces, hyphens, apostrophes, periods
  if (/[^A-Za-z\s.'-]/.test(t)) return true
  // Mostly consonants / no space and very short random-looking: optional
  if (t.length >= 3 && !/[aeiouAEIOU]/.test(t) && !/\s/.test(t)) return true
  return false
}

export const NAME_SOFT_WARNING =
  "Hey — are you sure that's your name? Just double-checking."
