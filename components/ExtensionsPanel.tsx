// FILE: components/ExtensionsPanel.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import PomodoroTimer from './PomodoroTimer'
import QuickNotes from './QuickNotes'

const wordOfDay = [
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
]

export default function ExtensionsPanel() {
  const [collapsed, setCollapsed] = useState(false)

  const day = new Date().getDate()
  const wod = wordOfDay[day % wordOfDay.length]

  if (collapsed) {
    return (
      <aside className="hidden xl:flex flex-col w-12 border-l border-[var(--m-border)] bg-[var(--m-bg)]">
        <button
          onClick={() => setCollapsed(false)}
          className="p-3 text-[var(--m-cyan)] hover:bg-[var(--m-cyan-soft)] transition"
          aria-label="Open extensions"
        >
          ◂
        </button>
        <div className="text-[10px] font-mono text-[var(--m-text-dim)] rotate-90 mt-8 whitespace-nowrap">
          EXTENSIONS
        </div>
      </aside>
    )
  }

  return (
    <aside className="hidden xl:flex flex-col w-72 border-l border-[var(--m-border)] bg-[var(--m-bg)] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--m-border)] sticky top-0 bg-[var(--m-bg)] z-10">
        <div className="m-label m-label-cyan">Extensions</div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-[var(--m-text-muted)] hover:text-[var(--m-text)] transition text-sm"
          aria-label="Collapse extensions"
        >
          ▸
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="m-panel p-4">
          <div className="m-label mb-3">⚡ Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/courses"
              className="text-xs text-center border border-[var(--m-border)] rounded-lg py-2.5 hover:border-[var(--m-border-bright)] hover:bg-white/[0.02] transition text-[var(--m-text)]"
            >
              My Courses
            </Link>
            <Link
              href="/community"
              className="text-xs text-center border border-[var(--m-border)] rounded-lg py-2.5 hover:border-[var(--m-border-bright)] hover:bg-white/[0.02] transition text-[var(--m-text)]"
            >
              Community
            </Link>
            <Link
              href="/profile"
              className="text-xs text-center border border-[var(--m-border)] rounded-lg py-2.5 hover:border-[var(--m-border-bright)] hover:bg-white/[0.02] transition text-[var(--m-text)]"
            >
              Profile
            </Link>
            <Link
              href="/dashboard"
              className="text-xs text-center border border-[var(--m-border)] rounded-lg py-2.5 hover:border-[var(--m-border-bright)] hover:bg-white/[0.02] transition text-[var(--m-text)]"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <PomodoroTimer />
        <QuickNotes />

        {/* Word of the day */}
        <div className="m-panel p-4">
          <div className="m-label mb-3">🌐 Word of the Day</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--m-cyan)] mb-1">
              {wod.nl}
            </div>
            <div className="text-xs text-[var(--m-text-muted)]">
              {wod.en}
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="m-panel p-4">
          <div className="m-label mb-3">💬 Need Help?</div>
          <Link
            href="/community/general"
            className="block text-xs text-[var(--m-text-muted)] hover:text-[var(--m-cyan)] transition mb-2"
          >
            ▸ Ask in #general
          </Link>
          <Link
            href="/community/dutch-grammar"
            className="block text-xs text-[var(--m-text-muted)] hover:text-[var(--m-cyan)] transition mb-2"
          >
            ▸ Dutch grammar questions
          </Link>
          <Link
            href="/community/english-grammar"
            className="block text-xs text-[var(--m-text-muted)] hover:text-[var(--m-cyan)] transition"
          >
            ▸ English grammar questions
          </Link>
        </div>

        {/* Version */}
        <div className="text-[10px] font-mono text-[var(--m-text-dim)] text-center pt-2 pb-4">
          MERIDIAN v1.0 · LIVE
        </div>
      </div>
    </aside>
  )
}