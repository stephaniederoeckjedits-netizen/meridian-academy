'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type SkillRow = { slug: string; name: string; xp: number; level: number; pct: number; maxed: boolean };

const MILESTONES = [
  { id: 'novice', name: 'Digital Novice', xp: 0, description: 'The journey begins.' },
  { id: 'reader', name: 'Avid Reader', xp: 500, description: 'Knowledge becomes habit.' },
  { id: 'builder', name: 'Builder', xp: 1500, description: 'You construct, not just consume.' },
  { id: 'systems', name: 'Systems Thinker', xp: 4000, description: 'You see the loops behind the world.' },
  { id: 'language', name: 'Language Architect', xp: 8000, description: 'You build bridges between minds.' },
  { id: 'disciplined', name: 'Disciplined Mind', xp: 15000, description: 'Focus is your weapon.' },
  { id: 'dsa', name: 'Digital Systems Architect', xp: 30000, description: 'Master of complex systems.' },
  { id: 'dra', name: 'Digital Renaissance Architect', xp: 60000, description: 'The pinnacle of interdisciplinary mastery.' },
];

export default function SkillTree() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc('meridian_get_player_skills');
        if (data) {
          const rows = (data as any[]).map(r => ({ slug: r.slug, name: r.name, xp: Number(r.xp || 0), level: Number(r.level || 1), pct: Number(r.pct || 0), maxed: Boolean(r.maxed) }));
          rows.sort((a, b) => b.xp - a.xp);
          setSkills(rows);
          setTotalXp(rows.reduce((s, r) => s + r.xp, 0));
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const current = [...MILESTONES].reverse().find(m => totalXp >= m.xp) ?? MILESTONES[0];
  const next = MILESTONES.find(m => m.xp > totalXp);
  const span = next ? next.xp - current.xp : 1;
  const into = totalXp - current.xp;
  const pct = next ? Math.min(100, Math.floor((into / span) * 100)) : 100;

  return (
    <div className="w-full flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-[#22d3ee] tracking-wider font-bold">{current.name.toUpperCase()}</span>
          <span className="text-[9px] font-mono text-white">{totalXp.toLocaleString()} / {next ? next.xp.toLocaleString() : '∞'} XP</span>
        </div>
        <div className="w-full h-2 bg-[#1e2633] rounded-full overflow-hidden border border-[#22d3ee]/20">
          <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] transition-all duration-1000" style={{ width: pct + '%' }} />
        </div>
        {next && <div className="text-[9px] font-mono text-[#566074] mt-1">NEXT: {next.name.toUpperCase()} — {(next.xp - totalXp).toLocaleString()} XP REMAINING</div>}
      </div>

      <div className="relative border-l border-[#1e2633] ml-2 pl-4 space-y-4 pb-1">
        {MILESTONES.map((m, i) => {
          const unlocked = totalXp >= m.xp;
          const isCurrent = m.id === current.id;
          return (
            <div key={m.id} className="relative group">
              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 transition-colors duration-300 ${unlocked ? 'bg-[#22d3ee] border-[#22d3ee] shadow-[0_0_10px_#22d3ee]' : isCurrent ? 'bg-[#0a0f16] border-[#8b5cf6] animate-pulse' : 'bg-[#0a0f16] border-[#3a4250]'}`} />
              <div className={`transition-opacity ${unlocked ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`text-[11px] font-bold ${unlocked ? 'text-white' : isCurrent ? 'text-[#8b5cf6]' : 'text-[#566074]'}`}>{m.name}</div>
                <div className="text-[9px] font-mono text-[#566074]">{m.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="text-[9px] font-mono tracking-[0.2em] text-[#566074] mb-2">TOP SKILLS (OSRS ENGINE)</div>
        <div className="space-y-2">
          {skills.slice(0, 4).map(s => (
            <div key={s.slug} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#8892a6] flex-1 truncate">{s.name}</span>
              <span className="text-[9px] font-mono font-bold text-[#22d3ee]">LVL {s.level}{s.maxed ? ' MAX' : ''}</span>
              <div className="w-16 h-1 bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-[#22d3ee]" style={{ width: (s.maxed ? 100 : s.pct) + '%' }} />
              </div>
            </div>
          ))}
          {!loading && skills.length === 0 && <div className="text-[9px] font-mono text-[#566074]">No skill activity yet. Complete a Side Quest.</div>}
        </div>
      </div>
    </div>
  );
}