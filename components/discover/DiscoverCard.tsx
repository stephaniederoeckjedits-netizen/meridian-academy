'use client'
import { useState, useEffect } from 'react'
import YouTubePlayer from '@/components/video/YouTubePlayer'

export default function DiscoverCard({ 
  video, 
  themeColor, 
  themeIcon, 
  onPlay, 
  autoPlay 
}: { 
  video: any
  themeColor: string
  themeIcon: React.ReactNode
  onPlay?: (video: any) => void
  autoPlay?: boolean 
}) {
  const [imgError, setImgError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoPlay || false)

  useEffect(() => {
    if (autoPlay) setIsPlaying(true)
  }, [autoPlay])

  const handlePlayClick = () => {
    setIsPlaying(true)
    if (onPlay) onPlay(video)
  }

  return (
    <div 
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0a1018] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1"
      style={{ borderColor: `${themeColor}40` }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" style={{ boxShadow: `inset 0 0 30px ${themeColor}20` }} />

      <div className="relative aspect-video bg-[#050810] overflow-hidden border-b border-white/5 z-10">
        {isPlaying ? (
          <YouTubePlayer videoId={video.external_video_id} title={video.title} />
        ) : (
          <div className="absolute inset-0 cursor-pointer" onClick={handlePlayClick}>
            {imgError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1018] to-[#050810] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border z-10" style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}40`, boxShadow: `0 0 30px ${themeColor}20`, color: themeColor }}>
                  {themeIcon}
                </div>
                <div className="text-[8px] font-mono tracking-[0.4em] text-white/40 uppercase mb-2 z-10">MERIDIAN COMMUNITY</div>
                <div className="text-xs font-bold text-white text-center px-6 line-clamp-2 z-10 font-[family-name:var(--font-cinzel)]">{video.title}</div>
              </div>
            ) : (
              <img 
                src={video.thumbnail_url} 
                alt={video.title} 
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
              />
            )}
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
              <div className="w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}20`, borderColor: `${themeColor}80`, boxShadow: `0 0 30px ${themeColor}40` }}>
                <svg className="w-5 h-5 translate-x-[1px]" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-mono text-white tracking-wider border border-white/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> YOUTUBE
            </div>
          </div>
        )}
      </div>

      <div className="p-6 relative z-10 bg-[#0a1018]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold px-2 py-1 rounded" style={{ color: themeColor, backgroundColor: `${themeColor}15`, border: `1px solid ${themeColor}30` }}>
            {video.primary_discipline}
          </span>
          <span className="text-[10px] font-mono text-[#566074]">By {video.creator_name}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#22d3ee] transition-colors line-clamp-2">{video.title}</h3>
        <p className="text-sm text-[#8892a6] leading-relaxed line-clamp-2">{video.description}</p>
      </div>
    </div>
  )
}