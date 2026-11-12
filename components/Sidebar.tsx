'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { triggerNav } from './NavLoader'
import { unlockAudio, playSelectSound, playConfirmSound } from '@/lib/sounds'
import { getActiveZone, onZoneChange } from '@/lib/navZone'

const NAV_GROUPS = [
  {
    label: 'UNIVERSITY',
    color: '#22d3ee',
    items: [
      { href: '/dashboard', label: 'OVERVIEW', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
      { href: '/discover',  label: 'MERIDIAN HUB', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
      { href: '/courses',   label: 'COURSES', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg> },
      { href: '/profile',   label: 'STUDENT', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ],
  },
  {
    label: 'KNOWLEDGE',
    color: '#10b981',
    items: [
      { href: '/library',         label: 'LIBRARY', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg> },
      { href: '/library/ebooks',  label: 'E-BOOKS', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
      { href: '/library/prompts', label: 'PROMPTS', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
      { href: '/library/vault',   label: 'VAULT', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg> },
    ],
  },
  {
    label: 'COMMUNITY',
    color: '#3b82f6',
    items: [
      { href: '/community',             label: 'THE GATHERING', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/></svg> },
      { href: '/community/news',        label: 'NEWS', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg> },
      { href: '/community/blog',        label: 'BLOG', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
      { href: '/community/channels',    label: 'CHANNELS', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
      { href: '/community/groups',      label: 'GROUPS', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
      { href: '/community/leaderboard', label: 'LEADERBOARD', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> },
      { href: '/community/success',     label: 'SUCCESS', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg> },
    ],
  },
]

const NAV = NAV_GROUPS.flatMap((g) => g.items)

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const path = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState(0)
  const [zoneActive, setZoneActive] = useState(getActiveZone() === 'sidebar')
  const [hovered, setHovered] = useState<number | null>(null)

  const selectedRef = useRef(0)
  const routerRef = useRef(router)

  useEffect(() => { selectedRef.current = selected }, [selected])
  useEffect(() => { routerRef.current = router }, [router])

  const activeIndex = NAV.reduce<number>((best, item, i) => {
    const matches = path === item.href || path?.startsWith(item.href + '/')
    if (!matches) return best
    if (best === -1 || item.href.length > NAV[best].href.length) return i
    return best
  }, -1)

  useEffect(() => {
    if (activeIndex >= 0) setSelected(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    return onZoneChange((z) => setZoneActive(z === 'sidebar'))
  }, [])

  useEffect(() => {
    if (!zoneActive) return
    function onKey(e: KeyboardEvent) {
      const active = document.activeElement as HTMLElement | null
      if (active) {
        const tag = active.tagName.toLowerCase()
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || active.isContentEditable) return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); unlockAudio(); playSelectSound()
        setSelected((s) => { const next = (s + 1) % NAV.length; selectedRef.current = next; return next })
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault(); unlockAudio(); playSelectSound()
        setSelected((s) => { const next = (s - 1 + NAV.length) % NAV.length; selectedRef.current = next; return next })
      } else if (e.key === 'Enter') {
        e.preventDefault(); unlockAudio(); playConfirmSound()
        const item = NAV[selectedRef.current]
        if (item) { triggerNav(); routerRef.current.push(item.href) }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [zoneActive])

  async function quitToMainMenu() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside data-nav-zone="sidebar" className="hidden md:flex md:flex-col w-64 shrink-0 h-full relative overflow-hidden bg-[#050810] border-r border-[#22d3ee]/10">
      <div className="p-4 border-b border-white/5 shrink-0 relative z-10">
                <Link href="/" onClick={() => { unlockAudio(); playConfirmSound(); triggerNav(); }} className="flex items-center gap-3 group relative rounded-md px-2 py-2 -mx-1 transition-all hover:bg-[#22d3ee]/10">
  <div className="w-10 h-10 rounded-lg border border-[#22d3ee]/30 bg-[#22d3ee]/5 flex items-center justify-center text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  </div>
  <div className="min-w-0 flex-1">
    <div className="text-[11px] font-bold tracking-[0.2em] text-white leading-none group-hover:text-[#22d3ee] transition-colors">MAIN MENU</div>
    <div className="text-[8px] font-mono tracking-[0.3em] text-[#566074] mt-1 group-hover:text-[#8892a6] transition-colors">RETURN TO HUB</div>
  </div>
</Link>
      </div>

      <nav className="flex-1 min-h-0 px-3 pt-4 pb-4 overflow-y-auto no-scrollbar relative z-10">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
            <div className="flex items-center gap-2 px-2 mb-2">
              <span className="text-[9px] font-mono tracking-[0.35em]" style={{ color: group.color }}>{group.label}</span>
              <span className="flex-1 h-px opacity-30" style={{ background: `linear-gradient(90deg, ${group.color}, transparent)` }} />
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const idx = NAV.findIndex((n) => n.href === item.href)
                const isActive = idx === activeIndex
                const isSelected = selected === idx
                const showSelected = isSelected && zoneActive
                const isHover = hovered === idx
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => { unlockAudio(); playConfirmSound(); triggerNav(); }}
                    onMouseEnter={() => { setHovered(idx); if (selected !== idx) setSelected(idx) }}
                    onMouseLeave={() => setHovered(null)}
                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-bold tracking-[0.18em] transition-all duration-200 ${
                      showSelected
                        ? 'bg-gradient-to-r from-[#22d3ee]/20 to-transparent border border-[#22d3ee]/50 text-white'
                        : isActive
                        ? 'bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-white'
                        : isHover
                        ? 'bg-[#22d3ee]/5 text-[#c8d0dd]'
                        : 'text-[#8892a6] border border-transparent'
                    }`}
                  >
                    <span className="shrink-0 transition-colors" style={{ color: showSelected || isActive ? '#22d3ee' : group.color }}>
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {showSelected && <span className="w-1 h-1 rounded-full bg-[#22d3ee] animate-pulse" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 shrink-0 relative z-10">
        <button onClick={quitToMainMenu} className="w-full text-left px-3 py-2.5 rounded-md border border-[#ef4444]/20 bg-[#ef4444]/5 text-[#566074] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors flex items-center gap-2.5 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
          <span className="text-[10px] font-mono tracking-[0.25em]">TERMINATE SESSION</span>
        </button>
        <div className="rounded-md px-3 py-2.5 flex items-center justify-end gap-2 border border-[#22d3ee]/10 bg-[#22d3ee]/5">
          {userEmail && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981] shrink-0" />
              <div className="text-[10px] font-mono truncate max-w-[110px] tracking-wider text-[#8892a6]">{userEmail.split('@')[0]}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}