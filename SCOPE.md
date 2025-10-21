# Applicreations.com Redesign - Project Scope (Enhanced)

**Version:** 2.0  
**Date:** October 21, 2025  
**Development Approach:** Phased implementation using Cursor Pro + Claude Pro workflow  
**Philosophy:** Apple-inspired design excellence applied to Delaware business web presence

---

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Definition](#project-definition)
3. [Core Constraints](#core-constraints)
4. [Phase 1: Foundation & Design System](#phase-1-foundation--design-system)
5. [Phase 2: Homepage Construction](#phase-2-homepage-construction)
6. [Phase 3: Supporting Pages](#phase-3-supporting-pages)
7. [Phase 4: Advanced Features](#phase-4-advanced-features)
8. [Phase 5: Post-Launch](#phase-5-post-launch)
9. [Design System Standards](#design-system-standards)
10. [Copy & Messaging Guidelines](#copy--messaging-guidelines)
11. [Testing Requirements](#testing-requirements)
12. [Deployment Strategy](#deployment-strategy)

---

## Development Environment Setup

### Local Development Workflow

**CRITICAL:** The live site and redesign development are **completely separate**. You will:

1. **Keep your current site running** (unchanged on Render)
2. **Build the redesign locally** (on your Windows 11 machine)
3. **Preview locally only** until ready to launch
4. **Deploy redesign to new URL** (or swap after final approval)

### Repository Strategy

```bash
# Option A: Separate Repository (RECOMMENDED)
# Create new repo for redesign - existing site untouched
git init applicreations-redesign
cd applicreations-redesign

# Option B: New Branch (if same repo)
# Work in isolated branch - main branch stays live
git checkout -b redesign-2025
# DO NOT merge to main until launch day
```

### Local Development Commands

```bash
# Start local development server (ONLY YOU can see this)
npm run dev
# Opens at http://localhost:3000
# This does NOT affect your live site

# Build for production testing (test locally before deploy)
npm run build
npm run start
# Opens at http://localhost:3000 with production optimizations

# Run all checks before committing
npm run lint
npm run type-check
npm run build # Must succeed
```

### Preview Deployment Strategy

**Before Launch Day:**
- **Option 1:** Deploy to Vercel with custom preview URL (e.g., `redesign.applicreations.com` or `new.applicreations.com`)
- **Option 2:** Keep it completely local until launch day
- **Option 3:** Deploy to Vercel's auto-generated URL (e.g., `applicreations-redesign-xyz.vercel.app`)

**Launch Day:**
- Test final build locally one last time
- Deploy to Vercel production (can point to `www.applicreations.com` after DNS update)
- Update DNS to point to new Vercel deployment
- Keep old Render site as backup (don't delete for 30 days)

### Development Environment Checklist

- [ ] Install Node.js 18+ (check: `node --version`)
- [ ] Install Git (check: `git --version`)
- [ ] Create new project folder (NOT in existing site folder)
- [ ] Initialize new Next.js project: `npx create-next-app@latest applicreations-redesign`
  - ✓ TypeScript: Yes
  - ✓ ESLint: Yes
  - ✓ Tailwind CSS: Yes
  - ✓ App Router: Yes
  - ✓ Turbopack: Yes
  - ✓ Import alias: Yes (@/*)
- [ ] Navigate into project: `cd applicreations-redesign`
- [ ] Test dev server: `npm run dev` → opens at `http://localhost:3000`
- [ ] Initialize git: `git init`
- [ ] First commit: `git add . && git commit -m "Initial Next.js setup"`
- [ ] Install additional dependencies:
  ```bash
  npm install framer-motion clsx tailwind-merge @radix-ui/react-accordion
  npm install -D @axe-core/cli
  ```
- [ ] Create `.cursorrules` file (see Phase 1)
- [ ] Create `DECISIONS.md` for logging design choices

---

## Project Definition

### What We're Building

A complete redesign of Applicreations.com applying iOS design philosophy (restraint, precision, physics-based interactions) to create a premium web presence that positions Applicreations as the obvious choice for Delaware businesses seeking professional websites.

### Success Criteria (3-Second Test)

A Delaware business owner lands on the site and within 3 seconds knows:

1. ✓ This is for Delaware businesses
2. ✓ We solve the "more than a Facebook page" problem  
3. ✓ Their next step is clear (demo or quote)

They **feel** the quality immediately, even if they can't articulate why.

### What This Is NOT

- ❌ A visual-only redesign (we're changing how it works, not just how it looks)
- ❌ A feature pile-on (saying yes to everything)
- ❌ An aesthetic preference project (every decision serves conversion)
- ❌ A "nice to have when we have time" (this defines the business)

---

## Core Constraints (Immutable)

### Design Constraints

| Element | Constraint | Rationale |
|---------|-----------|-----------|
| **Logo** | Unchanged - remains exactly as-is | Brand recognition |
| **Core brand colors** | Blues maintained (refined using LCH color space) | Brand continuity |
| **Purple** | Removed from palette (logo exception only) | Simplify, focus |
| **Typography** | System font stack (no custom fonts loaded) | Performance |
| **Border radius** | Consistent superellipse-inspired values | iOS aesthetic |

### Technical Constraints

| Constraint | Requirement | Non-Negotiable |
|------------|-------------|----------------|
| **Development platform** | Windows 11 | ✓ |
| **Framework** | Next.js 14 App Router | ✓ |
| **Styling** | Tailwind CSS + CSS Custom Properties | ✓ |
| **Animation** | Framer Motion (when needed) | ✓ |
| **Deployment** | Vercel Edge | ✓ |
| **Browser support** | Last 2 versions (Chrome, Safari, Firefox, Edge) | ✓ |
| **Mobile-first** | Design for 375px width first, scale up | ✓ |

### Performance Constraints (Launch Gates)

**Cannot launch without meeting these:**

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| Lighthouse Performance | ≥90 | Chrome DevTools |
| Lighthouse Accessibility | ≥95 | Chrome DevTools |
| Lighthouse Best Practices | ≥95 | Chrome DevTools |
| Lighthouse SEO | ≥95 | Chrome DevTools |
| LCP (Largest Contentful Paint) | <2.5s | Core Web Vitals |
| INP (Interaction to Next Paint) | <200ms | Core Web Vitals |
| CLS (Cumulative Layout Shift) | <0.1 | Core Web Vitals |
| Total JavaScript bundle | <200KB gzipped | Webpack Bundle Analyzer |

### Accessibility Constraints (Non-Negotiable)

- [x] WCAG 2.1 AA compliance minimum
- [x] All interactive elements keyboard accessible
- [x] All color combinations meet 4.5:1 contrast minimum (text)
- [x] Touch targets minimum 44×44px
- [x] Semantic HTML throughout
- [x] Screen reader tested and functional
- [x] Reduced motion support for all animations

---

## Phase 1: Foundation & Design System

**Goal:** Build the invisible infrastructure that makes everything else possible

**Duration Estimate:** 1-2 weeks

### Phase 1 Tasks

#### 1.1: Project Infrastructure Setup

**Task:** Initialize Next.js project with proper configuration

**Subtasks:**
- [ ] 1.1.1: Create new Next.js 14 project with TypeScript
- [ ] 1.1.2: Configure `tsconfig.json` with strict mode
- [ ] 1.1.3: Set up ESLint with recommended rules
- [ ] 1.1.4: Set up Prettier for code formatting
- [ ] 1.1.5: Create `.cursorrules` file with project context
- [ ] 1.1.6: Create `DECISIONS.md` for design decision logging
- [ ] 1.1.7: Initialize git repository with proper `.gitignore`
- [ ] 1.1.8: Create README.md with setup instructions
- [ ] 1.1.9: Test dev server: `npm run dev` works

**Definition of Done:**
- ✓ `npm run dev` starts without errors
- ✓ TypeScript compiles with zero errors
- ✓ ESLint runs without warnings
- ✓ Git repository initialized with first commit

---

#### 1.2: Tailwind Configuration & Design Tokens

**Task:** Configure Tailwind with custom design system tokens

**Subtasks:**
- [ ] 1.2.1: Install Tailwind dependencies
- [ ] 1.2.2: Create `tailwind.config.ts` with custom theme
- [ ] 1.2.3: Define color palette using LCH values (see Design System Standards)
- [ ] 1.2.4: Define spacing scale (8-point grid)
- [ ] 1.2.5: Define typography scale (Perfect Fourth 1.333)
- [ ] 1.2.6: Define border radius values
- [ ] 1.2.7: Configure animation duration/easing values
- [ ] 1.2.8: Test Tailwind compilation: `npm run build`

**Tailwind Config Template:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define using LCH values from Design System Standards
        'blue-deep': 'oklch(59% 0.22 264)',
        'blue-sky': 'oklch(67% 0.20 264)',
        'blue-navy': 'oklch(47% 0.18 264)',
        // ... more colors
      },
      spacing: {
        // 8-point grid
      },
      fontSize: {
        // Perfect Fourth scale
      },
      borderRadius: {
        // Superellipse-inspired values
      },
      animation: {
        // Custom animations
      },
    },
  },
  plugins: [],
}
export default config
```

**Definition of Done:**
- ✓ Tailwind compiles without errors
- ✓ All design tokens accessible in components
- ✓ Can use custom colors: `className="bg-blue-deep"`
- ✓ Can use custom spacing: `className="p-4"` (32px)

---

#### 1.3: CSS Custom Properties System

**Task:** Create CSS custom properties for runtime theming

**Subtasks:**
- [ ] 1.3.1: Create `app/globals.css` with custom properties
- [ ] 1.3.2: Define color custom properties (light + dark modes)
- [ ] 1.3.3: Define spacing custom properties
- [ ] 1.3.4: Define typography custom properties
- [ ] 1.3.5: Define animation custom properties
- [ ] 1.3.6: Import globals.css in root layout
- [ ] 1.3.7: Test custom properties in browser DevTools

**CSS Custom Properties Template:**
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --color-primary: oklch(59% 0.22 264);
    --color-background: oklch(100% 0 0);
    --color-text: oklch(20% 0 0);
    
    /* Spacing (8-point grid) */
    --space-1: 0.5rem;  /* 8px */
    --space-2: 1rem;    /* 16px */
    --space-3: 1.5rem;  /* 24px */
    --space-4: 2rem;    /* 32px */
    
    /* Typography */
    --text-base: 1rem;      /* 16px */
    --text-lg: 1.125rem;    /* 18px */
    --text-xl: 1.313rem;    /* 21px */
    
    /* Animation */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
  }
  
  [data-theme="dark"] {
    --color-background: oklch(20% 0 0);
    --color-text: oklch(95% 0 0);
  }
}
```

**Definition of Done:**
- ✓ CSS custom properties defined
- ✓ Properties accessible in all components
- ✓ Can toggle between light/dark themes (even if toggle not built yet)

---

#### 1.4: Base Component Library

**Task:** Create foundational UI components

**Subtasks:**
- [ ] 1.4.1: Create `components/ui/Button.tsx` with 4 variants
- [ ] 1.4.2: Create `components/ui/Card.tsx` with hover states
- [ ] 1.4.3: Create `components/ui/Input.tsx` with validation states
- [ ] 1.4.4: Create `components/ui/Link.tsx` (accessible links)
- [ ] 1.4.5: Create `lib/utils.ts` with `cn()` helper function
- [ ] 1.4.6: Test all components render correctly
- [ ] 1.4.7: Test all components with keyboard navigation

**Button Component Requirements:**

```typescript
// components/ui/Button.tsx
/**
 * Button component with 4 variants:
 * - primary: Blue background, white text, for main CTAs
 * - secondary: White background, blue text, for secondary actions
 * - ghost: Transparent, blue text, for tertiary actions
 * - icon: Square, icon only, for utility actions
 * 
 * MUST meet:
 * - Minimum 44×44px touch target
 * - Keyboard accessible (focusable, activatable with Enter/Space)
 * - Visual focus indicator (2px outline, 2px offset)
 * - Hover state with spring physics (Framer Motion)
 * - Active state feedback
 * - Disabled state (lower opacity, no interactions)
 * - Loading state (spinner, disabled)
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  // Implementation with Framer Motion spring animation
}
```

**Card Component Requirements:**

```typescript
// components/ui/Card.tsx
/**
 * Card component with subtle interactions:
 * - Hover: translateY -4px, scale 1.01, shadow increase
 * - Press: translateY -2px (if clickable)
 * - Respects reduced motion (crossfade only)
 * 
 * Variants:
 * - default: White background, subtle border
 * - elevated: Shadow, no border
 * - interactive: Hover + press states
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive'
  children: React.ReactNode
}

export function Card({ variant = 'default', children, ...props }: CardProps) {
  // Implementation
}
```

**Definition of Done:**
- ✓ All 4 components built and exported
- ✓ Components accept proper TypeScript props
- ✓ All components keyboard navigable
- ✓ Focus indicators visible
- ✓ Hover animations smooth (60fps)
- ✓ Can import and use: `import { Button } from '@/components/ui/Button'`

---

#### 1.5: Animation Utilities Setup

**Task:** Configure Framer Motion for consistent animations

**Subtasks:**
- [ ] 1.5.1: Install Framer Motion: `npm install framer-motion`
- [ ] 1.5.2: Create animation constants file
- [ ] 1.5.3: Create reusable animation variants
- [ ] 1.5.4: Test animations respect reduced motion
- [ ] 1.5.5: Document animation usage in comments

**Animation Constants:**

```typescript
// lib/animations.ts
/**
 * Animation constants following iOS design principles
 * 
 * RULES:
 * - Only animate transform (translate, scale, rotate) and opacity
 * - Never animate width, height, margin, padding (triggers layout)
 * - Always provide reduced motion fallback
 * - Use spring physics for natural feel
 */

export const SPRING_PHYSICS = {
  stiffness: 300,  // How quickly animation responds
  damping: 20,     // How much bounce/overshoot
  mass: 0.8,       // Weight of animated element
}

export const DURATIONS = {
  instant: 0.1,   // 100ms - Hover states
  fast: 0.15,     // 150ms - Color changes
  normal: 0.25,   // 250ms - Most animations
  slow: 0.3,      // 300ms - iOS default
}

export const EASING = {
  easeOut: [0, 0, 0.2, 1],  // Decelerates at end
  easeIn: [0.4, 0, 1, 1],   // Accelerates at start
  easeInOut: [0.4, 0, 0.2, 1],  // Smooth both ends
}

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATIONS.normal, ease: EASING.easeOut },
}

export const scaleOnHover = {
  whileHover: { scale: 1.01, y: -4 },
  whileTap: { scale: 0.99, y: -2 },
  transition: { type: 'spring', ...SPRING_PHYSICS },
}
```

**Definition of Done:**
- ✓ Framer Motion installed
- ✓ Animation constants defined
- ✓ Test animation on Button component
- ✓ Reduced motion media query respected

---

#### 1.6: Development Environment Polish

**Task:** Set up development tooling for smooth workflow

**Subtasks:**
- [ ] 1.6.1: Configure Git pre-commit hooks (Husky)
- [ ] 1.6.2: Set up VS Code/Cursor settings.json
- [ ] 1.6.3: Create npm scripts for common tasks
- [ ] 1.6.4: Test full build pipeline: `npm run build`
- [ ] 1.6.5: Document development workflow in README

**Package.json Scripts:**

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test:a11y": "axe http://localhost:3000",
    "test:lighthouse": "lighthouse http://localhost:3000 --view",
    "pre-commit": "npm run lint && npm run type-check"
  }
}
```

**Definition of Done:**
- ✓ All npm scripts work
- ✓ Pre-commit hook runs (lint + type-check)
- ✓ README has clear setup instructions
- ✓ Development workflow documented

---

#### 1.7: Vercel Deployment Setup (Preview Only)

**Task:** Connect project to Vercel for preview deployments

**Subtasks:**
- [ ] 1.7.1: Create Vercel account (if needed)
- [ ] 1.7.2: Install Vercel CLI: `npm i -g vercel`
- [ ] 1.7.3: Link project: `vercel link`
- [ ] 1.7.4: Deploy to preview URL: `vercel`
- [ ] 1.7.5: Verify preview URL works
- [ ] 1.7.6: Document preview URL for client review

**IMPORTANT:** This is for **preview only**. Your live site on Render is **not touched**.

**Definition of Done:**
- ✓ Vercel account created
- ✓ Project deployed to preview URL
- ✓ Preview URL accessible
- ✓ Live site still running on Render (unchanged)

---

### Phase 1 Success Criteria

**Must pass ALL before proceeding to Phase 2:**

- [ ] ✓ Next.js 14 project running locally (`npm run dev` works)
- [ ] ✓ TypeScript compiles with zero errors
- [ ] ✓ Tailwind configured with custom design tokens
- [ ] ✓ CSS custom properties system working
- [ ] ✓ Base components built (Button, Card, Input, Link)
- [ ] ✓ All components keyboard accessible
- [ ] ✓ Focus indicators visible on all interactive elements
- [ ] ✓ Framer Motion animations working
- [ ] ✓ Reduced motion preference respected
- [ ] ✓ Git repository initialized with commits
- [ ] ✓ Vercel preview deployment working
- [ ] ✓ Documentation complete (README, .cursorrules)

**Validation Commands:**
```bash
npm run lint          # Must pass
npm run type-check    # Must pass
npm run build         # Must succeed
```

---

## Phase 2: Homepage Construction

**Goal:** Build the single most important page - where conversion happens

**Duration Estimate:** 2-3 weeks

### Phase 2 Overview

The homepage follows this structure (in order of appearance):

1. **Hero Section** - Immediate impact, clear CTAs
2. **Problem Section** - Articulate the pain points
3. **Solution Section** - Show how Applicreations solves them
4. **Services Section** - What we offer
5. **Pricing Section** - Clear tiers and starting points
6. **Social Proof Section** - Case studies and testimonials
7. **FAQ Section** - Address objections
8. **Final CTA Section** - Last chance to convert

---

### 2.1: Hero Section

**Task:** Create above-the-fold hero that passes 3-second test

**Subtasks:**
- [ ] 2.1.1: Create `components/sections/Hero.tsx`
- [ ] 2.1.2: Implement gradient background (subtle, doesn't compete)
- [ ] 2.1.3: Add headline (H1) with proper hierarchy
- [ ] 2.1.4: Add subheadline (value proposition)
- [ ] 2.1.5: Add dual CTAs (primary: "See Demo Site", secondary: "Get Instant Quote")
- [ ] 2.1.6: Add trust indicators below CTAs
- [ ] 2.1.7: Optimize for mobile (375px width)
- [ ] 2.1.8: Test LCP <2.5s

**Hero Copy (EXACT WORDING):**

```typescript
// components/sections/Hero.tsx

const HERO_CONTENT = {
  headline: "Professional Websites That Grow Your Delaware Business",
  subheadline: "You've outgrown Facebook. Your customers expect more. We build fast, beautiful websites that turn browsers into buyers.",
  
  primaryCTA: {
    text: "See Demo Site",
    href: "/demo", // Links to demo portfolio site
    ariaLabel: "View a live demo website built by Applicreations"
  },
  
  secondaryCTA: {
    text: "Get Instant Quote",
    href: "/quote",
    ariaLabel: "Get a price quote for your new website"
  },
  
  trustIndicators: [
    "15+ Years Serving Delaware",
    "50+ Websites Launched",
    "100% Delaware-Based Support"
  ]
}
```

**Design Specifications:**

- **Headline:** 
  - Mobile: 38px (--text-3xl), line-height 1.1, font-weight 700
  - Desktop: 51px (--text-4xl), line-height 1.1, font-weight 700
  - Color: --color-text (high contrast)
  
- **Subheadline:**
  - Mobile: 18px (--text-lg), line-height 1.5, font-weight 400
  - Desktop: 21px (--text-xl), line-height 1.5, font-weight 400
  - Color: --color-text-secondary (slightly lower contrast)
  - Max-width: 600px (for readability)
  
- **CTA Buttons:**
  - Primary: Blue background (--color-primary), white text, 56px height
  - Secondary: White background, blue border, blue text, 56px height
  - Min-width: 200px on desktop, 100% on mobile
  - Spacing between: 16px
  
- **Trust Indicators:**
  - Display as pills/badges below CTAs
  - Small text (14px), subtle background
  - Icons optional (checkmark or Delaware state outline)

**Layout:**

```
+------------------------------------------+
|                                          |
|           Professional Websites          |
|        That Grow Your Delaware Business  |
|                                          |
|  You've outgrown Facebook. Your          |
|  customers expect more. We build fast,   |
|  beautiful websites that turn browsers   |
|  into buyers.                            |
|                                          |
|  [  See Demo Site  ] [ Get Instant Quote ]
|                                          |
|  ✓ 15+ Years  ✓ 50+ Sites  ✓ DE-Based   |
|                                          |
+------------------------------------------+
```

**Definition of Done:**
- ✓ Hero renders on localhost
- ✓ All copy matches EXACT WORDING above
- ✓ Headline is semantic H1 tag
- ✓ Buttons keyboard accessible
- ✓ Buttons have hover/focus states
- ✓ Mobile responsive (text scales appropriately)
- ✓ LCP <2.5s (test with Lighthouse)
- ✓ No CLS (Cumulative Layout Shift = 0)

---

### 2.2: Problem Section

**Task:** Articulate the pain points Delaware businesses face

**Subtasks:**
- [ ] 2.2.1: Create `components/sections/Problems.tsx`
- [ ] 2.2.2: Create 4 problem cards
- [ ] 2.2.3: Add icons (inline SVG, no external requests)
- [ ] 2.2.4: Implement scroll-triggered fade-in animation (75ms stagger)
- [ ] 2.2.5: Add hover states (subtle lift)
- [ ] 2.2.6: Test reduced motion (crossfade only)
- [ ] 2.2.7: Verify mobile layout (cards stack vertically)

**Problem Section Copy (EXACT WORDING):**

```typescript
// components/sections/Problems.tsx

const SECTION_INTRO = {
  eyebrow: "The Problem",
  headline: "Your Business Deserves Better Than a Facebook Page",
  subheadline: "You're losing customers to competitors with real websites. Here's why:",
}

const PROBLEMS = [
  {
    icon: "search", // Magnifying glass icon
    title: "You're Invisible to Google",
    description: "Facebook posts don't show up in local searches. When customers search \"[your service] near me\", your competitors appear. You don't.",
    color: "--color-error" // Red accent
  },
  {
    icon: "trust", // Shield icon
    title: "You Look Less Professional",
    description: "Customers judge credibility in seconds. A Facebook page signals \"side hustle.\" A real website signals \"established business.\"",
    color: "--color-warning" // Amber accent
  },
  {
    icon: "control", // Lock icon
    title: "Facebook Owns Your Presence",
    description: "Algorithm changes kill your reach. Account restrictions lock you out. Facebook controls your business visibility—you don't.",
    color: "--color-error"
  },
  {
    icon: "growth", // Chart icon
    title: "You Can't Capture Leads",
    description: "No email list. No analytics. No way to retarget visitors. You're building on rented land with zero ownership of your customer relationships.",
    color: "--color-primary"
  },
]
```

**Design Specifications:**

- **Section Layout:**
  - Eyebrow: Small (12px), uppercase, letter-spacing 0.05em, blue color
  - Headline: 28px mobile / 38px desktop, font-weight 700
  - Subheadline: 18px, max-width 600px, centered
  - Grid: 2×2 on desktop (4 columns), 1 column on mobile
  
- **Problem Cards:**
  - Background: White (or dark mode equivalent)
  - Border: 1px subtle border
  - Border-radius: 12px (--radius-lg)
  - Padding: 32px (--space-4)
  - Icon: 48px size, colored per `color` prop
  - Title: 21px (--text-xl), font-weight 600
  - Description: 16px (--text-base), line-height 1.6
  - Min-height: Ensure equal height across row
  
- **Hover State:**
  - Transform: translateY(-4px)
  - Scale: 1.01
  - Shadow: Increase from subtle to medium
  - Transition: Spring physics (stiffness 300, damping 20)
  
- **Animation:**
  - Fade in from opacity 0 to 1
  - Translate from Y:20px to Y:0
  - Stagger: 75ms between cards
  - Trigger: When section enters viewport (intersection observer)

**Layout:**

```
+---------------------+---------------------+
| 🔍 You're Invisible | 🛡️ Less Professional|
| to Google           |                     |
|                     |                     |
| Facebook posts...   | Customers judge...  |
+---------------------+---------------------+
| 🔒 Facebook Owns    | 📈 Can't Capture    |
| Your Presence       | Leads               |
|                     |                     |
| Algorithm changes...| No email list...    |
+---------------------+---------------------+
```

**Definition of Done:**
- ✓ Section renders with all 4 cards
- ✓ Copy matches EXACT WORDING
- ✓ Icons display (inline SVG)
- ✓ Cards animate in on scroll
- ✓ Hover states work smoothly (60fps)
- ✓ Reduced motion: crossfade only (no Y movement)
- ✓ Mobile: cards stack, maintain min touch targets
- ✓ Screen reader reads cards in order

---

### 2.3: Solution Section

**Task:** Show how Applicreations solves the problems

**Subtasks:**
- [ ] 2.3.1: Create `components/sections/Solutions.tsx`
- [ ] 2.3.2: Create 3 solution cards mapping to problems
- [ ] 2.3.3: Add icons and subtle animations
- [ ] 2.3.4: Implement visual connection to problem section
- [ ] 2.3.5: Add "How It Works" mini-timeline
- [ ] 2.3.6: Test mobile layout

**Solution Section Copy (EXACT WORDING):**

```typescript
// components/sections/Solutions.tsx

const SECTION_INTRO = {
  eyebrow: "The Solution",
  headline: "A Website That Works as Hard as You Do",
  subheadline: "We build fast, search-optimized websites that turn visitors into customers.",
}

const SOLUTIONS = [
  {
    icon: "rocket", // Rocket icon
    title: "Show Up in Local Searches",
    description: "SEO-optimized from day one. We structure your site so Google understands your services and location. You appear when customers search.",
    benefit: "Get found by ready-to-buy customers",
    features: [
      "Delaware-focused local SEO",
      "Google Business integration",
      "Mobile-first design (most searches happen on phones)"
    ]
  },
  {
    icon: "diamond", // Diamond icon
    title: "Look Professional, Be Credible",
    description: "Custom design that reflects your brand. Professional photography placement. Customer testimonials. Every element builds trust.",
    benefit: "Win customers before they call",
    features: [
      "Modern, clean design",
      "Fast loading (under 2 seconds)",
      "Professional copy that converts"
    ]
  },
  {
    icon: "growth-chart", // Growth chart icon
    title: "Own Your Customer Relationships",
    description: "Built-in contact forms. Email capture. Analytics that show what's working. You own your data, your leads, your growth.",
    benefit: "Build a business, not just a following",
    features: [
      "Lead capture forms",
      "Email marketing integration",
      "Analytics dashboard"
    ]
  },
]

const HOW_IT_WORKS = {
  headline: "How It Works",
  steps: [
    {
      number: "01",
      title: "Quick Consultation",
      description: "15-minute call to understand your business, goals, and customers.",
      duration: "15 minutes"
    },
    {
      number: "02",
      title: "We Build Your Site",
      description: "Professional design, compelling copy, and technical optimization. You review and approve.",
      duration: "2-3 weeks"
    },
    {
      number: "03",
      title: "Launch & Grow",
      description: "We handle hosting, security, and updates. You focus on getting customers.",
      duration: "Ongoing"
    },
  ]
}
```

**Design Specifications:**

- **Solution Cards:**
  - Background: Subtle gradient or solid color (light blue tint)
  - Larger than problem cards (more content)
  - Icon: 64px, positioned top-left
  - Benefit: Callout box with accent color
  - Features: Bulleted list with checkmarks
  
- **How It Works Timeline:**
  - Horizontal on desktop, vertical on mobile
  - Connected by line (visual flow)
  - Step numbers: Large (48px), accent color
  - Duration tags: Small, subtle

**Layout:**

```
+----------------------------------------------------------+
|                                                          |
|              A Website That Works as Hard as You Do      |
|                                                          |
+----------------------------------------------------------+

+------------------+ +------------------+ +------------------+
| 🚀 Show Up in    | | 💎 Look          | | 📈 Own Your      |
| Local Searches   | | Professional     | | Relationships    |
|                  | |                  | |                  |
| SEO-optimized... | | Custom design... | | Built-in forms...|
|                  | |                  | |                  |
| ✓ Local SEO      | | ✓ Modern design  | | ✓ Lead capture   |
| ✓ Google Biz     | | ✓ Fast loading   | | ✓ Email marketing|
| ✓ Mobile-first   | | ✓ Pro copy       | | ✓ Analytics      |
+------------------+ +------------------+ +------------------+

                        How It Works
        
        01                  02                  03
   Quick Consult ──────> We Build ──────> Launch & Grow
   (15 minutes)          (2-3 weeks)        (Ongoing)
```

**Definition of Done:**
- ✓ Section renders with all 3 solution cards
- ✓ Copy matches EXACT WORDING
- ✓ Features displayed as checkmarked list
- ✓ "How It Works" timeline displays correctly
- ✓ Timeline connected visually (line between steps)
- ✓ Mobile: timeline stacks vertically
- ✓ Animations smooth (if any)

---

### 2.4: Services Section

**Task:** Detail what Applicreations offers

**Subtasks:**
- [ ] 2.4.1: Create `components/sections/Services.tsx`
- [ ] 2.4.2: Create expandable service cards OR grid layout
- [ ] 2.4.3: Add service icons
- [ ] 2.4.4: Implement expand/collapse if accordion
- [ ] 2.4.5: Add "Learn More" links
- [ ] 2.4.6: Test mobile interaction

**Services Section Copy (EXACT WORDING):**

```typescript
// components/sections/Services.tsx

const SECTION_INTRO = {
  eyebrow: "Services",
  headline: "Everything You Need to Succeed Online",
  subheadline: "From design to hosting, we handle the tech so you can focus on your business.",
}

const SERVICES = [
  {
    id: "web-design",
    icon: "palette",
    title: "Custom Website Design",
    shortDescription: "Unique design that reflects your brand and converts visitors.",
    fullDescription: "We don't use templates. Every website is custom-designed to match your brand, appeal to your customers, and achieve your goals. Mobile-responsive, fast-loading, and built for conversion.",
    included: [
      "Custom design (no templates)",
      "Mobile-responsive layout",
      "Professional copywriting",
      "Stock photography included",
      "Up to 5-10 pages",
    ],
    learnMoreHref: "/services/web-design"
  },
  {
    id: "seo",
    icon: "search-chart",
    title: "Delaware Local SEO",
    shortDescription: "Get found by customers searching for your services in Delaware.",
    fullDescription: "We optimize your site for Delaware local searches. Google Business integration, location pages, schema markup, and content strategy to rank for terms that matter to your business.",
    included: [
      "Keyword research (Delaware-focused)",
      "On-page SEO optimization",
      "Google Business Profile setup",
      "Local citation building",
      "Monthly performance reports",
    ],
    learnMoreHref: "/services/seo"
  },
  {
    id: "hosting",
    icon: "server",
    title: "Hosting & Maintenance",
    shortDescription: "Fast, secure hosting with automatic updates and daily backups.",
    fullDescription: "We handle the technical stuff: hosting, security, updates, backups. Your site stays fast, secure, and up-to-date. Includes SSL certificate and 99.9% uptime guarantee.",
    included: [
      "Fast edge hosting (Vercel)",
      "SSL certificate (HTTPS)",
      "Daily automated backups",
      "Security monitoring",
      "Software updates",
    ],
    learnMoreHref: "/services/hosting"
  },
  {
    id: "support",
    icon: "headset",
    title: "Ongoing Support",
    shortDescription: "Phone and email support from a real person in Delaware.",
    fullDescription: "Need a change? Have a question? Call or email us. Real human support based in Delaware. We respond within 24 hours on business days.",
    included: [
      "Phone & email support",
      "Content updates (text, images)",
      "Training on managing your site",
      "Strategic consulting",
      "Priority response times",
    ],
    learnMoreHref: "/services/support"
  },
]
```

**Design Options:**

**Option A: Accordion (Recommended for Phase 2)**
- All services visible as collapsed cards
- Click/tap to expand and see `fullDescription` + `included` list
- Only one expanded at a time (better focus)

**Option B: Grid (Alternative)**
- 2×2 grid on desktop, 1 column mobile
- Show `shortDescription` on card
- "Learn More" button goes to detail page (Phase 3)

**Design Specifications:**

- **Service Card (Collapsed):**
  - Icon: 48px, accent color
  - Title: 21px, font-weight 600
  - Short description: 16px
  - Expand icon: Chevron down (rotates when expanded)
  
- **Service Card (Expanded):**
  - Full description: 16px, line-height 1.6
  - Included list: Checkmark bullets
  - Learn More link: Blue, underline on hover
  - Smooth expand animation (height auto, 250ms ease-out)

**Layout (Accordion):**

```
+--------------------------------------------------+
| 🎨 Custom Website Design                      ▼ |
| Unique design that reflects your brand...        |
+--------------------------------------------------+

+--------------------------------------------------+
| 🔍 Delaware Local SEO                          ▼ |
| Get found by customers searching...              |
+--------------------------------------------------+

+--------------------------------------------------+
| 🖥️ Hosting & Maintenance                       ▼ |
| Fast, secure hosting with automatic...           |
+--------------------------------------------------+

+--------------------------------------------------+
| 🎧 Ongoing Support                             ▼ |
| Phone and email support from a real...           |
+--------------------------------------------------+

[When expanded:]
+--------------------------------------------------+
| 🎨 Custom Website Design                      ▲ |
| Unique design that reflects your brand...        |
|                                                  |
| We don't use templates. Every website is         |
| custom-designed to match your brand...           |
|                                                  |
| Included:                                        |
| ✓ Custom design (no templates)                   |
| ✓ Mobile-responsive layout                       |
| ✓ Professional copywriting                       |
| ✓ Stock photography included                     |
| ✓ Up to 5-10 pages                               |
|                                                  |
| [Learn More]                                     |
+--------------------------------------------------+
```

**Definition of Done:**
- ✓ Section renders with all 4 services
- ✓ Copy matches EXACT WORDING
- ✓ Accordion expands/collapses smoothly
- ✓ Only one service expanded at a time
- ✓ Keyboard accessible (Enter/Space to toggle)
- ✓ Screen reader announces expanded/collapsed state
- ✓ Mobile: accordion works with touch
- ✓ Icons display correctly

---

### 2.5: Pricing Section

**Task:** Present clear pricing tiers

**Subtasks:**
- [ ] 2.5.1: Create `components/sections/Pricing.tsx`
- [ ] 2.5.2: Create 2-3 pricing tier cards
- [ ] 2.5.3: Add "Most Popular" badge to recommended tier
- [ ] 2.5.4: Add feature comparison list
- [ ] 2.5.5: Add prominent CTAs per tier
- [ ] 2.5.6: Add pricing disclaimer/notes
- [ ] 2.5.7: Test mobile layout (cards stack)

**Pricing Section Copy (EXACT WORDING):**

```typescript
// components/sections/Pricing.tsx

const SECTION_INTRO = {
  eyebrow: "Pricing",
  headline: "Transparent Pricing. No Surprises.",
  subheadline: "Choose the package that fits your business. All packages include hosting, SSL, and support.",
}

const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for service businesses getting online",
    price: {
      setup: "$2,500",
      monthly: "$99",
    },
    recommended: false,
    features: [
      "5-page custom website",
      "Mobile-responsive design",
      "Contact form",
      "Basic SEO setup",
      "Fast hosting & SSL",
      "30 days of support",
    ],
    cta: {
      text: "Get Started",
      href: "/quote?tier=starter"
    }
  },
  {
    id: "professional",
    name: "Professional",
    description: "Most popular for growing Delaware businesses",
    price: {
      setup: "$4,500",
      monthly: "$149",
    },
    recommended: true, // Show "Most Popular" badge
    features: [
      "Up to 10 pages",
      "Custom design & copywriting",
      "Advanced contact forms",
      "Delaware local SEO",
      "Google Business integration",
      "Image optimization",
      "90 days of support",
      "Monthly analytics reports",
    ],
    cta: {
      text: "Get Started",
      href: "/quote?tier=professional"
    }
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "For businesses selling products online",
    price: {
      setup: "Starting at $7,500",
      monthly: "$249",
    },
    recommended: false,
    features: [
      "Online store with checkout",
      "Product catalog (up to 100 products)",
      "Payment processing (Stripe)",
      "Inventory management",
      "Customer accounts",
      "Order management dashboard",
      "Everything in Professional",
      "Priority support",
    ],
    cta: {
      text: "Get Started",
      href: "/quote?tier=ecommerce"
    }
  },
]

const PRICING_NOTES = [
  "Setup fee is one-time. Monthly fee includes hosting, updates, and support.",
  "All prices include Delaware local focus and optimization.",
  "Custom projects and enterprise solutions available—contact us for quote.",
]

const FAQ_PROMPT = {
  text: "Have questions about pricing?",
  linkText: "Check our FAQ",
  linkHref: "#faq"
}
```

**Design Specifications:**

- **Tier Card:**
  - Background: White (or elevated with shadow)
  - Border: 2px solid (recommended tier: blue, others: gray)
  - Border-radius: 12px
  - Padding: 32px
  - Min-height: Match tallest card
  
- **Recommended Badge:**
  - Position: Absolute top-right of card
  - Background: Blue gradient
  - Text: "Most Popular", white, 12px, uppercase
  - Border-radius: 16px
  
- **Price Display:**
  - Setup: Large (38px), font-weight 700
  - Monthly: Below setup, 21px, color secondary
  - Format: "$X,XXX setup + $XX/month"
  
- **Features List:**
  - Checkmark bullets (blue)
  - 16px text
  - Line-height 1.8 (breathing room)
  
- **CTA Button:**
  - Full-width on mobile
  - Primary variant
  - 56px height (comfortable touch target)

**Layout:**

```
+------------------+ +------------------+ +------------------+
| Starter          | | Professional     | | E-Commerce       |
|                  | | [Most Popular]   | |                  |
| Perfect for      | | Most popular for | | For businesses   |
| service...       | | growing DE...    | | selling...       |
|                  | |                  | |                  |
| $2,500 setup     | | $4,500 setup     | | Starting at      |
| $99/month        | | $149/month       | | $7,500 setup     |
|                  | |                  | | $249/month       |
| ✓ 5-page site    | | ✓ Up to 10 pages | | ✓ Online store   |
| ✓ Mobile design  | | ✓ Custom design  | | ✓ Payment proc.  |
| ✓ Contact form   | | ✓ Advanced forms | | ✓ Inventory      |
| ✓ Basic SEO      | | ✓ Delaware SEO   | | ✓ Everything in  |
| ✓ Hosting & SSL  | | ✓ Google Biz     | |   Professional   |
| ✓ 30d support    | | ✓ 90d support    | | ✓ Priority       |
|                  | |                  | |                  |
| [Get Started]    | | [Get Started]    | | [Get Started]    |
+------------------+ +------------------+ +------------------+

Notes:
• Setup fee is one-time. Monthly includes hosting & support.
• All prices include Delaware local focus.
• Custom projects available—contact us.

Have questions? Check our FAQ
```

**Definition of Done:**
- ✓ Section renders with all 3 tiers
- ✓ Copy matches EXACT WORDING
- ✓ Prices displayed correctly
- ✓ "Most Popular" badge on Professional tier
- ✓ Feature lists match across tiers
- ✓ CTA buttons link to correct URLs
- ✓ Mobile: cards stack vertically, remain scannable
- ✓ Pricing notes visible at bottom

---

### 2.6: Social Proof Section

**Task:** Show case studies and testimonials

**Subtasks:**
- [ ] 2.6.1: Create `components/sections/SocialProof.tsx`
- [ ] 2.6.2: Create 2-3 case study cards
- [ ] 2.6.3: Add case study images (optimized <100KB each)
- [ ] 2.6.4: Create testimonial cards (3-5 quotes)
- [ ] 2.6.5: Add client logos (if available)
- [ ] 2.6.6: Implement image lazy loading
- [ ] 2.6.7: Test mobile layout

**Social Proof Section Copy (EXACT WORDING):**

```typescript
// components/sections/SocialProof.tsx

const SECTION_INTRO = {
  eyebrow: "Case Studies",
  headline: "Real Results for Delaware Businesses",
  subheadline: "See how we've helped businesses like yours grow online.",
}

const CASE_STUDIES = [
  {
    id: "delaware-hvac",
    client: "Delaware HVAC Company",
    industry: "Home Services",
    image: "/images/case-study-hvac.jpg",
    imageAlt: "Modern HVAC website on laptop and mobile",
    challenge: "Relying solely on word-of-mouth and Facebook. No Google visibility. Lost leads to competitors with websites.",
    solution: "Custom 7-page website with Delaware local SEO. Service area pages for each county. Google Business integration.",
    results: [
      "300% increase in quote requests",
      "Ranking #1 for \"HVAC repair [city]\"",
      "Reduced cost per lead by 60%",
    ],
    metrics: {
      primary: "300%",
      primaryLabel: "More Leads",
      secondary: "#1",
      secondaryLabel: "Google Ranking",
    },
    cta: {
      text: "View Full Case Study",
      href: "/portfolio/delaware-hvac"
    }
  },
  {
    id: "delaware-law-firm",
    client: "Delaware Law Firm",
    industry: "Legal Services",
    image: "/images/case-study-law.jpg",
    imageAlt: "Professional law firm website design",
    challenge: "Outdated website from 2012. Not mobile-friendly. No way to capture leads online.",
    solution: "Complete redesign with modern aesthetic. Practice area pages with SEO. Secure contact forms with intake questionnaire.",
    results: [
      "250% increase in consultation requests",
      "Mobile traffic up 400%",
      "50+ new clients from website in first year",
    ],
    metrics: {
      primary: "50+",
      primaryLabel: "New Clients",
      secondary: "250%",
      secondaryLabel: "More Consults",
    },
    cta: {
      text: "View Full Case Study",
      href: "/portfolio/delaware-law-firm"
    }
  },
  // Add 3rd case study if you have one
]

const TESTIMONIALS_INTRO = {
  headline: "What Our Clients Say",
}

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    quote: "Within 3 months of launching our new site, we were ranking on the first page of Google. The phone hasn't stopped ringing since.",
    author: "Mike R.",
    business: "Dover-based contractor",
    image: "/images/testimonials/mike-r.jpg", // Optional
    rating: 5,
  },
  {
    id: "testimonial-2",
    quote: "I was skeptical about moving away from Facebook, but the results speak for themselves. We get higher-quality leads and actually own our customer data now.",
    author: "Sarah L.",
    business: "Wilmington retail shop",
    image: "/images/testimonials/sarah-l.jpg",
    rating: 5,
  },
  {
    id: "testimonial-3",
    quote: "The best part is the support. I can call and talk to a real person in Delaware who actually understands my business. No outsourced call centers.",
    author: "James T.",
    business: "Newark service business",
    image: "/images/testimonials/james-t.jpg",
    rating: 5,
  },
  // Add 2 more if you have them
]
```

**Design Specifications:**

**Case Study Card:**
- Image: Top, 16:9 aspect ratio, cover entire width
- Content: Padding 32px
- Challenge/Solution/Results: Sections with clear labels
- Results: Bulleted list with checkmarks
- Metrics: Large numbers (48px) with labels, accent color
- CTA: Secondary button, bottom of card

**Testimonial Card:**
- Quote: 18px, italic, line-height 1.6
- Author: 16px, font-weight 600
- Business: 14px, color secondary
- Rating: 5 stars, yellow/gold color
- Border-left: 4px accent color (quote aesthetic)

**Layout:**

```
Case Studies:

+--------------------------------------------------+
| [Image: HVAC Website]                            |
+--------------------------------------------------+
| Delaware HVAC Company                            |
| Home Services                                    |
|                                                  |
| Challenge: Relying on Facebook, no Google...    |
| Solution: Custom website with local SEO...      |
| Results:                                         |
| ✓ 300% increase in quotes                        |
| ✓ #1 ranking for "HVAC repair"                   |
| ✓ 60% lower cost per lead                        |
|                                                  |
|      300%              #1                        |
|   More Leads      Google Ranking                |
|                                                  |
| [View Full Case Study]                           |
+--------------------------------------------------+

Testimonials:

+------------------------+ +------------------------+
| "Within 3 months..."   | | "I was skeptical..."   |
|                        | |                        |
| ⭐⭐⭐⭐⭐                | | ⭐⭐⭐⭐⭐                |
|                        | |                        |
| Mike R.                | | Sarah L.               |
| Dover contractor       | | Wilmington retail      |
+------------------------+ +------------------------+
```

**Definition of Done:**
- ✓ Section renders with 2-3 case studies
- ✓ Copy matches EXACT WORDING
- ✓ Case study images load (optimized)
- ✓ Results metrics prominently displayed
- ✓ Testimonials render with quotes
- ✓ Star ratings display
- ✓ Mobile: case studies stack, images maintain ratio
- ✓ All images have alt text (accessibility)

---

### 2.7: FAQ Section

**Task:** Address common objections and questions

**Subtasks:**
- [ ] 2.7.1: Create `components/sections/FAQ.tsx`
- [ ] 2.7.2: Implement accordion component (reuse from Services)
- [ ] 2.7.3: Add 8-10 FAQs with answers
- [ ] 2.7.4: Add search/filter (optional, if >10 questions)
- [ ] 2.7.5: Test keyboard navigation (Tab, Enter, Arrow keys)
- [ ] 2.7.6: Verify screen reader announces expanded/collapsed

**FAQ Section Copy (EXACT WORDING):**

```typescript
// components/sections/FAQ.tsx

const SECTION_INTRO = {
  eyebrow: "FAQ",
  headline: "Frequently Asked Questions",
  subheadline: "Everything you need to know about working with Applicreations.",
}

const FAQS = [
  {
    id: "faq-1",
    question: "How long does it take to build my website?",
    answer: "Most websites are completed in 2-3 weeks from the initial consultation to launch. E-commerce sites may take 4-6 weeks depending on complexity. We'll give you a detailed timeline during your consultation.",
  },
  {
    id: "faq-2",
    question: "What if I already have a website?",
    answer: "No problem! We can redesign your existing site or build something completely new. We'll analyze your current site, identify what's working and what's not, and create a plan for improvement. We can also migrate your content and maintain your existing URLs to preserve SEO.",
  },
  {
    id: "faq-3",
    question: "Do you work with businesses outside of Delaware?",
    answer: "While we specialize in Delaware businesses and Delaware local SEO, we do work with clients outside the state. However, our expertise is in helping Delaware-based businesses compete locally. If you're outside Delaware, we'll make sure our approach still fits your market.",
  },
  {
    id: "faq-4",
    question: "Can I update the website myself?",
    answer: "Yes! We build sites on easy-to-use platforms and provide training so you can make simple updates (text, images, blog posts). For more complex changes, we're here to help as part of your monthly support plan.",
  },
  {
    id: "faq-5",
    question: "What's included in the monthly fee?",
    answer: "Your monthly fee includes: fast hosting, SSL certificate (HTTPS), daily backups, security monitoring, software updates, technical support, and content updates (varies by plan). You never have to worry about the technical side—we handle it all.",
  },
  {
    id: "faq-6",
    question: "What if I want to cancel?",
    answer: "No long-term contracts. You can cancel anytime with 30 days notice. If you cancel, we'll provide you with a backup of your site and help transition to another host if needed. You own your content and domain name—we'll never hold it hostage.",
  },
  {
    id: "faq-7",
    question: "Do I need to provide photos and content?",
    answer: "Not necessarily. We include professional copywriting in all packages and stock photography where needed. If you have your own photos and content, great—we'll use them. If not, we'll create everything for you.",
  },
  {
    id: "faq-8",
    question: "How do you handle SEO?",
    answer: "SEO is built into every website we create. We research keywords your customers are searching for, optimize your pages for those terms, structure your site correctly for Google, and integrate with Google Business. For the Professional and E-Commerce packages, we provide ongoing SEO with monthly reports.",
  },
  {
    id: "faq-9",
    question: "What if I need help after my site launches?",
    answer: "We're here for you! All plans include ongoing support via phone and email. Professional and E-Commerce plans get priority response times. Need a change? Have a question? Just call or email us—we respond within 24 hours on business days.",
  },
  {
    id: "faq-10",
    question: "Why shouldn't I just use Wix, Squarespace, or GoDaddy Website Builder?",
    answer: "Those platforms are fine for hobby sites, but they have limitations: slower loading speeds (bad for SEO), limited customization, monthly fees that add up, no Delaware-focused local SEO, and no personal support. We build custom sites optimized for speed, SEO, and conversion—plus you get a Delaware-based expert to call when you need help.",
  },
]

const FAQ_CTA = {
  text: "Still have questions?",
  linkText: "Contact us",
  linkHref: "/contact"
}
```

**Design Specifications:**

**FAQ Accordion:**
- Same component as Services section
- Question: 18px, font-weight 600, clickable
- Answer: 16px, line-height 1.6, padding-left for indent
- Expand icon: Chevron right (rotates down when open)
- Allow multiple open at once (unlike Services where only one opens)

**Layout:**

```
+--------------------------------------------------+
| How long does it take to build my website?    ▼ |
+--------------------------------------------------+

+--------------------------------------------------+
| What if I already have a website?             ▼ |
+--------------------------------------------------+

+--------------------------------------------------+
| Do you work with businesses outside Delaware? ▼ |
+--------------------------------------------------+

[... more questions ...]

[When expanded:]
+--------------------------------------------------+
| How long does it take to build my website?    ▲ |
|                                                  |
| Most websites are completed in 2-3 weeks from    |
| the initial consultation to launch. E-commerce   |
| sites may take 4-6 weeks...                      |
+--------------------------------------------------+

Still have questions? Contact us
```

**Definition of Done:**
- ✓ Section renders with all 10 FAQs
- ✓ Copy matches EXACT WORDING
- ✓ Accordion expands/collapses smoothly
- ✓ Multiple FAQs can be open simultaneously
- ✓ Keyboard accessible (Tab to navigate, Enter/Space to toggle)
- ✓ Screen reader announces question + expanded/collapsed state
- ✓ Mobile: questions remain readable, touch targets adequate
- ✓ Contact CTA visible at bottom

---

### 2.8: Final CTA Section

**Task:** Create last conversion opportunity

**Subtasks:**
- [ ] 2.8.1: Create `components/sections/FinalCTA.tsx`
- [ ] 2.8.2: Add compelling headline and subheadline
- [ ] 2.8.3: Add dual CTAs (same as hero)
- [ ] 2.8.4: Add urgency/scarcity element (if applicable)
- [ ] 2.8.5: Test mobile layout

**Final CTA Section Copy (EXACT WORDING):**

```typescript
// components/sections/FinalCTA.tsx

const FINAL_CTA_CONTENT = {
  headline: "Ready to Grow Your Business Online?",
  subheadline: "Join 50+ Delaware businesses who chose a professional website over a Facebook page.",
  
  primaryCTA: {
    text: "See Demo Site",
    href: "/demo",
    ariaLabel: "View a live demo website built by Applicreations"
  },
  
  secondaryCTA: {
    text: "Get Instant Quote",
    href: "/quote",
    ariaLabel: "Get a price quote for your new website"
  },
  
  // Optional: Urgency element (use sparingly, only if true)
  urgency: {
    show: false, // Set to true only if there's a real offer
    text: "Limited slots available for Q4 2025 projects",
  },
  
  trustReinforcement: [
    "15+ years serving Delaware",
    "No long-term contracts",
    "100% satisfaction guarantee",
  ],
}
```

**Design Specifications:**

- **Background:** Gradient or solid blue (stands out from rest of page)
- **Text color:** White (high contrast on blue background)
- **Headline:** 38px, font-weight 700, centered
- **Subheadline:** 21px, max-width 600px, centered
- **CTAs:** Same as hero section (56px height, comfortable spacing)
- **Trust elements:** Small, subtle, below CTAs

**Layout:**

```
+--------------------------------------------------+
|                                                  |
|          Ready to Grow Your Business Online?     |
|                                                  |
|  Join 50+ Delaware businesses who chose a        |
|  professional website over a Facebook page.      |
|                                                  |
|  [  See Demo Site  ] [ Get Instant Quote ]       |
|                                                  |
|  ✓ 15+ years  ✓ No contracts  ✓ 100% guarantee  |
|                                                  |
+--------------------------------------------------+
```

**Definition of Done:**
- ✓ Section renders with correct copy
- ✓ Copy matches EXACT WORDING
- ✓ CTAs same as hero (consistency)
- ✓ Background provides visual separation
- ✓ Mobile: text remains readable, CTAs stack if needed
- ✓ High contrast (WCAG AA: 4.5:1 minimum)

---

### Phase 2 Completion Checklist

**Before proceeding to Phase 3, verify ALL:**

#### Functional Requirements
- [ ] ✓ All 8 homepage sections render correctly
- [ ] ✓ All copy matches EXACT WORDING from this document
- [ ] ✓ All CTAs link to correct destinations
- [ ] ✓ All forms validate inputs (if any forms present)
- [ ] ✓ All accordions expand/collapse smoothly
- [ ] ✓ All animations respect reduced motion preference
- [ ] ✓ All images optimized (<100KB each)
- [ ] ✓ All images have descriptive alt text

#### Responsive Design
- [ ] ✓ Tested on 375px width (mobile)
- [ ] ✓ Tested on 768px width (tablet)
- [ ] ✓ Tested on 1280px width (laptop)
- [ ] ✓ Tested on 1920px width (desktop)
- [ ] ✓ All touch targets ≥44×44px on mobile
- [ ] ✓ All text readable at all sizes
- [ ] ✓ No horizontal scroll at any width

#### Performance
- [ ] ✓ Run `npm run build` → succeeds
- [ ] ✓ Run Lighthouse → Performance ≥90
- [ ] ✓ Run Lighthouse → Accessibility ≥95
- [ ] ✓ Run Lighthouse → Best Practices ≥95
- [ ] ✓ Run Lighthouse → SEO ≥95
- [ ] ✓ LCP <2.5s (check Core Web Vitals)
- [ ] ✓ Total JavaScript bundle <200KB gzipped
- [ ] ✓ No console errors in browser DevTools

#### Accessibility
- [ ] ✓ All interactive elements keyboard accessible
- [ ] ✓ Tab order logical (top to bottom, left to right)
- [ ] ✓ Focus indicators visible (2px outline)
- [ ] ✓ All form inputs have labels
- [ ] ✓ All images have alt attributes
- [ ] ✓ Color contrast ≥4.5:1 (text)
- [ ] ✓ Run axe DevTools → zero violations
- [ ] ✓ Test with screen reader (NVDA or JAWS) → reads correctly

#### Browser Testing
- [ ] ✓ Chrome (latest)
- [ ] ✓ Safari (latest)
- [ ] ✓ Firefox (latest)
- [ ] ✓ Edge (latest)

#### Client Approval
- [ ] ✓ Client reviews homepage on preview URL
- [ ] ✓ Client approves copy and design
- [ ] ✓ Client approves pricing
- [ ] ✓ Client approves case studies/testimonials
- [ ] ✓ Get written sign-off before Phase 3

**Launch Gate:** Cannot proceed to Phase 3 unless ALL items checked ✓

---

## Phase 3: Supporting Pages

**Goal:** Flesh out the website with necessary supporting content

**Duration Estimate:** 2-3 weeks

### Overview

Phase 3 builds out the pages linked from the homepage:

1. **Services Detail Pages** - Expanded service descriptions
2. **Portfolio/Case Studies** - Individual case study pages
3. **About Page** - Company story and values
4. **Contact Page** - Contact form and information
5. **Legal Pages** - Privacy, Terms, etc.

---

### 3.1: Services Detail Pages

**Task:** Create individual pages for each service

**Subtasks:**
- [ ] 3.1.1: Create `app/services/[slug]/page.tsx` (dynamic route)
- [ ] 3.1.2: Build service detail template
- [ ] 3.1.3: Add process timeline for each service
- [ ] 3.1.4: Add package comparison table
- [ ] 3.1.5: Add service-specific FAQ
- [ ] 3.1.6: Add CTA at bottom
- [ ] 3.1.7: Test all 4 service pages

**Services Detail Copy Structure:**

Each service page follows this template:

```typescript
// Example: /services/web-design

const SERVICE_PAGE_CONTENT = {
  hero: {
    headline: "Custom Website Design",
    subheadline: "Unique, professional websites that turn visitors into customers.",
    breadcrumb: "Services / Web Design",
  },
  
  overview: {
    description: "We don't use templates. Every website we build is custom-designed to match your brand, appeal to your target customers, and achieve your specific business goals. Our websites are mobile-responsive, fast-loading, and built for conversion.",
    benefits: [
      "Stand out from competitors using generic templates",
      "Reflect your unique brand identity",
      "Optimized for your target audience",
      "Built for speed and search engines",
    ]
  },
  
  process: {
    headline: "Our Design Process",
    steps: [
      {
        number: "01",
        title: "Discovery",
        description: "We learn about your business, target customers, and goals. We research your competitors and industry to inform our design strategy.",
        duration: "1-2 days",
      },
      {
        number: "02",
        title: "Design Concepts",
        description: "We create initial design concepts for your review. You provide feedback, and we refine until you're thrilled with the direction.",
        duration: "3-5 days",
      },
      {
        number: "03",
        title: "Build & Refine",
        description: "We build your site using modern technology, add your content, and optimize for speed and search engines. You review and approve.",
        duration: "1-2 weeks",
      },
      {
        number: "04",
        title: "Launch & Support",
        description: "We launch your site, monitor for issues, and provide training. Your ongoing support plan keeps everything running smoothly.",
        duration: "Ongoing",
      },
    ]
  },
  
  packages: {
    headline: "Web Design Packages",
    // Reference pricing from Phase 2
    tiers: PRICING_TIERS, // Import from Phase 2
  },
  
  faq: {
    headline: "Web Design FAQ",
    questions: [
      {
        question: "Can I see my site before it launches?",
        answer: "Absolutely! We provide a staging URL where you can preview your site at any time during development. You'll approve the final version before we make it live.",
      },
      {
        question: "What if I don't like the design?",
        answer: "We include revisions in all packages. We'll work with you until you're happy with the design. Our goal is your complete satisfaction.",
      },
      // ... more service-specific FAQs
    ]
  },
  
  cta: {
    headline: "Ready to Get Started?",
    primaryCTA: {
      text: "Get Instant Quote",
      href: "/quote?service=web-design"
    },
    secondaryCTA: {
      text: "See Demo Site",
      href: "/demo"
    }
  },
}
```

**Definition of Done (Per Service Page):**
- ✓ Page renders at `/services/[service-name]`
- ✓ All sections present (hero, overview, process, packages, FAQ, CTA)
- ✓ Copy accurate and approved by client
- ✓ Process timeline displays correctly
- ✓ Package comparison links to pricing
- ✓ Service-specific FAQ relevant
- ✓ Mobile responsive
- ✓ SEO meta tags set (title, description)

**Repeat for all 4 services:**
1. `/services/web-design`
2. `/services/seo`
3. `/services/hosting`
4. `/services/support`

---

### 3.2: Portfolio & Case Studies

**Task:** Create portfolio grid and individual case study pages

**Subtasks:**
- [ ] 3.2.1: Create `app/portfolio/page.tsx` (grid view)
- [ ] 3.2.2: Implement filter by industry
- [ ] 3.2.3: Create `app/portfolio/[slug]/page.tsx` (case study detail)
- [ ] 3.2.4: Build case study template
- [ ] 3.2.5: Add before/after images (if available)
- [ ] 3.2.6: Add metrics and results prominently
- [ ] 3.2.7: Add "View Live Site" link (if client permits)
- [ ] 3.2.8: Test all case study pages

**Portfolio Grid Structure:**

```typescript
// app/portfolio/page.tsx

const PORTFOLIO_INTRO = {
  headline: "Our Work",
  subheadline: "Real websites for real Delaware businesses.",
}

const FILTER_OPTIONS = [
  "All",
  "Home Services",
  "Legal",
  "Retail",
  "Restaurants",
  "Professional Services",
]

const PORTFOLIO_ITEMS = [
  {
    id: "delaware-hvac",
    title: "Delaware HVAC Company",
    industry: "Home Services",
    thumbnail: "/images/portfolio/hvac-thumb.jpg",
    description: "Modern website with local SEO for Sussex County HVAC company",
    metrics: {
      primary: "300%",
      primaryLabel: "More Leads",
    },
    href: "/portfolio/delaware-hvac"
  },
  // ... more portfolio items
]
```

**Case Study Detail Template:**

```typescript
// app/portfolio/[slug]/page.tsx

const CASE_STUDY_TEMPLATE = {
  client: "Delaware HVAC Company",
  industry: "Home Services",
  location: "Sussex County, DE",
  projectDate: "June 2024",
  
  hero: {
    headline: "Delaware HVAC Company",
    subheadline: "300% increase in quote requests with modern website and local SEO",
    featuredImage: "/images/portfolio/hvac-hero.jpg",
  },
  
  overview: {
    challenge: "This established HVAC company was relying solely on word-of-mouth referrals and a Facebook page. They had zero visibility on Google, which meant they were losing business to competitors with websites. Emergency service calls were hard to track, and they had no way to capture leads for follow-up.",
    
    solution: "We built a custom 7-page website optimized for Delaware local SEO, with separate service pages for each major city in their coverage area. We integrated their Google Business Profile, set up conversion-optimized contact forms, and implemented a click-to-call system for emergency services.",
    
    results: [
      "300% increase in quote requests within 3 months",
      "Ranking #1 for 'HVAC repair [city]' across 5 Delaware cities",
      "Reduced cost per lead by 60% compared to paid ads",
      "Average of 25 website leads per month (vs 3 from Facebook)",
    ],
  },
  
  images: {
    beforeAfter: {
      before: "/images/portfolio/hvac-before.jpg",
      after: "/images/portfolio/hvac-after.jpg",
      caption: "From generic Facebook page to professional website",
    },
    gallery: [
      "/images/portfolio/hvac-homepage.jpg",
      "/images/portfolio/hvac-services.jpg",
      "/images/portfolio/hvac-contact.jpg",
    ],
  },
  
  testimonial: {
    quote: "Within 3 months of launching our new site, we were ranking on the first page of Google. The phone hasn't stopped ringing since. Best investment we've made in years.",
    author: "Mike R.",
    title: "Owner, Delaware HVAC Company",
  },
  
  techDetails: {
    // Optional technical info
    built: "Next.js 14, Tailwind CSS",
    features: [
      "Local SEO optimization",
      "Google Business integration",
      "Emergency contact system",
      "Service area pages",
      "Mobile-first design",
    ],
  },
  
  cta: {
    headline: "Ready for Similar Results?",
    primaryCTA: {
      text: "Get Instant Quote",
      href: "/quote"
    },
    secondaryCTA: {
      text: "View More Work",
      href: "/portfolio"
    }
  },
}
```

**Definition of Done:**
- ✓ Portfolio grid renders at `/portfolio`
- ✓ Filter by industry works
- ✓ Each case study has dedicated page
- ✓ All case study images optimized (<100KB)
- ✓ Before/after comparisons visible (if available)
- ✓ Results metrics prominently displayed
- ✓ Testimonials included where applicable
- ✓ Mobile responsive
- ✓ SEO meta tags set for each page

---

### 3.3: About Page

**Task:** Tell the Applicreations story

**Subtasks:**
- [ ] 3.3.1: Create `app/about/page.tsx`
- [ ] 3.3.2: Write company origin story
- [ ] 3.3.3: Add values/philosophy section
- [ ] 3.3.4: Add Delaware focus section
- [ ] 3.3.5: Add team section (if applicable)
- [ ] 3.3.6: Add CTA at bottom
- [ ] 3.3.7: Test mobile layout

**About Page Copy (EXACT WORDING):**

```typescript
// app/about/page.tsx

const ABOUT_PAGE_CONTENT = {
  hero: {
    headline: "Building Better Websites for Delaware Businesses",
    subheadline: "Since 2009, we've been helping Delaware businesses grow online with professional websites that actually work.",
  },
  
  story: {
    headline: "Our Story",
    content: [
      "Applicreations started in 2009 with a simple mission: help Delaware small businesses compete online without needing a fortune or a computer science degree.",
      
      "Back then, most small businesses were told they needed to spend $20,000+ for a professional website. Or they were pushed toward do-it-yourself website builders that looked cheap and performed even worse.",
      
      "We knew there was a better way. We combined professional design, modern technology, and personal service to create websites that small businesses could actually afford—and that actually grew their businesses.",
      
      "Today, we've helped over 50 Delaware businesses establish a professional online presence. From Dover to Wilmington, from contractors to law firms, we've proven that you don't need a Fortune 500 budget to have a Fortune 500 website.",
    ]
  },
  
  values: {
    headline: "What We Believe",
    values: [
      {
        title: "Quality Over Quantity",
        description: "We don't take on dozens of projects at once. We focus on a few clients at a time so we can do exceptional work.",
      },
      {
        title: "Delaware First",
        description: "We're based in Delaware and specialize in Delaware businesses. We understand the local market, the local competition, and how to help you stand out.",
      },
      {
        title: "No BS, Just Results",
        description: "We don't promise overnight success or trick you with fake urgency. We build great websites, optimize them for search engines, and let the results speak for themselves.",
      },
      {
        title: "You Own Everything",
        description: "Your website, your content, your domain—you own it all. No long-term contracts. No holding your site hostage. Cancel anytime.",
      },
    ]
  },
  
  delawareFocus: {
    headline: "Why We Focus on Delaware",
    content: "Delaware is our home. We know the cities, the industries, the local competition. We know what works for Delaware businesses because we've been doing this here for over 15 years. When you work with us, you're working with someone who understands your market—not some agency in another state treating Delaware like everywhere else.",
  },
  
  // Optional: Team section (if you want to add this)
  team: {
    headline: "Meet the Team",
    members: [
      {
        name: "Your Name",
        title: "Founder & Lead Developer",
        bio: "15+ years building websites for Delaware businesses. Obsessed with performance, design, and results.",
        image: "/images/team/your-photo.jpg",
      },
      // Add more team members if applicable
    ]
  },
  
  cta: {
    headline: "Let's Build Something Great Together",
    primaryCTA: {
      text: "Get Instant Quote",
      href: "/quote"
    },
    secondaryCTA: {
      text: "See Our Work",
      href: "/portfolio"
    }
  },
}
```

**Definition of Done:**
- ✓ About page renders at `/about`
- ✓ Copy matches EXACT WORDING
- ✓ Story section reads naturally
- ✓ Values clearly communicated
- ✓ Delaware focus emphasized
- ✓ Team section present (if applicable)
- ✓ CTA at bottom
- ✓ Mobile responsive
- ✓ SEO meta tags set

---

### 3.4: Contact Page

**Task:** Build functional contact form and information page

**Subtasks:**
- [ ] 3.4.1: Create `app/contact/page.tsx`
- [ ] 3.4.2: Build contact form component
- [ ] 3.4.3: Implement form validation (client-side)
- [ ] 3.4.4: Create API route for form submission
- [ ] 3.4.5: Set up email notification (e.g., Resend, SendGrid)
- [ ] 3.4.6: Add phone, email, address display
- [ ] 3.4.7: Add map of Delaware service area (optional)
- [ ] 3.4.8: Test form end-to-end

**Contact Page Copy (EXACT WORDING):**

```typescript
// app/contact/page.tsx

const CONTACT_PAGE_CONTENT = {
  hero: {
    headline: "Let's Talk About Your Website",
    subheadline: "Get a free consultation and quote. No pressure, no sales pitch—just honest answers to your questions.",
  },
  
  contactInfo: {
    headline: "Get in Touch",
    phone: {
      display: "(302) XXX-XXXX", // Use real number
      href: "tel:+1302XXXXXXX",
      label: "Call us Monday-Friday, 9am-5pm ET",
    },
    email: {
      display: "hello@applicreations.com", // Use real email
      href: "mailto:hello@applicreations.com",
      label: "Email us anytime—we respond within 24 hours",
    },
    location: {
      display: "Serving all of Delaware",
      description: "Based in [Your City], serving businesses across New Castle, Kent, and Sussex counties.",
    },
  },
  
  form: {
    headline: "Send Us a Message",
    fields: [
      {
        name: "name",
        label: "Your Name",
        type: "text",
        required: true,
        placeholder: "John Smith",
      },
      {
        name: "business",
        label: "Business Name",
        type: "text",
        required: false,
        placeholder: "Acme Services LLC",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "john@acmeservices.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
        placeholder: "(302) 555-1234",
      },
      {
        name: "service",
        label: "What are you interested in?",
        type: "select",
        required: false,
        options: [
          "New Website",
          "Website Redesign",
          "SEO Services",
          "Maintenance & Support",
          "Just Exploring",
        ],
      },
      {
        name: "message",
        label: "Tell us about your project",
        type: "textarea",
        required: true,
        placeholder: "What are you hoping to achieve with your website?",
        rows: 6,
      },
    ],
    submitButton: "Send Message",
    successMessage: "Thanks! We'll respond within 24 hours.",
    errorMessage: "Oops! Something went wrong. Please try again or call us.",
  },
}
```

**Form Validation Rules:**

```typescript
// Form validation (client-side with Zod or similar)

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  business: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more (at least 10 characters)"),
})
```

**API Route Implementation:**

```typescript
// app/api/contact/route.ts

// POST /api/contact
// Validates form data, sends email notification, returns success/error

export async function POST(request: Request) {
  // 1. Parse and validate form data
  // 2. Send email notification to hello@applicreations.com
  // 3. Optionally send auto-reply to user
  // 4. Return JSON response
}
```

**Definition of Done:**
- ✓ Contact page renders at `/contact`
- ✓ Contact info displayed (phone, email, location)
- ✓ Form renders with all fields
- ✓ Form validates inputs client-side
- ✓ Form shows helpful error messages
- ✓ Form submits to API route
- ✓ API route validates data
- ✓ Email notification sends successfully
- ✓ Success message displays after submission
- ✓ Form resets after successful submission
- ✓ Mobile responsive
- ✓ All form inputs keyboard accessible
- ✓ All form inputs have proper labels

---

### 3.5: Legal Pages

**Task:** Create required legal documentation pages

**Subtasks:**
- [ ] 3.5.1: Create `app/privacy/page.tsx`
- [ ] 3.5.2: Create `app/terms/page.tsx`
- [ ] 3.5.3: Create `app/refund-policy/page.tsx` (if applicable)
- [ ] 3.5.4: Review all policies with client
- [ ] 3.5.5: Add footer links to legal pages
- [ ] 3.5.6: Set "Last Updated" dates

**Legal Pages Requirements:**

**Privacy Policy** (`/privacy`):
- What data you collect (email, name, etc.)
- How you use data (responding to inquiries, newsletters)
- Third-party services (Google Analytics, Vercel Analytics, etc.)
- Cookie usage (if any)
- User rights (access, deletion requests)
- Contact for privacy questions

**Terms of Service** (`/terms`):
- Service description
- Client responsibilities
- Payment terms
- Cancellation policy
- Intellectual property (who owns what)
- Limitations of liability
- Dispute resolution

**Refund/Cancellation Policy** (`/refund-policy`):
- Refund eligibility
- Cancellation process
- Timeline for cancellations
- What happens to the website upon cancellation

**IMPORTANT:** Have a lawyer review these before launch, or use a template service (like Termly, TermsFeed) to generate compliant policies.

**Definition of Done:**
- ✓ Privacy Policy page at `/privacy`
- ✓ Terms of Service page at `/terms`
- ✓ Refund Policy page at `/refund-policy`
- ✓ All policies reviewed by client (and ideally a lawyer)
- ✓ Footer links to all legal pages
- ✓ "Last Updated" dates accurate
- ✓ Mobile responsive
- ✓ SEO meta tags set (noindex if desired)

---

### Phase 3 Completion Checklist

**Before proceeding to Phase 4, verify ALL:**

- [ ] ✓ All service detail pages functional
- [ ] ✓ Portfolio grid displays correctly
- [ ] ✓ All case study pages render
- [ ] ✓ About page tells compelling story
- [ ] ✓ Contact form works end-to-end
- [ ] ✓ Email notifications send successfully
- [ ] ✓ All legal pages present and reviewed
- [ ] ✓ Footer links to legal pages work
- [ ] ✓ All pages mobile responsive
- [ ] ✓ All pages have SEO meta tags
- [ ] ✓ Navigation between pages works
- [ ] ✓ All links tested (no 404s)
- [ ] ✓ Client approves all copy
- [ ] ✓ Run Lighthouse on 3-5 pages → all ≥90

---

## Phase 4: Advanced Features

**Goal:** Add polish and functionality that elevates experience

**Duration Estimate:** 1-2 weeks

### 4.1: Dark Mode Implementation

**Task:** Add dark mode with theme toggle

**Subtasks:**
- [ ] 4.1.1: Define dark mode color palette (LCH adjusted)
- [ ] 4.1.2: Update CSS custom properties with dark mode values
- [ ] 4.1.3: Create theme toggle component
- [ ] 4.1.4: Implement theme persistence (localStorage)
- [ ] 4.1.5: Detect system preference on first visit
- [ ] 4.1.6: Prevent flash of wrong theme (FOUT)
- [ ] 4.1.7: Test all pages in dark mode
- [ ] 4.1.8: Verify all text readable (4.5:1 contrast)

**Dark Mode Colors (Example):**

```css
/* Add to app/globals.css */

[data-theme="dark"] {
  /* Backgrounds */
  --color-background: oklch(15% 0 0);
  --color-surface: oklch(20% 0 0);
  
  /* Text */
  --color-text: oklch(95% 0 0);
  --color-text-secondary: oklch(75% 0 0);
  
  /* Primary colors (slightly adjusted for dark bg) */
  --color-primary: oklch(65% 0.22 264);
  --color-primary-hover: oklch(70% 0.22 264);
  
  /* Borders */
  --color-border: oklch(30% 0 0);
}
```

**Theme Toggle Component:**

```typescript
// components/ui/ThemeToggle.tsx

export function ThemeToggle() {
  // Implement toggle button (sun/moon icon)
  // Save preference to localStorage
  // Apply theme to <html data-theme="dark">
}
```

**Definition of Done:**
- ✓ Theme toggle button in header
- ✓ Toggle switches theme smoothly
- ✓ All pages readable in dark mode
- ✓ All text meets 4.5:1 contrast (dark mode)
- ✓ Images/photos visible against dark background
- ✓ Theme preference persists across sessions
- ✓ System preference detected on first visit
- ✓ No flash of wrong theme on page load
- ✓ Reduced motion respected in theme transition

---

### 4.2: Performance Optimization Sprint

**Task:** Fine-tune performance for maximum speed

**Subtasks:**
- [ ] 4.2.1: Analyze bundle size (`npm run build`)
- [ ] 4.2.2: Implement code splitting for heavy routes
- [ ] 4.2.3: Convert images to WebP/AVIF formats
- [ ] 4.2.4: Add proper `loading="lazy"` to images
- [ ] 4.2.5: Inline critical CSS (if needed)
- [ ] 4.2.6: Configure edge caching headers
- [ ] 4.2.7: Run Lighthouse on all pages
- [ ] 4.2.8: Achieve ≥95 on all Lighthouse metrics

**Bundle Analysis:**

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Run analysis
ANALYZE=true npm run build

# Opens visualization of bundle size
```

**Image Optimization:**

```bash
# Convert images to WebP (use tool like Squoosh.app or Sharp)
# Target: All images <100KB
# Use Next.js Image component for automatic optimization
```

**Definition of Done:**
- ✓ Bundle size <200KB gzipped
- ✓ All images in WebP or AVIF format
- ✓ All images <100KB each
- ✓ Lighthouse Performance ≥95 (all pages)
- ✓ Lighthouse Accessibility ≥95
- ✓ Lighthouse Best Practices ≥95
- ✓ Lighthouse SEO ≥95
- ✓ LCP <2.5s on all pages
- ✓ INP <200ms
- ✓ CLS <0.1

---

### 4.3: SEO Optimization

**Task:** Ensure all pages properly optimized for search

**Subtasks:**
- [ ] 4.3.1: Add proper meta tags to all pages
- [ ] 4.3.2: Generate `sitemap.xml`
- [ ] 4.3.3: Configure `robots.txt`
- [ ] 4.3.4: Add Open Graph tags (social sharing)
- [ ] 4.3.5: Add structured data (JSON-LD)
- [ ] 4.3.6: Set up Google Business integration
- [ ] 4.3.7: Verify all pages indexed correctly

**Meta Tags Template:**

```typescript
// app/layout.tsx or page-level metadata

export const metadata: Metadata = {
  title: "Professional Website Design | Delaware | Applicreations",
  description: "Custom websites for Delaware businesses. Fast, search-optimized, mobile-responsive. 15+ years serving DE. Get a quote today.",
  
  openGraph: {
    title: "Professional Website Design for Delaware Businesses",
    description: "Custom websites that turn browsers into buyers.",
    url: "https://www.applicreations.com",
    siteName: "Applicreations",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Applicreations - Delaware Website Design",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Professional Website Design for Delaware Businesses",
    description: "Custom websites that turn browsers into buyers.",
    images: ["/images/twitter-image.jpg"],
  },
}
```

**Sitemap Generation:**

```typescript
// app/sitemap.ts

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.applicreations.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.applicreations.com/services/web-design',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ... all pages
  ]
}
```

**Structured Data (JSON-LD):**

```typescript
// Add to pages for rich snippets

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Applicreations",
  "description": "Professional website design and development for Delaware businesses",
  "url": "https://www.applicreations.com",
  "telephone": "+1-302-XXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Delaware",
    "addressRegion": "DE",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "State",
    "name": "Delaware"
  },
  "priceRange": "$$",
}
```

**Definition of Done:**
- ✓ All pages have unique, descriptive titles
- ✓ All pages have meta descriptions (150-160 chars)
- ✓ Open Graph tags present on all pages
- ✓ Twitter Card tags present
- ✓ `sitemap.xml` generated and accessible
- ✓ `robots.txt` configured correctly
- ✓ Structured data added to homepage
- ✓ All pages canonical URLs set
- ✓ Favicon and app icons present (all sizes)

---

### 4.4: Analytics Setup

**Task:** Configure analytics and monitoring

**Subtasks:**
- [ ] 4.4.1: Set up Vercel Analytics
- [ ] 4.4.2: Set up Vercel Speed Insights
- [ ] 4.4.3: Configure goal tracking (form submissions)
- [ ] 4.4.4: Set up error monitoring (Sentry, optional)
- [ ] 4.4.5: Create analytics dashboard
- [ ] 4.4.6: Document metrics to watch

**Analytics to Track:**

- **Traffic:** Page views, unique visitors, sessions
- **Conversions:** Form submissions, demo views, quote requests
- **Performance:** Core Web Vitals, load times
- **Behavior:** Pages per session, bounce rate, time on site
- **Sources:** Where traffic comes from (Google, direct, referrals)

**Definition of Done:**
- ✓ Vercel Analytics installed
- ✓ Speed Insights enabled
- ✓ Form submission goals tracked
- ✓ Error monitoring configured (optional)
- ✓ Can view real-time analytics data
- ✓ Privacy policy updated with analytics mention

---

### 4.5: Pre-Launch Testing

**Task:** Comprehensive final testing before launch

**Subtasks:**
- [ ] 4.5.1: Test on 5+ real devices
- [ ] 4.5.2: Conduct screen reader testing (NVDA/JAWS)
- [ ] 4.5.3: Security audit (HTTPS, no exposed keys)
- [ ] 4.5.4: Test all forms end-to-end
- [ ] 4.5.5: Create 404 page (helpful, not generic)
- [ ] 4.5.6: Test DNS configuration
- [ ] 4.5.7: Document rollback plan
- [ ] 4.5.8: Complete pre-launch checklist

**Pre-Launch Checklist:**

- [ ] ✓ Tested on iPhone (Safari)
- [ ] ✓ Tested on Android (Chrome)
- [ ] ✓ Tested on Windows laptop (Edge, Chrome)
- [ ] ✓ Tested on Mac (Safari, Chrome)
- [ ] ✓ Tested on iPad (Safari)
- [ ] ✓ Screen reader tested (NVDA or JAWS)
- [ ] ✓ All forms tested end-to-end
- [ ] ✓ Email notifications working
- [ ] ✓ 404 page exists and helpful
- [ ] ✓ Sitemap accessible (`/sitemap.xml`)
- [ ] ✓ Robots.txt configured (`/robots.txt`)
- [ ] ✓ Favicon present (all sizes)
- [ ] ✓ Social share images set (Open Graph)
- [ ] ✓ SSL certificate valid (HTTPS working)
- [ ] ✓ DNS configured correctly
- [ ] ✓ Vercel domain set up
- [ ] ✓ Monitoring/alerting enabled
- [ ] ✓ Backup of old site taken
- [ ] ✓ Rollback plan documented and tested
- [ ] ✓ Client trained on updates (if applicable)
- [ ] ✓ Launch announcement ready
- [ ] ✓ Client gives final approval

**Rollback Plan:**

```
If something goes wrong after launch:

1. Revert DNS to point to old site (takes 5-60 minutes)
2. Investigate issue on Vercel deployment
3. Fix in development environment
4. Re-deploy when confirmed working
5. Update DNS again to point to new site

Backup: Old site remains on Render for 30 days post-launch
```

**Definition of Done:**
- ✓ All pre-launch checklist items completed
- ✓ Client signs off on launch
- ✓ Rollback plan documented and tested
- ✓ Launch date/time scheduled

---

### Phase 4 Completion Checklist

**Before launching, verify ALL:**

- [ ] ✓ Dark mode implemented and tested
- [ ] ✓ Performance targets met (≥95 Lighthouse)
- [ ] ✓ SEO optimization complete
- [ ] ✓ Analytics configured and tracking
- [ ] ✓ All devices tested (5+ devices)
- [ ] ✓ Screen reader tested
- [ ] ✓ All forms working end-to-end
- [ ] ✓ 404 page helpful
- [ ] ✓ Security audit passed
- [ ] ✓ DNS configured
- [ ] ✓ Rollback plan ready
- [ ] ✓ Client final approval received

**Launch Gate:** All items must be ✓ before launch

---

## Phase 5: Post-Launch

**Goal:** Monitor, iterate, optimize based on real user data

**Duration:** Ongoing

### 5.1: Initial Monitoring (First 7 Days)

**Task:** Watch for critical issues immediately after launch

**Checklist:**
- [ ] Monitor Core Web Vitals (Vercel dashboard)
- [ ] Check for JavaScript errors (browser console, Sentry)
- [ ] Monitor form submissions (ensure they're working)
- [ ] Check analytics (traffic coming through correctly)
- [ ] Monitor uptime (Vercel should be 99.9%+)
- [ ] Watch for user feedback/complaints

**Action Items:**
- Fix critical bugs immediately (forms broken, pages not loading)
- Address user feedback within 24 hours
- Document any issues in GitHub Issues

---

### 5.2: First 30 Days Analysis

**Task:** Evaluate performance and identify optimization opportunities

**Metrics to Review:**

**Conversion Metrics:**
- Demo requests: _____ (goal: track count)
- Quote submissions: _____ (goal: track count)
- Phone calls: _____ (if tracking number used)
- Conversion rate: _____ (goal: >3%)

**Engagement Metrics:**
- Average session duration: _____ (goal: >2 minutes)
- Pages per session: _____ (goal: >3)
- Bounce rate: _____ (goal: <40%)
- Top landing pages: _____
- Top exit pages: _____

**Technical Metrics:**
- Core Web Vitals (75th percentile all green?)
- Lighthouse scores maintained ≥90?
- Any console errors?
- Uptime %: _____ (goal: >99.9%)

**Action Items:**
- If conversion rate <3%, A/B test CTA variations
- If bounce rate >40%, investigate top exit pages
- If engagement low, review content clarity
- If Core Web Vitals decline, optimize heavy pages

---

### 5.3: SEO Tracking

**Task:** Monitor search performance and rankings

**Setup:**
- [ ] Google Search Console connected
- [ ] Track keyword rankings for target terms
- [ ] Monitor backlinks (if any)
- [ ] Review "Performance" report in Search Console

**Keywords to Track:**
- "[service] Delaware"
- "[service] near me" (from Delaware IP)
- "Delaware [service] company"
- "[city] [service]" (for each major DE city)

**Monthly Review:**
- Which pages getting organic traffic?
- Which keywords driving traffic?
- Any pages not indexed? (fix)
- Any 404 errors? (fix)

---

### 5.4: Iteration Plan

**Task:** Continuous improvement based on data

**Monthly:**
- Review analytics data
- Identify underperforming pages
- A/B test 1-2 elements (CTAs, headlines)
- Update content if needed
- Check for broken links
- Monitor competitor sites

**Quarterly:**
- Major content refresh (if needed)
- Review and update pricing (if changed)
- Add new case studies
- Refresh testimonials
- Update portfolio

**Annually:**
- Full site audit (performance, SEO, accessibility)
- Review design trends (don't change just to change)
- Update technology stack (Next.js versions, etc.)
- Refresh photography (if needed)

---

### 5.5: Documentation

**Task:** Keep documentation up-to-date

**Documents to Maintain:**
- [ ] README.md (setup instructions)
- [ ] DECISIONS.md (design decision log)
- [ ] SCOPE.md (this document - update as needed)
- [ ] `.cursorrules` (update with learned patterns)
- [ ] Content style guide (for future updates)
- [ ] Analytics playbook (how to read data)

**Knowledge Transfer:**
- Document any custom code
- Document deployment process
- Document common tasks (updating content, etc.)
- Create video walkthrough (optional)

---

## Copy & Messaging Guidelines

**This section defines the EXACT voice, tone, and phrasing to use across the site. Cursor should reference this when writing any copy.**

### Voice & Tone Principles

**Voice:** Confident, knowledgeable, no-nonsense  
**Tone:** Friendly but not cutesy, professional but not stuffy, direct but not harsh

**DO:**
- ✓ Use contractions (you're, we'll, can't)
- ✓ Address the reader directly (you/your)
- ✓ Lead with benefits, not features
- ✓ Be specific (numbers, examples)
- ✓ Acknowledge problems directly
- ✓ Make comparisons (Facebook vs website)
- ✓ Use active voice ("We build websites" not "Websites are built by us")
- ✓ Short sentences when possible
- ✓ Vary sentence length (mix short and longer)

**DON'T:**
- ❌ Use jargon without explanation
- ❌ Be overly salesy or pushy
- ❌ Make unsubstantiated claims ("best in the world")
- ❌ Use buzzwords ("synergy", "leverage", "disruptive")
- ❌ Talk about yourself excessively (minimize "we" statements)
- ❌ Use passive voice unnecessarily
- ❌ Write long, complex sentences
- ❌ Use exclamation marks excessively

---

### Key Messaging Pillars

**Every page should reinforce these 3 core messages:**

1. **You've outgrown Facebook** - Professional businesses need real websites
2. **We understand Delaware** - Local expertise, not generic national agency
3. **Quality without complexity** - Professional results without Fortune 500 budgets

---

### Approved Phrases (Use These)

**When talking about the problem:**
- "You've outgrown Facebook"
- "Customers expect more than a Facebook page"
- "You're losing business to competitors with websites"
- "Facebook doesn't show up in Google searches"
- "You're building on rented land"
- "Facebook owns your presence—you don't"

**When talking about the solution:**
- "A website that works as hard as you do"
- "Built for Delaware businesses"
- "Turn browsers into buyers"
- "Get found on Google"
- "Own your customer relationships"
- "Professional results without enterprise budgets"

**When talking about process:**
- "Quick consultation" (not "discovery call")
- "We build, you approve"
- "Launch and grow"
- "We handle the tech so you can focus on your business"

**When talking about Delaware:**
- "Serving Delaware since 2009"
- "Based in Delaware, built for Delaware"
- "We understand the Delaware market"
- "Delaware-focused local SEO"
- "Real support from a real person in Delaware"

**When talking about support:**
- "Call or email us—real human support"
- "We respond within 24 hours on business days"
- "No outsourced call centers"
- "You own everything—no long-term contracts"
- "Cancel anytime with 30 days notice"

---

### Banned Phrases (Never Use These)

- ❌ "World-class" (overused, meaningless)
- ❌ "Best in class" (unsubstantiated)
- ❌ "Industry-leading" (generic)
- ❌ "Cutting-edge" (cliché)
- ❌ "Revolutionary" (overused)
- ❌ "Game-changing" (overused)
- ❌ "Turnkey solution" (jargon)
- ❌ "Seamless experience" (overused)
- ❌ "Next-generation" (vague)
- ❌ "Empower" (buzzword)
- ❌ "Leverage" (as verb, overused)
- ❌ "Synergy" (meaningless)
- ❌ "Robust" (overused in tech)
- ❌ "Holistic" (buzzword)

---

### Headline Formulas (Use These Patterns)

**Problem + Solution:**
- "You've Outgrown Facebook. Get a Real Website."
- "Customers Search Google. Will They Find You?"

**Benefit-Driven:**
- "Professional Websites That Grow Your Delaware Business"
- "Turn Browsers into Buyers"
- "Get Found. Get Customers. Grow."

**Delaware-Specific:**
- "Building Better Websites for Delaware Businesses"
- "Delaware's Website Design Experts"

**Result-Focused:**
- "300% More Leads. Real Results for Delaware Businesses."
- "From Invisible to #1 on Google"

---

### CTA Button Text (Approved Options)

**Primary CTAs:**
- "Get Instant Quote" (preferred)
- "Request a Quote"
- "See Demo Site"
- "View Our Work"

**Secondary CTAs:**
- "Learn More"
- "See How It Works"
- "View Case Studies"
- "Contact Us"

**DON'T use:**
- ❌ "Click Here"
- ❌ "Submit"
- ❌ "Sign Up"
- ❌ "Start Now" (vague)
- ❌ "Get Started" (overused)

---

### Writing Checklist (Before Publishing)

Every piece of copy should pass these checks:

- [ ] ✓ Is it clear who this is for? (Delaware businesses)
- [ ] ✓ Is it clear what we're offering? (professional websites)
- [ ] ✓ Is it clear what they should do next? (get quote, see demo)
- [ ] ✓ Does it address a real pain point? (not just feature list)
- [ ] ✓ Does it sound like a real person wrote it? (not AI generic)
- [ ] ✓ Could you read it out loud naturally? (test for flow)
- [ ] ✓ Are claims backed by evidence? (numbers, examples)
- [ ] ✓ Is every word necessary? (cut ruthlessly)
- [ ] ✓ Does it match our voice & tone? (confident, direct, friendly)
- [ ] ✓ Zero banned phrases? (check list above)

---

## Design System Standards (Quick Reference)

### Color System

**Primary Blues (LCH Color Space):**

```css
--blue-deep: oklch(59% 0.22 264);   /* Primary brand blue */
--blue-sky: oklch(67% 0.20 264);    /* Lighter accent */
--blue-navy: oklch(47% 0.18 264);   /* Darker variant */
```

**Semantic Colors:**

```css
--color-action: oklch(62% 0.21 162);   /* Green for CTAs */
--color-error: oklch(55% 0.22 27);     /* Red for errors */
--color-warning: oklch(71% 0.17 75);   /* Amber for warnings */
--color-success: oklch(62% 0.21 142);  /* Green for success */
```

**Neutrals (Gray Scale):**

```css
--gray-50: oklch(98% 0 0);
--gray-100: oklch(96% 0 0);
--gray-200: oklch(90% 0 0);
--gray-300: oklch(83% 0 0);
--gray-400: oklch(71% 0 0);
--gray-500: oklch(61% 0 0);
--gray-600: oklch(51% 0 0);
--gray-700: oklch(41% 0 0);
--gray-800: oklch(27% 0 0);
--gray-900: oklch(17% 0 0);
```

**Contrast Requirements:**
- Text on background: **4.5:1 minimum** (WCAG AA)
- Large text (24px+): **3:1 minimum**
- UI components: **3:1 minimum**

---

### Spacing Scale (8-Point Grid)

```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
--space-12: 6rem;    /* 96px */
--space-16: 8rem;    /* 128px */
```

**Usage:**
- Tight spacing (related elements): 8px
- Default spacing (paragraph, list items): 16px
- Section spacing: 32px+
- Major section breaks: 64px+

---

### Typography Scale (Perfect Fourth 1.333)

```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px - Body default */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.313rem;    /* 21px */
--text-2xl: 1.75rem;    /* 28px */
--text-3xl: 2.375rem;   /* 38px */
--text-4xl: 3.188rem;   /* 51px - Hero headline */
```

**Font Weights:**
- 400: Body text (default)
- 500: Buttons, navigation
- 600: Subheadings
- 700: Headlines only

**Never use:**
- 300 (light) - too thin for accessibility
- 800+ (extra bold) - too heavy, unnecessary

**Line Heights:**
- Headings: 1.1-1.2
- Body text: 1.5-1.6
- UI elements: 1.0

---

### Animation Standards

**Durations:**

```css
--duration-instant: 100ms;   /* Hover states */
--duration-fast: 150ms;      /* Color changes */
--duration-normal: 250ms;    /* Most animations */
--duration-base: 300ms;      /* iOS default */
--duration-slow: 400ms;      /* Large movements */
```

**Easing Functions:**

```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);        /* Decelerates (most common) */
--ease-in: cubic-bezier(0.4, 0, 1, 1);         /* Accelerates */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);   /* Smooth both ends */
```

**Spring Physics (Framer Motion):**

```typescript
const springConfig = {
  stiffness: 300,  // How quickly it responds
  damping: 20,     // How much bounce/overshoot
  mass: 0.8,       // Weight of element
}
```

**Animation Rules:**

**ONLY Animate:**
- ✓ `transform` (translate, scale, rotate)
- ✓ `opacity`
- ✓ `filter` (cautiously - can be expensive)

**NEVER Animate:**
- ❌ `width`, `height` (triggers layout reflow)
- ❌ `margin`, `padding` (triggers layout reflow)
- ❌ `left`, `right`, `top`, `bottom` (triggers layout reflow)
- ❌ `border` (expensive)

**Reduced Motion:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Border Radius

```css
--radius-sm: 4px;    /* Input fields */
--radius-md: 8px;    /* Buttons */
--radius-lg: 12px;   /* Cards */
--radius-xl: 16px;   /* Images, hero cards */
--radius-full: 9999px; /* Pills, badges */
```

**Usage:**
- Small UI elements: 4-8px
- Cards, containers: 12px
- Images: 16px
- Circular elements: 9999px (ensures always round)

---

### Touch Target Standards

**Minimum Sizes:**

```
Center area: 44×44px minimum
Screen edges: 48×48px minimum
Primary CTAs: 56×56px comfortable
```

**Spacing:**
- Minimum 8px between touch targets
- 16px preferred for comfort

**Mobile Considerations:**
- Thumbs hit bottom 1/3 of screen most easily
- Place primary actions in easy-to-reach zones
- Avoid top corners (hardest to reach)

---

### Iconography

**Icon Size Scale:**

```
16px - Inline text icons
24px - UI icons (buttons, inputs)
32px - Feature icons
48px - Section icons
64px - Hero/large feature icons
```

**Icon Style:**
- Use inline SVG (no external requests)
- Outline style (2px stroke)
- Simple, recognizable shapes
- Match brand aesthetic (rounded corners)

**Accessible Icons:**
- Always provide text alternative
- Use `aria-label` or `aria-labelledby`
- Don't rely on icon alone to convey meaning

---

## Testing Requirements

### Automated Testing (Every Build)

**Run before every commit:**

```bash
npm run lint          # ESLint - must pass
npm run type-check    # TypeScript - must pass
npm run build         # Build - must succeed
```

**If any fail:** Fix before committing

---

### Performance Testing (Every Phase Gate)

**Lighthouse CI:**

```bash
# Build production version
npm run build
npm run start

# Run Lighthouse
npx lighthouse http://localhost:3000 --view

# Must achieve:
# Performance: ≥90
# Accessibility: ≥95
# Best Practices: ≥95
# SEO: ≥95
```

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s
- INP (Interaction to Next Paint): <200ms
- CLS (Cumulative Layout Shift): <0.1

**Bundle Size:**

```bash
# Check total bundle size after build
npm run build

# Check .next/static/chunks
# Total JavaScript: <200KB gzipped
```

---

### Accessibility Testing (Every Phase Gate)

**Automated:**

```bash
# Install axe-core CLI
npm install -D @axe-core/cli

# Run axe
npx @axe-core/cli http://localhost:3000

# Must show: 0 violations
```

**Manual Testing:**

**Keyboard Navigation:**
1. Disconnect mouse
2. Navigate entire site using only keyboard
3. Tab through all interactive elements
4. Verify focus indicators visible
5. Verify logical tab order (top-to-bottom, left-to-right)
6. Activate elements with Enter or Space
7. Close modals/menus with Escape

**Screen Reader Testing:**
1. Install NVDA (Windows) or VoiceOver (Mac)
2. Turn on screen reader
3. Navigate homepage
4. Verify all content announced
5. Verify headings announced correctly
6. Verify buttons/links described properly
7. Verify form labels read aloud

**Color Contrast:**
1. Use browser DevTools accessibility panel
2. Check all text/background combinations
3. Verify ≥4.5:1 for normal text
4. Verify ≥3:1 for large text (24px+) and UI components

**Reduced Motion:**
1. Enable "Reduce Motion" in OS settings
2. Navigate site
3. Verify animations either disabled or simplified (crossfade only)

---

### Device Testing (Before Launch)

**Required Test Matrix:**

| Device | Browser | Viewport |
|--------|---------|----------|
| iPhone 13/14/15 | Safari | 375×812 |
| Samsung Galaxy S22/S23 | Chrome | 360×800 |
| iPad Air/Pro | Safari | 820×1180 |
| Windows 11 Laptop | Edge, Chrome | 1366×768 |
| MacBook Pro | Safari, Chrome | 1440×900 |

**Test Scenarios (On Each Device):**
1. Navigate from homepage through all pages
2. Complete contact form
3. Test accordions (Services, FAQ)
4. Test all CTAs (do they link correctly?)
5. Test on slow 3G connection (throttle in DevTools)
6. Test with screen reader (at least one device)
7. Test with reduced motion enabled

**Pass Criteria:**
- ✓ All pages render correctly
- ✓ All text readable (proper size, contrast)
- ✓ All interactions work (buttons, forms, accordions)
- ✓ No horizontal scroll
- ✓ Touch targets adequate (≥44px)
- ✓ Images load and display properly
- ✓ Performance acceptable (LCP <3s even on slow connection)

---

### Cross-Browser Testing

**Required Browsers:**
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

**Test On:**
- Windows 11 (Chrome, Edge, Firefox)
- macOS (Safari, Chrome)
- iOS (Safari)
- Android (Chrome)

**Known Issues to Check:**
- Safari sometimes handles CSS Grid differently
- Safari date/time inputs look different
- Firefox font rendering slightly different
- iOS Safari has bottom toolbar that obscures content

**Pass Criteria:**
- ✓ Site functional in all browsers
- ✓ Visual differences acceptable (not identical, but consistent)
- ✓ No critical bugs (broken forms, inaccessible content)

---

## Deployment Strategy

### Development Workflow

**Environments:**

1. **Local** (`localhost:3000`)
   - Your development machine
   - Only you can see this
   - Make changes here first

2. **Preview** (Vercel preview URL)
   - Auto-generated URL for each git branch
   - Share with client for review
   - e.g., `applicreations-redesign-xyz.vercel.app`

3. **Staging** (optional - `staging.applicreations.com`)
   - Near-identical to production
   - Final testing before launch
   - Not required if preview sufficient

4. **Production** (`www.applicreations.com`)
   - Live site
   - Only deploy here after all testing passes

---

### Git Workflow

**Branch Strategy:**

```bash
# Main branch (for production)
main

# Development branch (for all work)
redesign-2025

# Feature branches (optional, for big features)
feature/dark-mode
feature/contact-form
```

**Workflow:**

```bash
# Work in development branch
git checkout redesign-2025

# Make changes
# ... (code, test, repeat)

# Commit when feature/section complete
git add .
git commit -m "feat: add hero section with dual CTAs"

# Push to remote (triggers Vercel preview deploy)
git push origin redesign-2025

# Share preview URL with client
```

**Commit Message Convention:**

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting, no code change
refactor: code change without feature change
test: add or update tests
chore: tooling, config updates
```

---

### Vercel Deployment

**Setup:**

1. **Connect Git Repository:**
   - Go to Vercel dashboard
   - Click "Add New Project"
   - Connect your GitHub/GitLab repo
   - Select `redesign-2025` branch for auto-deploy

2. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Environment Variables:**
   - Add any API keys (email service, analytics, etc.)
   - Never commit secrets to git

4. **Domain Configuration:**
   - Don't configure custom domain until launch day
   - Use auto-generated preview URL for now

**Deployment Triggers:**

- **Push to branch** → Auto-deploys to preview URL
- **Merge to main** → Auto-deploys to production (only do this on launch day)

**Deployment Checklist:**

Before each deployment:
- [ ] ✓ Run `npm run build` locally - must succeed
- [ ] ✓ Run `npm run lint` - must pass
- [ ] ✓ Run `npm run type-check` - must pass
- [ ] ✓ Test on localhost one last time
- [ ] ✓ Commit with descriptive message
- [ ] ✓ Push to branch
- [ ] ✓ Wait for Vercel build (watch build logs)
- [ ] ✓ Test preview URL
- [ ] ✓ Share with client for approval

---

### Launch Day Process

**Pre-Launch (1 Day Before):**
- [ ] ✓ Final client approval on preview URL
- [ ] ✓ All pre-launch checklist items ✓
- [ ] ✓ Backup current live site (download files, database if applicable)
- [ ] ✓ Document current DNS settings
- [ ] ✓ Prepare rollback plan
- [ ] ✓ Schedule launch time (low-traffic window recommended)

**Launch Day:**

1. **Final Build & Deploy:**
   ```bash
   # Merge redesign to main
   git checkout main
   git merge redesign-2025
   git push origin main
   ```

2. **Configure Vercel Domain:**
   - Go to Vercel project settings
   - Add custom domain: `www.applicreations.com`
   - Vercel will provide DNS instructions

3. **Update DNS:**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Update A record to point to Vercel's IP
   - Update CNAME record (if using)
   - Changes propagate in 5 minutes - 24 hours (usually <1 hour)

4. **Monitor:**
   - Watch analytics for traffic
   - Check for errors (Vercel dashboard, Sentry if configured)
   - Test forms still working
   - Test on multiple devices/browsers

5. **Announce:**
   - Email announcement (if you have list)
   - Social media post (if applicable)
   - Update Google Business profile (if applicable)

**Post-Launch (First 24 Hours):**
- [ ] ✓ Monitor analytics every few hours
- [ ] ✓ Check for errors/console logs
- [ ] ✓ Respond to any user feedback
- [ ] ✓ Keep old site backup for 30 days (don't delete)

---

### Rollback Plan

**If something goes wrong:**

1. **Immediate (Emergency) Rollback:**
   ```bash
   # Revert DNS to old site
   # (Go to domain registrar, change A record back)
   # Takes 5-60 minutes to propagate
   ```

2. **Identify Issue:**
   - Check Vercel build logs
   - Check browser console for errors
   - Check form submissions
   - Check analytics

3. **Fix in Development:**
   ```bash
   # Create hotfix branch
   git checkout -b hotfix/issue-name
   
   # Fix the issue
   # ... (code, test)
   
   # Deploy fix
   git commit -m "fix: resolve [issue]"
   git push origin hotfix/issue-name
   
   # Merge to main when confirmed working
   git checkout main
   git merge hotfix/issue-name
   git push origin main
   ```

4. **Re-Launch:**
   - Update DNS again to point to Vercel
   - Monitor closely

**Backup Strategy:**
- Keep old site live on Render for 30 days
- Don't delete old files until new site proven stable
- Document any issues encountered for future reference

---

## Final Notes

### Development Philosophy Reminders

**Design is how it works, not just how it looks**
- Every design decision must serve conversion
- Aesthetic choices should enhance usability, not hinder it
- Beauty through constraint and restraint

**90% implementation, 10% ideation**
- Cursor/Claude do the heavy lifting
- You provide direction and quality control
- Ship working code, iterate based on data

**Say no to 1,000 things**
- Ruthlessly cut features that don't serve primary goal
- Simpler is almost always better
- Every addition must justify its existence

**Details users won't notice but will feel**
- Animation spring physics
- Precise spacing
- Color contrast
- Touch target sizes
- These create "quality feel"

---

### When to Deviate from This Document

**This scope document is a GUIDE, not a PRISON.**

You may deviate when:

1. **User testing reveals issues** - If real users struggle with something, fix it (document the change)
2. **Technical constraints arise** - If an approach doesn't work, find alternative (document why)
3. **Better solution discovered** - If you find genuinely better way, take it (document decision)
4. **Client requests change** - If client has strong preference, accommodate (within reason)

**Always document deviations:**
- Update `DECISIONS.md` with why you deviated
- Update `.cursorrules` if pattern should be reused
- Update this SCOPE.md if change is significant

---

### Working with Cursor AI

**Before Each Work Session:**
1. Open this SCOPE.md document
2. Identify which phase/task you're working on
3. Read "Definition of Done" for that task
4. Give Cursor clear instructions referencing this doc

**Example Cursor Prompt:**

```
I'm working on Phase 2, Task 2.2: Problem Section.

Please create the Problems section following the EXACT specifications in SCOPE.md:
- 4 problem cards
- Copy EXACTLY as written in SCOPE.md (check the PROBLEMS array)
- Scroll-triggered fade-in animation (75ms stagger)
- Hover states as specified
- All animations respect reduced motion

Start by showing me the component structure, then implement.
```

**During Work:**
- Cursor will propose approach
- Review approach against scope doc
- Approve or ask for revision
- Test immediately after implementation
- Commit if passing Definition of Done

**After Each Task:**
- Run tests (lint, type-check, build)
- Update `.cursorrules` with learned patterns
- Commit with clear message
- Move to next task

---

### Success Metrics Recap

**Phase Gates (Must Pass):**
- Phase 1 → Phase 2: Design system complete, accessible
- Phase 2 → Phase 3: Homepage ≥90 Lighthouse, client approved
- Phase 3 → Phase 4: All pages functional, forms working
- Phase 4 → Launch: All pre-launch checklist ✓

**Post-Launch (30 Days):**
- Conversion rate: >3%
- Lighthouse scores: ≥90 maintained
- Bounce rate: <40%
- Uptime: >99.9%
- Zero critical bugs

---

### Final Encouragement

**You're building something exceptional.**

This isn't just another website. This is:
- A conversion machine for Delaware businesses
- A demonstration of iOS design philosophy on the web
- A showcase of AI-assisted development done right
- A business differentiator

The scope is detailed because **details matter**. The constraints are tight because **constraints breed creativity**. The standards are high because **quality is felt immediately**.

Take your time. Do it right. Measure twice, cut once.

**When in doubt:**
1. Check this scope document
2. Ask: "Would Apple do this?"
3. Test with real users
4. Measure with hard metrics
5. Iterate based on data

**You've got this. Now ship it.** 🚀

---

**Document Version:** 2.0  
**Last Updated:** October 21, 2025  
**Next Review:** After Phase 2 completion (update learnings)
