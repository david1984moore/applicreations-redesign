# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Next.js 15 (App Router) marketing site (`applicreations-redesign`). There is one service to run — the Next.js dev server.

- Dependencies install with `npm install` (repo uses `package-lock.json`; Node 22 is present). This is handled by the startup update script, so you normally don't need to run it manually.
- Run the dev server with `npm run dev`. Note it binds to port **3004** (not the default 3000), per the `dev` script in `package.json`. Open `http://localhost:3004`.
- Standard commands are defined in `package.json` scripts: `npm run lint` (ESLint via `next lint`), `npm run type-check` (`tsc --noEmit`), `npm run build` (production build), `npm run dev` (dev server). `npm run pre-commit` runs lint + type-check together.
- Lint currently emits a handful of `no-unused-vars` / `exhaustive-deps` **warnings** (not errors); the build and lint still pass. Don't treat those pre-existing warnings as failures.
- Email (contact/pricing/introspect forms) is sent via Resend and is **optional**: without `RESEND_API_KEY` the API routes still succeed and degrade gracefully (the contact route just logs to the server console). Set `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO` (see `.env.example`) in a `.env.local` only if you need to test real email delivery.
- If you hit "Internal Server Error" from a corrupted `.next` cache during active dev, run `npm run clean` then `npm run dev` (or `npm run reset`).
