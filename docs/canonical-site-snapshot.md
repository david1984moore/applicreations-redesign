# Applicreations — canonical site snapshot

**Captured:** 20 August 2026 · **Baseline lock addendum:** 1 September 2026  
**Repo:** `applicreations-redesign`  
**Purpose:** Ground-truth reference for the site as it currently renders. Use this when you cannot see the live page. Prefer this file and `docs/baseline-lock.md` over older `STATUS.md` / `SCOPE.md` sessions for prices, layout, and motion.

**Locales:** English is unprefixed (`/`, `/pricing`, …). Spanish is under `/es`. `/en` redirects to the bare path. Middleware rewrites English URLs into the `[locale]` segment.

**Copy source:** Almost all user-facing strings live in `lib/i18n/dictionaries/en.ts` and `es.ts`. Prices, highlighted flags, and the $500 handoff fee live in `lib/pricing.ts`. Project titles, image paths, and live URLs live in `lib/projects.ts`.

**Hard constraints (do not “improve”):**

- **No Delaware / location-specific copy.** Generic/national. Truthful.
- **Live-preview cord locked (18 Aug 2026, final).** Do not edit `wirePath`, `keyedPath`, `pt`, `fmt`, `PreviewWire`, stroke, or port/jack math in `components/landing/hiw/HiwDeviceSketch.tsx` (or the jack rect in `HiwConstructionSketch.tsx`).
- **Brand lockup locked (18 Aug 2026).** Butterfly centered over the “li” in “Applicreations”. Class strings in `BrandLockup.tsx` / `BRAND_LOCKUP` are the source of truth.
- **Landing desktop composition locked (1 Aug 2026) for spacing/card format.** Two-column board, no desktop page scroll. Do not change shell padding, column split, or landing card format without explicit approval.

---

## 1. Design system

Single file: `app/globals.css`. Tailwind v4 `@theme` — no `tailwind.config`. Fonts loaded in `app/layout.tsx`.

There is **no dark-mode stylesheet**, despite older STATUS notes.

### 1.1 Fonts

| Role | Family | CSS |
|---|---|---|
| UI / body | Source Sans 3 | `--font-source-sans` → `--font-sans` / `body` |
| Display / headings | Fraunces | `--font-fraunces` → `--font-display`, all `h1–h6` |
| Caramel & Jo (projects) | Playfair Display | `.font-caramel` |
| Mi Gente Bonita + Introspect headings | Poppins | `.font-mi-gente` |

Body: weight 400, line-height 1.65. Headings: weight 550, letter-spacing `-0.01em`.  
Utility remap: `.font-bold` = 600, `.font-semibold` = 500.

### 1.2 Color tokens (OKLCH)

`:root` semantic aliases plus `@theme` coastal palette.

| Token | Value | Use |
|---|---|---|
| `--color-primary` / `--color-sky-deep` / `--color-action` / `--color-primary-600` | `oklch(50% 0.13 255)` | Logo / action blue |
| `--color-primary-hover` | `oklch(44% 0.14 255)` | |
| `--color-accent` | `oklch(68% 0.10 230)` | Sky |
| `--color-accent-hover` | `oklch(60% 0.11 230)` | |
| `--color-sky-soft` | `oklch(82% 0.07 230)` | |
| `--color-sky-navy` | `oklch(38% 0.10 260)` | |
| `--color-background` / `--color-paper` | `oklch(98% 0.012 85)` | Page tan |
| `--color-surface` | `oklch(95% 0.02 80)` | |
| `--color-card` | `oklch(99% 0.008 85)` | |
| `--color-text` / `--color-foreground` | `oklch(28% 0.02 50)` | |
| `--color-text-secondary` / `--color-muted-foreground` | `oklch(48% 0.02 55)` | |
| `--color-muted` | `oklch(94% 0.02 80)` | |
| `--color-border` | `oklch(88% 0.02 80)` | |
| `--color-sand` | `oklch(90% 0.03 80)` | |
| `--color-sand-deep` | `oklch(72% 0.06 75)` | |
| `--color-seafoam` | `oklch(72% 0.06 200)` | |
| `--color-error` | `oklch(55% 0.18 25)` | |
| `--color-warning` | `oklch(72% 0.12 75)` | |
| `--color-success` | `oklch(55% 0.10 160)` | |
| `--color-blue-50` | `oklch(96% 0.02 250)` | |

Also in `@theme`: `primary-50…900`, `gray-50…900`, `neutral-50…900`.

**Not in `@theme` — used live:**

