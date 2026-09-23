import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <span className="text-xl font-bold tracking-tight">Meridian Academy</span>
        <div className="flex gap-4 text-sm items-center">
          <Link href="/login" className="hover:text-neutral-300">Login</Link>
          <Link
            href="/signup"
            className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-neutral-200"
          >
            Join
          </Link>
        </div>
      </nav>

      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Master Dutch and English.
          <span className="block text-neutral-500">For real this time.</span>
        </h1>
        <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
          Structured courses, live practice, and a community that actually
          keeps you accountable. Built for the Dutch↔English bridge.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-neutral-200"
        >
          Start learning free
        </Link>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Courses</h2>
        {error && (
          <p className="text-red-400 text-sm">Error: {error.message}</p>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition"
            >
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                {course.track === 'en_to_nl' ? 'English → Dutch' : 'Dutch → English'} · {course.level}
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-neutral-400 text-sm">{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-neutral-800 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} Meridian Academy
      </footer>
    </main>
  )
}