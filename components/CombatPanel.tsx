'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SkillRow { slug: string; name: string; icon: string; accent_color: string; xp: number; level: number; pct: number; maxed: boolean }

const SKILL_ICONS: Record<string, string> = {
  languages: '文', communication: '◎', first_principles: '✧',
  mental_models: '◫', systems_thinking: '⬡', programming: '</>',
  prompt_engineering: '⍟', architecture: '⛬', strategy: '◆',
  finance: '¤', logic: '⊢', philosophy: '♾',
  writing: '✒', design: '◇', astrology: '✵'
};
const SKILL_COLORS: Record<string, string> = { languages: '#60a5fa', communication: '#22d3ee', first_principles: '#c084fc', mental_models: '#a78bfa', systems_thinking: '#34d399', programming: '#4ade80', prompt_engineering: '#fbbf24', architecture: '#f59e0b', strategy: '#f87171', finance: '#facc15', logic: '#93c5fd', philosophy: '#f472b6', writing: '#fda4af', design: '#e879f9', astrology: '#818cf8' };

export default function CombatPanel() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [combat, setCombat] = useState(1);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc('meridian_get_player_skills');
        if (data) {
          const rows = (data as any[]).map(r => ({ slug: r.slug, name: r.name, icon: SKILL_ICONS[r.slug] || '◈', accent_color: SKILL_COLORS[r.slug] || '#22d3ee', xp: Number(r.xp || 0), level: Number(r.level || 1), pct: Number(r.pct || 0), maxed: Boolean(r.maxed) }));
          rows.sort((a, b) => (a.xp > 0 && b.xp === 0 ? -1 : a.xp === 0 && b.xp > 0 ? 1 : b.xp - a.xp));
          setSkills(rows);
          setTotalXp(rows.reduce((s, r) => s + r.xp, 0));
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: c } = await supabase.rpc('get_combat_level', { p_user_id: user.id });
          if (c) setCombat(c as number);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#566074]">STUDENT LEVEL</div>
          <div className="text-2xl font-mono font-bold text-white">LVL {combat}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#566074]">TOTAL SKILL XP</div>
          <div className="text-2xl font-mono font-bold text-[#22d3ee]">{totalXp.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {skills.map(skill => {
          const isActive = skill.xp > 0;
          return (
            <div key={skill.slug} className="flex items-center gap-3">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded border text-sm font-mono" style={{ borderColor: skill.accent_color + '60', backgroundColor: skill.accent_color + '15', color: skill.accent_color }}>{skill.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className={'text-[11px] font-mono truncate font-bold ' + (isActive ? 'text-white' : 'text-[#8892a6]')}>{skill.name}</span>
                  <span className="text-[10px] font-mono font-bold shrink-0 ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: skill.accent_color }}>LVL {skill.level}{skill.maxed ? ' MAX' : ''}</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: (skill.maxed ? 100 : skill.pct) + '%', backgroundColor: skill.accent_color, boxShadow: '0 0 8px ' + skill.accent_color }} />
                </div>
                <div className="text-[8px] font-mono text-[#566074] mt-0.5">{skill.xp.toLocaleString()} XP{skill.maxed ? ' — MASTERY CAP REACHED' : ' — ' + Math.floor(skill.pct) + '% TO NEXT LVL'}</div>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <div className="text-[10px] font-mono text-[#566074] animate-pulse">SYNCING PROGRESSION ENGINE...</div>}
    </div>
  );
}