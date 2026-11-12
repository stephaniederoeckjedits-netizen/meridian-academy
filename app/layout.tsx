// FILE: app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import NavLoader from '@/components/NavLoader'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Meridian Academy',
  description: 'Master Dutch and English. For real this time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={inter.variable}>
      <body>
        <ThemeProvider>
          <NavLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}