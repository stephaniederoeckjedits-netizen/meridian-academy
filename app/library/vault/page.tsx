import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'

export const revalidate = 0

export default async function VaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: entries, error } = await supabase
    .from('knowledge_vault')
    .select('*')
    .order('title', { ascending: true }) // MATCHES DETAIL PAGE ORDER

  if (error) return <div className="p-12 text-red-500 font-mono">Error: {error.message}</div>

  const disciplines = Array.from(new Set(entries?.map(e => e.discipline) || []))

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="max-w-6xl mx-auto pb-24 font-sans w-full relative z-10">
        
        <div className="mb-20 pt-12">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.3em] text-[#f59e0b] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_15px_#f59e0b]" />
            MERIDIAN VAULT
          </div>
          <h1 className="text-4xl md:text-7xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-[0.05em] mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            THE KNOWLEDGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#f472b6] to-[#ec4899] drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">VAULT</span>
          </h1>
          <p className="text-[#8892a6] text-sm font-[family-name:var(--font-garamond)] text-xl max-w-2xl leading-relaxed">
            Curated fragments of reality. Deconstructed into ontology, first principles, mechanisms, and leverage.
          </p>
        </div>

        {disciplines.map(discipline => (
          <div key={discipline} className="mb-24">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#f472b6] to-[#ec4899] tracking-[0.15em] uppercase drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                {discipline}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#f59e0b]/50 via-[#f472b6]/20 to-transparent" />
              <span className="text-[10px] font-mono tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                {entries?.filter(e => e.discipline === discipline).length} ENTRIES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {entries?.filter(e => e.discipline === discipline).map(entry => (
                <div key={entry.id} className="relative p-[1px] rounded-2xl bg-gradient-to-b from-[#f59e0b]/40 via-[#ec4899]/10 to-transparent hover:from-[#f59e0b] hover:via-[#ec4899]/50 transition-all duration-500 group hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <Link 
                    href={`/library/vault/${entry.id}`}
                    className="block h-full p-10 rounded-2xl bg-[#050810] relative overflow-hidden"
                  >
                    {/* Animated Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#f59e0b] opacity-0 group-hover:opacity-100 group-hover:animate-[scanline_2s_linear_infinite]" />

                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#f59e0b] mb-5 relative z-10">
                      <span className="w-2 h-2 rotate-45 bg-[#f59e0b] shadow-[0_0_10px_#f59e0b] animate-[spin_4s_linear_infinite] group-hover:animate-[spin_1s_linear_infinite]" />
                      KNOWLEDGE FRAGMENT
                    </div>
                    
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c8d0dd] group-hover:from-[#f59e0b] group-hover:to-[#ec4899] transition-all duration-500 mb-4 font-[family-name:var(--font-cinzel)] tracking-wide relative z-10 drop-shadow-sm">
                      {entry.title}
                    </h3>
                    
                    <p className="text-sm text-[#8892a6] group-hover:text-[#c8d0dd] transition-colors leading-relaxed mb-10 font-[family-name:var(--font-garamond)] text-lg relative z-10 italic">
                      "{entry.core_concept}"
                    </p>
                    
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#f59e0b]/50 group-hover:text-[#f59e0b] transition-colors relative z-10 pt-5 border-t border-white/5 group-hover:border-[#f59e0b]/30">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">ACCESS FRAGMENT</span>
                      <span className="text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#f59e0b] drop-shadow-[0_0_8px_#f59e0b]">
                        {'\u2192'}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}