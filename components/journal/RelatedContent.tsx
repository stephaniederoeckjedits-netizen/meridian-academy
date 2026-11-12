'use client'
import Link from 'next/link'

interface RelatedItem {
  type: 'course' | 'vault' | 'spec'
  title: string
  href: string
  accent: string
}

const CATEGORY_TO_RELATED: Record<string, RelatedItem[]> = {
  'technology': [
    { type: 'course', title: 'Language Mastery: Dutch', href: '/courses/english-to-dutch-mastery', accent: '#10b981' },
    { type: 'spec', title: 'Prompt Engineering Specs', href: '/library/prompts', accent: '#8b5cf6' },
  ],
  'business': [
    { type: 'course', title: 'Language Mastery: Dutch', href: '/courses/english-to-dutch-mastery', accent: '#10b981' },
    { type: 'vault', title: 'Knowledge Vault: Strategy', href: '/library/vault', accent: '#f59e0b' },
  ],
  'psychology': [
    { type: 'vault', title: 'Knowledge Vault: Psychology', href: '/library/vault', accent: '#ec4899' },
    { type: 'spec', title: 'Study Specs', href: '/library/prompts', accent: '#8b5cf6' },
  ],
  'philosophy': [
    { type: 'vault', title: 'Knowledge Vault', href: '/library/vault', accent: '#c084fc' },
    { type: 'course', title: 'Language Mastery', href: '/courses/english-to-dutch-mastery', accent: '#10b981' },
  ],
  'science': [
    { type: 'vault', title: 'Knowledge Vault: Science', href: '/library/vault', accent: '#10b981' },
  ],
  'architecture': [
    { type: 'vault', title: 'Knowledge Vault', href: '/library/vault', accent: '#f97316' },
  ],
  'history': [
    { type: 'vault', title: 'Knowledge Vault', href: '/library/vault', accent: '#f59e0b' },
  ],
  'culture': [
    { type: 'vault', title: 'Knowledge Vault', href: '/library/vault', accent: '#3b82f6' },
  ],
}

export default function RelatedContent({ categorySlug }: { categorySlug?: string }) {
  if (!categorySlug) return null
  const items = CATEGORY_TO_RELATED[categorySlug]
  if (!items || items.length === 0) return null

  return (
    <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f16] to-[#050810]">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#22d3ee] font-bold">Continue the Journey</span>
        <div className="h-px flex-1 bg-gradient-to-r from-[#22d3ee]/30 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            className="group flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:border-white/30 transition-all"
            style={{ backgroundColor: item.accent + '08' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: item.accent + '20', color: item.accent }}
            >
              {item.type === 'course' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              {item.type === 'vault' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              {item.type === 'spec' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-mono tracking-widest uppercase font-bold" style={{ color: item.accent }}>{item.type}</div>
              <div className="text-xs font-bold text-white group-hover:text-[#22d3ee] transition-colors truncate">{item.title}</div>
            </div>
            <span className="text-[#566074] group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}