'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CommentsSection({ articleId, userId, accent = '#f59e0b' }: { articleId: string; userId: string; accent?: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase.from('blog_comments').select('id, content, created_at, user_id, parent_id').eq('article_id', articleId).order('created_at')
    if (data && data.length > 0) {
      const ids = [...new Set(data.map((c: any) => c.user_id))]
      const { data: profiles } = await supabase.from('profiles').select('id, username, full_name').in('id', ids)
      const names = new Map((profiles || []).map((p: any) => [p.id, p.username|| p.full_name|| 'Architect']))
      setComments(data.map((c: any) => ({ ...c, author_name: names.get(c.user_id) || 'Architect' })))
    } else setComments([])
    setLoading(false)
  }

  useEffect(() => { load() }, [articleId])

  async function post() {
    if (!text.trim() || !userId) return
    await supabase.from('blog_comments').insert({ article_id: articleId, user_id: userId, content: text.trim(), parent_id: replyTo })
    setText(''); setReplyTo(null); load()
  }

  const roots = comments.filter(c => !c.parent_id)
  const repliesOf = (id: string) => comments.filter(c => c.parent_id === id)

  if (loading) return <div className="mt-16 h-32 animate-pulse bg-white/5 rounded-xl" />

  return (
    <div className="mt-16 pt-10 border-t border-white/10">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">Comments · {comments.length}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
      <div className="mb-8">
        {replyTo && <div className="mb-2 text-[10px] font-mono" style={{ color: accent }}>Replying... <button onClick={() => setReplyTo(null)} className="text-[#8892a6] ml-2">✕</button></div>}
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your thoughts..." rows={3} className="w-full bg-[#0a0f16] border border-white/10 rounded-lg p-4 text-sm text-white placeholder-[#566074] focus:outline-none resize-none" />
        <div className="flex justify-end mt-2"><button onClick={post} disabled={!text.trim()} className="game-btn px-6 py-2 text-xs disabled:opacity-40">Post Comment</button></div>
      </div>
      <div className="space-y-4">
        {roots.map(c => (
          <div key={c.id} className="p-4 rounded-lg border border-white/10 bg-[#0a0f16]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ backgroundColor: accent }}>{c.author_name?.charAt(0)}</div>
              <span className="text-xs font-bold text-white">{c.author_name}</span>
              <span className="text-[10px] font-mono text-[#566074]">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-[#c8d0dd] mb-2">{c.content}</p>
            <button onClick={() => setReplyTo(c.id)} className="text-[10px] font-mono uppercase tracking-widest" style={{ color: accent }}>Reply</button>
            {repliesOf(c.id).length > 0 && (
              <div className="ml-6 mt-3 space-y-3 border-l border-white/10 pl-4">
                {repliesOf(c.id).map(r => (
                  <div key={r.id}>
                    <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-white">{r.author_name}</span></div>
                    <p className="text-sm text-[#c8d0dd]">{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {roots.length === 0 && <div className="text-center py-8 text-[#566074] font-mono text-xs">Be the first to comment.</div>}
      </div>
    </div>
  )
}