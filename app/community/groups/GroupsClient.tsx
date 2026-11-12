'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function GroupsClient({ groups, userId }: { groups: any[]; userId: string }) {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  async function create() {
    if (!name.trim()) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await supabase.from('groups').insert({ slug, name: name.trim(), description: desc.trim(), owner_id: userId, is_public: isPublic })
    setShow(false); setName(''); setDesc(''); router.refresh()
  }

  return (
    <>
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#8b5cf6] mb-3"><span className="w-1 h-1 rounded-full bg-[#8b5cf6] animate-pulse" />GROUPS</div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#e5e9f0]">STUDY GROUPS</h1>
          <p className="text-sm text-[#8892a6] mt-2">Create or join groups. Learn together.</p>
        </div>
        <button onClick={() => setShow(!show)} className="game-btn px-5 py-2.5 text-xs shrink-0">+ New Group</button>
      </div>
      {show && (
        <div className="mb-8 p-5 rounded-xl border border-[#8b5cf6]/30 bg-[#0a0f16]">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Group name" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white mb-2" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" rows={2} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white mb-2 resize-none" />
          <label className="flex items-center gap-2 text-xs text-[#8892a6] mb-3"><input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} /> Public group</label>
          <div className="flex gap-2"><button onClick={create} className="game-btn px-5 py-2 text-xs">Create</button><button onClick={() => setShow(false)} className="px-4 py-2 text-xs text-[#8892a6] hover:text-white">Cancel</button></div>
        </div>
      )}
      {groups.length === 0 ? <div className="rounded-2xl p-12 text-center border border-[#8b5cf6]/20 bg-[#0a0f16] text-[#8892a6]">No groups yet. Create the first one.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g: any) => (
            <Link key={g.id} href={`/community/groups/${g.slug}`} className="game-card p-5 group" style={{ '--accent-color': g.is_public ? '#8b5cf6' : '#f59e0b' } as any}>
              <div className="text-[10px] font-mono uppercase mb-2" style={{ color: g.is_public ? '#8b5cf6' : '#f59e0b' }}>{g.is_public ? '◉ Public' : '🔒 Private'}</div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#8b5cf6] mb-2">{g.name}</h3>
              <p className="text-sm text-[#8892a6] line-clamp-2">{g.description}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}