import { LocaleAwareLoading } from '@/components/i18n/LocaleAwareLoading'
import { SITE_VIEWPORT_BELOW_NAV_CLASS } from '@/components/ui/Navigation'

export default function DemosLoading() {
  return (
    <LocaleAwareLoading>
      <main>
        <section
          className={`relative overflow-x-hidden bg-paper ${SITE_VIEWPORT_BELOW_NAV_CLASS}`}
        >
          <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-4">
            <div className="space-y-4 animate-pulse" aria-hidden>
              <div className="h-7 w-36 rounded bg-gray-200/80" />
              <div className="h-4 w-64 max-w-full rounded bg-gray-200/60" />
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="h-40 w-56 rounded-2xl bg-gray-200/70" />
                <div className="h-40 w-44 rounded-2xl bg-gray-200/60" />
                <div className="h-40 w-48 rounded-2xl bg-gray-200/65" />
              </div>
            </div>
            <span className="sr-only">Loading projects…</span>
          </div>
        </section>
      </main>
    </LocaleAwareLoading>
  )
}
