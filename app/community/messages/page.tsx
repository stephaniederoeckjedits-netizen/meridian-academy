import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AppShell from '@/components/AppShell';
import MessagesClient from '@/components/MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: convs } = await supabase.from('conversations')
    .select('id, participant_a, participant_b')
    .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
    .order('created_at', { ascending: false });

  const ids = (convs || []).map(c => c.id);
  let msgs: any[] = [];
  if (ids.length) {
    const { data } = await supabase.from('direct_messages')
      .select('id, conversation_id, sender_id, body, created_at, read_at')
      .in('conversation_id', ids).order('created_at', { ascending: true }).limit(800);
    msgs = data || [];
  }
  const otherIds = [...new Set((convs || []).map(c => c.participant_a === user.id ? c.participant_b : c.participant_a))];
  let people: any[] = [];
  if (otherIds.length) {
    const { data } = await supabase.from('profiles').select('id, username, accent_color, bio').in('id', otherIds);
    people = data || [];
  }
  const view = (convs || []).map(c => {
    const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
    const p = people.find(x => x.id === otherId);
    const cm = msgs.filter(m => m.conversation_id === c.id);
    return {
      id: c.id,
      other_id: otherId,
      other_username: p?.username || ('Architect-' + String(otherId).slice(0, 4)),
      other_accent: p?.accent_color || '#22d3ee',
      unread: cm.filter(m => m.sender_id !== user.id && !m.read_at).length,
      last_at: cm.length ? cm[cm.length - 1].created_at : null,
      messages: cm
    };
  }).sort((a, b) => String(b.last_at || '').localeCompare(String(a.last_at || '')));

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-3">
          <span className="w-1 h-1 rounded-full bg-[#22d3ee] animate-pulse" />DIRECT MESSAGES
        </div>
        <h1 className="text-3xl md:4xl font-bold tracking-[0.1em] text-[#e5e9f0] mb-8">THE WIRE</h1>
        <MessagesClient selfId={user.id} conversations={view} initialConvId={sp.c || null} />
      </div>
    </AppShell>
  );
}