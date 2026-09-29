// FILE: app/courses/[slug]/page.tsx  (URL: /courses/dutch-a1-foundations)

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import EnrollButton from '@/app/dashboard/EnrollButton'

const XP_PER_QUEST = 50

function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  for (const [v, s] of map) {
    while (n >= v) {
      out += s
      n -= v
    }
  }
  return out || 'I'
}

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

  const { data: sagasRaw } = await supabase
    .from('modules')
    .select(`
      id, title, description, order_index,
      missions (
        id, title, description, order_index,
        lessons (id, title, order_index)
      )
    `)
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

  const completedIds = new Set<string>()
  if (user) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true)
    progress?.forEach((p) => completedIds.add(p.lesson_id))
  }

  const sagas: any[] = (sagasRaw || []).map((s: any) => ({
    ...s,
    missions: (s.missions || [])
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((m: any) => ({
        ...m,
        lessons: (m.lessons || []).sort(
          (a: any, b: any) => a.order_index - b.order_index
        ),
      })),
  }))

  let currentFound = false
  let totalQuests = 0
  let completedQuests = 0

  for (const saga of sagas) {
    for (const mission of saga.missions) {
      for (const lesson of mission.lessons) {
        totalQuests++
        if (completedIds.has(lesson.id)) {
          lesson.state = 'completed'
          completedQuests++
        } else if (!currentFound) {
          lesson.state = 'current'
          currentFound = true
        } else {
          lesson.state = 'locked'
        }
      }
    }
  }

  const courseProgress =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0
  const totalXP = completedQuests * XP_PER_QUEST

  return (
    <AppShell userEmail={user?.email}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <Link
          href="/courses"
          className="text-sm text-[var(--m-text-dim)] hover:text-[var(--m-text)]"
        >
          ← Back to courses
        </Link>

        <div className="mt-8 mb-2 m-label m-label-cyan">
          {course.track === 'en_to_nl' ? 'English → Dutch' : 'Dutch → English'} · {course.level}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          {course.title}
        </h1>
        <p className="text-[var(--m-text-muted)] mb-8 max-w-2xl">
          {course.description}
        </p>

        {enrolled ? (
          <div className="m-panel p-6 mb-14">
            <div className="flex items-baseline justify-between mb-3">
              <div className="m-label">Course Progress</div>
              <div className="text-3xl font-bold text-[var(--m-cyan)] tabular-nums">
                {courseProgress}%
              </div>
            </div>
            <div className="m-progress-track mb-3">
              <div
                className="m-progress-fill"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--m-text-dim)]">
              <span>
                {completedQuests} / {totalQuests} quests complete
              </span>
              <span className="font-mono">{totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        ) : user ? (
          <div className="mb-12">
            <EnrollButton courseId={course.id} enrolled={false} />
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-block bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-neutral-200 mb-12"
          >
            Log in to enroll
          </Link>
        )}

        <div className="space-y-16">
          {sagas.map((saga, sagaIdx) => {
            const sagaQuests = saga.missions.flatMap((m: any) => m.lessons)
            const sagaDone = sagaQuests.filter(
              (l: any) => l.state === 'completed'
            ).length

            return (
              <section key={saga.id}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[var(--m-cyan)] text-xl">⚔</span>
                  <span className="m-label m-label-cyan">
                    Saga {toRoman(sagaIdx + 1)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  {saga.title}
                </h2>
                {saga.description && (
                  <p className="text-[var(--m-text-muted)] mb-3 max-w-2xl">
                    {saga.description}
                  </p>
                )}
                <div className="text-xs text-[var(--m-text-dim)] mb-6 font-mono">
                  {sagaDone} / {sagaQuests.length} quests complete
                </div>

                <div className="space-y-5">
                  {saga.missions.map((mission: any, mi: number) => {
                    const mQuests = mission.lessons
                    const mDone = mQuests.filter(
                      (l: any) => l.state === 'completed'
                    ).length

                    return (
                      <div key={mission.id} className="m-panel p-6">
                        <div className="flex items-center justify-between mb-1">
                          <span className="m-label">
                            Main Mission {String(mi + 1).padStart(2, '0')}
                          </span>
                          <span className="text-xs text-[var(--m-text-dim)] font-mono">
                            {mDone} / {mQuests.length}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight mb-5">
                          {mission.title}
                        </h3>

                        <div className="space-y-2">
                          {mQuests.map((lesson: any) => {
                            const clickable =
                              enrolled && lesson.state !== 'locked'

                            const stateClasses: Record<string, string> = {
                              completed:
                                'border-[var(--m-border)] bg-[var(--m-bg)] hover:border-[var(--m-border-bright)]',
                              current:
                                'border-cyan-500/40 bg-cyan-500/[0.06] hover:border-cyan-500/70 m-current-glow',
                              locked:
                                'border-[var(--m-border)] bg-[var(--m-bg)] opacity-50',
                            }
                            const indicator: Record<string, string> = {
                              completed: '✓',
                              current: '▶',
                              locked: '🔒',
                            }
                            const indColor: Record<string, string> = {
                              completed: 'text-green-400',
                              current: 'text-[var(--m-cyan)]',
                              locked: 'text-[var(--m-text-dim)]',
                            }

                            const inner = (
                              <>
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className={`text-base shrink-0 w-5 text-center ${indColor[lesson.state]}`}
                                  >
                                    {indicator[lesson.state]}
                                  </span>
                                  <span
                                    className={`text-sm truncate ${
                                      lesson.state === 'locked'
                                        ? 'text-[var(--m-text-dim)]'
                                        : 'text-[var(--m-text)]'
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-xs text-[var(--m-text-dim)] shrink-0 font-mono">
                                  +{XP_PER_QUEST} XP
                                </span>
                              </>
                            )

                            const cls = `flex items-center justify-between gap-3 rounded-lg px-4 py-3 border transition ${stateClasses[lesson.state]}`

                            if (!clickable) {
                              return (
                                <div key={lesson.id} className={cls}>
                                  {inner}
                                </div>
                              )
                            }

                            return (
                              <Link
                                key={lesson.id}
                                href={`/courses/${slug}/lessons/${lesson.id}`}
                                className={cls}
                              >
                                {inner}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}