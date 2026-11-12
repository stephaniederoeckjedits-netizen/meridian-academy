import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TrendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const supabase = await createClient();

  const { data: news } = await supabase.from('daily_news')
    .select('id, title, url, source, category, excerpt, published_at')
    .order('published_at', { ascending: false }).limit(40);
  const { data: threads } = await supabase.from('threads')
    .select('id, title, created_at, channels(slug, name), posts(count)')
    .order('created_at', { ascending: false }).limit(12);
  const { data: essays } = await supabase.from('journal_articles')
    .select('title, slug, category').eq('status', 'published')
    .order('created_at', { ascending: false }).limit(6);

  const items = (news || []) as any[];
  const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
  const hot = [...((threads || []) as any[])].sort((a, b) => (b.posts?.[0]?.count || 0) - (a.posts?.[0]?.count || 0)).slice(0, 6);

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#ec4899] mb-3">
          <span className="w-1 h-1 rounded-full bg-[#ec4899] animate-pulse" />LIVE INTELLIGENCE
        </div>
        <h1 className="text-3xl md:5xl font-bold tracking-[0.08em] text-[#e5e9f0] mb-2">THE PULSE</h1>
        <p className="text-sm text-[#8892a6] mb-8">What the world is reading, debating, and building — curated into the university feed.</p>

        <div className="flex gap-2 flex-wrap mb-10">
          <Link href="/community/news" className="chip">ALL CHANNELS</Link>
          {cats.map(c => <Link key={c} href={'/community/news'} className="chip">{String(c).toUpperCase()}</Link>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 m-hud-panel overflow-hidden">
            <div className="m-hud-header px-5 py-3 text-[10px] font-mono tracking-[0.25em] text-[#22d3ee]">TRENDING NOW · {items.length} LINKS</div>
            <div className="divide-y divide-white/5">
              {items.slice(0, 15).map((n, i) => (
                <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="trend-item flex gap-4 px-5 py-4">
                  <span className="trend-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-bold text-[#e5e9f0] leading-snug mb-1">{n.title}</span>
                    <span className="block text-[9px] font-mono text-[#566074]">{n.source} · {String(n.category).toUpperCase()} · {new Date(n.published_at).toLocaleDateString()}</span>
                    {n.excerpt && <span className="block text-[11px] text-[#8892a6] mt-1 line-clamp-2">{n.excerpt}</span>}
                  </span>
                  <span className="self-center text-[#22d3ee]">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="m-hud-panel overflow-hidden">
              <div className="m-hud-header px-5 py-3 text-[10px] font-mono tracking-[0.25em] text-[#8b5cf6]">HOT DISCUSSIONS</div>
              <div className="divide-y divide-white/5">
                {hot.map((t, i) => (
                  <Link key={t.id} href={'/community/' + (t.channels?.slug || 'general') + '/' + t.id} className="trend-item flex gap-3 px-5 py-3">
                    <span className="trend-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12px] font-bold text-[#e5e9f0] truncate">{t.title}</span>
                      <span className="block text-[9px] font-mono text-[#566074]">#{t.channels?.name || 'channel'} · {t.posts?.[0]?.count || 0} REPLIES</span>
                    </span>
                  </Link>
                ))}
                {hot.length === 0 && <div className="px-5 py-6 text-[10px] font-mono text-[#566074]">No discussions yet.</div>}
              </div>
            </div>

            <div className="m-hud-panel overflow-hidden">
              <div className="m-hud-header px-5 py-3 text-[10px] font-mono tracking-[0.25em] text-[#f59e0b]">FRESH ESSAYS</div>
              <div className="divide-y divide-white/5">
                {(essays || []).map((e: any) => (
                  <Link key={e.slug} href={'/community/blog/' + e.slug} className="trend-item flex gap-3 px-5 py-3">
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12px] font-bold text-[#e5e9f0] truncate">{e.title}</span>
                      <span className="block text-[9px] font-mono text-[#566074]">{String(e.category || 'essay').toUpperCase()}</span>
                    </span>
                  </Link>
                ))}
                {(essays || []).length === 0 && <div className="px-5 py-6 text-[10px] font-mono text-[#566074]">No essays published yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}