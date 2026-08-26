'use client'

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import {
  AlignLeft,
  BookOpen,
  Check,
  CloudSun,
  Feather,
  Heart,
  Leaf,
  Moon,
  Sparkles,
  Type,
  Upload,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { IntrospectMorphWash } from '@/components/introspect/IntrospectMorphWash'
import { IntrospectSuccess } from '@/components/introspect/IntrospectSuccess'
import { LocationCombobox } from '@/components/introspect/LocationCombobox'
import { Button } from '@/components/ui/Button'
import { SITE_VIEWPORT_BELOW_NAV_CLASS } from '@/components/ui/Navigation'
import { SpectrumFlipCta } from '@/components/ui/SpectrumFlipCta'
import { Progress } from '@/components/ui/Progress'
import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { isLocaleTransition } from '@/lib/i18n/locale-transition'
import {
  aboutBusinessError,
  businessNameError,
  emptyAnswers,
  formatPhoneUS,
  getColorPaletteOptions,
  getDesignFeelOptions,
  getSiteDepthOptions,
  getVisitorActionOptions,
  getYesNoUnsure,
  isValidEmail,
  liveEmailError,
  formatLocation,
  locationFieldErrors,
  mergeDraftAnswers,
  nameHardError,
  nameLooksSuspicious,
  nameSoftWarning,
  normalizeWebsiteEntry,
  phoneDigits,
  recommendPlan,
  formatChangePriorityLabels,
  formatKeepItemLabels,
  formatVisitorActionLabels,
  getChangePriorityOptions,
  getKeepItemOptions,
  getQuestionSequence,
  websiteUrlRequiredError,
  withNormalizedWebsiteUrls,
  type ChangePriority,
  type ColorPalette,
  type DesignFeel,
  type IntrospectAnswers,
  type IntrospectVariant,
  type KeepItem,
  type QuestionId,
  type SiteDepth,
  type VisitorAction,
  type YesNoUnsure,
} from '@/lib/introspect'
import { countryOptions, DEFAULT_COUNTRY, isCountryCode } from '@/lib/countries'
import { US_CITIES, US_STATES, matchUsState, usStateCode } from '@/lib/us-places'
import {
  isPlanId,
  isSupportPlanId,
  planIdToSiteDepth,
  readPricingSelectionHandoff,
  type PlanId,
  type SupportPlanId,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

const STORAGE_KEY_NEW_SITE = 'applicreations-introspect-draft'
const STORAGE_KEY_REDESIGN = 'applicreations-redesign-draft'

const UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg'
const MAX_LOGO_BYTES = 5 * 1024 * 1024
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_PHOTOS = 12

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Sky-blue selection — matches Introspect Start (`oklch(68% 0.15 230)`) */
const choiceSelectedClass =
  'border-[oklch(62%_0.12_230)] bg-[oklch(96%_0.04_230)] text-[oklch(38%_0.10_230)] ring-2 ring-[oklch(68%_0.15_230/0.18)]'
const choiceUnselectedClass =
  'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
const cardSelectedClass =
  'border-[oklch(62%_0.12_230)] bg-[oklch(96%_0.04_230/0.85)] ring-2 ring-[oklch(68%_0.15_230/0.18)]'
const skyButtonClass =
  '!bg-[oklch(68%_0.15_230)] hover:!bg-[oklch(62%_0.14_230)] focus-visible:!ring-[oklch(68%_0.15_230)/0.45]'
const cardUnselectedClass = 'border-gray-200 bg-white/80 hover:border-gray-300'

const DESIGN_FEEL_ICONS: Record<DesignFeel, LucideIcon> = {
  'clean-simple': AlignLeft,
  'warm-friendly': Heart,
  'bold-modern': Zap,
  'classic-calm': BookOpen,
  'playful-fun': Sparkles,
  'elegant-refined': Feather,
  'rustic-natural': Leaf,
  'dark-dramatic': Moon,
  'airy-light': CloudSun,
  editorial: Type,
}

type Phase = 'welcome' | 'questions' | 'review' | 'success'

const WELCOME_LINE_ENTER_S = 0.9
const WELCOME_LINE_HOLD_MS = 700
const WELCOME_LINE_DRIFT_S = 1.2
const WELCOME_LINE_FADE_IN_S = 1.35
const WELCOME_LINE_FADE_IN_DELAY_S = 0.32

function WelcomeHeadline({
  greeting,
  continueLine,
  fullHeading,
  skipAnimation,
}: {
  greeting: string
  continueLine: string
  fullHeading: string
  skipAnimation: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const instant = skipAnimation || !!prefersReducedMotion
  const [line, setLine] = useState<'greeting' | 'continue'>(
    instant ? 'continue' : 'greeting'
  )

  useEffect(() => {
    if (instant) return
    const id = window.setTimeout(
      () => setLine('continue'),
      WELCOME_LINE_ENTER_S * 1000 + WELCOME_LINE_HOLD_MS
    )
    return () => window.clearTimeout(id)
  }, [instant])

  return (
    <h1 className="relative overflow-visible font-mi-gente text-2xl sm:text-3xl text-gray-900 leading-tight">
      <span className="sr-only">{fullHeading}</span>
      <span className="invisible block" aria-hidden>
        {continueLine}
      </span>
      <span
        className="absolute inset-0 overflow-visible flex items-center justify-center"
        aria-hidden
      >
        <AnimatePresence initial={!instant}>
          <motion.span
            key={line}
            className="absolute inset-0 flex items-center justify-center text-center"
            initial={
              instant
                ? false
                : line === 'greeting'
                  ? { opacity: 0, y: 8 }
                  : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -36,
              transition: {
                opacity: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
                y: { duration: WELCOME_LINE_DRIFT_S, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            transition={
              line === 'continue'
                ? {
                    opacity: {
                      duration: WELCOME_LINE_FADE_IN_S,
                      delay: WELCOME_LINE_FADE_IN_DELAY_S,
                      ease: [0.33, 0, 0.2, 1],
                    },
                    y: {
                      duration: WELCOME_LINE_FADE_IN_S,
                      delay: WELCOME_LINE_FADE_IN_DELAY_S,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
                : {
                    duration: WELCOME_LINE_ENTER_S,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            {line === 'greeting' ? greeting : continueLine}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  )
}

function listOrDash(items: string[]): string {
  const cleaned = items.map((s) => s.trim()).filter(Boolean)
  return cleaned.length > 0 ? cleaned.join(', ') : '—'
}

/** Instant jump — ignore `html { scroll-behavior: smooth }` so a new step
 *  never eases in from the previous screen's scroll offset. */
function scrollIntrospectScreenToTop(board?: HTMLElement | null) {
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.scrollTop = 0
  document.body.scrollTop = 0
  const page = document.querySelector('.site-page')
  if (page instanceof HTMLElement) page.scrollTop = 0
  if (board) board.scrollTop = 0
  html.style.scrollBehavior = prev
}

function blurActiveField() {
  const el = document.activeElement
  if (el instanceof HTMLElement && el !== document.body) el.blur()
}

/** Runs when a step mounts (after AnimatePresence `wait`), so the incoming
 *  screen paints at the top instead of inheriting the last scroll position. */
function ResetScrollOnMount({
  boardRef,
}: {
  boardRef: RefObject<HTMLElement | null>
}) {
  useLayoutEffect(() => {
    let cancelled = false
    blurActiveField()
    const run = () => {
      if (!cancelled) scrollIntrospectScreenToTop(boardRef.current)
    }
    run()
    const raf = requestAnimationFrame(() => {
      run()
      requestAnimationFrame(run)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [boardRef])
  return null
}

function fieldClass(error?: string, warning?: string) {
  return cn(
    'flex h-11 w-full rounded-md border bg-white px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
    error
      ? 'border-error'
      : warning
        ? 'border-amber-400'
        : 'border-gray-300'
  )
}

function textareaClass(error?: string) {
  return cn(
    'flex min-h-[5.25rem] w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
    error ? 'border-error' : 'border-gray-300'
  )
}

type FieldErrors = Partial<Record<keyof IntrospectAnswers, string>>

function validateQuestion(
  questionId: QuestionId,
  answers: IntrospectAnswers,
  dict: Dictionary,
  isRedesign: boolean
): FieldErrors {
  const errors: FieldErrors = {}
  const ui = dict.introspectUi
  const v = dict.introspectValidation

  if (questionId === 'about-you') {
    const nameErr = nameHardError(answers.fullName, v)
    if (nameErr) errors.fullName = nameErr
    if (!isValidEmail(answers.email)) {
      errors.email = v.liveEmailValid
    }
    const digits = phoneDigits(answers.phone)
    if (digits.length < 10) {
      errors.phone = ui.phoneFullError
    }
  }

  if (questionId === 'business') {
    const bizErr = businessNameError(answers.businessName, v)
    if (bizErr) errors.businessName = bizErr
    const aboutErr = aboutBusinessError(answers.aboutBusiness, v)
    if (aboutErr) errors.aboutBusiness = aboutErr
    const locErrs = locationFieldErrors(answers, v)
    if (locErrs.city) errors.city = locErrs.city
    if (locErrs.state) errors.state = locErrs.state
    if (locErrs.country) errors.country = locErrs.country
  }

  if (questionId === 'online') {
    if (isRedesign) {
      const urlErr = websiteUrlRequiredError(answers.websiteUrl, ui.websiteUrlRequired)
      if (urlErr) errors.websiteUrl = urlErr
    } else if (!answers.hasOnlinePresence) {
      errors.hasOnlinePresence = ui.chooseOne
    }
  }

  if (questionId === 'logo') {
    if (!answers.hasLogo) errors.hasLogo = ui.chooseOne
    if (!answers.hasPhotos) errors.hasPhotos = ui.chooseOne
    if (!answers.needsPhotosTaken) errors.needsPhotosTaken = ui.chooseOne
  }

  if (questionId === 'keep-change') {
    if (answers.keepItems.length === 0) {
      errors.keepItems = ui.keepItemsError
    }
    if (answers.changePriorities.length === 0) {
      errors.changePriorities = ui.changePrioritiesError
    }
  }

  if (questionId === 'visitor-actions') {
    const actions = answers.visitorActions.map((a) => a.trim()).filter(Boolean)
    if (actions.length === 0) {
      errors.visitorActions = ui.visitorActionsError
    }
  }

  if (questionId === 'site-depth') {
    if (!answers.siteDepth) {
      errors.siteDepth = ui.siteDepthError
    }
  }

  if (questionId === 'design') {
    if (
      !answers.keepCurrentLook &&
      !answers.designFeelNoPreference &&
      answers.designFeels.length === 0
    ) {
      errors.designFeels = ui.designFeelsError
    }
    if (
      !answers.keepCurrentLook &&
      !answers.colorPaletteNoPreference &&
      !answers.colorPaletteFromLogo &&
      answers.colorPalettes.length === 0
    ) {
      errors.colorPalettes = ui.colorPalettesError
    }
    if (
      !answers.keepCurrentLook &&
      !answers.colorPaletteNoPreference &&
      !answers.colorPaletteFromLogo &&
      answers.colorPalettes.includes('custom') &&
      answers.colorNotes.trim().length < 2
    ) {
      errors.colorNotes = ui.colorNotesError
    }
  }

  return errors
}

export function IntrospectBoard({
  variant = 'new-site',
}: {
  variant?: IntrospectVariant
} = {}) {
  const formId = useId()
  const { dict, t, href, locale } = useLocale()
  const ui = dict.introspectUi
  const dash = dict.common.emptyDash
  const isRedesign = variant === 'redesign'
  const storageKey = isRedesign ? STORAGE_KEY_REDESIGN : STORAGE_KEY_NEW_SITE
  const sequence = useMemo(() => getQuestionSequence(variant), [variant])
  const totalSteps = sequence.length
  const [skipIntro] = useState(() => isLocaleTransition())

  const yesNoUnsure = getYesNoUnsure(dict)
  const hasOnlineOptions = yesNoUnsure.map((o) =>
    o.id === 'yes' ? { ...o, label: ui.hasOnlineYes } : o
  )
  const siteDepthOptions = getSiteDepthOptions(dict)
  const visitorActionOptions = getVisitorActionOptions(dict)
  const designFeelOptions = getDesignFeelOptions(dict)
  const colorPaletteOptions = getColorPaletteOptions(dict)
  const keepItemOptions = getKeepItemOptions(dict)
  const changePriorityOptions = getChangePriorityOptions(dict)

  const yesNoLabel = (value: YesNoUnsure | ''): string => {
    if (!value) return dash
    return yesNoUnsure.find((o) => o.id === value)?.label ?? value
  }

  const hasOnlineLabelFor = (value: YesNoUnsure | ''): string => {
    if (value === 'yes') return ui.hasOnlineYes
    return yesNoLabel(value)
  }

  const [phase, setPhase] = useState<Phase>('welcome')
  const [step, setStep] = useState(1)
  const questionId = sequence[step - 1] ?? sequence[0] ?? 'about-you'
  const [answers, setAnswers] = useState<IntrospectAnswers>(emptyAnswers)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [warnings, setWarnings] = useState<FieldErrors>({})
  const [nameConfirmPending, setNameConfirmPending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [, setRecommendation] = useState<ReturnType<typeof recommendPlan> | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [uploadErrors, setUploadErrors] = useState<{ logo?: string; photos?: string }>({})
  /** True when a website package was chosen on /pricing — skip site-depth step. */
  const [skipSiteDepth, setSkipSiteDepth] = useState(false)
  /** Jumping to one question from Review — Continue/Back return there. */
  const [editingFromReview, setEditingFromReview] = useState(false)
  const boardRef = useRef<HTMLElement>(null)

  const countryComboboxOptions = useMemo(
    () => countryOptions(locale).map((c) => ({ value: c.code, label: c.name })),
    [locale]
  )
  const stateComboboxOptions = useMemo(
    () => US_STATES.map((s) => ({ value: s.name, label: s.name, hint: s.code })),
    []
  )
  const isUsLocation = answers.country === DEFAULT_COUNTRY
  const cityComboboxOptions = useMemo(() => {
    const code = usStateCode(answers.state)
    const rows = code ? US_CITIES.filter((c) => c.state === code) : US_CITIES
    return rows.map((c) => ({
      value: `${c.name}|${c.state}`,
      label: c.name,
      hint: code ? undefined : c.state,
    }))
  }, [answers.state])

  useEffect(() => {
    let draft: IntrospectAnswers = emptyAnswers
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Parameters<typeof mergeDraftAnswers>[0]
        draft = mergeDraftAnswers({
          ...parsed,
          phone: formatPhoneUS(parsed.phone ?? ''),
        })
      }
    } catch {
      /* ignore bad drafts */
    }

    const params = new URLSearchParams(window.location.search)
    const fromPricing = params.get('from') === 'pricing'
    const queryPlan = params.get('plan')
    const querySupport = params.get('support')
    const queryHandoff = params.get('handoff') === '1'
    const stored =
      fromPricing || queryPlan || querySupport || queryHandoff
        ? readPricingSelectionHandoff()
        : null

    const planId: PlanId | null = isPlanId(queryPlan)
      ? queryPlan
      : stored?.planId ?? (isPlanId(draft.selectedPlanId) ? draft.selectedPlanId : null)
    const buildHandoff =
      queryHandoff || stored?.buildHandoff === true || draft.selectedBuildHandoff === true
    const supportId: SupportPlanId | null = buildHandoff
      ? null
      : isSupportPlanId(querySupport)
        ? querySupport
        : stored?.supportId ??
          (isSupportPlanId(draft.selectedSupportId) ? draft.selectedSupportId : null)

    const cameFromPricing = Boolean(
      fromPricing || stored?.planId || stored?.supportId || stored?.buildHandoff
    )

    if (cameFromPricing || planId || supportId || buildHandoff) {
      draft = {
        ...draft,
        selectedPlanId: planId ?? '',
        selectedSupportId: supportId ?? '',
        selectedBuildHandoff: buildHandoff,
        siteDepth: planId ? planIdToSiteDepth(planId) : draft.siteDepth,
      }
      if (planId) setSkipSiteDepth(true)
    } else if (draft.selectedPlanId) {
      setSkipSiteDepth(true)
      if (!draft.siteDepth) {
        draft = {
          ...draft,
          siteDepth: planIdToSiteDepth(draft.selectedPlanId),
        }
      }
    }

    if (isRedesign) {
      draft = {
        ...draft,
        variant: 'redesign',
        hasOnlinePresence: draft.hasOnlinePresence || 'yes',
      }
    } else {
      draft = { ...draft, variant: 'new-site' }
    }

    setAnswers(draft)
  }, [isRedesign])

  useEffect(() => {
    if (phase !== 'questions' && phase !== 'review') return
    try {
      // File binaries aren't persisted — omit names so drafts don't claim uploads we don't have.
      const { logoFileName: _logo, photoFileNames: _photos, ...persistable } = answers
      localStorage.setItem(storageKey, JSON.stringify(persistable))
    } catch {
      /* ignore quota */
    }
  }, [answers, phase, storageKey])

  useEffect(() => {
    const lock = phase === 'welcome' || phase === 'success'
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    if (lock) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [phase])

  useEffect(() => {
    const root = document.documentElement
    // welcome | scroll | success — CSS uses `scroll` for the under-nav fade
    root.dataset.introspect =
      phase === 'success' ? 'success' : phase === 'welcome' ? 'welcome' : 'scroll'
    return () => {
      delete root.dataset.introspect
    }
  }, [phase])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (new URLSearchParams(window.location.search).get('preview') !== 'success') return
    setPhase('success')
  }, [])

  const update =
    (field: keyof IntrospectAnswers) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = e.target.value
      if (field === 'phone') value = formatPhoneUS(value)
      if (field === 'fullName') {
        setNameConfirmPending(false)
        setWarnings((prev) => ({ ...prev, fullName: undefined }))
      }
      setAnswers((prev) => ({ ...prev, [field]: value }))

      if (field === 'email') {
        const live = liveEmailError(value, dict.introspectValidation)
        setErrors((prev) => ({ ...prev, email: live }))
        return
      }
      if (field === 'phone') {
        const digits = phoneDigits(value)
        const phoneErr =
          digits.length >= 4 && digits.length < 10 ? ui.phoneKeepTyping : undefined
        setErrors((prev) => ({ ...prev, phone: phoneErr }))
        return
      }
      if (field === 'fullName') {
        const hard = nameHardError(value, dict.introspectValidation)
        // Only show hard errors live once they've typed something short/odd
        if (hard && value.trim().length >= 2) {
          setErrors((prev) => ({ ...prev, fullName: hard }))
        } else {
          setErrors((prev) => ({ ...prev, fullName: undefined }))
        }
        return
      }

      if (field === 'businessName') {
        const trimmed = value.trim()
        setErrors((prev) => ({
          ...prev,
          businessName:
            trimmed.length > 0
              ? businessNameError(value, dict.introspectValidation)
              : undefined,
        }))
        return
      }
      if (field === 'aboutBusiness') {
        const trimmed = value.trim()
        setErrors((prev) => ({
          ...prev,
          aboutBusiness:
            trimmed.length > 0
              ? aboutBusinessError(value, dict.introspectValidation)
              : undefined,
        }))
        return
      }
      if (field === 'city') {
        const trimmed = value.trim()
        setErrors((prev) => ({
          ...prev,
          city:
            trimmed.length > 0
              ? locationFieldErrors(
                  { city: value, state: answers.state, country: answers.country },
                  dict.introspectValidation
                ).city
              : undefined,
        }))
        return
      }
      if (field === 'state') {
        const trimmed = value.trim()
        setErrors((prev) => ({
          ...prev,
          state:
            trimmed.length > 0 || answers.country !== DEFAULT_COUNTRY
              ? locationFieldErrors(
                  { city: answers.city, state: value, country: answers.country },
                  dict.introspectValidation
                ).state
              : undefined,
        }))
        return
      }

      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const setChoice = <K extends keyof IntrospectAnswers>(
    field: K,
    value: IntrospectAnswers[K]
  ) => {
    setAnswers((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'hasLogo' && value !== 'yes') next.logoFileName = ''
      if (field === 'hasPhotos' && value !== 'yes') next.photoFileNames = []
      return next
    })
    if (field === 'hasLogo' && value !== 'yes') {
      setLogoFile(null)
      setUploadErrors((e) => ({ ...e, logo: undefined }))
    }
    if (field === 'hasPhotos' && value !== 'yes') {
      setPhotoFiles([])
      setUploadErrors((e) => ({ ...e, photos: undefined }))
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onLogoSelected = (file: File | null) => {
    if (!file) {
      setLogoFile(null)
      setAnswers((prev) => ({ ...prev, logoFileName: '' }))
      setUploadErrors((prev) => ({ ...prev, logo: undefined }))
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setUploadErrors((prev) => ({
        ...prev,
        logo: ui.logoTooLarge,
      }))
      return
    }
    setLogoFile(file)
    setAnswers((prev) => ({ ...prev, logoFileName: file.name }))
    setUploadErrors((prev) => ({ ...prev, logo: undefined }))
  }

  const onPhotosSelected = (files: FileList | null) => {
    if (!files?.length) return
    const incoming = Array.from(files)
    const tooLarge = incoming.find((f) => f.size > MAX_PHOTO_BYTES)
    if (tooLarge) {
      setUploadErrors((prev) => ({
        ...prev,
        photos: t(ui.photoTooLarge, { name: tooLarge.name }),
      }))
      return
    }

    const merged = [...photoFiles]
    let hitLimit = false
    for (const file of incoming) {
      if (merged.length >= MAX_PHOTOS) {
        hitLimit = true
        break
      }
      if (merged.some((f) => f.name === file.name && f.size === file.size)) continue
      merged.push(file)
    }
    const next = merged.slice(0, MAX_PHOTOS)
    setPhotoFiles(next)
    setAnswers((a) => ({ ...a, photoFileNames: next.map((f) => f.name) }))
    setUploadErrors((e) => ({
      ...e,
      photos: hitLimit ? t(ui.photoLimit, { max: MAX_PHOTOS }) : undefined,
    }))
  }

  const removePhoto = (index: number) => {
    const next = photoFiles.filter((_, i) => i !== index)
    setPhotoFiles(next)
    setAnswers((a) => ({ ...a, photoFileNames: next.map((f) => f.name) }))
    setUploadErrors((prev) => ({ ...prev, photos: undefined }))
  }

  const setLinkList = (
    field: 'socialMediaLinks' | 'admiredWebsiteLinks',
    links: string[]
  ) => {
    setAnswers((prev) => ({ ...prev, [field]: links }))
  }

  const toggleVisitorAction = (id: VisitorAction) => {
    setAnswers((prev) => {
      const has = prev.visitorActions.includes(id)
      return {
        ...prev,
        visitorActions: has
          ? prev.visitorActions.filter((a) => a !== id)
          : [...prev.visitorActions, id],
      }
    })
    if (errors.visitorActions) {
      setErrors((prev) => ({ ...prev, visitorActions: undefined }))
    }
  }

  const toggleDesignFeel = (id: DesignFeel) => {
    setAnswers((prev) => {
      const has = prev.designFeels.includes(id)
      return {
        ...prev,
        designFeelNoPreference: false,
        keepCurrentLook: false,
        designFeels: has
          ? prev.designFeels.filter((f) => f !== id)
          : [...prev.designFeels, id],
      }
    })
    if (errors.designFeels) setErrors((prev) => ({ ...prev, designFeels: undefined }))
  }

  const toggleDesignFeelNoPreference = () => {
    setAnswers((prev) => {
      const next = !Boolean(prev.designFeelNoPreference)
      return {
        ...prev,
        designFeelNoPreference: next,
        keepCurrentLook: next ? false : prev.keepCurrentLook,
        designFeels: next ? [] : prev.designFeels,
      }
    })
    if (errors.designFeels) setErrors((prev) => ({ ...prev, designFeels: undefined }))
  }

  const toggleColorPalette = (id: ColorPalette) => {
    setAnswers((prev) => {
      const has = prev.colorPalettes.includes(id)
      return {
        ...prev,
        colorPaletteNoPreference: false,
        colorPaletteFromLogo: false,
        keepCurrentLook: false,
        colorPalettes: has
          ? prev.colorPalettes.filter((c) => c !== id)
          : [...prev.colorPalettes, id],
      }
    })
    if (errors.colorPalettes) setErrors((prev) => ({ ...prev, colorPalettes: undefined }))
    if (errors.colorNotes) setErrors((prev) => ({ ...prev, colorNotes: undefined }))
  }

  const toggleColorPaletteNoPreference = () => {
    setAnswers((prev) => {
      const next = !Boolean(prev.colorPaletteNoPreference)
      return {
        ...prev,
        colorPaletteNoPreference: next,
        keepCurrentLook: next ? false : prev.keepCurrentLook,
        colorPaletteFromLogo: next ? false : prev.colorPaletteFromLogo,
        colorPalettes: next ? [] : prev.colorPalettes,
        colorNotes: next ? '' : prev.colorNotes,
      }
    })
    if (errors.colorPalettes) setErrors((prev) => ({ ...prev, colorPalettes: undefined }))
    if (errors.colorNotes) setErrors((prev) => ({ ...prev, colorNotes: undefined }))
  }

  const toggleColorPaletteFromLogo = () => {
    setAnswers((prev) => {
      const next = !Boolean(prev.colorPaletteFromLogo)
      return {
        ...prev,
        colorPaletteFromLogo: next,
        colorPaletteNoPreference: next ? false : prev.colorPaletteNoPreference,
        keepCurrentLook: next ? false : prev.keepCurrentLook,
        colorPalettes: next ? [] : prev.colorPalettes,
        colorNotes: next ? '' : prev.colorNotes,
      }
    })
    if (errors.colorPalettes) setErrors((prev) => ({ ...prev, colorPalettes: undefined }))
    if (errors.colorNotes) setErrors((prev) => ({ ...prev, colorNotes: undefined }))
  }

  const toggleKeepCurrentLook = () => {
    setAnswers((prev) => {
      const next = !Boolean(prev.keepCurrentLook)
      return {
        ...prev,
        keepCurrentLook: next,
        designFeelNoPreference: next ? false : prev.designFeelNoPreference,
        designFeels: next ? [] : prev.designFeels,
        colorPaletteFromLogo: next ? false : prev.colorPaletteFromLogo,
        colorPaletteNoPreference: next ? false : prev.colorPaletteNoPreference,
        colorPalettes: next ? [] : prev.colorPalettes,
        colorNotes: next ? '' : prev.colorNotes,
      }
    })
    if (errors.designFeels) setErrors((prev) => ({ ...prev, designFeels: undefined }))
    if (errors.colorPalettes) setErrors((prev) => ({ ...prev, colorPalettes: undefined }))
    if (errors.colorNotes) setErrors((prev) => ({ ...prev, colorNotes: undefined }))
  }

  const toggleKeepItem = (id: KeepItem) => {
    setAnswers((prev) => {
      if (id === 'start-fresh') {
        return {
          ...prev,
          keepItems: prev.keepItems.includes('start-fresh') ? [] : ['start-fresh'],
        }
      }
      const withoutFresh = prev.keepItems.filter((item) => item !== 'start-fresh')
      const has = withoutFresh.includes(id)
      return {
        ...prev,
        keepItems: has ? withoutFresh.filter((item) => item !== id) : [...withoutFresh, id],
      }
    })
    if (errors.keepItems) setErrors((prev) => ({ ...prev, keepItems: undefined }))
  }

  const toggleChangePriority = (id: ChangePriority) => {
    setAnswers((prev) => {
      const has = prev.changePriorities.includes(id)
      return {
        ...prev,
        changePriorities: has
          ? prev.changePriorities.filter((item) => item !== id)
          : [...prev.changePriorities, id],
      }
    })
    if (errors.changePriorities) setErrors((prev) => ({ ...prev, changePriorities: undefined }))
  }

  const advanceFrom = (current: number) => {
    let next = current + 1
    if (skipSiteDepth && sequence[next - 1] === 'site-depth') next += 1
    return next
  }

  const retreatFrom = (current: number) => {
    let prev = current - 1
    if (skipSiteDepth && sequence[prev - 1] === 'site-depth') prev -= 1
    return prev
  }

  const stepErrors = validateQuestion(questionId, answers, dict, isRedesign)
  const canContinue = Object.keys(stepErrors).length === 0

  const goNext = () => {
    const nextErrors = validateQuestion(questionId, answers, dict, isRedesign)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setWarnings({})
      return
    }

    if (questionId === 'about-you' && nameLooksSuspicious(answers.fullName) && !nameConfirmPending) {
      setWarnings({ fullName: nameSoftWarning(dict) })
      setNameConfirmPending(true)
      return
    }

    setErrors({})
    setWarnings({})
    setNameConfirmPending(false)
    setAnswers((prev) => withNormalizedWebsiteUrls(prev))
    blurActiveField()
    if (editingFromReview) {
      setEditingFromReview(false)
      setPhase('review')
      return
    }
    if (step < totalSteps) {
      const next = advanceFrom(step)
      if (next > totalSteps) {
        setPhase('review')
        return
      }
      setStep(next)
      return
    }
    setPhase('review')
  }

  const goBack = () => {
    setErrors({})
    setWarnings({})
    setNameConfirmPending(false)
    setServerMessage('')
    setStatus('idle')
    blurActiveField()
    if (editingFromReview) {
      setEditingFromReview(false)
      setPhase('review')
      return
    }
    if (phase === 'review') {
      setPhase('questions')
      setStep(totalSteps)
      return
    }
    if (step === 1) {
      setPhase('welcome')
      return
    }
    setStep(Math.max(1, retreatFrom(step)))
  }

  useEffect(() => {
    if (skipSiteDepth && questionId === 'site-depth' && !editingFromReview) {
      const next = advanceFrom(step)
      if (next > totalSteps) setPhase('review')
      else setStep(next)
    }
  }, [skipSiteDepth, questionId, step, editingFromReview, totalSteps])

  const editReviewSection = (target: QuestionId) => {
    const index = sequence.indexOf(target)
    if (index < 0) return
    setErrors({})
    setWarnings({})
    setNameConfirmPending(false)
    setServerMessage('')
    setStatus('idle')
    blurActiveField()
    setEditingFromReview(true)
    setStep(index + 1)
    setPhase('questions')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const lastQuestion = sequence[totalSteps - 1] ?? 'extras'
    const nextErrors = validateQuestion(lastQuestion, answers, dict, isRedesign)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setPhase('questions')
      setStep(totalSteps)
      return
    }

    const rec = recommendPlan(answers, dict)
    setRecommendation(rec)
    setStatus('submitting')
    setServerMessage('')

    try {
      const payload = withNormalizedWebsiteUrls({
        ...answers,
        variant: isRedesign ? 'redesign' : 'new-site',
      })
      const formData = new FormData()
      formData.append('answers', JSON.stringify(payload))
      formData.append('recommendation', JSON.stringify(rec))
      formData.append('locale', locale)
      if (logoFile) formData.append('logo', logoFile, logoFile.name)
      for (const photo of photoFiles) {
        formData.append('photos', photo, photo.name)
      }

      const res = await fetch('/api/introspect', {
        method: 'POST',
        body: formData,
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }

      if (!res.ok) {
        setStatus('error')
        setServerMessage(data.message || ui.errorGeneric)
        return
      }

      try {
        localStorage.removeItem(storageKey)
      } catch {
        /* ignore */
      }
      setLogoFile(null)
      setPhotoFiles([])
      setStatus('idle')
      setPhase('success')
    } catch {
      setStatus('error')
      setServerMessage(ui.errorTryEmail)
    }
  }

  const progressValue =
    phase === 'questions' ? (step / totalSteps) * 100 : phase === 'review' ? 100 : 0

  const wideQuestion =
    questionId === 'keep-change' ||
    questionId === 'visitor-actions' ||
    questionId === 'design'
  const compactQuestion =
    wideQuestion || questionId === 'site-depth'

  const lockViewport = phase === 'welcome' || phase === 'success'

  const depthLabel =
    siteDepthOptions.find((o) => o.id === answers.siteDepth)?.title || dash
  const feelLabels = answers.keepCurrentLook
    ? ui.keepCurrentLook
    : answers.designFeelNoPreference
      ? ui.noPreference
      : answers.designFeels
          .map((id) => designFeelOptions.find((o) => o.id === id)?.title || id)
          .join(', ') || dash
  const colorLabels = answers.keepCurrentLook
    ? ui.keepCurrentLook
    : answers.colorPaletteFromLogo
      ? ui.matchLogoColors
      : answers.colorPaletteNoPreference
        ? ui.noPreference
        : answers.colorPalettes
            .map((id) => colorPaletteOptions.find((o) => o.id === id)?.title || id)
            .join(', ') || dash
  const successUi = isRedesign
    ? {
        ...ui,
        successHeading: ui.successHeadingRedesign,
        successHeadingRest: ui.successHeadingRestRedesign,
        successNext1: ui.successNext1Redesign,
        successClosing: ui.successClosingRedesign,
      }
    : ui
  const designLocked = Boolean(
    answers.keepCurrentLook || answers.designFeelNoPreference
  )
  const colorsLocked = Boolean(
    answers.keepCurrentLook ||
      answers.colorPaletteNoPreference ||
      answers.colorPaletteFromLogo
  )

  return (
    <section
      ref={boardRef}
      className={cn(
        // z-10 keeps this stacking context above IntrospectMorphWash (portaled
        // z-[1]). max-lg contain:paint otherwise flattens the board behind the
        // wash, so welcome copy vanishes while nav/footer stay visible.
        'relative z-10 overflow-x-hidden bg-transparent',
        !lockViewport && 'max-lg:[contain:paint]',
        lockViewport &&
          `${SITE_VIEWPORT_BELOW_NAV_CLASS} flex flex-col overflow-hidden`
      )}
    >
      <IntrospectMorphWash />

      <div
        className={cn(
          'relative z-10 flex min-h-0 flex-col w-full mx-auto px-4 sm:px-6',
          lockViewport
            ? cn(
                'max-w-2xl min-h-0 flex-1 justify-start',
                phase === 'welcome'
                  ? 'gap-0 pt-3 pb-8 lg:pt-4 lg:pb-10'
                  : 'gap-4 py-4 lg:justify-center'
              )
            : 'pt-4 sm:pt-5 pb-5 sm:pb-8 gap-4',
          !lockViewport &&
            (phase === 'questions' && wideQuestion ? 'max-w-5xl' : 'max-w-2xl')
        )}
      >
        {(phase === 'questions' || phase === 'review') && (
          <div className="mx-auto w-full max-w-2xl min-w-0 space-y-1.5">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {phase === 'review'
                  ? ui.review
                  : t(ui.stepOf, { step, total: totalSteps })}
              </span>
              <Link
                href={href('/')}
                className="text-[oklch(42%_0.12_230)] hover:underline underline-offset-2"
              >
                {ui.exit}
              </Link>
            </div>
            <Progress
              value={progressValue}
              aria-label={ui.progressAria}
              indicatorClassName="!bg-[oklch(68%_0.15_230)]"
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={skipIntro ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex min-h-0 flex-1 flex-col h-full"
            >
              <ResetScrollOnMount boardRef={boardRef} />
              <p className="shrink-0 text-center text-xs font-semibold tracking-[0.14em] uppercase text-[oklch(48%_0.12_230)]">
                {ui.welcomeEyebrow}
              </p>
              <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(2.75rem,9vh,5.5rem)] pb-10">
                <WelcomeHeadline
                  greeting={ui.welcomeGreeting}
                  continueLine={
                    isRedesign ? ui.redesignWelcomeContinue : ui.welcomeContinue
                  }
                  fullHeading={
                    isRedesign ? ui.redesignWelcomeHeading : ui.welcomeHeading
                  }
                  skipAnimation={skipIntro}
                />
                <div>
                  <SpectrumFlipCta
                    checkOnHover={false}
                    className="rounded-full"
                    onClick={() => {
                      blurActiveField()
                      setPhase('questions')
                      setStep(1)
                    }}
                  >
                    {ui.getStarted}
                  </SpectrumFlipCta>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'questions' && (
            <motion.form
              key={`step-${step}`}
              id={formId}
              onSubmit={(e) => {
                e.preventDefault()
                goNext()
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className={cn(
                'flex flex-1 flex-col',
                compactQuestion ? 'gap-2.5' : 'gap-4'
              )}
            >
              <ResetScrollOnMount boardRef={boardRef} />
              {questionId === 'about-you' && (
                <StepBlock title={ui.step1Title}>
                  <Field
                    label={ui.nameLabel}
                    error={errors.fullName}
                    warning={warnings.fullName}
                    htmlFor={`${formId}-name`}
                  >
                    <input
                      id={`${formId}-name`}
                      className={fieldClass(errors.fullName, warnings.fullName)}
                      value={answers.fullName}
                      onChange={update('fullName')}
                      autoComplete="name"
                      placeholder={ui.namePlaceholder}
                      inputMode="text"
                      autoCapitalize="words"
                    />
                  </Field>
                  <Field label={ui.emailLabel} error={errors.email} htmlFor={`${formId}-email`}>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      className={fieldClass(errors.email)}
                      value={answers.email}
                      onChange={update('email')}
                      onBlur={() => {
                        if (answers.email.trim() && !isValidEmail(answers.email)) {
                          setErrors((prev) => ({
                            ...prev,
                            email: dict.introspectValidation.liveEmailValid,
                          }))
                        }
                      }}
                      autoComplete="email"
                      placeholder={ui.emailPlaceholder}
                      inputMode="email"
                      spellCheck={false}
                    />
                  </Field>
                  <Field
                    label={ui.phoneLabel}
                    hint={ui.phoneHint}
                    error={errors.phone}
                    htmlFor={`${formId}-phone`}
                  >
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      className={fieldClass(errors.phone)}
                      value={answers.phone}
                      onChange={update('phone')}
                      autoComplete="tel-national"
                      placeholder={ui.phonePlaceholder}
                      inputMode="numeric"
                      maxLength={14}
                      required
                    />
                  </Field>
                </StepBlock>
              )}

              {questionId === 'business' && (
                <StepBlock
                  title={ui.step2Title}
                  subtitle={isRedesign ? ui.step2SubtitleRedesign : undefined}
                >
                  <Field
                    label={ui.businessNameLabel}
                    error={errors.businessName}
                    htmlFor={`${formId}-biz`}
                  >
                    <input
                      id={`${formId}-biz`}
                      className={fieldClass(errors.businessName)}
                      value={answers.businessName}
                      onChange={update('businessName')}
                      placeholder={ui.businessNamePlaceholder}
                    />
                  </Field>
                  <Field
                    label={ui.aboutBusinessLabel}
                    error={errors.aboutBusiness}
                    htmlFor={`${formId}-about`}
                  >
                    <textarea
                      id={`${formId}-about`}
                      className={textareaClass(errors.aboutBusiness)}
                      value={answers.aboutBusiness}
                      onChange={update('aboutBusiness')}
                      placeholder={ui.aboutBusinessPlaceholder}
                    />
                  </Field>
                  <div className="space-y-2.5">
                    <p className="text-base font-semibold text-gray-900 tracking-tight">
                      {ui.locationLabel}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <SubField
                        label={ui.locationCityLabel}
                        htmlFor={`${formId}-city`}
                        error={errors.city}
                      >
                        <LocationCombobox
                          id={`${formId}-city`}
                          value={answers.city}
                          options={isUsLocation ? cityComboboxOptions : []}
                          allowCustom
                          openOnEmpty={isUsLocation && Boolean(usStateCode(answers.state))}
                          placeholder={ui.locationCityPlaceholder}
                          error={Boolean(errors.city)}
                          emptyMessage={ui.locationNoMatches}
                          onChange={(next, option) => {
                            const cityName = option?.label ?? next
                            const fromHint = option?.hint
                            setAnswers((prev) => ({
                              ...prev,
                              city: cityName,
                              state: fromHint
                                ? matchUsState(fromHint)?.name ?? prev.state
                                : prev.state,
                            }))
                            setErrors((prev) => ({
                              ...prev,
                              city:
                                cityName.trim().length > 0
                                  ? locationFieldErrors(
                                      {
                                        city: cityName,
                                        state: fromHint
                                          ? matchUsState(fromHint)?.name ?? answers.state
                                          : answers.state,
                                        country: answers.country,
                                      },
                                      dict.introspectValidation
                                    ).city
                                  : undefined,
                            }))
                          }}
                        />
                      </SubField>
                      <SubField
                        label={ui.locationStateLabel}
                        htmlFor={`${formId}-state`}
                        error={errors.state}
                      >
                        <LocationCombobox
                          id={`${formId}-state`}
                          value={answers.state}
                          options={isUsLocation ? stateComboboxOptions : []}
                          allowCustom={!isUsLocation}
                          openOnEmpty={isUsLocation}
                          placeholder={ui.locationStatePlaceholder}
                          error={Boolean(errors.state)}
                          emptyMessage={ui.locationNoMatches}
                          maxResults={60}
                          onChange={(next) => {
                            const named = matchUsState(next)?.name ?? next
                            setAnswers((prev) => ({ ...prev, state: named }))
                            setErrors((prev) => ({
                              ...prev,
                              state: locationFieldErrors(
                                {
                                  city: answers.city,
                                  state: named,
                                  country: answers.country,
                                },
                                dict.introspectValidation
                              ).state,
                            }))
                          }}
                        />
                      </SubField>
                    </div>
                    <SubField
                      label={ui.locationCountryLabel}
                      htmlFor={`${formId}-country`}
                      error={errors.country}
                    >
                      <LocationCombobox
                        id={`${formId}-country`}
                        value={answers.country || DEFAULT_COUNTRY}
                        options={countryComboboxOptions}
                        openOnEmpty
                        placeholder={ui.locationCountryLabel}
                        error={Boolean(errors.country)}
                        emptyMessage={ui.locationNoMatches}
                        maxResults={300}
                        onChange={(next) => {
                          const code = isCountryCode(next) ? next : DEFAULT_COUNTRY
                          setAnswers((prev) => ({
                            ...prev,
                            country: code,
                          }))
                          setErrors((prev) => ({
                            ...prev,
                            country: undefined,
                            state: undefined,
                          }))
                        }}
                      />
                    </SubField>
                  </div>
                </StepBlock>
              )}

              {questionId === 'online' && (
                <StepBlock
                  title={isRedesign ? ui.step3TitleRedesign : ui.step3Title}
                  subtitle={isRedesign ? ui.step3SubtitleRedesign : ui.step3Subtitle}
                >
                  {!isRedesign && (
                    <ChoiceRow
                      label={ui.hasOnlineLabel}
                      error={errors.hasOnlinePresence}
                      options={hasOnlineOptions}
                      value={answers.hasOnlinePresence}
                      onChange={(v) => setChoice('hasOnlinePresence', v as YesNoUnsure)}
                    />
                  )}
                  <Field
                    label={
                      isRedesign
                        ? ui.websiteUrlLabelRedesign
                        : answers.hasOnlinePresence === 'yes'
                          ? ui.websiteUrlLabelHasSite
                          : ui.websiteUrlLabel
                    }
                    error={errors.websiteUrl}
                    htmlFor={`${formId}-website`}
                  >
                    <input
                      id={`${formId}-website`}
                      type="text"
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      autoComplete="url"
                      className={fieldClass(errors.websiteUrl)}
                      value={answers.websiteUrl}
                      onChange={update('websiteUrl')}
                      onBlur={() => {
                        setAnswers((prev) => {
                          const next = normalizeWebsiteEntry(prev.websiteUrl)
                          if (next === prev.websiteUrl) return prev
                          return { ...prev, websiteUrl: next }
                        })
                      }}
                      placeholder={ui.websiteUrlPlaceholder}
                    />
                  </Field>
                  <LinkListField
                    label={ui.socialLinksLabel}
                    hint={ui.socialLinksHint}
                    links={answers.socialMediaLinks}
                    onChange={(links) => setLinkList('socialMediaLinks', links)}
                    addLabel={ui.addSocialLink}
                    inputPrefix={`${formId}-social`}
                    placeholder={ui.linkPlaceholder}
                    completeAsWebsite
                  />
                  <LinkListField
                    label={ui.admiredLabel}
                    hint={ui.admiredHint}
                    links={answers.admiredWebsiteLinks}
                    onChange={(links) => setLinkList('admiredWebsiteLinks', links)}
                    addLabel={ui.addAdmiredSite}
                    inputPrefix={`${formId}-admire`}
                    placeholder={ui.linkPlaceholder}
                    completeAsWebsite
                  />
                </StepBlock>
              )}

              {questionId === 'logo' && (
                <StepBlock
                  title={ui.step4Title}
                  subtitle={isRedesign ? ui.step4SubtitleRedesign : ui.step4Subtitle}
                >
                  <ChoiceRow
                    label={ui.hasLogoLabel}
                    error={errors.hasLogo}
                    options={yesNoUnsure}
                    value={answers.hasLogo}
                    onChange={(v) => setChoice('hasLogo', v as YesNoUnsure)}
                  />
                  {answers.hasLogo === 'yes' && (
                    <AssetUploadField
                      id={`${formId}-logo-upload`}
                      label={ui.uploadLogoLabel}
                      hint={ui.uploadLogoHint}
                      accept={UPLOAD_ACCEPT}
                      multiple={false}
                      files={logoFile ? [logoFile] : []}
                      error={uploadErrors.logo}
                      onFilesSelected={(list) => onLogoSelected(list?.[0] ?? null)}
                      onRemoveFile={() => onLogoSelected(null)}
                    />
                  )}
                  <ChoiceRow
                    label={ui.hasPhotosLabel}
                    error={errors.hasPhotos}
                    options={yesNoUnsure}
                    value={answers.hasPhotos}
                    onChange={(v) => setChoice('hasPhotos', v as YesNoUnsure)}
                  />
                  {answers.hasPhotos === 'yes' && (
                    <AssetUploadField
                      id={`${formId}-photos-upload`}
                      label={ui.uploadPhotosLabel}
                      hint={t(ui.uploadPhotosHint, { max: MAX_PHOTOS })}
                      accept={UPLOAD_ACCEPT}
                      multiple
                      files={photoFiles}
                      error={uploadErrors.photos}
                      onFilesSelected={onPhotosSelected}
                      onRemoveFile={removePhoto}
                    />
                  )}
                  {(answers.hasLogo === 'yes' || answers.hasPhotos === 'yes') && (
                    <p
                      role="note"
                      className="text-xs sm:text-sm text-gray-600 leading-relaxed rounded-md border border-success/20 bg-success/10 px-3.5 py-3"
                    >
                      {ui.uploadSecurityNotice}
                    </p>
                  )}
                  <ChoiceRow
                    label={ui.needsPhotosLabel}
                    error={errors.needsPhotosTaken}
                    options={yesNoUnsure}
                    value={answers.needsPhotosTaken}
                    onChange={(v) => setChoice('needsPhotosTaken', v as YesNoUnsure)}
                  />
                </StepBlock>
              )}

              {questionId === 'keep-change' && (
                <StepBlock
                  compact
                  title={ui.keepChangeTitle}
                  subtitle={ui.keepChangeSubtitle}
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                    <div>
                      <h2 className="mb-3 font-mi-gente text-lg sm:text-xl text-gray-900 leading-tight text-center">
                        {ui.keepHeading}
                      </h2>
                      <div className="flex flex-col items-start gap-1">
                        {keepItemOptions.map((opt) => {
                          const selected = answers.keepItems.includes(opt.id)
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => toggleKeepItem(opt.id)}
                              className={cn(
                                'w-fit max-w-full rounded-md px-2.5 py-1.5 text-left text-sm leading-snug text-gray-800',
                                'transition-[background-color,font-weight,color] duration-200 ease-out',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep/35 focus-visible:ring-offset-1',
                                selected
                                  ? 'bg-sky-soft font-semibold text-gray-900'
                                  : 'font-normal hover:bg-sky-soft/35'
                              )}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                      {errors.keepItems && (
                        <p className="mt-2 text-sm text-error" role="alert">
                          {errors.keepItems}
                        </p>
                      )}
                    </div>
                    <div>
                      <h2 className="mb-3 font-mi-gente text-lg sm:text-xl text-gray-900 leading-tight text-center">
                        {ui.changeHeading}
                      </h2>
                      <div className="flex flex-col items-start gap-1">
                        {changePriorityOptions.map((opt) => {
                          const selected = answers.changePriorities.includes(opt.id)
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => toggleChangePriority(opt.id)}
                              className={cn(
                                'w-fit max-w-full rounded-md px-2.5 py-1.5 text-left text-sm leading-snug text-gray-800',
                                'transition-[background-color,font-weight,color] duration-200 ease-out',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep/35 focus-visible:ring-offset-1',
                                selected
                                  ? 'bg-sky-soft font-semibold text-gray-900'
                                  : 'font-normal hover:bg-sky-soft/35'
                              )}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                      {errors.changePriorities && (
                        <p className="mt-2 text-sm text-error" role="alert">
                          {errors.changePriorities}
                        </p>
                      )}
                    </div>
                  </div>
                  <Field
                    label={ui.keepChangeNotesLabel}
                    htmlFor={`${formId}-site-notes`}
                  >
                    <textarea
                      id={`${formId}-site-notes`}
                      className={textareaClass()}
                      value={answers.currentSiteNotes}
                      onChange={update('currentSiteNotes')}
                      placeholder={ui.keepChangeNotesPlaceholder}
                    />
                  </Field>
                </StepBlock>
              )}

              {questionId === 'visitor-actions' && (
                <StepBlock
                  compact
                  title={isRedesign ? ui.step5TitleRedesign : ui.step5Title}
                  subtitle={isRedesign ? ui.step5HintRedesign : ui.step5Hint}
                >
                  <fieldset>
                    <legend className="sr-only">{ui.step5Title}</legend>
                    <div className="grid grid-flow-col grid-cols-2 grid-rows-[repeat(20,auto)] justify-items-start gap-x-8 gap-y-0.5 sm:grid-cols-3 sm:grid-rows-[repeat(14,auto)] sm:gap-x-10 lg:grid-cols-4 lg:grid-rows-[repeat(10,auto)] lg:gap-x-12">
                      {visitorActionOptions.map((opt) => {
                        const selected = answers.visitorActions.includes(opt.id)
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleVisitorAction(opt.id)}
                            className={cn(
                              'w-fit max-w-full rounded-md px-2.5 py-1.5 text-left text-sm leading-snug text-gray-800',
                              'transition-[background-color,font-weight,color] duration-200 ease-out',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep/35 focus-visible:ring-offset-1',
                              selected
                                ? 'bg-sky-soft font-semibold text-gray-900'
                                : 'font-normal hover:bg-sky-soft/35'
                            )}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                  {errors.visitorActions && (
                    <p className="text-sm text-error" role="alert">
                      {errors.visitorActions}
                    </p>
                  )}
                </StepBlock>
              )}

              {questionId === 'site-depth' && (
                <StepBlock
                  compact
                  title={ui.step6Title}
                  subtitle={isRedesign ? ui.step6SubtitleRedesign : ui.step6Subtitle}
                >
                  <div className="grid gap-2">
                    {siteDepthOptions.map((opt) => {
                      const selected = answers.siteDepth === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setChoice('siteDepth', opt.id as SiteDepth)}
                          className={cn(
                            'text-left rounded-lg border px-3.5 py-3 transition-colors',
                            selected ? cardSelectedClass : cardUnselectedClass
                          )}
                        >
                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {opt.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 leading-snug">
                            {opt.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                  {errors.siteDepth && (
                    <p className="text-sm text-error" role="alert">
                      {errors.siteDepth}
                    </p>
                  )}
                </StepBlock>
              )}

              {questionId === 'design' && (
                <StepBlock
                  compact
                  centered
                  title={ui.step7Title}
                  subtitle={ui.step7Subtitle}
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                    <div>
                      <div className="mb-3 space-y-2 border-b border-gray-200/90 pb-2.5">
                        <h2 className="font-mi-gente text-lg sm:text-xl text-gray-900 leading-tight text-center">
                          {ui.designFeelHeading}
                        </h2>
                        {isRedesign && (
                          <SoftCheckbox
                            checked={Boolean(answers.keepCurrentLook)}
                            onChange={toggleKeepCurrentLook}
                            label={ui.keepCurrentLook}
                          />
                        )}
                        <SoftCheckbox
                          checked={Boolean(answers.designFeelNoPreference)}
                          onChange={toggleDesignFeelNoPreference}
                          label={ui.noPreference}
                        />
                      </div>
                      <div
                        className={cn(
                          'grid grid-cols-2 gap-2 transition-opacity',
                          designLocked && 'pointer-events-none opacity-40'
                        )}
                        aria-disabled={designLocked}
                      >
                        {designFeelOptions.map((opt) => {
                          const selected = answers.designFeels.includes(opt.id)
                          const Icon = DESIGN_FEEL_ICONS[opt.id]
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleDesignFeel(opt.id)}
                              aria-pressed={selected}
                              disabled={designLocked}
                              title={opt.description}
                              className={cn(
                                'flex h-full cursor-pointer items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors',
                                selected
                                  ? 'text-gray-900 outline outline-1 outline-offset-2 outline-gray-800'
                                  : 'text-gray-600 outline outline-1 outline-transparent hover:outline-gray-300 hover:text-gray-900',
                                designLocked && 'cursor-default'
                              )}
                            >
                              <Icon
                                className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                              <span className="min-w-0">
                                <span className="block text-sm font-medium leading-none">
                                  {opt.title}
                                </span>
                                <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">
                                  {opt.description}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      {errors.designFeels && (
                        <p className="mt-2 text-sm text-error" role="alert">
                          {errors.designFeels}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="mb-3 space-y-2 border-b border-gray-200/90 pb-2.5">
                        <h2 className="font-mi-gente text-lg sm:text-xl text-gray-900 leading-tight text-center">
                          {ui.colorsHeading}
                        </h2>
                        <div className="flex flex-col items-start gap-1.5">
                          <SoftCheckbox
                            checked={Boolean(answers.colorPaletteFromLogo)}
                            onChange={toggleColorPaletteFromLogo}
                            label={ui.matchLogoColors}
                          />
                          <SoftCheckbox
                            checked={Boolean(answers.colorPaletteNoPreference)}
                            onChange={toggleColorPaletteNoPreference}
                            label={ui.noPreference}
                          />
                        </div>
                      </div>
                      <div
                        className={cn(
                          'grid grid-cols-2 gap-2 sm:grid-cols-3 transition-opacity',
                          colorsLocked && 'pointer-events-none opacity-40'
                        )}
                        aria-disabled={colorsLocked}
                      >
                        {colorPaletteOptions.map((opt) => {
                          const selected = answers.colorPalettes.includes(opt.id)
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleColorPalette(opt.id)}
                              aria-pressed={selected}
                              disabled={colorsLocked}
                              className={cn(
                                'flex h-full cursor-pointer flex-col items-start gap-1.5 rounded-md px-2 py-2 text-left transition-colors',
                                selected
                                  ? 'outline outline-1 outline-offset-2 outline-gray-800'
                                  : 'outline outline-1 outline-transparent hover:outline-gray-300',
                                colorsLocked && 'cursor-default'
                              )}
                            >
                              <span className="flex items-center pl-0.5">
                                {opt.swatches.map((c, i) => (
                                  <span
                                    key={`${opt.id}-${c}`}
                                    className={cn(
                                      'h-7 w-7 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]',
                                      i > 0 && '-ml-2'
                                    )}
                                    style={{
                                      backgroundColor: c,
                                      zIndex: opt.swatches.length - i,
                                    }}
                                  />
                                ))}
                              </span>
                              <span
                                className={cn(
                                  'text-xs font-medium leading-snug',
                                  selected ? 'text-gray-900' : 'text-gray-600'
                                )}
                              >
                                {opt.title}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      {errors.colorPalettes && (
                        <p className="mt-2 text-sm text-error" role="alert">
                          {errors.colorPalettes}
                        </p>
                      )}

                      {!colorsLocked &&
                        (answers.colorPalettes.includes('custom') ||
                          answers.colorPalettes.length > 0) && (
                          <div className="mt-3">
                            <Field
                              label={
                                answers.colorPalettes.includes('custom')
                                  ? ui.colorNotesLabelCustom
                                  : ui.colorNotesLabelOptional
                              }
                              error={errors.colorNotes}
                              htmlFor={`${formId}-colors`}
                              hint={
                                answers.colorPalettes.includes('custom')
                                  ? ui.colorNotesHint
                                  : undefined
                              }
                            >
                              <textarea
                                id={`${formId}-colors`}
                                className={cn(
                                  textareaClass(errors.colorNotes),
                                  '!min-h-[3.5rem]'
                                )}
                                value={answers.colorNotes}
                                onChange={update('colorNotes')}
                                placeholder={ui.colorNotesPlaceholder}
                              />
                            </Field>
                          </div>
                        )}
                    </div>
                  </div>
                </StepBlock>
              )}

              {questionId === 'avoid' && (
                <StepBlock title={ui.step8Title}>
                  <textarea
                    id={`${formId}-avoid`}
                    aria-label={ui.step8Aria}
                    className={textareaClass()}
                    value={answers.designAvoidances}
                    onChange={update('designAvoidances')}
                    placeholder={ui.step8Placeholder}
                  />
                </StepBlock>
              )}

              {questionId === 'extras' && (
                <StepBlock title={ui.step9Title}>
                  <textarea
                    id={`${formId}-extras`}
                    aria-label={ui.step9Aria}
                    className={textareaClass()}
                    value={answers.businessExtras}
                    onChange={update('businessExtras')}
                    placeholder={
                      isRedesign ? ui.step9PlaceholderRedesign : ui.step9Placeholder
                    }
                  />
                </StepBlock>
              )}

              {status === 'error' && serverMessage && (
                <p className="text-sm text-error" role="alert">
                  {serverMessage}
                </p>
              )}

              <div
                className={cn(
                  'mt-auto flex items-center gap-3',
                  questionId === 'design' ? 'relative justify-center' : 'justify-between',
                  compactQuestion ? 'pt-1' : 'pt-2'
                )}
              >
                <button
                  type="button"
                  onClick={goBack}
                  className={cn(
                    'inline-flex h-11 items-center gap-1 rounded-md py-1.5 pl-1 pr-2 text-sm font-medium text-gray-700 hover:bg-sand/60 active:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer',
                    questionId === 'design' && 'absolute left-0'
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 shrink-0"
                    aria-hidden
                  >
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {ui.back}
                </button>
                <Button
                  type="submit"
                  isLoading={status === 'submitting'}
                  disabled={status === 'submitting' || !canContinue}
                  aria-disabled={status === 'submitting' || !canContinue}
                  className={skyButtonClass}
                >
                  {editingFromReview
                    ? ui.reviewDone
                    : step === totalSteps
                      ? ui.continueToReview
                      : nameConfirmPending && questionId === 'about-you'
                        ? ui.yesContinue
                        : ui.continue}
                </Button>
              </div>
            </motion.form>
          )}

          {phase === 'review' && (
            <motion.form
              key="review"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="flex flex-1 flex-col gap-4"
            >
              <ResetScrollOnMount boardRef={boardRef} />
              <div className="space-y-1">
                <h1 className="font-mi-gente text-2xl text-gray-900 leading-tight">
                  {ui.reviewHeading}
                </h1>
                <p className="text-sm text-gray-600 leading-snug">{ui.reviewSubtitle}</p>
              </div>

              <div className="space-y-4 text-sm">
                <ReviewSection
                  title={ui.reviewAboutYou}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('about-you')}
                >
                  <ReviewRow label={ui.reviewName} value={answers.fullName || dash} />
                  <ReviewRow label={ui.reviewEmail} value={answers.email || dash} />
                  <ReviewRow label={ui.reviewPhone} value={answers.phone || dash} />
                </ReviewSection>

                <ReviewSection
                  title={ui.reviewYourBusiness}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('business')}
                >
                  <ReviewRow
                    label={ui.reviewBusinessProject}
                    value={answers.businessName || dash}
                  />
                  <ReviewRow
                    label={ui.reviewLocation}
                    value={formatLocation(answers, locale) || dash}
                  />
                  <ReviewRow
                    label={ui.reviewWhatYouDo}
                    value={answers.aboutBusiness || dash}
                  />
                </ReviewSection>

                <ReviewSection
                  title={isRedesign ? ui.reviewCurrentWebsite : ui.reviewOnlinePresence}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('online')}
                >
                  {!isRedesign && (
                    <ReviewRow
                      label={ui.reviewAlreadyOnline}
                      value={hasOnlineLabelFor(answers.hasOnlinePresence)}
                    />
                  )}
                  <ReviewRow
                    label={ui.reviewWebsite}
                    value={answers.websiteUrl.trim() || dash}
                  />
                  <ReviewRow
                    label={ui.reviewSocialLinks}
                    value={listOrDash(answers.socialMediaLinks)}
                  />
                  <ReviewRow
                    label={ui.reviewSitesAdmire}
                    value={listOrDash(answers.admiredWebsiteLinks)}
                  />
                </ReviewSection>

                <ReviewSection
                  title={ui.reviewLogoPhotos}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('logo')}
                >
                  <ReviewRow label={ui.reviewHasLogo} value={yesNoLabel(answers.hasLogo)} />
                  {answers.hasLogo === 'yes' && (
                    <ReviewRow
                      label={ui.reviewLogoFile}
                      value={logoFile?.name || answers.logoFileName || dash}
                    />
                  )}
                  <ReviewRow
                    label={ui.reviewHasPhotos}
                    value={yesNoLabel(answers.hasPhotos)}
                  />
                  {answers.hasPhotos === 'yes' && (
                    <ReviewRow
                      label={ui.reviewPhotoFiles}
                      value={
                        photoFiles.length > 0
                          ? photoFiles.map((f) => f.name).join(', ')
                          : listOrDash(answers.photoFileNames)
                      }
                    />
                  )}
                  <ReviewRow
                    label={ui.reviewNeedPhotos}
                    value={yesNoLabel(answers.needsPhotosTaken)}
                  />
                </ReviewSection>

                {isRedesign && (
                  <ReviewSection
                    title={ui.reviewKeepChange}
                    editLabel={ui.reviewEdit}
                    onEdit={() => editReviewSection('keep-change')}
                  >
                    <ReviewRow
                      label={ui.reviewKeep}
                      value={formatKeepItemLabels(answers.keepItems, dict) || dash}
                    />
                    <ReviewRow
                      label={ui.reviewChange}
                      value={
                        formatChangePriorityLabels(answers.changePriorities, dict) || dash
                      }
                    />
                    {answers.currentSiteNotes.trim() && (
                      <ReviewRow
                        label={ui.reviewCurrentSiteNotes}
                        value={answers.currentSiteNotes.trim()}
                      />
                    )}
                  </ReviewSection>
                )}

                <ReviewSection
                  title={ui.reviewVisitorsShouldDo}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('visitor-actions')}
                >
                  <ReviewRow
                    label={ui.reviewActions}
                    value={
                      formatVisitorActionLabels(answers.visitorActions, dict) || dash
                    }
                  />
                </ReviewSection>

                <ReviewSection
                  title={ui.reviewSiteScope}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('site-depth')}
                >
                  <ReviewRow label={ui.reviewHowDeveloped} value={depthLabel} />
                </ReviewSection>

                <ReviewSection
                  title={ui.reviewDesignColors}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('design')}
                >
                  <ReviewRow label={ui.reviewDesignFeel} value={feelLabels} />
                  <ReviewRow label={ui.reviewColors} value={colorLabels} />
                  {answers.colorNotes.trim() && (
                    <ReviewRow
                      label={ui.reviewColorNotes}
                      value={answers.colorNotes.trim()}
                    />
                  )}
                </ReviewSection>

                <ReviewSection
                  title={ui.reviewSteerClear}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('avoid')}
                >
                  <ReviewRow
                    label={ui.reviewAvoid}
                    value={answers.designAvoidances.trim() || dash}
                  />
                </ReviewSection>

                <ReviewSection
                  title={ui.reviewAnythingElse}
                  editLabel={ui.reviewEdit}
                  onEdit={() => editReviewSection('extras')}
                >
                  <ReviewRow
                    label={ui.reviewNotes}
                    value={answers.businessExtras.trim() || dash}
                  />
                </ReviewSection>
              </div>

              {status === 'error' && serverMessage && (
                <p className="text-sm text-error" role="alert">
                  {serverMessage}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex h-11 items-center gap-1 rounded-md py-1.5 pl-1 pr-2 text-sm font-medium text-gray-700 hover:bg-sand/60 active:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 shrink-0"
                    aria-hidden
                  >
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {ui.back}
                </button>
                <Button
                  type="submit"
                  isLoading={status === 'submitting'}
                  disabled={status === 'submitting'}
                  className={skyButtonClass}
                >
                  {ui.submitIntrospect}
                </Button>
              </div>
            </motion.form>
          )}

          {phase === 'success' && (
            <div key="success" className="flex min-h-0 flex-1 flex-col h-full">
              <ResetScrollOnMount boardRef={boardRef} />
              <IntrospectSuccess ui={successUi} homeHref={href('/')} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** Soft sky checkbox — matches Introspect Start / Continue accents */
function SoftCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600 select-none">
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
          checked={checked}
          onChange={onChange}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none flex h-4 w-4 items-center justify-center rounded-[5px] border transition-colors',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[oklch(68%_0.15_230)/0.45] peer-focus-visible:ring-offset-1',
            checked
              ? 'border-[oklch(68%_0.15_230)] bg-[oklch(68%_0.15_230)]'
              : 'border-gray-300 bg-white/85 peer-hover:border-[oklch(62%_0.12_230)]'
          )}
        >
          {checked ? (
            <Check className="h-3 w-3 text-white" strokeWidth={2.75} aria-hidden />
          ) : null}
        </span>
      </span>
      <span>{label}</span>
    </label>
  )
}

function StepBlock({
  title,
  subtitle,
  children,
  compact = false,
  centered = false,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  compact?: boolean
  centered?: boolean
}) {
  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-5'}>
      <div
        className={cn(
          compact ? 'space-y-0.5' : 'space-y-1.5',
          centered && 'text-center'
        )}
      >
        <h1
          className={cn(
            'font-mi-gente text-gray-900 leading-tight',
            compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              'text-gray-600 leading-snug',
              compact ? 'text-sm' : 'text-sm sm:text-base'
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className={compact ? 'space-y-2.5' : 'space-y-7'}>{children}</div>
    </div>
  )
}

function ReviewSection({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string
  editLabel: string
  onEdit: () => void
  children: ReactNode
}) {
  return (
    <section className="space-y-2 border-t border-gray-200/80 pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="!font-sans text-sm font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`${editLabel}: ${title}`}
          className="shrink-0 rounded-sm text-sm font-medium text-[oklch(42%_0.12_230)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer"
        >
          {editLabel}
        </button>
      </div>
      <dl className="space-y-2">{children}</dl>
    </section>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[9.5rem_1fr] sm:gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900 whitespace-pre-wrap break-words">{value}</dd>
    </div>
  )
}

function LinkListField({
  label,
  hint,
  links,
  onChange,
  addLabel,
  inputPrefix,
  placeholder,
  inputType = 'text',
  completeAsWebsite = false,
  error,
}: {
  label?: string
  hint?: string
  links: string[]
  onChange: (links: string[]) => void
  addLabel: string
  inputPrefix: string
  placeholder?: string
  inputType?: 'text'
  completeAsWebsite?: boolean
  error?: string
}) {
  const { dict } = useLocale()

  const updateLink = (index: number, value: string) => {
    const next = [...links]
    next[index] = value
    onChange(next)
  }

  const completeLink = (index: number, value: string) => {
    if (!completeAsWebsite) return
    const nextValue = normalizeWebsiteEntry(value)
    if (nextValue === value) return
    updateLink(index, nextValue)
  }

  const removeLink = (index: number) => {
    if (links.length <= 1) {
      onChange([''])
      return
    }
    onChange(links.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2.5">
      {(label || hint) && (
        <div className="space-y-1">
          {label ? (
            <p className="text-base font-semibold text-gray-900 tracking-tight">{label}</p>
          ) : null}
          {hint ? (
            <p className="text-xs sm:text-[0.8125rem] text-gray-500 leading-relaxed">{hint}</p>
          ) : null}
        </div>
      )}
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={`${inputPrefix}-${index}`} className="flex gap-2">
            <input
              id={`${inputPrefix}-${index}`}
              type={inputType}
              inputMode={completeAsWebsite ? 'url' : undefined}
              autoCapitalize={completeAsWebsite ? 'none' : undefined}
              autoCorrect={completeAsWebsite ? 'off' : undefined}
              spellCheck={completeAsWebsite ? false : undefined}
              autoComplete={completeAsWebsite ? 'url' : undefined}
              className={fieldClass(index === 0 ? error : undefined)}
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              onBlur={(e) => completeLink(index, e.target.value)}
              placeholder={placeholder}
            />
            {links.length > 1 ? (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="shrink-0 min-h-11 px-3 rounded-md border border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
                aria-label={dict.introspectUi.removeItemAria}
              >
                {dict.introspectUi.removeItem}
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...links, ''])}
        className="inline-flex items-center gap-1 pt-0.5 text-sm font-semibold text-[oklch(42%_0.12_230)] hover:text-[oklch(36%_0.12_230)] transition-colors cursor-pointer"
      >
        <span aria-hidden>+</span> {addLabel}
      </button>
      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function SubField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  warning,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  warning?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <label htmlFor={htmlFor} className="block text-base font-semibold text-gray-900 tracking-tight">
          {label}
        </label>
        {hint ? (
          <p className="text-xs sm:text-[0.8125rem] text-gray-500 leading-relaxed">{hint}</p>
        ) : null}
      </div>
      {children}
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {!error && warning && (
        <p className="text-sm text-amber-700" role="status">
          {warning}
        </p>
      )}
    </div>
  )
}

function ChoiceRow({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
  error?: string
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-base font-semibold text-gray-900 tracking-tight">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                'min-h-11 px-4 rounded-lg border text-sm font-medium transition-colors cursor-pointer',
                selected ? choiceSelectedClass : choiceUnselectedClass
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function AssetUploadField({
  id,
  label,
  hint,
  accept,
  multiple,
  files,
  error,
  onFilesSelected,
  onRemoveFile,
}: {
  id: string
  label: string
  hint?: string
  accept: string
  multiple: boolean
  files: File[]
  error?: string
  onFilesSelected: (files: FileList | null) => void
  onRemoveFile: (index: number) => void
}) {
  const { dict, t } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="-mt-1 space-y-2.5">
      <div className="space-y-1">
        <label htmlFor={id} className="block text-base font-semibold text-gray-900 tracking-tight">
          {label}
        </label>
        {hint ? (
          <p className="text-xs sm:text-[0.8125rem] text-gray-500 leading-relaxed">{hint}</p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          onFilesSelected(e.target.files)
          e.target.value = ''
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3.5',
          'text-sm font-medium text-gray-700 transition-colors cursor-pointer',
          'border-gray-300 bg-white/70 hover:border-[oklch(62%_0.12_230)] hover:bg-[oklch(96%_0.04_230/0.55)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1'
        )}
      >
        <Upload className="h-4 w-4 shrink-0 text-[oklch(42%_0.12_230)]" aria-hidden />
        {multiple
          ? files.length > 0
            ? dict.introspectUi.addMorePictures
            : dict.introspectUi.choosePictures
          : files.length > 0
            ? dict.introspectUi.replaceLogo
            : dict.introspectUi.chooseLogoFile}
      </button>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center gap-2 rounded-md border border-gray-200 bg-white/80 px-3 py-2 text-sm"
            >
              <span className="min-w-0 flex-1 truncate text-gray-800">{file.name}</span>
              <span className="shrink-0 text-xs text-gray-500">{formatFileSize(file.size)}</span>
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-sand/70 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
                aria-label={t(dict.introspectUi.removeFileAria, { name: file.name })}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
