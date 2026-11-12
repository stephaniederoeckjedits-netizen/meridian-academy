'use client'
import { useEffect, useState } from 'react'

const TIERS = [
  { min: 0,  label: 'INITIATE', accent: '#566074' },
  { min: 1,  label: 'BRONZE',   accent: '#cd7c4a' },
  { min: 3,  label: 'SILVER',   accent: '#a5b4c4' },
  { min: 7,  label: 'GOLD',     accent: '#f59e0b' },
  { min: 14, label: 'PLATINUM', accent: '#22d3ee' },
  { min: 30, label: 'MERIDIAN', accent: '#a5f3fc' },
]
const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function getTier(days: number) {
  let t = TIERS[0]
  for (const tier of TIERS) if (days >= tier.min) t = tier
  return t
}

export default function StudyStreak({ userEmail }: { userEmail?: string }) {
  const prefix = userEmail ? userEmail + '_' : 'guest_'
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [total, setTotal] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [week, setWeek] = useState<boolean[]>(Array(7).fill(false))
  const [mounted, setMounted] = useState(false)

  function buildWeek(streakVal: number, todayDone: boolean) {
    const w = Array(7).fill(false)
    const jsDay = new Date().getDay()
    const displayIdx = jsDay === 0 ? 6 : jsDay - 1
    const effective = todayDone ? streakVal : Math.max(0, streakVal)
    for (let i = 0; i < 7 && i <= displayIdx; i++) {
      if (i < effective) w[displayIdx - i] = true
    }
    return w
  }

  useEffect(() => {
    if (!prefix || prefix === 'guest_') return
    const today = new Date().toDateString()
    const stored = localStorage.getItem(prefix + 'm-streak')
    const lastCheck = localStorage.getItem(prefix + 'm-streak-last')
    const storedBest = localStorage.getItem(prefix + 'm-streak-best')
    const storedTotal = localStorage.getItem(prefix + 'm-streak-total')
    const parsed = stored ? parseInt(stored) : 0
    const bestVal = storedBest ? parseInt(storedBest) : 0
    const totalVal = storedTotal ? parseInt(storedTotal) : 0

    setBest(bestVal); setTotal(totalVal)

    if (lastCheck === today) {
      setStreak(parsed); setCheckedIn(true); setWeek(buildWeek(parsed, true))
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const carried = lastCheck === yesterday ? parsed : 0
      setStreak(carried); setCheckedIn(false); setWeek(buildWeek(carried, false))
    }
    setMounted(true)
  }, [prefix])

  function checkIn() {
    if (!prefix || prefix === 'guest_') return
    const today = new Date().toDateString()
    const lastCheck = localStorage.getItem(prefix + 'm-streak-last')
    const stored = localStorage.getItem(prefix + 'm-streak')
    const parsed = stored ? parseInt(stored) : 0
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const nextStreak = lastCheck === yesterday ? parsed + 1 : 1

    const newBest = Math.max(nextStreak, best)
    const newTotal = total + 1

    localStorage.setItem(prefix + 'm-streak', String(nextStreak))
    localStorage.setItem(prefix + 'm-streak-last', today)
    localStorage.setItem(prefix + 'm-streak-best', String(newBest))
    localStorage.setItem(prefix + 'm-streak-total', String(newTotal))

    setStreak(nextStreak); setBest(newBest); setTotal(newTotal); setCheckedIn(true); setWeek(buildWeek(nextStreak, true))
  }

  if (!mounted) return null
  const tier = getTier(streak)

  return (
    <div className="brief-box p-4" style={{ '--accent-color': tier.accent } as any}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: tier.accent }} />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#8892a6]">STUDY STREAK</span>
        </div>
        <span className="text-[10px] font-mono font-bold" style={{ color: tier.accent }}>{tier.label}</span>
      </div>
      <div className="text-center mb-3">
        <div className="flex items-baseline justify-center gap-2">
          <div className="text-4xl font-bold tabular-nums leading-none" style={{ color: tier.accent, textShadow: '0 0 22px ' + tier.accent + '88' }}>{streak}</div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-[#566074]">{streak === 1 ? 'DAY' : 'DAYS'}</div>
        </div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#3a4250] mt-1.5">CURRENT STREAK</div>
      </div>
      <div className="flex items-center justify-between gap-1 mb-3 px-1">
        {WEEK_LABELS.map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="rounded-full transition-all" style={{ width: 8, height: 8, background: week[i] ? tier.accent : 'rgba(34,211,238,0.12)', boxShadow: week[i] ? '0 0 8px ' + tier.accent : 'none' }} />
            <span className="text-[8px] font-mono tracking-widest" style={{ color: week[i] ? tier.accent : '#3a4250' }}>{label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-md px-3 py-2 bg-white/[0.04] border border-white/10">
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#566074] mb-0.5">BEST</div>
          <div className="text-sm font-bold text-[#a5f3fc] tabular-nums">{best} d</div>
        </div>
        <div className="rounded-md px-3 py-2 bg-white/[0.04] border border-white/10">
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#566074] mb-0.5">TOTAL</div>
          <div className="text-sm font-bold text-[#c4b5fd] tabular-nums">{total} d</div>
        </div>
      </div>
      {checkedIn ? (
        <div className="text-[11px] font-mono tracking-[0.15em] text-center text-[#10b981] rounded-md py-2 border border-[#10b981]/40 bg-[#10b981]/10">✓ CHECKED IN</div>
      ) : (
        <button onClick={checkIn} className="w-full bg-[#22d3ee] text-black text-[11px] font-bold tracking-[0.2em] uppercase rounded-md py-2.5 hover:bg-cyan-300 transition">Check In Today</button>
      )}
    </div>
  )
}