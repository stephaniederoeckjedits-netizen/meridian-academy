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
    if (!user) return

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
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 focus:border-neutral-600 outline-none resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black font-semibold rounded-full px-6 py-2 hover:bg-neutral-200 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Reply'}
      </button>
    </form>
  )
}