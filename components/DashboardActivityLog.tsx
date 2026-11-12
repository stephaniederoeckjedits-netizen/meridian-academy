'use client'

import { useState, useEffect } from 'react'

interface LogEvent {
  timestamp: number
  action: string
  xp: number
}

export default function DashboardActivityLog({ userEmail }: { userEmail?: string }) {
  const [log, setLog] = useState<LogEvent[]>([])
  const [loaded, setLoaded] = useState(false)
  const prefix = userEmail ? userEmail + '_' : 'guest_'

  useEffect(() => {
    if (!prefix || prefix === 'guest_') {
      setLoaded(true)
      return
    }
    const savedLog = localStorage.getItem(prefix + 'meridian_log')
    if (savedLog) setLog(JSON.parse(savedLog))
    setLoaded(true)
  }, [prefix])

  if (!loaded) return <div className="p-4 animate-pulse text-xs font-mono text-[#566074]">Syncing logs...</div>

  if (log.length === 0) {
    return <div className="p-8 text-center text-xs font-mono text-[#566074]">No activity logged today. Open the Command Center to begin.</div>
  }

  return (
    <div>
      {log.map((event, i) => (
        <div key={i} className="ps5-log-row">
          <span className="text-[#10b981] font-bold mt-0.5">[OK]</span>
          <div className="flex-1">
            <div className="text-[#e5e9f0] font-bold">{event.action}</div>
            <div className="text-[9px] text-[#566074]">{new Date(event.timestamp).toLocaleTimeString()}</div>
          </div>
          <span className="text-[#22d3ee] font-bold text-sharp-cyan">+{event.xp} XP</span>
        </div>
      ))}
    </div>
  )
}