| Color | Value | Where |
|---|---|---|
| HIW wash / logo violet | `oklch(77% 0.078 310)` → `oklch(70% 0.10 310)` | `HiwPageWash` |
| HIW “3” (desktop) | `oklch(58% 0.14 310)` | Intro numeral |
| HIW “3” (mobile) | `oklch(68% 0.15 230)` | Same numeral, coastal blue |
| CTA fill / mobile solid | `oklch(68% 0.15 230)` | `SpectrumFlipCta`, mobile Introspect/Contact CTAs |
| Selection / Choose purple | `oklch(48–52% 0.14 295)` | Pricing select, selected cards |
| Landing Popular card | `oklch(96% 0.025 230)` fill, `primary-400/70` border | Basic on home |

### 1.3 Spacing

8-point rem scale.

`:root` `--space-1…6` = 0.5 / 1 / 1.5 / 2 / 2.5 / 3rem.  
`@theme` `--spacing-1…16` adds 4 / 5 / 6 / 8rem.

**Gotcha:** In this theme `--spacing-12` = `6rem`, so Tailwind `h-12` is **6rem**, not the default 3rem. Site nav uses `h-12` on purpose (`SITE_NAV_HEIGHT_CLASS`). Footer is a separate `1.75rem`.

### 1.4 Type scale (`@theme`)

| Token | Size |
|---|---|
| xs | 0.75rem |
| sm | 0.875rem |
| base | 1rem |
| lg | 1.125rem |
| xl | 1.313rem |
| 2xl | 1.75rem |
| 3xl | 2.375rem |
| 4xl | 3.188rem |

`:root` also defines `--text-base` through `--text-4xl` (same values, no xs/sm).

### 1.5 Radii

`sm 6px` · `md 10px` · `lg 14px` · `xl 20px` · `full 9999px`.

Live UI often uses `rounded-xl` (cards) and `rounded-2xl` (CTAs).

### 1.6 Shadows

**No `@theme` shadow tokens.** Live shadows are Tailwind defaults (`shadow-sm`, `shadow-lg`) or one-offs:

- CTA: `0_8px_24px_-8px rgba(0,0,0,0.28), 0_2px_8px_-2px rgba(0,0,0,0.12)`
- HIW finale CTA (desktop): logo-violet drop
- Nav mark: SVG oval umbra under the butterfly
- Device sketches: `drop-shadow-[0_10px_20px_oklch(12%_0.04_260/0.28)]`

### 1.7 Motion tokens in CSS

