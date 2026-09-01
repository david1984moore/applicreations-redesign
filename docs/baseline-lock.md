# Baseline lock + cleanup inventory

**Locked:** 1 September 2026  
**Status:** Cleanup pass completed 1 Sep 2026 (delete-only). Locked visuals and live routes unchanged.  
**Companion:** `docs/canonical-site-snapshot.md` (visual/copy ground truth)  
**Workflow:** STATUS.md line 1, SCOPE.md “Baseline Lock”, `.cursor/rules/locked-*.mdc`

The site is the respectable v1 baseline. Later work must keep current behavior, prices, routes, copy sources, and locked visuals. Cleanup is a separate, explicit pass.

---

## 1. What is locked (do not change without an explicit lock-lift)

### 1.1 Visuals already frozen

| Piece | File | Frozen |
|---|---|---|
| Get Started / Start Re-design hover | `components/ui/SpectrumFlipCta.tsx` | 25 Aug 2026 |
| Live-preview cord + jack | `HiwDeviceSketch.tsx`, jack rect in `HiwConstructionSketch.tsx` | 18 Aug 2026 |
| Butterfly over “li” | `components/ui/BrandLockup.tsx` | 18 Aug 2026 |
| Landing two-column desktop composition | `LandingBoard.tsx` header (shell clamps, 7/5 split, HIW pad) | 1 / 16 Aug 2026 |

Cursor rules: `locked-spectrum-flip-cta.mdc`, `locked-hiw-cord.mdc`, `locked-brand-lockup.mdc`, `locked-baseline-site.mdc`.

### 1.2 Live routes (must keep working)

English is unprefixed. Spanish is `/es…`. Middleware rewrites English into `[locale]`.

| EN | ES | Board |
|---|---|---|
| `/` | `/es` | `LandingBoard` |
| `/pricing` | `/es/pricing` | `PricingPageClient` |
| `/introspect` | `/es/introspect` | `IntrospectBoard` |
| `/redesign` | `/es/redesign` | `IntrospectBoard variant="redesign"` |
| `/about` | `/es/about` | `AboutBoard` |
| `/contact` | `/es/contact` | `ContactBoard` |
| `/demos` | `/es/demos` | `DemosPageClient` |

APIs: `POST /api/contact`, `POST /api/introspect`, `POST /api/pricing-selection`.

### 1.3 Numbers and copy sources

| Kind | Source | Live values |
|---|---|---|
| Website prices | `lib/pricing.ts` `WEBSITE_META` | Starter **$349**, Basic **$699**, Business **$999**, Pro **contact** |
| Support | `SUPPORT_META` | **$19 / $39 / $99** per month |
| Handoff | `BUILD_HANDOFF_FEE` | **$500** |
| Extra revision | `EXTRA_REVISION_FEE` | **$75** |
| User-facing copy | `lib/i18n/dictionaries/en.ts` + `es.ts` | Parallel, complete for live surfaces |
| Projects | `lib/projects.ts` | Caramel & Jo, Mi Gente Bonita |

Ignore STATUS/SCOPE prices of $600 / $1,000 / $3,000 or $1,900 / $3,250 / $6,250. Those are historical.

### 1.4 Hard constraints

- No Delaware / location-specific marketing copy. Generic and truthful.
- Do not remount leftover homepage sections (`Hero`, `FAQ`, `Services`, …).
- Do not start the cleanup list below until asked.
- Do not “improve” locked CTA / cord / lockup / landing spacing.

---

## 2. Live ingredient map (must stay)

```
app/layout.tsx                         fonts + globals + metadata
app/globals.css                        tokens + live HIW CSS
app/[locale]/layout.tsx                LocaleProvider, nav, footer, route cover
middleware.ts                          locale rewrite / cookie / first-visit /es
app/[locale]/page.tsx                  → LandingBoard
app/[locale]/{pricing,introspect,redesign,about,contact,demos}/
app/api/{contact,introspect,pricing-selection}/route.ts

lib/pricing.ts                         numbers + plan builders
lib/introspect.ts                      answers, validation, recommendPlan
lib/projects.ts                        demo metadata
lib/email.ts + email-templates.ts      Resend
lib/brand-contact.ts                   from / reply / notify
lib/site.ts + page-metadata.ts
lib/hiw-cinema.ts + route-cover.ts
lib/countries.ts + us-places.ts
lib/i18n/*                             config, paths, dictionaries, transition
lib/utils.ts                           cn()

components/sections/{Landing,About,Contact,Introspect}Board.tsx
components/landing/LandingPricingRow.tsx
components/landing/hiw/*               cinema (cord locked)
components/pricing/*                   except DetailGroups + PlanFeatureRotator
components/introspect/*                wash, success, location combobox
components/i18n/*                      all four
components/ui/{BrandLockup,BrandNavLinks,Navigation,SiteFooter,
               RouteCover,Button,SpectrumFlipCta,Progress}.tsx
```

