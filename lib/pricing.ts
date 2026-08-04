import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { en } from '@/lib/i18n/dictionaries/en'
import { withLocale } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'

export type PlanId = 'basic' | 'pro' | 'business'

export interface PlanDetailSegment {
  /** Optional line above this segment’s items (e.g. “Common examples:”) */
  lead?: string
  items: string[]
}

export interface PlanDetailGroup {
  id: string
  label: string
  /** Optional line under the label (e.g. “Common examples:”) */
  lead?: string
  items: string[]
  /**
   * Optional multi-part body. When set, rendered instead of top-level lead/items
   * so a group can mix plain bullets with a led example list.
   */
  segments?: PlanDetailSegment[]
}

export interface PricingPlan {
  id: PlanId
  name: string
  price: number
  priceLabel: string
  /** One short line for the landing viewport */
  shortSummary: string
  summary: string
  /** Parallel detail groups — same labels across plans for easy scanning */
  details: PlanDetailGroup[]
  /** Flat feature list (homepage / glance chips) */
  features: string[]
  highlighted?: boolean
  cta: string
  ctaHref: string
}

export type SupportPlanId = 'support' | 'ultimate'

export interface SupportPlan {
  id: SupportPlanId
  name: string
  price: number
  priceLabel: string
  summary: string
  /** Plain-language “why this helps” line for non-technical owners */
  whyItHelps: string
  details: PlanDetailGroup[]
  features: string[]
  highlighted?: boolean
  cta: string
  ctaHref: string
}

const WEBSITE_META: Record<
  PlanId,
  { price: number; priceLabel: string; highlighted?: boolean; hash: string }
> = {
  basic: { price: 600, priceLabel: '$600', highlighted: false, hash: 'basic' },
  pro: { price: 1000, priceLabel: '$1,000', highlighted: true, hash: 'pro' },
  business: {
    price: 3000,
    priceLabel: '$3,000',
    highlighted: false,
    hash: 'business',
  },
}

const SUPPORT_META: Record<
  SupportPlanId,
  { price: number; highlighted?: boolean }
> = {
  support: { price: 50, highlighted: false },
  ultimate: { price: 250, highlighted: true },
}

/** One-time fee to build, deploy on Render, then hand hosting off to the client */
export const BUILD_HANDOFF_FEE = 500

function monthlyPriceLabel(amount: number, locale: Locale = defaultLocale): string {
  const money = `$${amount.toLocaleString('en-US')}`
  return locale === 'es' ? `${money}/mes` : `${money}/month`
}

export function getBasicSupport(
  dict: Dictionary = en,
  locale: Locale = defaultLocale
) {
  return {
    price: 50,
    priceLabel: monthlyPriceLabel(50, locale),
    description: dict.plans.basicSupport.description,
  }
}

/** Ongoing Support — $50/month (English default for non-UI imports) */
export const BASIC_SUPPORT = getBasicSupport(en)

/** @deprecated Use BASIC_SUPPORT */
export const BASIC_HOSTING = BASIC_SUPPORT

export function getPlans(dict: Dictionary = en, locale: Locale = defaultLocale): PricingPlan[] {
  return (['basic', 'pro', 'business'] as const).map((id) => {
    const meta = WEBSITE_META[id]
    const copy = dict.plans.website[id]
    return {
      id,
      name: copy.name,
      price: meta.price,
      priceLabel: meta.priceLabel,
      shortSummary: copy.shortSummary,
      summary: copy.summary,
      details: copy.details,
      features: copy.features,
      highlighted: meta.highlighted,
      cta: copy.cta,
      ctaHref: withLocale(`/pricing#${meta.hash}`, locale),
    }
  })
}

export function getSupportPlans(
  dict: Dictionary = en,
  locale: Locale = defaultLocale
): SupportPlan[] {
  return (['support', 'ultimate'] as const).map((id) => {
    const meta = SUPPORT_META[id]
    const copy = dict.plans.support[id]
    return {
      id,
      name: copy.name,
      price: meta.price,
      priceLabel: monthlyPriceLabel(meta.price, locale),
      summary: copy.summary,
      whyItHelps: copy.whyItHelps,
      details: copy.details,
      features: copy.features,
      highlighted: meta.highlighted,
      cta: copy.cta,
      ctaHref: withLocale('/introspect', locale),
    }
  })
}

/** English defaults — prefer getPlans(dict) in UI */
export const plans: PricingPlan[] = getPlans(en)
export const supportPlans: SupportPlan[] = getSupportPlans(en)

export const PACKAGE_DETAIL_LABELS = [
  en.plans.packageDetailLabels['how-big'],
  en.plans.packageDetailLabels['looks-like'],
  en.plans.packageDetailLabels['customers-use'],
  en.plans.packageDetailLabels['you-manage'],
  en.plans.packageDetailLabels['help-after'],
] as const

export const SUPPORT_DETAIL_LABELS = [
  en.plans.supportDetailLabels['whats-included'],
  en.plans.supportDetailLabels['fix-or-update'],
  en.plans.supportDetailLabels['how-contact'],
  en.plans.supportDetailLabels['who-for'],
] as const

export function formatMoney(amount: number, locale: Locale = defaultLocale): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** sessionStorage key for pricing → Introspect handoff */
export const PRICING_SELECTION_STORAGE_KEY = 'applicreations-pricing-selection'

export type PricingSelectionHandoff = {
  planId: PlanId | null
  supportId: SupportPlanId | null
  /** One-time build & hand off ($500) — mutually exclusive with monthly support */
  buildHandoff: boolean
}

/** Map website package → Introspect siteDepth (step 6 proxy). */
export function planIdToSiteDepth(
  planId: PlanId
): 'basics' | 'a-few-pages' | 'fuller-site' {
  switch (planId) {
    case 'basic':
      return 'basics'
    case 'pro':
      return 'a-few-pages'
    case 'business':
      return 'fuller-site'
  }
}

