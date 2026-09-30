// FILE: components/Sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◧' },
  { href: '/courses', label: 'My Courses', icon: '▤' },
  { href: '/community', label: 'Community', icon: '◇' },
  { href: '/profile', label: 'Profile', icon: '◉' },
]

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[var(--m-border)] bg-[var(--m-bg)]">
      <Link href="/" className="px-6 py-6 border-b border-[var(--m-border)] block">
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
      </Link>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? 'bg-[var(--m-cyan-soft)] text-[var(--m-cyan)] border border-cyan-500/20'
                  : 'text-[var(--m-text-muted)] hover:text-[var(--m-text)] hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className="text-base w-5 text-center opacity-80">{item.icon}</span>
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
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] hover:bg-white/[0.03] transition"
        >
          ← Sign out
        </button>
      </div>
    </aside>
  )
}