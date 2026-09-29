// FILE: app/community/[channel]/[threadId]/page.tsx  (single thread page)

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
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
    <AppShell userEmail={user?.email}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <Link
          href={`/community/${channelSlug}`}
          className="text-sm text-[var(--m-text-dim)] hover:text-[var(--m-text)]"
        >
          ← #{channel.name}
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mt-8 mb-2">
          {thread.title}
        </h1>
        <p className="text-xs text-[var(--m-text-dim)] mb-10">
          by {(thread as any).profiles?.full_name || (thread as any).profiles?.username || 'someone'} ·{' '}
          {new Date(thread.created_at).toLocaleString()}
        </p>

        <div className="space-y-3 mb-10">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className="m-panel p-5">
                <div className="text-xs text-[var(--m-text-dim)] mb-2">
                  {post.profiles?.full_name || post.profiles?.username || 'someone'} ·{' '}
                  {new Date(post.created_at).toLocaleString()}
                </div>
                <p className="whitespace-pre-wrap text-[var(--m-text)] leading-relaxed">
                  {post.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[var(--m-text-dim)] text-sm">No replies yet.</p>
          )}
        </div>

        {user ? (
          <ReplyForm threadId={threadId} />
        ) : (
          <p className="text-sm text-[var(--m-text-muted)]">
            <Link href="/login" className="text-[var(--m-cyan)] hover:underline">
              Log in
            </Link>{' '}
            to reply.
          </p>
        )}
      </div>
    </AppShell>
  )
}