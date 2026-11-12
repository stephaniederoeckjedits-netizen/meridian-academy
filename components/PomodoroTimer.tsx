'use client'
import { useEffect, useRef, useState } from 'react'
import { addPracticeSeconds } from '@/lib/activity'

type SessionType = 'quick' | 'focus' | 'deep'
const SESSIONS: Record<SessionType, { label: string; mins: number; accent: string }> = {
  quick: { label: '15', mins: 15, accent: '#10b981' },
  focus: { label: '25', mins: 25, accent: '#22d3ee' },
  deep:  { label: '50', mins: 50, accent: '#8b5cf6' },
}
const BREAK_MINS = 5

export default function PomodoroTimer({ userEmail }: { userEmail?: string }) {
  const prefix = userEmail ? userEmail + '_' : 'guest_'
  const [type, setType] = useState<SessionType>('focus')
  const [mode, setMode] = useState<'work' | 'break'>('work')
  const [seconds, setSeconds] = useState(SESSIONS.focus.mins * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [mounted, setMounted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!prefix || prefix === 'guest_') return
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem(prefix + 'm-pomo-date')
    const storedCount = localStorage.getItem(prefix + 'm-pomo-count')
    if (storedDate === today && storedCount) {
      setSessions(parseInt(storedCount))
    } else {
      localStorage.setItem(prefix + 'm-pomo-date', today)
      localStorage.setItem(prefix + 'm-pomo-count', '0')
      setSessions(0)
    }
    setMounted(true)
  }, [prefix])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      if (mode === 'work') { addPracticeSeconds(1, userEmail) }
      setSeconds((s) => {
        if (s <= 1) {
          if (mode === 'work') {
            const today = new Date().toDateString()
            const storedDate = localStorage.getItem(prefix + 'm-pomo-date')
            const storedCount = localStorage.getItem(prefix + 'm-pomo-count')
            const current = storedDate === today && storedCount ? parseInt(storedCount) : 0
            const next = current + 1
            localStorage.setItem(prefix + 'm-pomo-date', today)
            localStorage.setItem(prefix + 'm-pomo-count', String(next))
            setSessions(next)
            setMode('break')
            return BREAK_MINS * 60
          } else {
            setMode('work')
            return SESSIONS[type].mins * 60
          }
        }
        return s - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode, type, prefix])

  function selectType(t: SessionType) {
    setRunning(false); setType(t); setMode('work'); setSeconds(SESSIONS[t].mins * 60)
  }
  function toggle() { setRunning((r) => !r) }
  function reset() { setRunning(false); setMode('work'); setSeconds(SESSIONS[type].mins * 60) }

  if (!mounted) return null

  const total = mode === 'work' ? SESSIONS[type].mins * 60 : BREAK_MINS * 60
  const elapsed = total - seconds
  const pct = (elapsed / total) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isWork = mode === 'work'
  const accent = isWork ? SESSIONS[type].accent : '#f59e0b'
  const R = 40
  const C = 2 * Math.PI * R
  const dash = (pct / 100) * C

  return (
    <div className="brief-box p-4" style={{ '--accent-color': accent } as any}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: accent }}>{isWork ? 'FOCUS' : 'BREAK'}</span>
        </div>
        <span className="text-[10px] font-mono text-[#566074]">{sessions} DONE</span>
      </div>
      <div className="grid grid-cols-3 gap-1 mb-4">
        {(Object.keys(SESSIONS) as SessionType[]).map((k) => {
          const s = SESSIONS[k]; const active = k === type
          return (
            <button key={k} onClick={() => selectType(k)} className="text-[9px] font-mono tracking-[0.2em] py-1.5 rounded transition-all" style={{ color: active ? s.accent : '#566074', background: active ? 'rgba(34,211,238,0.06)' : 'transparent', border: '1px solid ' + (active ? s.accent + '55' : 'rgba(34,211,238,0.12)') }}>{s.label} MIN</button>
          )
        })}
      </div>
      <div className="relative flex items-center justify-center mb-4" style={{ height: 110 }}>
        <svg width="110" height="110" className="absolute -rotate-90">
          <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(30,38,51,0.9)" strokeWidth="3" />
          <circle cx="55" cy="55" r={R} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - dash} style={{ transition: 'stroke-dashoffset 0.5s linear', filter: 'drop-shadow(0 0 6px ' + accent + 'aa)' }} />
        </svg>
        <div className="text-center relative">
          <div className="text-3xl font-bold tabular-nums leading-none" style={{ color: '#a5f3fc', textShadow: '0 0 20px ' + accent + '66' }}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#3a4250] mt-1.5">{isWork ? 'WORK' : 'REST'}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={toggle} className="flex-1 text-black text-[11px] font-bold tracking-[0.2em] uppercase rounded-md py-2.5 transition" style={{ background: accent }}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={reset} className="px-3 border border-[#2d3748] text-[#8892a6] hover:text-[#e5e9f0] hover:border-[#22d3ee]/40 text-xs rounded-md py-2 transition">↺</button>
      </div>
    </div>
  )
}