'use client'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface YouTubePlayerProps {
  videoId: string
  title: string
}

export default function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unavailable'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let startTime = 0
    try {
      const saved = localStorage.getItem('meridian_video_resume')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.videoId === videoId && parsed.time > 5) {
          startTime = parsed.time
        }
      }
    } catch {}

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      window.onYouTubeIframeAPIReady = () => { initPlayer() }
    } else {
      initPlayer()
    }

    function initPlayer() {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, start: Math.floor(startTime) },
        events: {
          onReady: (event: any) => {
            setStatus('ready')
            event.target.playVideo()
            startTracking()
          },
          onStateChange: (event: any) => {
            if (event.data === 0) { localStorage.removeItem('meridian_video_resume') }
          },
          onError: (event: any) => {
            setStatus('error')
            switch (event.data) {
              case 2: setErrorMessage('Invalid video parameters.'); break
              case 5: setErrorMessage('HTML5 player error.'); break
              case 100: setErrorMessage('Video is unavailable or has been removed.'); break
              case 101:
              case 150: setErrorMessage('The creator does not allow this video to be embedded.'); break
              default: setErrorMessage('An unknown error occurred.')
            }
          },
        },
      })
    }

    function startTracking() {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const time = playerRef.current.getCurrentTime()
          if (time > 0) {
            localStorage.setItem('meridian_video_resume', JSON.stringify({ videoId, title, time }))
          }
        }
      }, 5000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (playerRef.current) playerRef.current.destroy()
    }
  }, [videoId, title])

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a1018]">
          <div className="w-8 h-8 border-2 border-t-[#22d3ee] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1018] p-6 text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-white font-semibold mb-2">Video Unavailable</p>
          <p className="text-[#8892a6] text-sm mb-6 max-w-md">{errorMessage || 'This video cannot be played.'}</p>
          <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-[#22d3ee] text-black font-bold font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-cyan-300 transition-colors">
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  )
}