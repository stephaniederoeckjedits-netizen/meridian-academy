import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import ContentArrowNav from '@/components/ContentArrowNav'

type Course = {
  id: string
  slug: string
  title: string
  description: string | null
  track: string
  level: string
  published: boolean
}

const COLORS = [
  { text: 'text-[#22d3ee]', bg: 'bg-[#22d3ee]/10', border: 'border-[#22d3ee]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]', hex: '#22d3ee' },
  { text: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10', border: 'border-[#8b5cf6]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]', hex: '#8b5cf6' },
  { text: 'text-[#10b981]', bg: 'bg-[#10b981]/10', border: 'border-[#10b981]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]', hex: '#10b981' },
  { text: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10', border: 'border-[#f59e0b]/40', glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]', hex: '#f59e0b' },
]

const ICONS = [
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
]

export default async function CoursesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true })

  const visibleCourses = ((courses ?? []) as Course[]).filter(
    c => c.published !== false && c.slug !== 'dutch-mastery'
  )

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-5xl mx-auto py-8">
        <div className="mb-12 relative">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
            ACADEMIC CATALOG
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] text-white mb-4">
            SELECT YOUR PATH
          </h1>
          <p className="text-sm text-[#8892a6]">
            Choose a discipline to begin your evolution into a Digital Renaissance Architect.
          </p>
        </div>

        {visibleCourses.length === 0 ? (
          <div className="rounded-2xl p-12 text-center border border-white/10 bg-[#0a1018]">
            <div className="text-lg text-white mb-2">No programs available.</div>
          </div>
        ) : (
          <ContentArrowNav>
            <div className="space-y-5">
              {visibleCourses.map((course, i) => {
                const color = COLORS[i % COLORS.length];
                const icon = ICONS[i % ICONS.length];
                
                return (
                  <Link 
                    key={course.id} 
                    href={'/courses/' + course.slug} 
                    data-nav-item 
                    className={`group block relative rounded-2xl transition-all duration-500 hover:-translate-y-1 ${color.glow}`}
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      // Cyberpunk Gradient Background
                      background: 'linear-gradient(135deg, rgba(20,30,45,0.8) 0%, rgba(10,15,25,0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" />
                    </div>

                    {/* Top Glowing Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" 
                         style={{ background: `linear-gradient(90deg, transparent, ${color.hex}, transparent)` }} />

                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                      
                      {/* Icon Box with Neon Glow */}
                      <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-xl border ${color.border} ${color.bg} ${color.text} transition-all duration-300`}
                           style={{ boxShadow: `inset 0 0 15px ${color.hex}22` }}>
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[10px] font-mono tracking-[0.2em] px-2 py-0.5 rounded border ${color.border} ${color.text} ${color.bg}`}>
                            {course.track === 'en_to_nl' ? 'EN → NL' : course.track === 'nl_to_en' ? 'NL → EN' : 'EN → NL'}
                          </span>
                          <span className="text-[10px] font-mono tracking-[0.2em] text-[#566074]">
                            {course.level || 'ALL LEVELS'}
                          </span>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-white transition-all duration-300 mb-2">
                          {course.title}
                        </h2>
                        
                        <p className="text-sm text-[#8892a6] leading-relaxed max-w-3xl font-[family-name:var(--font-garamond)]">
                          {course.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className={`hidden md:flex shrink-0 items-center justify-center w-12 h-12 rounded-full border border-white/10 text-[#566074] group-hover:border-current transition-all duration-300`}
                           style={{ color: color.hex }}>
                        →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </ContentArrowNav>
        )}
      </div>
    </AppShell>
  )
}