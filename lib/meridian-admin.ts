import { createClient } from '@/lib/supabase/server';

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase.rpc('is_admin', { p_user_id: user.id });
  
  if (error) {
    console.error('[ADMIN CHECK ERROR]', error.message);
    return false;
  }
  
  return data === true;
}