| Token | Value |
|---|---|
| `--duration-instant` | 100ms |
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-base` | 300ms |
| `--duration-slow` | 400ms |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

Live Framer Motion almost always uses **`[0.22, 1, 0.36, 1]`** (iOS-ish ease-out), not `--ease-out`.

`prefers-reduced-motion: reduce` forces animation/transition duration to **0.3s**, and disables HIW CSS animations.

### 1.8 Custom utilities

| Class | What it does | Live? |
|---|---|---|
| `.coastal-grain` | Fractal-noise overlay, opacity 0.035, multiply | Introspect page |
| `.font-display` / `.font-caramel` / `.font-mi-gente` | Face switches | Yes |
| `.hiw-glow-build` | 2.2s violet drop-shadow in | HIW |
| `.hiw-glow-pulse` | 2.72s radial pulse | HIW intro |
| `.hiw-intro-3-neon` | 0.68s neon flash on “3” | HIW intro |
| `.hiw-intro-3-grow` | 1.55s scale 1 → 1.28 | HIW intro |
| `.hiw-tagline-grow` | 2.8s `linear()` 3× surge + fade | HIW intro |
| `.hiw-intro-ripple` / `-b` | 0.78s / 1.12s (0.24s delay) ripples | HIW intro |
| `.hiw-digit-shake` | ~420ms shake on “3” | HIW intro |
| `.hiw-blurb` / `.hiw-blurb-over` | Caption text-shadow | HIW captions |
| `.landing-board` | Desktop: `html/body` `overflow: hidden`, 100% height | Home |

---

## 2. Global chrome

### 2.1 Root

`app/layout.tsx`: fonts, `antialiased`, metadata “Applicreations — Custom apps and websites”. Favicon/apple icon: `/logo-mark.png`. OG: `/og-image.png`.

`app/[locale]/layout.tsx`: `LocaleProvider`, `LocaleTransitionGuard`, `Navigation`, page, `SiteFooter`.

### 2.2 Navigation

**Home:** global `Navigation` returns `null`. Brand + icon nav live inside `LandingBoard`.

**Subpages:** fixed `h-12` (6rem) bar, `bg-paper/85 backdrop-blur-md`. Left: 36×36 butterfly with oval ground shadow, links home. Right: `BrandNavLinks variant="subpage"`. Invisible spacer of the same height sits under the bar.

**Icon order (both variants):** Contact · Introspect · Projects · Pricing · About · language mic.

Sketchy 1930s ink icons (stroke 1.85, round caps). Language toggle is a broadcast-mic sketch; tap swaps EN ↔ ES (no pill).

Landing variant: 6-column grid, larger icons (`h-5 w-5` / `lg:h-6 lg:w-6`), bold labels.  
Subpage variant: smaller icons (`h-4 w-4`), smaller labels; desktop clusters right with `sm:gap-x-10`.

Current page is marked `aria-current="page"` on subpages. **All five links still render** (STATUS mentions hiding the current page; the live code does not omit it).

### 2.3 Footer

Always on. Height **1.75rem**, centered `© 2026 Applicreations` (`text-[0.6875rem]` / `sm:text-xs`, `text-gray-500`). Viewport math for no-scroll pages:

`h-[calc(100svh-var(--spacing-12)-1.75rem)]`

### 2.4 Locale swap

`LanguageToggle` calls `beginLocaleTransition()` then `router.replace` with scroll preserved. Entrance motion is skipped while `sessionStorage` flag `applicreations:locale-skip-intro` is set. Loading skeletons are skipped (`LocaleAwareLoading`).

---

## 3. Routes

| EN | ES | Page file | Board |
|---|---|---|---|
| `/` | `/es` | `app/[locale]/page.tsx` | `LandingBoard` |
| `/pricing` | `/es/pricing` | `…/pricing/page.tsx` | `PricingPageClient` |
| `/introspect` | `/es/introspect` | `…/introspect/page.tsx` | `IntrospectBoard` |
| `/redesign` | `/es/redesign` | `…/redesign/page.tsx` | `IntrospectBoard variant="redesign"` |
| `/about` | `/es/about` | `…/about/page.tsx` | `AboutBoard` |
| `/contact` | `/es/contact` | `…/contact/page.tsx` | `ContactBoard` |
| `/demos` | `/es/demos` | `…/demos/page.tsx` | `DemosPageClient` |

APIs (not pages): `POST /api/contact`, `POST /api/introspect`, `POST /api/pricing-selection`.

Loading UI: `LocaleAwareLoading` on about/contact/introspect/redesign/pricing/demos.

---

## 4. Home (`/`) — landing board

**File:** `components/sections/LandingBoard.tsx`  
**Desktop:** one composition, no page scroll (`lg:h-[calc(100svh-1.75rem)]`, `overflow: hidden`).  
**Mobile:** stacks and scrolls.

### 4.1 Layout (desktop, ≥1024px)

Shell: `max-w-[90rem]`, `px-10 xl:px-12`,  
`pt-[clamp(1.5rem,5.5vh,5rem)] pb-[clamp(0.75rem,3vh,2.5rem)]`.

12-column grid, `gap-x-8 xl:gap-x-10`:

- **Left `col-span-7`:** BrandLockup + tagline, icon nav, website pricing card.
- **Right `col-span-5`:** How-it-works cinema. Extra left pad `lg:pl-16 xl:pl-20` so the violet wash clears nav/pricing.

Atmosphere (absolute, pointer-events none): sky radial top-left, sand radial top-right, 165° paper wash, two blurred orbs.

### 4.2 Brand

Wordmark “Applicreations” in Fraunces. Butterfly (`/logo-mark.png`, 56×56 asset) sits in a 2.75 / 3 / 3.5rem box, centered on “li”, lifted `-translate-y-[80%]` of mark height. Clearance `pt-7 sm:pt-8 lg:pt-9`.

Tagline under the name, left-aligned to the wordmark:

EN: **Custom apps and websites**  
ES: **Aplicaciones y sitios web a la medida**

Style: italic uppercase, `font-[700]`, `text-[0.6rem] sm:text-base`, tracking `0.02em` / `sm:0.12em`, `text-primary-600`.

### 4.3 Website pricing card (landing)

White/80 frosted card, `rounded-xl`, `border-gray-200/80`. Eyebrow centered uppercase: “Website Pricing”.

Four cells, `grid-cols-2 lg:grid-cols-4`. Each cell: name (Fraunces lg bold) over large price over one-line `shortSummary` over “More →”.

| Plan | Price shown | Summary | Treatment |
|---|---|---|---|
| Starter | $349 | A simple one-page site | Default paper cell |
| Basic | $699 | 1–2 pages | **Popular** — sky-tinted cell, “POPULAR” label *below* the card (`absolute top-full`) |
| Business | $999 | 3–5 pages | Default |
| Pro | Contact for pricing | Custom tools built for how you work | Smaller price type |

Footer link, right-aligned: `*Hosting & support from $19/mo` → `/pricing#support`.

