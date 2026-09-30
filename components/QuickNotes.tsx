// FILE: components/QuickNotes.tsx

'use client'

import { useEffect, useState } from 'react'

export default function QuickNotes() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('m-quick-notes') || ''
    setText(stored)
  }, [])

  useEffect(() => {
    if (text === '') return
    setSaved(false)
    const t = setTimeout(() => {
      localStorage.setItem('m-quick-notes', text)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 500)
    return () => clearTimeout(t)
  }, [text])

  return (
    <div className="m-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="m-label">✎ Quick Notes</div>
        {saved && (
          <span className="text-[10px] text-green-400 font-mono">SAVED</span>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Jot down words, phrases, questions..."
        rows={6}
        className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded-lg px-3 py-2 text-xs text-[var(--m-text)] placeholder:text-[var(--m-text-dim)] focus:border-[var(--m-border-bright)] outline-none resize-none font-mono leading-relaxed"
      />
    </div>
  )
}