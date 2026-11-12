'use server';

import { createClient } from '@/lib/supabase/server';

export async function awardSkillXp(
  resourceType: string,
  resourceId: string,
  completionEvent: string,
  metadata?: Record<string, any>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized: Must be logged in to earn XP.');
  }

  // Call the authoritative, idempotent, RLS-protected RPC
  const { data, error } = await supabase.rpc('meridian_award_xp', {
    p_user: user.id,
    p_rtype: resourceType,
    p_rid: resourceId,
    p_event: completionEvent,
    p_meta: metadata || null
  });

  if (error) {
    console.error('[XP AWARD ERROR]', error.message);
    throw new Error(`Failed to award XP: ${error.message}`);
  }

  return data;
}