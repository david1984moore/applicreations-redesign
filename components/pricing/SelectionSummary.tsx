'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { Button } from '@/components/ui/Button'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import {
  buildIntrospectHandoffHref,
  formatMoney,
  writePricingSelectionHandoff,
  type PricingPlan,
  type SupportPlan,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

interface SelectionSummaryProps {
  selectedPlan: PricingPlan | null
  selectedSupport: SupportPlan | null
  onClearSupport: () => void
  onClearPlan: () => void
}

export function SelectionSummary({
  selectedPlan,
  selectedSupport,
  onClearSupport,
  onClearPlan,
}: SelectionSummaryProps) {
  const router = useRouter()
  const { dict, t, locale } = useLocale()
  const p = dict.pricingPage
  const hasSelection = Boolean(selectedPlan || selectedSupport)
  const [emailOpen, setEmailOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )
  const [emailMessage, setEmailMessage] = useState('')
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const oneTime = selectedPlan?.price ?? 0
  const monthly = selectedSupport?.price ?? 0
  const deposit = selectedPlan ? Math.round(oneTime / 2) : null
  const oneTimeLabel = selectedPlan ? formatMoney(oneTime, locale) : '$0'
  const totalLabel = selectedSupport
    ? t(p.totalWithMonthly, {
        oneTime: oneTimeLabel,
        monthly: formatMoney(monthly, locale),
      })
    : oneTimeLabel

  const continueToIntrospect = () => {
    writePricingSelectionHandoff(selectedPlan?.id ?? null, selectedSupport?.id ?? null)
    router.push(
      buildIntrospectHandoffHref(
        selectedPlan?.id ?? null,
        selectedSupport?.id ?? null,
        locale
      )
    )
  }

  const sendEmailToClient = async (e: FormEvent) => {
    e.preventDefault()
    if (!hasSelection) return

    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed)) {
      setEmailError(p.emailInvalid)
      return
    }
    setEmailError(undefined)
    setEmailStatus('sending')
    setEmailMessage('')

    try {
      const res = await fetch('/api/pricing-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          planId: selectedPlan?.id ?? null,
          supportId: selectedSupport?.id ?? null,
          locale,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }

      if (!res.ok) {
        setEmailStatus('error')
        setEmailMessage(data.message || p.emailSendFailed)
        return
      }

      setEmailStatus('sent')
      setEmailMessage(data.message || p.emailSentFallback)
    } catch {
      setEmailStatus('error')
      setEmailMessage(p.emailSendFailedNetwork)
    }
  }

  const card = (
    <div className="rounded-xl border border-[oklch(52%_0.14_295/0.25)] bg-white/95 shadow-sm backdrop-blur-sm p-3.5 sm:p-4">
      <p className="text-xs font-semibold tracking-wide uppercase text-[oklch(48%_0.14_295)] mb-2.5">
        {p.yourSelection}
      </p>

      {hasSelection ? (
        <ul className="space-y-2 mb-3">
          {selectedPlan ? (
            <li className="flex items-start justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {t(p.packageSuffix, { name: selectedPlan.name })}
                </p>
                <p className="text-xs text-gray-500">
                  {t(p.oneTimeSuffix, { price: selectedPlan.priceLabel })}
                </p>
              </div>
              <button
                type="button"
                onClick={onClearPlan}
                className="cursor-pointer shrink-0 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                {dict.common.remove}
              </button>
            </li>
          ) : null}
          {selectedSupport ? (
            <li className="flex items-start justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{selectedSupport.name}</p>
                <p className="text-xs text-gray-500">{selectedSupport.priceLabel}</p>
              </div>
              <button
                type="button"
                onClick={onClearSupport}
                className="cursor-pointer shrink-0 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                {dict.common.remove}
              </button>
            </li>
          ) : null}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 leading-snug mb-3">{p.emptySelection}</p>
      )}

      <div className="border-t border-gray-200 pt-3 mb-3">
        <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1">
          {p.estimatedTotal}
        </p>
        <p className="font-display text-xl text-gray-900 mb-1.5">{totalLabel}</p>
        <p className="text-xs text-gray-600 leading-snug mb-2">
          <span className="font-semibold text-gray-800">{p.zeroDueToday}</span>{' '}
          {p.previewTerms}
        </p>
        <ol className="text-xs text-gray-600 leading-snug space-y-1.5 list-decimal list-outside pl-3.5">
          <li>
            {p.continueAfterPreviewBefore}{' '}
            <span className="font-medium text-gray-800">
              {deposit != null
                ? t(p.fiftyPercentOneTimeWithAmount, {
                    amount: formatMoney(deposit, locale),
                  })
                : p.fiftyPercentOneTime}
            </span>{' '}
            {p.continueAfterPreviewAfter}
          </li>
          <li>
            {p.buildRealSiteBefore}{' '}
            <span className="font-medium text-gray-800">
              {deposit != null
                ? t(p.remainingFiftyWithAmount, {
                    amount: formatMoney(deposit, locale),
                  })
                : p.remainingFifty}
            </span>{' '}
            {p.isDue}
            {selectedSupport
              ? t(p.alongWithFirstMonthly, { amount: formatMoney(monthly, locale) })
              : null}
            .
          </li>
        </ol>
        <p className="text-xs text-gray-500 leading-snug mt-2">
          {selectedSupport
            ? t(p.monthlySupportStartsWith, { monthly: formatMoney(monthly, locale) })
            : p.monthlySupportStartsWithout}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <SpectrumFlipCta
          size="sm"
          className="w-full"
          disabled={!hasSelection}
          onClick={continueToIntrospect}
        >
          {p.continueToIntrospect}
        </SpectrumFlipCta>

        {!emailOpen ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!hasSelection}
            onClick={() => {
              setEmailOpen(true)
              setEmailStatus('idle')
              setEmailMessage('')
            }}
          >
            {p.emailThisSelection}
          </Button>
        ) : (
          <form onSubmit={sendEmailToClient} className="space-y-2">
            <label className="block">
              <span className="sr-only">{p.yourEmailSrOnly}</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(undefined)
                  if (emailStatus === 'sent' || emailStatus === 'error') {
                    setEmailStatus('idle')
                    setEmailMessage('')
                  }
                }}
                placeholder={p.emailPlaceholder}
                className={cn(
                  'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900',
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(52%_0.14_295/0.35)]',
                  emailError ? 'border-red-400' : 'border-gray-300'
                )}
              />
            </label>
            {emailError ? (
              <p className="text-xs text-red-600">{emailError}</p>
            ) : emailMessage ? (
              <p
                className={cn(
                  'text-xs leading-snug',
                  emailStatus === 'error' ? 'text-red-600' : 'text-gray-600'
                )}
                role={emailStatus === 'error' ? 'alert' : 'status'}
              >
                {emailMessage}
              </p>
            ) : (
              <p className="text-xs text-gray-500 leading-snug">{p.emailHint}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="flex-1"
                isLoading={emailStatus === 'sending'}
                disabled={emailStatus === 'sending' || emailStatus === 'sent'}
              >
                {emailStatus === 'sent' ? p.emailSent : p.sendMySelection}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  setEmailOpen(false)
                  setEmailError(undefined)
                  setEmailStatus('idle')
                  setEmailMessage('')
                }}
              >
                {dict.common.cancel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside
        className="hidden lg:block w-72 xl:w-80 shrink-0 self-stretch"
        aria-live="polite"
        aria-label={p.yourSelection}
      >
        <div className="sticky top-[calc(var(--spacing-12)+0.75rem)] max-h-[calc(100svh-var(--spacing-12)-1.5rem)] overflow-y-auto overscroll-contain">
          {card}
        </div>
      </aside>

      {hasSelection ? (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-paper/95 backdrop-blur-md shadow-[0_-4px_24px_oklch(20%_0.02_60/0.08)]">
          {!mobileExpanded ? (
            <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 text-sm text-gray-700">
                <span className="font-medium text-gray-900">
                  {selectedPlan ? selectedPlan.name : p.noPackage}
                </span>
                <span className="text-gray-400 mx-1.5">·</span>
                <span>{selectedSupport ? selectedSupport.name : p.noMonthlySupport}</span>
                <span className="text-gray-400 mx-1.5">·</span>
                <span className="font-display text-[oklch(48%_0.14_295)]">{totalLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileExpanded(true)}
                className="cursor-pointer shrink-0 text-sm font-medium text-[oklch(48%_0.14_295)] hover:text-[oklch(42%_0.13_295)]"
              >
                {p.review}
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 max-h-[70svh] overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setMobileExpanded(false)}
                  className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-800"
                >
                  {dict.common.close}
                </button>
              </div>
              {card}
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
