import { LocaleAwareLoading } from '@/components/i18n/LocaleAwareLoading'

export default function RedesignLoading() {
  return (
    <LocaleAwareLoading>
      <main>
        <section className="relative overflow-x-hidden introspect-page-wash min-h-[calc(100svh-var(--spacing-12)-1.75rem)]">
          <div className="relative z-10 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-3 pb-8 lg:pt-4">
            <div className="animate-pulse" aria-hidden>
              <div className="h-3 w-24 rounded bg-gray-200/70 mx-auto" />
              <div className="mt-24 flex flex-col items-center gap-12">
                <div className="h-8 w-72 max-w-full rounded bg-gray-200/80 mx-auto" />
                <div className="h-12 w-40 rounded-full bg-gray-200/80" />
              </div>
            </div>
            <span className="sr-only">Loading Introspect…</span>
          </div>
        </section>
      </main>
    </LocaleAwareLoading>
  )
}
