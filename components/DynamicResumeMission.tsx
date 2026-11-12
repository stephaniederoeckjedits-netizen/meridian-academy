'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { getResume, ResumeType } from '@/lib/resume'

export default function DynamicResumeMission() {
  const pathname = usePathname()
  const [mission, setMission] = useState({ label: 'CONTINUE LEARNING', title: 'Browse Portal', href: '/courses' })
  const [color, setColor] = useState('#22d3ee')
  const [mounted, setMounted] = useState(false)

  const resolveContext = useCallback(async () => {
    let type: ResumeType = 'course'
    let accent = '#22d3ee'
    let label = 'CONTINUE LEARNING'
    let fallbackHref = '/courses'
    let fallbackTitle = 'Browse Academic Portal'

    if (pathname === '/dashboard' || pathname === '/') {
      accent = '#22d3ee' // Cyan
      label = 'CONTINUE LEARNING'
    } else if (pathname?.startsWith('/courses')) {
      accent = '#10b981' // Emerald Green
      label = 'RESUME COURSE'
      fallbackTitle = 'Browse Courses'
    } else if (pathname?.startsWith('/library/vault')) {
      type = 'vault'
      accent = '#ec4899' // Pink
      label = 'RESUME VAULT'
      fallbackHref = '/library/vault'
      fallbackTitle = 'Explore the Vault'
    } else if (pathname?.startsWith('/library/prompts')) {
      type = 'spec'
      accent = '#8b5cf6' // Violet
      label = 'RESUME SPEC'
      fallbackHref = '/library/prompts'
      fallbackTitle = 'Explore Prompt Specs'
    } else if (pathname?.startsWith('/library')) {
      type = 'ebook'
      accent = '#f59e0b' // Orange
      label = 'RESUME READING'
      fallbackHref = '/library/ebooks'
      fallbackTitle = 'Browse E-Books'
    }

    setColor(accent)

    try {
      const saved = await getResume(type)
      if (saved) {
        setMission({ label, title: saved.title, href: saved.href })
      } else {
        setMission({ label: 'START LEARNING', title: fallbackTitle, href: fallbackHref })
      }
    } catch {
      setMission({ label: 'START LEARNING', title: fallbackTitle, href: fallbackHref })
    }
  }, [pathname])

  useEffect(() => {
    setMounted(true)
    resolveContext()
    const handleUpdate = () => resolveContext()
    window.addEventListener('meridian-resume-updated', handleUpdate)
    return () => window.removeEventListener('meridian-resume-updated', handleUpdate)
  }, [resolveContext])

  if (!mounted) return <div className="h-[84px] w-full bg-[#0a1018] border border-white/5 rounded-2xl animate-pulse" />

  return (
    <Link href={mission.href} className="group relative flex items-center justify-between w-full p-[2px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{ boxShadow: `0 0 30px ${color}20` }}>
      
      <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto]"
           style={{ background: `linear-gradient(90deg, ${color}, #050810, ${color})` }} />
      
      <div className="relative flex items-center justify-between w-full bg-[#050810] rounded-[14px] px-6 py-5 md:px-8 md:py-6 z-10">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-mono tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: color }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            {mission.label}
          </span>
          <span className="text-lg md:text-2xl text-white truncate font-[family-name:var(--font-cinzel)] font-bold tracking-wide transition-all">
            {mission.title}
          </span>
        </div>
        
        <div className="shrink-0 ml-4 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300"
             style={{ backgroundColor: `${color}15`, border: `1px solid ${color}50`, color: color }}
             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.color = '#000' }}
             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${color}15`; e.currentTarget.style.color = color }}>
          <svg className="w-5 h-5 md:w-6 md:h-6 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    </Link>
  )
}