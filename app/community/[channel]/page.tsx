import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
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
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/community" className="hover:text-neutral-300">Community</Link>
          {user ? (
            <Link href="/dashboard" className="hover:text-neutral-300">Dashboard</Link>
          ) : (
            <Link href="/login" className="hover:text-neutral-300">Login</Link>
          )}
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/community" className="text-sm text-neutral-500 hover:text-neutral-300">
          ← All channels
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">#{channel.name}</h1>
        <p className="text-neutral-400 mb-8">{channel.description}</p>

        {user && <NewThreadForm channelId={channel.id} />}

        <div className="space-y-3 mt-8">
          {threads && threads.length > 0 ? (
            threads.map((thread: any) => (
              <Link
                key={thread.id}
                href={`/community/${channelSlug}/${thread.id}`}
                className="block border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition"
              >
                <h2 className="font-semibold mb-1">{thread.title}</h2>
                <p className="text-xs text-neutral-500">
                  by {thread.profiles?.full_name || thread.profiles?.username || 'someone'} ·{' '}
                  {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No threads yet. Be the first.</p>
          )}
        </div>
      </section>
    </main>
  )
}