'use client'
import { useEffect, useState } from 'react'

const QUOTES = [
  { text: "The training is nothing. The will is everything.", author: "Bruce Wayne" },
  { text: "It is not the strongest of the species that survives, but the most adaptable to change.", author: "Charles Darwin" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang Von Goethe" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu" }
]

export default function LoadingScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [dots, setDots] = useState('')

  // Cycle quotes every 4 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    }, 4000)
    return () => clearInterval(quoteTimer)
  }, [])

  // Animate dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(dotTimer)
  }, [])

  return (
    <div 
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#050810] cursor-pointer"
      onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}
    >
      {/* Background Image - Forced as <img> tag to guarantee load */}
      <img 
        src="/loading-bg.jpg?v=9" 
        alt="Loading Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Vignette to make text readable */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050810_90%)] opacity-80" />
      
      <div className="relative z-10 flex flex-col items-center max-w-3xl text-center px-6">
        <div className="text-2xl md:text-4xl leading-relaxed italic mb-8 text-[#e5e9f0] font-serif transition-opacity duration-500" key={quoteIndex}>
          "{QUOTES[quoteIndex].text}"
        </div>
        <div className="text-sm tracking-widest uppercase text-[#22d3ee] font-mono mb-12">
          - {QUOTES[quoteIndex].author}
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#8892a6] font-mono font-medium">
            LOADING{dots}
          </div>
          <div className="h-px w-64 overflow-hidden bg-[#1e2633]">
            <div className="h-full bg-[#22d3ee]" style={{ width: '50%', animation: 'loading 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </div>
  )
}