import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from './SignOutButton'
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
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-neutral-500">{profile?.full_name || user.email}</span>
          <SignOutButton />
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {profile?.full_name || 'learner'} 👋
        </h1>
        <p className="text-neutral-400 mb-10">
          Pick a course and start learning.
        </p>

        <h2 className="text-xl font-semibold mb-6">Available courses</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition flex flex-col"
            >
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                {course.track === 'en_to_nl' ? 'English → Dutch' : 'Dutch → English'} · {course.level}
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-neutral-400 text-sm mb-4 flex-1">{course.description}</p>
              <div>
                <EnrollButton
                  courseId={course.id}
                  enrolled={enrolledIds.has(course.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}