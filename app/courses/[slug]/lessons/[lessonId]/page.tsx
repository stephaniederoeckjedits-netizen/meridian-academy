import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!enrollment) redirect(`/courses/${slug}`)

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (!lesson) notFound()

  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  const currentIndex = allLessons?.findIndex((l) => l.id === lesson.id) ?? -1
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null
  const nextLesson =
    allLessons && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <Link href="/dashboard" className="text-sm hover:text-neutral-300">Dashboard</Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href={`/courses/${slug}`}
          className="text-sm text-neutral-500 hover:text-neutral-300"
        >
          ← Back to {course.title}
        </Link>

        <div className="text-xs text-neutral-500 mt-6 mb-2">
          Lesson {lesson.order_index}
        </div>
        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

        {lesson.video_url ? (
          <video
            src={lesson.video_url}
            controls
            className="w-full rounded-xl mb-8 bg-black"
          />
        ) : (
          <div className="w-full aspect-video bg-neutral-900 rounded-xl mb-8 flex items-center justify-center text-neutral-600 text-sm">
            Video coming soon
          </div>
        )}

        {lesson.content && (
          <p className="text-neutral-300 whitespace-pre-wrap mb-12">
            {lesson.content}
          </p>
        )}

        <div className="flex justify-between items-center border-t border-neutral-800 pt-6 gap-4">
          {prevLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${prevLesson.id}`}
              className="text-sm text-neutral-400 hover:text-white"
            >
              ← {prevLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${nextLesson.id}`}
              className="text-sm text-neutral-400 hover:text-white text-right"
            >
              {nextLesson.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </main>
  )
}