// FILE: app/library/ebooks/[slug]/page.tsx
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'

export const dynamic = 'force-dynamic'

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const { data: book } = await supabase
    .from('library_books')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (!book) notFound()

  const { data: chapters } = await supabase
    .from('library_chapters')
    .select('id, chapter_number, title, word_count')
    .eq('book_id', book.id)
    .order('chapter_number', { ascending: true })

  const { data: progress } = await supabase
    .from('library_progress')
    .select('chapter_id, scroll_percentage')
    .eq('user_id', user.id)
    .eq('book_id', book.id)
    .maybeSingle()

  const currentChapter = chapters?.find(c => c.id === progress?.chapter_id)
  const startChapterId = currentChapter ? currentChapter.id : chapters?.[0]?.id

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto pb-20">
        <Link href="/library/ebooks" className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#566074] hover:text-[#22d3ee] transition mb-8">
          ← BACK TO LIBRARY
        </Link>

        <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden mb-10"
          style={{
            background: `linear-gradient(135deg, ${book.accent_color}15 0%, rgba(6,10,16,0.8) 100%)`,
            border: `1px solid ${book.accent_color}40`
          }}
        >
          <div className="absolute top-0 left-0 bottom-0 w-3" style={{ background: book.accent_color }} />
          
          <div className="relative z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] mb-3 block" style={{ color: book.accent_color }}>
              MERIDIAN MANUSCRIPT
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
              {book.title}
            </h1>
            <h2 className="text-lg md:text-xl text-[#a5f3fc] mb-6 font-serif italic">
              {book.subtitle}
            </h2>
            <p className="text-sm md:text-base text-[#8892a6] leading-relaxed max-w-2xl mb-8">
              {book.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {startChapterId && (
                <Link
                  href={`/library/ebooks/${book.slug}/read?chapter=${startChapterId}`}
                  className="inline-flex items-center gap-2 text-black font-bold tracking-widest text-xs rounded-lg px-8 py-4 transition hover:opacity-90"
                  style={{ background: book.accent_color }}
                >
                  {progress ? 'CONTINUE READING →' : 'START READING →'}
                </Link>
              )}
              
              <div className="flex gap-6 text-[10px] font-mono tracking-widest text-[#566074]">
                <span>{chapters?.length || 0} CHAPTERS</span>
                <span>•</span>
                <span>
                  {Math.round((chapters?.reduce((sum, c) => sum + (c.word_count || 0), 0) || 0) / 250)} MIN READ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#566074]">TABLE OF CONTENTS</span>
            <span className="flex-1 h-px bg-[#1e2633]" />
          </div>

          <div className="space-y-2">
            {chapters?.map((ch) => {
              const isCurrent = progress?.chapter_id === ch.id
              
              return (
                <Link
                  key={ch.id}
                  href={`/library/ebooks/${book.slug}/read?chapter=${ch.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all group hover:bg-white/[0.02]"
                  style={{
                    border: isCurrent ? `1px solid ${book.accent_color}60` : '1px solid rgba(255,255,255,0.05)',
                    background: isCurrent ? `${book.accent_color}08` : 'transparent'
                  }}
                >
                  <span className="text-[10px] font-mono tabular-nums shrink-0" style={{ color: isCurrent ? book.accent_color : '#3a4250' }}>
                    CH {String(ch.chapter_number).padStart(2, '0')}
                  </span>
                  <span className={`flex-1 text-sm font-medium ${isCurrent ? 'text-white' : 'text-[#8892a6] group-hover:text-[#e5e9f0]'}`}>
                    {ch.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#3a4250]">
                    {ch.word_count ? `${Math.round(ch.word_count / 250)}m` : ''}
                  </span>
                  <span className="text-[#3a4250] group-hover:translate-x-1 transition-transform" style={{ color: isCurrent ? book.accent_color : '' }}>
                    ▸
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}