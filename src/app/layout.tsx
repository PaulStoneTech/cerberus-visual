// src/app/layout.tsx
import './globals.css'
import EnhancedSiteHeader from '@/components/EnhancedSiteHeader.tsx'
import { Unbounded } from 'next/font/google'

const unbounded = Unbounded({ subsets: ['latin'], weight: ['400', '700'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={unbounded.className}>
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <EnhancedSiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}