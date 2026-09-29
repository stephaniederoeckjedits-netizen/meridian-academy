import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
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

      <section className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-300">
          ← Dashboard
        </Link>

        <div className="mt-6 mb-2 text-xs uppercase tracking-widest text-cyan-400">
          {course.track === 'en_to_nl' ? 'English → Dutch' : 'Dutch → English'} · {course.level}
        </div>
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-neutral-400 mb-8">{course.description}</p>

        {enrolled ? (
          <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30">
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-xs uppercase tracking-widest text-neutral-400">
                Course Progress
              </div>
              <div className="text-2xl font-bold text-cyan-400">{courseProgress}%</div>
            </div>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>{completedQuests} / {totalQuests} quests complete</span>
              <span>{totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        ) : user ? (
          <div className="mb-8">
            <EnrollButton courseId={course.id} enrolled={false} />
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-neutral-200"
          >
            Log in to enroll
          </Link>
        )}

        <div className="mt-12 space-y-14">
          {sagas.map((saga, sagaIdx) => {
            const sagaQuests = saga.missions.flatMap((m: any) => m.lessons)
            const sagaDone = sagaQuests.filter((l: any) => l.state === 'completed').length

            return (
              <div key={saga.id}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-cyan-400 text-2xl">⚔</span>
                  <span className="text-xs uppercase tracking-widest text-cyan-400">
                    Saga {toRoman(sagaIdx + 1)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{saga.title}</h2>
                {saga.description && (
                  <p className="text-neutral-400 mb-3">{saga.description}</p>
                )}
                <div className="text-xs text-neutral-500 mb-6">
                  {sagaDone} / {sagaQuests.length} quests complete
                </div>

                <div className="space-y-6">
                  {saga.missions.map((mission: any, mi: number) => {
                    const mQuests = mission.lessons
                    const mDone = mQuests.filter((l: any) => l.state === 'completed').length

                    return (
                      <div
                        key={mission.id}
                        className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/20"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs uppercase tracking-widest text-neutral-400">
                            Main Mission {String(mi + 1).padStart(2, '0')}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {mDone} / {mQuests.length}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-5">{mission.title}</h3>

                        <div className="space-y-2">
                          {mQuests.map((lesson: any) => {
                            const clickable = enrolled && lesson.state !== 'locked'
                            const rowStyles: Record<string, string> = {
                              completed: 'border-neutral-800 bg-neutral-950 hover:border-neutral-700',
                              current: 'border-cyan-500/50 bg-cyan-950/20 hover:border-cyan-400',
                              locked: 'border-neutral-900 bg-neutral-950/50 opacity-60',
                            }
                            const indicator: Record<string, string> = {
                              completed: '✓',
                              current: '▶',
                              locked: '🔒',
                            }
                            const indColor: Record<string, string> = {
                              completed: 'text-green-400',
                              current: 'text-cyan-400',
                              locked: 'text-neutral-600',
                            }

                            const inner = (
                              <>
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={`text-lg shrink-0 ${indColor[lesson.state]}`}>
                                    {indicator[lesson.state]}
                                  </span>
                                  <span
                                    className={`text-sm truncate ${
                                      lesson.state === 'locked'
                                        ? 'text-neutral-500'
                                        : 'text-neutral-200'
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-xs text-neutral-500 shrink-0">
                                  +{XP_PER_QUEST} XP
                                </span>
                              </>
                            )

                            const cls = `flex items-center justify-between gap-3 rounded-xl px-4 py-3 border transition ${rowStyles[lesson.state]}`

                            if (!clickable) {
                              return <div key={lesson.id} className={cls}>{inner}</div>
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
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}