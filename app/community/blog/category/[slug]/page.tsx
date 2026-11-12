import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import BackLink from '@/components/ui/BackLink'

export const revalidate = 0

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: category } = await supabase.from('journal_categories').select('*').eq('slug', slug).maybeSingle()
  if (!category) notFound()
  const { data: articles } = await supabase.from('journal_articles').select('*, category:journal_categories(name, slug, accent_color)').eq('status', 'published').eq('category_id', category.id).order('published_at', { ascending: false })
  const featured = articles?.[0]
  const rest = articles?.slice(1) || []

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="max-w-6xl mx-auto pb-24 pt-8">
        <BackLink href="/community/blog" label="Back to Blog" accent={category.accent_color} />
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-3 text-[11px] font-mono tracking-widest uppercase mb-4 font-bold" style={{ color: category.accent_color }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: category.accent_color, boxShadow: `0 0 10px ${category.accent_color}` }} />CATEGORY
          </div>
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-tight mb-4 leading-none">{category.name}</h1>
          <p className="text-lg text-[#8892a6] font-[family-name:var(--font-garamond)] italic">{category.description}</p>
        </div>
        {featured ? (
          <>
            <Link href={`/community/blog/${featured.slug}`} className="group block mb-16">
              <article className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#f59e0b]/40 transition-all">
                <div className="relative h-[320px] md:h-[440px] overflow-hidden">
                  <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-white leading-tight mb-4 group-hover:text-[#f59e0b] transition-colors">{featured.title}</h2>
                  <p className="text-base md:text-lg text-[#c8d0dd] max-w-3xl leading-relaxed">{featured.excerpt}</p>
                </div>
              </article>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rest.map((a: any) => (
                <Link key={a.id} href={`/community/blog/${a.slug}`} className="group block">
                  <div className="rounded-xl overflow-hidden border border-white/10 aspect-[16/10] mb-4"><img src={a.cover_image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#566074] mb-2">{a.reading_minutes} min read</div>
                  <h3 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-2 group-hover:text-[#f59e0b] transition-colors">{a.title}</h3>
                  <p className="text-sm text-[#8892a6] line-clamp-2">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </>
        ) : <div className="text-center py-20 text-[#566074] font-mono text-sm">No articles yet.</div>}
      </div>
    </AppShell>
  )
}