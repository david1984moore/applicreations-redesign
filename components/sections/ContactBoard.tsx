'use client'

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useState,
} from 'react'
import { Button } from '@/components/ui/Button'
import { SITE_VIEWPORT_BELOW_NAV_CLASS } from '@/components/ui/Navigation'

type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (form.name.trim().length < 2) {
    errors.name = 'Please enter your name'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email'
  }
  const phoneDigits = form.phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    errors.phone = 'Please enter a valid phone number'
  }
  if (form.message.trim().length < 10) {
    errors.message = form.message.trim().length === 0
      ? 'Please enter a message'
      : 'A bit more detail helps — at least a sentence'
  }
  return errors
}

export function ContactBoard() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const update = (field: keyof FormState) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus('submitting')
    setServerMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }

      if (!res.ok) {
        setStatus('error')
        setServerMessage(data.message || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setForm(initialForm)
      setErrors({})
    } catch {
      setStatus('error')
      setServerMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section
      className={`contact-board relative bg-paper ${SITE_VIEWPORT_BELOW_NAV_CLASS} overflow-hidden flex flex-col justify-center`}
    >
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5">
        <div className="relative rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-[1.125rem]">
          <p className="text-xs font-bold tracking-[0.12em] uppercase text-primary-600 text-center mb-2.5">
            Contact
          </p>

          {status === 'success' ? (
            <div className="py-4 text-center" role="status">
              <h2 className="font-display text-xl text-gray-900 mb-1.5">
                Thanks for reaching out
              </h2>
              <p className="text-sm text-gray-700 leading-snug max-w-md mx-auto">
                We got your message and will reply soon.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => setStatus('idle')}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
              <div className="text-center">
                <h1 className="font-display text-xl text-gray-900 leading-tight">
                  Get in touch
                </h1>
                <p className="mt-1.5 text-sm text-gray-600 leading-snug max-w-md mx-auto">
                  We typically respond within 48 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id="contact-name" label="Name" required error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your name"
                    className={inputClass(errors.name)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                </Field>

                <Field id="contact-phone" label="Phone" required error={errors.phone}>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="(555) 555-5555"
                    className={inputClass(errors.phone)}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  />
                </Field>
              </div>

              <Field id="contact-email" label="Email" required error={errors.email}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@business.com"
                  className={inputClass(errors.email)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
              </Field>

              <Field id="contact-message" label="Message" required error={errors.message}>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your idea, goals, or what you have in mind…"
                  className={textareaClass(errors.message)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                />
              </Field>

              {status === 'error' && serverMessage && (
                <p className="text-sm text-error" role="alert">
                  {serverMessage}
                </p>
              )}

              <div className="flex justify-center pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={status === 'submitting'}
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto !bg-[oklch(58%_0.14_310)] hover:!bg-[oklch(50%_0.14_310)] focus-visible:!ring-[oklch(58%_0.14_310)/0.35]"
                >
                  Send message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function inputClass(error?: string) {
  return [
    'block h-9 w-full rounded-md border bg-paper/70 px-3 text-base text-gray-900',
    'placeholder:text-gray-400 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
    error
      ? 'border-error focus-visible:ring-error/40'
      : 'border-gray-200 focus-visible:border-primary-300',
  ].join(' ')
}

function textareaClass(error?: string) {
  return [
    'block w-full min-h-[5.25rem] rounded-md border bg-paper/70 px-3 py-2 text-base text-gray-900 leading-snug',
    'placeholder:text-gray-400 transition-colors resize-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
    error
      ? 'border-error focus-visible:ring-error/40'
      : 'border-gray-200 focus-visible:border-primary-300',
  ].join(' ')
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
        {required ? <span className="text-primary-600"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
