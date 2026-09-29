// FILE: app/community/[channel]/[threadId]/ReplyForm.tsx  (reply form component)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from('posts').insert({
      thread_id: threadId,
      user_id: user.id,
      content: content.trim(),
    })

    if (!error) {
      setContent('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        rows={4}
        className="w-full bg-[var(--m-surface)] border border-[var(--m-border)] rounded-lg px-4 py-3 focus:border-[var(--m-border-bright)] outline-none resize-none text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black font-semibold text-sm rounded-lg px-6 py-2.5 hover:bg-neutral-200 disabled:opacity-50 transition"
      >
        {loading ? 'Posting...' : 'Reply'}
      </button>
    </form>
  )
}