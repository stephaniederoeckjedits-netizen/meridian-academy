import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isCurrentUserAdmin } from '@/lib/meridian-admin';
import AppShell from '@/components/AppShell';

export default async function AdminSkillsPage() {
  if (!(await isCurrentUserAdmin())) redirect('/dashboard');
  
  const supabase = await createClient();
  const { data: rules } = await supabase
    .from('content_skill_reward_rules')
    .select('id, xp_amount, completion_event, skill:skills(slug, name), resource_type, resource_id')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Academic Skill Mapping</h1>
        <p className="text-sm text-[#8892a6] mb-8">Active reward rules feeding the OSRS XP Engine.</p>
        
        <div className="m-panel overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-[#22d3ee] font-mono tracking-wider uppercase">
              <tr>
                <th className="p-3">Resource</th>
                <th className="p-3">Skill</th>
                <th className="p-3">XP</th>
                <th className="p-3">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#c8d0dd]">
              {rules?.map((r: any) => (
                <tr key={r.id} className="hover:bg-white/5 transition">
                  <td className="p-3 font-mono text-[10px]">{r.resource_type} <span className="text-[#566074]">({r.resource_id.slice(0,8)}...)</span></td>
                  <td className="p-3 font-bold text-[#8b5cf6]">{r.skill?.name || 'Unknown'}</td>
                  <td className="p-3 text-[#22d3ee]">+{r.xp_amount} XP</td>
                  <td className="p-3 font-mono text-[10px] text-[#8892a6]">{r.completion_event}</td>
                </tr>
              ))}
              {(!rules || rules.length === 0) && (
                <tr><td colSpan={4} className="p-8 text-center text-[#566074]">No active mappings. The XP engine is waiting for attribution.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}