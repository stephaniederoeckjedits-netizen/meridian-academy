'use client'
import { useEffect, useState } from 'react'

const QUOTES = [
  // Original 40
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
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "Fortune favors the bold.", author: "Virgil" },
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  
  // 20 New Quotes
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "George Lorimer" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
  { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" }
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

  // Auto-cycle quotes every 6 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    }, 6000)
    return () => clearInterval(quoteTimer)
  }, [])

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#050810] cursor-pointer pointer-events-auto"
      onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}
    >
      {/* Background Image */}
      <img 
        src="/loading-bg.jpg?v=13" 
        alt="Loading Background" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050810_90%)] opacity-80 pointer-events-none" />
      
      {/* Text Content */}
      <div className="absolute top-[48%] left-0 right-0 z-10 flex flex-col items-center max-w-5xl mx-auto text-center px-6 pointer-events-none">
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