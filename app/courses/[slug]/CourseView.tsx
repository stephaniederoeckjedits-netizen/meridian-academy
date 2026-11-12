'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

export type Lesson = { id: string; title: string; order_index: number; is_final_exam: boolean | null; pass_threshold: number | null }
export type Mission = { id: string; title: string; description: string | null; order_index: number; lessons: Lesson[] }
export type Saga = { id: string; title: string; description: string | null; order_index: number; missions: Mission[] }

const REDACTED = '████████'

export default function CourseView({ sagas, slug, completedIds, isAdmin = false }: {
  sagas: Saga[]; slug: string; completedIds: string[]; enrolled: boolean; defaultOpenIndex: number; isAdmin?: boolean;
}) {
  const completedSet = useMemo(() => new Set(completedIds), [completedIds])

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [activeSaga, setActiveSaga] = useState<Saga | null>(null)
  const [activeMission, setActiveMission] = useState<Mission | null>(null)

  const isSagaCleared = (sagaIndex: number) => {
    if (isAdmin) return true
    const saga = sagas[sagaIndex]
    return saga.missions.every(m => m.lessons.every(l => completedSet.has(l.id)))
  }

  const isMissionCleared = (saga: Saga, missionIndex: number) => {
    if (isAdmin) return true
    const mission = saga.missions[missionIndex]
    return mission.lessons.every(l => completedSet.has(l.id))
  }

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto">
      
      {/* BREADCRUMBS */}
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#8892a6] mb-8">
        <button onClick={() => setStep(1)} className={`hover:text-white transition-colors ${step === 1 ? 'text-[#22d3ee] font-bold' : ''}`}>
          MAIN QUESTS
        </button>
        {step >= 2 && activeSaga && (
          <>
            <span className="text-[#566074]">/</span>
            <button onClick={() => setStep(2)} className={`hover:text-white transition-colors ${step === 2 ? 'text-[#8b5cf6] font-bold' : ''}`}>
              {activeSaga.title}
            </button>
          </>
        )}
        {step === 3 && activeMission && (
          <>
            <span className="text-[#566074]">/</span>
            <span className="text-[#10b981] font-bold">{activeMission.title}</span>
          </>
        )}
      </div>

      {/* STEP 1: MAIN QUESTS */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {sagas.map((saga, i) => {
            const cleared = isSagaCleared(i)
            const previousCleared = i === 0 || isSagaCleared(i - 1)
            const locked = !isAdmin && !previousCleared
            
            return (
              <button
                key={saga.id}
                onClick={() => { if (!locked) { setActiveSaga(saga); setStep(2); } }}
                disabled={locked}
                className={`text-left p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                  ${locked ? 'opacity-40 cursor-not-allowed border-white/5 bg-[#0a1018]' : 
                    'border-[#22d3ee]/30 bg-[#0a1018] hover:border-[#22d3ee] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:-translate-y-1'}
                `}
              >
                {!locked && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />}
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono tracking-[0.3em] ${locked ? 'text-[#566074]' : 'text-[#22d3ee]'}`}>
                    MAIN QUEST {String(i + 1).padStart(2, '0')}
                  </span>
                  {cleared && <span className="text-[#10b981] text-sm">✓</span>}
                  {locked && <span className="text-[#566074] text-sm">🔒</span>}
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold mb-2 ${locked ? 'text-[#566074]' : 'text-white'}`}>
                  {locked ? REDACTED : saga.title}
                </h3>
                
                {!locked && saga.description && (
                  <p className="text-sm text-[#8892a6] leading-relaxed">{saga.description}</p>
                )}
                
                {!locked && (
                  <div className="mt-6 flex items-center gap-2 text-[#22d3ee] text-xs font-mono tracking-widest uppercase">
                    Select Main Quest <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* STEP 2: SAGAS */}
      {step === 2 && activeSaga && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
          {activeSaga.missions.map((mission, i) => {
            const cleared = isMissionCleared(activeSaga, i)
            const previousCleared = i === 0 || isMissionCleared(activeSaga, i - 1)
            const locked = !isAdmin && !previousCleared

            return (
              <button
                key={mission.id}
                onClick={() => { if (!locked) { setActiveMission(mission); setStep(3); } }}
                disabled={locked}
                className={`text-left p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                  ${locked ? 'opacity-40 cursor-not-allowed border-white/5 bg-[#0a1018]' : 
                    'border-[#8b5cf6]/30 bg-[#0a1018] hover:border-[#8b5cf6] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:-translate-y-1'}
                `}
              >
                {!locked && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />}
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono tracking-[0.3em] ${locked ? 'text-[#566074]' : 'text-[#8b5cf6]'}`}>
                    SAGA {String(i + 1).padStart(2, '0')}
                  </span>
                  {cleared && <span className="text-[#10b981] text-sm">✓</span>}
                  {locked && <span className="text-[#566074] text-sm">🔒</span>}
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold mb-2 ${locked ? 'text-[#566074]' : 'text-white'}`}>
                  {locked ? REDACTED : mission.title}
                </h3>
                
                {!locked && (
                  <div className="mt-6 flex items-center gap-2 text-[#8b5cf6] text-xs font-mono tracking-widest uppercase">
                    Select Saga <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* STEP 3: MISSIONS (LESSONS) */}
      {step === 3 && activeMission && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          {activeMission.lessons.map((lesson, i) => {
            const completed = isAdmin || completedSet.has(lesson.id)
            const firstUncompleted = activeMission.lessons.findIndex(l => !completedSet.has(l.id))
            const isUnlocked = isAdmin || completed || i === firstUncompleted
            const isCurrent = !isAdmin && i === firstUncompleted

            if (!isUnlocked) {
              return (
                <div key={lesson.id} className="block p-6 rounded-xl border border-white/5 bg-black/20 opacity-50 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-mono font-bold shrink-0 border border-white/20 text-[#566074]">
                        🔒
                      </div>
                      <span className="text-base md:text-lg text-[#566074]">{REDACTED}</span>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link key={lesson.id} href={`/courses/${slug}/lessons/${lesson.id}`} 
                className={`block p-6 rounded-xl transition-all duration-300 border relative overflow-hidden group
                  ${completed ? 'bg-[#10b981]/5 border-[#10b981]/30 hover:border-[#10b981]/60 hover:bg-[#10b981]/10' : 
                    isCurrent ? 'bg-[#22d3ee]/10 border-[#22d3ee]/60 shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:-translate-y-1' : 
                    'bg-[#0a1018] border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-mono font-bold shrink-0 
                      ${completed ? 'bg-[#10b981] text-black shadow-[0_0_15px_#10b981]' : 
                        isCurrent ? 'bg-[#22d3ee] text-black shadow-[0_0_20px_#22d3ee]' : 
                        'border border-white/20 text-[#566074]'}
                    `}>
                      {completed ? '✓' : isCurrent ? '▶' : String(i + 1).padStart(2, '0')}
                    </div>
                    <span className={`text-base md:text-lg ${isCurrent ? 'text-white font-bold' : 'text-[#c8d0dd] group-hover:text-white transition-colors'}`}>
                      {lesson.title}
                    </span>
                  </div>
                  {lesson.is_final_exam && (
                    <span className="text-[10px] font-mono tracking-widest text-[#f59e0b] border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      EXAM
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

    </div>
  )
}