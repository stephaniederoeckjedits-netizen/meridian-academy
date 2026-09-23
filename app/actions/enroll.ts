'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not logged in' }

  const { error } = await supabase
    .from('enrollments')
    .insert({ user_id: user.id, course_id: courseId })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}