import type { Metadata } from 'next'
import { Fira_Code, Manrope, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'AnyBuddy | Pick the exact Claude Code buddy you want',
  description:
    'A small utility by Lor —— AI Builder. Pick the exact Claude Code buddy you want, browse all 18 species and rarities, and copy a matching user ID instantly.',
  keywords: [
    'AnyBuddy',
    'Claude Code',
    'buddy',
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
    title: 'AnyBuddy | Pick the exact Claude Code buddy you want',
    description:
      'A small utility by Lor —— AI Builder. Pick the exact Claude Code buddy you want and get a matching user ID instantly.',
    url: 'https://anybuddy.cc',
    siteName: 'AnyBuddy',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyBuddy | Pick the exact Claude Code buddy you want',
    description:
      'A small utility by Lor —— AI Builder. Pick the exact Claude Code buddy you want and copy a matching user ID instantly.',
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
      className={`${manrope.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}
    >
      <body className="bg-bg text-text antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
