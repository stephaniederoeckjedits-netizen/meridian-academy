import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import MessageFeed from '@/components/social/MessageFeed'

export const revalidate = 0

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()
  const { data: g } = await supabase.from('groups').select('*').eq('slug', slug).maybeSingle()
  if (!g) notFound()
  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#050810]">
        <div className="px-6 py-4 border-b border-white/10">
          <Link href="/community/groups" className="text-[10px] font-mono text-[#566074] hover:text-white uppercase">← Groups</Link>
          <h1 className="text-lg font-bold text-white mt-1">{g.name}</h1>
          <p className="text-xs text-[#8892a6]">{g.description}</p>
        </div>
        <MessageFeed channelId={g.id} userId={user.id} accent={g.accent_color || '#8b5cf6'} />
      </div>
    </AppShell>
  )
}