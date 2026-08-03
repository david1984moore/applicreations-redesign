import type { Metadata } from 'next'
import { Fraunces, Playfair_Display, Poppins, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  display: 'swap',
})

/** Caramel & Jo display face */
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

/** Mi Gente Bonita display face */
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Applicreations — Custom apps and websites',
  description:
    'Friendly custom websites and apps for local businesses. Simple pricing. Clear next steps.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${sourceSans.variable} ${playfair.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
