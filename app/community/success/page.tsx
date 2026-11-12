import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import BackLink from '@/components/ui/BackLink'

const STORIES = [
  { name: 'Sarah K.', role: 'Language Architect', quote: "I went from zero Dutch to passing my A2 exam in 4 months. The active recall system in the app is genuinely magic.", accent: '#10b981', tag: 'Dutch Mastery' },
  { name: 'Marcus T.', role: 'AI Engineer', quote: "The Prompt Engineering specs are the most valuable resource I've ever used. I landed a job at a startup because of the portfolio I built here.", accent: '#22d3ee', tag: 'AI & Coding' },
  { name: 'Elena R.', role: 'Systems Thinker', quote: "I read the blog daily. The articles on mental models and decision-making changed how I approach every problem in my startup.", accent: '#f59e0b', tag: 'Business Strategy' },
  { name: 'David L.', role: 'Digital Architect', quote: "This is not just a course platform. It's a university. The community and the leaderboard keep me motivated every single day.", accent: '#8b5cf6', tag: 'Community' },
]

export default async function SuccessStoriesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto pb-24">
        <BackLink href="/community" label="Back to Community" accent="#ec4899" />
        
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.3em] text-[#ec4899] mb-3 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ec4899] animate-pulse shadow-[0_0_10px_#ec4899]" />GROWTH
          </div>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-[#e5e9f0] mb-4">SUCCESS STORIES</h1>
          <p className="text-sm text-[#8892a6] max-w-2xl text-lg font-[family-name:var(--font-garamond)]">
            Real results from real architects. See what is possible when you commit to mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORIES.map((s, i) => (
            <div key={i} className="p-8 rounded-2xl border border-white/10 bg-[#0a0f16] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{ borderTopColor: s.accent, borderTopWidth: 2 }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-16 h-16" style={{ color: s.accent }} fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase mb-4 font-bold px-3 py-1 rounded inline-block" style={{ color: s.accent, backgroundColor: s.accent + '15' }}>{s.tag}</div>
              <p className="text-lg text-[#c8d0dd] leading-relaxed mb-6 italic relative z-10 font-[family-name:var(--font-garamond)]">"{s.quote}"</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold" style={{ backgroundColor: s.accent }}>{s.name.charAt(0)}</div>
                <div>
                  <div className="text-sm font-bold text-white">{s.name}</div>
                  <div className="text-[10px] font-mono text-[#8892a6]">{s.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#8892a6] mb-4">Ready to write your own story?</p>
          <Link href="/courses" className="game-btn px-8 py-4 text-xs inline-flex items-center gap-2">
            Start Learning Today <span>→</span>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}