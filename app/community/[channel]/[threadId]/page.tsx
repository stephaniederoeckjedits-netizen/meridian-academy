import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ReplyForm from './ReplyForm'

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ channel: string; threadId: string }>
}) {
  const { channel: channelSlug, threadId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('slug', channelSlug)
    .single()

  if (!channel) notFound()

  const { data: thread } = await supabase
    .from('threads')
    .select('*, profiles:user_id(full_name, username)')
    .eq('id', threadId)
    .single()

  if (!thread) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles:user_id(full_name, username)')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/community" className="hover:text-neutral-300">Community</Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href={`/community/${channelSlug}`}
          className="text-sm text-neutral-500 hover:text-neutral-300"
        >
          ← #{channel.name}
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">{thread.title}</h1>
        <p className="text-xs text-neutral-500 mb-10">
          by {(thread as any).profiles?.full_name || (thread as any).profiles?.username || 'someone'} ·{' '}
          {new Date(thread.created_at).toLocaleString()}
        </p>

        <div className="space-y-4 mb-10">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <div
                key={post.id}
                className="border border-neutral-800 rounded-xl p-5"
              >
                <div className="text-xs text-neutral-500 mb-2">
                  {post.profiles?.full_name || post.profiles?.username || 'someone'} ·{' '}
                  {new Date(post.created_at).toLocaleString()}
                </div>
                <p className="whitespace-pre-wrap text-neutral-200">{post.content}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No replies yet.</p>
          )}
        </div>

        {user ? (
          <ReplyForm threadId={threadId} />
        ) : (
          <p className="text-sm text-neutral-500">
            <Link href="/login" className="text-white hover:underline">Log in</Link> to reply.
          </p>
        )}
      </section>
    </main>
  )
}