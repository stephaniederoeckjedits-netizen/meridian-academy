// FILE: app/profile/ProfileClient.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  email: string
  username: string
  fullName: string
  role: string
  joinedAt: string
}

export default function ProfileClient({
  email,
  username,
  fullName,
  role,
  joinedAt,
}: Props) {
  const supabase = createClient()

  const [name, setName] = useState(fullName)
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [password, setPassword] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function saveName() {
    setSavingName(true)
    setNameMsg(null)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', (await supabase.auth.getUser()).data.user?.id)

    if (error) {
      setNameMsg({ type: 'err', text: error.message })
    } else {
      setNameMsg({ type: 'ok', text: 'Name updated.' })
    }
    setSavingName(false)
  }

  async function updatePassword() {
    if (password.length < 6) {
      setPwMsg({ type: 'err', text: 'Password must be at least 6 characters.' })
      return
    }
    setSavingPw(true)
    setPwMsg(null)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setPwMsg({ type: 'err', text: error.message })
    } else {
      setPwMsg({ type: 'ok', text: 'Password updated.' })
      setPassword('')
    }
    setSavingPw(false)
  }

  return (
    <div className="space-y-4">
      {/* IDENTITY */}
      <div
        className="relative rounded-2xl p-6 md:p-8 overflow-hidden"
        style={{
          border: '1px solid rgba(34,211,238,0.28)',
          background: 'rgba(6,10,16,0.72)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 60px rgba(34,211,238,0.10)',
        }}
      >
        <span className="pointer-events-none absolute top-0 left-0 w-3 h-3"
          style={{ borderTop: '1.5px solid #22d3ee', borderLeft: '1.5px solid #22d3ee' }} />
        <span className="pointer-events-none absolute top-0 right-0 w-3 h-3"
          style={{ borderTop: '1.5px solid #22d3ee', borderRight: '1.5px solid #22d3ee' }} />
        <span className="pointer-events-none absolute bottom-0 left-0 w-3 h-3"
          style={{ borderBottom: '1.5px solid #22d3ee', borderLeft: '1.5px solid #22d3ee' }} />
        <span className="pointer-events-none absolute bottom-0 right-0 w-3 h-3"
          style={{ borderBottom: '1.5px solid #22d3ee', borderRight: '1.5px solid #22d3ee' }} />

        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-5">
          <span className="w-1 h-1 rounded-full bg-[#22d3ee] animate-pulse" />
          IDENTITY
        </div>

        <div className="space-y-4">
          <InfoRow label="EMAIL" value={email} mono />
          <InfoRow label="USERNAME" value={username || '—'} mono />
          <InfoRow label="ROLE" value={role.toUpperCase()} />
          {joinedAt && (
            <InfoRow
              label="JOINED"
              value={new Date(joinedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
          )}
        </div>
      </div>

      {/* DISPLAY NAME */}
      <div
        className="relative rounded-2xl p-6 md:p-8 overflow-hidden"
        style={{
          border: '1px solid rgba(34,211,238,0.15)',
          background: 'rgba(6,10,16,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5"
          style={{ borderTop: '1px solid #22d3ee', borderLeft: '1px solid #22d3ee' }} />
        <span className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5"
          style={{ borderTop: '1px solid #22d3ee', borderRight: '1px solid #22d3ee' }} />

        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-5">
          <span className="w-1 h-1 rounded-full bg-[#22d3ee] animate-pulse" />
          DISPLAY NAME
        </div>

        <label className="o-label block mb-2 text-[10px]">FULL NAME</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="o-input"
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={saveName}
            disabled={savingName || name === fullName}
            className="bg-[var(--m-cyan)] text-black font-bold tracking-widest text-xs rounded-lg px-6 py-3 hover:bg-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingName ? 'SAVING...' : '▸ SAVE'}
          </button>
          {nameMsg && (
            <span className="text-xs font-mono"
              style={{ color: nameMsg.type === 'ok' ? '#10b981' : '#ef4444' }}>
              {nameMsg.type === 'ok' ? '✓ ' : '✗ '}{nameMsg.text}
            </span>
          )}
        </div>
      </div>

      {/* PASSWORD */}
      <div
        className="relative rounded-2xl p-6 md:p-8 overflow-hidden"
        style={{
          border: '1px solid rgba(34,211,238,0.15)',
          background: 'rgba(6,10,16,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5"
          style={{ borderTop: '1px solid #22d3ee', borderLeft: '1px solid #22d3ee' }} />
        <span className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5"
          style={{ borderTop: '1px solid #22d3ee', borderRight: '1px solid #22d3ee' }} />

        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-5">
          <span className="w-1 h-1 rounded-full bg-[#22d3ee] animate-pulse" />
          SECURITY
        </div>

        <label className="o-label block mb-2 text-[10px]">NEW PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="o-input"
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={updatePassword}
            disabled={savingPw || password.length === 0}
            className="bg-[var(--m-cyan)] text-black font-bold tracking-widest text-xs rounded-lg px-6 py-3 hover:bg-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingPw ? 'UPDATING...' : '▸ UPDATE PASSWORD'}
          </button>
          {pwMsg && (
            <span className="text-xs font-mono"
              style={{ color: pwMsg.type === 'ok' ? '#10b981' : '#ef4444' }}>
              {pwMsg.type === 'ok' ? '✓ ' : '✗ '}{pwMsg.text}
            </span>
          )}
        </div>
      </div>

      {/* console hint */}
      <div className="pt-2 flex items-center justify-center gap-5 text-[10px] font-mono tracking-[0.3em] text-[#566074] flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="text-[#22d3ee]">TAB</span>
          <span>NAVIGATE FIELDS</span>
        </span>
        <span className="w-px h-3" style={{ background: 'rgba(34,211,238,0.25)' }} />
        <span className="flex items-center gap-1.5">
          <span className="text-[#22d3ee]">CLICK</span>
          <span>SAVE</span>
        </span>
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0"
      style={{ borderColor: 'rgba(34,211,238,0.08)' }}>
      <span className="text-[10px] font-mono tracking-[0.25em] text-[#566074] shrink-0">
        {label}
      </span>
      <span
        className={`text-sm text-right min-w-0 truncate ${mono ? 'font-mono' : ''}`}
        style={{ color: '#e5e9f0' }}
      >
        {value}
      </span>
    </div>
  )
}