`ExampleScreenRotator.tsx` stays: HIW sketches import `C` / `ScenePage` / scene ids. The `ExampleScreenRotator()` component export itself is unused.

Env required in production: `RESEND_API_KEY`. Optional: `EMAIL_FROM`, `EMAIL_REPLY_TO`, `EMAIL_NOTIFY_TO`, `NEXT_PUBLIC_SITE_URL`. See `.env.example`.

---

## 3. Render server-failure findings

Two emails, two codes, no lasting downtime when you checked:

| When | Render message | Meaning |
|---|---|---|
| Fri 28 Aug 2026, 8:08 PM | Exited with status **143** | Process received **SIGTERM** (128+15). Platform asked it to stop. |
| ~1 Sep 2026, 10:28 AM | Cause of failure **could not be determined** | Instance became unavailable; Render’s classifier had no app exit reason. |

### 3.1 What this is not

Not a typical application crash. Those usually show **exit 1** (uncaught exception) or **137** (SIGKILL / out-of-memory). The APIs validate input and return 400/502/503 instead of throwing. There is no database, no background worker, and no custom SIGTERM handler that would misbehave.

143 is the normal code when Render **replaces** an instance: new deploy, host move, scale event, or health-driven recycle. “Undetermined” is usually the same class of event without a clean exit (host loss, hang, or check timeout).

That matches what you saw: a short blip on a **single instance**, then the site was fine.

### 3.2 What I could verify in the repo

- No `render.yaml`. No `healthCheckPath`. Render then only checks that Node bound to `PORT`.
- Start command is `next start` (`package.json`). Fine for Render if `PORT` is left to the platform (Next reads it).
- Homepage is a large client cinema. A health check that hits `/` can be slow on a cold instance.
- `HowItWorksStage` is a client component that imports `getDictionary`, which statically pulls **both** `en.ts` and `es.ts` into the homepage bundle. `LocaleProvider` already has the active dictionary.
- Introspect `multipart/form-data` runs `request.formData()`. Uploads are **not stored**, but the bytes are still buffered in memory. Several 10 MB photos can spike RAM on a small instance.
- `/demos` uses `next/image` on real JPGs. Sharp runs in-process; first-request image optimization can spike RAM.
- Four `next/font/google` families load at boot.
- No `/api/health` route.

I cannot see the Render Events / Metrics / logs from here. Confirm in the dashboard for those two timestamps: Deploy vs Instance failure vs memory graph near the plan limit.

### 3.3 Most likely cause (ranked)

1. **Platform instance recycle** on a single Web Service (Starter/Standard host move, or a deploy). Highest fit for 143 + “undetermined” + site already up when you looked.
2. **Memory pressure** on a small plan (512 MB is tight for Next 15 + image optimizer + large homepage). Would more often show 137 or a memory event; still worth watching.
3. **Slow `/` as an implicit health target** after a recycle (cold compile / first image) — possible contributor to “undetermined,” not proven.

### 3.4 Hardening later (do not do in this pass)

1. In Render Events, confirm those two timestamps.
2. Add `GET /api/health` that returns 200 with no cinema, no images, no email.
3. Set `healthCheckPath: /api/health` on the service (or a `render.yaml`).
4. Watch memory for 48 hours. If it climbs toward the plan cap, raise the instance or set `NODE_OPTIONS=--max-old-space-size` below the cap.
5. Later cleanup (not now): stop buffering unused Introspect file bytes; stop importing `getDictionary` from the HIW client; consider `output: 'standalone'` only if you measure a win.

Uptime best-practice note: one instance will always show a brief gap on replace. A second instance removes most of these emails from the user-visible path. That is a billing decision, not a code change.

---

## 4. Essential vs dead (cleanup inventory)

Cleanup ran 1 Sep 2026. Items in §4.3 were removed. Do not recreate them.

### 4.1 Keep — live path

All files in §2. Boards, HIW cinema, pricing page pieces (except the two orphans), introspect, i18n, APIs, `Button` (used by contact/introspect/selection), `Progress` (introspect).

### 4.2 Keep but do not retune

Locked visuals in §1.1. `BrandNavLinks` icon order and sketch style. Coastal tokens in `globals.css` that live UI uses. HIW CSS keyframes.

### 4.3 Removed 1 Sep 2026 (do not recreate)

**Old homepage / quote-era sections**

- `components/sections/Hero.tsx`
- `OurWorkPreview.tsx`
- `IntrospectTeaser.tsx`
- `FinalCTA.tsx`
- `FAQ.tsx` (still mentions a quote tool; `$75/month`)
- `HowItWorks.tsx` (old 01–03 timeline; replaced by cinema)
- `OpportunitySolution.tsx`
- `Services.tsx` (**$1,900 / $6,250**)
- `Pricing.tsx` (old 3-card homepage)
- `Maintenance.tsx` / `MaintenanceCondensed.tsx` (**$75 / $150 / $300**)

