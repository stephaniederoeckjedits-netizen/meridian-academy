// FILE: components/QuickFlashcard.tsx

'use client'

import { useCallback, useState } from 'react'

const WORDS = [
  { nl: 'leren', en: 'to learn' },
  { nl: 'spreken', en: 'to speak' },
  { nl: 'denken', en: 'to think' },
  { nl: 'werken', en: 'to work' },
  { nl: 'wonen', en: 'to live' },
  { nl: 'lezen', en: 'to read' },
  { nl: 'schrijven', en: 'to write' },
  { nl: 'drinken', en: 'to drink' },
  { nl: 'eten', en: 'to eat' },
  { nl: 'slapen', en: 'to sleep' },
  { nl: 'water', en: 'water' },
  { nl: 'boek', en: 'book' },
  { nl: 'huis', en: 'house' },
  { nl: 'hand', en: 'hand' },
  { nl: 'school', en: 'school' },
  { nl: 'vriend', en: 'friend' },
  { nl: 'morgen', en: 'tomorrow / morning' },
  { nl: 'avond', en: 'evening' },
  { nl: 'goedemorgen', en: 'good morning' },
  { nl: 'dank je', en: 'thank you' },
]

export default function QuickFlashcard() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * WORDS.length)
  )
  const [flipped, setFlipped] = useState(false)

  const next = useCallback(() => {
    setIndex((i) => {
      let n = i
      while (n === i && WORDS.length > 1) {
        n = Math.floor(Math.random() * WORDS.length)
      }
      return n
    })
    setFlipped(false)
  }, [])

  const card = WORDS[index]

  return (
    <div className="m-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="m-label">⚡ Flashcard</div>
        <button
          onClick={next}
          className="text-[10px] font-mono text-[var(--m-cyan)] hover:underline"
        >
          NEXT →
        </button>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full h-24 border border-[var(--m-border)] rounded-lg flex items-center justify-center px-3 hover:border-[var(--m-border-bright)] transition"
      >
        <div className="text-center">
          {flipped ? (
            <div className="text-sm text-[var(--m-text-muted)]">
              {card.en}
            </div>
          ) : (
            <div className="text-lg font-bold text-[var(--m-cyan)]">
              {card.nl}
            </div>
          )}
          <div className="text-[9px] font-mono text-[var(--m-text-dim)] mt-2 tracking-widest">
            {flipped ? 'CLICK TO FLIP' : 'CLICK TO REVEAL'}
          </div>
        </div>
      </button>
    </div>
  )
}