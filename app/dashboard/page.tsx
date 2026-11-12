import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import DashboardStats from '@/components/DashboardStats'
import DashboardWidgets from '@/components/DashboardWidgets'
import DashboardActivityLog from '@/components/DashboardActivityLog'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*, shards').eq('id', user.id).single()
  const xp = profile?.xp || 0
  const shards = profile?.shards || 0
  const { data: combatLevelData } = await supabase.rpc('get_combat_level', { p_user_id: user.id })
  const combatLevel = combatLevelData || 1

  const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('user_id', user.id).limit(1)

  let activeCourse: any = null
  let overallPct = 0
  let doneLessons = 0
  let totalLessons = 0

  if (enrollments && enrollments.length > 0) {
    const courseId = enrollments[0].course_id
    const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()
    if (course) {
      activeCourse = course
      const { data: progressData } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true)
      const completedSet = new Set((progressData ?? []).map((p: any) => p.lesson_id))
      const { data: modules } = await supabase.from('modules').select(`id, missions ( id, lessons ( id ) )`).eq('course_id', course.id)
      
      if (modules) {
        modules.forEach((m: any) => {
          m?.missions?.forEach((mission: any) => {
            totalLessons += mission?.lessons?.length || 0
            mission?.lessons?.forEach((lesson: any) => {
              if (completedSet.has(lesson.id)) doneLessons++
            })
          })
        })
      }
      overallPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0
    }
  }

  const username = user?.email?.split('@')[0] || 'Architect'

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="w-full max-w-7xl mx-auto pt-4 md:pt-8">
        
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_10px_#22d3ee]" /> SYSTEM ONLINE
            </div>
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] capitalize">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#c084fc]">{username}</span>
            </h1>
          </div>
          <div className="text-left md:text-right bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-[10px] font-mono tracking-widest text-[#566074] uppercase">Local Time</div>
            <div className="text-xl font-mono text-[#22d3ee] font-bold tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>
        </div>

        <DashboardStats
          xp={xp}
          studentLevel={combatLevel}
          initialShards={shards}
          completedLessons={doneLessons}
          totalLessons={totalLessons}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 w-full relative z-10">
          <div className="lg:col-span-8 flex flex-col gap-8 w-full min-w-0">
            
            <div className="w-full">
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-[0.15em] uppercase drop-shadow-md">Active Game</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-[#22d3ee]/50 to-transparent" />
              </div>
              
              {activeCourse ? (
                <Link href={`/courses/${activeCourse.slug}`} className="block group relative rounded-3xl p-[1px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(34,211,238,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/50 via-[#0a1018] to-[#8b5cf6]/30 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-[#0a1018]/90 backdrop-blur-xl rounded-[22px] p-8 md:p-10 flex flex-col justify-between h-full overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    
                    <div className="relative z-10 mb-10">
                      <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-[#22d3ee] mb-5">
                        <span className="px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">ACTIVE CURRICULUM</span>
                        <span className="text-[#566074]">/</span>
                        <span className="text-[#566074]">{activeCourse.level}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#22d3ee] transition-all duration-300">
                        {activeCourse.title}
                      </h3>
                      <p className="text-[#8892a6] font-[family-name:var(--font-garamond)] text-lg max-w-2xl leading-relaxed">
                        {activeCourse.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#22d3ee] flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-black translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <span className="font-mono text-xs tracking-[0.2em] text-white uppercase font-bold">Resume Course</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-[#566074] tracking-widest mb-1">PROGRESS</div>
                          <div className="text-xl font-mono font-bold text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{overallPct}%</div>
                        </div>
                        <div className="w-32 h-2 bg-black rounded-full overflow-hidden border border-white/10 shadow-inner">
                          <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] relative" style={{ width: `${overallPct}%` }}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="m-hud-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
                  <p className="text-[#8892a6] mb-6 font-mono text-sm tracking-widest">NO ACTIVE ENROLLMENTS DETECTED.</p>
                  <Link href="/courses" className="bg-[#22d3ee] text-black font-bold font-mono tracking-widest text-xs uppercase px-8 py-3 rounded-lg hover:bg-white transition-colors">Initialize Curriculum</Link>
                </div>
              )}
            </div>

            <div className="bg-[#0a1018]/60 backdrop-blur-md rounded-2xl overflow-hidden relative w-full border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <span className="flex items-center gap-2 text-[#22d3ee] font-mono text-xs tracking-[0.2em] uppercase font-bold">
                  <span className="w-2 h-2 bg-[#22d3ee] rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" /> System Log
                </span>
                <span className="text-[9px] font-mono text-[#566074]">RECENT ACTIVITY</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar p-2">
                <DashboardActivityLog userEmail={user?.email ?? undefined} />
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 w-full min-w-0">
            <div className="flex items-center gap-4 mb-1">
              <h2 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-[0.15em] uppercase drop-shadow-md">Live Ops</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#8b5cf6]/50 to-transparent" />
            </div>
            <DashboardWidgets userEmail={user?.email ?? undefined} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}