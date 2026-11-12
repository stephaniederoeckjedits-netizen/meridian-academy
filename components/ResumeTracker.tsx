'use client'
import { useEffect } from 'react'
import { trackResume, ResumeType } from '@/lib/resume'

export default function ResumeTracker({ type, id, title, href, progressData }: { 
  type: ResumeType, id: string, title: string, href: string, progressData?: any 
}) {
  useEffect(() => {
    trackResume(type, id, title, href, progressData)
  }, [type, id, title, href, progressData])
  return null
}