Links go to `/pricing#starter|basic|business|pro`.

**Popular is hardcoded `plan.id === 'basic'`.** `pricing.ts` `highlighted: true` on Business is unused on this page.

### 4.4 How it works cinema

Right column starts compact (`h-11`) for 500ms, then expands over 850ms (`cubic-bezier(0.22, 1, 0.36, 1)`). Stage has no card chrome — it sits on tan, then the **violet page wash** (`HiwPageWash`) fades in (1.15s) when the finale CTA appears. Wash is a full-viewport portal fill, cubic edge from the wordmark down the pricing/CTA gutter (hue 310). Desktop only (`hidden lg:block`).

**Cinema is skipped** (jump to finale CTA) when:

1. Locale swap (`isLocaleTransition()`), or  
2. `prefers-reduced-motion`, or  
3. HIW already played this JS session (`hasPlayedHiwCinema()`).

A **full refresh** plays it again.

Finale CTA: **Get Free Preview** (`SpectrumFlipCta`) → `/introspect`. Dictionary also has `beginIntrospect` (“Begin Introspect”) for other surfaces.

Copy during cinema (EN / ES):

| Beat | EN |
|---|---|
| Eyebrow | How it works |
| Giant numeral | 3 |
| Tagline | Three simple steps to get your website… |
| Step 1 | Introspect — Answer a few questions about your project. |
| Step 2 | Free preview — A free website you can click through and try yourself. Captions: “Applicreations gets to work on your preview.” / “Even on your phone.” |
| Step 3 | Working website — We review with you. Then we make revisions. The build is finished and the real website is delivered. |

ES: Cómo funciona / Tres pasos simples… / Introspección / Vista previa gratis / Sitio web funcionando.

### 4.5 SpectrumFlipCta (canonical CTA look)

- **&lt; lg:** solid coastal blue `oklch(68% 0.15 230)`, white type, no mark.
- **lg+:** white button, primary-800 type, sky-blue origin **dot**. Hover/focus: fill blooms from the dot (`scale-[70]`, 300ms `[0.22,1,0.36,1]`); dot becomes a heavy white check; type goes white.
- Shadow as in §1.6. `rounded-2xl`, `font-sans font-bold`.

---

## 5. Pricing (`/pricing`)

**File:** `app/[locale]/pricing/PricingPageClient.tsx`  
Data: `getPlans(dict, locale)` + `getSupportPlans(dict, locale)` + `BUILD_HANDOFF_FEE`.

Layout: compact top padding (`pt-2 sm:pt-3`). Desktop: content column + sticky 18–20rem selection rail. Mobile: selection docks as a bottom bar.

### 5.1 Website packages (one-time)

Heading “Website”. Accordion cards. Highlights rotate via `PlanFeatureRotator`. “What’s included” expands `DetailGroups` (and mini example screens for Starter/Basic/Business). Starting-price footnote on every expanded website card.

| id | Name | Price | `highlighted` in code | Landing Popular |
|---|---|---|---|---|
| `starter` | Starter | **$349** | false | no |
| `basic` | Basic | **$699** | false | **yes** |
| `business` | Business | **$999** | true (unused in UI) | no |
| `pro` | Pro | **Contact for pricing** | false | no |

Selection chrome (when chosen): 2px border `oklch(52% 0.14 295)`, fill `oklch(96% 0.04 295)`.

**Summaries (EN):**

- **Starter:** Bare-bones one-page — artist portfolios, side hustle, community event. Not for booking/ordering/running a full business. 1 page; 1 revision round; no plugins/booking/ordering; no custom branded marketing help.
- **Basic:** Clear 1–2 page site around the business. Maps embed, multiple contact paths, basic analytics. 2 revision rounds.
- **Business:** 3–5 pages; admin page for hours/photos/services; local SEO across pages. 2–3 revision rounds. Detail copy says booking/ordering/membership are **not** included (see Pro). Feature chips still say “Logins & online orders” — known inconsistency.
- **Pro:** Custom tools around how the team works (booking, inventory, ordering, member login). Planning call; revisions throughout. Contact for pricing.

Help-after on every website package: build only; add hosting from **$19/month** (Business copy also mentions Business support $39; Pro mentions Ultimate $99).

### 5.2 Hosting & support (monthly)

Heading “Hosting & Support”. Intro: hosted on **Render** (linked). Same accordion + Choose toggle. Mutually exclusive with build & hand off.

| id | Name | Price |
|---|---|---|
| `support` | Basic | **$19/mo** |
| `business-support` | Business | **$39/mo** |
| `ultimate` | Ultimate | **$99/mo** |

