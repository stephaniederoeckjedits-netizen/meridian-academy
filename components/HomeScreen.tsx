'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { triggerNav } from './NavLoader'

const MENU_GROUPS = [
  {
    label: 'UNIVERSITY',
    color: '#22d3ee',
    items: [
      { id: 'overview', label: 'OVERVIEW', sub: 'COMMAND CENTER', href: '/dashboard', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
      { id: 'hub', label: 'MERIDIAN HUB', sub: 'COMMUNITY LEARNING', href: '/discover', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
      { id: 'courses', label: 'COURSES', sub: 'ACADEMIC CURRICULUM', href: '/courses', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
      { id: 'student', label: 'STUDENT', sub: 'YOUR IDENTITY', href: '/profile', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ]
  },
  {
    label: 'KNOWLEDGE',
    color: '#10b981',
    items: [
      { id: 'library', label: 'LIBRARY', sub: 'KNOWLEDGE ARCHIVES', href: '/library', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg> },
      { id: 'ebooks', label: 'E-BOOKS', sub: 'DIGITAL MANUSCRIPTS', href: '/library/ebooks', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
      { id: 'prompts', label: 'PROMPTS', sub: 'ENGINEERING SPECS', href: '/library/prompts', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
      { id: 'vault', label: 'VAULT', sub: 'KNOWLEDGE FRAGMENTS', href: '/library/vault', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
    ]
  },
  {
    label: 'COMMUNITY',
    color: '#3b82f6',
    items: [
      { id: 'gathering', label: 'THE GATHERING', sub: 'COMMUNITY HUB', href: '/community', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { id: 'news', label: 'NEWS', sub: 'WORLD INTELLIGENCE', href: '/community/news', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg> },
      { id: 'blog', label: 'BLOG', sub: 'EDITORIALS', href: '/community/blog', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> },
      { id: 'channels', label: 'CHANNELS', sub: 'REAL-TIME CHAT', href: '/community/channels', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
      { id: 'groups', label: 'GROUPS', sub: 'STUDY TOGETHER', href: '/community/groups', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
      { id: 'leaderboard', label: 'LEADERBOARD', sub: 'COHORT RANKING', href: '/community/leaderboard', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> },
      { id: 'success', label: 'SUCCESS', sub: 'STUDENT STORIES', href: '/community/success', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg> },
    ]
  }
]

const ALL_ITEMS = MENU_GROUPS.flatMap(g => g.items)

export default function HomeScreen() {
  const router = useRouter()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => (s + 1) % ALL_ITEMS.length) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => (s - 1 + ALL_ITEMS.length) % ALL_ITEMS.length) }
      else if (e.key === 'Enter') { e.preventDefault(); handleNavigate(ALL_ITEMS[selected].href) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, router])

  function handleNavigate(href: string) {
    triggerNav()
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Bulletproof Background Image */}
      <img 
        src="/main-bg.jpg?v=7" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050810_90%)] opacity-80" />

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        <div className="w-full bg-[#0a1018]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <span className="flex items-center gap-2 text-[#22d3ee] font-mono text-xs tracking-[0.2em] uppercase font-bold">
              <span className="w-2 h-2 bg-[#22d3ee] rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" /> MAIN MENU
            </span>
            <span className="text-[10px] font-mono text-[#566074] tracking-widest uppercase">V2.0</span>
          </div>

          <div className="p-3 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
            {MENU_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <span className="text-[10px] font-mono tracking-[0.3em]" style={{ color: group.color }}>{group.label}</span>
                  <span className="flex-1 h-px opacity-30" style={{ background: `linear-gradient(90deg, ${group.color}, transparent)` }} />
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const globalIdx = ALL_ITEMS.findIndex(i => i.id === item.id)
                    const isSelected = selected === globalIdx
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.href)}
                        onMouseEnter={() => setSelected(globalIdx)}
                        className={`group w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 text-left relative overflow-hidden ${
                          isSelected 
                            ? 'bg-gradient-to-r from-[#22d3ee]/20 to-transparent border border-[#22d3ee]/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] scale-[1.02]' 
                            : 'border border-transparent hover:bg-white/5'
                        }`}
                      >
                        {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />}
                        
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isSelected ? 'bg-[#22d3ee] text-black shadow-[0_0_25px_rgba(34,211,238,0.6)]' : 'bg-white/5'
                        }`} style={{ color: isSelected ? '#000' : group.color }}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 relative z-10">
                          <div className={`text-sm font-bold tracking-widest font-[family-name:var(--font-cinzel)] ${isSelected ? 'text-white' : 'text-[#e5e9f0]'}`}>
                            {item.label}
                          </div>
                          <div className="text-[9px] font-mono text-[#566074] tracking-widest uppercase mt-0.5">
                            {item.sub}
                          </div>
                        </div>
                        <div className={`relative z-10 transition-transform duration-300 ${isSelected ? 'translate-x-2 text-[#22d3ee]' : 'text-[#3a4250]'}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}