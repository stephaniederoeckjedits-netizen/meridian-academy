// FILE: components/PomodoroTimer.tsx

'use client'

import { useEffect, useRef, useState } from 'react'

const FOCUS = 25 * 60
const BREAK = 5 * 60

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(FOCUS)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          const nextMode = mode === 'focus' ? 'break' : 'focus'
          setMode(nextMode)
          return nextMode === 'focus' ? FOCUS : BREAK
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, mode])

  function toggle() {
    setRunning((r) => !r)
  }

  function reset() {
    setRunning(false)
    setMode('focus')
    setSeconds(FOCUS)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const total = mode === 'focus' ? FOCUS : BREAK
  const pct = ((total - seconds) / total) * 100

  return (
    <div className="m-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="m-label">
          {mode === 'focus' ? '⏱ Focus' : '☕ Break'}
        </div>
        <div className="text-[10px] font-mono text-[var(--m-text-dim)]">
          POMODORO
        </div>
      </div>

      <div className="text-3xl font-bold tabular-nums text-center mb-3 text-[var(--m-cyan)]">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <div className="m-progress-track mb-3">
        <div className="m-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggle}
          className="flex-1 bg-[var(--m-cyan)] text-black text-xs font-semibold rounded-lg py-2 hover:opacity-90 transition"
        >
          {running ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={reset}
          className="px-3 border border-[var(--m-border)] text-[var(--m-text-muted)] hover:text-[var(--m-text)] text-xs rounded-lg py-2 transition"
        >
          ↺
        </button>
      </div>
    </div>
  )
}