import type { Metadata } from 'next'
import {
  Cormorant_Garamond,
  IBM_Plex_Mono,
  Manrope,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'AnyBuddy | Editorial buddy selection sheet for Claude Code',
  description:
    'Choose a species, refine the rarity, and reveal the right Claude Code companion dossier in a light editorial selection sheet.',
  keywords: [
    'AnyBuddy',
    'Claude Code',
    'buddy',
    'selection sheet',
    'companion dossier',
    'reroll',
    'companion',
    'pet',
    'change pet',
    'user ID',
    'pick Claude Code buddy',
    'Claude Code companion',
    'claude code buddy reroll',
    'claude code buddy user id',
    'Claude Code buddy change',
    'Any Buddy You Want',
    '抽卡靠运气，换卡靠 AnyBuddy',
    'Claude Code buddy 换卡',
    'Claude Code buddy 更换',
  ],
  alternates: {
    canonical: 'https://anybuddy.cc',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'AnyBuddy | Editorial buddy selection sheet for Claude Code',
    description:
      'Choose a species, refine the rarity, and reveal a Claude Code companion dossier instantly.',
    url: 'https://anybuddy.cc',
    siteName: 'AnyBuddy',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyBuddy | Editorial buddy selection sheet for Claude Code',
    description:
      'Choose a species, refine the rarity, and reveal a Claude Code companion dossier instantly.',
  },
  metadataBase: new URL('https://anybuddy.cc'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-bg text-text antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
