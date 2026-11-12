import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import CourseView, { type Saga } from './CourseView'
import { isCurrentUserAdmin } from '@/lib/meridian-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, slug, title, description, track, level')
    .eq('slug', slug)
    .maybeSingle()
  if (!course) notFound()

  const { data: sagasData } = await supabase
    .from('modules')
    .select(`
      id, title, description, order_index,
      missions(
        id, title, description, order_index,
        lessons(id, title, order_index, is_final_exam, pass_threshold)
      )
    `)
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  const sagas = (sagasData ?? []) as unknown as Saga[]
  const isAdmin = await isCurrentUserAdmin()

  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedIds = (progressData ?? []).map((p: { lesson_id: string }) => p.lesson_id)
  const completedSet = new Set<string>(completedIds)

  sagas.forEach(s => {
    s.missions = (s.missions ?? []).sort((a, b) => a.order_index - b.order_index)
    s.missions.forEach(m => {
      m.lessons = (m.lessons ?? []).sort((a, b) => a.order_index - b.order_index)
    })
  })

  const totalLessons = sagas.reduce(
    (sum, s) => sum + s.missions.reduce((a, m) => a + (m.lessons?.length ?? 0), 0), 0
  )
  const doneLessons = sagas.reduce(
    (sum, s) =>
      sum + s.missions.reduce((a, m) => a + (m.lessons ?? []).filter(l => completedSet.has(l.id)).length, 0),
    0
  )
  const overallPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0

  let defaultOpenIndex = 0
  for (let i = 0; i < sagas.length; i++) {
    const hasIncomplete = sagas[i].missions.some(m =>
      (m.lessons ?? []).some(l => !completedSet.has(l.id))
    )
    if (hasIncomplete) {
      defaultOpenIndex = i
      break
    }
  }

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto pb-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#566074] hover:text-[#22d3ee] transition mb-8">
          ← BACK TO CATALOG
        </Link>

        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] font-mono tracking-[0.3em] px-2 py-1 rounded border border-[#22d3ee]/30 text-[#22d3ee] bg-[#22d3ee]/10">
              {course.track === 'en_to_nl' ? 'EN → NL' : course.track === 'nl_to_en' ? 'NL → EN' : 'EN → NL'}
            </span>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#566074]">
              {course.level}
            </span>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#10b981] flex items-center gap-1.5 px-2 py-1 rounded border border-[#10b981]/30 bg-[#10b981]/10">
              <span className="w-1 h-1 rounded-full bg-[#10b981]" /> ACTIVE
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            {course.title}
          </h1>

          <p className="text-sm md:text-base leading-relaxed text-[#8892a6] max-w-2xl mb-8">
            {course.description}
          </p>

          <div className="max-w-lg">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#566074]">OVERALL PROGRESS</span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#22d3ee] tabular-nums">
                {overallPct}%
              </span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden bg-[#1e2633]">
              <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        <CourseView
          isAdmin={isAdmin}
          sagas={sagas}
          slug={slug}
          completedIds={completedIds}
          enrolled={true}
          defaultOpenIndex={defaultOpenIndex}
        />
      </div>
    </AppShell>
  )
}