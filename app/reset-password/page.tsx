// FILE: app/reset-password/page.tsx  (URL: /reset-password)

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setReady(true)
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[var(--m-bg)] text-[var(--m-text)] m-grid-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md m-panel p-8">
        <Link
          href="/login"
          className="text-sm text-[var(--m-text-dim)] hover:text-[var(--m-text)]"
        >
          ← Back to login
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-6">Choose a new password</h1>

        {!ready ? (
          <p className="text-[var(--m-text-muted)] text-sm">
            Verifying reset link...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-lg p-3 mb-4">
                {error}
              </p>
            )}

            <label className="block text-sm text-[var(--m-text-muted)] mb-1">
              New password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded-lg px-3 py-2 mb-4 focus:border-[var(--m-border-bright)] outline-none"
            />

            <label className="block text-sm text-[var(--m-text-muted)] mb-1">
              Confirm password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded-lg px-3 py-2 mb-6 focus:border-[var(--m-border-bright)] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold rounded-full py-2.5 hover:bg-neutral-200 disabled:opacity-50 transition"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}