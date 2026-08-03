export default function ContactLoading() {
  return (
    <main>
      <section className="contact-board relative overflow-x-hidden bg-paper">
        <div className="relative z-10 flex flex-col max-w-2xl w-full mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-6">
          <div className="relative rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 sm:px-5 sm:py-3.5">
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-primary-600 text-center mb-2">
              Contact
            </p>
            <div className="space-y-2.5 animate-pulse" aria-hidden>
              <div className="h-7 w-36 rounded bg-gray-200/80" />
              <div className="h-4 w-80 max-w-full rounded bg-gray-200/60" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                <div className="h-10 rounded-lg bg-gray-200/70" />
                <div className="h-10 rounded-lg bg-gray-200/70" />
              </div>
              <div className="h-10 rounded-lg bg-gray-200/70" />
              <div className="h-[4.25rem] rounded-lg bg-gray-200/70" />
              <div className="h-12 w-36 rounded-md bg-gray-200/80" />
            </div>
            <span className="sr-only">Loading contact form…</span>
          </div>
        </div>
      </section>
    </main>
  )
}
