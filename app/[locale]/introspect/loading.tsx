import { LocaleAwareLoading } from '@/components/i18n/LocaleAwareLoading'

export default function IntrospectLoading() {
  return (
    <LocaleAwareLoading>
      <main>
        <section className="relative overflow-x-hidden bg-paper min-h-[calc(100svh-var(--spacing-12)-1.75rem)]">
          <div className="relative z-10 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-6">
            <div className="space-y-4 animate-pulse" aria-hidden>
              <div className="text-center space-y-2">
                <div className="h-3 w-24 rounded bg-gray-200/70 mx-auto" />
                <div className="h-8 w-72 max-w-full rounded bg-gray-200/80 mx-auto" />
              </div>
              <div className="rounded-xl border border-gray-200/80 bg-white/75 px-4 py-3.5 sm:px-5 space-y-3">
                <div className="h-4 w-32 rounded bg-gray-200/80" />
                <div className="h-3.5 w-full rounded bg-gray-200/55" />
                <div className="h-3.5 w-5/6 rounded bg-gray-200/50" />
                <div className="h-3.5 w-4/5 rounded bg-gray-200/50" />
              </div>
              <div className="flex justify-center pt-1">
                <div className="h-12 w-40 rounded-2xl bg-gray-200/80" />
              </div>
            </div>
            <span className="sr-only">Loading Introspect…</span>
          </div>
        </section>
      </main>
    </LocaleAwareLoading>
  )
}
