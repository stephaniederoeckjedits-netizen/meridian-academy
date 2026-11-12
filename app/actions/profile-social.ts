'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateMyBio(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const bio = String(formData.get('bio') || '').slice(0, 280);
  const accent = String(formData.get('accent') || '#22d3ee');
  const allowed = ['#22d3ee', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
  await supabase.from('profiles').update({ bio, accent_color: allowed.includes(accent) ? accent : '#22d3ee' }).eq('id', user.id);
  revalidatePath('/', 'layout');
}

export async function startConversation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const other = String(formData.get('other_id') || '');
  if (!other || other === user.id) throw new Error('Invalid target');
  const [a, b] = [user.id, other].sort();
  const { data, error } = await supabase.from('conversations').insert({ participant_a: a, participant_b: b }).select('id').single();
  if (error && error.code !== '23505') throw new Error(error.message);
  const id = data?.id || (await supabase.from('conversations').select('id').eq('participant_a', a).eq('participant_b', b).maybeSingle()).data?.id;
  redirect('/community/messages?c=' + id);
}

export async function sendMessage(conversationId: string, body: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const text = (body || '').trim().slice(0, 2000);
  if (!text) throw new Error('Empty message');
  const { error } = await supabase.from('direct_messages').insert({ conversation_id: conversationId, sender_id: user.id, body: text });
  if (error) throw new Error(error.message);
  return { ok: true };
}