import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import ContentArrowNav from '@/components/ContentArrowNav'

const SECTIONS = [
  { href: '/community/news', label: 'WORLD NEWS', title: 'News', description: 'Live intelligence from OpenAI, Google, Nature, HBR, ArchDaily, and 30+ global sources. Updated daily.', accent: '#22d3ee', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
  { href: '/community/blog', label: 'EDITORIAL', title: 'Blog', description: 'Deep-dive essays and research from the Meridian team. Explore ideas that shape the world.', accent: '#f59e0b', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
  { href: '/community/channels', label: 'DISCUSSION', title: 'Channels', description: 'Real-time conversation. Share insights, ask questions, debate ideas with other architects.', accent: '#3b82f6', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
  { href: '/community/groups', label: 'STUDY', title: 'Groups', description: 'Create private or public groups. Study together, build together, grow together.', accent: '#8b5cf6', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  { href: '/community/success', label: 'GROWTH', title: 'Success Stories', description: 'See what other students have built, learned, and achieved. Real proof from real architects.', accent: '#ec4899', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { href: '/community/leaderboard', label: 'RANKING', title: 'Leaderboard', description: 'See how you rank against the cohort. Track your XP climb and claim your place at the top.', accent: '#10b981', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
]

export default async function CommunityPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()

  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: messageCount } = await supabase.from('channel_messages').select('*', { count: 'exact', head: true })
  const { count: groupCount } = await supabase.from('groups').select('*', { count: 'exact', head: true })
  const { count: articleCount } = await supabase.from('journal_articles').select('*', { count: 'exact', head: true })

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-5xl mx-auto pb-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
            COMMUNITY
          </div>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-[#e5e9f0] tracking-[0.1em] mb-4">
            THE GATHERING
          </h1>
          <p className="text-sm text-[#8892a6] max-w-2xl font-[family-name:var(--font-garamond)] text-lg">
            Read the latest intelligence, discuss with other architects, form study groups, and compete for the top rank.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'ARCHITECTS', val: userCount || 0, color: '#22d3ee', icon: '👥' },
            { label: 'MESSAGES SENT', val: messageCount || 0, color: '#3b82f6', icon: '💬' },
            { label: 'STUDY GROUPS', val: groupCount || 0, color: '#8b5cf6', icon: '📚' },
            { label: 'ARTICLES PUBLISHED', val: articleCount || 0, color: '#f59e0b', icon: '📰' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#0a0f16] flex items-center gap-4">
              <div className="text-2xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.val.toLocaleString()}</div>
                <div className="text-[9px] font-mono tracking-widest text-[#566074] uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <ContentArrowNav>
          <div className="space-y-4">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} data-nav-item className="group block relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: `1px solid ${s.accent}40`, background: `linear-gradient(90deg, ${s.accent}10 0%, rgba(6,10,16,0.7) 100%)`, backdropFilter: 'blur(20px)', boxShadow: `0 4px 20px -5px rgba(0,0,0,0.5)` }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`, opacity: 0.6 }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(90deg, ${s.accent}20, transparent)` }} />
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="shrink-0 w-16 h-16 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${s.accent}15`, color: s.accent, border: `1px solid ${s.accent}30` }}>
                      {s.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold" style={{ color: s.accent }}>{s.label}</span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-[family-name:var(--font-cinzel)] font-bold text-[#e5e9f0] group-hover:text-white transition-colors tracking-wide">{s.title}</h2>
                      <p className="text-sm text-[#8892a6] mt-2 leading-relaxed max-w-2xl">{s.description}</p>
                    </div>
                    <div className="shrink-0 transition-transform group-hover:translate-x-2" style={{ color: s.accent }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ContentArrowNav>
      </div>
    </AppShell>
  )
}