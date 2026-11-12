'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LogoEmblem from './LogoEmblem'

export function triggerNav() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('meridian-nav-trigger'))
  }
}

export default function NavLoader() {
  const [isVisible, setIsVisible] = useState(false)
  const [dots, setDots] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleTrigger = () => setIsVisible(true)
    window.addEventListener('meridian-nav-trigger', handleTrigger)
    return () => window.removeEventListener('meridian-nav-trigger', handleTrigger)
  }, [])

  useEffect(() => {
    setIsVisible(false)
  }, [pathname])

  useEffect(() => {
    if (!isVisible) { setDots(''); return }
    const id = setInterval(() => { setDots((d) => (d.length >= 3 ? '' : d + '.')) }, 400)
    return () => clearInterval(id)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden">
      <img 
        src="/loading-bg.jpg?v=6" 
        alt="Loading Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050810_90%)] opacity-80" />
      
      <div className="relative z-10 flex flex-col items-center max-w-3xl text-center">
        <LogoEmblem size={160} className="mb-8" />
        <div className="text-2xl md:text-3xl leading-relaxed italic mb-8 text-[#e5e9f0] font-serif">
          "The training is nothing. The will is everything."
        </div>
        <div className="text-sm tracking-widest uppercase text-[#22d3ee] mb-12">
          - Bruce Wayne
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#8892a6] font-medium">
            LOADING{dots}
          </div>
          <div className="h-px w-48 overflow-hidden bg-[#1e2633]">
            <div className="h-full bg-[#22d3ee]" style={{ width: '50%', animation: 'loading 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </div>
  )
}