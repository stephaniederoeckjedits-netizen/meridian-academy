import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'

export const revalidate = 0

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: categories } = await supabase.from('journal_categories').select('*').order('display_order')
  const { data: featured } = await supabase.from('journal_articles').select('*, category:journal_categories(name, slug, accent_color)').eq('status', 'published').eq('featured', true).order('published_at', { ascending: false }).limit(1).maybeSingle()
  const { data: editors } = await supabase.from('journal_articles').select('*, category:journal_categories(name, slug, accent_color)').eq('status', 'published').neq('slug', featured?.slug || '').order('published_at', { ascending: false }).limit(3)
  const { data: latest } = await supabase.from('journal_articles').select('*, category:journal_categories(name, slug, accent_color)').eq('status', 'published').order('published_at', { ascending: false }).limit(10)

  let continueReading: any[] = []
  let completedCount = 0
  if (user) {
    const { data: progress } = await supabase
      .from('journal_reading_progress')
      .select('article_id, scroll_percentage, completed, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20)
    
    if (progress && progress.length > 0) {
      completedCount = progress.filter((p: any) => p.completed).length
      const inProgress = progress.filter((p: any) => !p.completed && p.scroll_percentage > 3).slice(0, 4)
      if (inProgress.length > 0) {
        const ids = inProgress.map((p: any) => p.article_id)
        const { data: articles } = await supabase.from('journal_articles').select('*, category:journal_categories(name, slug, accent_color)').in('id', ids).eq('status', 'published')
        continueReading = (articles || []).map((a: any) => ({
          ...a,
          progress: inProgress.find((p: any) => p.article_id === a.id)?.scroll_percentage || 0
        }))
      }
    }
  }

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="max-w-7xl mx-auto pb-24">
        
        {/* 1. MASTHEAD */}
        <div className="border-b border-white/10 pb-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] text-[#f59e0b] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_10px_#f59e0b]" />
              MERIDIAN INTELLIGENCE
            </div>
            <h1 className="text-5xl md:text-8xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-tight leading-none mb-4">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#ec4899]">HUB</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#8892a6] font-[family-name:var(--font-garamond)] italic max-w-2xl">
              Live intelligence from around the world, and deep editorial essays from the Meridian team.
            </p>
          </div>
          {user && completedCount > 0 && (
            <div className="flex items-center gap-2 text-sm font-mono tracking-widest text-[#10b981] bg-[#10b981]/10 px-4 py-2 rounded-lg border border-[#10b981]/30 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {completedCount} ARTICLES READ
            </div>
          )}
        </div>

        {/* 2. EXPLORE BY CATEGORY (Global Navigation) */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#8892a6] font-bold">Browse Disciplines</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories?.map((cat: any) => (
              <Link key={cat.id} href={`/community/blog/category/${cat.slug}`}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_20px_-5px_rgba(0,0,0,0.5)]"
                style={{ borderColor: cat.accent_color + '40', backgroundColor: cat.accent_color + '08' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accent_color, boxShadow: `0 0 8px ${cat.accent_color}` }} />
                <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-white group-hover:text-[#22d3ee] transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION DIVIDER */}
        

        {/* 4. CONTINUE READING */}
        {continueReading.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#22d3ee] font-bold">Continue Reading</span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#22d3ee]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {continueReading.map((a: any) => (
                <Link key={a.id} href={`/community/blog/${a.slug}`}
                  className="group flex flex-col p-5 rounded-xl border border-[#22d3ee]/20 bg-[#0a0f16] hover:border-[#22d3ee]/50 transition-all">
                  <div className="w-full h-24 rounded-lg overflow-hidden shrink-0 bg-black mb-4">
                    {a.cover_image && <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-mono tracking-widest uppercase mb-1 font-bold" style={{ color: a.category?.accent_color }}>{a.category?.name}</div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition-colors line-clamp-2 mb-3">{a.title}</h3>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]" style={{ width: a.progress + '%' }} />
                        </div>
                        <span className="text-[9px] font-mono text-[#22d3ee] font-bold">{a.progress}%</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 5. THE EDITORIAL BLOG (Featured, Editor's, Latest) */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">
              The Editorial
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#f59e0b]/50 to-transparent" />
          </div>

          {/* FEATURED */}
          {featured && (
            <Link href={`/community/blog/${featured.slug}`} className="group block mb-16">
              <article className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0f16] hover:border-[#f59e0b]/40 transition-all duration-500">
                <div className="relative h-[400px] md:h-[600px] overflow-hidden">
                  <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className="text-[11px] font-mono tracking-widest uppercase px-4 py-2 rounded-lg bg-[#f59e0b] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.6)]">LEAD STORY</span>
                    <span className="text-[11px] font-mono tracking-widest uppercase px-4 py-2 rounded-lg border border-white/30 bg-black/40 backdrop-blur text-white">{featured.category?.name}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-cinzel)] font-bold text-white leading-tight mb-5 group-hover:text-[#f59e0b] transition-colors">{featured.title}</h2>
                  <p className="text-lg md:text-xl text-[#c8d0dd] max-w-4xl leading-relaxed mb-6 line-clamp-2">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-[12px] font-mono tracking-widest text-[#8892a6] uppercase">
                    <span className="text-white font-bold">{featured.author_name}</span><span className="w-px h-3 bg-white/20" />
                    <span>{featured.reading_minutes} min read</span><span className="w-px h-3 bg-white/20" />
                    <span className="text-[#f59e0b] font-bold">READ ARTICLE →</span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* EDITOR'S SELECTION */}
          {editors && editors.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-4 mb-8"><h3 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">Editor's Selection</h3><div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {editors.map((a: any) => (
                  <Link key={a.id} href={`/community/blog/${a.slug}`} className="group block">
                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] mb-5"><img src={a.cover_image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: a.category?.accent_color }}>{a.category?.name}</span>
                      <span className="text-[10px] font-mono text-[#3a4250]">·</span>
                      <span className="text-[10px] font-mono text-[#566074]">{a.reading_minutes} min read</span>
                    </div>
                    <h3 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-3 group-hover:text-[#f59e0b] transition-colors leading-tight">{a.title}</h3>
                    <p className="text-sm text-[#8892a6] leading-relaxed line-clamp-3">{a.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* LATEST STORIES */}
          {latest && latest.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8"><h3 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">Latest Stories</h3><div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" /></div>
              <div className="space-y-8">
                {latest.map((a: any) => (
                  <Link key={a.id} href={`/community/blog/${a.slug}`} className="group grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 py-8 border-b border-white/5 hover:border-[#f59e0b]/30 transition-colors items-start">
                    <div className="rounded-xl overflow-hidden border border-white/10 aspect-[16/10]"><img src={a.cover_image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: a.category?.accent_color }}>{a.category?.name}</span>
                        <span className="text-[10px] font-mono text-[#3a4250]">·</span>
                        <span className="text-[10px] font-mono tracking-widest text-[#566074] uppercase">{a.reading_minutes} min read</span>
                      </div>
                      <h3 className="text-2xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-3 group-hover:text-[#f59e0b] transition-colors">{a.title}</h3>
                      <p className="text-[#8892a6] leading-relaxed line-clamp-3 text-base">{a.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  )
}