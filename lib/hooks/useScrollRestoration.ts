'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useScrollRestoration(containerRef: React.RefObject<HTMLElement | null>) {
  const pathname = usePathname()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // 1. Restore Scroll Position
    const saved = sessionStorage.getItem(`scroll-${pathname}`)
    if (saved) {
      // Small timeout ensures the DOM is fully painted before we scroll
      const timeoutId = setTimeout(() => {
        el.scrollTop = parseInt(saved, 10)
      }, 50)
      return () => clearTimeout(timeoutId)
    }

    // 2. Save Scroll Position on Scroll
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${pathname}`, el.scrollTop.toString())
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [pathname, containerRef])
}