// FILE: components/DailyGoal.tsx

'use client'

import { useEffect, useState } from 'react'

const DEFAULT_GOALS = [
  'Complete 1 Side Quest',
  'Review Quest Codex',
  'Practice 15 minutes',
  'Post in Community',
]

export default function DailyGoal() {
  const [checked, setChecked] = useState<boolean[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('m-daily-goal')
    const storedDate = localStorage.getItem('m-daily-goal-date')

    if (storedDate === today && stored) {
      try {
        setChecked(JSON.parse(stored))
      } catch {
        setChecked(DEFAULT_GOALS.map(() => false))
      }
    } else {
      const fresh = DEFAULT_GOALS.map(() => false)
      setChecked(fresh)
      localStorage.setItem('m-daily-goal', JSON.stringify(fresh))
      localStorage.setItem('m-daily-goal-date', today)
    }
    setMounted(true)
  }, [])

  function toggle(i: number) {
    const next = [...checked]
    next[i] = !next[i]
    setChecked(next)
    localStorage.setItem('m-daily-goal', JSON.stringify(next))
  }

  if (!mounted) return null

  const done = checked.filter(Boolean).length

  return (
    <div className="m-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="m-label">🎯 Daily Goal</div>
        <div className="text-[10px] font-mono text-[var(--m-text-dim)]">
          {done}/{DEFAULT_GOALS.length}
        </div>
      </div>

      <div className="space-y-2">
        {DEFAULT_GOALS.map((goal, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full flex items-center gap-2.5 text-left text-xs group"
          >
            <span
              className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] transition ${
                checked[i]
                  ? 'bg-[var(--m-cyan)] border-[var(--m-cyan)] text-black'
                  : 'border-[var(--m-border)] group-hover:border-[var(--m-border-bright)]'
              }`}
            >
              {checked[i] && '✓'}
            </span>
            <span
              className={`transition ${
                checked[i]
                  ? 'text-[var(--m-text-dim)] line-through'
                  : 'text-[var(--m-text)]'
              }`}
            >
              {goal}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}