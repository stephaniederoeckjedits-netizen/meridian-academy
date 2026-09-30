// FILE: app/admin/actions.ts  (server actions for content CRUD)

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = [
  'yassine_lek@hotmail.com',
  'stephaniederoeck.jedits@gmail.com',
]

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/dashboard')
  }
  return supabase
}

function refresh() {
  revalidatePath('/admin')
  revalidatePath('/courses')
  revalidatePath('/dashboard')
}

// ---------- SAGAS ----------

export async function createSaga(formData: FormData) {
  const supabase = await requireAdmin()
  const course_id = String(formData.get('course_id') || '')
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const order_index = parseInt(String(formData.get('order_index') || '1')) || 1
  if (!course_id || !title) return

  await supabase.from('modules').insert({
    course_id, title, description: description || null, order_index,
  })
  refresh()
}

export async function updateSaga(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const order_index = parseInt(String(formData.get('order_index') || '1')) || 1
  if (!id || !title) return

  await supabase.from('modules').update({
    title, description: description || null, order_index,
  }).eq('id', id)
  refresh()
}

export async function deleteSaga(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return
  await supabase.from('modules').delete().eq('id', id)
  refresh()
}

// ---------- MISSIONS ----------

export async function createMission(formData: FormData) {
  const supabase = await requireAdmin()
  const module_id = String(formData.get('module_id') || '')
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const order_index = parseInt(String(formData.get('order_index') || '1')) || 1
  if (!module_id || !title) return

  await supabase.from('missions').insert({
    module_id, title, description: description || null, order_index,
  })
  refresh()
}

export async function updateMission(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const order_index = parseInt(String(formData.get('order_index') || '1')) || 1
  if (!id || !title) return

  await supabase.from('missions').update({
    title, description: description || null, order_index,
  }).eq('id', id)
  refresh()
}

export async function deleteMission(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return
  await supabase.from('missions').delete().eq('id', id)
  refresh()
}

// ---------- QUESTS (lessons) ----------

export async function createQuest(formData: FormData) {
  const supabase = await requireAdmin()
  const mission_id = String(formData.get('mission_id') || '')
  const title = String(formData.get('title') || '').trim()
  const order_index = parseInt(String(formData.get('order_index') || '1')) || 1
  if (!mission_id || !title) return

  // mission_id needed on lessons; grab course_id from mission → module
  const { data: mission } = await supabase
    .from('missions')
    .select('module_id, modules:module_id(course_id)')
    .eq('id', mission_id)
    .single()

  const course_id = (mission as any)?.modules?.course_id

  await supabase.from('lessons').insert({
    course_id,
    mission_id,
    title,
    order_index,
  })
  refresh()
}

export async function updateQuest(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const order_index = parseInt(String(formData.get('order_index') || '1')) || 1
  if (!id || !title) return

  await supabase.from('lessons').update({
    title, order_index,
  }).eq('id', id)
  refresh()
}

export async function deleteQuest(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return
  await supabase.from('lessons').delete().eq('id', id)
  refresh()
}

// ---------- COURSES ----------

export async function createCourse(formData: FormData) {
  const supabase = await requireAdmin()
  const slug = String(formData.get('slug') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const track = String(formData.get('track') || 'en_to_nl')
  const level = String(formData.get('level') || 'A1')
  if (!slug || !title) return

  await supabase.from('courses').insert({
    slug, title, description: description || null, track, level, published: true,
  })
  refresh()
}