**Unused UI primitives**

- `components/ui/Card.tsx`
- `Badge.tsx` (only `class-variance-authority` consumer)
- `Input.tsx` (live forms use native inputs)
- `Link.tsx` (live uses `next/link`)
- `IntrospectButton.tsx`

**Unused pricing leftovers**

- `components/pricing/DetailGroups.tsx`
- `components/pricing/PlanFeatureRotator.tsx`

**Unused lib**

- `lib/animations.ts` (only FAQ + FinalCTA)

**Unused npm**

- `@phosphor-icons/react` — no imports
- `@radix-ui/react-slot` — `Button.asChild` is typed, never implemented
- `class-variance-authority` — only dead `Badge`

**Unused public assets**

- `/images/hero-coastal.svg`
- `/images/work-caramel.png|.jpg|.svg`
- `/images/work-migente.png|.jpg|.svg`
- `/images/mi-gente/logo.webp` (`.png` is used)
- `/textures/spectrum-silk.png`
- `/logo.svg`, `/vercel.svg`, `/file.svg`, `/window.svg`

**Unused CSS** (after the sections above are gone)

- `.bg-fade-pro` / `.bg-fade-next`
- `.coastal-wash`
- `.gallery-swipe`
- `blue-deep` / `blue-navy` (only dead Input/Link)

**Repo junk (not imported)**

- `SS_Applicreations_homepage/`
- `_screenshot-backups/`
- Loose root camera shots (`IMG_7341.jpg` … and similar)
- `scripts/generate-og-image.py` if unused
- Stale reports: `Applicreations_Tech_Stack_Report.md`, `BLOTCH_ANIMATION_DEBUG_REPORT.md`, `redesign-project.plan.md`, `Introspect_SCOPE.md` (archive or delete after you decide)

### 4.4 Do not treat as dead

| Looks unused | Why it stays |
|---|---|
| `ExampleScreenRotator.tsx` | HIW imports `C`, `ScenePage`, scene ids |
| `lib/us-places.ts` listing Delaware | US state list, not marketing copy |
| `Button.tsx` | Live contact / introspect / selection |
| `lib/pricing.ts` `plans` used by leftover `Pricing.tsx` | The module itself is live; only the leftover section is dead |
| HIW cinema size | User-approved homepage |

### 4.5 Suggested cleanup order (when asked)

1. Delete the 11 leftover `sections/*` files. Confirm home/pricing/introspect/about/contact/demos/redesign still typecheck.
2. Delete unused UI + `DetailGroups` + `PlanFeatureRotator` + `animations.ts`.
3. Drop unused npm packages. Run `npm run build`.
4. Remove unused public placeholders and CSS classes that only those files used.
5. Move or delete stale reports. **Do not rewrite live copy.**
6. Refresh `docs/canonical-site-snapshot.md` leftover section so it matches.
7. Optional later (behavior-neutral only if proven): `HowItWorksStage` should use `dict` from `useLocale()` instead of `getDictionary`; Introspect should not buffer unused upload bytes.

Each step is delete-or-rewire only. No visual retune. No price or copy edits.

### 4.6 Stale docs (do not trust for prices or homepage)

| Doc | Problem |
|---|---|
| `STATUS.md` (older sessions) | Still describes Hero → Our Work → teaser → Final CTA; prices $600/$1k/$3k and $1900/$3250/$6250; dark mode; Next 14 |
| `SCOPE.md` body | Delaware sales spec; old prices; old landing recipe |
| `README.md` | Port 3000, `app/page.tsx`, lists Card/Input/Link as live |
| `Applicreations_Tech_Stack_Report.md` | Nov 2025 prices and stack |
| `Introspect_SCOPE.md` | 18-question calculator; not the live 9/10-step form |
| `BLOTCH_ANIMATION_DEBUG_REPORT.md` | Dead Hero animation |
| `redesign-project.plan.md` | Next 14, Apple fonts, old success criteria |
| `docs/canonical-site-snapshot.md` (pre-Sep 2026 bits) | Missing `/redesign`; still names `DetailGroups` / `PlanFeatureRotator` as live |

Trust **this file + current code + the snapshot’s locked sections**. Update the snapshot when live UI changes.

---

## 5. Cleanup result

Delete-only pass completed 1 Sep 2026. Live routes, prices, dictionaries, and locked visuals were not edited. Stale reports live in `docs/archive/`. Optional later (not done): `HowItWorksStage` should use `dict` from `useLocale()`; Introspect should not buffer unused upload bytes.
