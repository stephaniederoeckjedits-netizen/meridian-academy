'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import LogoEmblem from './LogoEmblem'
import ThemeToggle from './ThemeToggle'

const NAV_GROUPS = [
  {
    label: 'UNIVERSITY',
    color: '#22d3ee',
    items: [
      { href: '/dashboard', label: 'OVERVIEW', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { href: '/discover',  label: 'SOCIAL HUB', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
      { href: '/courses',   label: 'COURSES', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' },
      { href: '/profile',   label: 'STUDENT', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
    ],
  },
  {
    label: 'KNOWLEDGE',
    color: '#10b981',
    items: [
      { href: '/library',         label: 'LIBRARY', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' },
      { href: '/library/ebooks',  label: 'E-BOOKS', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
      { href: '/library/prompts', label: 'PROMPTS', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { href: '/library/vault',   label: 'VAULT', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    ],
  },
  {
    label: 'COMMUNITY',
    color: '#3b82f6',
    items: [
      { href: '/community',             label: 'THE GATHERING', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
      { href: '/community/news',        label: 'NEWS', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
      { href: '/community/blog',        label: 'BLOG', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      { href: '/community/channels',    label: 'CHANNELS', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { href: '/community/groups',      label: 'GROUPS', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      { href: '/community/leaderboard', label: 'LEADERBOARD', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
      { href: '/community/success',     label: 'SUCCESS', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    ],
  },
]

export default function MobileNav({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#050810]/90 backdrop-blur-md border-b border-white/10 relative z-50 w-full overflow-hidden">
        <button onClick={() => setMenuOpen(true)} className="text-[#8892a6] hover:text-white p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        
        <div className="flex items-center gap-2 truncate max-w-[150px]">
          <LogoEmblem size={24} />
          <span className="text-xs font-bold tracking-[0.2em] text-white truncate">MERIDIAN</span>
        </div>

        <ThemeToggle compact />
      </header>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative w-80 max-w-[85vw] h-full bg-[#0a1018] border-r border-[#22d3ee]/20 shadow-2xl flex flex-col overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <LogoEmblem size={32} />
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-white">MERIDIAN</div>
                  <div className="text-[8px] font-mono tracking-[0.3em] text-[#22d3ee]">ACADEMY</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-[#8892a6] hover:text-white p-2 bg-white/5 rounded-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {NAV_GROUPS.map((group, gi) => (
                <div key={group.label}>
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <span className="text-[9px] font-mono tracking-[0.35em]" style={{ color: group.color }}>{group.label}</span>
                    <span className="flex-1 h-px opacity-30" style={{ background: `linear-gradient(90deg, ${group.color}, transparent)` }} />
                  </div>
                  <div className="space-y-1">
                    {group.items.map((l) => {
                      const active = pathname === l.href || pathname?.startsWith(l.href + '/')
                      return (
                        <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} 
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-colors ${active ? 'bg-[#22d3ee]/10 text-[#22d3ee]' : 'text-[#8892a6] hover:bg-white/5 hover:text-white'}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? '#22d3ee' : group.color }}><path d={l.icon}/></svg>
                          {l.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto p-4 border-t border-white/10 shrink-0">
               <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2.5 rounded-md border border-[#ef4444]/20 bg-[#ef4444]/5 text-[#ef4444] transition-colors flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                <span className="text-[10px] font-mono tracking-[0.25em]">TERMINATE SESSION</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}