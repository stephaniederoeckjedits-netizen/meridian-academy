'use client'
import { useEffect, useState } from 'react'
import LoadingScreen from './LoadingScreen'

export default function DisciplineScreen({ onDone, duration = 12000 }: { onDone: () => void, duration?: number }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), duration - 1000)
    const doneTimer = setTimeout(onDone, duration)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [duration, onDone])

  return (
    <div className={`fixed inset-0 z-[10000] transition-opacity duration-1000 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <LoadingScreen />
    </div>
  )
}