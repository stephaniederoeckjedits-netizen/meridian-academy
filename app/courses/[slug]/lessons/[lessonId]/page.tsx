// FILE: app/courses/[slug]/lessons/[lessonId]/page.tsx  (quest player shell)

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import QuestPlayer from './QuestPlayer'

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

  const { data: siblings } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .eq('mission_id', lesson.mission_id)
    .order('order_index', { ascending: true })

  const idx = siblings?.findIndex((l) => l.id === lesson.id) ?? -1
  const prev = idx > 0 ? siblings?.[idx - 1] : null
  const next = siblings && idx < siblings.length - 1 ? siblings[idx + 1] : null

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .maybeSingle()

  const isCompleted = progress?.completed === true
  const passThreshold = lesson.pass_threshold ?? 80

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <Link
          href={`/courses/${slug}`}
          className="text-sm text-[var(--m-text-dim)] hover:text-[var(--m-text)]"
        >
          ← Back to {course.title}
        </Link>

        <div className="mt-8 mb-8">
          <QuestPlayer
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            lessonIndex={lesson.order_index}
            videoUrl={lesson.video_url}
            content={lesson.content}
            isFinalExam={lesson.is_final_exam || false}
            passThreshold={passThreshold}
            initialCompleted={isCompleted}
            slug={slug}
            nextHref={next ? `/courses/${slug}/lessons/${next.id}` : null}
            nextTitle={next?.title || null}
          />
        </div>

        <div className="flex justify-between items-center border-t border-[var(--m-border)] pt-6 gap-4">
          {prev ? (
            <Link
              href={`/courses/${slug}/lessons/${prev.id}`}
              className="text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] transition"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            isCompleted ? (
              <Link
                href={`/courses/${slug}/lessons/${next.id}`}
                className="text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] text-right transition"
              >
                {next.title} →
              </Link>
            ) : (
              <span className="text-xs font-mono tracking-wider text-[var(--m-text-dim)] text-right">
                🔒 CLEAR CURRENT MISSION TO UNLOCK
              </span>
            )
          ) : (
            <span />
          )}
        </div>
      </div>
    </AppShell>
  )
}