'use client'
import { useEffect } from 'react'
import { markCodexOpened } from '@/lib/activity'

export default function CodexTracker({ userEmail }: { userEmail?: string }) {
  useEffect(() => {
    markCodexOpened(userEmail)
  }, [userEmail])
  return null
}