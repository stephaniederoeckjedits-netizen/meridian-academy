'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getResume } from '@/lib/resume'
import PomodoroTimer from './PomodoroTimer'
import StudyStreak from './StudyStreak'
import DailyGoal from './DailyGoal'
import QuickNotes from './QuickNotes'
import QuickFlashcard from './QuickFlashcard'
import QuickActions from './QuickActions'
import SyllabusProgress from './SyllabusProgress'

const VAULT_FRAGMENTS = [
  "First principles thinking dismantles complex problems into fundamental truths.",
  "Systems thinking sees interrelationships, not linear cause-effect chains.",
  "Mental models are simplified representations of how the world works.",
  "Entropy is the default. Order requires deliberate energy.",
  "The map is not the territory. Models are not reality.",
]

export default function ContextSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [randomFragment, setRandomFragment] = useState(VAULT_FRAGMENTS[0])
  
  const [ebookResume, setEbookResume] = useState<{title: string, href: string} | null>(null)
  const [vaultResume, setVaultResume] = useState<{title: string, href: string} | null>(null)
  const [specResume, setSpecResume] = useState<{title: string, href: string} | null>(null)

  useEffect(() => {
    setMounted(true)
    setRandomFragment(VAULT_FRAGMENTS[Math.floor(Math.random() * VAULT_FRAGMENTS.length)])
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/library/vault')) {
      setRandomFragment(VAULT_FRAGMENTS[Math.floor(Math.random() * VAULT_FRAGMENTS.length)])
      getResume('vault').then(r => setVaultResume(r))
    }
    if (pathname.startsWith('/library/ebooks')) {
      getResume('ebook').then(r => setEbookResume(r))
    }
    if (pathname.startsWith('/library/prompts')) {
      getResume('spec').then(r => setSpecResume(r))
    }
  }, [pathname])

  if (!mounted) return <aside className="w-full border-l border-white/5 bg-[#020408] h-full" />

  let portalType = 'SYSTEM PORTAL', portalName = 'Overview', accentColor = '#22d3ee'
  if (pathname === '/dashboard') { portalType = 'COMMAND PORTAL'; portalName = 'System Core'; accentColor = '#22d3ee' }
  else if (pathname.startsWith('/discover')) { portalType = 'MEDIA PORTAL'; portalName = 'The Meridian Hub'; accentColor = '#ec4899' }
  else if (pathname.startsWith('/courses')) { portalType = 'STUDENT PORTAL'; portalName = 'Academics'; accentColor = '#10b981' }
  else if (pathname.startsWith('/library/ebooks')) { portalType = 'READER PORTAL'; portalName = 'Manuscripts'; accentColor = '#f59e0b' }
  else if (pathname.startsWith('/library/prompts')) { portalType = 'ENGINEER PORTAL'; portalName = 'Prompt Specs'; accentColor = '#8b5cf6' }
  else if (pathname.startsWith('/library/vault')) { portalType = 'DATA PORTAL'; portalName = 'Knowledge Vault'; accentColor = '#ec4899' }
  else if (pathname.startsWith('/library')) { portalType = 'ARCHIVES PORTAL'; portalName = 'The Library'; accentColor = '#22d3ee' }
  else if (pathname.startsWith('/community')) { portalType = 'COMMS PORTAL'; portalName = 'Network'; accentColor = '#3b82f6' }
  else if (pathname.startsWith('/profile')) { portalType = 'OPERATOR PORTAL'; portalName = 'Identity'; accentColor = '#c084fc' }

  return (
    <aside className="w-full h-full border-l border-white/5 bg-[#020408] flex flex-col shrink-0">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest mb-2 font-bold" style={{ color: accentColor }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
          {portalType}
        </div>
        <h2 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white uppercase tracking-wider">{portalName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        
        {pathname === '/dashboard' && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Daily Directives</h3>
              <p className="text-xs font-mono text-[#c8d0dd] mb-3">Complete 2 focus sessions to claim today's shard bonus.</p>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5"><div className="w-[50%] h-full" style={{ backgroundColor: accentColor }} /></div>
            </div>
            <StudyStreak userEmail={userEmail} />
            <DailyGoal userEmail={userEmail} />
            <QuickActions />
          </>
        )}

                {pathname.startsWith('/discover') && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Media Automations</h3>
              <p className="text-xs font-mono text-[#c8d0dd] mb-3">Sync Engine Active. Fetching legal educational media.</p>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5"><div className="w-[80%] h-full" style={{ backgroundColor: accentColor }} /></div>
            </div>
            <PomodoroTimer userEmail={userEmail} />
            <QuickNotes userEmail={userEmail} />
            <QuickActions />
          </>
        )}


        {pathname.startsWith('/courses') && (
          <>
            <SyllabusProgress userEmail={userEmail} />
            <PomodoroTimer userEmail={userEmail} />
            <QuickNotes userEmail={userEmail} />
            <QuickActions />
          </>
        )}

        {pathname === '/library' && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Archive Index</h3>
              <div className="space-y-2 text-[11px] font-mono text-[#8892a6]">
                <div className="flex justify-between"><span>Ebooks</span> <span className="text-white">7</span></div>
                <div className="flex justify-between"><span>Specs</span> <span className="text-white">68</span></div>
                <div className="flex justify-between"><span>Vault Fragments</span> <span className="text-white">77</span></div>
              </div>
            </div>
            <StudyStreak userEmail={userEmail} />
            <QuickActions />
          </>
        )}

        {pathname.startsWith('/library/ebooks') && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Continue Reading</h3>
              {ebookResume ? (
                <Link href={ebookResume.href} className="block group">
                  <div className="text-sm font-bold text-white mb-1 group-hover:text-[#f59e0b] transition-colors font-[family-name:var(--font-cinzel)]">{ebookResume.title}</div>
                  <div className="text-[9px] font-mono text-[#8892a6] mb-3">RESUME READING</div>
                  <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-white/5"><div className="w-[50%] h-full" style={{ backgroundColor: accentColor }} /></div>
                </Link>
              ) : (
                <div className="text-[11px] font-mono text-[#566074]">No recent reading history.</div>
              )}
            </div>
            <PomodoroTimer userEmail={userEmail} />
            <QuickNotes userEmail={userEmail} />
            <QuickActions />
          </>
        )}

        {pathname.startsWith('/library/prompts') && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Recent Protocol</h3>
              {specResume ? (
                <Link href={specResume.href} className="block group">
                  <div className="text-sm font-bold text-white mb-1 group-hover:text-[#8b5cf6] transition-colors font-[family-name:var(--font-cinzel)]">{specResume.title}</div>
                  <div className="text-[9px] font-mono text-[#8892a6] mb-3">RESUME SPEC</div>
                  <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-white/5"><div className="w-[50%] h-full" style={{ backgroundColor: accentColor }} /></div>
                </Link>
              ) : (
                <div className="text-[11px] font-mono text-[#566074]">No recent prompt history.</div>
              )}
            </div>
            <QuickNotes userEmail={userEmail} />
            <QuickActions />
          </>
        )}

        {pathname.startsWith('/library/vault') && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Continue Vault</h3>
              {vaultResume ? (
                <Link href={vaultResume.href} className="block group">
                  <div className="text-sm font-bold text-white mb-1 group-hover:text-[#ec4899] transition-colors font-[family-name:var(--font-cinzel)]">{vaultResume.title}</div>
                  <div className="text-[9px] font-mono text-[#8892a6] mb-3">RESUME VAULT</div>
                  <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-white/5"><div className="w-[50%] h-full" style={{ backgroundColor: accentColor }} /></div>
                </Link>
              ) : (
                <div className="text-[11px] font-mono text-[#566074]">No recent vault history.</div>
              )}
            </div>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Random Fragment</h3>
              <p className="text-xs font-mono text-[#c8d0dd] italic mb-3">"{randomFragment}"</p>
              <button onClick={() => setRandomFragment(VAULT_FRAGMENTS[Math.floor(Math.random() * VAULT_FRAGMENTS.length)])} className="w-full py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono tracking-widest uppercase hover:bg-white/10 transition-colors" style={{ color: accentColor }}>Cycle Fragment</button>
            </div>
            <QuickFlashcard userEmail={userEmail} />
            <QuickNotes userEmail={userEmail} />
            <QuickActions />
          </>
        )}

        {pathname.startsWith('/community') && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Network Status</h3>
              <p className="text-xs font-mono text-[#c8d0dd]">System secure. 124 architects online.</p>
            </div>
            <DailyGoal userEmail={userEmail} />
            <QuickActions />
          </>
        )}

        {pathname.startsWith('/profile') && (
          <>
            <div className="brief-box p-4" style={{ '--accent-color': accentColor } as any}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Operator Status</h3>
              <p className="text-xs font-mono text-[#c8d0dd]">Account secured.</p>
            </div>
            <QuickActions />
          </>
        )}
      </div>

      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="text-[10px] font-mono text-[#566074] text-center uppercase tracking-widest">Meridian OS v1.0</div>
      </div>
    </aside>
  )
}