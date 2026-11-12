'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardStats({
  xp,
  studentLevel,
  initialShards,
  completedLessons,
  totalLessons,
}: {
  xp: number
  studentLevel: number
  initialShards: number
  completedLessons: number
  totalLessons: number
}) {
  const [shards, setShards] = useState(initialShards)
  const [level, setLevel] = useState(studentLevel)
  const supabase = createClient()

  useEffect(() => {
    const handleUpdate = () => {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          supabase.from('profiles').select('shards').eq('id', data.user.id).single().then(({ data: p }) => {
            if (p) setShards(p.shards || 0)
          })
          supabase.rpc('get_combat_level', { p_user_id: data.user.id }).then(({ data: c }) => {
            if (c) setLevel(c as number)
          })
        }
      })
    }
    window.addEventListener('meridian-shards-updated', handleUpdate)
    window.addEventListener('meridian-skill-updated', handleUpdate)
    return () => {
      window.removeEventListener('meridian-shards-updated', handleUpdate)
      window.removeEventListener('meridian-skill-updated', handleUpdate)
    }
  }, [supabase])

  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="dash-stat-card p-5 rounded-lg relative overflow-hidden group">
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#8892a6] uppercase mb-2">Student Level</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-mono font-bold text-white tracking-wider">LVL {level}</span>
          <span className="text-xs font-mono text-[#c084fc] mb-1.5">{xp.toLocaleString()} XP</span>
        </div>
      </div>
      <div className="dash-stat-card p-5 rounded-lg relative overflow-hidden group">
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#8892a6] uppercase mb-2">Lessons Cleared</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-mono font-bold text-white tracking-wider">{completedLessons}</span>
          <span className="text-xs font-mono text-[#22d3ee] mb-1.5">/ {totalLessons}</span>
        </div>
      </div>
      <div className="dash-stat-card p-5 rounded-lg relative overflow-hidden group">
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#8892a6] uppercase mb-2">Curriculum</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-mono font-bold text-white tracking-wider">{progressPct}%</span>
          <span className="text-xs font-mono text-[#10b981] mb-1.5">COMPLETE</span>
        </div>
      </div>
      <div className="dash-stat-card p-5 rounded-lg relative overflow-hidden group">
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#8892a6] uppercase mb-2">Data Shards</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-mono font-bold text-white tracking-wider">{shards}</span>
          <span className="text-xs font-mono text-[#f59e0b] mb-1.5">COLLECTED</span>
        </div>
      </div>
    </div>
  )
}