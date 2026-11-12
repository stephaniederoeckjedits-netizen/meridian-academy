'use client'
import { useEffect, useState } from 'react'

type Tab = 'notes' | 'dutch' | 'business'
const TABS: Record<Tab, { label: string; placeholder: string }> = {
  notes: { label: 'NOTES', placeholder: 'Jot down thoughts, questions, ideas...' },
  dutch: { label: 'DUTCH', placeholder: 'New words, phrases, grammar rules...' },
  business: { label: 'BUSINESS', placeholder: 'Concepts, frameworks, insights...' },
}

export default function QuickNotes({ userEmail }: { userEmail?: string }) {
  const prefix = userEmail ? userEmail + '_' : 'guest_'
  const [tab, setTab] = useState<Tab>('notes')
  const [texts, setTexts] = useState<Record<Tab, string>>({ notes: '', dutch: '', business: '' })
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!prefix || prefix === 'guest_') return
    const loaded: Record<Tab, string> = {
      notes: localStorage.getItem(prefix + 'm-notes-notes') || '',
      dutch: localStorage.getItem(prefix + 'm-notes-dutch') || '',
      business: localStorage.getItem(prefix + 'm-notes-business') || '',
    }
    setTexts(loaded)
    setMounted(true)
  }, [prefix])

  useEffect(() => {
    if (!mounted || !prefix || prefix === 'guest_') return
    setSaved(false)
    const t = setTimeout(() => {
      localStorage.setItem(prefix + 'm-notes-notes', texts.notes)
      localStorage.setItem(prefix + 'm-notes-dutch', texts.dutch)
      localStorage.setItem(prefix + 'm-notes-business', texts.business)
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    }, 600)
    return () => clearTimeout(t)
  }, [texts, mounted, prefix])

  if (!mounted) return null

  const current = texts[tab]
  const words = current.trim() ? current.trim().split(/\s+/).length : 0

  function clear() {
    if (!window.confirm('Clear this note?')) return
    setTexts((t) => ({ ...t, [tab]: '' }))
  }

  return (
    <div className="brief-box p-4" style={{ '--accent-color': '#22d3ee' } as any}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#8892a6]">QUICK NOTES</span>
        </div>
        {saved ? <span className="text-[10px] font-mono text-[#10b981]">SAVED</span> : <span className="text-[10px] font-mono text-[#3a4250]">{words}w</span>}
      </div>
      <div className="grid grid-cols-3 gap-1 mb-3">
        {(Object.keys(TABS) as Tab[]).map((k) => {
          const active = k === tab
          const hasContent = texts[k].trim().length > 0
          return (
            <button key={k} onClick={() => setTab(k)} className="text-[9px] font-mono tracking-[0.2em] py-1.5 rounded transition-all relative" style={{ color: active ? '#a5f3fc' : '#566074', background: active ? 'rgba(34,211,238,0.08)' : 'transparent', border: '1px solid ' + (active ? 'rgba(34,211,238,0.45)' : 'rgba(34,211,238,0.12)') }}>
              {TABS[k].label}
              {hasContent && !active && <span className="absolute top-1 right-1 rounded-full bg-[#22d3ee]" style={{ width: 4, height: 4 }} />}
            </button>
          )
        })}
      </div>
      <textarea value={current} onChange={(e) => setTexts((t) => ({ ...t, [tab]: e.target.value }))} placeholder={TABS[tab].placeholder} rows={6} className="w-full rounded-md px-3 py-2 text-xs text-[#e5e9f0] placeholder:text-[#3a4250] outline-none resize-none font-mono leading-relaxed transition-colors mb-2 bg-black/40 border border-[#22d3ee]/20 focus:border-[#22d3ee]/50" />
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#3a4250]">{words} WORDS · {current.length} CHARS</span>
        <button onClick={clear} className="text-[9px] font-mono tracking-[0.25em] text-[#566074] hover:text-red-400 transition">CLEAR</button>
      </div>
    </div>
  )
}