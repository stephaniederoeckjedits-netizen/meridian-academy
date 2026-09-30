// FILE: app/courses/[slug]/lessons/[lessonId]/page.tsx  (quest player)

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import QuizSection from './QuizSection'

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

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
  const next =
    siblings && idx < siblings.length - 1 ? siblings[idx + 1] : null

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .maybeSingle()

  const isCompleted = progress?.completed === true
  const youtubeId = lesson.video_url ? getYouTubeId(lesson.video_url) : null

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <Link
          href={`/courses/${slug}`}
          className="text-sm text-[var(--m-text-dim)] hover:text-[var(--m-text)]"
        >
          ← Back to {course.title}
        </Link>

        <div className="mt-8 mb-2 m-label m-label-cyan">
          ⚔ Side Quest {String(lesson.order_index).padStart(2, '0')}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
          {lesson.title}
        </h1>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3 m-label">
            <span>🎥</span> Quest Briefing
          </div>
          {youtubeId ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-[var(--m-border)]">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : lesson.video_url ? (
            <video
              src={lesson.video_url}
              controls
              className="w-full rounded-xl bg-black border border-[var(--m-border)]"
            />
          ) : (
            <div className="w-full aspect-video bg-[var(--m-surface)] border border-[var(--m-border)] rounded-xl flex items-center justify-center text-[var(--m-text-dim)] text-sm">
              Video coming soon
            </div>
          )}
        </div>

        {lesson.content && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3 m-label">
              <span>📖</span> Quest Codex
            </div>
            <div className="m-panel p-6">
              <p className="text-[var(--m-text)] whitespace-pre-wrap leading-relaxed">
                {lesson.content}
              </p>
            </div>
          </div>
        )}

        <div className="mb-10">
          <QuizSection lessonId={lesson.id} initialCompleted={isCompleted} />
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
              <span className="text-sm text-[var(--m-text-dim)] text-right">
                🔒 Pass the exam to continue
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