import type { Metadata } from 'next'
import { ContactBoard } from '@/components/sections/ContactBoard'

export const metadata: Metadata = {
  title: 'Contact — Applicreations',
  description:
    'Get in touch about a custom website or app. Tell us your name, email, and phone — we will reply soon.',
}

export default function ContactPage() {
  return (
    <main>
      <ContactBoard />
    </main>
  )
}
