'use server';
import { createClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/meridian-admin';

export async function mapContentToSkill(
  resourceType: string,
  resourceId: string,
  skillSlug: string,
  xpAmount: number,
  completionEvent: string = 'lesson_completed'
) {
  if (!(await isCurrentUserAdmin())) {
    throw new Error('Unauthorized: Admin access required.');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: skill, error: skillErr } = await supabase
    .from('skills')
    .select('id')
    .eq('slug', skillSlug)
    .single();

  if (skillErr || !skill) throw new Error('Invalid skill selected.');

  const { error: insertErr } = await supabase
    .from('content_skill_reward_rules')
    .upsert({
      skill_id: skill.id,
      resource_type: resourceType,
      resource_id: resourceId,
      xp_amount: xpAmount,
      completion_event: completionEvent,
      is_active: true,
      created_by: user?.id
    }, { onConflict: 'skill_id,resource_type,resource_id,completion_event' });

  if (insertErr) throw new Error(`Failed to map skill: ${insertErr.message}`);
  
  return { success: true };
}

export async function unmapContentSkill(ruleId: string) {
  if (!(await isCurrentUserAdmin())) throw new Error('Unauthorized');
  const supabase = await createClient();
  await supabase.from('content_skill_reward_rules').delete().eq('id', ruleId);
  return { success: true };
}