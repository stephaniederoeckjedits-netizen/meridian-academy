'use client'
import { useEffect, useState } from 'react'

export default function ContinueWatching({ onResume }: { onResume: (videoId: string) => void }) {
  const [savedVideo, setSavedVideo] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('meridian_video_resume')
      if (saved) setSavedVideo(JSON.parse(saved))
    } catch {}
  }, [])

  if (!mounted || !savedVideo || !savedVideo.videoId) return null

  const minutes = Math.floor(savedVideo.time / 60)
  const seconds = Math.floor(savedVideo.time % 60)

  return (
    <div className="mb-10 w-full max-w-5xl mx-auto">
      <div 
        onClick={() => onResume(savedVideo.videoId)}
        className="group relative flex items-center justify-between w-full p-4 md:p-6 rounded-2xl bg-[#050810] border border-[#8b5cf6]/40 hover:border-[#8b5cf6] transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] overflow-hidden"
      >
        {/* Left Purple Glow Bar */}
        <div className="absolute left-0 top-0 w-1.5 h-full bg-[#8b5cf6] opacity-80 group-hover:opacity-100 shadow-[0_0_15px_#8b5cf6] transition-opacity" />
        
        <div className="flex flex-col min-w-0 pl-4 relative z-10">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#8b5cf6] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
            CONTINUE WATCHING
          </div>
          <div className="text-xl md:text-3xl text-white font-[family-name:var(--font-cinzel)] font-bold tracking-wide truncate max-w-md md:max-w-2xl group-hover:text-[#a78bfa] transition-colors">
            {savedVideo.title}
          </div>
          <div className="text-[10px] font-mono text-[#8892a6] mt-2 uppercase tracking-widest">
            RESUMED AT {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Right Circular Play Button */}
        <div className="shrink-0 ml-4 relative z-10">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/50 flex items-center justify-center group-hover:bg-[#8b5cf6] transition-all duration-300 group-hover:scale-105">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-[#8b5cf6] group-hover:text-white transition-colors translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    </div>
  )
}