- **Basic:** Business-hours help, keep the live site working, small updates (hours/photos/wording), email + phone, Mon–Fri 8 a.m.–4 p.m. EST. Cancel anytime — then the client deploys.
- **Business:** Everything in Basic, priority during business hours, faster replies, medium updates (e.g. a new section).
- **Ultimate:** Everything in Business, any hour, first attention when something is down. Aimed at shops that lose money overnight.

### 5.3 Going live

Three steps:

1. **Website package** — covers the build only.  
2. **Hosting & Support** — needed to go live *or* **Build & hand off ($500)** with a strong “we advise against this” confirm dialog. Handoff is Render-only. Client must have an active Render account. After transfer, Applicreations is not responsible. Cancel-takeover list (DNS, HTTPS, Render settings, secrets, deploys/rollbacks, 5xx, dependency patches, billing) is in the dictionary.  
3. **Domain** — buy at Namecheap (linked).

### 5.4 Payment preview (selection rail)

Choose a website package and a hosting plan (or handoff). Estimated total. **$0 due today.**

Terms (EN): free preview within **72 hours**, then **three days** to try it. Stop after preview → owe nothing. Continue → **50% of one-time fee** due; real site usually **14 days or less**; remaining 50% + first monthly (or handoff fee) due at go-live.

CTAs: Continue to Introspect (handoff via query + `sessionStorage`), Email this selection.

---

## 6. Introspect (`/introspect`)

**File:** `components/sections/IntrospectBoard.tsx`  
Page uses `.introspect-page-wash` + `.coastal-grain`. Headings in `.font-mi-gente` (Poppins). Progress bar fill `oklch(58% 0.14 310)`.

Phases: `welcome` → `questions` (steps 1–9) → `review` → `success`.

**Welcome**

- Eyebrow: Introspect  
- Heading: Welcome — let’s learn about your project  
- What to expect:  
  1. Answer a few questions.  
  2. Applicreations builds your free preview in **48 to 72 hours**.  
  3. Play with the preview for **3 days** and decide if it’s a fit.  
- CTA: Get Started (SpectrumFlip-style button; not the shared component — duplicated markup).

**Steps**

