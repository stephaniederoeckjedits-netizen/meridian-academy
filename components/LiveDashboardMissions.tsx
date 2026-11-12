'use client'

import { useState, useEffect } from 'react'

interface Mission {
  id: number
  text: string
  completed: boolean
}

export default function LiveDashboardMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [shards, setShards] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Read the live state from the Command Center extension
    const savedMissions = localStorage.getItem('meridian_missions')
    const savedShards = localStorage.getItem('meridian_shards')
    
    if (savedMissions) setMissions(JSON.parse(savedMissions))
    if (savedShards) setShards(parseInt(savedShards))
    
    setLoaded(true)
  }, [])

  if (!loaded) return <div className="h-64 animate-pulse bg-white/5 rounded-lg" />

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-[0.1em] uppercase">
          Active Directives
        </h2>
        <div className="text-[10px] font-mono text-[#22d3ee] bg-[#22d3ee]/10 px-2 py-1 rounded border border-[#22d3ee]/20 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.5 14.2H4.5L12 5.8zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg>
          {shards} SHARDS
        </div>
      </div>
      
      <div className="uni-panel flex-1 overflow-hidden flex flex-col">
        <div className="p-2 border-b border-white/10 bg-white/[0.02]">
          <span className="text-[9px] font-mono text-[#8892a6] tracking-widest uppercase px-2">Daily Protocol Sync</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {missions.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-[#566074]">
              Open the Command Center to view directives.
            </div>
          ) : (
            missions.map(mission => (
              <div key={mission.id} className="mission-row">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${mission.completed ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' : 'border-white/20 text-transparent'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className={`text-xs font-mono tracking-wide ${mission.completed ? 'text-[#e5e9f0]' : 'text-[#8892a6]'}`}>
                  {mission.text}
                </span>
                {mission.completed && (
                  <span className="ml-auto text-[10px] font-mono text-[#10b981] font-bold">+25 XP</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}