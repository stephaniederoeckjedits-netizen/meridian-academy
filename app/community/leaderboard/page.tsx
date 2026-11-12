import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import BackLink from '@/components/ui/BackLink'

export const revalidate = 0
const MEDALS = ['#fbbf24', '#c0c0c0', '#cd7c4a']

function getTier(xp: number) {
  if (xp >= 10000) return { name: 'Grandmaster', color: '#ef4444', icon: '👑' }
  if (xp >= 5000) return { name: 'Master', color: '#f59e0b', icon: '🌟' }
  if (xp >= 2000) return { name: 'Architect', color: '#c084fc', icon: '🏛️' }
  if (xp >= 1000) return { name: 'Builder', color: '#3b82f6', icon: '🔨' }
  if (xp >= 500) return { name: 'Apprentice', color: '#10b981', icon: '📗' }
  return { name: 'Novice', color: '#8892a6', icon: '🌱' }
}

export default async function LeaderboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  
  const supabase = await createClient()
  // Fixed: Removed 'email' from select to prevent crash
  const { data: profiles } = await supabase.from('profiles').select('id, username, xp, shards').order('xp', { ascending: false }).limit(50)
  
  const ranked = (profiles || []).map((p: any, i: number) => ({ 
    ...p, 
    rank: i + 1, 
    display_name: (p.id === user.id) ? (p.full_name || p.username || 'Architect') : (p.username || ('Architect-' + String(p.id).slice(0, 4))), // Fallback if full_name is null
    is_me: p.id === user.id, 
    tier: getTier(p.xp || 0) 
  }))
  
  const myRank = ranked.find((p: any) => p.is_me)

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto">
        <BackLink href="/community" label="Back to Community" accent="#10b981" />
        
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.3em] text-[#10b981] mb-3 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_#10b981]" />ARCHITECT RANKING
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-[#e5e9f0] mb-4">LEADERBOARD</h1>
          <p className="text-sm text-[#8892a6]">Top architects by total XP earned across all disciplines.</p>
        </div>

        {myRank && (
          <div className="mb-8 p-6 rounded-2xl border-2 border-[#22d3ee]/50 bg-gradient-to-r from-[#22d3ee]/15 to-transparent">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold font-mono text-[#22d3ee]" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>#{myRank.rank}</div>
              <div className="flex-1">
                <div className="text-[10px] font-mono tracking-widest text-[#22d3ee] uppercase font-bold mb-1">Your Position</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">{myRank.display_name} <span className="text-sm px-2 py-0.5 rounded-md" style={{ backgroundColor: myRank.tier.color + '20', color: myRank.tier.color }}>{myRank.tier.icon} {myRank.tier.name}</span></div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-mono text-white">{myRank.xp?.toLocaleString() || 0}</div>
                <div className="text-[10px] font-mono tracking-widest text-[#566074] uppercase">XP</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {ranked.map((p: any) => (
            <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${p.is_me ? 'border-2 border-[#22d3ee]/50 bg-[#22d3ee]/10' : 'border border-white/5 bg-[#0a0f16] hover:border-white/20'}`}>
              <div className="w-12 text-center font-mono text-lg font-bold flex items-center justify-center" style={{ color: p.rank <= 3 ? MEDALS[p.rank - 1] : (p.is_me ? '#22d3ee' : '#566074') }}>
                {p.rank <= 3 ? '🏆' : p.rank}
              </div>
              
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: p.tier.color + '20', color: p.tier.color }}>
                {p.display_name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold truncate flex items-center gap-2 ${p.is_me ? 'text-[#22d3ee]' : 'text-white'}`}>
                  {p.display_name} {p.is_me && <span className="text-[9px] font-mono tracking-widest ml-1 text-[#22d3ee]/70">(YOU)</span>}
                </div>
                <div className="text-[10px] font-mono mt-1" style={{ color: p.tier.color }}>{p.tier.icon} {p.tier.name}</div>
              </div>
              
              <div className="text-right shrink-0">
                <div className="text-lg font-bold font-mono text-white">{p.xp?.toLocaleString() || 0}</div>
                <div className="text-[9px] font-mono tracking-widest text-[#566074] uppercase">XP</div>
              </div>
            </div>
          ))}
          {ranked.length === 0 && (
            <div className="text-center py-20 text-[#566074] font-mono text-sm">No architects ranked yet. Be the first to earn XP.</div>
          )}
        </div>
      </div>
    </AppShell>
  )
}