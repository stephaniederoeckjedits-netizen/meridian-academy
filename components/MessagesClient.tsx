'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendMessage } from '@/app/actions/profile-social';

type Msg = { id: string; conversation_id: string; sender_id: string; body: string; created_at: string; read_at: string | null };
type Conv = { id: string; other_id: string; other_username: string; other_accent: string; unread: number; last_at: string | null; messages: Msg[] };

export default function MessagesClient({ selfId, conversations, initialConvId }: { selfId: string; conversations: Conv[]; initialConvId: string | null }) {
  const [convs, setConvs] = useState<Conv[]>(conversations);
  const [active, setActive] = useState<string | null>(initialConvId || conversations[0]?.id || null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const current = convs.find(c => c.id === active);

  useEffect(() => {
    if (!active) return;
    supabase.rpc('meridian_mark_read', { p_conv: active }).then(() => {});
    setConvs(prev => prev.map(c => c.id === active ? { ...c, unread: 0, messages: c.messages.map(m => m.sender_id !== selfId ? { ...m, read_at: m.read_at || new Date().toISOString() } : m) } : c));
  }, [active]);

  useEffect(() => {
    const t = setInterval(async () => {
      if (!active) return;
      const { data } = await supabase.from('direct_messages')
        .select('id, conversation_id, sender_id, body, created_at, read_at')
        .eq('conversation_id', active).order('created_at', { ascending: true }).limit(300);
      if (data) setConvs(prev => prev.map(c => c.id === active ? { ...c, messages: data as Msg[] } : c));
    }, 6000);
    return () => clearInterval(t);
  }, [active]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [current?.messages.length]);

  async function send() {
    if (!active || !draft.trim() || sending) return;
    setSending(true);
    const body = draft.trim();
    setDraft('');
    try {
      await sendMessage(active, body);
      const { data } = await supabase.from('direct_messages').select('id, conversation_id, sender_id, body, created_at, read_at').eq('conversation_id', active).order('created_at', { ascending: true }).limit(300);
      if (data) setConvs(prev => prev.map(c => c.id === active ? { ...c, messages: data as Msg[], last_at: new Date().toISOString() } : c));
    } catch {}
    setSending(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
      <div className="m-hud-panel flex flex-col overflow-hidden">
        <div className="m-hud-header px-4 py-3 text-[10px] font-mono tracking-[0.25em] text-[#22d3ee]">CONNECTIONS</div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {convs.length === 0 && <div className="p-6 text-[10px] font-mono text-[#566074]">No conversations yet. Visit a classmate&apos;s profile at /u/[username] and hit MESSAGE.</div>}
          {convs.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)} className={'w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b border-white/5 ' + (active === c.id ? 'bg-[#22d3ee]/10' : 'hover:bg-white/5')}>
              <span className="avatar-ring w-9 h-9 rounded-full grid place-items-center text-[11px] font-bold shrink-0" style={{ ['--ac' as any]: c.other_accent }}>
                {c.other_username.slice(0, 2).toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[12px] font-bold text-[#e5e9f0] truncate">{c.other_username}</span>
                <span className="block text-[9px] font-mono text-[#566074] truncate">{c.messages.length ? c.messages[c.messages.length - 1].body : 'say hello...'}</span>
              </span>
              {c.unread > 0 && <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#8b5cf6] text-white">{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 m-hud-panel flex flex-col overflow-hidden">
        <div className="m-hud-header px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#22d3ee]">{current ? current.other_username.toUpperCase() : 'SELECT A CONNECTION'}</span>
          <span className="text-[9px] font-mono text-[#566074]">ENCRYPTED BY RLS</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          {!current && <div className="text-[10px] font-mono text-[#566074]">Pick a conversation on the left.</div>}
          {current?.messages.map(m => (
            <div key={m.id} className={'msg-bubble ' + (m.sender_id === selfId ? 'msg-own' : 'msg-other')}>
              <div className="text-[12px] leading-relaxed whitespace-pre-wrap">{m.body}</div>
              <div className="text-[8px] font-mono mt-1 opacity-60">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{m.sender_id === selfId ? (m.read_at ? ' · READ' : ' · SENT') : ''}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        {current && (
          <div className="p-3 border-t border-white/5 flex gap-2">
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} maxLength={2000} placeholder="Type your message..." className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#22d3ee]/50 outline-none" />
            <button onClick={send} disabled={sending} className="game-btn px-5 py-2 text-[10px] font-bold tracking-widest disabled:opacity-50">{sending ? '...' : 'SEND'}</button>
          </div>
        )}
      </div>
    </div>
  );
}