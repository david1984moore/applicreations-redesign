import type { Metadata } from 'next'
import { Fraunces, Playfair_Display, Poppins, Source_Sans_3 } from 'next/font/google'
import { getSiteUrl } from '@/lib/site'
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

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Applicreations — Custom apps and websites',
  description:
    'Friendly custom websites and apps for local businesses. Simple pricing. Clear next steps.',
  applicationName: 'Applicreations',
  icons: {
    icon: [{ url: '/logo-mark.png', type: 'image/png' }],
    apple: [{ url: '/logo-mark.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'applicreations.com',
    title: 'applicreations.com',
    description:
      'Friendly custom websites and apps for local businesses. Simple pricing. Clear next steps.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.png?v=20260824',
        width: 1200,
        height: 630,
        alt: 'Applicreations — Custom apps and websites',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applicreations — Custom apps and websites',
    description:
      'Friendly custom websites and apps for local businesses. Simple pricing. Clear next steps.',
    images: ['/og-image.png?v=20260824'],
  },
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
