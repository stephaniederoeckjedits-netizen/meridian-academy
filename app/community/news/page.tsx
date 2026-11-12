import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import NewsFeed from '@/components/news/NewsFeed'

export const revalidate = 0

export default async function NewsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-7xl mx-auto pb-24">
        <Link href="/community" className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#566074] hover:text-[#22d3ee] transition mb-10">
          ← BACK TO COMMUNITY
        </Link>
        
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] text-[#22d3ee] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_10px_#22d3ee]" />
            WORLD INTELLIGENCE
          </div>
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-tight leading-none mb-4">
            TODAY'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#3b82f6]">BRIEFING</span>
          </h1>
          <p className="text-lg md:text-xl text-[#8892a6] font-[family-name:var(--font-garamond)] italic max-w-2xl">
            Live news pulled from 30+ global sources every morning. AI, Science, Architecture, Business, and more.
          </p>
        </div>

        <NewsFeed />
      </div>
    </AppShell>
  )
}