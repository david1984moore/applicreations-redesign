'use client'

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
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
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import {
  aboutBusinessError,
  businessNameError,
  COLOR_PALETTE_OPTIONS,
  DESIGN_FEEL_OPTIONS,
  emptyAnswers,
  formatPhoneUS,
  isValidEmail,
  liveEmailError,
  locationError,
  mergeDraftAnswers,
  NAME_SOFT_WARNING,
  nameHardError,
  nameLooksSuspicious,
  phoneDigits,
  recommendPlan,
  SITE_DEPTH_OPTIONS,
  YES_NO_UNSURE,
  type ColorPalette,
  type DesignFeel,
  type IntrospectAnswers,
  type SiteDepth,
  type YesNoUnsure,
} from '@/lib/introspect'
import {
  isPlanId,
  isSupportPlanId,
  planIdToSiteDepth,
  readPricingSelectionHandoff,
  type PlanId,
  type SupportPlanId,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'applicreations-introspect-draft'
const TOTAL_STEPS = 9 // welcome is phase 'welcome'; steps 1–9 are questions

const UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg'
const MAX_LOGO_BYTES = 5 * 1024 * 1024
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_PHOTOS = 12

const UPLOAD_SECURITY_NOTICE =
  "Uploads are optional. Uploads are protected by Google's infrastructure-level encryption (AES-256 at rest, TLS in transit). Applicreations keeps the folder access restricted to Applicreations only, and files are deleted from the shared folder within 30 days of project completion."

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Light purple selection — cohesive with progress bar / logo gradient */
const choiceSelectedClass =
  'border-[oklch(58%_0.13_280)] bg-[oklch(96%_0.04_280)] text-[oklch(38%_0.10_280)] ring-2 ring-[oklch(58%_0.13_280/0.18)]'
const choiceUnselectedClass =
  'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
const cardSelectedClass =
  'border-[oklch(58%_0.13_280)] bg-[oklch(96%_0.04_280/0.85)] ring-2 ring-[oklch(58%_0.13_280/0.18)]'
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

function yesNoLabel(value: YesNoUnsure | ''): string {
  if (!value) return '—'
  return YES_NO_UNSURE.find((o) => o.id === value)?.label ?? value
}

function listOrDash(items: string[]): string {
  const cleaned = items.map((s) => s.trim()).filter(Boolean)
  return cleaned.length > 0 ? cleaned.join(', ') : '—'
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

function validateStep(step: number, answers: IntrospectAnswers): FieldErrors {
  const errors: FieldErrors = {}

  if (step === 1) {
    const nameErr = nameHardError(answers.fullName)
    if (nameErr) errors.fullName = nameErr
    if (!isValidEmail(answers.email)) {
      errors.email = 'Please enter a valid email (like jane@example.com)'
    }
    const digits = phoneDigits(answers.phone)
    if (digits.length < 10) {
      errors.phone = 'Please enter a full 10-digit phone number'
    }
  }

  if (step === 2) {
    const bizErr = businessNameError(answers.businessName)
    if (bizErr) errors.businessName = bizErr
    const aboutErr = aboutBusinessError(answers.aboutBusiness)
    if (aboutErr) errors.aboutBusiness = aboutErr
    const locErr = locationError(answers.location)
    if (locErr) errors.location = locErr
  }

  if (step === 3) {
    if (!answers.hasOnlinePresence) {
      errors.hasOnlinePresence = 'Please choose one'
    }
  }

  if (step === 4) {
    if (!answers.hasLogo) errors.hasLogo = 'Please choose one'
    if (!answers.hasPhotos) errors.hasPhotos = 'Please choose one'
    if (!answers.needsPhotosTaken) errors.needsPhotosTaken = 'Please choose one'
  }

  if (step === 5) {
    const actions = answers.visitorActions.map((a) => a.trim()).filter(Boolean)
    if (actions.length === 0) {
      errors.visitorActions = 'Please list at least one thing people should be able to do'
    }
  }

  if (step === 6) {
    if (!answers.siteDepth) {
      errors.siteDepth = 'Please choose how full you want the site to be'
    }
  }

  if (step === 7) {
    if (!answers.designFeelNoPreference && answers.designFeels.length === 0) {
      errors.designFeels = 'Pick at least one design feel, or choose no preference'
    }
    if (
      !answers.colorPaletteNoPreference &&
      !answers.colorPaletteFromLogo &&
      answers.colorPalettes.length === 0
    ) {
      errors.colorPalettes =
        'Pick at least one color direction, match your logo, or choose no preference'
    }
    if (
      !answers.colorPaletteNoPreference &&
      !answers.colorPaletteFromLogo &&
      answers.colorPalettes.includes('custom') &&
      answers.colorNotes.trim().length < 2
    ) {
      errors.colorNotes = 'Tell us a bit about the colors you have in mind'
    }
  }

  // steps 8–9 (avoidances, business extras) are optional

  return errors
}

export function IntrospectBoard() {
  const formId = useId()
  const [phase, setPhase] = useState<Phase>('welcome')
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<IntrospectAnswers>(emptyAnswers)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [warnings, setWarnings] = useState<FieldErrors>({})
  const [nameConfirmPending, setNameConfirmPending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [recommendation, setRecommendation] = useState<ReturnType<
    typeof recommendPlan
  > | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [uploadErrors, setUploadErrors] = useState<{ logo?: string; photos?: string }>({})
  /** True when a website package was chosen on /pricing — skip site-depth step. */
  const [skipSiteDepth, setSkipSiteDepth] = useState(false)

  useEffect(() => {
    let draft: IntrospectAnswers = emptyAnswers
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
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
    const stored = fromPricing || queryPlan || querySupport ? readPricingSelectionHandoff() : null

    const planId: PlanId | null = isPlanId(queryPlan)
      ? queryPlan
      : stored?.planId ?? (isPlanId(draft.selectedPlanId) ? draft.selectedPlanId : null)
    const supportId: SupportPlanId | null = isSupportPlanId(querySupport)
      ? querySupport
      : stored?.supportId ??
        (isSupportPlanId(draft.selectedSupportId) ? draft.selectedSupportId : null)

    const cameFromPricing = Boolean(fromPricing || stored?.planId || stored?.supportId)

    if (cameFromPricing || planId || supportId) {
      draft = {
        ...draft,
        selectedPlanId: planId ?? '',
        selectedSupportId: supportId ?? '',
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

    setAnswers(draft)
  }, [])

  useEffect(() => {
    if (phase !== 'questions' && phase !== 'review') return
    try {
      // File binaries aren't persisted — omit names so drafts don't claim uploads we don't have.
      const { logoFileName: _logo, photoFileNames: _photos, ...persistable } = answers
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
    } catch {
      /* ignore quota */
    }
  }, [answers, phase])

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
        const live = liveEmailError(value)
        setErrors((prev) => ({ ...prev, email: live }))
        return
      }
      if (field === 'phone') {
        const digits = phoneDigits(value)
        const phoneErr =
          digits.length >= 4 && digits.length < 10
            ? 'Keep typing — a full number looks like (555) 123-4567'
            : undefined
        setErrors((prev) => ({ ...prev, phone: phoneErr }))
        return
      }
      if (field === 'fullName') {
        const hard = nameHardError(value)
        // Only show hard errors live once they've typed something short/odd
        if (hard && value.trim().length >= 2) {
          setErrors((prev) => ({ ...prev, fullName: hard }))
        } else {
          setErrors((prev) => ({ ...prev, fullName: undefined }))
        }
        return
      }

      if (field === 'businessName') {
        const t = value.trim()
        setErrors((prev) => ({
          ...prev,
          businessName: t.length > 0 ? businessNameError(value) : undefined,
        }))
        return
      }
      if (field === 'aboutBusiness') {
        const t = value.trim()
        setErrors((prev) => ({
          ...prev,
          aboutBusiness: t.length > 0 ? aboutBusinessError(value) : undefined,
        }))
        return
      }
      if (field === 'location') {
        const t = value.trim()
        setErrors((prev) => ({
          ...prev,
          location: t.length > 0 ? locationError(value) : undefined,
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
        logo: 'Logo must be 5 MB or smaller',
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
        photos: `"${tooLarge.name}" is over 10 MB — please choose a smaller file`,
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
      photos: hitLimit ? `You can upload up to ${MAX_PHOTOS} pictures` : undefined,
    }))
  }

  const removePhoto = (index: number) => {
    const next = photoFiles.filter((_, i) => i !== index)
    setPhotoFiles(next)
    setAnswers((a) => ({ ...a, photoFileNames: next.map((f) => f.name) }))
    setUploadErrors((prev) => ({ ...prev, photos: undefined }))
  }

  const setLinkList = (
    field: 'socialMediaLinks' | 'admiredWebsiteLinks' | 'visitorActions',
    links: string[]
  ) => {
    setAnswers((prev) => ({ ...prev, [field]: links }))
    if (field === 'visitorActions' && errors.visitorActions) {
      setErrors((prev) => ({ ...prev, visitorActions: undefined }))
    }
  }

  const toggleDesignFeel = (id: DesignFeel) => {
    setAnswers((prev) => {
      const has = prev.designFeels.includes(id)
      return {
        ...prev,
        designFeelNoPreference: false,
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
        colorPalettes: next ? [] : prev.colorPalettes,
        colorNotes: next ? '' : prev.colorNotes,
      }
    })
    if (errors.colorPalettes) setErrors((prev) => ({ ...prev, colorPalettes: undefined }))
    if (errors.colorNotes) setErrors((prev) => ({ ...prev, colorNotes: undefined }))
  }

  const advanceFrom = (current: number) => {
    let next = current + 1
    if (skipSiteDepth && next === 6) next = 7
    return next
  }

  const retreatFrom = (current: number) => {
    let prev = current - 1
    if (skipSiteDepth && prev === 6) prev = 5
    return prev
  }

  const stepErrors = validateStep(step, answers)
  const canContinue = Object.keys(stepErrors).length === 0

  const goNext = () => {
    const nextErrors = validateStep(step, answers)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setWarnings({})
      return
    }

    if (step === 1 && nameLooksSuspicious(answers.fullName) && !nameConfirmPending) {
      setWarnings({ fullName: NAME_SOFT_WARNING })
      setNameConfirmPending(true)
      return
    }

    setErrors({})
    setWarnings({})
    setNameConfirmPending(false)
    if (step < TOTAL_STEPS) {
      const next = advanceFrom(step)
      if (next > TOTAL_STEPS) {
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
    if (phase === 'review') {
      setPhase('questions')
      setStep(TOTAL_STEPS)
      return
    }
    if (step === 1) {
      setPhase('welcome')
      return
    }
    setStep(Math.max(1, retreatFrom(step)))
  }

  useEffect(() => {
    if (skipSiteDepth && step === 6) setStep(7)
  }, [skipSiteDepth, step])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep(TOTAL_STEPS, answers)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setPhase('questions')
      setStep(TOTAL_STEPS)
      return
    }

    const rec = recommendPlan(answers)
    setRecommendation(rec)
    setStatus('submitting')
    setServerMessage('')

    try {
      const formData = new FormData()
      formData.append('answers', JSON.stringify(answers))
      formData.append('recommendation', JSON.stringify(rec))
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
        setServerMessage(data.message || 'Something went wrong. Please try again.')
        return
      }

      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      setLogoFile(null)
      setPhotoFiles([])
      setStatus('idle')
      setPhase('success')
    } catch {
      setStatus('error')
      setServerMessage('Something went wrong. Please try again or email us directly.')
    }
  }

  const progressValue =
    phase === 'questions' ? (step / TOTAL_STEPS) * 100 : phase === 'review' ? 100 : 0

  const lockViewport = phase === 'welcome' || phase === 'success'

  const depthLabel =
    SITE_DEPTH_OPTIONS.find((o) => o.id === answers.siteDepth)?.title || '—'
  const feelLabels = answers.designFeelNoPreference
    ? 'No preference — you decide'
    : answers.designFeels
        .map((id) => DESIGN_FEEL_OPTIONS.find((o) => o.id === id)?.title || id)
        .join(', ') || '—'
  const colorLabels = answers.colorPaletteFromLogo
    ? 'Match colors from my logo'
    : answers.colorPaletteNoPreference
      ? 'No preference — you decide'
      : answers.colorPalettes
          .map((id) => COLOR_PALETTE_OPTIONS.find((o) => o.id === id)?.title || id)
          .join(', ') || '—'

  return (
    <section
      className={cn(
        // overflow-x visible so the top Back control can sit left of the question column
        'relative bg-paper coastal-wash',
        // Match nav spacer so welcome/success fit one screen with no page scroll
        lockViewport && 'h-[calc(100svh-var(--spacing-12))] overflow-hidden'
      )}
    >
      <div className="pointer-events-none absolute inset-0 coastal-grain opacity-60" aria-hidden />

      <div
        className={cn(
          'relative z-10 flex flex-col w-full mx-auto px-4 sm:px-6',
          lockViewport
            ? 'h-full max-w-2xl justify-center gap-4 py-4'
            : 'pt-4 sm:pt-5 pb-8 gap-4',
          !lockViewport &&
            (phase === 'questions' && step === 7 ? 'max-w-5xl' : 'max-w-2xl')
        )}
      >
        {(phase === 'questions' || phase === 'review') && (
          <div className="relative mx-auto w-full max-w-2xl">
            {/* Sits left of the question column so progress aligns with the form */}
            <button
              type="button"
              onClick={goBack}
              className="mb-2 inline-flex h-9 items-center gap-1 rounded-md py-1.5 pl-1 pr-2 text-sm font-medium text-gray-700 hover:bg-sand/60 active:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer sm:absolute sm:mb-0 sm:left-0 sm:top-1/2 sm:-translate-x-[calc(100%+1.25rem)] sm:-translate-y-1/2"
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
              Back
            </button>
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {phase === 'review' ? 'Review' : `Step ${step} of ${TOTAL_STEPS}`}
                </span>
                <Link href="/" className="text-primary-700 hover:underline underline-offset-2">
                  Exit
                </Link>
              </div>
              <Progress
                value={progressValue}
                aria-label="Questionnaire progress"
                indicatorClassName="!bg-[oklch(58%_0.14_310)]"
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-4"
            >
              <div className="text-center space-y-2">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary-600">
                  Introspect
                </p>
                <h1 className="font-mi-gente text-2xl sm:text-3xl text-gray-900 leading-tight">
                  Welcome — let&apos;s learn about your project
                </h1>
              </div>

              <div className="rounded-xl border border-gray-200/80 bg-white/75 px-4 py-3.5 sm:px-5 space-y-2.5">
                <p className="text-sm font-semibold text-gray-900">What to expect</p>
                <ol className="space-y-2 text-sm sm:text-[0.95rem] text-gray-700 leading-snug">
                  <li className="flex gap-2.5">
                    <span className="font-display text-lg text-primary-600 leading-none mt-0.5 shrink-0">1</span>
                    <span>Answer a few questions.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-display text-lg text-primary-600 leading-none mt-0.5 shrink-0">2</span>
                    <span>Applicreations builds your free preview in 48 to 72 hours.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-display text-lg text-primary-600 leading-none mt-0.5 shrink-0">3</span>
                    <span>
                      You play with your preview website for 3 days and decide if it&apos;s a fit.
                    </span>
                  </li>
                </ol>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setPhase('questions')
                    setStep(1)
                  }}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-8 py-3 font-sans text-base font-bold tracking-tight text-primary-800 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28),0_2px_8px_-2px_rgba(0,0,0,0.12)] ring-1 ring-primary-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 cursor-pointer"
                >
                  <span className="relative inline-flex items-center gap-3">
                    <span className="relative z-0 h-2 w-2 shrink-0" aria-hidden>
                      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(58%_0.14_310)] shadow-[0_0_0_0_oklch(58%_0.14_310)] transition-[box-shadow] duration-200 ease-in-out group-hover:shadow-[0_0_0_220px_oklch(58%_0.14_310)] group-focus-visible:shadow-[0_0_0_220px_oklch(58%_0.14_310)]" />
                      <span className="relative z-20 block h-2 w-2 rounded-full bg-[oklch(58%_0.14_310)] transition-colors duration-200 ease-in-out group-hover:bg-white group-focus-visible:bg-white" />
                    </span>
                    <span className="relative z-10 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-visible:text-white">
                      Get Started
                    </span>
                  </span>
                </button>
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
                step === 6 || step === 7 ? 'gap-2.5' : 'gap-4'
              )}
            >
              {step === 1 && (
                <StepBlock title="First, a little about you">
                  <Field
                    label="Your name"
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
                      placeholder="Jane Smith"
                      inputMode="text"
                      autoCapitalize="words"
                    />
                  </Field>
                  <Field label="Email" error={errors.email} htmlFor={`${formId}-email`}>
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
                            email: 'Please enter a valid email (like jane@example.com)',
                          }))
                        }
                      }}
                      autoComplete="email"
                      placeholder="jane@example.com"
                      inputMode="email"
                      spellCheck={false}
                    />
                  </Field>
                  <Field
                    label="Phone"
                    hint="We'll text first if we contact you this way."
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
                      placeholder="(555) 123-4567"
                      inputMode="numeric"
                      maxLength={14}
                      required
                    />
                  </Field>
                </StepBlock>
              )}

              {step === 2 && (
                <StepBlock title="Tell us about your business or project">
                  <Field
                    label="Name of your business or project"
                    error={errors.businessName}
                    htmlFor={`${formId}-biz`}
                  >
                    <input
                      id={`${formId}-biz`}
                      className={fieldClass(errors.businessName)}
                      value={answers.businessName}
                      onChange={update('businessName')}
                      placeholder="Joe's Cafe"
                    />
                  </Field>
                  <Field
                    label="What does it do or offer?"
                    error={errors.aboutBusiness}
                    htmlFor={`${formId}-about`}
                  >
                    <textarea
                      id={`${formId}-about`}
                      className={textareaClass(errors.aboutBusiness)}
                      value={answers.aboutBusiness}
                      onChange={update('aboutBusiness')}
                      placeholder="A neighborhood cafe that serves breakfast, lunch, and coffee"
                    />
                  </Field>
                  <Field
                    label="Where are you located?"
                    error={errors.location}
                    htmlFor={`${formId}-loc`}
                  >
                    <input
                      id={`${formId}-loc`}
                      className={fieldClass(errors.location)}
                      value={answers.location}
                      onChange={update('location')}
                      placeholder="City, town, or area you serve"
                    />
                  </Field>
                </StepBlock>
              )}

              {step === 3 && (
                <StepBlock
                  title="Your online presence today"
                  subtitle="It's fine if you don't have a website yet."
                >
                  <ChoiceRow
                    label="Do you already have a website or online pages?"
                    error={errors.hasOnlinePresence}
                    options={YES_NO_UNSURE}
                    value={answers.hasOnlinePresence}
                    onChange={(v) => setChoice('hasOnlinePresence', v as YesNoUnsure)}
                  />
                  <Field
                    label="Link to your current website (if any)"
                    htmlFor={`${formId}-website`}
                  >
                    <input
                      id={`${formId}-website`}
                      type="url"
                      className={fieldClass()}
                      value={answers.websiteUrl}
                      onChange={update('websiteUrl')}
                      placeholder="https://yourwebsite.com"
                    />
                  </Field>
                  <LinkListField
                    label="Links to your social media pages (if any)"
                    hint="Facebook, Instagram, LinkedIn, and the like — one link per box."
                    links={answers.socialMediaLinks}
                    onChange={(links) => setLinkList('socialMediaLinks', links)}
                    addLabel="Add another social link"
                    inputPrefix={`${formId}-social`}
                  />
                  <LinkListField
                    label="Websites you really admire"
                    hint="Not required, but it helps us get a better feel for your design preferences."
                    links={answers.admiredWebsiteLinks}
                    onChange={(links) => setLinkList('admiredWebsiteLinks', links)}
                    addLabel="Add another site"
                    inputPrefix={`${formId}-admire`}
                  />
                </StepBlock>
              )}

              {step === 4 && (
                <StepBlock
                  title="Logo and pictures"
                  subtitle="We'll work with what you have — or help figure out photos later."
                >
                  <ChoiceRow
                    label="Do you already have a logo?"
                    error={errors.hasLogo}
                    options={YES_NO_UNSURE}
                    value={answers.hasLogo}
                    onChange={(v) => setChoice('hasLogo', v as YesNoUnsure)}
                  />
                  {answers.hasLogo === 'yes' && (
                    <AssetUploadField
                      id={`${formId}-logo-upload`}
                      label="Upload your logo (optional)"
                      hint="PNG, JPG, WebP, or SVG — up to 5 MB."
                      accept={UPLOAD_ACCEPT}
                      multiple={false}
                      files={logoFile ? [logoFile] : []}
                      error={uploadErrors.logo}
                      onFilesSelected={(list) => onLogoSelected(list?.[0] ?? null)}
                      onRemoveFile={() => onLogoSelected(null)}
                    />
                  )}
                  <ChoiceRow
                    label="Do you have pictures you'd like on the site?"
                    error={errors.hasPhotos}
                    options={YES_NO_UNSURE}
                    value={answers.hasPhotos}
                    onChange={(v) => setChoice('hasPhotos', v as YesNoUnsure)}
                  />
                  {answers.hasPhotos === 'yes' && (
                    <AssetUploadField
                      id={`${formId}-photos-upload`}
                      label="Upload pictures (optional)"
                      hint={`PNG, JPG, or WebP — up to ${MAX_PHOTOS} files, 10 MB each.`}
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
                      {UPLOAD_SECURITY_NOTICE}
                    </p>
                  )}
                  <ChoiceRow
                    label="Do you need new photos taken?"
                    error={errors.needsPhotosTaken}
                    options={YES_NO_UNSURE}
                    value={answers.needsPhotosTaken}
                    onChange={(v) => setChoice('needsPhotosTaken', v as YesNoUnsure)}
                  />
                </StepBlock>
              )}

              {step === 5 && (
                <StepBlock title="What should people be able to do on your website?">
                  <LinkListField
                    hint="Examples: call you, see a menu, book a visit, buy something, check events."
                    links={answers.visitorActions}
                    onChange={(items) => setLinkList('visitorActions', items)}
                    addLabel="Add another action"
                    inputPrefix={`${formId}-actions`}
                    inputType="text"
                    placeholder="See our hours"
                    error={errors.visitorActions}
                  />
                </StepBlock>
              )}

              {step === 6 && (
                <StepBlock
                  compact
                  title="How developed should it be?"
                  subtitle="Pick the closest fit. We can refine this when we review your answers."
                >
                  <div className="grid gap-2">
                    {SITE_DEPTH_OPTIONS.map((opt) => {
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

              {step === 7 && (
                <StepBlock
                  compact
                  centered
                  title="Design feel and colors"
                  subtitle="Choose all that apply — or leave it to us."
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                    <div>
                      <div className="mb-3 space-y-2 border-b border-gray-200/90 pb-2.5">
                        <h2 className="font-mi-gente text-lg sm:text-xl text-gray-900 leading-tight text-center">
                          Design feel
                        </h2>
                        <SoftCheckbox
                          checked={Boolean(answers.designFeelNoPreference)}
                          onChange={toggleDesignFeelNoPreference}
                          label="No preference — you decide"
                        />
                      </div>
                      <div
                        className={cn(
                          'grid grid-cols-2 gap-2 transition-opacity',
                          answers.designFeelNoPreference && 'pointer-events-none opacity-40'
                        )}
                        aria-disabled={Boolean(answers.designFeelNoPreference)}
                      >
                        {DESIGN_FEEL_OPTIONS.map((opt) => {
                          const selected = answers.designFeels.includes(opt.id)
                          const Icon = DESIGN_FEEL_ICONS[opt.id]
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleDesignFeel(opt.id)}
                              aria-pressed={selected}
                              disabled={answers.designFeelNoPreference}
                              title={opt.description}
                              className={cn(
                                'flex h-full cursor-pointer items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors',
                                selected
                                  ? 'text-gray-900 outline outline-1 outline-offset-2 outline-gray-800'
                                  : 'text-gray-600 outline outline-1 outline-transparent hover:outline-gray-300 hover:text-gray-900',
                                answers.designFeelNoPreference && 'cursor-default'
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
                          Colors
                        </h2>
                        <div className="flex flex-col items-start gap-1.5">
                          <SoftCheckbox
                            checked={Boolean(answers.colorPaletteFromLogo)}
                            onChange={toggleColorPaletteFromLogo}
                            label="Match colors from my logo"
                          />
                          <SoftCheckbox
                            checked={Boolean(answers.colorPaletteNoPreference)}
                            onChange={toggleColorPaletteNoPreference}
                            label="No preference — you decide"
                          />
                        </div>
                      </div>
                      <div
                        className={cn(
                          'grid grid-cols-2 gap-2 sm:grid-cols-3 transition-opacity',
                          (answers.colorPaletteNoPreference || answers.colorPaletteFromLogo) &&
                            'pointer-events-none opacity-40'
                        )}
                        aria-disabled={Boolean(
                          answers.colorPaletteNoPreference || answers.colorPaletteFromLogo
                        )}
                      >
                        {COLOR_PALETTE_OPTIONS.map((opt) => {
                          const selected = answers.colorPalettes.includes(opt.id)
                          const colorsLocked =
                            answers.colorPaletteNoPreference || answers.colorPaletteFromLogo
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

                      {!answers.colorPaletteNoPreference &&
                        !answers.colorPaletteFromLogo &&
                        (answers.colorPalettes.includes('custom') ||
                          answers.colorPalettes.length > 0) && (
                          <div className="mt-3">
                            <Field
                              label={
                                answers.colorPalettes.includes('custom')
                                  ? 'Tell us about your colors'
                                  : 'Anything else about colors or the look? (optional)'
                              }
                              error={errors.colorNotes}
                              htmlFor={`${formId}-colors`}
                              hint={
                                answers.colorPalettes.includes('custom')
                                  ? 'Brand colors, colors to avoid, or a quick description.'
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
                                placeholder="Deep blue and cream, like our storefront..."
                              />
                            </Field>
                          </div>
                        )}
                    </div>
                  </div>
                </StepBlock>
              )}

              {step === 8 && (
                <StepBlock title="Anything we should steer clear of?">
                  <textarea
                    id={`${formId}-avoid`}
                    aria-label="Anything we should steer clear of"
                    className={textareaClass()}
                    value={answers.designAvoidances}
                    onChange={update('designAvoidances')}
                    placeholder="Optional — looks you dislike, tones that feel wrong, or styles that don't fit…"
                  />
                </StepBlock>
              )}

              {step === 9 && (
                <StepBlock title="Is there anything else about your business that we should know?">
                  <textarea
                    id={`${formId}-extras`}
                    aria-label="Anything else about your business"
                    className={textareaClass()}
                    value={answers.businessExtras}
                    onChange={update('businessExtras')}
                    placeholder="Optional — hours, seasons, partners, must-haves…"
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
                  step === 7 ? 'relative justify-center' : 'justify-between',
                  step === 6 || step === 7 ? 'pt-1' : 'pt-2'
                )}
              >
                <button
                  type="button"
                  onClick={goBack}
                  className={cn(
                    'inline-flex h-11 items-center gap-1 rounded-md py-1.5 pl-1 pr-2 text-sm font-medium text-gray-700 hover:bg-sand/60 active:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer',
                    step === 7 && 'absolute left-0'
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
                  Back
                </button>
                <Button
                  type="submit"
                  isLoading={status === 'submitting'}
                  disabled={status === 'submitting' || !canContinue}
                  aria-disabled={status === 'submitting' || !canContinue}
                  className="!bg-[oklch(58%_0.14_310)] hover:!bg-[oklch(50%_0.14_310)] focus-visible:!ring-[oklch(58%_0.14_310)/0.35]"
                >
                  {step === TOTAL_STEPS
                    ? 'Continue to Review'
                    : nameConfirmPending && step === 1
                      ? 'Yes, continue'
                      : 'Continue'}
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
              <div className="space-y-1">
                <h1 className="font-mi-gente text-2xl text-gray-900 leading-tight">
                  Review your answers
                </h1>
                <p className="text-sm text-gray-600 leading-snug">
                  Check everything below, then submit when it looks right.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <ReviewSection title="About you">
                  <ReviewRow label="Name" value={answers.fullName || '—'} />
                  <ReviewRow label="Email" value={answers.email || '—'} />
                  <ReviewRow label="Phone" value={answers.phone || '—'} />
                </ReviewSection>

                <ReviewSection title="Your business">
                  <ReviewRow label="Business / project" value={answers.businessName || '—'} />
                  <ReviewRow label="Location" value={answers.location || '—'} />
                  <ReviewRow label="What you do" value={answers.aboutBusiness || '—'} />
                </ReviewSection>

                <ReviewSection title="Online presence">
                  <ReviewRow
                    label="Already online?"
                    value={yesNoLabel(answers.hasOnlinePresence)}
                  />
                  <ReviewRow
                    label="Website"
                    value={answers.websiteUrl.trim() || '—'}
                  />
                  <ReviewRow
                    label="Social links"
                    value={listOrDash(answers.socialMediaLinks)}
                  />
                  <ReviewRow
                    label="Sites you admire"
                    value={listOrDash(answers.admiredWebsiteLinks)}
                  />
                </ReviewSection>

                <ReviewSection title="Logo & photos">
                  <ReviewRow label="Has a logo" value={yesNoLabel(answers.hasLogo)} />
                  {answers.hasLogo === 'yes' && (
                    <ReviewRow
                      label="Logo file"
                      value={logoFile?.name || answers.logoFileName || '—'}
                    />
                  )}
                  <ReviewRow label="Has photos" value={yesNoLabel(answers.hasPhotos)} />
                  {answers.hasPhotos === 'yes' && (
                    <ReviewRow
                      label="Photo files"
                      value={
                        photoFiles.length > 0
                          ? photoFiles.map((f) => f.name).join(', ')
                          : listOrDash(answers.photoFileNames)
                      }
                    />
                  )}
                  <ReviewRow
                    label="Need photos taken"
                    value={yesNoLabel(answers.needsPhotosTaken)}
                  />
                </ReviewSection>

                <ReviewSection title="What visitors should do">
                  <ReviewRow
                    label="Actions"
                    value={listOrDash(answers.visitorActions)}
                  />
                </ReviewSection>

                <ReviewSection title="Site scope">
                  <ReviewRow label="How developed" value={depthLabel} />
                </ReviewSection>

                <ReviewSection title="Design feel & colors">
                  <ReviewRow label="Design feel" value={feelLabels} />
                  <ReviewRow label="Colors" value={colorLabels} />
                  {answers.colorNotes.trim() && (
                    <ReviewRow label="Color notes" value={answers.colorNotes.trim()} />
                  )}
                </ReviewSection>

                <ReviewSection title="Steer clear of">
                  <ReviewRow
                    label="Avoid"
                    value={answers.designAvoidances.trim() || '—'}
                  />
                </ReviewSection>

                <ReviewSection title="Anything else">
                  <ReviewRow
                    label="Notes"
                    value={answers.businessExtras.trim() || '—'}
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
                  Back
                </button>
                <Button
                  type="submit"
                  isLoading={status === 'submitting'}
                  disabled={status === 'submitting'}
                  className="!bg-[oklch(58%_0.14_310)] hover:!bg-[oklch(50%_0.14_310)] focus-visible:!ring-[oklch(58%_0.14_310)/0.35]"
                >
                  Submit Introspect
                </Button>
              </div>
            </motion.form>
          )}

          {phase === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-5 py-2"
            >
              <div className="text-center space-y-2.5">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary-600">
                  You&apos;re all set
                </p>
                <h1 className="font-mi-gente text-2xl sm:text-3xl text-gray-900 leading-tight">
                  Thanks — we received your Introspect answers
                </h1>
              </div>

              <div className="rounded-xl border border-gray-200/80 bg-white/80 px-4 py-4 sm:px-5 space-y-3">
                <p className="text-lg sm:text-xl font-bold text-gray-900 text-center">What happens next…</p>
                <ol className="space-y-2.5 text-sm sm:text-[0.95rem] text-gray-700 leading-snug list-decimal list-inside">
                  <li>
                    Applicreations has started working on your <strong>free</strong> preview
                    website.
                  </li>
                  <li>
                    You will receive a link to the free preview website by email in less than{' '}
                    <strong>72 hours</strong>.
                  </li>
                  <li>
                    Explore your preview website for <strong>3</strong> days. Then select{' '}
                    <strong>start my real website</strong> or <strong>stop project</strong>.
                  </li>
                  <li>
                    If <strong>start my real website</strong> is selected, Applicreations will
                    contact you to confirm the final project scope.
                  </li>
                </ol>
                <p className="text-sm text-gray-600 leading-snug pt-2 border-t border-gray-100">
                  *Please use the buttons in your email so that we know how to proceed.
                </p>
              </div>

              <div className="flex items-center justify-center pt-1">
                <Link
                  href="/"
                  aria-label="Applicreations home"
                  className="inline-flex shrink-0 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                >
                  <Image
                    src="/logo-mark.png"
                    alt="Applicreations"
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                  />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** Soft purple checkbox — matches Introspect progress / Continue accents */
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
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[oklch(58%_0.14_310)/0.35] peer-focus-visible:ring-offset-1',
            checked
              ? 'border-[oklch(58%_0.14_310)] bg-[oklch(58%_0.14_310)]'
              : 'border-gray-300 bg-white/85 peer-hover:border-[oklch(58%_0.10_310)]'
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

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 border-t border-gray-200/80 pt-3 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-semibold tracking-tight text-primary-800">
        {title}
      </h2>
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
  placeholder = 'https://...',
  inputType = 'url',
  error,
}: {
  label?: string
  hint?: string
  links: string[]
  onChange: (links: string[]) => void
  addLabel: string
  inputPrefix: string
  placeholder?: string
  inputType?: 'url' | 'text'
  error?: string
}) {
  const updateLink = (index: number, value: string) => {
    const next = [...links]
    next[index] = value
    onChange(next)
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
              className={fieldClass(index === 0 ? error : undefined)}
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              placeholder={placeholder}
            />
            {links.length > 1 ? (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="shrink-0 min-h-11 px-3 rounded-md border border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
                aria-label="Remove item"
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...links, ''])}
        className="inline-flex items-center gap-1 pt-0.5 text-sm font-semibold text-[oklch(43%_0.12_280)] hover:text-[oklch(36%_0.12_280)] transition-colors cursor-pointer"
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
          'border-gray-300 bg-white/70 hover:border-[oklch(58%_0.13_280)] hover:bg-[oklch(96%_0.04_280/0.55)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1'
        )}
      >
        <Upload className="h-4 w-4 shrink-0 text-[oklch(43%_0.12_280)]" aria-hidden />
        {multiple
          ? files.length > 0
            ? 'Add more pictures'
            : 'Choose pictures'
          : files.length > 0
            ? 'Replace logo'
            : 'Choose logo file'}
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
                aria-label={`Remove ${file.name}`}
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
