'use client'
import { useState } from 'react'
import DiscoverCard from './DiscoverCard'
import ContinueWatching from './ContinueWatching'

const Icons = {
  All: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  AI: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  Psychology: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  Engineering: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
  Communication: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Technology: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Business: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Science: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>,
  Design: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  'Personal Development': <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Mathematics: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  History: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Philosophy: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Economics: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Physics: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="10"/></svg>,
  Biology: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M5 5l14 14"/><path d="M19 5L5 19"/><circle cx="12" cy="12" r="10"/></svg>,
  'Computer Science': <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Literature: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
}

const CATEGORIES = [
  { id: 'All', label: 'All Videos', color: '#22d3ee' },
  { id: 'AI', label: 'Artificial Intelligence', color: '#22d3ee' },
  { id: 'Psychology', label: 'Psychology', color: '#c084fc' },
  { id: 'Engineering', label: 'Engineering', color: '#f59e0b' },
  { id: 'Communication', label: 'Communication', color: '#10b981' },
  { id: 'Technology', label: 'Technology', color: '#3b82f6' },
  { id: 'Business', label: 'Business', color: '#facc15' },
  { id: 'Science', label: 'Science', color: '#ec4899' },
  { id: 'Design', label: 'Design', color: '#f472b6' },
  { id: 'Personal Development', label: 'Personal Dev', color: '#818cf8' },
  { id: 'Mathematics', label: 'Mathematics', color: '#60a5fa' },
  { id: 'History', label: 'History', color: '#d97706' },
  { id: 'Philosophy', label: 'Philosophy', color: '#a78bfa' },
  { id: 'Economics', label: 'Economics', color: '#34d399' },
  { id: 'Physics', label: 'Physics', color: '#f87171' },
  { id: 'Biology', label: 'Biology', color: '#4ade80' },
  { id: 'Computer Science', label: 'Comp Sci', color: '#2dd4bf' },
  { id: 'Literature', label: 'Literature', color: '#fda4af' },
]

export default function DiscoverFeed({ initialVideos }: { initialVideos: any[] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [resumeVideoId, setResumeVideoId] = useState<string | null>(null)
  const [activeVideo, setActiveVideo] = useState<any>(null)
  
  const itemsPerPage = 6
  const currentCategory = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0]

  const filteredVideos = activeTab === 'All' 
    ? initialVideos 
    : initialVideos.filter(v => v.primary_discipline === activeTab)

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    setCurrentPage(1)
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-white/10 pb-8">
        <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] mb-4" style={{ color: currentCategory.color }}>
          <span className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ backgroundColor: currentCategory.color }} />
          MERIDIAN COMMUNITY
        </div>
        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-tight leading-none mb-4">
          THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]">MERIDIAN HUB</span>
        </h1>
        <p className="text-lg md:text-xl text-[#8892a6] font-[family-name:var(--font-garamond)] italic max-w-2xl leading-relaxed">
          A community-curated space for lifelong learners. Explore lectures, deep dives, and intellectual explorations shared by the community.
        </p>
      </div>

      <ContinueWatching onResume={(id) => setResumeVideoId(id)} />

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all duration-300`}
              style={{
                backgroundColor: isActive ? tab.color : '#0a1018',
                color: isActive ? '#000' : '#8892a6',
                borderColor: isActive ? tab.color : 'rgba(255,255,255,0.1)',
                borderWidth: '1px',
                boxShadow: isActive ? `0 0 20px ${tab.color}60` : 'none'
              }}
            >
              <span style={{ color: isActive ? '#000' : tab.color }}>
                {Icons[tab.id as keyof typeof Icons] || Icons.All}
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentVideos.map((video) => (
          <DiscoverCard 
            key={video.id} 
            video={video} 
            themeColor={currentCategory.color} 
            themeIcon={Icons[currentCategory.id as keyof typeof Icons] || Icons.All} 
            onPlay={(v) => setActiveVideo(v)} 
            autoPlay={resumeVideoId === video.id} 
          />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="col-span-full text-center py-20 text-[#566074] font-mono text-sm border border-dashed border-white/10 rounded-xl">
          No educational videos found in this discipline yet.
        </div>
      )}

      {totalPages >= 1 && (
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 rounded-lg border border-white/20 text-white font-mono text-xs tracking-widest uppercase hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div className="text-[10px] font-mono tracking-widest text-[#566074] uppercase">
            Page <span className="text-white font-bold">{currentPage}</span> of {Math.max(1, totalPages)}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(Math.max(1, totalPages), p + 1))}
            disabled={currentPage === Math.max(1, totalPages)}
            className="px-6 py-2.5 rounded-lg border border-white/20 text-white font-mono text-xs tracking-widest uppercase hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}