'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = [
  { key: 'ALL', label: 'All Latest', color: '#22d3ee', icon: '⚡' },
  { key: 'AI', label: 'AI & Tech', color: '#22d3ee', icon: '🤖' },
  { key: 'Business', label: 'Business', color: '#f59e0b', icon: '📈' },
  { key: 'Startups', label: 'Startups', color: '#fb923c', icon: '🚀' },
  { key: 'Dutch', label: 'Dutch Press', color: '#f97316', icon: '🇳🇱' },
  { key: 'Design', label: 'Design & Arch', color: '#e879f9', icon: '🎨' },
  { key: 'Science', label: 'Science', color: '#10b981', icon: '🧬' },
  { key: 'Cybersecurity', label: 'Cybersecurity', color: '#ef4444', icon: '🛡️' },
  { key: 'Psychology', label: 'Psychology', color: '#ec4899', icon: '🧠' },
  { key: 'Philosophy', label: 'Philosophy', color: '#a855f7', icon: '📖' },
  { key: 'Architecture', label: 'Architecture', color: '#f97316', icon: '🏛️' },
  { key: 'Design', label: 'Design', color: '#8b5cf6', icon: '🎨' },
  { key: 'Liberal Arts', label: 'Liberal Arts', color: '#3b82f6', icon: '📚' },
  { key: 'Gaming', label: 'Gaming', color: '#06b6d4', icon: '🎮' },
  { key: 'Marketing', label: 'Marketing', color: '#eab308', icon: '📣' },
  { key: 'Social Media', label: 'Social Media', color: '#ec4899', icon: '💬' },
  { key: 'Productivity', label: 'Productivity', color: '#14b8a6', icon: '⏱️' },
  { key: 'Space', label: 'Space', color: '#6366f1', icon: '🌌' },
  { key: 'Environment', label: 'Environment', color: '#22c55e', icon: '🌍' },
  { key: 'Law', label: 'Law', color: '#dc2626', icon: '⚖️' },
  { key: 'Neuroscience', label: 'Neuroscience', color: '#06b6d4', icon: '🧠' },
]

export default function NewsFeed() {
  const [news, setNews] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    setLoading(true)
    async function load() {
      let query = supabase.from('daily_news').select('*')
      if (activeTab !== 'ALL') {
        query = query.eq('category', activeTab)
      }
      const { data } = await query
        .order('published_at', { ascending: false })
        .limit(activeTab === 'ALL' ? 12 : 8)
      setNews(data || [])
      setLoading(false)
    }
    load()
  }, [activeTab, supabase])

  return (
    <div className="mb-24">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">
          Today's Briefing
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
        <span className="text-xs font-mono text-[#566074] tracking-widest">WORLD INTELLIGENCE</span>
      </div>

      {/* FIX: Changed to flex-wrap so buttons never get cut off */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-[11px] font-mono tracking-widest uppercase font-bold"
            style={{
              borderColor: activeTab === cat.key ? cat.color : '#ffffff15',
              backgroundColor: activeTab === cat.key ? `${cat.color}15` : 'transparent',
              color: activeTab === cat.key ? cat.color : '#8892a6',
              boxShadow: activeTab === cat.key ? `0 0 20px ${cat.color}30` : 'none',
            }}
          >
            <span className="text-base">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="p-12 rounded-2xl border border-white/10 bg-[#0a0f16] text-center">
          <div className="text-sm font-mono text-[#8892a6]">No news in this channel yet. Try another category.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => {
            const cat = CATEGORIES.find(c => c.key === item.category)
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-8 rounded-2xl border border-white/10 bg-[#0a0f16] hover:border-white/30 transition-all hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: cat?.color || '#22d3ee' }} />
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-md border font-bold" style={{ color: cat?.color, borderColor: (cat?.color || '#22d3ee') + '40', backgroundColor: (cat?.color || '#22d3ee') + '10' }}>
                      {item.source}
                    </span>
                    <span className="text-[11px] font-mono text-[#566074]">
                      {new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#22d3ee] transition-colors leading-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#8892a6] leading-relaxed line-clamp-3 mb-6">
                    {item.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#22d3ee] uppercase tracking-widest font-bold group-hover:gap-3 transition-all mt-auto">
                  Read Full Story <span className="text-lg leading-none">→</span>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}