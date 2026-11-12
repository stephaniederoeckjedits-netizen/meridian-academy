'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CodexContent from './CodexContent'
import DisciplineScreen from '@/components/DisciplineScreen'
import QuizSection from './QuizSection'
import { triggerNav } from '@/components/NavLoader'
import { playPassSound, playFailSound } from '@/lib/sounds'
import { trackResume } from '@/lib/resume'

type Phase = 'briefing' | 'mission' | 'exam' | 'result'

function scrollMainToTop(smooth = false) {
  if (typeof document === 'undefined') return
  const main = document.querySelector('main')
  if (main) main.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}

export default function QuestPlayer({
  lessonId, lessonTitle, lessonIndex, videoUrl, content, isFinalExam, passThreshold, initialCompleted, slug, nextHref, nextTitle,
}: {
  lessonId: string; lessonTitle: string; lessonIndex: number; videoUrl: string | null; content: string | null; isFinalExam: boolean; passThreshold: number; initialCompleted: boolean; slug: string; nextHref: string | null; nextTitle: string | null;
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>(initialCompleted ? 'mission' : 'briefing')
  const [completed, setCompleted] = useState(initialCompleted)
  const [showDiscipline, setShowDiscipline] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null) // ADDED STATE FOR SCORE

  useEffect(() => {
    trackResume('course', lessonId, lessonTitle, `/courses/${slug}/lessons/${lessonId}`)
  }, [lessonId, lessonTitle, slug])

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => scrollMainToTop(false)))
  }, [phase])

  function startMission() { setPhase('mission'); scrollMainToTop(true) }
  function finishMission() { setPhase('exam'); scrollMainToTop(true) }
  
  function handleQuizComplete(passed: boolean, score: number) {
    if (passed) {
      playPassSound()
      setCompleted(true)
      setShowDiscipline(true)
    } else {
      playFailSound()
      setCompleted(false)
    }
    setFinalScore(score) // SAVE THE SCORE
    setPhase('result')
  }

  function goNext(href: string) {
    triggerNav()
    setTimeout(() => router.push(href), 300)
  }

  if (phase === 'briefing') {
    return (
      <div className="m-hud-panel p-8 md:p-12 relative overflow-hidden bg-[#0a1018] border border-cyan-500/30">
        <span className="m-hud-scan" />
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-4">MISSION BRIEF</div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">{lessonTitle}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-t border-white/10 pt-6">
          <div>
            <div className="text-[10px] font-mono text-[#566074] mb-1">BRIEFING</div>
            <div className="text-xl font-bold text-white">{videoUrl ? 'VIDEO' : 'TEXT ONLY'}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#566074] mb-1">EXAM</div>
            <div className="text-xl font-bold text-white">{isFinalExam ? 'FINAL' : 'SIDE QUEST'}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#566074] mb-1">PASS GATE</div>
            <div className="text-xl font-bold text-[#22d3ee]">{passThreshold}%</div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#566074] mb-4">OBJECTIVES</div>
        <ul className="space-y-2 mb-10 text-sm text-[#8892a6]">
          <li className="flex gap-3"><span className="text-[#22d3ee]">▸</span> Study the Quest Briefing</li>
          <li className="flex gap-3"><span className="text-[#22d3ee]">▸</span> Read the Lesson Material</li>
          <li className="flex gap-3"><span className="text-[#22d3ee]">▸</span> Score {passThreshold}% or higher on the exam</li>
        </ul>

        <button onClick={startMission} className="w-full md:w-auto bg-[#22d3ee] text-black font-bold tracking-widest text-sm rounded-lg px-10 py-4 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          ▶ START MISSION
        </button>
      </div>
    )
  }

  if (phase === 'mission') {
    return (
      <div className="space-y-8">
        <div className="m-hud-panel relative overflow-hidden bg-gradient-to-r from-[#121a27] to-[#0a1018] border border-[#22d3ee]/30 p-6 flex items-center justify-between shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-2">{isFinalExam ? 'FINAL EXAM' : 'SIDE QUEST ' + String(lessonIndex).padStart(2, '0')}</div>
            <div className="text-xl font-bold text-white">{lessonTitle}</div>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-[#22d3ee] flex items-center gap-2 bg-[#22d3ee]/10 px-3 py-1.5 rounded-full border border-[#22d3ee]/30">
            <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" /> IN PROGRESS
          </div>
        </div>

        {content && (
          <div className="m-hud-panel border border-white/10 bg-[#0a1018] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="m-hud-header px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <span className="text-[#22d3ee] font-mono tracking-widest text-xs font-bold">LESSON MATERIAL</span>
            </div>
            <div className="p-6 md:p-10">
              <CodexContent content={content} />
            </div>
          </div>
        )}

        {completed ? (
          <div className="m-hud-panel border border-emerald-500/40 bg-gradient-to-r from-[#10b981]/10 to-transparent p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="flex items-center gap-3 text-emerald-400 font-bold tracking-widest text-sm">
              <span className="text-2xl">✓</span> MISSION CLEARED
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={finishMission} className="flex-1 md:flex-none text-xs font-bold text-emerald-400/80 hover:text-emerald-400 px-4 py-2 border border-emerald-500/30 rounded-lg transition-colors">
                Retake Exam
              </button>
              {nextHref && (
                <button onClick={() => goNext(nextHref)} className="flex-1 md:flex-none bg-[#22d3ee] text-black font-bold tracking-widest text-xs rounded-lg px-6 py-3 hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  NEXT: {(nextTitle?.toUpperCase() || 'CONTINUE')} →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative group rounded-xl overflow-hidden p-[1px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <button onClick={finishMission} className="relative w-full bg-[#0a1018] text-white font-bold tracking-widest text-sm md:text-base rounded-lg px-10 py-5 hover:bg-transparent transition-colors flex flex-col items-center justify-center gap-2">
              <span className="text-[#22d3ee] flex items-center gap-2 text-lg">⚡ TAKE THE QUIZ TO UNLOCK NEXT MISSION ⚡</span>
              <span className="text-[10px] text-[#8892a6] font-mono">The will is everything. Prove your mastery.</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'exam') {
    return (
      <QuizSection
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        passThreshold={passThreshold}
        onComplete={handleQuizComplete}
      />
    )
  }

  if (phase === 'result') {
    return (
      <>
        {showDiscipline && <DisciplineScreen onDone={() => { setShowDiscipline(false); scrollMainToTop(false); }} />}
        <div className="m-hud-panel p-12 text-center border border-white/10 bg-[#0a1018] relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          <div className="text-6xl mb-6">{completed ? '🏆' : '💀'}</div>
          <h2 className={`text-4xl font-bold mb-4 ${completed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {completed ? 'MISSION CLEARED' : 'MISSION FAILED'}
          </h2>
          
          {/* SHOW THE SCORE HERE */}
          {finalScore !== null && (
            <div className="text-2xl font-mono text-white mb-4">
              Score: <span className={completed ? 'text-emerald-400' : 'text-rose-400'}>{finalScore}%</span>
            </div>
          )}

          <p className="text-[#8892a6] mb-8 max-w-md mx-auto">
            {completed ? 'You have successfully mastered this concept. Your XP has been synced to the ledger.' : `You need ${passThreshold}% to clear this mission. Review the Lesson and try again.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setPhase('mission')} className="px-8 py-3 border border-white/20 text-white font-bold text-xs rounded-lg hover:bg-white/5 transition-colors">
              REVIEW LESSON
            </button>
            <button onClick={finishMission} className={`px-8 py-3 font-bold text-xs rounded-lg ${completed ? 'bg-white text-black hover:bg-gray-200' : 'bg-rose-500 text-white hover:bg-rose-400'}`}>
              {completed ? 'REPLAY EXAM' : 'RETRY MISSION'}
            </button>
            {completed && nextHref && (
              <button onClick={() => goNext(nextHref)} className="px-8 py-3 bg-[#22d3ee] text-black font-bold text-xs rounded-lg hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                CONTINUE →
              </button>
            )}
          </div>
        </div>
      </>
    )
  }

  return null
}