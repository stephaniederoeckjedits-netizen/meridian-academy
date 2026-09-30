// FILE: app/admin/page.tsx  (URL: /admin — structure editor)

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import DeleteButton from './DeleteButton'
import {
  createSaga, updateSaga, deleteSaga,
  createMission, updateMission, deleteMission,
  createQuest, updateQuest, deleteQuest,
} from './actions'

const ADMIN_EMAILS = [
  'yassine_lek@hotmail.com',
  'stephaniederoeck.jedits@gmail.com',
]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) redirect('/dashboard')

  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id, slug, title, level, track,
      modules (
        id, title, description, order_index,
        missions (
          id, title, description, order_index,
          lessons (id, title, order_index)
        )
      )
    `)
    .order('created_at')

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <div className="m-label m-label-cyan mb-3">Admin</div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Content Structure
        </h1>
        <p className="text-[var(--m-text-muted)] mb-4">
          Manage courses, sagas, missions, and quests.
        </p>
        <div className="flex gap-5 mb-10 text-sm">
          <Link href="/admin/lessons" className="text-[var(--m-cyan)] hover:underline">
            → Video & Codex editor
          </Link>
        </div>

        {courses?.map((course: any) => {
          const sagas = (course.modules || []).sort(
            (a: any, b: any) => a.order_index - b.order_index
          )
          return (
            <section key={course.id} className="m-panel p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="m-label m-label-cyan mb-1">
                    {course.track === 'en_to_nl' ? 'EN → NL' : 'NL → EN'} · {course.level}
                  </div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-xs text-[var(--m-text-dim)] font-mono">
                    slug: {course.slug}
                  </p>
                </div>
              </div>

              {/* Sagas */}
              <div className="space-y-4">
                {sagas.map((saga: any, si: number) => {
                  const missions = (saga.missions || []).sort(
                    (a: any, b: any) => a.order_index - b.order_index
                  )
                  return (
                    <div
                      key={saga.id}
                      className="border border-[var(--m-border)] rounded-lg p-4 bg-[var(--m-bg)]/40"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="m-label mb-1">
                            Saga {String(si + 1).padStart(2, '0')} · order {saga.order_index}
                          </div>
                          <div className="font-semibold truncate">{saga.title}</div>
                          {saga.description && (
                            <div className="text-xs text-[var(--m-text-muted)] truncate">
                              {saga.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <details className="inline">
                            <summary className="text-xs text-[var(--m-cyan)] cursor-pointer hover:underline">
                              Edit
                            </summary>
                            <form
                              action={updateSaga}
                              className="mt-3 space-y-2 bg-[var(--m-surface)] p-3 rounded-lg w-72"
                            >
                              <input type="hidden" name="id" value={saga.id} />
                              <input
                                name="title"
                                defaultValue={saga.title}
                                required
                                className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                              />
                              <input
                                name="description"
                                defaultValue={saga.description || ''}
                                placeholder="Description"
                                className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                              />
                              <input
                                name="order_index"
                                type="number"
                                defaultValue={saga.order_index}
                                className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                              />
                              <button className="w-full bg-white text-black text-xs font-semibold rounded py-1.5">
                                Save
                              </button>
                            </form>
                          </details>
                          <DeleteButton action={deleteSaga} id={saga.id} label={saga.title} />
                        </div>
                      </div>

                      {/* Missions */}
                      <div className="space-y-3 ml-4 border-l border-[var(--m-border)] pl-4">
                        {missions.map((mission: any, mi: number) => {
                          const quests = (mission.lessons || []).sort(
                            (a: any, b: any) => a.order_index - b.order_index
                          )
                          return (
                            <div
                              key={mission.id}
                              className="border border-[var(--m-border)] rounded-lg p-3"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="min-w-0">
                                  <div className="m-label mb-0.5">
                                    Mission {String(mi + 1).padStart(2, '0')} · order {mission.order_index}
                                  </div>
                                  <div className="font-medium text-sm truncate">
                                    {mission.title}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <details className="inline">
                                    <summary className="text-xs text-[var(--m-cyan)] cursor-pointer hover:underline">
                                      Edit
                                    </summary>
                                    <form
                                      action={updateMission}
                                      className="mt-3 space-y-2 bg-[var(--m-surface)] p-3 rounded-lg w-72"
                                    >
                                      <input type="hidden" name="id" value={mission.id} />
                                      <input
                                        name="title"
                                        defaultValue={mission.title}
                                        required
                                        className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                      />
                                      <input
                                        name="description"
                                        defaultValue={mission.description || ''}
                                        placeholder="Description"
                                        className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                      />
                                      <input
                                        name="order_index"
                                        type="number"
                                        defaultValue={mission.order_index}
                                        className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                      />
                                      <button className="w-full bg-white text-black text-xs font-semibold rounded py-1.5">
                                        Save
                                      </button>
                                    </form>
                                  </details>
                                  <DeleteButton
                                    action={deleteMission}
                                    id={mission.id}
                                    label={mission.title}
                                  />
                                </div>
                              </div>

                              {/* Quests */}
                              <div className="space-y-1.5 ml-3 border-l border-[var(--m-border)] pl-3">
                                {quests.map((quest: any) => (
                                  <div
                                    key={quest.id}
                                    className="flex items-center justify-between gap-3 py-1.5"
                                  >
                                    <div className="text-sm truncate">
                                      <span className="text-[var(--m-text-dim)] font-mono mr-2">
                                        {String(quest.order_index).padStart(2, '0')}
                                      </span>
                                      {quest.title}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <details className="inline">
                                        <summary className="text-xs text-[var(--m-cyan)] cursor-pointer hover:underline">
                                          Edit
                                        </summary>
                                        <form
                                          action={updateQuest}
                                          className="absolute mt-3 space-y-2 bg-[var(--m-surface)] border border-[var(--m-border)] p-3 rounded-lg w-72 z-10"
                                        >
                                          <input type="hidden" name="id" value={quest.id} />
                                          <input
                                            name="title"
                                            defaultValue={quest.title}
                                            required
                                            className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                          />
                                          <input
                                            name="order_index"
                                            type="number"
                                            defaultValue={quest.order_index}
                                            className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                          />
                                          <button className="w-full bg-white text-black text-xs font-semibold rounded py-1.5">
                                            Save
                                          </button>
                                        </form>
                                      </details>
                                      <DeleteButton
                                        action={deleteQuest}
                                        id={quest.id}
                                        label={quest.title}
                                      />
                                    </div>
                                  </div>
                                ))}

                                {/* Add quest */}
                                <details className="pt-2">
                                  <summary className="text-xs text-[var(--m-cyan)] cursor-pointer hover:underline">
                                    + Add Quest
                                  </summary>
                                  <form
                                    action={createQuest}
                                    className="mt-2 space-y-2 bg-[var(--m-surface)] p-3 rounded-lg"
                                  >
                                    <input type="hidden" name="mission_id" value={mission.id} />
                                    <input
                                      name="title"
                                      placeholder="Quest title"
                                      required
                                      className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                    />
                                    <input
                                      name="order_index"
                                      type="number"
                                      placeholder="Order"
                                      defaultValue={quests.length + 1}
                                      className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                                    />
                                    <button className="w-full bg-white text-black text-xs font-semibold rounded py-1.5">
                                      Create Quest
                                    </button>
                                  </form>
                                </details>
                              </div>
                            </div>
                          )
                        })}

                        {/* Add mission */}
                        <details>
                          <summary className="text-xs text-[var(--m-cyan)] cursor-pointer hover:underline">
                            + Add Mission
                          </summary>
                          <form
                            action={createMission}
                            className="mt-2 space-y-2 bg-[var(--m-surface)] p-3 rounded-lg"
                          >
                            <input type="hidden" name="module_id" value={saga.id} />
                            <input
                              name="title"
                              placeholder="Mission title"
                              required
                              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                            />
                            <input
                              name="description"
                              placeholder="Description"
                              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                            />
                            <input
                              name="order_index"
                              type="number"
                              defaultValue={missions.length + 1}
                              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                            />
                            <button className="w-full bg-white text-black text-xs font-semibold rounded py-1.5">
                              Create Mission
                            </button>
                          </form>
                        </details>
                      </div>
                    </div>
                  )
                })}

                {/* Add saga */}
                <details>
                  <summary className="text-sm text-[var(--m-cyan)] cursor-pointer hover:underline">
                    + Add Saga
                  </summary>
                  <form
                    action={createSaga}
                    className="mt-3 space-y-2 bg-[var(--m-surface)] p-3 rounded-lg"
                  >
                    <input type="hidden" name="course_id" value={course.id} />
                    <input
                      name="title"
                      placeholder="Saga title"
                      required
                      className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                    />
                    <input
                      name="description"
                      placeholder="Description"
                      className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                    />
                    <input
                      name="order_index"
                      type="number"
                      defaultValue={sagas.length + 1}
                      className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded px-3 py-1.5 text-sm"
                    />
                    <button className="w-full bg-white text-black text-xs font-semibold rounded py-1.5">
                      Create Saga
                    </button>
                  </form>
                </details>
              </div>
            </section>
          )
        })}
      </div>
    </AppShell>
  )
}