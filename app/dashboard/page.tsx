// FILE: app/dashboard/page.tsx  (URL: /dashboard)

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import EnrollButton from './EnrollButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', user.id)

  const enrolledIds = new Set(enrollments?.map((e) => e.course_id) || [])

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="m-label m-label-cyan mb-3">Dashboard</div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Welcome back, {profile?.full_name || 'learner'}
        </h1>
        <p className="text-[var(--m-text-muted)] mb-12">
          Pick a course and continue your journey.
        </p>

        <div className="m-label mb-5">Available Courses</div>
        <div className="grid md:grid-cols-2 gap-5">
          {courses?.map((course) => {
            const enrolled = enrolledIds.has(course.id)
            return (
              <div
                key={course.id}
                className="m-panel m-panel-interactive flex flex-col"
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="p-6 flex-1 block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="m-label m-label-cyan">
                      {course.track === 'en_to_nl' ? 'EN → NL' : 'NL → EN'}
                    </div>
                    <div className="m-label">{course.level}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-[var(--m-text-muted)] text-sm leading-relaxed">
                    {course.description}
                  </p>
                </Link>
                <div className="px-6 pb-6">
                  {enrolled ? (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-block bg-white text-black text-sm font-semibold rounded-lg px-5 py-2 hover:bg-neutral-200 transition"
                    >
                      Continue Course →
                    </Link>
                  ) : (
                    <EnrollButton courseId={course.id} enrolled={false} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}