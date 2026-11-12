'use client'
import { useState, useEffect } from 'react'
import QuickActions from './QuickActions'

type Tool = 'focus' | 'notes' | 'stats'

export default function DashboardWidgets({ userEmail }: { userEmail?: string }) {
  const prefix = userEmail ? userEmail + '_' : 'guest_'
  const [nextMission, setNextMission] = useState({ label: 'PENDING DIRECTIVE', text: 'Access the Vault', action: '/library/vault' })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!prefix || prefix === 'guest_') return
    const savedMissions = localStorage.getItem(prefix + 'meridian_missions')
    if (savedMissions) {
      const missions = JSON.parse(savedMissions)
      const pending = missions.find((m: any) => !m.completed)
      if (pending) {
        let action = '/dashboard'
        if (pending.text.includes('Vault')) action = '/library/vault'
        if (pending.text.includes('Focus')) action = 'command-center-focus'
        if (pending.text.includes('Scratchpad')) action = 'command-center-notes'
        if (pending.text.includes('Terminal')) action = 'command-center-stats'
        setNextMission({ label: 'PENDING DIRECTIVE', text: pending.text, action })
      } else {
        setNextMission({ label: 'ALL CLEAR', text: 'Awaiting new assignments.', action: '/dashboard' })
      }
    }
    setLoaded(true)
  }, [prefix])

  function openTool(section: Tool) {
    window.dispatchEvent(new CustomEvent('open-command-center', { detail: { section } }))
  }

  function openNextObjective() {
    if (nextMission.action === 'command-center-focus') openTool('focus')
    else if (nextMission.action === 'command-center-notes') openTool('notes')
    else if (nextMission.action === 'command-center-stats') openTool('stats')
    else window.location.href = nextMission.action
  }

  if (!loaded) return <div className="h-64 animate-pulse bg-white/5 rounded-lg w-full" />

  const isCC = nextMission.action.startsWith('command-center')

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="ps5-panel flex flex-col">
        <div className="ps5-panel-header">
          <span className="flex items-center gap-2 text-[#f59e0b]"><span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse" /> Next Objective</span>
        </div>
        <div className="p-5 flex flex-col justify-center">
          <div className="border-l-2 border-[#f59e0b] pl-4 py-1 mb-4">
            <div className="text-[10px] font-mono text-[#f59e0b] mb-1 uppercase tracking-widest font-bold">{nextMission.label}</div>
            <div className="text-sm font-mono text-white font-bold">{nextMission.text}</div>
          </div>
          <button onClick={openNextObjective} className="game-btn w-full py-3 text-xs flex items-center justify-center gap-2">
            {isCC ? 'Execute Directive' : 'Go to Destination'} <span className="text-base">→</span>
          </button>
        </div>
      </div>
      <QuickActions />
    </div>
  )
}