export function isPlanId(value: unknown): value is PlanId {
  return value === 'basic' || value === 'pro' || value === 'business'
}

export function isSupportPlanId(value: unknown): value is SupportPlanId {
  return value === 'support' || value === 'ultimate'
}

export function buildIntrospectHandoffHref(
  planId: PlanId | null,
  supportId: SupportPlanId | null,
  locale: Locale = defaultLocale,
  buildHandoff = false
): string {
  const params = new URLSearchParams()
  params.set('from', 'pricing')
  if (planId) params.set('plan', planId)
  if (supportId) params.set('support', supportId)
  if (buildHandoff) params.set('handoff', '1')
  return withLocale(`/introspect?${params.toString()}`, locale)
}

export function writePricingSelectionHandoff(
  planId: PlanId | null,
  supportId: SupportPlanId | null,
  buildHandoff = false
): void {
  try {
    const payload: PricingSelectionHandoff = {
      planId,
      supportId: buildHandoff ? null : supportId,
      buildHandoff,
    }
    sessionStorage.setItem(PRICING_SELECTION_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota / private mode */
  }
}

export function readPricingSelectionHandoff(): PricingSelectionHandoff | null {
  try {
    const raw = sessionStorage.getItem(PRICING_SELECTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PricingSelectionHandoff>
    const buildHandoff = parsed.buildHandoff === true
    return {
      planId: isPlanId(parsed.planId) ? parsed.planId : null,
      supportId:
        buildHandoff
          ? null
          : isSupportPlanId(parsed.supportId)
            ? parsed.supportId
            : null,
      buildHandoff,
    }
  } catch {
    return null
  }
}

export type SelectionEmailContent = {
  subject: string
  body: string
  title: string
  rows: { label: string; value: string }[]
  bullets: string[]
  notes: string[]
  signoff: string
  linkHref: string
  linkLabel: string
}

/** Plain-text + structured fields for the client selection email. */
export function formatSelectionForEmail(
  plan: PricingPlan | null,
  support: SupportPlan | null,
  dict: Dictionary = en,
  locale: Locale = defaultLocale,
  buildHandoff = false
): SelectionEmailContent {
  const oneTime = (plan?.price ?? 0) + (buildHandoff ? BUILD_HANDOFF_FEE : 0)
  const monthly = support?.price ?? 0
  const totalLine = [
    plan || buildHandoff
      ? `${formatMoney(oneTime, locale)} ${dict.pricingPage.oneTime}`
      : null,
    support
      ? `${formatMoney(monthly, locale)}${locale === 'es' ? '/mes' : '/mo'}`
      : null,
  ]
    .filter(Boolean)
    .join(' + ')

  const p = dict.pricingPage
  const websiteLine = plan
    ? p.selectionEmailWebsitePackage
        .replace('{name}', plan.name)
        .replace('{price}', plan.priceLabel)
    : p.selectionEmailWebsiteNone
  const careLine = buildHandoff
    ? p.selectionEmailBuildHandoff.replace(
        '{price}',
        formatMoney(BUILD_HANDOFF_FEE, locale)
      )
    : support
      ? p.selectionEmailMonthlyCare
          .replace('{name}', support.name)
          .replace('{price}', support.priceLabel)
      : p.selectionEmailMonthlyNone

  const websiteValue = plan
    ? `${plan.name} — ${plan.priceLabel} ${p.oneTime}`
    : p.noPackage
  const careValue = buildHandoff
    ? p.selectionEmailBuildHandoff
        .replace('{price}', formatMoney(BUILD_HANDOFF_FEE, locale))
        .replace(/^[^:]+:\s*/, '')
    : support
      ? `${support.name} — ${support.priceLabel}`
      : p.noMonthlySupport

  const lines = [
    p.selectionEmailBodyHeader,
    '',
    websiteLine,
    careLine,
    ...(buildHandoff
      ? ['', p.selectionEmailBuildHandoffNote, ...p.goingLiveStep2CancelItems.map((item) => `• ${item}`)]
      : []),
    '',
    p.selectionEmailEstimatedTotal.replace('{total}', totalLine || '$0'),
    '',
    p.selectionEmailZeroDue,
    p.selectionEmailEstimateNote,
    '',
    p.selectionEmailSignoff,
    'https://applicreations.com/pricing',
  ]

  const extras = buildHandoff
    ? p.buildHandoffName
    : support
      ? support.name
      : ''
  const planSubjectName = plan
    ? `${plan.name}${extras ? ` + ${extras}` : ''}`
    : extras

  return {
    subject: plan
      ? p.selectionEmailSubjectWithPlan.replace('{name}', planSubjectName)
      : extras
        ? p.selectionEmailSubjectWithSupport.replace('{name}', extras)
        : p.selectionEmailSubject,
    body: lines.join('\n'),
    title: p.selectionEmailBodyHeader,
    rows: [
      { label: p.selectionEmailWebsiteLabel, value: websiteValue },
      { label: p.selectionEmailMonthlyLabel, value: careValue },
      {
        label: p.selectionEmailTotalLabel,
        value: totalLine || '$0',
      },
    ],
    bullets: buildHandoff ? [...p.goingLiveStep2CancelItems] : [],
    notes: [
      ...(buildHandoff ? [p.selectionEmailBuildHandoffNote] : []),
      p.selectionEmailZeroDue,
      p.selectionEmailEstimateNote,
    ],
    signoff: p.selectionEmailSignoff,
    linkHref: 'https://applicreations.com/pricing',
    linkLabel: p.selectionEmailLinkLabel,
  }
}
