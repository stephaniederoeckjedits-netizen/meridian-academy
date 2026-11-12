'use client'

import { useCallback, useMemo, useState } from 'react'
import { markFlashcardUsed } from '@/lib/activity'

type Cat = 'verbs' | 'nouns' | 'phrases'

const CAT_LABELS: Record<Cat, string> = {
  verbs: 'VERBS',
  nouns: 'NOUNS',
  phrases: 'PHRASES',
}

const WORDS: Record<Cat, { nl: string; en: string }[]> = {
  verbs: [
    { nl: 'leren',    en: 'to learn' },
    { nl: 'spreken',  en: 'to speak' },
    { nl: 'denken',   en: 'to think' },
    { nl: 'werken',   en: 'to work' },
    { nl: 'wonen',    en: 'to live' },
    { nl: 'lezen',    en: 'to read' },
    { nl: 'schrijven',en: 'to write' },
    { nl: 'drinken',  en: 'to drink' },
    { nl: 'eten',     en: 'to eat' },
    { nl: 'slapen',   en: 'to sleep' },
  ],
  nouns: [
    { nl: 'water',  en: 'water' },
    { nl: 'boek',   en: 'book' },
    { nl: 'huis',   en: 'house' },
    { nl: 'hand',   en: 'hand' },
    { nl: 'school', en: 'school' },
    { nl: 'vriend', en: 'friend' },
    { nl: 'morgen', en: 'morning' },
    { nl: 'avond',  en: 'evening' },
    { nl: 'tijd',   en: 'time' },
    { nl: 'wereld', en: 'world' },
  ],
  phrases: [
    { nl: 'goedemorgen',   en: 'good morning' },
    { nl: 'dank je',       en: 'thank you' },
    { nl: 'alsjeblieft',   en: 'please' },
    { nl: 'tot ziens',     en: 'goodbye' },
    { nl: 'hoe gaat het?', en: 'how are you?' },
    { nl: 'goedenavond',   en: 'good evening' },
    { nl: 'het spijt me',  en: 'I am sorry' },
    { nl: 'geen probleem', en: 'no problem' },
  ],
}

export default function QuickFlashcard({ userEmail }: { userEmail?: string }) {
  const [cat, setCat] = useState<Cat>('verbs')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState<Record<Cat, Set<number>>>({
    verbs: new Set(),
    nouns: new Set(),
    phrases: new Set(),
  })

  const list = WORDS[cat]
  const card = list[index % list.length]
  const seenCount = seen[cat].size

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % list.length)
    setFlipped(false)
  }, [list.length])

  function selectCat(c: Cat) {
    setCat(c)
    setIndex(0)
    setFlipped(false)
  }

  function flip() {
    markFlashcardUsed(userEmail)
    setFlipped((f) => !f)
    // mark as seen when revealed
    setSeen((prev) => {
      const nextSets = { ...prev }
      const s = new Set(nextSets[cat])
      s.add(index)
      nextSets[cat] = s
      return nextSets
    })
  }

  const progress = (seenCount / list.length) * 100

  return (
    <div className="m-hud-panel">
      <span className="m-hud-scan" />
      <div className="m-hud-header">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
          FLASHCARD
        </div>
        <span style={{ color: '#566074' }}>{String(index + 1).padStart(2, '0')}/{String(list.length).padStart(2, '0')}</span>
      </div>

      <div className="p-4">
        {/* Category tabs */}
        <div className="grid grid-cols-3 gap-1 mb-3">
          {(Object.keys(CAT_LABELS) as Cat[]).map((k) => {
            const active = k === cat
            return (
              <button
                key={k}
                onClick={() => selectCat(k)}
                className="text-[9px] font-mono tracking-[0.2em] py-1.5 rounded transition-all"
                style={{
                  color: active ? '#a5f3fc' : '#566074',
                  background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
                  border: '1px solid ' + (active ? 'rgba(34,211,238,0.45)' : 'rgba(34,211,238,0.12)'),
                }}
              >
                {CAT_LABELS[k]}
              </button>
            )
          })}
        </div>

        {/* Card */}
        <button
          onClick={flip}
          className="w-full h-28 rounded-md flex items-center justify-center px-4 transition mb-3 group"
          style={{
            border: '1px solid rgba(34,211,238,0.25)',
            background: flipped
              ? 'rgba(139,92,246,0.05)'
              : 'rgba(34,211,238,0.03)',
          }}
        >
          <div className="text-center">
            {flipped ? (
              <div className="text-base font-semibold text-[#c4b5fd]">
                {card.en}
              </div>
            ) : (
              <div
                className="text-2xl font-bold text-[#a5f3fc]"
                style={{ textShadow: '0 0 16px rgba(34,211,238,0.55)' }}
              >
                {card.nl}
              </div>
            )}
            <div className="text-[9px] font-mono text-[#3a4250] mt-2.5 tracking-[0.25em] group-hover:text-[#566074] transition">
              {flipped ? 'CLICK TO FLIP BACK' : 'CLICK TO REVEAL'}
            </div>
          </div>
        </button>

        {/* Progress + next */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#566074] shrink-0">
            {seenCount}/{list.length}
          </span>
          <div className="flex-1 h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(30,38,51,0.9)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: progress + '%',
                background: 'linear-gradient(90deg, #22d3ee, #8b5cf6)',
              }}
            />
          </div>
          <button
            onClick={next}
            className="text-[10px] font-mono tracking-[0.25em] text-[#22d3ee] hover:text-white transition shrink-0"
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  )
}