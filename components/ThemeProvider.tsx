// FILE: components/ThemeProvider.tsx

'use client'

import { useEffect } from 'react'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const stored = (localStorage.getItem('m-theme') as 'dark' | 'light') || 'dark'
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  return <>{children}</>
}