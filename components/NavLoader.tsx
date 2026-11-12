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

  // 1. Listen for the trigger
  useEffect(() => {
    const handleTrigger = () => setIsVisible(true)
    window.addEventListener('meridian-nav-trigger', handleTrigger)
    return () => window.removeEventListener('meridian-nav-trigger', handleTrigger)
  }, [])

  // 2. Hide on path change
  useEffect(() => {
    setIsVisible(false)
  }, [pathname])

  // 3. FAILSAFE: Force hide after 5 seconds if it gets stuck
  useEffect(() => {
    if (isVisible) {
      const failsafeTimer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      return () => clearTimeout(failsafeTimer)
    }
  }, [isVisible])

  if (!isVisible) return null

  return <LoadingScreen />
}