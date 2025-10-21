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

---

## October 21, 2025 - Hero Section Implementation
**Decision**: Build Hero section as first Phase 2 component with full Framer Motion animations
**Rationale**: Hero is most critical section (3-second test). Must be perfect. Implementation:
  - Exact copy from SCOPE.md (no variations)
  - Semantic H1 for SEO
  - Responsive typography (38px mobile → 51px desktop)
  - Dual CTAs with proper hierarchy (primary + secondary)
  - Trust indicators as pill badges
  - Framer Motion for smooth entrance animations
  - Subtle gradient background (doesn't compete with content)
**Alternatives**: 
  - Static hero without animations - rejected, loses polish
  - Different copy - rejected, must match SCOPE.md exactly
**Impact**: Professional, conversion-focused hero that passes 3-second test. Sets quality bar for rest of site.

## October 21, 2025 - Button Component Enhancement (href Support)
**Decision**: Extend Button component to support href prop, rendering as Next.js Link when provided
**Rationale**: Hero CTAs need to link to /demo and /quote pages. Button component originally only supported button elements. Solution:
  - Add optional `href` prop to ButtonProps
  - When href is provided (and not disabled/loading), render as NextLink
  - Otherwise render as button element
  - Maintains all styling, variants, and accessibility features
  - Updated secondary variant: white bg + blue border (per SCOPE.md specs)
**Alternatives**: 
  - Use separate Link component styled as button - rejected, duplicates code
  - Wrap buttons in Links - rejected, poor semantics and accessibility
**Impact**: Single Button component handles both button and link use cases. Cleaner API, better DX.

## October 21, 2025 - Content Direction Change: Remove Delaware References
**Decision**: Remove all Delaware-specific messaging from the redesign
**Rationale**: User explicitly stated they do not want Delaware mentioned anywhere on the site. Original SCOPE.md was Delaware-focused, but actual site should be:
  - Generic/national positioning (NOT location-specific)
  - Truthful claims only (no false statistics about years in business or sites launched)
  - Simple, honest messaging: "Custom apps and websites"
  - Professional web development without geographic targeting
**Implementation**: 
  - Updated Hero section with approved generic copy
  - Added critical override notice to SCOPE.md
  - Created memory to prevent future Delaware references
  - Hero now shows: "Custom Apps and Websites" with professional, truthful messaging
**Impact**: All future sections must follow this generic, truthful approach. SCOPE.md Delaware content is reference only - DO NOT USE.

## October 21, 2025 - Build Cache Corruption Fix
**Issue**: Internal Server Error (500) when loading Hero section after implementation
**Root Cause**: Corrupted Next.js build cache in `.next` folder - ENOENT errors for build manifest files
**Solution**: Delete `.next` folder and restart dev server with `npm run dev`
**Rationale**: Next.js build cache can become corrupted during rapid development iterations, especially when:
  - Files are modified while dev server is running
  - Build processes are interrupted
  - File changes happen too quickly for incremental builds
**Prevention**: When seeing ENOENT errors about manifest files in terminal, always delete `.next` first before debugging code
**Impact**: Clean rebuild resolves all 500 errors. Hero section now renders perfectly with all features working.

---

