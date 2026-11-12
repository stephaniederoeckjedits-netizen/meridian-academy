import { createClient } from '@/lib/supabase/client'

export async function awardSkillXp(skillSlug: string, xpAmount: number, reason: string) {
  const supabase = createClient()
  const { error } = await supabase.rpc('award_skill_xp', {
    p_skill_slug: skillSlug,
    p_xp_amount: xpAmount,
    p_reason: reason,
  })
  if (error) {
    console.error('[Meridian Skills] Award failed:', error)
    throw error
  }
}

export async function getCombatLevel(): Promise<number> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 1
  const { data } = await supabase.rpc('get_combat_level', { p_user_id: user.id })
  return (data as number) || 1
}