'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CombatPanel from './CombatPanel'

const RANKS = [
  { name: 'Digital Novice', desc: 'The journey begins.', xp: 0 },
  { name: 'Avid Reader', desc: 'Knowledge becomes habit.', xp: 500 },
  { name: 'Builder', desc: 'You construct, not just consume.', xp: 1500 },
  { name: 'Systems Thinker', desc: 'You see the loops behind the world.', xp: 3000 },
  { name: 'Language Architect', desc: 'You build bridges between minds.', xp: 5000 },
  { name: 'Disciplined Mind', desc: 'Focus is your weapon.', xp: 8000 },
  { name: 'AI Engineer', desc: 'You shape intelligence itself.', xp: 12000 },
  { name: 'Digital Systems Engineer', desc: 'You build the foundations of tomorrow.', xp: 18000 },
  { name: 'Digital Systems Architect', desc: 'Master of complex systems.', xp: 25000 },
  { name: 'Digital Renaissance Architect', desc: 'The pinnacle of interdisciplinary mastery.', xp: 40000 },
]

export default function CommandCenter({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [totalXp, setTotalXp] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isOpen) return
    const supabase = createClient()
    supabase.rpc('meridian_get_player_skills').then(({ data }) => {
      if (data) setTotalXp((data as any[]).reduce((s, r) => s + Number(r.xp || 0), 0))
    })
  }, [isOpen])

  if (!mounted || !isOpen) return null

  let currentRankIndex = 0
  for (let i = 0; i < RANKS.length; i++) {
    if (totalXp >= RANKS[i].xp) currentRankIndex = i
  }
  const currentRank = RANKS[currentRankIndex]
  const nextRank = RANKS[currentRankIndex + 1]
  const progress = nextRank ? ((totalXp - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100 : 100

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6" style={{ perspective: '2000px' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" onClick={onClose} />
      
      {/* Main Panel */}
      <div className="relative w-full max-w-4xl bg-[#050810] border border-[#22d3ee]/30 rounded-2xl shadow-[0_0_80px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-500">
        
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-80" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#0a1018] to-[#050810] relative z-10">
          <h2 className="text-xl md:text-2xl font-[family-name:var(--font-cinzel)] font-bold tracking-[0.2em] text-white flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_12px_#22d3ee]" />
            PLAYER STATS
          </h2>
          <button onClick={onClose} className="p-2 text-[#566074] hover:text-white hover:bg-white/10 bg-white/5 rounded-full transition-all duration-300 group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform duration-300"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-10 overflow-y-auto no-scrollbar flex flex-col gap-12 relative z-10">
          
          {/* 1. SKILLS SECTION (Now First) */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 w-full">
                <span className="text-[11px] font-mono text-[#8892a6] tracking-[0.3em] uppercase shrink-0">Top Skills</span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <span className="text-[10px] font-mono text-[#566074] ml-4 tracking-widest shrink-0">MERIDIAN ENGINE</span>
            </div>
            <div className="bg-[#0a1018]/50 border border-white/5 rounded-xl p-6 md:p-8">
              <CombatPanel />
            </div>
          </div>

          {/* 2. RANK TREE */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[11px] font-mono text-[#8892a6] tracking-[0.3em] uppercase">Progression Path</span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#22d3ee]/30 to-transparent" />
            </div>
            
            <div className="relative border-l-2 border-white/5 ml-4 space-y-8 pb-4">
               {RANKS.map((rank, i) => {
                 const isUnlocked = totalXp >= rank.xp
                 const isActive = i === currentRankIndex
                 
                 return (
                   <div key={rank.name} className="relative pl-8 group">
                     {/* Connecting Line Glow */}
                     {isUnlocked && i !== RANKS.length - 1 && (
                       <div className="absolute top-4 -bottom-8 left-[-2px] w-[2px] bg-gradient-to-b from-[#22d3ee] to-transparent opacity-50" />
                     )}
                     
                     {/* Node Dot */}
                     <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 transition-all duration-700 flex items-center justify-center
                       ${isActive ? 'bg-[#0a1018] border-[#22d3ee] shadow-[0_0_20px_#22d3ee] scale-110' : 
                         isUnlocked ? 'bg-[#10b981] border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#050810] border-white/10'}`}>
                       {isActive && <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-ping" />}
                       {isActive && <span className="absolute w-1.5 h-1.5 rounded-full bg-white" />}
                     </div>
                     
                     <div className="transition-transform duration-300 group-hover:translate-x-1">
                       <div className={`text-base font-bold tracking-wide transition-colors duration-500 ${isActive ? 'text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : isUnlocked ? 'text-white' : 'text-[#3a4250]'}`}>
                         {rank.name}
                       </div>
                       <div className={`text-[11px] font-mono mt-1 ${isActive ? 'text-[#c8d0dd]' : isUnlocked ? 'text-[#8892a6]' : 'text-[#1e2633]'}`}>
                         {rank.desc}
                       </div>
                     </div>
                   </div>
                 )
               })}
            </div>
          </div>

          {/* 3. NEXT RANK PROGRESS */}
          {nextRank && (
            <div className="bg-gradient-to-r from-[#0a1018] to-[#050810] border border-[#22d3ee]/20 rounded-xl p-6 shadow-[inset_0_0_30px_rgba(34,211,238,0.05)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#22d3ee]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4 relative z-10">
                 <div>
                   <div className="text-[10px] font-mono text-[#22d3ee] tracking-widest uppercase mb-1 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" /> Current Rank
                   </div>
                   <div className="text-2xl font-bold text-white font-[family-name:var(--font-cinzel)] tracking-wide">{currentRank.name}</div>
                 </div>
                 <div className="text-left md:text-right">
                   <div className="text-[10px] font-mono text-[#8892a6] mb-1">NEXT: {nextRank.name.toUpperCase()}</div>
                   <div className="text-sm font-mono text-[#22d3ee] font-bold bg-[#22d3ee]/10 px-3 py-1 rounded border border-[#22d3ee]/20">
                     {nextRank.xp - totalXp} XP REMAINING
                   </div>
                 </div>
              </div>
              
              <div className="h-4 bg-black rounded-full overflow-hidden border border-white/10 relative z-10 shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#ec4899] relative transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/50 blur-[2px]" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}