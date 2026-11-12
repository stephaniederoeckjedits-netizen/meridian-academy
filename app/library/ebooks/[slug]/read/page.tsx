'use client'

import { useEffect, useState, useCallback, use, useRef, useLayoutEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { trackResume } from '@/lib/resume' // <-- ADDED IMPORT

function playPageFlip() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const bufferSize = ctx.sampleRate * 0.4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1000
    filter.Q.value = 0.5
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
  } catch (e) {}
}

const renderContent = (content: string) => {
  if (!content) return null
  const blocks = content.split(/\n\s*\n/)
  
  return blocks.map((block, i) => {
    const text = block.trim()
    if (!text) return null

    const inlineHtml = text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111; font-weight: 700;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: #444;">$1</em>')

    if (text.startsWith('# ')) {
      return (
        <div key={i} style={{ breakBefore: i === 0 ? 'auto' : 'column' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 mt-4 font-[family-name:var(--font-cinzel)] text-[#111] text-center tracking-tight break-words" style={{ breakInside: 'avoid' }} dangerouslySetInnerHTML={{ __html: inlineHtml.replace('# ', '') }} />
        </div>
      )
    }
    
    if (text.startsWith('## ')) {
      return <h2 key={i} className="text-xl md:text-2xl font-bold mt-8 mb-4 font-[family-name:var(--font-cinzel)] text-[#111] break-words" style={{ breakAfter: 'avoid', breakInside: 'avoid' }} dangerouslySetInnerHTML={{ __html: inlineHtml.replace('## ', '') }} />
    }

    if (text.startsWith('> ')) {
      return (
        <div key={i} className="my-6 py-4 px-6 bg-[#f4efe3] border-y border-[#d4af37]/30 rounded-lg text-center" style={{ breakInside: 'avoid' }}>
          <p className="font-[family-name:var(--font-garamond)] italic text-[#3a3a3a] text-[0.95em] leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: inlineHtml.replace('> ', '') }} />
        </div>
      )
    }

    if (text.startsWith('- ')) {
      const items = text.split('\n').map(li => li.trim().replace(/^-\s*/, ''))
      return (
        <ul key={i} className="list-disc pl-6 mb-6 space-y-2 font-[family-name:var(--font-garamond)] text-[#2a2a2a]">
          {items.map((li, j) => (
            <li key={j} className="break-words" dangerouslySetInnerHTML={{ __html: li.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
          ))}
        </ul>
      )
    }

    return (
      <p 
        key={i} 
        className={`mb-5 leading-[1.8] text-[#2a2a2a] font-[family-name:var(--font-garamond)] text-justify break-words ${i === 1 ? 'first-letter:float-left first-letter:text-6xl first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1 first-letter:font-bold first-letter:font-[family-name:var(--font-cinzel)] first-letter:text-[#d4af37]' : ''}`} 
        style={{ textAlign: 'justify', hyphens: 'auto', orphans: 3, widows: 3 }}
        dangerouslySetInnerHTML={{ __html: inlineHtml }} 
      />
    )
  })
}

function ReaderContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const shouldResume = searchParams.get('resume') === 'true'

  const [book, setBook] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(shouldResume)
  const [hasReadIntro, setHasReadIntro] = useState(shouldResume)
  const [fontSize, setFontSize] = useState(16)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  
  const [isMobile, setIsMobile] = useState(false)
  const [bookmarkStatus, setBookmarkStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  
  const [isFinishing, setIsFinishing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const [ambientOn, setAmbientOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [savedProgressPct, setSavedProgressPct] = useState(0)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const hasAppliedProgress = useRef(false)

  const textRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/02/07/audio_3a2e78f64e.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.2
  }, [])

  const toggleAmbientSound = () => {
    if (ambientOn) audioRef.current?.pause()
    else audioRef.current?.play()
    setAmbientOn(!ambientOn)
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    async function load() {
      const { data: b } = await supabase.from('library_books').select('*').eq('slug', slug).maybeSingle()
      if (!b) { setLoading(false); setProgressLoaded(true); return }
      setBook(b)

      const { data: chs } = await supabase
        .from('library_chapters')
        .select('id, title, content')
        .eq('book_id', b.id)
        .order('chapter_number', { ascending: true })
      
      if (chs) setChapters(chs)

      const { data: { session } } = await supabase.auth.getSession()
      let dbProg = 0
      
      if (session?.user) {
        const { data: prog } = await supabase
          .from('library_progress')
          .select('scroll_percentage, completed_at')
          .eq('user_id', session.user.id)
          .eq('book_id', b.id)
          .maybeSingle()
        
        if (prog) {
          dbProg = prog.scroll_percentage
          if (prog.completed_at) setIsCompleted(true)

          await supabase.from('library_progress')
            .update({ updated_at: new Date().toISOString() })
            .eq('user_id', session.user.id)
            .eq('book_id', b.id)
        } else {
          await supabase.from('library_progress').insert({
            user_id: session.user.id,
            book_id: b.id,
            scroll_percentage: 0,
            is_bookmarked: false,
            updated_at: new Date().toISOString()
          })
        }
        window.dispatchEvent(new Event('progress-updated'))
      }

      const localProgStr = localStorage.getItem(`bookmark_${b.id}`)
      const localProg = localProgStr ? parseFloat(localProgStr) : 0
      
      const finalProg = Math.max(dbProg, localProg)
      
      setSavedProgressPct(finalProg)
      setLoading(false)
      setProgressLoaded(true)
    }
    load()
  }, [slug, supabase])

  const fullBookContent = chapters.map(ch => ch.content).join('\n\n');

  const handleBookmark = async () => {
    setBookmarkStatus('saving')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error("You must be logged in.")

      let percentage = 0
      if (isMobile && mobileScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = mobileScrollRef.current
        const scrollableHeight = scrollHeight - clientHeight
        percentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      } else {
        percentage = totalPages > 1 ? (pageIndex / (totalPages - 1)) * 100 : 0
      }

      localStorage.setItem(`bookmark_${book.id}`, percentage.toString())

      // Save the bookmark and the progress
      const { error } = await supabase.from('library_progress').upsert({
        user_id: session.user.id,
        book_id: book.id,
        scroll_percentage: Math.round(percentage),
        is_bookmarked: true, // Force true
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,book_id' })

      if (error) throw error

      // --- THE MAGIC TRACKER: SAVES TO SIDEBAR AND SUPABASE ---
      await trackResume(
        'ebook', 
        book.id, 
        book.title, 
        `/library/ebooks/${book.slug}/read?resume=true`,
        { page: pageIndex, scrollPercentage: percentage }
      )
      // --------------------------------------------------------

      setBookmarkStatus('saved')
      window.dispatchEvent(new Event('progress-updated'))
      
      // Redirect back to the library after a short delay
      setTimeout(() => {
        router.push('/library/ebooks')
      }, 800)

    } catch (err: any) {
      console.error(err)
      alert(`Database Error: ${err.message}`)
      setBookmarkStatus('error')
      setTimeout(() => setBookmarkStatus('idle'), 2000)
    }
  }

  useEffect(() => {
    return () => {
      async function saveOnExit() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user || !book) return
        
        let percentage = 0
        if (isMobile && mobileScrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = mobileScrollRef.current
          const scrollableHeight = scrollHeight - clientHeight
          percentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
        } else {
          percentage = totalPages > 1 ? (pageIndex / (totalPages - 1)) * 100 : 0
        }

        await supabase.from('library_progress').upsert({
          user_id: session.user.id,
          book_id: book.id,
          scroll_percentage: Math.round(percentage),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,book_id' })
      }
      saveOnExit()
    }
  }, [book, isMobile, pageIndex, totalPages, supabase])

  const handleFinishBook = async () => {
    if (!book) return
    setIsFinishing(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data: existingProgress } = await supabase
        .from('library_progress')
        .select('completed_at')
        .eq('user_id', session.user.id)
        .eq('book_id', book.id)
        .maybeSingle()

      const isFirstTimeCompletion = !existingProgress?.completed_at

      await supabase.from('library_progress').upsert({
        user_id: session.user.id,
        book_id: book.id,
        scroll_percentage: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,book_id' })

      if (isFirstTimeCompletion) {
        const { data: profile } = await supabase.from('profiles').select('xp').eq('id', session.user.id).single()
        const currentXp = profile?.xp || 0
        const reward = book.xp_reward || 250
        await supabase.from('profiles').update({ xp: currentXp + reward }).eq('id', session.user.id)
      }
      
      window.dispatchEvent(new Event('progress-updated'))
      router.push('/library/ebooks')
      router.refresh()

    } catch (err) {
      setIsFinishing(false)
    }
  }

  useLayoutEffect(() => {
    if (!isOpen || !fullBookContent || isMobile || !progressLoaded || hasAppliedProgress.current) return;

    let retries = 0;
    const maxRetries = 30;

    const checkAndApply = () => {
      if (textRef.current) {
        const { scrollWidth, clientWidth } = textRef.current;
        if (clientWidth > 0) {
          const calc = Math.round(scrollWidth / clientWidth);
          const newTotal = Math.max(1, calc);

          if (newTotal > 1) {
            setTotalPages(newTotal);
            if (savedProgressPct > 0) {
              const targetPage = Math.round((savedProgressPct / 100) * (newTotal - 1));
              setPageIndex(Math.min(targetPage, newTotal - 1));
            }
            hasAppliedProgress.current = true;
            return true;
          }
        }
      }
      return false;
    }

    if (checkAndApply()) return;

    const interval = setInterval(() => {
      retries++;
      if (checkAndApply() || retries >= maxRetries) {
        clearInterval(interval);
        if (retries >= maxRetries) hasAppliedProgress.current = true;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fullBookContent, fontSize, isOpen, isMobile, progressLoaded, savedProgressPct]);

  useEffect(() => {
    if (isOpen && isMobile && savedProgressPct > 0 && mobileScrollRef.current && !hasAppliedProgress.current && progressLoaded) {
      setTimeout(() => {
        const { scrollHeight, clientHeight } = mobileScrollRef.current!;
        const scrollableHeight = scrollHeight - clientHeight;
        if (scrollableHeight > 0) {
          mobileScrollRef.current!.scrollTop = (savedProgressPct / 100) * scrollableHeight;
          hasAppliedProgress.current = true
        }
      }, 500);
    }
  }, [isOpen, isMobile, savedProgressPct, progressLoaded])

  const turnPage = useCallback((direction: 'next' | 'prev') => {
    if (!isOpen || isMobile) return
    if (direction === 'next' && pageIndex + 1 < totalPages) {
      playPageFlip()
      setPageIndex(p => p + 1)
    } else if (direction === 'prev' && pageIndex > 0) {
      playPageFlip()
      setPageIndex(p => p - 1)
    }
  }, [isOpen, isMobile, pageIndex, totalPages])

  useEffect(() => {
    if (!isOpen || isMobile) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') turnPage('next')
      if (e.key === 'ArrowLeft') turnPage('prev')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isMobile, turnPage])

  if (loading) return <div className="min-h-screen bg-[#050810] flex items-center justify-center text-[#22d3ee] font-mono tracking-widest animate-pulse">ESTABLISHING CONNECTION...</div>
  if (!book) return <div className="min-h-screen bg-[#050810] flex items-center justify-center text-red-500 font-mono">BOOK NOT FOUND</div>

  if (!isOpen) {
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
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-6" style={{ perspective: '2000px' }}>
        <div className="relative w-full max-w-[420px] aspect-[2/3] cursor-pointer group transition-all duration-700 hover:rotate-y-[-10deg] hover:scale-[1.02]"
          onClick={() => { setIsOpen(true); playPageFlip(); }}>
          
          <div className="absolute top-1 bottom-1 -right-2 w-3 bg-[#e0d8c8] rounded-r-md border-y border-r border-[#c0b8a8] shadow-[inset_-1px_0_3px_rgba(0,0,0,0.1)] z-0" />
          <div className="absolute top-2 bottom-2 -right-4 w-3 bg-[#d4ccbc] rounded-r-md border-y border-r border-[#b0a898] z-0" />
          <div className="absolute -bottom-2 left-1 right-1 h-3 bg-[#e0d8c8] rounded-b-md border-x border-b border-[#c0b8a8] z-0" />

          <div className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(0,0,0,0.5)] border border-white/5"
            style={{ background: coverGradient }}>
            
            <div className="absolute inset-0 book-leather" />
            
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-black/95 via-black/50 to-transparent z-30 mix-blend-multiply" />
            <div className="absolute top-0 bottom-0 left-12 w-px bg-white/10 z-30" />
            
            {style === 'classic' && (
              <>
                <div className="absolute top-[12%] left-0 w-12 h-1.5 bg-gradient-to-b from-white/10 to-transparent z-20 border-b border-black/60 shadow-sm" />
                <div className="absolute top-[20%] left-0 w-12 h-1.5 bg-gradient-to-b from-white/10 to-transparent z-20 border-b border-black/60 shadow-sm" />
                <div className="absolute inset-5 left-16 border-2 border-white/20 rounded-sm z-10 pointer-events-none" />
                <div className="absolute inset-6 left-[4.25rem] border border-white/10 rounded-sm z-10 pointer-events-none" />
                <div className="absolute top-5 left-16 w-5 h-5 border-t-4 border-l-4 z-10" style={{ borderColor: glowColor }} />
                <div className="absolute bottom-5 right-5 w-5 h-5 border-b-4 border-r-4 z-10" style={{ borderColor: glowColor }} />
              </>
            )}

            {style === 'cyber' && (
              <>
                <div className="absolute inset-0 opacity-10 z-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-8 left-16 w-8 h-8 border-t-2 border-l-2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ borderColor: glowColor }} />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ borderColor: glowColor }} />
              </>
            )}

            {style === 'minimal' && (
              <>
                <div className="absolute inset-x-0 top-[15%] h-px bg-white/20 z-10" />
                <div className="absolute inset-x-0 bottom-[15%] h-px bg-white/20 z-10" />
              </>
            )}

            {style === 'gold' && (
              <>
                <div className="absolute inset-4 left-16 border-2 border-[#d4af37]/60 rounded-sm z-10 pointer-events-none" />
                <div className="absolute inset-5 left-[4.5rem] border border-[#d4af37]/30 rounded-sm z-10 pointer-events-none" />
                <div className="absolute top-4 left-16 w-8 h-8 border-t-4 border-l-4 border-[#d4af37] z-10" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#d4af37] z-10" />
              </>
            )}

            <div className="relative z-20 flex flex-col h-full pl-20 pr-8 py-12 justify-between items-center text-center">
              
              <div className="text-[9px] font-[family-name:var(--font-cinzel)] tracking-[0.6em] text-white/60 w-full border-b border-white/10 pb-4">
                MERIDIAN ACADEMY
              </div>
              
              <div className="flex flex-col items-center w-full mt-4">
                <h2 
                  className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fdfbf7] to-[#b0a898] leading-tight mb-6 tracking-wide"
                  style={{ textShadow: '0 2px 5px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}
                >
                  {book.title}
                </h2>
                
                <div className="flex items-center gap-3 w-full justify-center mb-6 opacity-80">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-white" />
                  <div className="w-2 h-2 rotate-45" style={{ backgroundColor: glowColor }} />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-white" />
                </div>
                
                <div className="text-base font-[family-name:var(--font-garamond)] italic text-white/70 px-4 leading-relaxed max-w-sm">
                  {book.subtitle}
                </div>
              </div>
              
              <div className="text-[8px] font-[family-name:var(--font-cinzel)] tracking-[0.5em] text-white/40 w-full border-t border-white/10 pt-4 mt-auto">
                DIGITAL RENAISSANCE SERIES
              </div>
            </div>

            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 pointer-events-none" />
          </div>
        </div>
      </div>
    )
  }

  if (isOpen && !hasReadIntro) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#050810] z-[100]">
        <div className="w-[400px] h-[550px] bg-[#fcf9f2] rounded-lg shadow-2xl p-8 flex flex-col justify-between relative overflow-hidden" style={{ border: '1px solid #d4af37' }}>
          <div className="absolute inset-2 border border-[#d4af37]/40 pointer-events-none" />
          <div className="text-center mt-8">
            <h3 className="font-[family-name:var(--font-cinzel)] text-[#8b7355] text-xl tracking-widest uppercase">Ex Libris</h3>
            <div className="w-12 h-px bg-[#d4af37] mx-auto mt-2 mb-8" />
          </div>
          <div className="text-center px-8">
            <p className="font-[family-name:var(--font-garamond)] text-[#2a2a2a] italic text-lg mb-4">This manuscript belongs to</p>
            <p className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#111] border-b-2 border-[#d4af37]/50 pb-2">
              Meridian Scholar
            </p>
            <p className="font-mono text-[#8892a6] text-xs tracking-widest mt-4 uppercase">Architect-in-Training</p>
          </div>
          <div className="text-center mb-8">
            <p className="font-[family-name:var(--font-garamond)] text-[#8b7355] text-sm mb-4">Inscribed into the Meridian Academy Library</p>
            <button 
              onClick={() => setHasReadIntro(true)} 
              className="bg-[#111] text-white font-mono tracking-widest text-[10px] uppercase px-6 py-3 rounded hover:bg-[#333] transition"
            >
              Begin Reading →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const leftPageNumber = (pageIndex * 2) + 1;
  const rightPageNumber = (pageIndex * 2) + 2;
  const totalBookPages = totalPages * 2;

  return (
    <div className="h-screen w-screen bg-[#050810] flex flex-col relative overflow-hidden font-sans selection:bg-[#22d3ee] selection:text-black">
      
      <header className="h-14 md:h-16 bg-[#0a0f16] border-b border-[#1e2633] flex items-center justify-between px-3 md:px-6 shrink-0 z-50">
        
        <div className="flex justify-start flex-1 gap-2 md:gap-3">
          <button 
            onClick={() => router.push('/library/ebooks')} 
            className="px-3 md:px-4 py-1.5 md:py-2 rounded border border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white font-bold text-[10px] md:text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse"
          >
            ✕ QUIT
          </button>
          
          <button 
            onClick={handleBookmark} 
            disabled={bookmarkStatus === 'saving' || bookmarkStatus === 'saved'}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded border font-bold text-[10px] md:text-xs tracking-wider transition-all disabled:opacity-50 ${
              bookmarkStatus === 'error' ? 'border-red-500 text-red-500 bg-red-500/10' :
              bookmarkStatus === 'saved' ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10' :
              'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/10 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            }`}
          >
            {bookmarkStatus === 'saving' ? 'SAVING...' : bookmarkStatus === 'error' ? 'ERROR ✕' : bookmarkStatus === 'saved' ? 'SAVED ✓' : '🔖 BOOKMARK'}
          </button>
        </div>

        <div className="hidden md:flex justify-center relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent blur-md pointer-events-none" />
          <span className="text-[12px] font-[family-name:var(--font-cinzel)] tracking-[0.3em] text-[#f5e6c8] font-bold relative z-10 text-center truncate">
            {book.title.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center justify-end gap-2 md:gap-6 flex-1">
          <div className="flex items-center gap-1 md:gap-2 border border-[#1e2633] rounded bg-[#141b26] p-0.5 md:p-1">
            <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-[#22d3ee] hover:text-black rounded text-[#8892a6] text-[10px] md:text-xs font-mono transition-colors">A-</button>
            <span className="text-[9px] md:text-[10px] font-mono w-4 md:w-6 text-center text-[#a5f3fc]">{fontSize}</span>
            <button onClick={() => setFontSize(f => Math.min(28, f + 2))} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-[#22d3ee] hover:text-black rounded text-[#8892a6] text-[10px] md:text-xs font-mono transition-colors">A+</button>
            <button onClick={toggleAmbientSound} className={`w-8 h-8 rounded border ml-2 flex items-center justify-center transition-colors ${ambientOn ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]' : 'border-transparent text-[#8892a6] hover:text-white'}`}>
              {ambientOn ? '🔊' : '🔇'}
            </button>
          </div>
          <div className="text-[9px] md:text-[10px] font-mono tracking-[0.1em] md:tracking-[0.2em] text-[#22d3ee] text-right">
            {isMobile ? `SCROLLING` : `PAGES ${leftPageNumber}-${rightPageNumber} / ${totalBookPages}`}
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#050810]" style={{ perspective: '2000px' }}>
        
        {!isMobile && (
          <>
            <button onClick={() => turnPage('prev')} disabled={pageIndex === 0} className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#0a0f16]/80 backdrop-blur border border-[#22d3ee]/30 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed z-50 text-lg md:text-xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">◂</button>
            <button onClick={() => turnPage('next')} disabled={pageIndex + 1 >= totalPages} className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#0a0f16]/80 backdrop-blur border border-[#22d3ee]/30 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed z-50 text-lg md:text-xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">▸</button>
          </>
        )}

        <div className="relative w-full max-w-[1000px] md:max-w-[1300px] h-full md:h-[85vh] md:max-h-[850px] md:rounded-r-2xl md:rounded-l-lg bg-[#fcf9f2] shadow-none md:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.05)] border-0 md:border border-[#e5e0d0]">
          
          <div className="hidden md:block absolute top-1 bottom-1 -right-2 w-2 bg-[#e5e0d0] rounded-r-xl border border-[#d4cfc0] z-0" />
          <div className="hidden md:block absolute top-2 bottom-2 -right-3 w-2 bg-[#fcf9f2] rounded-xl border border-[#d4cfc0] z-0" />
          <div className="hidden md:block absolute -bottom-2 left-1 right-1 h-2 bg-[#e5e0d0] rounded-b-xl border border-[#d4cfc0] z-0" />
          <div className="hidden md:block absolute top-8 bottom-8 left-8 w-[calc(50%-4rem)] border border-[#d4af37]/40 pointer-events-none rounded-sm z-20 shadow-[inset_0_0_15px_rgba(212,175,55,0.05)]" />
          <div className="hidden md:block absolute top-8 bottom-8 right-8 w-[calc(50%-4rem)] border border-[#d4af37]/40 pointer-events-none rounded-sm z-20 shadow-[inset_0_0_15px_rgba(212,175,55,0.05)]" />
          <div className="absolute inset-0 md:rounded-r-2xl md:rounded-l-lg shadow-[inset_0_0_50px_rgba(0,0,0,0.05)] pointer-events-none z-30" />
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent pointer-events-none z-20 mix-blend-multiply" />
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-black/20 pointer-events-none z-20 shadow-[0_0_15px_rgba(0,0,0,0.4)]" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply md:rounded-r-2xl md:rounded-l-lg z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          {isMobile ? (
            <div ref={mobileScrollRef} className="absolute inset-0 overflow-y-auto px-6 py-8 font-[family-name:var(--font-garamond)]" style={{ fontSize: `${fontSize}px` }}>
              {fullBookContent ? renderContent(fullBookContent) : <div className="text-center font-mono text-red-500 mt-20">NO CONTENT FOUND</div>}
              {fullBookContent && (
                <div className="mt-16 pb-12 flex justify-center w-full">
                  <button onClick={handleFinishBook} disabled={isFinishing} className="bg-[#10b981] text-black font-bold tracking-[0.2em] uppercase text-xs px-8 py-4 rounded-full hover:bg-[#34d399] transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 flex items-center gap-2">
                    {isFinishing ? 'Saving...' : isCompleted ? 'Book Completed ✓' : `Finish Book (+${book?.xp_reward || 250} XP)`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 overflow-hidden rounded-r-2xl rounded-l-lg">
              <div ref={textRef} className="h-full w-full px-16 py-16 font-[family-name:var(--font-garamond)]" style={{ fontSize: `${fontSize}px`, columnCount: 2, columnGap: '8rem', columnFill: 'auto', transform: `translateX(-${pageIndex * 100}%)`, transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)' }}>
                {fullBookContent ? renderContent(fullBookContent) : <div className="text-center font-mono text-red-500 mt-20">NO CONTENT FOUND IN DATABASE.<br/>RUN THE SQL SCRIPT.</div>}
              </div>
            </div>
          )}

          {!isMobile && pageIndex === totalPages - 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
              <button onClick={handleFinishBook} disabled={isFinishing} className="bg-[#10b981] text-black font-bold tracking-[0.2em] uppercase text-xs px-8 py-3 rounded-full hover:bg-[#34d399] transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 flex items-center gap-2">
                {isFinishing ? 'Saving...' : isCompleted ? 'Book Completed ✓' : `Finish Book (+${book?.xp_reward || 250} XP)`}
              </button>
            </div>
          )}

          {!isMobile && (
            <>
              <div className="absolute bottom-6 left-16 text-[11px] font-mono text-[#999] tracking-[0.2em] z-30">{leftPageNumber}</div>
              <div className="absolute bottom-6 right-16 text-[11px] font-mono tracking-[0.2em] text-[#999] z-30">{rightPageNumber}</div>
            </>
          )}
        </div>
      </div>
      
      <div className="h-8 md:h-10 shrink-0 text-center flex items-center justify-center text-[8px] md:text-[10px] font-mono text-[#566074] tracking-[0.2em] md:tracking-[0.3em] bg-[#050810] z-50">
        {isMobile ? 'SCROLL TO READ' : 'USE ARROWS TO TURN PAGES'}
      </div>
    </div>
  )
}

export default function ReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050810] flex items-center justify-center text-[#22d3ee] font-mono tracking-widest animate-pulse">ESTABLISHING CONNECTION...</div>}>
      <ReaderContent params={params} />
    </Suspense>
  )
}