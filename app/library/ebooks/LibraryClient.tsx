'use client'
import { useState } from 'react'
import Link from 'next/link'
import { trackResume } from '@/lib/resume'

export default function LibraryClient({ initialBooks, progressMap, latestBook, allProgress }: { 
  initialBooks: any[], 
  progressMap: Map<string, number>,
  latestBook: any,
  allProgress: any[]
}) {
  const [search, setSearch] = useState('')
  
  const bookmarkedBookIds = allProgress.filter(p => p.is_bookmarked).map(p => p.book_id)
  const bookmarkedBooks = initialBooks.filter(b => bookmarkedBookIds.includes(b.id))

  const filteredBooks = initialBooks.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  )

  const categories = Array.from(new Set(filteredBooks.map(b => b.category)))
  
  const resumeSlug = latestBook ? latestBook.slug : initialBooks[0]?.slug
  const resumeTitle = latestBook ? latestBook.title : initialBooks[0]?.title

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <Link href="/library" className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#566074] hover:text-[#22d3ee] transition mb-8">
        ← BACK TO LIBRARY
      </Link>

      {/* THE ARCHIVIST'S DESK - REDESIGNED */}
      <div className="mb-16 relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f16] p-8 md:p-12 shadow-2xl group">
        <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #22d3ee 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
             <div>
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" style={{ boxShadow: '0 0 10px #22d3ee' }} />
                  THE ARCHIVIST'S DESK
                </div>
                <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-white leading-tight tracking-wide">
                  Your Collected Manuscripts
                </h2>
             </div>
          </div>
          
          {bookmarkedBooks.length === 0 ? (
            <div className="text-sm text-[#566074] font-mono border border-dashed border-[#1e2633] rounded-lg p-6 text-center max-w-md">
              Your desk is empty. Bookmark a manuscript in the library to save it here.
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-2">
              {bookmarkedBooks.map(book => {
                const progress = progressMap.get(book.id) || 0
                
                // Generate cover
                const coverGradient = 
                  book.accent_color === '#22d3ee' ? 'linear-gradient(135deg, #052a38 0%, #010a0f 100%)' : 
                  book.accent_color === '#f59e0b' ? 'linear-gradient(135deg, #3a1d0e 0%, #1a0e06 100%)' : 
                  book.accent_color === '#8b5cf6' ? 'linear-gradient(135deg, #2a104a 0%, #0a0514 100%)' :
                  book.accent_color === '#10b981' ? 'linear-gradient(135deg, #062b1f 0%, #010a08 100%)' :
                  book.accent_color === '#ec4899' ? 'linear-gradient(135deg, #4c0519 0%, #1a0e06 100%)' :
                  book.accent_color === '#f97316' ? 'linear-gradient(135deg, #431407 0%, #1a0e06 100%)' :
                  book.accent_color === '#84cc16' ? 'linear-gradient(135deg, #1a2e05 0%, #010a08 100%)' :
                  'linear-gradient(135deg, #111111 0%, #050505 100%)'
                  
                return (
                  <Link key={book.id} href={`/library/ebooks/${book.slug}/read?resume=true`} className="group/card relative shrink-0 w-40 flex flex-col items-center text-center">
                    
                    {/* Mini 3D Book */}
                    <div className="relative w-24 h-36 mb-4 transition-transform duration-500 group-hover/card:-translate-y-2" style={{ perspective: '1000px' }}>
                      <div className="absolute top-0.5 bottom-0.5 -right-1 w-2 bg-[#e5e0d0] rounded-r-sm border-y border-r border-[#c0b8a8] shadow-[inset_-1px_0_1px_rgba(0,0,0,0.1)] z-0" />
                      <div className="absolute inset-0 rounded-r-md rounded-l-sm overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.6)] border border-white/10" style={{ background: coverGradient }}>
                        <div className="absolute inset-0 book-leather z-0" />
                        <div className="absolute top-0 bottom-0 left-0 w-3 book-spine z-20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                           <span className="text-[5px] text-white/60 tracking-widest uppercase mb-1">MERIDIAN</span>
                           <span className="font-[family-name:var(--font-cinzel)] text-[9px] text-[#fdfbf7] leading-tight line-clamp-3">{book.title}</span>
                        </div>
                      </div>
                      
                      {/* Mini Ribbon */}
                      {progress > 0 && (
                        <div className="absolute top-0 right-2 w-2.5 book-ribbon z-30" style={{ height: `${Math.max(10, progress)}%` }} />
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-[#e5e9f0] group-hover/card:text-[#22d3ee] transition-colors line-clamp-2 leading-tight px-2">
                      {book.title}
                    </h3>
                    
                    <div className="w-full mt-3">
                       <div className="flex justify-between text-[9px] font-mono text-[#566074] mb-1 px-2">
                          <span>{progress === 100 ? 'DONE' : 'PROGRESS'}</span>
                          <span className="text-[#f59e0b]">{progress}%</span>
                       </div>
                       <div className="w-full h-0.5 bg-[#1e2633] rounded-full overflow-hidden mx-2" style={{ width: 'calc(100% - 16px)' }}>
                          <div className="h-full bg-[#f59e0b]" style={{ width: `${progress}%` }} />
                       </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between relative group">
        <div className="flex-1 flex items-center gap-4 w-full">
          <div className="relative w-full max-w-md transition-all duration-300 group-focus-within:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[#22d3ee] text-lg group-focus-within:animate-bounce">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Search the Archives..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0f16] border border-[#1e2633] text-[#e5e9f0] font-[family-name:var(--font-garamond)] text-base rounded-none py-3 pl-12 pr-4 focus:outline-none focus:border-[#22d3ee] focus:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 shadow-inner"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#566074] hover:text-white">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BOOK GRID */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 text-[#566074] font-mono text-sm">
          No manuscripts found matching "{search}"
        </div>
      ) : (
        categories.map(category => (
          <div key={category} className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xl md:text-2xl font-[family-name:var(--font-cinzel)] font-bold text-[#22d3ee] tracking-[0.1em] uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                {category}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#22d3ee]/40 to-transparent" />
              <span className="text-[10px] font-mono tracking-widest text-[#566074]">
                {filteredBooks.filter(b => b.category === category).length} MANUSCRIPTS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-14">
              {filteredBooks.filter(b => b.category === category).map((book) => {
                const progressPct = progressMap.get(book.id) || 0
                const isCompleted = progressPct === 100
                const isInProgress = progressPct > 0 && progressPct < 100

                const coverGradient = 
                  book.accent_color === '#22d3ee' ? 'linear-gradient(135deg, #052a38 0%, #010a0f 100%)' : 
                  book.accent_color === '#f59e0b' ? 'linear-gradient(135deg, #3a1d0e 0%, #1a0e06 100%)' : 
                  book.accent_color === '#8b5cf6' ? 'linear-gradient(135deg, #2a104a 0%, #0a0514 100%)' :
                  book.accent_color === '#10b981' ? 'linear-gradient(135deg, #062b1f 0%, #010a08 100%)' :
                  book.accent_color === '#ec4899' ? 'linear-gradient(135deg, #4c0519 0%, #1a0e06 100%)' :
                  book.accent_color === '#f97316' ? 'linear-gradient(135deg, #431407 0%, #1a0e06 100%)' :
                  book.accent_color === '#84cc16' ? 'linear-gradient(135deg, #1a2e05 0%, #010a08 100%)' :
                  'linear-gradient(135deg, #111111 0%, #050505 100%)';

                const glowColor = book.accent_color || '#d4af37';
                const style = book.cover_style || 'classic';

                return (
                  <Link 
                    key={book.id} 
                    href={`/library/ebooks/${book.slug}/read`}
                    className={`group block relative flex flex-col ${isCompleted ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}
                    style={{ perspective: '1500px' }}
                  >
                    <div className="relative w-full aspect-[2/3] transition-all duration-700 ease-out group-hover:rotate-y-[-15deg] group-hover:-translate-y-2 group-hover:translate-x-2">
                      <div className="absolute top-1 bottom-1 -right-2 w-3 bg-[#e5e0d0] rounded-r-md border-y border-r border-[#c0b8a8] shadow-[inset_-1px_0_3px_rgba(0,0,0,0.1)] z-0" />
                      <div className="absolute top-2 bottom-2 -right-4 w-3 bg-[#d4ccbc] rounded-r-md border-y border-r border-[#b0a898] z-0" />
                      <div className="absolute -bottom-2 left-1 right-1 h-3 bg-[#e5e0d0] rounded-b-md border-x border-b border-[#c0b8a8] z-0" />

                      <div className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/5" style={{ background: coverGradient }}>
                        <div className="absolute inset-0 book-leather z-0 pointer-events-none" />
                        <div className="absolute top-0 bottom-0 left-0 w-8 book-spine z-30" />
                        <div className="absolute top-0 bottom-0 left-8 w-px bg-white/10 z-30" />
                        
                        {progressPct > 0 && (
                          <div className="absolute top-0 right-6 w-4 book-ribbon z-40 transition-all duration-1000" style={{ height: `${Math.max(15, progressPct)}%` }}>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/90 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                              {progressPct}%
                            </div>
                          </div>
                        )}

                        {style === 'classic' && (
                          <>
                            <div className="absolute top-[15%] left-0 w-8 h-1.5 bg-gradient-to-b from-white/10 to-transparent z-20 border-b border-black/50" />
                            <div className="absolute top-[25%] left-0 w-8 h-1.5 bg-gradient-to-b from-white/10 to-transparent z-20 border-b border-black/50" />
                            <div className="absolute inset-4 left-10 border border-white/20 rounded-sm z-10 pointer-events-none" />
                            <div className="absolute inset-5 left-11 border border-white/10 rounded-sm z-10 pointer-events-none" />
                            <div className="absolute top-4 left-10 w-4 h-4 border-t-2 border-l-2 z-10" style={{ borderColor: glowColor }} />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 z-10" style={{ borderColor: glowColor }} />
                          </>
                        )}

                        {style === 'cyber' && (
                          <>
                            <div className="absolute inset-0 opacity-10 pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <div className="absolute top-4 left-10 w-6 h-6 border-t-2 border-l-2 z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ borderColor: glowColor }} />
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ borderColor: glowColor }} />
                          </>
                        )}

                        {style === 'minimal' && (
                          <>
                            <div className="absolute inset-x-0 top-[10%] h-px bg-white/20 z-10" />
                            <div className="absolute inset-x-0 bottom-[10%] h-px bg-white/20 z-10" />
                          </>
                        )}

                        {style === 'gold' && (
                          <>
                            <div className="absolute inset-3 left-9 border-2 border-[#d4af37]/60 rounded-sm z-10 pointer-events-none" />
                            <div className="absolute inset-4 left-10 border border-[#d4af37]/30 rounded-sm z-10 pointer-events-none" />
                            <div className="absolute top-3 left-9 w-6 h-6 border-t-4 border-l-4 border-[#d4af37] z-10" />
                            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-[#d4af37] z-10" />
                          </>
                        )}

                        <div className="relative z-20 flex flex-col items-center justify-between h-full py-8 px-6 pl-12 text-center">
                          <div className="text-[6px] md:text-[8px] font-[family-name:var(--font-cinzel)] tracking-[0.4em] text-white/60">MERIDIAN ACADEMY</div>
                          <div className="flex flex-col items-center w-full mt-4">
                            <h3 className="text-sm md:text-lg font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fdfbf7] to-[#c0b8a8] leading-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                              {book.title}
                            </h3>
                            <div className="flex items-center gap-1.5 w-full justify-center mb-4 opacity-70">
                              <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/80" />
                              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: glowColor }} />
                              <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/80" />
                            </div>
                            <div className="text-[7px] md:text-[9px] font-[family-name:var(--font-garamond)] italic text-white/70 leading-relaxed max-w-[90%]">{book.subtitle}</div>
                          </div>
                          <div className="text-[5px] md:text-[7px] font-[family-name:var(--font-cinzel)] tracking-[0.4em] text-white/40 mt-auto">DIGITAL RENAISSANCE</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 pl-2">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-[#566074]">
                        {isCompleted ? 'ARCHIVED' : isInProgress ? 'IN PROGRESS' : 'UNREAD'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}