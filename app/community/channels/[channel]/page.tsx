import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import MessageFeed from '@/components/social/MessageFeed'

export const revalidate = 0
const ACCENTS = ['#22d3ee', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']

export default async function ChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()
  const { data: ch } = await supabase.from('channels').select('*').eq('slug', channel).maybeSingle()
  if (!ch) notFound()
  const { data: all } = await supabase.from('channels').select('slug, name').order('created_at')
  const idx = (all || []).findIndex((c: any) => c.slug === channel)
  const accent = ACCENTS[idx >= 0 ? idx % ACCENTS.length : 0]
  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="h-[calc(100vh-120px)] flex rounded-2xl overflow-hidden border border-white/10 bg-[#050810]">
        <aside className="w-56 shrink-0 bg-[#0a0f16] border-r border-white/10 hidden md:flex flex-col">
          <div className="p-4 border-b border-white/10"><Link href="/community/channels" className="text-[11px] font-mono tracking-widest text-[#c8d0dd] hover:text-white uppercase font-bold">← All Channels</Link></div>
          <div className="flex-1 overflow-y-auto p-2">
            {all?.map((c: any, i: number) => (
              <Link key={c.slug} href={`/community/channels/${c.slug}`} className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono font-bold ${c.slug === channel ? 'bg-white/10 text-white' : 'text-[#8892a6] hover:text-white hover:bg-white/5'}`}>
                <span style={{ color: ACCENTS[i % ACCENTS.length] }}>#</span>{c.name}
              </Link>
            ))}
          </div>
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <Link href="/community/channels" className="md:hidden text-[#8892a6] text-xl">←</Link>
            <span className="text-xl font-bold" style={{ color: accent }}>#</span>
            <h1 className="text-base font-bold text-white">{ch.name}</h1>
          </div>
          <MessageFeed channelId={ch.id} userId={user.id} accent={accent} />
        </div>
      </div>
    </AppShell>
  )
}