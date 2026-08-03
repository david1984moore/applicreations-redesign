'use client'

import { useLocale } from '@/components/i18n/LocaleProvider'
import { cn } from '@/lib/utils'

type LanguageToggleProps = {
  variant?: 'landing' | 'subpage'
  className?: string
}

export function LanguageToggle({
  variant = 'subpage',
  className,
}: LanguageToggleProps) {
  const { locale, setLocale, dict } = useLocale()
  const isEs = locale === 'es'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEs}
      aria-label={dict.nav.languageToggleAria}
      onClick={() => setLocale(isEs ? 'en' : 'es')}
      className={cn(
        'group flex flex-col items-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-md',
        variant === 'landing' ? 'gap-1.5' : 'gap-0.5',
        className
      )}
    >
      <span
        className={cn(
          'relative inline-flex items-center rounded-full border border-gray-300 bg-white/90',
          variant === 'landing' ? 'h-5 w-9 lg:h-6 lg:w-10' : 'h-4 w-7'
        )}
        aria-hidden
      >
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-primary-600 transition-[left] duration-200 ease-out',
            variant === 'landing' ? 'h-3.5 w-3.5 lg:h-4 lg:w-4' : 'h-3 w-3',
            isEs
              ? variant === 'landing'
                ? 'left-[calc(100%-0.95rem)] lg:left-[calc(100%-1.1rem)]'
                : 'left-[calc(100%-0.8rem)]'
              : 'left-0.5'
          )}
        />
      </span>
      <span
        className={cn(
          'font-bold tracking-tight tabular-nums',
          variant === 'landing'
            ? 'text-[0.8125rem] lg:text-[0.9375rem] text-gray-900 group-hover:text-gray-700'
            : 'text-[0.625rem] font-medium text-gray-900 group-hover:text-gray-600'
        )}
      >
        <span className={cn(!isEs ? 'text-gray-900' : 'text-gray-400')}>
          {dict.nav.languageEn}
        </span>
        <span className="text-gray-400 mx-0.5">/</span>
        <span className={cn(isEs ? 'text-gray-900' : 'text-gray-400')}>
          {dict.nav.languageEs}
        </span>
      </span>
    </button>
  )
}
