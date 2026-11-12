'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Row = { course_id: string; slug: string; title: string; pct: number; final_passed: boolean; verified_stage: number | null; verified_note: string | null; track_stage: number };
const STAGES = ['', 'FOUNDATION', 'UNDERSTANDING', 'APPLICATION', 'INDEPENDENT COMPETENCE', 'MASTERY'];

export default function MasteryPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc('meridian_mastery_summary');
        if (data) setRows(data as Row[]);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#566074]">DRA MASTERY RECORD</span>
        <span className="text-[9px] font-mono text-[#8b5cf6]">XP ≠ MASTERY</span>
      </div>
      {loading && <div className="text-[10px] font-mono text-[#566074] animate-pulse">EVALUATING COMPETENCE...</div>}
      {!loading && rows.length === 0 && <div className="text-[9px] font-mono text-[#566074]">No course activity yet. Mastery is earned, not displayed.</div>}
      {rows.map(r => (
        <div key={r.course_id} className="border border-white/5 rounded-lg p-3 bg-black/30 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-white truncate">{r.title}</span>
            {r.verified_stage ? (
              <span className="shrink-0 text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 text-[#c084fc]">VERIFIED: {STAGES[r.verified_stage]}</span>
            ) : (
              <span className="shrink-0 text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8892a6]">TRACK: {r.track_stage > 0 ? STAGES[r.track_stage] : 'NOT STARTED'}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-[#1e2633] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]" style={{ width: r.pct + '%' }} />
            </div>
            <span className="text-[9px] font-mono text-[#8892a6] w-8 text-right">{r.pct}%</span>
            <span className={'text-[8px] font-mono px-1.5 py-0.5 rounded ' + (r.final_passed ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40' : 'bg-white/5 text-[#566074] border border-white/10')}>
              {r.final_passed ? 'FINAL: PASSED' : 'FINAL: PENDING'}
            </span>
          </div>
          {r.verified_note && <div className="text-[9px] font-mono text-[#8b5cf6]/80 italic">&ldquo;{r.verified_note}&rdquo;</div>}
        </div>
      ))}
    </div>
  );
}