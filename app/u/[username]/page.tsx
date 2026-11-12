import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { updateMyBio, startConversation } from '@/app/actions/profile-social';

export const dynamic = 'force-dynamic';

function tier(xp: number) {
  if (xp >= 5000) return { name: 'MASTER', color: '#f59e0b' };
  if (xp >= 2000) return { name: 'ARCHITECT', color: '#c084fc' };
  if (xp >= 1000) return { name: 'BUILDER', color: '#3b82f6' };
  if (xp >= 500) return { name: 'APPRENTICE', color: '#10b981' };
  return { name: 'NOVICE', color: '#8892a6' };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.rpc('meridian_public_profile', { p_username: username });
  if (!profile) notFound();
  const p = profile as any;
  const isOwner = user?.id === p.user_id;
  const t = tier(p.xp || 0);

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <div className="profile-banner rounded-t-2xl" style={{ ['--ac' as any]: p.accent || '#22d3ee' }} />
        <div className="m-panel rounded-b-2xl p-6 md:p-8 -mt-10 relative">
          <div className="flex items-end gap-4">
            <div className="avatar-ring w-20 h-20 rounded-full grid place-items-center text-2xl font-bold shrink-0" style={{ ['--ac' as any]: p.accent || '#22d3ee' }}>
              {String(p.username || '??').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white truncate">@{p.username}</h1>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
                <span style={{ color: t.color }}>{t.name}</span>
                <span className="text-[#566074]">JOINED {new Date(p.joined).toLocaleDateString()}</span>
              </div>
            </div>
            {!isOwner && user && (
              <form action={startConversation}>
                <input type="hidden" name="other_id" value={p.user_id} />
                <button className="game-btn px-5 py-2.5 text-[10px] font-bold tracking-widest">MESSAGE</button>
              </form>
            )}
          </div>

          {p.bio && <p className="mt-5 text-sm text-[#c8d0dd] leading-relaxed font-[family-name:var(--font-garamond)] italic">&ldquo;{p.bio}&rdquo;</p>}

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="brief-box p-4 text-center"><div className="text-[9px] font-mono text-[#566074] mb-1">TOTAL XP</div><div className="text-lg font-mono font-bold text-[#22d3ee]">{(p.xp || 0).toLocaleString()}</div></div>
            <div className="brief-box p-4 text-center"><div className="text-[9px] font-mono text-[#566074] mb-1">SKILL XP</div><div className="text-lg font-mono font-bold text-[#8b5cf6]">{(p.skill_xp || 0).toLocaleString()}</div></div>
            <div className="brief-box p-4 text-center"><div className="text-[9px] font-mono text-[#566074] mb-1">SHARDS</div><div className="text-lg font-mono font-bold text-[#f59e0b]">{(p.shards || 0).toLocaleString()}</div></div>
          </div>

          {(p.top_skills || []).length > 0 && (
            <div className="mt-6">
              <div className="text-[9px] font-mono tracking-[0.25em] text-[#566074] mb-2">SIGNATURE SKILLS</div>
              <div className="flex gap-2 flex-wrap">
                {p.top_skills.map((s: any) => (
                  <span key={s.slug} className="text-[10px] font-mono px-3 py-1.5 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 text-[#22d3ee]">{s.slug.replace(/_/g, ' ')} · LVL {s.level}</span>
                ))}
              </div>
            </div>
          )}

          {isOwner && (
            <form action={updateMyBio} className="mt-8 border-t border-white/5 pt-6">
              <div className="text-[9px] font-mono tracking-[0.25em] text-[#8b5cf6] mb-2">EDIT YOUR IDENTITY</div>
              <textarea name="bio" maxLength={280} defaultValue={p.bio || ''} placeholder="Tell the university who you are becoming... (280 chars)" className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white outline-none focus:border-[#8b5cf6]/50 min-h-[80px]" />
              <div className="flex items-center gap-2 mt-3">
                {['#22d3ee', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'].map(c => (
                  <label key={c} className="cursor-pointer"><input type="radio" name="accent" value={c} defaultChecked={(p.accent || '#22d3ee') === c} className="sr-only peer" /><span className="block w-6 h-6 rounded-full peer-checked:ring-2 ring-white/70" style={{ background: c }} /></label>
                ))}
                <button className="game-btn ml-auto px-5 py-2 text-[10px] font-bold tracking-widest">SAVE</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}