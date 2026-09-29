// FILE: app/community/[channel]/NewThreadForm.tsx  (form component)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewThreadForm({ channelId }: { channelId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from('threads').insert({
      channel_id: channelId,
      user_id: user.id,
      title: title.trim(),
    })

    if (!error) {
      setTitle('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Start a new thread..."
        className="flex-1 bg-[var(--m-surface)] border border-[var(--m-border)] rounded-lg px-4 py-2.5 focus:border-[var(--m-border-bright)] outline-none text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black text-sm font-semibold rounded-lg px-5 hover:bg-neutral-200 disabled:opacity-50 transition"
      >
        {loading ? '...' : 'Post'}
      </button>
    </form>
  )
}