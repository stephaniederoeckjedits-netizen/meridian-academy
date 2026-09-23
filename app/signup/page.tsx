'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username: email.split('@')[0] },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
      >
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-6">Create your account</h1>

        {error && (
          <p className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-lg p-3 mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm text-neutral-400 mb-1">Full name</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 mb-4 focus:border-neutral-600 outline-none"
        />

        <label className="block text-sm text-neutral-400 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 mb-4 focus:border-neutral-600 outline-none"
        />

        <label className="block text-sm text-neutral-400 mb-1">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 mb-6 focus:border-neutral-600 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-semibold rounded-full py-2.5 hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <p className="text-sm text-neutral-500 mt-4 text-center">
          Already have one?{' '}
          <Link href="/login" className="text-white hover:underline">Log in</Link>
        </p>
      </form>
    </main>
  )
}