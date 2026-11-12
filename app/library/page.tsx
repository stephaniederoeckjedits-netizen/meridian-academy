import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'

export default async function LibraryPage() {
  const user = await getCurrentUser()
  const supabase = await createClient()

  const { count: bookCount } = await supabase.from('library_books').select('*', { count: 'exact', head: true })
  const { count: specCount } = await supabase.from('study_specs').select('*', { count: 'exact', head: true })
  const { count: vaultCount } = await supabase.from('knowledge_vault').select('*', { count: 'exact', head: true })

  const sections = [
    {
      href: '/library/ebooks',
      label: 'E-BOOKS',
      title: 'Digital Library',
      description: 'Structured knowledge companions for your missions. Deep dives that go beyond the codex.',
      count: bookCount || 0,
      countLabel: 'INCLUDED',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      color: { text: 'text-[#22d3ee]', bg: 'bg-[#22d3ee]/10', border: 'border-[#22d3ee]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]', hex: '#22d3ee' }
    },
    {
      href: '/library/prompts',
      label: 'PROMPT ENGINEERING SPECS',
      title: 'Prompt Engineering Specs',
      description: 'High-leverage prompt architectures for research, writing, and systems thinking.',
      count: specCount || 0,
      countLabel: 'SPECS',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      color: { text: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10', border: 'border-[#8b5cf6]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]', hex: '#8b5cf6' }
    },
    {
      href: '/library/vault',
      label: 'MERIDIAN VAULT',
      title: 'Knowledge Vault',
      description: 'Interesting fragments that do not belong to a course. Business, AI, psychology, and everything in between.',
      count: vaultCount || 0,
      countLabel: 'ENTRIES',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
      color: { text: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10', border: 'border-[#f59e0b]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]', hex: '#f59e0b' }
    }
  ]

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="max-w-5xl mx-auto pb-24 pt-8">
        <div className="mb-12 relative">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
            ARCHIVES PORTAL
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] text-white mb-4">
            RESOURCES
          </h1>
          <p className="text-sm text-[#8892a6]">
            Everything that supports your missions. E-books to read. Specs to run. Vault entries to explore.
          </p>
        </div>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <Link 
              key={s.href} 
              href={s.href} 
              className={`group block relative rounded-2xl transition-all duration-500 hover:-translate-y-1 ${s.color.glow}`}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(135deg, rgba(20,30,45,0.8) 0%, rgba(10,15,25,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" />
              </div>

              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" 
                   style={{ background: `linear-gradient(90deg, transparent, ${s.color.hex}, transparent)` }} />

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-xl border ${s.color.border} ${s.color.bg} ${s.color.text} transition-all duration-300`}
                     style={{ boxShadow: `inset 0 0 15px ${s.color.hex}22` }}>
                  {s.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-mono tracking-[0.2em] px-2 py-0.5 rounded border ${s.color.border} ${s.color.text} ${s.color.bg}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#566074]">
                      {s.count} {s.countLabel}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white transition-all duration-300 mb-2">
                    {s.title}
                  </h2>
                  
                  <p className="text-sm text-[#8892a6] leading-relaxed max-w-3xl font-[family-name:var(--font-garamond)]">
                    {s.description}
                  </p>
                </div>

                <div className={`hidden md:flex shrink-0 items-center justify-center w-12 h-12 rounded-full border border-white/10 text-[#566074] group-hover:border-current transition-all duration-300`}
                     style={{ color: s.color.hex }}>
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}