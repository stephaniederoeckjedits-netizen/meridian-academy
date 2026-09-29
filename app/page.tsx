// FILE: app/page.tsx  (URL: / — public landing page)

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)

  return (
    <main className="min-h-screen bg-[var(--m-bg)] text-[var(--m-text)] m-grid-bg">
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-[var(--m-border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-bold text-sm">
            M
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight leading-none">
              MERIDIAN
            </div>
            <div className="text-[10px] tracking-[0.2em] text-[var(--m-text-muted)] mt-0.5">
              ACADEMY
            </div>
          </div>
        </Link>
        <div className="flex gap-5 items-center text-sm">
          <Link
            href="/community"
            className="text-[var(--m-text-muted)] hover:text-[var(--m-text)] transition"
          >
            Community
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-neutral-200 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[var(--m-text-muted)] hover:text-[var(--m-text)] transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-neutral-200 transition"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="px-6 py-28 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Master Dutch and English.
          <span className="block text-[var(--m-text-dim)]">For real this time.</span>
        </h1>
        <p className="text-lg text-[var(--m-text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
          Structured courses, live practice, and a community that actually
          keeps you accountable. Built for the Dutch↔English bridge.
        </p>
        <Link
          href={user ? '/dashboard' : '/signup'}
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-neutral-200 transition"
        >
          {user ? 'Go to dashboard' : 'Start learning free'}
        </Link>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="m-label m-label-cyan mb-2">Courses</div>
        <h2 className="text-2xl font-bold tracking-tight mb-8">
          Available tracks
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="m-panel m-panel-interactive p-6 block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="m-label m-label-cyan">
                  {course.track === 'en_to_nl' ? 'EN → NL' : 'NL → EN'}
                </div>
                <div className="m-label">{course.level}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 tracking-tight">
                {course.title}
              </h3>
              <p className="text-[var(--m-text-muted)] text-sm leading-relaxed">
                {course.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-[var(--m-border)] text-center text-[var(--m-text-dim)] text-sm">
        © {new Date().getFullYear()} Meridian Academy
      </footer>
    </main>
  )
}