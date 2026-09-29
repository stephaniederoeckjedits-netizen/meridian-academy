// FILE: app/community/[channel]/page.tsx  (URL: /community/english-grammar etc.)

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import NewThreadForm from './NewThreadForm'

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channel: string }>
}) {
  const { channel: channelSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('slug', channelSlug)
    .single()

  if (!channel) notFound()

  const { data: threads } = await supabase
    .from('threads')
    .select('id, title, created_at, user_id, profiles:user_id(full_name, username)')
    .eq('channel_id', channel.id)
    .order('created_at', { ascending: false })

  return (
    <AppShell userEmail={user?.email}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <Link
          href="/community"
          className="text-sm text-[var(--m-text-dim)] hover:text-[var(--m-text)]"
        >
          ← All channels
        </Link>

        <div className="m-label m-label-cyan mt-8 mb-2">Channel</div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          #{channel.name}
        </h1>
        <p className="text-[var(--m-text-muted)] mb-8">
          {channel.description}
        </p>

        {user && <NewThreadForm channelId={channel.id} />}

        <div className="space-y-3 mt-8">
          {threads && threads.length > 0 ? (
            threads.map((thread: any) => (
              <Link
                key={thread.id}
                href={`/community/${channelSlug}/${thread.id}`}
                className="m-panel m-panel-interactive block p-5"
              >
                <h2 className="font-semibold mb-1">{thread.title}</h2>
                <p className="text-xs text-[var(--m-text-dim)]">
                  by {thread.profiles?.full_name || thread.profiles?.username || 'someone'} ·{' '}
                  {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-[var(--m-text-dim)] text-sm">No threads yet. Be the first.</p>
          )}
        </div>
      </div>
    </AppShell>
  )
}