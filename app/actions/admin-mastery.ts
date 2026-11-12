'use server';
import { createClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/meridian-admin';

export async function setMasteryStage(userId: string, courseId: string, stage: number, note?: string) {
  if (!(await isCurrentUserAdmin())) throw new Error('Unauthorized: admin only.');
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('meridian_set_mastery_stage', {
    p_user: userId,
    p_course: courseId,
    p_stage: stage,
    p_note: note || null
  });
  if (error) throw new Error(error.message);
  return data;
}