import type { Metadata } from 'next'
import { IntrospectBoard } from '@/components/sections/IntrospectBoard'

export const metadata: Metadata = {
  title: 'Introspect — Applicreations',
  description:
    'A short questionnaire about your business so we can build a preview of your custom website.',
}

export default function IntrospectPage() {
  return (
    <main>
      <IntrospectBoard />
    </main>
  )
}
