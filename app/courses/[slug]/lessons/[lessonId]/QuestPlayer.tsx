// FILE: app/courses/[slug]/lessons/[lessonId]/QuestPlayer.tsx  (mission state machine)

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import CodexContent from './CodexContent'

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

type Phase = 'briefing' | 'mission' | 'exam' | 'result'

export default function QuestPlayer({
  lessonId,
  lessonTitle,
  lessonIndex,
  videoUrl,
  content,
  isFinalExam,
  passThreshold,
  initialCompleted,
  slug,
  nextHref,
  nextTitle,
}: {
  lessonId: string
  lessonTitle: string
  lessonIndex: number
  videoUrl: string | null
  content: string | null
  isFinalExam: boolean
  passThreshold: number
  initialCompleted: boolean
  slug: string
  nextHref: string | null
  nextTitle: string | null
}) {
  const router = useRouter()
  const supabase = createClient()

  const [phase, setPhase] = useState<Phase>(
    initialCompleted ? 'mission' : 'briefing'
  )
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(initialCompleted)

  // Load questions on mount
  useEffect(() => {
    if (questions !== null) return
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
  }, [lessonId, questions, supabase])

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startMission() {
    setPhase('mission')
    scrollTop()
  }

  function finishMission() {
    setPhase('exam')
    setAnswers({})
    setResult(null)
    setError(null)
    scrollTop()
  }

  function retry() {
    setPhase('exam')
    setAnswers({})
    setResult(null)
    setError(null)
    scrollTop()
  }

  function backToCodex() {
    setPhase('mission')
    scrollTop()
  }

  async function submit() {
    setSubmitting(true)
    setError(null)

    const payload =
      questions && questions.length > 0 ? answers : {}

    const { data, error } = await supabase.rpc('submit_quiz', {
      p_lesson_id: lessonId,
      p_answers: payload,
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
    setPhase('result')
    setSubmitting(false)
    scrollTop()
  }

  const allAnswered =
    questions !== null &&
    questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined)

  const unansweredCount =
    questions && questions.length > 0
      ? questions.length - Object.keys(answers).length
      : 0

  // ═══════════════════════════════════════════════════════
  // BRIEFING
  // ═══════════════════════════════════════════════════════
  if (phase === 'briefing') {
    return (
      <div className="m-panel m-hud-corners p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[var(--m-cyan)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--m-cyan)] animate-pulse" />
          STANDBY
        </div>

        <div className="m-label m-label-cyan mb-3">
          {isFinalExam ? '🏆 Final Exam' : `⚔ Side Quest ${String(lessonIndex).padStart(2, '0')}`}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          {lessonTitle}
        </h2>

        <div className="border-t border-[var(--m-border)] mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-1">
              BRIEFING
            </div>
            <div className="text-2xl font-bold text-[var(--m-text)]">
              {videoUrl ? 'READY' : 'TEXT ONLY'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-1">
              EXAM
            </div>
            <div className="text-2xl font-bold text-[var(--m-text)]">
              {questions === null
                ? '...'
                : questions.length === 0
                ? 'NONE'
                : `${questions.length} Q`}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-1">
              PASS GATE
            </div>
            <div className="text-2xl font-bold text-[var(--m-cyan)]">
              {passThreshold}%
            </div>
          </div>
        </div>

        <div className="m-label mb-4">Objectives</div>
        <ul className="space-y-2 mb-10 text-sm">
          <li className="flex gap-3 text-[var(--m-text)]">
            <span className="text-[var(--m-cyan)] shrink-0">▸</span>
            <span>Study the Quest Briefing</span>
          </li>
          <li className="flex gap-3 text-[var(--m-text)]">
            <span className="text-[var(--m-cyan)] shrink-0">▸</span>
            <span>Read the Quest Codex</span>
          </li>
          <li className="flex gap-3 text-[var(--m-text)]">
            <span className="text-[var(--m-cyan)] shrink-0">▸</span>
            <span>
              Score {passThreshold}% or higher on the exam
            </span>
          </li>
          <li className="flex gap-3 text-[var(--m-text)]">
            <span className="text-[var(--m-cyan)] shrink-0">▸</span>
            <span>Unlock the next quest — +50 XP</span>
          </li>
        </ul>

        <button
          onClick={startMission}
          className="m-pulse w-full md:w-auto bg-[var(--m-cyan)] text-black font-bold tracking-widest text-sm rounded-lg px-10 py-4 hover:bg-cyan-300 transition"
        >
          ▶ START MISSION
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════
  // MISSION (video + codex)
  // ═══════════════════════════════════════════════════════
  if (phase === 'mission') {
    return (
      <div className="space-y-10">
        <div className="m-panel m-hud-corners p-5 md:p-6 flex items-center justify-between">
          <div>
            <div className="m-label m-label-cyan mb-1">
              {isFinalExam ? '🏆 Final Exam' : `⚔ Side Quest ${String(lessonIndex).padStart(2, '0')}`}
            </div>
            <div className="font-semibold text-lg">{lessonTitle}</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[var(--m-cyan)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--m-cyan)] animate-pulse" />
            IN PROGRESS
          </div>
        </div>

        {videoUrl && (
          <div>
            <div className="flex items-center gap-2 mb-3 m-label">
              <span>🎥</span> Quest Briefing
            </div>
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-[var(--m-border)]">
              {videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                  title={lessonTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        )}

        {content && (
          <div>
            <div className="flex items-center gap-2 mb-4 m-label">
              <span>{isFinalExam ? '📋' : '📖'}</span>{' '}
              {isFinalExam ? 'Exam Instructions' : 'Quest Codex'}
            </div>
            <div className="m-panel p-6 md:p-8">
              <CodexContent content={content} />
            </div>
          </div>
        )}

        {completed ? (
          <div className="m-panel border-green-800/50 bg-green-950/20 p-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 text-green-400 font-semibold">
              <span className="text-2xl">✓</span>
              <span>MISSION COMPLETE</span>
            </div>
            <button
              onClick={finishMission}
              className="text-sm text-green-400/70 hover:text-green-400 underline"
            >
              Retake exam
            </button>
          </div>
        ) : (
          <button
            onClick={finishMission}
            className="m-hud-corners w-full bg-[var(--m-cyan)] text-black font-bold tracking-widest text-sm rounded-lg px-10 py-4 hover:bg-cyan-300 transition"
          >
            ✓ FINISH MISSION — TAKE EXAM →
          </button>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════
  // EXAM
  // ═══════════════════════════════════════════════════════
  if (phase === 'exam') {
    if (questions === null) {
      return (
        <div className="m-panel m-hud-corners p-12 text-center text-[var(--m-text-dim)] font-mono text-sm">
          LOADING EXAM...
        </div>
      )
    }

    if (questions.length === 0) {
      return (
        <div className="space-y-6">
          <div className="m-panel m-hud-corners p-8">
            <div className="m-label mb-2">
              {isFinalExam ? '🏆 Final Exam' : '🧠 Practice Exam'}
            </div>
            <p className="text-[var(--m-text-muted)] mb-6">
              No questions yet. The instructor is preparing this exam.
            </p>
            <button
              onClick={submit}
              disabled={submitting}
              className="bg-white text-black font-bold tracking-widest text-sm rounded-lg px-8 py-3 hover:bg-neutral-200"
            >
              {submitting ? 'COMPLETING...' : '✓ COMPLETE MISSION'}
            </button>
          </div>
        </div>
      )
    }

    const answeredCount = Object.keys(answers).length
    const progressPct = Math.round((answeredCount / questions.length) * 100)

    return (
      <div className="space-y-6">
        <div className="m-panel m-hud-corners p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="m-label m-label-cyan">
              {isFinalExam ? '🏆 Mission Final Exam' : '🧠 Practice Exam'}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[var(--m-cyan)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--m-cyan)] animate-pulse" />
              LIVE
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div className="text-xs font-mono tracking-widest text-[var(--m-text-dim)]">
              PROGRESS
            </div>
            <div className="text-2xl font-bold tabular-nums text-[var(--m-cyan)]">
              {answeredCount}/{questions.length}
            </div>
          </div>

          <div className="m-progress-track mb-4">
            <div className="m-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--m-text-dim)] font-mono">
            <span>THRESHOLD: <span className="text-[var(--m-cyan)]">{passThreshold}%</span></span>
            <span>REWARD: <span className="text-[var(--m-cyan)]">+50 XP</span></span>
          </div>
        </div>

        <div className="space-y-5">
          {questions.map((q, i) => (
            <div key={q.id} className="m-panel m-hud-corners p-6">
              <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-2">
                QUESTION {String(i + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
              </div>
              <div className="text-base font-semibold mb-5 leading-relaxed">
                {q.question}
              </div>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const selected = answers[q.id] === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                      className={`w-full text-left text-sm rounded-lg px-4 py-3 border transition flex items-center gap-3 ${
                        selected
                          ? 'border-[var(--m-cyan)] bg-[rgba(34,211,238,0.08)] text-[var(--m-text)]'
                          : 'border-[var(--m-border)] hover:border-[var(--m-border-bright)] text-[var(--m-text-muted)]'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-6 h-6 rounded flex items-center justify-center font-mono text-xs border ${
                          selected
                            ? 'bg-[var(--m-cyan)] text-black border-[var(--m-cyan)]'
                            : 'border-[var(--m-border)] text-[var(--m-text-dim)]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-400 text-sm font-mono">ERROR: {error}</div>
        )}

        <div className="sticky bottom-4 z-10">
          <button
            onClick={submit}
            disabled={!allAnswered || submitting}
            className={`w-full font-bold tracking-widest text-sm rounded-lg px-8 py-4 transition ${
              allAnswered && !submitting
                ? 'bg-[var(--m-cyan)] text-black hover:bg-cyan-300 m-pulse'
                : 'bg-[var(--m-surface)] text-[var(--m-text-dim)] border border-[var(--m-border)] cursor-not-allowed'
            }`}
          >
            {submitting
              ? 'ANALYZING...'
              : allAnswered
              ? '▸ SUBMIT EXAM'
              : `ANSWER ALL ${unansweredCount} REMAINING`}
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════
  if (phase === 'result' && result) {
    const passed = result.passed
    return (
      <div
        className={`m-panel m-hud-corners p-10 md:p-14 text-center relative overflow-hidden ${
          passed ? 'border-green-700/50' : 'border-red-800/50'
        }`}
      >
        <div className="text-6xl mb-4">{passed ? '🏆' : '✗'}</div>

        <div
          className={`text-[10px] font-mono tracking-[0.3em] mb-3 ${
            passed ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {passed ? 'MISSION STATUS: CLEARED' : 'MISSION STATUS: FAILED'}
        </div>

        <h2
          className={`text-3xl md:text-5xl font-bold tracking-tight mb-10 ${
            passed ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {passed ? 'MISSION COMPLETE' : 'MISSION FAILED'}
        </h2>

        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          <div className="border border-[var(--m-border)] rounded-lg p-4">
            <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-1">
              SCORE
            </div>
            <div
              className={`text-2xl font-bold tabular-nums ${
                passed ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {result.score}%
            </div>
          </div>
          <div className="border border-[var(--m-border)] rounded-lg p-4">
            <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-1">
              CORRECT
            </div>
            <div className="text-2xl font-bold tabular-nums text-[var(--m-text)]">
              {result.correct}/{result.total}
            </div>
          </div>
          <div className="border border-[var(--m-border)] rounded-lg p-4">
            <div className="text-[10px] font-mono tracking-widest text-[var(--m-text-dim)] mb-1">
              REQUIRED
            </div>
            <div className="text-2xl font-bold tabular-nums text-[var(--m-cyan)]">
              {passThreshold}%
            </div>
          </div>
        </div>

        {passed ? (
          <>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-700/50 rounded-full px-5 py-2 mb-10 text-green-400 font-mono text-sm tracking-wider">
              <span>✓</span>
              <span>+50 XP EARNED</span>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={backToCodex}
                className="text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] border border-[var(--m-border)] rounded-lg px-6 py-3 transition"
              >
                REVIEW CODEX
              </button>
              {nextHref ? (
                <Link
                  href={nextHref}
                  className="bg-[var(--m-cyan)] text-black font-bold tracking-widest text-sm rounded-lg px-8 py-3 hover:bg-cyan-300 transition"
                >
                  NEXT: {nextTitle?.toUpperCase() || 'CONTINUE'} →
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="bg-[var(--m-cyan)] text-black font-bold tracking-widest text-sm rounded-lg px-8 py-3 hover:bg-cyan-300 transition"
                >
                  RETURN TO COURSE →
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-[var(--m-text-muted)] mb-10 max-w-md mx-auto">
              You need {passThreshold}% to clear this mission. Review the Codex
              and try again — every architect redraws the blueprint.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={backToCodex}
                className="text-sm text-[var(--m-text-muted)] hover:text-[var(--m-text)] border border-[var(--m-border)] rounded-lg px-6 py-3 transition"
              >
                ← REVIEW CODEX
              </button>
              <button
                onClick={retry}
                className="bg-red-500 text-white font-bold tracking-widest text-sm rounded-lg px-8 py-3 hover:bg-red-400 transition m-pulse"
              >
                🔄 RETRY MISSION
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return null
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}