// FILE: components/StudyStreak.tsx

'use client'

import { useEffect, useState } from 'react'

export default function StudyStreak() {
  const [streak, setStreak] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('m-streak')
    const lastCheck = localStorage.getItem('m-streak-last')
    const parsed = stored ? parseInt(stored) : 0

    if (lastCheck === today) {
      setStreak(parsed)
      setCheckedIn(true)
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const nextStreak = lastCheck === yesterday ? parsed + 1 : 1
      setStreak(parsed === 0 ? 0 : nextStreak)
      setCheckedIn(false)
    }
    setMounted(true)
  }, [])

  function checkIn() {
    const today = new Date().toDateString()
    const lastCheck = localStorage.getItem('m-streak-last')
    const stored = localStorage.getItem('m-streak')
    const parsed = stored ? parseInt(stored) : 0
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const nextStreak = lastCheck === yesterday ? parsed + 1 : 1

    localStorage.setItem('m-streak', String(nextStreak))
    localStorage.setItem('m-streak-last', today)
    setStreak(nextStreak)
    setCheckedIn(true)
  }

  if (!mounted) return null

  return (
    <div className="m-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="m-label">🔥 Study Streak</div>
        <div className="text-[10px] font-mono text-[var(--m-text-dim)]">
          DAILY
        </div>
      </div>

      <div className="text-center mb-3">
        <div className="text-3xl font-bold text-[var(--m-cyan)] tabular-nums">
          {streak}
        </div>
        <div className="text-[10px] text-[var(--m-text-dim)] font-mono tracking-widest mt-1">
          {streak === 1 ? 'DAY' : 'DAYS'}
        </div>
      </div>

      {checkedIn ? (
        <div className="text-xs text-center text-green-400 border border-green-800/50 bg-green-950/20 rounded-lg py-2">
          ✓ Checked in today
        </div>
      ) : (
        <button
          onClick={checkIn}
          className="w-full bg-[var(--m-cyan)] text-black text-xs font-semibold rounded-lg py-2 hover:opacity-90 transition"
        >
          CHECK IN TODAY
        </button>
      )}
    </div>
  )
}