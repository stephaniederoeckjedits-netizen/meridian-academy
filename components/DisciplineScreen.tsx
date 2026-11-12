'use client'
import { useEffect, useState } from 'react'
import LogoEmblem from './LogoEmblem'

export default function DisciplineScreen({ onDone, duration = 6000 }: { onDone: () => void, duration?: number }) {
  const [fading, setFading] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), duration - 900)
    const doneTimer = setTimeout(onDone, duration)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [duration, onDone])

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center px-8 pointer-events-none transition-opacity duration-1000" style={{ opacity: fading ? 0 : 1 }}>
      <div 
        className="absolute inset-0 bg-[#050810]"
        style={{
          backgroundImage: "url('/loading-bg.jpg?v=5')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-[#050810]/70 backdrop-blur-sm" />
      
      <div className="relative flex flex-col items-center max-w-3xl text-center z-10">
        <LogoEmblem size={160} className="mb-8" />
        <div className="text-2xl md:text-3xl leading-relaxed italic mb-8 text-[#e5e9f0] font-serif">
          "The training is nothing. The will is everything."
        </div>
        <div className="text-sm tracking-widest uppercase text-[#22d3ee]">
          - Bruce Wayne
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-3 z-10">
        <div className="text-[11px] tracking-[0.25em] uppercase text-[#566074] font-medium">
          LOADING NEXT MISSION{dots}
        </div>
        <div className="h-px w-40 overflow-hidden bg-[#1e2633]">
          <div className="h-full bg-[#22d3ee]" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}