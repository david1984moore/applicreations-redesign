import type { Metadata } from 'next'
import { AboutBoard } from '@/components/sections/AboutBoard'

export const metadata: Metadata = {
  title: 'About — Applicreations',
  description:
    'Meet David Moore — founder of Applicreations. Human-centered web design for small local businesses.',
}

export default function AboutPage() {
  return (
    <main>
      <AboutBoard />
    </main>
  )
}
