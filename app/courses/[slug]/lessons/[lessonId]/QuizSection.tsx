// FILE: app/courses/[slug]/lessons/[lessonId]/QuizSection.tsx  (exam + progress gate)

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Question = {
  id: string
  question: string
  options: string[]
  order_index: number
}

type QuizResult = {
  score: number
  passed: boolean
  correct: number
  total: number
}

export default function QuizSection({
  lessonId,
  initialCompleted,
}: {
  lessonId: string
  initialCompleted: boolean
}) {
  const router = useRouter()
  const supabase = createClient()

  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [completed, setCompleted] = useState(initialCompleted)
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.rpc('get_quiz_questions', {
        p_lesson_id: lessonId,
      })
      if (error) {
        setError(error.message)
        setQuestions([])
        return
      }
      setQuestions((data as Question[]) || [])
    }
    load()
  }, [lessonId])

  async function submit(finalAnswers: Record<string, number>) {
    setSubmitting(true)
    setError(null)

    const { data, error } = await supabase.rpc('submit_quiz', {
      p_lesson_id: lessonId,
      p_answers: finalAnswers,
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    const r = (data as QuizResult[])[0]
    setResult(r)
    if (r.passed) {
      setCompleted(true)
      router.refresh()
    }
    setSubmitting(false)
  }

  // Completed
  if (completed) {
    return (
      <div className="flex items-center justify-between border border-green-800/50 bg-green-950/30 rounded-lg px-5 py-4">
        <div className="flex items-center gap-3 text-green-400 font-semibold">
          <span className="text-xl">✓</span>
          <span>Quest Complete</span>
        </div>
        <div className="text-sm text-green-400 font-mono">
          {result ? `${result.score}% · ` : ''}+50 XP
        </div>
      </div>
    )
  }

  // Loading
  if (questions === null) {
    return (
      <div className="m-panel p-6 text-center text-[var(--m-text-dim)] text-sm">
        Loading practice exam...
      </div>
    )
  }

  // No quiz — one-click complete
  if (questions.length === 0) {
    return (
      <>
        {error && (
          <div className="mb-3 text-red-400 text-sm">Error: {error}</div>
        )}
        <button
          onClick={() => submit({})}
          disabled={submitting}
          className="w-full bg-white text-black font-semibold rounded-lg py-3.5 hover:bg-neutral-200 disabled:opacity-50 transition"
        >
          {submitting ? 'Completing...' : '✓ Complete Side Quest'}
        </button>
      </>
    )
  }

  // Failed state
  if (result && !result.passed) {
    return (
      <div className="m-panel p-6">
        <div className="flex items-center gap-2 mb-3 m-label">
          <span>🧠</span> Practice Exam
        </div>
        <div className="text-red-400 font-semibold mb-1">
          ✗ Not passed — {result.correct} / {result.total} ({result.score}%)
        </div>
        <p className="text-[var(--m-text-muted)] text-sm mb-5">
          You need 80% to unlock the next quest. Review the Codex and try again.
        </p>
        <button
          onClick={() => {
            setResult(null)
            setAnswers({})
            setStarted(true)
          }}
          className="w-full bg-white text-black font-semibold rounded-lg py-3.5 hover:bg-neutral-200 transition"
        >
          Retake Exam →
        </button>
      </div>
    )
  }

  // Intro state
  if (!started) {
    return (
      <div className="m-panel p-6">
        <div className="flex items-center gap-2 mb-3 m-label">
          <span>🧠</span> Practice Exam
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {questions.length} question{questions.length === 1 ? '' : 's'}
        </h3>
        <p className="text-[var(--m-text-muted)] text-sm mb-5 leading-relaxed">
          You need <span className="text-[var(--m-cyan)] font-semibold">80%</span>{' '}
          or higher to pass and unlock the next quest.
        </p>
        <button
          onClick={() => {
            setStarted(true)
            setResult(null)
            setAnswers({})
          }}
          className="w-full bg-white text-black font-semibold rounded-lg py-3.5 hover:bg-neutral-200 transition"
        >
          Start Exam →
        </button>
      </div>
    )
  }

  // Taking exam
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  return (
    <div className="m-panel p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 m-label">
          <span>🧠</span> Practice Exam
        </div>
        <div className="text-xs text-[var(--m-text-dim)] font-mono">
          {Object.keys(answers).length} / {questions.length} answered
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {questions.map((q, i) => (
          <div key={q.id}>
            <div className="text-sm font-medium mb-3 leading-relaxed">
              <span className="text-[var(--m-text-dim)] mr-2 font-mono">
                Q{i + 1}.
              </span>
              {q.question}
            </div>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.id]: idx }))
                    }
                    className={`w-full text-left text-sm rounded-lg px-4 py-2.5 border transition ${
                      selected
                        ? 'border-cyan-500/60 bg-cyan-500/[0.08] text-[var(--m-text)]'
                        : 'border-[var(--m-border)] hover:border-[var(--m-border-bright)] text-[var(--m-text-muted)]'
                    }`}
                  >
                    <span className="font-mono text-xs text-[var(--m-text-dim)] mr-2">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="mb-4 text-red-400 text-sm">Error: {error}</div>}

      <button
        onClick={() => submit(answers)}
        disabled={!allAnswered || submitting}
        className="w-full bg-white text-black font-semibold rounded-lg py-3.5 hover:bg-neutral-200 disabled:opacity-40 transition"
      >
        {submitting
          ? 'Checking...'
          : allAnswered
          ? 'Submit Exam'
          : `Answer all ${questions.length} questions`}
      </button>
    </div>
  )
}