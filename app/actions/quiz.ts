'use server';

import { createClient } from '@/lib/supabase/server';

export async function getQuizQuestions(lessonId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_quiz_questions', {
    p_lesson_id: lessonId,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function submitQuiz(lessonId: string, answers: Record<string, number>) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('submit_quiz', {
    p_lesson_id: lessonId,
    p_answers: answers,
  });
  if (error) throw new Error(error.message);
  
  let parsed = data;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch {}
  }
  if (Array.isArray(parsed)) return parsed[0];
  return parsed;
}