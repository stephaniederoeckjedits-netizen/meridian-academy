// FILE: components/ThemeToggle.tsx

'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = (localStorage.getItem('m-theme') as 'dark' | 'light') || 'dark'
    setTheme(stored)
    setMounted(true)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('m-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  if (!mounted) return null

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="p-2 rounded-lg text-[var(--m-text-muted)] hover:text-[var(--m-text)] hover:bg-white/[0.03] transition text-lg"
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] hover:bg-white/[0.03] transition"
    >
      <span className="text-base w-5 text-center opacity-80">
        {theme === 'dark' ? '☀' : '☾'}
      </span>
      <span className="font-medium">
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  )
}