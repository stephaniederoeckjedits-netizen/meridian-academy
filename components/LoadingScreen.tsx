'use client'
import { useEffect, useState } from 'react'

const QUOTES = [
  { text: "The training is nothing. The will is everything.", author: "Bruce Wayne" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", author: "Bruce Lee" },
  { text: "Any fool can know. The point is to understand.", author: "Albert Einstein" },
  { text: "Do. Or do not. There is no try.", author: "Yoda" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Read what you love until you love to read.", author: "Naval Ravikant" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "It is not the strongest of the species that survives, but the most adaptable to change.", author: "Charles Darwin" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang Von Goethe" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "I think, therefore I am.", author: "René Descartes" },
  { text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The unexamined life is not worth living.", author: "Socrates" }
]

export default function LoadingScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [dots, setDots] = useState('')

  // Animate dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(dotTimer)
  }, [])

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#050810] cursor-pointer"
      onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}
    >
      {/* Background Image */}
      <img 
        src="/loading-bg.jpg?v=11" 
        alt="Loading Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050810_90%)] opacity-80" />
      
      {/* 
        CRITICAL FIX: Using absolute positioning at top-48% 
        This guarantees the text drops exactly below the logo, regardless of screen height.
      */}
      <div className="absolute top-[48%] left-0 right-0 z-10 flex flex-col items-center max-w-4xl mx-auto text-center px-6">
        <div className="text-2xl md:text-4xl leading-relaxed italic mb-8 text-[#e5e9f0] font-serif transition-opacity duration-500 min-h-[120px] flex items-center justify-center" key={quoteIndex}>
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