// FILE: app/courses/page.tsx  (URL: /courses)

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import EnrollButton from '@/app/dashboard/EnrollButton'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', user.id)

  const enrolledIds = new Set(enrollments?.map((e) => e.course_id) || [])

  const enrolledCourses = courses?.filter((c) => enrolledIds.has(c.id)) || []
  const availableCourses = courses?.filter((c) => !enrolledIds.has(c.id)) || []

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="m-label m-label-cyan mb-3">My Courses</div>
        <h1 className="text-4xl font-bold tracking-tight mb-12">
          Your learning tracks
        </h1>

        {enrolledCourses.length > 0 && (
          <div className="mb-14">
            <div className="m-label mb-5">Enrolled</div>
            <div className="grid md:grid-cols-2 gap-5">
              {enrolledCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="m-panel m-panel-interactive p-6 block"
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
                  <p className="text-[var(--m-text-muted)] text-sm leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <div className="text-green-400 text-sm font-semibold">✓ Enrolled</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {availableCourses.length > 0 && (
          <div>
            <div className="m-label mb-5">Available</div>
            <div className="grid md:grid-cols-2 gap-5">
              {availableCourses.map((course) => (
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
                    <EnrollButton courseId={course.id} enrolled={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {courses?.length === 0 && (
          <div className="m-panel p-10 text-center text-[var(--m-text-muted)]">
            No courses available yet.
          </div>
        )}
      </div>
    </AppShell>
  )
}