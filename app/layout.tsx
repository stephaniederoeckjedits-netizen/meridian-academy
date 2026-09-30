// FILE: app/layout.tsx

import type { Metadata } from 'next'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meridian Academy',
  description: 'Master Dutch and English. For real this time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}