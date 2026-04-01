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
  title: 'AnyBuddy | Claude Code 伙伴选择工具',
  description:
    '选择物种、筛选稀有度，即刻揭晓最适合你的 Claude Code 伙伴档案。',
  keywords: [
    'AnyBuddy',
    'Claude Code',
    'buddy',
    '伙伴选择',
    '伙伴档案',
    '换卡',
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
    title: 'AnyBuddy | Claude Code 伙伴选择工具',
    description:
      '选择物种、筛选稀有度，即刻揭晓你的 Claude Code 伙伴档案。',
    url: 'https://anybuddy.cc',
    siteName: 'AnyBuddy',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyBuddy | Claude Code 伙伴选择工具',
    description:
      '选择物种、筛选稀有度，即刻揭晓你的 Claude Code 伙伴档案。',
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
      lang="zh-CN"
      className={`${manrope.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-bg text-text antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
