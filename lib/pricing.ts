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
  { price: number; priceLabel: string; highlighted?: boolean }
> = {
  support: { price: 50, priceLabel: '$50/month', highlighted: false },
  ultimate: { price: 250, priceLabel: '$250/month', highlighted: true },
}

export function getBasicSupport(dict: Dictionary = en) {
  return {
    price: 50,
    priceLabel: '$50/month',
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
      priceLabel: meta.priceLabel,
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
  locale: Locale = defaultLocale
): string {
  const params = new URLSearchParams()
  params.set('from', 'pricing')
  if (planId) params.set('plan', planId)
  if (supportId) params.set('support', supportId)
  return withLocale(`/introspect?${params.toString()}`, locale)
}

export function writePricingSelectionHandoff(
  planId: PlanId | null,
  supportId: SupportPlanId | null
): void {
  try {
    const payload: PricingSelectionHandoff = { planId, supportId }
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
    return {
      planId: isPlanId(parsed.planId) ? parsed.planId : null,
      supportId: isSupportPlanId(parsed.supportId) ? parsed.supportId : null,
    }
  } catch {
    return null
  }
}

/** Plain-text synopsis for the client’s mailbox (mailto / API log). */
export function formatSelectionForEmail(
  plan: PricingPlan | null,
  support: SupportPlan | null,
  dict: Dictionary = en,
  locale: Locale = defaultLocale
): { subject: string; body: string } {
  const oneTime = plan?.price ?? 0
  const monthly = support?.price ?? 0
  const totalLine = [
    plan ? `${formatMoney(oneTime, locale)} ${dict.pricingPage.oneTime}` : null,
    support ? `${formatMoney(monthly, locale)}/mo` : null,
  ]
    .filter(Boolean)
    .join(' + ')

  const p = dict.pricingPage
  const lines = [
    p.selectionEmailBodyHeader,
    '',
    plan
      ? p.selectionEmailWebsitePackage
          .replace('{name}', plan.name)
          .replace('{price}', plan.priceLabel)
      : p.selectionEmailWebsiteNone,
    support
      ? p.selectionEmailMonthlyCare
          .replace('{name}', support.name)
          .replace('{price}', support.priceLabel)
      : p.selectionEmailMonthlyNone,
    '',
    p.selectionEmailEstimatedTotal.replace('{total}', totalLine || '$0'),
    '',
    p.selectionEmailZeroDue,
    p.selectionEmailEstimateNote,
    '',
    p.selectionEmailSignoff,
    'https://applicreations.com/pricing',
  ]

  const planSubjectName = plan
    ? `${plan.name}${support ? ` + ${support.name}` : ''}`
    : ''

  return {
    subject: plan
      ? p.selectionEmailSubjectWithPlan.replace('{name}', planSubjectName)
      : support
        ? p.selectionEmailSubjectWithSupport.replace('{name}', support.name)
        : p.selectionEmailSubject,
    body: lines.join('\n'),
  }
}
