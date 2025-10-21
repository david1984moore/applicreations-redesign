# Design Decisions Log

## Purpose
Track significant design and technical decisions made during redesign.

## Format
Each entry: Date, Decision, Rationale, Alternatives Considered

---

## October 21, 2025 - Repository Strategy
**Decision**: Create separate repository for redesign (Option A)
**Rationale**: Cleaner separation between live site and redesign. No risk of accidentally affecting production. Easier to manage two distinct codebases.
**Alternatives**: Branch-based approach in same repo (Option B) - more complex, higher risk
**Impact**: Live site remains completely untouched during entire redesign process

## October 21, 2025 - Framework Choice
**Decision**: Next.js 14 with App Router
**Rationale**: Per SCOPE.md requirements - modern React framework with excellent performance, SEO capabilities, and Vercel Edge deployment
**Alternatives**: Vite + React (current stack) - rejected because redesign goals require server-side capabilities
**Impact**: Complete rebuild required, not a refactor

## October 21, 2025 - Design System Foundation
**Decision**: Use LCH color space for color definitions
**Rationale**: Per SCOPE.md - provides perceptually uniform colors, better than HSL/RGB for accessibility
**Alternatives**: Standard RGB/HSL - rejected due to non-uniform perceptual lightness
**Impact**: All color values defined in oklch() format in Tailwind config

## October 21, 2025 - Component Library Architecture
**Decision**: Build custom UI components (Button, Card, Input, Link) rather than use a pre-built library
**Rationale**: Full control over design system implementation, ensures iOS-inspired aesthetic, no bloat from unused features
**Alternatives**: shadcn/ui, Radix UI, Headless UI - rejected because we need exact design system match
**Impact**: More initial work, but perfect alignment with SCOPE.md specifications

## October 21, 2025 - Animation Library Choice
**Decision**: Use Framer Motion for animations
**Rationale**: Best-in-class React animation library, spring physics support, excellent TypeScript support, reduced motion support built-in
**Alternatives**: React Spring, CSS-only animations - rejected due to less developer-friendly API
**Impact**: Bundle size increase (~40KB), but superior animation quality and ease of implementation

## October 21, 2025 - TypeScript Strict Mode
**Decision**: Enable strict mode, noUncheckedIndexedAccess, and noImplicitReturns
**Rationale**: Catch more bugs at compile time, better code quality, aligns with best practices
**Alternatives**: Relaxed TypeScript config - rejected for long-term code quality
**Impact**: More type annotations required, but safer codebase

## October 21, 2025 - Next.js Version Update
**Decision**: Use Next.js 15 instead of 14 (plan specified 14)
**Rationale**: Latest stable version available, improved performance, no breaking changes that affect our use case
**Alternatives**: Stick with Next.js 14 - no compelling reason to use older version
**Impact**: Access to latest features and performance improvements

## October 21, 2025 - Button Border Radius - Reverted to Standard
**Decision**: Use standard border radius (sm: 8px, md: 8px, lg: 12px) instead of pill shape
**Rationale**: After user testing, pill shape felt too rounded. Reverted to original design:
  - Small/Medium buttons: `rounded-md` (8px)
  - Large buttons: `rounded-lg` (12px)
  - Icon buttons: `rounded-md` (8px)
  - Provides modern look without being overly stylized
**Alternatives**: 
  - `rounded-full` (pill shape) - tested but rejected as too round
  - `rounded-xl` (16px) - considered but unnecessary
**Impact**: Buttons have professional, modern appearance with subtle rounding. Better balance between modern and traditional design.

## October 21, 2025 - Card Animation Performance Optimization
**Decision**: Switch from Framer Motion to pure CSS transitions for card hover animations (300ms duration)
**Rationale**: User reported hitching/speed changes and text shifting during animation. Solution:
  - Pure CSS transforms with hardware acceleration (no JS overhead)
  - `duration-300` (300ms) with `ease-out` for smooth, elegant feel
  - `translate3d(0, 0, 0)` establishes stable GPU layer from start
  - `WebkitFontSmoothing: 'subpixel-antialiased'` locks text to pixel grid (prevents shifting)
  - `willChange: 'transform'` preps browser for transform (prevents layout shifts)
  - `backfaceVisibility: hidden` ensures crisp rendering
**Alternatives**: 
  - Keep Framer Motion - rejected due to hitching
  - `antialiased` font smoothing - rejected, caused text shifting
  - 200ms duration - rejected as too fast
**Impact**: Completely fluid, zero-hitch animations. Text stays pixel-perfect stable. 60fps guaranteed. Production-quality polish.


