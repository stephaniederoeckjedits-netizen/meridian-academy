// FILE: app/community/page.tsx  (URL: /community)

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <AppShell userEmail={user?.email}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <div className="m-label m-label-cyan mb-3">Community</div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Learn together
        </h1>
        <p className="text-[var(--m-text-muted)] mb-12">
          Ask questions, share wins, help each other learn.
        </p>

        <div className="space-y-3">
          {channels?.map((channel) => (
            <Link
              key={channel.id}
              href={`/community/${channel.slug}`}
              className="m-panel m-panel-interactive block p-5"
            >
              <h2 className="text-lg font-semibold mb-1 tracking-tight">
                #{channel.name}
              </h2>
              <p className="text-[var(--m-text-muted)] text-sm">
                {channel.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}