// FILE: components/MobileNav.tsx  (mobile header + drawer)

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◧' },
  { href: '/courses', label: 'My Courses', icon: '▤' },
  { href: '/library', label: 'Library', icon: '▦' },
  { href: '/community', label: 'Community', icon: '◇' },
  { href: '/profile', label: 'Profile', icon: '◉' },
]

export default function MobileNav({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--m-border)] bg-[var(--m-surface)] sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 text-2xl text-[var(--m-text-muted)] hover:text-[var(--m-text)] active:scale-95 transition"
        >
          ☰
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-bold text-xs">
            M
          </div>
          <span className="text-sm font-bold tracking-tight">MERIDIAN</span>
        </Link>

        <ThemeToggle compact />
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[var(--m-bg)] border-r border-[var(--m-border)] flex flex-col shadow-2xl">
            <div className="px-6 py-6 border-b border-[var(--m-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-bold text-sm">
                  M
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight leading-none">
                    MERIDIAN
                  </div>
                  <div className="text-[10px] tracking-[0.2em] text-[var(--m-text-muted)] mt-0.5">
                    ACADEMY
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-[var(--m-text-muted)] text-2xl leading-none hover:text-[var(--m-text)]"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                      active
                        ? 'bg-[var(--m-cyan-soft)] text-[var(--m-cyan)] border border-cyan-500/20'
                        : 'text-[var(--m-text-muted)] hover:text-[var(--m-text)] hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <span className="text-base w-5 text-center opacity-80">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-3 border-t border-[var(--m-border)] space-y-1">
              <ThemeToggle />
              {userEmail && (
                <div className="px-3 py-2 text-[11px] text-[var(--m-text-dim)] truncate">
                  {userEmail}
                </div>
              )}
              <button
                onClick={signOut}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] hover:bg-white/[0.03] transition"
              >
                ← Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}