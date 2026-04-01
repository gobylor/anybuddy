import type { Metadata } from 'next'
import { Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'AnyBuddy — Pick Any Claude Code Buddy You Want',
  description:
    'Choose your dream Claude Code companion pet. All 18 species, all rarities. Free.',
  keywords: [
    'Claude Code',
    'buddy',
    'reroll',
    'companion',
    'pet',
    'change pet',
    'claude code buddy reroll',
  ],
  openGraph: {
    title: 'AnyBuddy — Pick Any Claude Code Buddy You Want',
    description:
      'Choose your dream Claude Code companion pet. All 18 species, all rarities. Free.',
    url: 'https://anybuddy.cc',
    siteName: 'AnyBuddy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyBuddy — Pick Any Claude Code Buddy You Want',
    description:
      'Choose your dream Claude Code companion pet. All 18 species, all rarities.',
  },
  metadataBase: new URL('https://anybuddy.cc'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={firaCode.variable}>
      <body className="bg-[#0d1117] text-[#e6edf3] font-mono antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
