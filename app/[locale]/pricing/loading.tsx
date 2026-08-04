import { LocaleAwareLoading } from '@/components/i18n/LocaleAwareLoading'

export default function PricingLoading() {
  return (
    <LocaleAwareLoading>
      <main className="bg-paper">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 max-w-3xl pb-6 pt-2 sm:pt-3">
            <div className="pb-3 flex justify-center">
              <div className="h-8 w-28 rounded bg-gray-200/80 animate-pulse" aria-hidden />
            </div>
            <div className="flex flex-col gap-2.5 animate-pulse" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white/85 px-3.5 py-3.5 sm:px-4 sm:py-4 space-y-2.5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="h-5 w-24 rounded bg-gray-200/80" />
                    <div className="h-5 w-20 rounded bg-gray-200/70" />
                  </div>
                  <div className="h-3.5 w-full max-w-md rounded bg-gray-200/55" />
                  <div className="h-3.5 w-2/3 rounded bg-gray-200/50" />
                </div>
              ))}
            </div>
            <span className="sr-only">Loading pricing…</span>
          </div>
        </div>
      </main>
    </LocaleAwareLoading>
  )
}
