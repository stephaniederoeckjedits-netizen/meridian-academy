'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LessonEditor({
  lessonId,
  title,
  orderIndex,
  videoUrl,
  content,
}: {
  lessonId: string
  title: string
  orderIndex: number
  videoUrl: string
  content: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [url, setUrl] = useState(videoUrl)
  const [text, setText] = useState(content)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const { error } = await supabase
      .from('lessons')
      .update({ video_url: url.trim() || null, content: text.trim() || null })
      .eq('id', lessonId)

    if (!error) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="border border-neutral-800 rounded-xl p-5">
      <div className="text-xs text-neutral-500 mb-1">Lesson {orderIndex}</div>
      <div className="font-medium mb-4">{title}</div>

      <label className="block text-xs text-neutral-400 mb-1">Video URL</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 mb-3 focus:border-neutral-600 outline-none text-sm"
      />

      <label className="block text-xs text-neutral-400 mb-1">Lesson content</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 mb-3 focus:border-neutral-600 outline-none text-sm resize-none"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black text-sm font-semibold rounded-full px-5 py-1.5 hover:bg-neutral-200 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
      </div>
    </div>
  )
}