'use client'
import { useEffect, useState } from 'react'

const QUOTES = [
  // Original 60
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
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  
  // 40 New Quotes
  { text: "He who fears death will never do anything worth of a man who is alive.", author: "Seneca" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "The best fighter is never angry.", author: "Lao Tzu" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The more I read, the more I acquire, the more certain I am that I know nothing.", author: "Voltaire" },
  { text: "I can calculate the motion of heavenly bodies, but not the madness of people.", author: "Isaac Newton" },
  { text: "What I cannot create, I do not understand.", author: "Richard Feynman" },
  { text: "The first principle is that you must not fool yourself and you are the easiest person to fool.", author: "Richard Feynman" },
  { text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", author: "Nikola Tesla" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla" },
  { text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.", author: "Steve Jobs" },
  { text: "Quality is more important than quantity. One home run is much better than two doubles.", author: "Steve Jobs" },
  { text: "If something is important enough, even if the odds are against you, you should still do it.", author: "Elon Musk" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "Failure is an option here. If things are not failing, you are not innovating enough.", author: "Elon Musk" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Real knowledge is to know the extent of one's ignorance.", author: "Confucius" },
  { text: "The object of the superior man is truth.", author: "Confucius" },
  { text: "Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.", author: "Lao Tzu" },
  { text: "A man who has committed a mistake and doesn't correct it is committing another mistake.", author: "Confucius" },
  { text: "The journey is the reward.", author: "Steve Jobs" },
  { text: "I would rather have a mind opened by wonder than one closed by belief.", author: "Gerry Spence" },
  { text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "Wealth is the slave of a wise man. The master of a fool.", author: "Seneca" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus" },
  { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { text: "No great thing is created suddenly.", author: "Epictetus" },
  { text: "If you want to improve, be content to be thought foolish and stupid.", author: "Epictetus" },
  { text: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author: "Epictetus" },
  { text: "I have no special talent. I am only passionately curious.", author: "Albert Einstein" },
  { text: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein" },
  { text: "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.", author: "Albert Einstein" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
  { text: "Be curious, not judgmental.", author: "Walt Whitman" },
  { text: "Keep your face always toward the sunshine - and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Do I contradict myself? Very well then I contradict myself, (I am large, I contain multitudes.)", author: "Walt Whitman" },
  { text: "Peace begins with a smile.", author: "Mother Teresa" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "All we have to decide is what to do with the time that is given us.", author: "J.R.R. Tolkien" },
  { text: "There is some good in this world, and it's worth fighting for.", author: "J.R.R. Tolkien" },
  { text: "It is our choices, Harry, that show what we truly are, far more than our abilities.", author: "J.K. Rowling" },
  { text: "It does not do to dwell on dreams and forget to live.", author: "J.K. Rowling" },
  { text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "J.K. Rowling" },
  { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "A reader lives a thousand lives before he dies, said Jojen. The man who never reads lives only one.", author: "George R.R. Martin" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "People will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
  { text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Do not judge me by my successes, judge me by how many times I fell down and got back up again.", author: "Nelson Mandela" },
  { text: "A winner is a dreamer who never gives up.", author: "Nelson Mandela" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Given enough eyeballs, all bugs are shallow.", author: "Linus Torvalds" },
  { text: "Bad programmers worry about the code. Good programmers worry about data structures and their relationships.", author: "Linus Torvalds" },
  { text: "The most damaging phrase in the language is 'We've always done it this way'.", author: "Grace Hopper" },
  { text: "The best way to get a good idea is to get a lot of ideas.", author: "Linus Pauling" },
  { text: "If you want to have good ideas you must have many ideas.", author: "Linus Pauling" },
  { text: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.", author: "Stephen Hawking" },
  { text: "Intelligence is the ability to adapt to change.", author: "Stephen Hawking" },
  { text: "However difficult life may seem, there is always something you can do and succeed at.", author: "Stephen Hawking" },
  { text: "Remember to look up at the stars and not down at your feet.", author: "Stephen Hawking" },
  { text: "Be curious. And however difficult life may seem, there is always something you can do and succeed at.", author: "Stephen Hawking" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { text: "We are made of star-stuff. We are a way for the cosmos to know itself.", author: "Carl Sagan" },
  { text: "Extraordinary claims require extraordinary evidence.", author: "Carl Sagan" },
  { text: "Imagination will often carry us to worlds that never were. But without it we go nowhere.", author: "Carl Sagan" },
  { text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan" }
]

export default function LoadingScreen() {
  // Start at 0, but we will update to random on mount to avoid hydration mismatch
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [dots, setDots] = useState('')

  // Set random quote on mount
  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length))
  }, [])

  // Animate dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(dotTimer)
  }, [])

  // Auto-cycle quotes every 8 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    }, 8000)
    return () => clearInterval(quoteTimer)
  }, [])

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#050810] cursor-pointer pointer-events-auto"
      onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}
    >
      {/* Background Image */}
      <img 
        src="/loading-bg.jpg?v=14" 
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