'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CourseProgress { id: string; title: string; pct: number; href: string }

export default function SyllabusProgress({ userEmail }: { userEmail?: string }) {
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: enrollments } = await supabase
        .from('enrollments').select('course_id').eq('user_id', user.id)

      if (!enrollments || enrollments.length === 0) { setLoading(false); return }

      const { data: completedLessons } = await supabase
        .from('lesson_progress').select('lesson_id')
        .eq('user_id', user.id).eq('completed', true)
      const completedSet = new Set((completedLessons || []).map((l: any) => l.lesson_id))

      const list: CourseProgress[] = []
      for (const enroll of enrollments) {
        const { data: course } = await supabase
          .from('courses').select('id, title, slug').eq('id', enroll.course_id).single()
        if (!course) continue

        const { data: modules } = await supabase
          .from('modules').select(`id, missions ( id, lessons ( id ) )`).eq('course_id', course.id)

        let total = 0, done = 0
        modules?.forEach((m: any) => {
          m.missions?.forEach((mission: any) => {
            total += mission.lessons?.length || 0
            mission.lessons?.forEach((lesson: any) => {
              if (completedSet.has(lesson.id)) done++
            })
          })
        })

        list.push({ id: course.id, title: course.title, pct: total > 0 ? Math.round((done / total) * 100) : 0, href: `/courses/${course.slug}` })
      }
      setCourses(list)
      setLoading(false)
    }
    load()
  }, [supabase, userEmail])

  if (loading) return <div className="brief-box p-4 h-24 animate-pulse" style={{ '--accent-color': '#10b981' } as any} />

  if (courses.length === 0) {
    return (
      <div className="brief-box p-4" style={{ '--accent-color': '#10b981' } as any}>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: '#10b981' }}>Syllabus</h3>
        <p className="text-xs font-mono text-[#c8d0dd] mb-3">Not enrolled in any course.</p>
        <a href="/courses" className="block text-center py-2 text-[9px] font-mono tracking-widest uppercase text-[#10b981] border border-[#10b981]/30 rounded hover:bg-[#10b981]/10 transition">Browse Courses</a>
      </div>
    )
  }

  return (
    <div className="brief-box p-4" style={{ '--accent-color': '#10b981' } as any}>
      <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: '#10b981' }}>Syllabus Progress</h3>
      <div className="space-y-3">
        {courses.map(c => (
          <a key={c.id} href={c.href} className="block group">
            <div className="text-xs font-bold text-white mb-1.5 group-hover:text-[#10b981] transition-colors">{c.title}</div>
            <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5 mb-1">
              <div className="h-full bg-[#10b981] shadow-[0_0_10px_#10b981] transition-all duration-500" style={{ width: c.pct + '%' }} />
            </div>
            <div className="text-right text-[10px] font-mono text-[#10b981] font-bold">{c.pct}% COMPLETE</div>
          </a>
        ))}
      </div>
    </div>
  )
}