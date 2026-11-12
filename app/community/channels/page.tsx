import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import ContentArrowNav from '@/components/ContentArrowNav'
import BackLink from '@/components/ui/BackLink'

const ACCENTS = ['#22d3ee', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']

export default async function ChannelsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('id, slug, name, description').order('created_at')
  const channels = data ?? []
  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto">
        <BackLink href="/community" label="Back to Community" accent="#3b82f6" />
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.3em] text-[#3b82f6] mb-3 font-bold"><span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse shadow-[0_0_10px_#3b82f6]" />COMMUNITY</div>
          <h1 className="text-2xl md:text-5xl font-bold tracking-[0.08em] text-[#e5e9f0] mb-4">DISCUSSION CHANNELS</h1>
          <p className="text-sm text-[#8892a6]">{channels.length} channels. Real-time conversation.</p>
        </div>
        {channels.length === 0 ? <div className="rounded-2xl p-12 text-center border border-[#3b82f6]/20 bg-[#0a0f16]">No channels yet.</div> : (
          <ContentArrowNav>
            <div className="space-y-4">
              {channels.map((ch: any, i: number) => {
                const accent = ACCENTS[i % ACCENTS.length]
                return (
                  <Link key={ch.id} href={`/community/channels/${ch.slug}`} data-nav-item className="game-card p-5 md:p-7 block group" style={{ '--accent-color': accent } as any}>
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 flex flex-col items-center gap-2"><span className="text-3xl font-bold" style={{ color: accent, textShadow: `0 0 20px ${accent}` }}>#</span><span className="text-[9px] font-mono tabular-nums" style={{ color: accent, opacity: 0.65 }}>{String(i + 1).padStart(2, '0')}</span></div>
                      <div className="flex-1 min-w-0"><h2 className="text-lg md:text-2xl font-bold text-[#e5e9f0] group-hover:text-white">{ch.name}</h2>{ch.description && <p className="text-xs md:text-sm text-[#8892a6] mt-2">{ch.description}</p>}</div>
                      <span className="text-2xl shrink-0 transition-all group-hover:translate-x-1" style={{ color: accent }}>▸</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </ContentArrowNav>
        )}
      </div>
    </AppShell>
  )
}