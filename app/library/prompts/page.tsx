import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'

export const revalidate = 0

export default async function PromptsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: specs, error } = await supabase
    .from('study_specs')
    .select('*')
    .order('title', { ascending: true }) // MATCHES DETAIL PAGE ORDER

  if (error) return <div className="p-12 text-red-500 font-mono">Error: {error.message}</div>

  const categories = Array.from(new Set(specs?.map(s => s.category) || []))

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      <div className="max-w-6xl mx-auto pb-24 font-sans w-full relative z-10">
        
        <div className="mb-20 pt-12">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_15px_#22d3ee]" />
            PROMPT ENGINEERING
          </div>
          <h1 className="text-4xl md:text-7xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-[0.05em] mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            INTELLECTUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">PROTOCOLS</span>
          </h1>
          <p className="text-[#8892a6] text-sm font-[family-name:var(--font-garamond)] text-xl max-w-2xl leading-relaxed">
            Battle-tested methodologies for research, writing, and thinking. Select a protocol to copy its Master Prompt and deploy it into any AI model.
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-24">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] tracking-[0.15em] uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                {category}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#22d3ee]/50 via-[#818cf8]/20 to-transparent" />
              <span className="text-[10px] font-mono tracking-widest text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                {specs?.filter(s => s.category === category).length} SPECS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specs?.filter(s => s.category === category).map(spec => (
                <div key={spec.id} className="relative p-[1px] rounded-2xl bg-gradient-to-b from-[#22d3ee]/40 via-[#3b82f6]/10 to-transparent hover:from-[#22d3ee] hover:via-[#3b82f6]/50 transition-all duration-500 group hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <Link 
                    href={`/library/prompts/${spec.id}`}
                    className="block h-full p-8 rounded-2xl bg-[#050810] flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Animated Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#22d3ee] opacity-0 group-hover:opacity-100 group-hover:animate-[scanline_2s_linear_infinite]" />
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c8d0dd] group-hover:from-[#22d3ee] group-hover:to-[#8b5cf6] transition-all duration-500 mb-4 font-[family-name:var(--font-cinzel)] tracking-wide drop-shadow-sm">
                        {spec.title}
                      </h3>
                      <p className="text-sm text-[#8892a6] group-hover:text-[#c8d0dd] transition-colors leading-relaxed mb-8 font-[family-name:var(--font-garamond)] text-base">
                        {spec.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#22d3ee]/50 group-hover:text-[#22d3ee] transition-colors relative z-10 pt-5 border-t border-white/5 group-hover:border-[#22d3ee]/30">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">VIEW PROTOCOL</span>
                      <span className="text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#22d3ee] drop-shadow-[0_0_8px_#22d3ee]">
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