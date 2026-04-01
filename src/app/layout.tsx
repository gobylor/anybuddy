import type { Metadata } from 'next'
import { Fira_Code } from 'next/font/google'
import './globals.css'

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'AnyBuddy — Pick Any Claude Code Buddy You Want',
  description:
    'Choose your dream Claude Code companion pet. All 18 species, all rarities. Free.',
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
      </body>
    </html>
  )
}
