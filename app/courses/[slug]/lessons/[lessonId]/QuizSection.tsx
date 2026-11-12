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
  lessonTitle,
  passThreshold,
  onComplete,
}: {
  lessonId: string
  lessonTitle: string
  passThreshold: number
  onComplete: (passed: boolean, score: number) => void
}) {
  const router = useRouter()
  const supabase = createClient()

  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [completed, setCompleted] = useState(false)
  const [started, setStarted] = useState(false)
  
  const [currentIndex, setCurrentIndex] = useState(0)
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

  async function handleSubmit() {
    console.log("Submit clicked with answers:", answers)
    setSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc('submit_quiz', {
        p_lesson_id: lessonId,
        p_answers: answers,
      })

      if (error) throw new Error(error.message)

      // Safely parse both array [{}] and single object {} responses
      let r: QuizResult | null = null
      if (Array.isArray(data)) {
        r = data[0] as QuizResult
      } else if (data && typeof data === 'object') {
        r = data as QuizResult
      }

      if (!r || typeof r.score === 'undefined') {
         console.error("Malformed response:", data)
         throw new Error("The server returned an unexpected response. Check the console.")
      }

      setResult(r)
      
      if (r.passed) {
        setCompleted(true)
        window.dispatchEvent(new Event('meridian-resume-updated'))
        router.refresh()
      }

      // DELAY ONCOMPLETE SO REACT CAN FINISH RENDERING "COMPLETED" STATE
      setTimeout(() => {
        if (onComplete) onComplete(r!.passed, r!.score)
      }, 150)

    } catch (err: any) {
      console.error("Submission error:", err)
      setError(err.message || "Something went wrong submitting the exam.")
    } finally {
      setSubmitting(false)
    }
  }

  const hudBox = (content: React.ReactNode, title = "PRACTICE EXAM") => (
    <div className="m-hud-panel border border-white/10 bg-[#0a1018] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <div className="m-hud-header px-6 py-4 border-b border-white/10 bg-white/[0.02]">
        <span className="text-[#22d3ee] font-mono tracking-widest text-xs font-bold">{title}</span>
      </div>
      <div className="p-6 md:p-10">
        {content}
      </div>
    </div>
  )

  if (completed) {
    return hudBox(
      <div className="flex items-center justify-between">
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

  if (questions === null) {
    return hudBox(<div className="text-center text-[#8892a6] text-sm">Loading practice exam...</div>)
  }

  if (questions.length === 0) {
    return hudBox(
      <>
        {error && <div className="mb-4 text-red-400 text-sm">Error: {error}</div>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-white text-black font-semibold rounded-lg py-3.5 hover:bg-neutral-200 disabled:opacity-50 transition"
        >
          {submitting ? 'Completing...' : '✓ Complete Side Quest'}
        </button>
      </>
    )
  }

  if (result && !result.passed) {
    return hudBox(
      <>
        <div className="text-red-400 font-semibold mb-2 text-lg">
          ✗ Not passed — {result.correct} / {result.total} ({result.score}%)
        </div>
        <p className="text-[#8892a6] text-sm mb-6">
          You need {passThreshold}% to unlock the next quest. Review the Codex and try again.
        </p>
        <button
          onClick={() => {
            setResult(null)
            setAnswers({})
            setCurrentIndex(0)
            setStarted(true)
          }}
          className="w-full bg-white text-black font-semibold rounded-lg py-3.5 hover:bg-neutral-200 transition"
        >
          Retake Exam →
        </button>
      </>
    )
  }

  if (!started) {
    return hudBox(
      <>
        <h3 className="text-lg font-semibold mb-2 text-white">
          {questions.length} question{questions.length === 1 ? '' : 's'}
        </h3>
        <p className="text-[#8892a6] text-sm mb-6 leading-relaxed">
          You need <span className="text-[#22d3ee] font-semibold">{passThreshold}%</span>{' '}
          or higher to pass and unlock the next quest.
        </p>
        <button
          onClick={() => {
            setStarted(true)
            setResult(null)
            setAnswers({})
            setCurrentIndex(0)
          }}
          className="w-full bg-[#22d3ee] text-black font-bold tracking-widest text-sm rounded-lg py-4 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        >
          START EXAM →
        </button>
      </>
    )
  }

  const q = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const isAnswered = answers[q.id] !== undefined

  return hudBox(
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-[#8892a6] font-mono tracking-widest uppercase">
          QUESTION {currentIndex + 1} OF {questions.length}
        </div>
        {isAnswered && (
          <div className="text-[10px] text-[#10b981] font-mono tracking-widest uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> ANSWERED
          </div>
        )}
      </div>

      <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-[#22d3ee] transition-all duration-300 shadow-[0_0_10px_#22d3ee]" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
        />
      </div>

      <div className="mb-8">
        <div className="text-lg font-medium mb-6 leading-relaxed text-white">
          {q.question}
        </div>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const selected = answers[q.id] === idx
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                className={`w-full text-left text-sm rounded-lg px-5 py-3.5 border transition-all ${
                  selected
                    ? 'border-[#22d3ee] bg-[#22d3ee]/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'border-white/10 hover:border-white/30 text-[#8892a6] hover:text-white'
                }`}
              >
                <span className="font-mono text-xs text-[#566074] mr-3">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {error && <div className="mb-6 text-red-400 text-sm p-3 bg-red-400/10 border border-red-400/20 rounded">{error}</div>}

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || submitting}
          className="px-6 py-3.5 rounded-lg border border-white/10 text-[#8892a6] hover:text-white hover:bg-white/5 disabled:opacity-30 transition font-mono text-xs uppercase tracking-wider"
        >
          ← Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={!isAnswered || submitting}
            className="flex-1 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest rounded-lg py-3.5 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next Question →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isAnswered || submitting}
            className="flex-1 bg-[#10b981] text-black font-bold font-mono text-xs uppercase tracking-widest rounded-lg py-3.5 hover:bg-[#34d399] shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Checking...' : 'Submit Exam'}
          </button>
        )}
      </div>
    </>
  )
}