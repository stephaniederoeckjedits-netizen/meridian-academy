'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LoadingScreen from './LoadingScreen'

export function triggerNav() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('meridian-nav-trigger'))
  }
}

export default function NavLoader() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleTrigger = () => setIsVisible(true)
    window.addEventListener('meridian-nav-trigger', handleTrigger)
    return () => window.removeEventListener('meridian-nav-trigger', handleTrigger)
  }, [])

  useEffect(() => {
    setIsVisible(false)
  }, [pathname])

  if (!isVisible) return null

  return <LoadingScreen />
}