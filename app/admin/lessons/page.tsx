import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LessonEditor from './LessonEditor'

const ADMIN_EMAIL = 'stephaniederoeck.jedits@gmail.com'

export default async function AdminLessonsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/" className="text-xl font-bold">Meridian Academy</Link>
        <Link href="/dashboard" className="text-sm hover:text-neutral-300">Dashboard</Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Admin — Lesson Videos</h1>
        <p className="text-neutral-400 mb-10">
          Paste a YouTube link (unlisted is fine) or any direct video URL.
        </p>

        {courses?.map((course) => (
          <div key={course.id} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
            <div className="space-y-4">
              {lessons
                ?.filter((l) => l.course_id === course.id)
                .map((lesson) => (
                  <LessonEditor
                    key={lesson.id}
                    lessonId={lesson.id}
                    title={lesson.title}
                    orderIndex={lesson.order_index}
                    videoUrl={lesson.video_url || ''}
                    content={lesson.content || ''}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}