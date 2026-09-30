// FILE: app/profile/ProfileClient.tsx  (client forms for profile + password)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProfileClient({
  email,
  fullName,
  username,
}: {
  email: string
  fullName: string
  username: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(fullName)
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    setNameSaving(true)
    setNameError(null)
    setNameSaved(false)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim() })
      .eq('id', (await supabase.auth.getUser()).data.user?.id)

    if (error) {
      setNameError(error.message)
    } else {
      setNameSaved(true)
      router.refresh()
      setTimeout(() => setNameSaved(false), 2000)
    }
    setNameSaving(false)
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters')
      return
    }
    setPwSaving(true)
    setPwError(null)
    setPwSaved(false)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPwError(error.message)
    } else {
      setPwSaved(true)
      setNewPassword('')
      setTimeout(() => setPwSaved(false), 2000)
    }
    setPwSaving(false)
  }

  return (
    <div className="space-y-8">
      {/* Profile info */}
      <div className="m-panel p-6">
        <div className="m-label mb-5">Profile</div>

        <div className="mb-5">
          <div className="text-xs text-[var(--m-text-dim)] mb-1">Email</div>
          <div className="text-sm font-mono">{email}</div>
        </div>

        <div className="mb-5">
          <div className="text-xs text-[var(--m-text-dim)] mb-1">Username</div>
          <div className="text-sm font-mono">{username || '—'}</div>
        </div>

        <form onSubmit={saveName} className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--m-text-dim)] mb-1">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded-lg px-3 py-2 focus:border-[var(--m-border-bright)] outline-none text-sm"
            />
          </div>

          {nameError && <div className="text-red-400 text-xs">{nameError}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={nameSaving}
              className="bg-white text-black text-sm font-semibold rounded-lg px-5 py-2 hover:bg-neutral-200 disabled:opacity-50 transition"
            >
              {nameSaving ? 'Saving...' : 'Save'}
            </button>
            {nameSaved && (
              <span className="text-green-400 text-sm">✓ Saved</span>
            )}
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="m-panel p-6">
        <div className="m-label mb-5">Change password</div>
        <form onSubmit={savePassword} className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--m-text-dim)] mb-1">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded-lg px-3 py-2 focus:border-[var(--m-border-bright)] outline-none text-sm"
            />
          </div>

          {pwError && <div className="text-red-400 text-xs">{pwError}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pwSaving || newPassword.length === 0}
              className="bg-white text-black text-sm font-semibold rounded-lg px-5 py-2 hover:bg-neutral-200 disabled:opacity-50 transition"
            >
              {pwSaving ? 'Updating...' : 'Update password'}
            </button>
            {pwSaved && (
              <span className="text-green-400 text-sm">✓ Updated</span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}