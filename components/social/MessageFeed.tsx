'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MessageFeed({ channelId, userId, accent }: { channelId: string; userId: string; accent: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [polls, setPolls] = useState<any[]>([])
  const [text, setText] = useState('')
  const [showPoll, setShowPoll] = useState(false)
  const [pollQ, setPollQ] = useState('')
  const [pollOpts, setPollOpts] = useState(['', ''])
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  async function load() {
    const { data: msgs } = await supabase.from('channel_messages').select('id, content, created_at, user_id').eq('channel_id', channelId).order('created_at', { ascending: false }).limit(100)
    if (msgs && msgs.length > 0) {
      const ids = [...new Set(msgs.map((m: any) => m.user_id))]
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', ids)
      const names = new Map((profiles || []).map((p: any) => [p.id, p.full_name || p.email?.split('@')[0] || 'Architect']))
      setMessages(msgs.reverse().map((m: any) => ({ ...m, author_name: names.get(m.user_id) })))
    } else setMessages([])

    const { data: pls } = await supabase.from('channel_polls').select('id, question, options, user_id, created_at').eq('channel_id', channelId).order('created_at', { ascending: false }).limit(10)
    if (pls && pls.length > 0) {
      const pollIds = pls.map((p: any) => p.id)
      const { data: votes } = await supabase.from('channel_poll_votes').select('poll_id, option_index, user_id').in('poll_id', pollIds)
      setPolls(pls.map((p: any) => ({ ...p, votes: (votes || []).filter((v: any) => v.poll_id === p.id) })))
    } else setPolls([])
  }

  useEffect(() => { load() }, [channelId])

  useEffect(() => {
    const ch = supabase.channel('msg-' + channelId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'channel_messages', filter: `channel_id=eq.${channelId}` }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [channelId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  async function send() {
    if (!text.trim() || !userId) return
    await supabase.from('channel_messages').insert({ channel_id: channelId, user_id: userId, content: text.trim() })
    setText(''); load()
  }

  async function createPoll() {
    if (!pollQ.trim() || !userId) return
    const opts = pollOpts.filter(o => o.trim())
    if (opts.length < 2) return
    await supabase.from('channel_polls').insert({ channel_id: channelId, user_id: userId, question: pollQ.trim(), options: opts })
    setPollQ(''); setPollOpts(['', '']); setShowPoll(false); load()
  }

  async function vote(pollId: string, idx: number) {
    if (!userId) return
    await supabase.from('channel_poll_votes').upsert({ poll_id: pollId, user_id: userId, option_index: idx }, { onConflict: 'poll_id,user_id' })
    load()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 py-4 px-4">
        {polls.map(p => {
          const total = p.votes.length
          const myVote = p.votes.find((v: any) => v.user_id === userId)
          return (
            <div key={p.id} className="p-4 rounded-lg border border-white/10 bg-[#0a0f16]" style={{ borderTopColor: accent, borderTopWidth: 2 }}>
              <div className="text-[10px] font-mono uppercase mb-2" style={{ color: accent }}>📊 Poll</div>
              <div className="text-sm font-bold text-white mb-3">{p.question}</div>
              <div className="space-y-2">
                {(p.options as string[]).map((opt: string, idx: number) => {
                  const count = p.votes.filter((v: any) => v.option_index === idx).length
                  const pct = total > 0 ? (count / total) * 100 : 0
                  const isMine = myVote?.option_index === idx
                  return (
                    <button key={idx} onClick={() => vote(p.id, idx)} className="w-full text-left relative rounded border border-white/10 p-2 overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{ width: pct + '%', backgroundColor: accent }} />
                      <div className="relative flex justify-between"><span className="text-xs text-white">{opt} {isMine && '✓'}</span><span className="text-[10px] font-mono text-[#8892a6]">{count} · {Math.round(pct)}%</span></div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 text-[9px] font-mono text-[#566074] uppercase">{total} votes</div>
            </div>
          )
        })}
        {messages.length === 0 && polls.length === 0 && <div className="text-center py-12 text-[#566074] font-mono text-xs">No messages yet. Start the conversation.</div>}
        {messages.map(m => (
          <div key={m.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: accent }}>{m.author_name?.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1"><span className="text-xs font-bold text-white">{m.author_name}</span><span className="text-[9px] font-mono text-[#566074]">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <p className="text-sm text-[#c8d0dd] break-words">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {showPoll && (
        <div className="border-t border-white/10 p-4 bg-[#0a0f16]">
          <div className="text-[10px] font-mono uppercase text-[#f59e0b] mb-2">New Poll</div>
          <input value={pollQ} onChange={e => setPollQ(e.target.value)} placeholder="Question" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white mb-2" />
          {pollOpts.map((o, i) => <input key={i} value={o} onChange={e => { const n = [...pollOpts]; n[i] = e.target.value; setPollOpts(n) }} placeholder={`Option ${i + 1}`} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white mb-1" />)}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setPollOpts([...pollOpts, ''])} className="text-[10px] font-mono text-[#8892a6]">+ Option</button>
            <button onClick={createPoll} className="game-btn px-4 py-1.5 text-[10px] ml-auto">Create</button>
            <button onClick={() => setShowPoll(false)} className="px-3 py-1.5 text-[10px] text-[#8892a6]">Cancel</button>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 p-3 flex gap-2 items-end bg-[#0a0f16]">
        <button onClick={() => setShowPoll(true)} className="w-9 h-9 rounded border border-white/10 text-[#8892a6] hover:text-[#f59e0b] flex items-center justify-center" title="Create poll">📊</button>
        <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Message..." rows={1} className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-[#566074] resize-none" />
        <button onClick={send} className="game-btn px-4 py-2 text-xs">Send</button>
      </div>
    </div>
  )
}