'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ReadingProgressTracker({ articleId, userId }: { articleId: string; userId: string }) {
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)
  const lastSave = useRef<number>(0)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Load existing progress
    async function load() {
      const { data } = await supabase
        .from('journal_reading_progress')
        .select('scroll_percentage, completed')
        .eq('user_id', userId)
        .eq('article_id', articleId)
        .maybeSingle()
      if (data) {
        setProgress(data.scroll_percentage || 0)
        setCompleted(data.completed || false)
      }
    }
    load()

    // Track scroll
    function onScroll() {
      const article = document.querySelector('[data-article-body]') as HTMLElement
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = article.offsetHeight
      const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.3)
      const pct = Math.min(100, Math.round((scrolled / (total - window.innerHeight * 0.7)) * 100))
      
      if (pct > progress) {
        setProgress(pct)
        if (pct >= 90 && !completed) setCompleted(true)
        
        // Debounced save (max once per 3s)
        const now = Date.now()
        if (now - lastSave.current > 3000) {
          lastSave.current = now
          supabase.from('journal_reading_progress').upsert({
            user_id: userId,
            article_id: articleId,
            scroll_percentage: pct,
            completed: pct >= 90,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,article_id' })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [articleId, userId, supabase])

  // Top progress bar
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#ec4899] transition-[width] duration-150 shadow-[0_0_12px_#f59e0b]"
        style={{ width: progress + '%' }}
      />
    </div>
  )
}