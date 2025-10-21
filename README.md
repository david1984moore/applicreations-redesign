# Applicreations Redesign

Complete redesign of Applicreations.com using Next.js 15 and iOS-inspired design principles.

## Setup

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open http://localhost:3000

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run pre-commit` - Run all checks before committing

## Project Structure

```
applicreations-redesign/
├── app/                  # Next.js App Router
│   ├── globals.css      # Design system CSS
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   └── ui/              # Base UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Link.tsx
├── lib/
│   ├── animations.ts    # Animation constants
│   └── utils.ts         # Utility functions
├── SCOPE.md             # Complete project specifications
├── STATUS.md            # Current progress tracker
├── ALIASES.md           # Command shortcuts
└── DECISIONS.md         # Design decision log
```

## Design System

This project follows a strict design system based on iOS design principles:

- **Colors**: oklch() color space for consistent perception
- **Spacing**: 8-point grid system
- **Typography**: Perfect Fourth (1.333) scale
- **Animation**: Only transform & opacity, with reduced motion support
- **Accessibility**: WCAG AA contrast ratios, keyboard navigation, screen reader support

See `SCOPE.md` for complete design system documentation.

## Development Workflow

This is a complete redesign being built separately from the current live site:

1. **Development**: Work locally on this project
2. **Preview**: Deploy to Vercel preview URL for review
3. **Launch**: Deploy to production when ready

The current live site remains untouched until launch day.

### Troubleshooting

**Internal Server Error / Build Cache Issues:**

If you see "Internal Server Error" in the browser, the `.next` build cache may be corrupted. Fix it with:

```bash
npm run clean    # Removes .next directory
npm run dev      # Restart dev server
# OR use the combined command:
npm run reset    # Cleans and restarts in one command
```

This is a known issue with Next.js Turbopack during active development.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Phase Progress

- [x] Phase 1: Foundation & Design System
- [ ] Phase 2: Homepage Construction
- [ ] Phase 3: Supporting Pages
- [ ] Phase 4: Advanced Features
- [ ] Phase 5: Post-Launch

See `STATUS.md` for detailed progress tracking.
