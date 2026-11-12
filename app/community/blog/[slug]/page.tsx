import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import ArticleBody from '@/components/journal/ArticleBody'
import BookmarkButton from '@/components/journal/BookmarkButton'
import ReadingProgressTracker from '@/components/journal/ReadingProgressTracker'
import RelatedContent from '@/components/journal/RelatedContent'
import CommentsSection from '@/components/social/CommentsSection'
import BackLink from '@/components/ui/BackLink'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: article } = await supabase.from('journal_articles').select('title, excerpt').eq('slug', slug).eq('status', 'published').maybeSingle()
  return article ? { title: article.title + ' | Meridian Blog', description: article.excerpt } : { title: 'Not Found' }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: article } = await supabase.from('journal_articles').select('*, category:journal_categories(name, slug, accent_color)').eq('slug', slug).eq('status', 'published').maybeSingle()
  if (!article) notFound()

  const { data: siblings } = await supabase.from('journal_articles').select('slug, title, cover_image, reading_minutes, category:journal_categories(accent_color)').eq('status', 'published').eq('category_id', article.category_id).neq('slug', article.slug).limit(3)
  const categorySlug = (article.category as any)?.slug
  const categoryName = (article.category as any)?.name
  const accent = (article.category as any)?.accent_color || '#f59e0b'
  const blocks = typeof article.body === 'string' ? JSON.parse(article.body) : article.body

  // Extract headings for table of contents
  const headings = (blocks as any[]).filter((b: any) => b.type === 'h2').map((b: any) => b.text)

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <ReadingProgressTracker articleId={article.id} userId={user?.id || ''} />
      <div className="max-w-3xl mx-auto pb-24 pt-8">
        <BackLink href="/community/blog" label="Back to Blog" accent={accent} />
        
        <div className="flex items-center gap-3 mb-6">
          {categorySlug && (
            <Link href={`/community/blog/category/${categorySlug}`} className="text-[11px] font-mono tracking-widest uppercase px-4 py-2 rounded-full border-2 font-bold transition-all hover:-translate-y-0.5" style={{ color: accent, borderColor: accent + '60', backgroundColor: accent + '15' }}>
              {categoryName}
            </Link>
          )}
          <span className="text-[11px] font-mono tracking-widest uppercase px-4 py-2 rounded-full border-2 border-white/20 bg-white/5 text-[#c8d0dd] font-bold">{article.format}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-cinzel)] font-bold text-white leading-tight mb-6">{article.title}</h1>
        {article.subtitle && <p className="text-xl md:text-2xl text-[#8892a6] font-[family-name:var(--font-garamond)] italic leading-relaxed mb-8">{article.subtitle}</p>}

        <div className="flex items-center justify-between gap-4 pb-8 mb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#8b5cf6] flex items-center justify-center text-black font-bold">{article.author_name?.charAt(0) || 'M'}</div>
            <div>
              <div className="text-sm font-bold text-white">{article.author_name}</div>
              <div className="text-[10px] font-mono tracking-widest text-[#566074] uppercase">{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {article.reading_minutes} min read</div>
            </div>
          </div>
          <BookmarkButton articleId={article.id} />
        </div>

        {article.cover_image && <div className="rounded-2xl overflow-hidden border border-white/10 mb-12"><img src={article.cover_image} alt={article.title} className="w-full" /></div>}

        {/* TABLE OF CONTENTS */}
        {headings.length >= 3 && (
          <div className="mb-12 p-6 rounded-xl border border-white/10 bg-[#0a0f16]">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#8892a6] mb-3 font-bold">In this article</div>
            <ul className="space-y-2">
              {headings.map((h: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-[9px] font-mono text-[#f59e0b] mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[#c8d0dd] leading-snug">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div data-article-body><ArticleBody blocks={blocks} /></div>

        <RelatedContent categorySlug={categorySlug} />

        <CommentsSection articleId={article.id} userId={user?.id || ''} accent={accent} />

        {siblings && siblings.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-6"><h2 className="text-lg font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">More from {categoryName}</h2><div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {siblings.map((s: any) => (
                <Link key={s.slug} href={`/community/blog/${s.slug}`} className="group rounded-xl overflow-hidden border border-white/10 hover:border-[#f59e0b]/40 transition-all">
                  {s.cover_image && <div className="aspect-[16/10] overflow-hidden"><img src={s.cover_image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                  <div className="p-4">
                    <div className="text-[9px] font-mono text-[#566074] uppercase mb-1">{s.reading_minutes} min</div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#f59e0b] transition-colors line-clamp-2">{s.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-white/10"><BackLink href="/community/blog" label="Return to Blog" accent={accent} /></div>
      </div>
    </AppShell>
  )
}