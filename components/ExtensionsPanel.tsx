'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PomodoroTimer from './PomodoroTimer'
import QuickNotes from './QuickNotes'
import StudyStreak from './StudyStreak'
import DailyGoal from './DailyGoal'
import QuickFlashcard from './QuickFlashcard'
import SkillTree from './SkillTree'
import { triggerNav } from './NavLoader'

export default function ExtensionsPanel() {
  const pathname = usePathname()
  const isLibrary = pathname?.startsWith('/library')
  const isCourse = pathname?.startsWith('/courses') || pathname?.startsWith('/dashboard')
  const isComms = pathname?.startsWith('/community')

  return (
    <aside className="flex flex-col w-80 h-full shrink-0 bg-[#050810] border-l border-[#22d3ee]/20 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0 border-white/10 sticky top-0 bg-[#050810]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shrink-0 shadow-[0_0_10px_#22d3ee]" />
          <div className="text-[11px] font-mono tracking-[0.2em] text-white font-bold">
            {isLibrary ? 'LIBRARY PORTAL' : isComms ? 'COMMS PORTAL' : 'ACADEMIC PORTAL'}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 pb-24">
        <div className="m-hud-panel p-4">
          <span className="m-hud-scan" />
          <div className="m-hud-header mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#8b5cf6] animate-pulse" />
              ARCHITECT PROGRESS
            </div>
          </div>
          <SkillTree />
        </div>

        {isLibrary && (
          <>
            <div className="m-hud-panel">
              <span className="m-hud-scan" />
              <div className="m-hud-header">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#f59e0b]" />
                  CONTINUE READING
                </div>
              </div>
              <div className="p-4 space-y-3">
                <Link href="/library/ebooks/the-language-architect/read?resume=true" onClick={triggerNav} className="flex items-start gap-2 group">
                  <span className="text-[#f59e0b] text-xs mt-0.5 group-hover:translate-x-1 transition-transform">▸</span>
                  <div>
                    <div className="text-[11px] text-white font-bold leading-tight group-hover:text-[#f59e0b] transition-colors">The Language Architect</div>
                    <div className="text-[9px] text-[#8892a6] font-mono mt-1">RESUME</div>
                  </div>
                </Link>
                <Link href="/library/ebooks/systems-and-structure/read?resume=true" onClick={triggerNav} className="flex items-start gap-2 group opacity-70 hover:opacity-100 transition-opacity">
                  <span className="text-[#566074] text-xs mt-0.5 group-hover:translate-x-1 transition-transform">▸</span>
                  <div>
                    <div className="text-[11px] text-[#8892a6] leading-tight group-hover:text-white transition-colors">Systems & Structure</div>
                    <div className="text-[9px] text-[#566074] font-mono mt-1">START</div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="m-hud-panel">
              <span className="m-hud-scan" />
              <div className="m-hud-header">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
                  QUICK VAULT
                </div>
              </div>
              <div className="p-4">
                 <p className="text-[10px] text-[#8892a6]">New entry on AI Engineering available in the Vault.</p>
                 <Link href="/library/vault" onClick={triggerNav} className="mt-3 block text-[9px] font-mono text-[#22d3ee] hover:text-white">OPEN VAULT →</Link>
              </div>
            </div>
          </>
        )}

        {isCourse && (
          <>
            <StudyStreak />
            <DailyGoal />
            <PomodoroTimer />
            <QuickFlashcard />
            <QuickNotes />
          </>
        )}

        {isComms && (
          <div className="m-hud-panel">
            <span className="m-hud-scan" />
            <div className="m-hud-header">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
                NETWORK STATUS
              </div>
            </div>
            <div className="p-4 space-y-3">
               <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#8892a6]">System secure.</span>
                  <span className="text-[#10b981] font-mono">124 ONLINE</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}