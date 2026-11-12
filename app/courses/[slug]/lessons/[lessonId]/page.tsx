// FILE: app/courses/[slug]/lessons/[lessonId]/page.tsx
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import QuestPlayer from './QuestPlayer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, slug, title')
    .eq('slug', slug)
    .maybeSingle()
  if (!course) notFound()

  const { data: lesson } = await supabase
    .from('lessons')
    .select(
      'id, title, order_index, video_url, content, is_final_exam, pass_threshold, mission_id, mission:missions(id, order_index, module_id, module:modules(id, order_index))'
    )
    .eq('id', lessonId)
    .maybeSingle()
  if (!lesson) notFound()

  const mission = (lesson as any).mission as
    | { id: string; order_index: number; module_id: string; module: { id: string; order_index: number } | null }
    | null

  let nextHref: string | null = null
  let nextTitle: string | null = null

  if (mission) {
    const { data: siblings } = await supabase
      .from('lessons')
      .select('id, title')
      .eq('mission_id', mission.id)
      .gt('order_index', lesson.order_index)
      .order('order_index', { ascending: true })
      .limit(1)

    if (siblings && siblings.length > 0) {
      nextHref = `/courses/${slug}/lessons/${siblings[0].id}`
      nextTitle = siblings[0].title
    } else {
      const { data: nextMissions } = await supabase
        .from('missions')
        .select('id')
        .eq('module_id', mission.module_id)
        .gt('order_index', mission.order_index)
        .order('order_index', { ascending: true })
        .limit(1)

      if (nextMissions && nextMissions.length > 0) {
        const { data: firstLesson } = await supabase
          .from('lessons')
          .select('id, title')
          .eq('mission_id', nextMissions[0].id)
          .order('order_index', { ascending: true })
          .limit(1)

        if (firstLesson && firstLesson.length > 0) {
          nextHref = `/courses/${slug}/lessons/${firstLesson[0].id}`
          nextTitle = firstLesson[0].title
        }
      } else {
        const currentSagaOrder = mission.module?.order_index ?? 0
        const { data: nextSagas } = await supabase
          .from('modules')
          .select('id')
          .eq('course_id', course.id)
          .gt('order_index', currentSagaOrder)
          .order('order_index', { ascending: true })
          .limit(1)

        if (nextSagas && nextSagas.length > 0) {
          const { data: nextMissions2 } = await supabase
            .from('missions')
            .select('id')
            .eq('module_id', nextSagas[0].id)
            .order('order_index', { ascending: true })
            .limit(1)

          if (nextMissions2 && nextMissions2.length > 0) {
            const { data: firstLesson2 } = await supabase
              .from('lessons')
              .select('id, title')
              .eq('mission_id', nextMissions2[0].id)
              .order('order_index', { ascending: true })
              .limit(1)

            if (firstLesson2 && firstLesson2.length > 0) {
              nextHref = `/courses/${slug}/lessons/${firstLesson2[0].id}`
              nextTitle = firstLesson2[0].title
            }
          }
        }
      }
    }
  }

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-3xl mx-auto pb-12 md:pb-20">
        <QuestPlayer
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          lessonIndex={lesson.order_index}
          videoUrl={lesson.video_url}
          content={lesson.content}
          isFinalExam={lesson.is_final_exam ?? false}
          passThreshold={lesson.pass_threshold ?? 80}
          initialCompleted={progress?.completed ?? false}
          slug={slug}
          nextHref={nextHref}
          nextTitle={nextTitle}
        />
      </div>
    </AppShell>
  )
}