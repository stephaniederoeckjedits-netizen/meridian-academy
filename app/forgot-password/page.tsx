// FILE: app/forgot-password/page.tsx  (URL: /forgot-password)

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
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
        <h1 className="text-2xl font-bold mt-4 mb-2">Reset your password</h1>

        {sent ? (
          <div className="mt-6">
            <div className="border border-green-800/50 bg-green-950/30 rounded-lg p-4 text-sm text-green-400 mb-4">
              ✓ Reset link sent to <strong>{email}</strong>
            </div>
            <p className="text-[var(--m-text-muted)] text-sm">
              Check your inbox. The link will take you to a page where you can
              choose a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-[var(--m-text-muted)] text-sm mb-6">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && (
              <p className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-lg p-3 mb-4">
                {error}
              </p>
            )}

            <label className="block text-sm text-[var(--m-text-muted)] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--m-bg)] border border-[var(--m-border)] rounded-lg px-3 py-2 mb-6 focus:border-[var(--m-border-bright)] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold rounded-full py-2.5 hover:bg-neutral-200 disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}