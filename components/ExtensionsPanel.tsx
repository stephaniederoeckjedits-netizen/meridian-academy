// FILE: components/ExtensionsPanel.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import PomodoroTimer from './PomodoroTimer'
import QuickNotes from './QuickNotes'
import StudyStreak from './StudyStreak'
import DailyGoal from './DailyGoal'
import QuickFlashcard from './QuickFlashcard'

export default function ExtensionsPanel() {
  const [collapsed, setCollapsed] = useState(false)

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
              href="/library"
              className="text-xs text-center border border-[var(--m-border)] rounded-lg py-2.5 hover:border-[var(--m-border-bright)] hover:bg-white/[0.02] transition text-[var(--m-text)]"
            >
              Library
            </Link>
            <Link
              href="/profile"
              className="text-xs text-center border border-[var(--m-border)] rounded-lg py-2.5 hover:border-[var(--m-border-bright)] hover:bg-white/[0.02] transition text-[var(--m-text)]"
            >
              Profile
            </Link>
          </div>
        </div>

        <StudyStreak />
        <DailyGoal />
        <PomodoroTimer />
        <QuickFlashcard />
        <QuickNotes />

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

        <div className="text-[10px] font-mono text-[var(--m-text-dim)] text-center pt-2 pb-4">
          MERIDIAN v1.1 · LIVE
        </div>
      </div>
    </aside>
  )
}