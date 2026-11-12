'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector('[data-article-body]') as HTMLElement
      if (!article) return
      const start = article.offsetTop
      const height = article.offsetHeight
      const scrolled = window.scrollY - start
      const pct = Math.max(0, Math.min(100, (scrolled / (height - window.innerHeight * 0.5)) * 100))
      setProgress(pct)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#ec4899] transition-[width] duration-150 shadow-[0_0_10px_#22d3ee]"
        style={{ width: progress + '%' }}
      />
    </div>
  )
}