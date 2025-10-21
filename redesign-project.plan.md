# Phase 1: Foundation & Design System - Implementation Plan

## Project Setup Confirmed

- **Location**: `C:\Users\david\Projects\applicreations-redesign\`
- **Strategy**: Option A (separate repository)
- **Node Version**: v22.16.0 ✓
- **Framework**: Next.js 14 with App Router
- **Current Project**: Remains untouched at `C:\Users\david\Projects\Applicreations\`

## Task 1.1: Project Infrastructure Setup

### Step 1: Create New Next.js 14 Project

```bash
# Navigate to Projects directory
cd C:\Users\david\Projects\

# Create new Next.js project with specific options
npx create-next-app@latest applicreations-redesign --typescript --tailwind --app --yes
```

**Configuration selections** (will auto-select with --yes flag):
- ✓ TypeScript: Yes
- ✓ ESLint: Yes
- ✓ Tailwind CSS: Yes
- ✓ `src/` directory: No (use app/ directly)
- ✓ App Router: Yes
- ✓ Import alias: Yes (@/*)

### Step 2: Copy Project Documentation

Copy these files from current project to redesign project:
- `.cursorrules` → Root of new project
- `SCOPE.md` → Root of new project
- `STATUS.md` → Root of new project (will update)
- `ALIASES.md` → Root of new project
- `USER_GUIDE.md` → Root of new project

### Step 3: Create DECISIONS.md

Create new file to track design decisions:

```markdown
# Design Decisions Log

## Purpose
Track significant design and technical decisions made during redesign.

## Format
Each entry: Date, Decision, Rationale, Alternatives Considered

---

## [Date] - Decision Title
**Decision**: What was decided
**Rationale**: Why this choice
**Alternatives**: What else was considered
**Impact**: How this affects the project
```

### Step 4: Configure TypeScript Strict Mode

Update `tsconfig.json`:
- Enable `strict: true`
- Enable `noUncheckedIndexedAccess: true`
- Enable `noImplicitReturns: true`

### Step 5: Test Dev Server

```bash
cd applicreations-redesign
npm run dev
# Should open at http://localhost:3000
```

**Success criteria**: Default Next.js welcome page displays

## Task 1.2: Tailwind Configuration & Design Tokens

### Step 1: Configure tailwind.config.ts

Replace default config with SCOPE.md design system:

```typescript
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
        // Primary Blues (LCH Color Space)
        'blue-deep': 'oklch(59% 0.22 264)',
        'blue-sky': 'oklch(67% 0.20 264)',
        'blue-navy': 'oklch(47% 0.18 264)',
        
        // Semantic Colors
        action: 'oklch(62% 0.21 162)',
        error: 'oklch(55% 0.22 27)',
        warning: 'oklch(71% 0.17 75)',
        success: 'oklch(62% 0.21 142)',
        
        // Grays
        gray: {
          50: 'oklch(98% 0 0)',
          100: 'oklch(96% 0 0)',
          200: 'oklch(90% 0 0)',
          300: 'oklch(83% 0 0)',
          400: 'oklch(71% 0 0)',
          500: 'oklch(61% 0 0)',
          600: 'oklch(51% 0 0)',
          700: 'oklch(41% 0 0)',
          800: 'oklch(27% 0 0)',
          900: 'oklch(17% 0 0)',
        },
      },
      spacing: {
        // 8-point grid
        '1': '0.5rem',   // 8px
        '2': '1rem',     // 16px
        '3': '1.5rem',   // 24px
        '4': '2rem',     // 32px
        '5': '2.5rem',   // 40px
        '6': '3rem',     // 48px
        '8': '4rem',     // 64px
        '10': '5rem',    // 80px
        '12': '6rem',    // 96px
        '16': '8rem',    // 128px
      },
      fontSize: {
        // Perfect Fourth (1.333) scale
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.313rem',     // 21px
        '2xl': '1.75rem',     // 28px
        '3xl': '2.375rem',    // 38px
        '4xl': '3.188rem',    // 51px
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '150ms',
        'normal': '250ms',
        'base': '300ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
}
export default config
```

## Task 1.3: CSS Custom Properties System

### Step 1: Create app/globals.css

Replace default with custom properties system:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors - Light Mode */
    --color-primary: oklch(59% 0.22 264);
    --color-primary-hover: oklch(65% 0.22 264);
    --color-background: oklch(100% 0 0);
    --color-surface: oklch(98% 0 0);
    --color-text: oklch(20% 0 0);
    --color-text-secondary: oklch(41% 0 0);
    --color-border: oklch(90% 0 0);
    
    /* Spacing (8-point grid) */
    --space-1: 0.5rem;   /* 8px */
    --space-2: 1rem;     /* 16px */
    --space-3: 1.5rem;   /* 24px */
    --space-4: 2rem;     /* 32px */
    --space-5: 2.5rem;   /* 40px */
    --space-6: 3rem;     /* 48px */
    
    /* Typography */
    --text-base: 1rem;       /* 16px */
    --text-lg: 1.125rem;     /* 18px */
    --text-xl: 1.313rem;     /* 21px */
    --text-2xl: 1.75rem;     /* 28px */
    --text-3xl: 2.375rem;    /* 38px */
    --text-4xl: 3.188rem;    /* 51px */
    
    /* Animation */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-base: 300ms;
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  [data-theme="dark"] {
    /* Colors - Dark Mode */
    --color-background: oklch(15% 0 0);
    --color-surface: oklch(20% 0 0);
    --color-text: oklch(95% 0 0);
    --color-text-secondary: oklch(75% 0 0);
    --color-primary: oklch(65% 0.22 264);
    --color-primary-hover: oklch(70% 0.22 264);
    --color-border: oklch(30% 0 0);
  }
  
  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* System Font Stack */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    line-height: 1.5;
  }
}
```

