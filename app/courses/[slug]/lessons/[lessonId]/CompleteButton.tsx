'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CompleteButton({
  lessonId,
  completed: initial,
}: {
  lessonId: string
  completed: boolean
}) {
  const router = useRouter()
  const supabase = createClient()
  const [completed, setCompleted] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (completed || loading) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      )

    if (!error) {
      setCompleted(true)
      router.refresh()
    }
    setLoading(false)
  }

  if (completed) {
    return (
      <div className="flex items-center justify-between border border-green-800/60 bg-green-950/20 rounded-xl px-5 py-4">
        <div className="flex items-center gap-3 text-green-400 font-semibold">
          <span className="text-xl">✓</span>
          <span>Quest Complete</span>
        </div>
        <div className="text-sm text-green-400 font-mono">+50 XP</div>
      </div>
    )
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="w-full bg-white text-black font-semibold rounded-full py-3 hover:bg-neutral-200 disabled:opacity-50 transition"
    >
      {loading ? 'Completing...' : '✓ Complete Side Quest'}
    </button>
  )
}