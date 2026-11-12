'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookmarkButton({ articleId }: { articleId: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('journal_bookmarks')
        .select('id').eq('user_id', user.id).eq('article_id', articleId).maybeSingle()
      setSaved(!!data)
      setLoading(false)
    }
    check()
  }, [articleId, supabase])

  async function toggle() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (saved) {
      await supabase.from('journal_bookmarks').delete().eq('user_id', user.id).eq('article_id', articleId)
      setSaved(false)
    } else {
      await supabase.from('journal_bookmarks').insert({ user_id: user.id, article_id: articleId })
      setSaved(true)
    }
  }

  if (loading) return <div className="w-10 h-10" />

  return (
    <button
      onClick={toggle}
      className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
        saved
          ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]'
          : 'border-white/10 bg-white/5 text-[#8892a6] hover:text-white hover:border-white/30'
      }`}
      title={saved ? 'Remove bookmark' : 'Bookmark article'}
    >
      <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  )
}