1. You — name, email, phone (US 10-digit; “we'll text first”).  
2. Business — name, what it does, location (city/town/area — not a specific US state requirement).  
3. Online presence — yes/no/unsure; optional site URL, social links, admired sites.  
4. Logo & pictures — optional uploads (logo 5 MB; photos 10 MB, cap in UI); need photos taken?; security notice (AES-256 / TLS, 30-day delete).  
5. What people should be able to do (at least one action).  
6. How developed: The basics / A few pages and some tools / The ultimate site, custom tools and more. Pricing handoff maps Starter+Basic → basics, Business → a-few-pages, Pro → fuller-site.  
7. Design feel (multi) + colors (multi, match logo, or no preference) + optional notes.  
8. Steer clear of (optional).  
9. Anything else (optional).

Review, then Submit Introspect. Success: preview link by email in &lt;72 hours; 3 days to start real site or stop; use email buttons.

---

## 7. About (`/about`)

Compact card, `max-w-3xl`. Eyebrow “About”. Round headshot `/images/david-moore-headshot.png`.  

**David Moore** — Founder, Applicreations.

Three paragraphs (EN gist): grew up drawing (pencil, ink, charcoal, pastels, watercolor); worked as a chef; taught himself web/software from **2021**; small local businesses stuck with generic Wix/GoDaddy/Squarespace sites; started Applicreations in **2025**; no generic templates; people-first; “plant unique digital roots.”

---

## 8. Contact (`/contact`)

Eyebrow “Contact”, heading “Get in touch”, “We typically respond within 48 hours.”

Fields: Name, Phone, Email, Message. Send message. Success: “Thanks for reaching out” / reply soon. Mobile send button uses coastal blue (not primary navy).

---

## 9. Projects (`/demos`)

Title “Projects”. Two picker cards:

| id | Title | Live URL | Package label | Face |
|---|---|---|---|---|
| `caramel-jo` | Caramel & Jo | https://caramelandjo.com/ | Business package · $999 | Playfair (`.font-caramel`) |
| `mi-gente` | Mi Gente Bonita Market | https://migentebonitamarket.com/ | Business package · $999 | Poppins (`.font-mi-gente`) |

EN captions: “A warm bakery site that feels at home on a phone.” / “A friendly market presence with room to grow.”

Caramel features: mobile-first, brand-forward homepage, product gallery & cart, simple email ordering, bilingual EN/ES.  
Mi Gente: hours & locations, product gallery, bilingual, call/directions/social.

Mobile: auto-advancing screenshots (3.8s hold, 0.85s fade), tap to pause/zoom. Desktop: open walkthrough of frames (staggered 0.45s fade-up). Footer: “Want something like this?” + Begin Introspect + Contact.

---

## 10. Live component catalog

Only components actually imported by a live route or by another live component.

### 10.1 Sections / pages

| Component | Props | Role |
|---|---|---|
| `LandingBoard` | — | Home composition |
| `AboutBoard` | — | About |
| `ContactBoard` | — | Contact form |
| `IntrospectBoard` | — | Questionnaire |
| `PricingPageClient` | — | Pricing page (under `app/`) |
| `DemosPageClient` | — | Projects page (under `app/`) |

### 10.2 How it works

| Component | Props | Role |
|---|---|---|
| `HowItWorksStage` | `started`, `instant`, `onCtaAppear?` | Cinema conductor |
| `HiwPageWash` | `visible`, `instant` | Violet wash portal |
| `HiwStepCopy` | `n`, `label`, `Icon` | Numbered step chrome |
| `HiwCaption` | `text`, `placement`, `leaving?`, `preSink?`, `leaveMs?`, `preSinkMs?` | Floating captions |
| `HiwFormSketch` | `playing`, `duration` | Typed Introspect form |
| `HiwLivePreviewSketch` | `playing`, `duration`, `onBeat?` | Locked cord + laptop/phone |
| `HiwWorkingWebsiteSketch` | `playing`, `duration`, `entrance?: 'land'\|'fade'` | Multi-device finale art |
| `HiwConstructionSketch` | `shot`, `phase`, `showFoundation`, `swinging`, `jackRef?` | House build |
| `HiwStep3Cinema` | `playing`, `reviewMs`, `houseMs`, `screensMs`, `onBeat?` | Step 3 beats |
| `Backdrop` / `Rocks` / `Worker` / `HiwBuildPage` | (internal/shared) | Sketch pieces |

`HiwCaptionPlacement`: `form` | `build` | `preview` | `phone` | `review` | `house` | `screens`.

### 10.3 Chrome / i18n / UI

| Component | Props / variants | Role |
|---|---|---|
| `BrandLockup` | `name`, `skipIntro?`, `priority?` | Locked wordmark |
| `BrandNavLinks` | `variant: landing\|subpage`, `iconSize?`, `onNavigate?` | Icon nav |
| `LanguageToggle` | `variant: landing\|subpage` | EN↔ES |
| `Navigation` | — | Subpage header |
| `SiteFooter` | — | Copyright bar |
| `LocaleProvider` | `locale`, `dictionary` | i18n context (`dict`, `t`, `href`, `setLocale`) |
| `LocaleTransitionGuard` | — | Restore scroll |
| `LocaleAwareLoading` | `children` | Skip skeleton on locale swap |
| `Button` | `variant: primary\|secondary\|ghost\|icon\|outline`, `size: sm\|md\|lg`, `href?`, `isLoading?` | Buttons / link-buttons |
| `SpectrumFlipCta` | `href?`, `size: sm\|md`, `disabled?`, `type?` | Canonical CTA |
| `Progress` | Radix + `indicatorClassName?` | Introspect bar |
| `IconContact` | `className?` | Envelope icon (also used on pricing/demos) |

### 10.4 Pricing pieces

| Component | Props | Role |
|---|---|---|
| `DetailGroups` | `groups`, `planId?` | What’s-included blocks |
| `PlanFeatureRotator` | `messages`, `ariaLabel`, `startDelay?`, `visible?` | Rotating highlight lines |
| `SelectToggle` | `selected`, `label`, `onToggle`, `widthLabel?` | Choose / Chosen |
| `PackagePriceLabel` | `label` | Shrinks `/mo` or `/mes` |
| `LinkRenderText` | `text` | Turns “Render” into an external link |
| `SelectionSummary` | selected plan/support/handoff + clear handlers | Payment preview |
| `BuildHandoffConfirmDialog` | `open`, `onConfirm`, `onCancel` | $500 warning |
| `ExampleScreenRotator` | plan-driven scenes | Mini-site + cursor in details |

---

## 11. Animation catalog (live)

Shared ease unless noted: **`[0.22, 1, 0.36, 1]`**.  
`useAnimation()` is unused. Reduced motion: skip cinema; rotator shows first line only; CSS HIW animations off.

### 11.1 Landing entrance

| What | Trigger | Props | Duration | Delay | Ease |
|---|---|---|---|---|---|
| Butterfly | Mount (unless locale skip) | opacity 0→1, scale 0.86→1 | 0.6s | 0.05s | 0.22,1,0.36,1 |
| Brand block | Mount | opacity, y 16→0 | 0.55s | 0 | same |
| Pricing card | Mount | opacity, y 14→0 | 0.5s | 0.12s | default (no custom ease) |
| HIW column | Mount | opacity, y 14→0 | 0.5s | 0.28s | same as easeOut |
| Compact → expand | After 500ms hold | CSS grid-rows | 850ms | — | 0.22,1,0.36,1 |
| Page wash | Finale CTA appears | opacity 0→1 | 1.15s | 0 | 0.22,1,0.36,1 |

### 11.2 How-it-works cinema timings

Desktop constants (`DESKTOP_MS` in `HowItWorksStage.tsx`). **Mobile (≤1023px) multiplies every value by 0.55.**

Intro fly-in pose: opacity 0, scale 1.72, rotateX 18°, z 96, perspective 1100.

| Phase | ms (desktop) | Motion |
|---|---|---|
| Intro in | 880 | opacity/scale/rotateX/z |
| Intro stagger | 300 | How it works → 3 → tagline |
| Intro glow | 720 | CSS pulse + ripples + neon + grow |
| Glow → 3 exit | 480 | 3 starts toward viewer |
| 3 travel out | 1220 | scale 1.88, rotateX -11°, z 150, ease `[0.36,0,0.52,0.22]` |
| 3 fade delay + fade | 300 + 820 | opacity hold then out |
| Tagline follow delay | 500 | CSS animation-delay |
| Tagline travel / hold / fade | 700 / 1380 / 720 | CSS `linear()` 2.8s grow to 3× then fade (68% still opaque) |
| Intro handoff to form | 2980 | Form starts during tagline surge |
| Step 1 enter / art | 1900 / 1600 | Form illustration slower than other art |
| Form typing | 46ms/char, 90ms field start, 150ms between fields | Caret blink 1.06s linear infinite |
| Step 1 glow hold | 3200 after last keystroke | CSS `.hiw-glow-build` 2.2s |
| Step 1 art out / fade | 1080 / 720 | Form slides right (80px) |
| Step 1 copy delay / settle / hold / fade | 280 / 1680 / 700 / 960 | |
| Step 2 enter | 1040 | Overlap with step 1 leave |
| Step 2 play | 30000 | Live preview cinema |
| Step 3 review / house / screens | 5400 / 7200 / 11500 | Crossfades 1.05s / 1.12s |
| Step 3 plunge | 720 | y 240, scale down, sink ease `[0.52,0.02,0.88,0.08]` |
| Finale in | 1100 | Tagline zoom from viewer (scale 1.58, rotateX 15°, z 80) |
| Finale headline hold | 800 | |
| Points in / stagger / hold | 560 / 220 / 1200 | Three recap lines |
| Finale text out | 400 | |
| CTA in / grow hold / grow | 360 / 160 / 860 | Fade at natural size, then scale; grow ease `[0.45,0.05,0.12,1]` |

**Locked cord (step 2):** pathLength 0→1 in **1.65s**, ease `[0.42,0,0.2,1]`; stroke `oklch(22% 0.015 50)`, round cap/join. Opacity in 0.12s; out 0.22s. **Do not retune.** Preview beat schedule (fractions of step-2 duration): wire 0.14, grow 0.45, laptop fade 0.748, phone in 0.756. Phone entrance **2.85s**.

**Captions:** opacity 1.1s + scale 1.35s on enter; x/y float **7.2–14s** so the line is still moving at handoff. Leave ~0.82–0.95s. Phone caption uses `PHONE_FLOW` `[0.42,0,0.22,1]`. Screens caption pre-sinks then plunges with the devices.

**Sketch bits:** construction pose in/out 0.70–0.78s; review talking-head rotate/y 0.86s; speech dots 1.05s stagger 0.14s infinite.

### 11.3 Pricing page

| What | Props | Duration | Delay / stagger | Ease |
|---|---|---|---|---|
| H1 | opacity, y 10→0 | 0.35s | 0 | default |
| Section heads | opacity, y 8→0 | 0.3s | 0.06s (website), similar later | default |
| Plan / support cards | opacity, y 12→0 | 0.3s | 0.04 + index×0.04 | default |
| Details expand | height, opacity | 0.28s | — | 0.22,1,0.36,1 |
| Feature rotator line | opacity, x ±28 | 1.15s | hold 4.5s; startDelay index×900ms | 0.22,1,0.36,1 |
| Rotator show/hide | height, opacity | 0.22s | — | same |
| Handoff dialog overlay | opacity | 0.2s | — | default |
| Handoff dialog panel | opacity, y, scale 0.98→1 | 0.28s | — | 0.22,1,0.36,1 |
| Example screen open | scale, opacity | 0.92s open / 0.8s close | opacity close delay 0.34s | expand `[0.16,1,0.3,1]`, collapse `[0.4,0,0.2,1]` |
| Example cursor | x/y | randomized | — | randomized cubic-beziers |

### 11.4 Introspect

`AnimatePresence mode="wait"`. Welcome: 0.35s opacity/y 12→0, exit y -8. Steps: 0.28s. Success: 0.4s. Locale skip sets `initial={false}` on welcome.

### 11.5 Projects

H1: 0.4s opacity/y. Desktop frames: 0.45s, delay `0.06 * index`. Slideshow: 0.85s fade, ease `[0.4,0,0.2,1]`, hold 3.8s. Detail panel: 0.35s height/opacity.

### 11.6 CSS-only (not Framer)

SpectrumFlipCta bloom 300ms. HIW intro keyframes as in §1.8. `html { scroll-behavior: smooth }` (subpages).

---

## 12. Pricing source of truth

**Numbers:** `lib/pricing.ts` → `WEBSITE_META`, `SUPPORT_META`, `BUILD_HANDOFF_FEE = 500`.  
**Names / summaries / details / CTAs:** `dict.plans` via `getPlans` / `getSupportPlans`.  
**UI must call `getPlans(dict, locale)`**, not the English `plans` export.

Rendered today:

```
Website:  Starter $349 · Basic $699 · Business $999 · Pro contact
Support:  Basic $19/mo · Business $39/mo · Ultimate $99/mo
Handoff:  $500 one-time (Render only)
```

### 12.1 Do not trust these older docs

`STATUS.md` and `SCOPE.md` still say Basic $600 / Pro $1,000 / Business $3,000 and hosting from $50. That is **not** what the site shows.

### 12.2 Known copy/number splits (flag, don’t “fix” in this snapshot)

- `$500` is both `BUILD_HANDOFF_FEE` and hardcoded dictionary strings (`goingLiveStep2HandoffFee`, body sentences).
- Project cards hardcode `Business package · $999` in the dictionaries.
- Landing Popular = Basic; `highlighted` in code = Business (unused).
- Business feature chips vs detail bullets disagree on logins/orders.
- Pro feature list includes “Help included”; help-after says hosting is extra.

---

## 13. Spanish (parallel, not a second design)

Same layout. Dictionary `es.ts` is complete for the live surfaces. Nav: Introspección / Proyectos / Precios / Nosotros / Contacto. Tagline and HIW strings listed in §4. Prices stay USD (`$19/mes`, etc.).

---

## 14. Leftovers removed (1 Sep 2026 cleanup)

Deleted, do not recreate: leftover sections (`Hero`, `FAQ`, `Services`, old `HowItWorks`, old `Pricing`, teasers, `Maintenance*`), unused UI (`Card`, `Badge`, `Input`, `Link`, `IntrospectButton`), `DetailGroups`, `PlanFeatureRotator`, `lib/animations.ts`, unused CSS (`.coastal-wash`, `.gallery-swipe`, `.bg-fade-*`), unused public stand-ins, and unused npm (`@phosphor-icons/react`, `@radix-ui/react-slot`, `class-variance-authority`).

Stale reports moved to `docs/archive/`.

**Live Radix:** `@radix-ui/react-progress` (Introspect bar only).

---

## 15. File map (live)

```
app/globals.css                          tokens + HIW CSS
app/layout.tsx                           fonts
app/[locale]/layout.tsx                  chrome
app/[locale]/page.tsx                    home → LandingBoard
app/[locale]/{pricing,introspect,redesign,about,contact,demos}/

lib/pricing.ts                           prices
lib/projects.ts                          project metadata
lib/i18n/dictionaries/{en,es,types}.ts   copy
lib/i18n/locale-transition.ts            skip-intro flag
lib/hiw-cinema.ts                        session “already played”

components/sections/{Landing,About,Contact,Introspect}Board.tsx
components/landing/hiw/*                 cinema (cord locked)
components/ui/{BrandLockup,BrandNavLinks,Navigation,SiteFooter,
               Button,SpectrumFlipCta,Progress}.tsx
components/pricing/*                     pricing page
components/i18n/*
```

---

## 16. How to use this file

1. If a later change disagrees with this snapshot, **the code wins** — update this file in the same change.  
2. Do not restyle the locked cord, BrandLockup geometry, or landing spacing/card format without an explicit user lock-lift.  
3. Do not reintroduce Delaware copy or the unused section components.  
4. New animation: record trigger, properties, duration, ease, delay/stagger, and file here.
)