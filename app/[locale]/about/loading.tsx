import { LocaleAwareLoading } from '@/components/i18n/LocaleAwareLoading'

export default function AboutLoading() {
  return (
    <LocaleAwareLoading>
      <main>
        <section className="about-board relative overflow-x-hidden bg-paper">
          <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-3">
            <div className="relative rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-primary-600 text-center mb-2">
                About
              </p>
              <div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start animate-pulse"
                aria-hidden
              >
                <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full bg-gray-200/80" />
                <div className="flex-1 w-full min-w-0 space-y-2.5">
                  <div className="h-6 w-40 rounded bg-gray-200/80 mx-auto sm:mx-0" />
                  <div className="h-4 w-48 rounded bg-gray-200/60 mx-auto sm:mx-0" />
                  <div className="h-3.5 w-full rounded bg-gray-200/55" />
                  <div className="h-3.5 w-full rounded bg-gray-200/55" />
                  <div className="h-3.5 w-5/6 rounded bg-gray-200/50" />
                </div>
              </div>
              <span className="sr-only">Loading about…</span>
            </div>
          </div>
        </section>
      </main>
    </LocaleAwareLoading>
  )
}
