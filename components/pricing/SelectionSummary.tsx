'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { Button } from '@/components/ui/Button'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import {
  BUILD_HANDOFF_FEE,
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
  selectedBuildHandoff: boolean
  onClearSupport: () => void
  onClearPlan: () => void
  onClearBuildHandoff: () => void
}

export function SelectionSummary({
  selectedPlan,
  selectedSupport,
  selectedBuildHandoff,
  onClearSupport,
  onClearPlan,
  onClearBuildHandoff,
}: SelectionSummaryProps) {
  const router = useRouter()
  const { dict, t, locale } = useLocale()
  const p = dict.pricingPage
  const hasSelection = Boolean(
    selectedPlan || selectedSupport || selectedBuildHandoff
  )
  const [emailOpen, setEmailOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )
  const [emailMessage, setEmailMessage] = useState('')

  const quoted = Boolean(selectedPlan?.contactForPricing)
  const packagePrice = quoted ? 0 : (selectedPlan?.price ?? 0)
  const handoffFee = selectedBuildHandoff ? BUILD_HANDOFF_FEE : 0
  const oneTime = packagePrice + handoffFee
  const monthly = selectedSupport?.price ?? 0
  const deposit =
    selectedPlan && !quoted ? Math.round(packagePrice / 2) : null
  const goLiveDue =
    deposit != null
      ? deposit + (selectedSupport ? monthly : 0) + handoffFee
      : handoffFee > 0
        ? handoffFee
        : null
  const oneTimeLabel =
    quoted && selectedPlan
      ? selectedPlan.priceLabel
      : oneTime > 0
        ? formatMoney(oneTime, locale)
        : '$0'
  const totalLabel = selectedSupport
    ? t(p.totalWithMonthly, {
        oneTime: oneTimeLabel,
        monthly: formatMoney(monthly, locale),
      })
    : oneTimeLabel

  const continueToIntrospect = () => {
    writePricingSelectionHandoff(
      selectedPlan?.id ?? null,
      selectedSupport?.id ?? null,
      selectedBuildHandoff
    )
    router.push(
      buildIntrospectHandoffHref(
        selectedPlan?.id ?? null,
        selectedSupport?.id ?? null,
        locale,
        selectedBuildHandoff
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
          buildHandoff: selectedBuildHandoff,
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

  const careLabel = selectedBuildHandoff
    ? p.buildHandoffName
    : selectedSupport
      ? selectedSupport.name
      : p.noMonthlySupport

  const slotClass =
    'flex min-h-[2.75rem] items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm'

  const card = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-3.5">
      <h3 className="flex shrink-0 items-center gap-2 font-display text-lg leading-none tracking-tight text-gray-900">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[oklch(90%_0.05_230)] font-display text-sm font-bold text-[oklch(38%_0.10_230)]"
          aria-hidden
        >
          3
        </span>
        {p.yourSelection}
      </h3>

      <ul className="mt-2.5 shrink-0 space-y-1.5">
        <li
          className={cn(
            slotClass,
            selectedPlan
              ? 'bg-white'
              : 'border border-dashed border-[oklch(70%_0.05_230/0.55)] text-gray-500'
          )}
        >
          {selectedPlan ? (
            <>
              <span className="min-w-0">
                <span className="block font-medium text-gray-900">
                  {t(p.packageSuffix, { name: selectedPlan.name })}
                </span>
                <span className="block text-xs text-gray-500">
                  {selectedPlan.contactForPricing
                    ? selectedPlan.priceLabel
                    : t(p.oneTimeSuffix, { price: selectedPlan.priceLabel })}
                </span>
              </span>
              <button
                type="button"
                onClick={onClearPlan}
                className="cursor-pointer shrink-0 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                {dict.common.remove}
              </button>
            </>
          ) : (
            <span>{p.mixMatchEmptyPackage}</span>
          )}
        </li>
        <li
          className={cn(
            slotClass,
            selectedSupport || selectedBuildHandoff
              ? 'bg-white'
              : 'border border-dashed border-[oklch(70%_0.05_230/0.55)] text-gray-500'
          )}
        >
          {selectedSupport ? (
            <>
              <span className="min-w-0">
                <span className="block font-medium text-gray-900">
                  {selectedSupport.name}
                </span>
                <span className="block text-xs text-gray-500">
                  {selectedSupport.priceLabel}
                </span>
              </span>
              <button
                type="button"
                onClick={onClearSupport}
                className="cursor-pointer shrink-0 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                {dict.common.remove}
              </button>
            </>
          ) : selectedBuildHandoff ? (
            <>
              <span className="min-w-0">
                <span className="block font-medium text-gray-900">
                  {p.buildHandoffName}
                </span>
                <span className="block text-xs text-gray-500">
                  {t(p.oneTimeSuffix, {
                    price: formatMoney(BUILD_HANDOFF_FEE, locale),
                  })}
                </span>
              </span>
              <button
                type="button"
                onClick={onClearBuildHandoff}
                className="cursor-pointer shrink-0 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                {dict.common.remove}
              </button>
            </>
          ) : (
            <span>{p.mixMatchEmptyHosting}</span>
          )}
        </li>
      </ul>

      <p
        className={cn(
          'mt-2 min-h-[2rem] shrink-0 text-xs leading-snug text-gray-600',
          hasSelection && 'invisible'
        )}
      >
        {p.emptySelection}
      </p>

      <div className="mt-2 shrink-0 border-t border-gray-200 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {p.estimatedTotal}
        </p>
        <p className="mt-0.5 font-display text-xl leading-none text-gray-900">
          {totalLabel}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-gray-600">
          <span className="font-semibold text-gray-800">{p.zeroDueToday}</span>{' '}
          {p.previewTerms}
        </p>
        <ul className="mt-2 space-y-1 text-xs leading-snug">
          <li className="flex items-start justify-between gap-3">
            <span className="font-medium text-gray-900">{p.scheduleProjectStart}</span>
            <span className="shrink-0 font-medium text-gray-900">
              {deposit != null ? formatMoney(deposit, locale) : '$0'}
            </span>
          </li>
          <li className="flex items-start justify-between gap-3">
            <span className="font-medium text-gray-900">{p.scheduleGoLive}</span>
            <span className="shrink-0 font-medium text-gray-900">
              {goLiveDue != null ? formatMoney(goLiveDue, locale) : '$0'}
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-auto flex shrink-0 flex-col gap-1.5 pt-2">
        <SpectrumFlipCta
          size="sm"
          className="w-full"
          disabled={!hasSelection}
          onClick={continueToIntrospect}
        >
          {p.continueToIntrospect}
        </SpectrumFlipCta>

        {!emailOpen ? (
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => {
              setEmailOpen(true)
              setEmailStatus('idle')
              setEmailMessage('')
            }}
            className="cursor-pointer w-full py-1 text-center text-sm font-medium text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {p.emailThisSelection}
          </button>
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

  const scrollToPreview = () => {
    document.getElementById('payment-preview')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      <div
        id="payment-preview"
        className="scroll-mt-16 h-full min-h-0"
        aria-live="polite"
        aria-label={p.yourSelection}
      >
        {card}
      </div>

      {hasSelection ? (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-paper/95 backdrop-blur-md shadow-[0_-4px_24px_oklch(20%_0.02_60/0.08)]">
          <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 text-sm text-gray-700">
              <span className="font-medium text-gray-900">
                {selectedPlan ? selectedPlan.name : p.noPackage}
              </span>
              <span className="text-gray-400 mx-1.5">·</span>
              <span>{careLabel}</span>
              <span className="text-gray-400 mx-1.5">·</span>
              <span className="font-display text-[oklch(48%_0.14_295)]">{totalLabel}</span>
            </div>
            <button
              type="button"
              onClick={scrollToPreview}
              className="cursor-pointer shrink-0 text-sm font-medium text-[oklch(48%_0.14_295)] hover:text-[oklch(42%_0.13_295)]"
            >
              {p.review}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