## Task 1.4: Base Component Library

### Step 1: Create lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 2: Install Dependencies

```bash
npm install clsx tailwind-merge
```

### Step 3: Create components/ui/Button.tsx

Full implementation per SCOPE.md specifications:
- 4 variants: primary, secondary, ghost, icon
- Sizes: sm, md, lg
- Loading state
- Disabled state
- 44×44px minimum touch target
- Keyboard accessible
- Focus indicators

### Step 4: Create components/ui/Card.tsx

Per SCOPE.md specifications:
- 3 variants: default, elevated, interactive
- Hover states (translateY -4px, scale 1.01)
- Press states (if interactive)
- Reduced motion support

### Step 5: Create components/ui/Input.tsx

Per SCOPE.md specifications:
- Validation states (default, error, success)
- Proper labels for accessibility
- Focus indicators
- Error message display

### Step 6: Create components/ui/Link.tsx

Accessible link component:
- External link detection
- Focus indicators
- Keyboard navigation

## Task 1.5: Animation Utilities Setup

### Step 1: Install Framer Motion

```bash
npm install framer-motion
```

### Step 2: Create lib/animations.ts

```typescript
/**
 * Animation constants following iOS design principles
 * RULES:
 * - Only animate transform and opacity
 * - Always provide reduced motion fallback
 * - Use spring physics for natural feel
 */

export const SPRING_PHYSICS = {
  stiffness: 300,
  damping: 20,
  mass: 0.8,
}

export const DURATIONS = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.3,
}

export const EASING = {
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
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

## Task 1.6: Development Environment Polish

### Step 1: Update package.json Scripts

Add custom scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "pre-commit": "npm run lint && npm run type-check"
  }
}
```

### Step 2: Create README.md

Document setup instructions:

```markdown
# Applicreations Redesign

Complete redesign of Applicreations.com using Next.js 14 and iOS-inspired design principles.

## Setup

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open http://localhost:3000

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Project Structure

See SCOPE.md for complete project specifications.
```

### Step 3: Test Build Pipeline

```bash
npm run lint        # Must pass
npm run type-check  # Must pass
npm run build       # Must succeed
```

## Task 1.7: Vercel Deployment Setup

### Step 1: Initialize Git

```bash
cd applicreations-redesign
git init
git add .
git commit -m "feat: initial Next.js 14 project setup with design system"
```

### Step 2: Create GitHub Repository (Optional)

Either:
- Create new repo on GitHub and push
- Or keep local only for now

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? applicreations-redesign
- Directory? ./
- Override settings? No

**Result**: Vercel will provide preview URL (e.g., `applicreations-redesign-xyz.vercel.app`)

## Phase 1 Completion Checklist

Before moving to Phase 2, verify ALL:

- [ ] Next.js 14 project created at `C:\Users\david\Projects\applicreations-redesign\`
- [ ] `npm run dev` starts without errors at localhost:3000
- [ ] TypeScript compiles with zero errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Tailwind configured with LCH colors and design tokens
- [ ] CSS custom properties defined (light + dark mode)
- [ ] Button component built with 4 variants
- [ ] Card component built with hover states
- [ ] Input component built with validation states
- [ ] Link component built (accessible)
- [ ] All components keyboard accessible
- [ ] Focus indicators visible (2px outline)
- [ ] Framer Motion installed and configured
- [ ] Animation constants defined in lib/animations.ts
- [ ] Reduced motion preference respected
- [ ] Git repository initialized
- [ ] First commit made
- [ ] Vercel preview deployment successful
- [ ] README.md documents setup
- [ ] DECISIONS.md created for tracking
- [ ] All project documentation files copied

## Files Created Summary

```
applicreations-redesign/
├── .cursorrules
├── SCOPE.md
├── STATUS.md
├── ALIASES.md
├── USER_GUIDE.md
├── DECISIONS.md
├── README.md
├── package.json (updated)
├── tsconfig.json (strict mode)
├── tailwind.config.ts (design tokens)
├── app/
│   ├── globals.css (custom properties)
│   ├── layout.tsx (default from Next.js)
│   └── page.tsx (default from Next.js)
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Link.tsx
└── lib/
    ├── animations.ts
    └── utils.ts
```

## Next Steps After Phase 1

Once Phase 1 checklist is complete:

1. Update STATUS.md with Phase 1 completion
2. Review Phase 2 in SCOPE.md (Homepage Construction)
3. Type `/next` to begin Phase 2, Task 2.1 (Hero Section)

---

**Ready to execute?** When you're ready, just say "Begin Phase 1" or "/next" and I'll start implementing these tasks step-by-step.

