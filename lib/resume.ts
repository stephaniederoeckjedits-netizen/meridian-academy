import { createClient } from '@/lib/supabase/client'

export type ResumeType = 'course' | 'ebook' | 'spec' | 'vault';

async function getPrefix(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? user.id + '_' : 'guest_'
}

export async function trackResume(
  type: ResumeType, 
  id: string, 
  title: string, 
  href: string, 
  progressData: any = {}
) {
  const supabase = createClient()
  const prefix = await getPrefix()
  
  try {
    const record = { type, id, title, href, timestamp: Date.now(), progressData };
    localStorage.setItem(prefix + 'meridian_resume_' + type, JSON.stringify(record));
    window.dispatchEvent(new Event('meridian-resume-updated'));
  } catch (e) {}

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('user_resume_state').upsert({
      user_id: user.id,
      resource_type: type,
      resource_id: id,
      title: title,
      href: href,
      progress_data: progressData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, resource_type' })
  } catch (err) {
    console.error('[Meridian] DB Sync failed:', err);
  }
}

export async function getResume(type: ResumeType) {
  const prefix = await getPrefix()
  
  try {
    const raw = localStorage.getItem(prefix + 'meridian_resume_' + type);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.href && parsed.title) return parsed;
    }
  } catch {}

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('user_resume_state')
      .select('*')
      .eq('user_id', user.id)
      .eq('resource_type', type)
      .single()

    if (data) {
      const record = { type, id: data.resource_id, title: data.title, href: data.href, timestamp: Date.now(), progressData: data.progress_data }
      localStorage.setItem(prefix + 'meridian_resume_' + type, JSON.stringify(record))
      return record
    }
  } catch {}
  return null;
}