'use client';
import { useState } from 'react';
import { mapContentToSkill } from '@/app/actions/admin-map-skill';

const SKILLS = [
  'languages', 'communication', 'first_principles', 'mental_models', 'systems_thinking',
  'programming', 'prompt_engineering', 'architecture', 'strategy', 'finance',
  'logic', 'philosophy', 'writing', 'design', 'astrology'
];

export default function SkillMapper({ resourceType, resourceId, resourceTitle }: { resourceType: string, resourceId: string, resourceTitle: string }) {
  const [skill, setSkill] = useState('first_principles');
  const [xp, setXp] = useState(50);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleMap() {
    setLoading(true);
    setMsg('');
    try {
      await mapContentToSkill(resourceType, resourceId, skill, xp);
      setMsg('✓ MAPPED. XP ENGINE ARMED.');
    } catch (e: any) {
      setMsg('✗ ' + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="m-panel p-4 border border-[#8b5cf6]/30 bg-[#0a1018]/80">
      <div className="text-[10px] font-mono tracking-[0.2em] text-[#8b5cf6] mb-3">ADMIN: SKILL ATTRIBUTION</div>
      <div className="text-xs text-[#8892a6] mb-4">Map <span className="text-white font-bold">{resourceTitle}</span> to the OSRS progression engine.</div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <select value={skill} onChange={e => setSkill(e.target.value)} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white">
          {SKILLS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>)}
        </select>
        <input type="number" value={xp} onChange={e => setXp(parseInt(e.target.value) || 0)} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white" placeholder="XP Amount" />
      </div>
      
      <button onClick={handleMap} disabled={loading} className="w-full bg-[#8b5cf6] text-white text-[10px] font-bold tracking-widest rounded py-2 hover:bg-violet-500 transition disabled:opacity-50">
        {loading ? 'MAPPING...' : 'ARM XP REWARD'}
      </button>
      {msg && <div className="text-[10px] font-mono mt-2 text-center text-[#22d3ee]">{msg}</div>}
    </div>
  );
}