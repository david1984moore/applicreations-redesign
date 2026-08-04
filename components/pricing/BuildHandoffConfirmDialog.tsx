'use client'

import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { LinkRenderText } from '@/components/pricing/LinkRenderText'

interface BuildHandoffConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function BuildHandoffConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: BuildHandoffConfirmDialogProps) {
  const { dict } = useLocale()
  const p = dict.pricingPage
  const titleId = useId()
  const descId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onCancel])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label={p.buildHandoffConfirmCloseAria}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-pointer bg-[oklch(28%_0.02_250/0.35)] backdrop-blur-[2px]"
            onClick={onCancel}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-[oklch(88%_0.04_75)] bg-paper shadow-[0_20px_50px_-24px_oklch(30%_0.03_250/0.45)]"
          >
            <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(98%_0.02_85)] text-[oklch(48%_0.12_65)]"
                aria-hidden
              >
                <AlertTriangle className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div className="min-w-0 flex-1 pr-6">
                <h2
                  id={titleId}
                  className="font-display text-lg text-gray-900 leading-tight"
                >
                  {p.buildHandoffConfirmTitle}
                </h2>
                <p
                  id={descId}
                  className="mt-1.5 text-sm text-gray-700 leading-snug"
                >
                  <LinkRenderText text={p.buildHandoffConfirmBody} />
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                aria-label={p.buildHandoffConfirmCloseAria}
                className="absolute right-3 top-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-sand/60 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <X className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 border-t border-[oklch(90%_0.02_195)] bg-[oklch(97%_0.015_195)] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[oklch(82%_0.04_195)] bg-white px-3.5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-[oklch(96%_0.02_195)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {p.buildHandoffConfirmYes}
              </button>
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[oklch(52%_0.14_295)] bg-[oklch(48%_0.14_295)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:border-[oklch(42%_0.13_295)] hover:bg-[oklch(42%_0.13_295)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(52%_0.14_295/0.35)] focus-visible:ring-offset-2"
              >
                {p.buildHandoffConfirmNo}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
