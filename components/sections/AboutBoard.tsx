import Image from 'next/image'

export function AboutBoard() {
  return (
    <section className="about-board relative overflow-x-hidden bg-paper min-h-[calc(100svh-var(--spacing-12))] flex items-start">
      <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-3">
        <div className="relative rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-primary-600 text-center mb-2">
            About
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
            <div className="shrink-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-2 ring-gray-200/80 ring-offset-2 ring-offset-white/80">
                <Image
                  src="/images/david-moore-headshot.png"
                  alt="David Moore"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2 text-[0.875rem] sm:text-[0.9rem] text-gray-700 leading-snug">
              <div>
                <h1 className="font-display text-lg sm:text-xl text-gray-900 mb-0.5">
                  David Moore
                </h1>
                <p className="text-sm font-medium text-primary-600 tracking-wide">
                  Founder, Applicreations
                </p>
              </div>

              <p>
                I started Applicreations in 2025. I grew up drawing with different mediums — pencil,
                pen and ink, charcoal, pastels, and watercolor. Eventually I worked as a chef,
                expressing my creative tendencies through flavor and presenting ingredients on a
                plate.
              </p>

              <p>
                While teaching myself web design and software starting in 2021, along the way I&apos;ve
                noticed that many small local businesses struggle to present themselves respectfully
                online — or end up with generic-looking sites from Wix, GoDaddy, Squarespace, and the
                like. Increasingly, in a world focused more on machine than human beings, I felt the
                need to get into web development for human-centered design: to create exactly what
                the human client wants, on their terms, designed for them.
              </p>

              <p>
                Generic website builders are often fast, but they can leave you feeling like a number. There
                are no generic templates at Applicreations — every project is original and custom
                tailored to what you actually want. I help small businesses plant roots online with
                dignity. I look forward to helping you plant yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
