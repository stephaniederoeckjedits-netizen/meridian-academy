import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <div className="flex gap-4 text-sm">
          {user ? (
            <Link href="/dashboard" className="hover:text-neutral-300">Dashboard</Link>
          ) : (
            <Link href="/login" className="hover:text-neutral-300">Login</Link>
          )}
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-neutral-400 mb-10">
          Ask questions, share wins, help each other learn.
        </p>

        <div className="space-y-3">
          {channels?.map((channel) => (
            <Link
              key={channel.id}
              href={`/community/${channel.slug}`}
              className="block border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition"
            >
              <h2 className="text-lg font-semibold mb-1">#{channel.name}</h2>
              <p className="text-neutral-400 text-sm">{channel.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}