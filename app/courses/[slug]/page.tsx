import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EnrollButton from '@/app/dashboard/EnrollButton'

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  let enrolled = false
  if (user) {
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle()
    enrolled = !!data
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <div className="flex gap-4 text-sm">
          {user ? (
            <Link href="/dashboard" className="hover:text-neutral-300">Dashboard</Link>
          ) : (
            <Link href="/login" className="hover:text-neutral-300">Login</Link>
          )}
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-300">
          ← Back
        </Link>

        <div className="text-xs uppercase tracking-wider text-neutral-500 mt-6 mb-2">
          {course.track === 'en_to_nl' ? 'English → Dutch' : 'Dutch → English'} · {course.level}
        </div>
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-neutral-400 mb-8">{course.description}</p>

        {!enrolled && user && (
          <div className="mb-8">
            <EnrollButton courseId={course.id} enrolled={false} />
          </div>
        )}

        {enrolled && (
          <div className="mb-6 text-sm text-green-400">✓ You are enrolled</div>
        )}

        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        <div className="space-y-3">
          {lessons?.map((lesson) => {
            const inner = (
              <>
                <div className="text-xs text-neutral-500 mb-1">
                  Lesson {lesson.order_index}
                </div>
                <div className="font-medium">{lesson.title}</div>
                {enrolled && lesson.content && (
                  <p className="text-sm text-neutral-400 mt-2">{lesson.content}</p>
                )}
                {!enrolled && (
                  <p className="text-xs text-neutral-600 mt-2">
                    🔒 Enroll to unlock
                  </p>
                )}
              </>
            )

            return enrolled ? (
              <Link
                key={lesson.id}
                href={`/courses/${slug}/lessons/${lesson.id}`}
                className="block border rounded-xl p-5 border-neutral-800 hover:border-neutral-600 transition"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={lesson.id}
                className="border rounded-xl p-5 border-neutral-900 opacity-60"
              >
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}