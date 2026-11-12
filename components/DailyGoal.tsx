'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { hasFlag, getPracticeMinutes } from '@/lib/activity'

const GOALS = [
  { id: 'side_quest', label: 'Complete 1 Side Quest', xp: 20 },
  { id: 'codex', label: 'Review Quest Codex', xp: 10 },
  { id: 'practice', label: 'Practice 15 minutes', xp: 15 },
  { id: 'prompt', label: 'Review a Prompt Spec', xp: 10 },
  { id: 'library', label: 'Read 1 Library entry', xp: 15 },
  { id: 'flashcard', label: 'Flashcard session', xp: 10 },
]

export default function DailyGoal({ userEmail }: { userEmail?: string }) {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMounted(true); return }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayIso = today.toISOString()

      const results: Record<string, boolean> = {}

      // 1. Side Quest — lesson completed today
      const { data: lessons } = await supabase
        .from('lesson_progress')
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('completed_at', todayIso)
        .limit(1)
      results.side_quest = (lessons?.length ?? 0) > 0

      // 2. Codex — local flag (set by QuestPlayer when opening a lesson)
      results.codex = hasFlag('codex', userEmail)

      // 3. Practice — accumulated Pomodoro minutes today
      results.practice = getPracticeMinutes(userEmail) >= 15

      // 4. Prompt — user_resume_state updated today for spec
      const { data: prompts } = await supabase
        .from('user_resume_state')
        .select('updated_at')
        .eq('user_id', user.id)
        .eq('resource_type', 'spec')
        .gte('updated_at', todayIso)
        .limit(1)
      results.prompt = (prompts?.length ?? 0) > 0

      // 5. Library — library_progress updated today
      const { data: reads } = await supabase
        .from('library_progress')
        .select('updated_at')
        .eq('user_id', user.id)
        .gte('updated_at', todayIso)
        .limit(1)
      results.library = (reads?.length ?? 0) > 0

      // 6. Flashcard — local flag
      results.flashcard = hasFlag('flashcard', userEmail)

      setStatus(results)
      setMounted(true)
    }

    check()
    const interval = setInterval(check, 8000)
    return () => clearInterval(interval)
  }, [supabase, userEmail])

  if (!mounted) return null

  const done = GOALS.filter(g => status[g.id]).length
  const earnedXp = GOALS.reduce((sum, g) => sum + (status[g.id] ? g.xp : 0), 0)
  const totalXp = GOALS.reduce((sum, g) => sum + g.xp, 0)
  const pct = (done / GOALS.length) * 100
  const allDone = done === GOALS.length

  return (
    <div className="brief-box p-4" style={{ '--accent-color': allDone ? '#10b981' : '#22d3ee' } as any}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: allDone ? '#10b981' : '#22d3ee' }} />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#8892a6]">DAILY GOAL</span>
        </div>
        <span className="text-[10px] font-mono font-bold" style={{ color: allDone ? '#10b981' : '#566074' }}>{done}/{GOALS.length}</span>
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#566074]">DAILY XP</span>
        <span className="text-sm font-bold tabular-nums text-[#a5f3fc]">{earnedXp}<span className="text-[10px] text-[#3a4250] font-normal"> / {totalXp}</span></span>
      </div>
      <div className="h-[3px] rounded-full overflow-hidden mb-4 bg-black border border-white/5">
        <div className="h-full transition-all duration-500" style={{ width: pct + '%', background: allDone ? '#10b981' : 'linear-gradient(90deg, #22d3ee, #8b5cf6)', boxShadow: allDone ? '0 0 10px rgba(16,185,129,0.6)' : '0 0 10px rgba(34,211,238,0.5)' }} />
      </div>
      <div className="space-y-1.5">
        {GOALS.map((goal) => {
          const complete = status[goal.id] || false
          return (
            <div key={goal.id} className="flex items-center gap-2.5 text-xs rounded-md px-2 py-1.5 -mx-2">
              <span className={'shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] ' + (complete ? 'bg-[#22d3ee] border-[#22d3ee] text-black' : 'border-[#2d3748]')}>
                {complete && '✓'}
              </span>
              <span className={'flex-1 ' + (complete ? 'text-[#3a4250] line-through' : 'text-[#e5e9f0]')}>{goal.label}</span>
              <span className="text-[9px] font-mono tabular-nums shrink-0" style={{ color: complete ? '#10b981' : '#3a4250' }}>+{goal.xp}</span>
            </div>
          )
        })}
      </div>
      {allDone && (
        <div className="mt-3 text-[10px] font-mono tracking-[0.2em] text-center text-[#10b981] rounded-md py-2 border border-[#10b981]/40 bg-[#10b981]/10">✓ ALL GOALS COMPLETE</div>
      )}
    </div>
  )
}