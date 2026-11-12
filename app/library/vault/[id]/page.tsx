import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import SiblingNav from '@/components/SiblingNav'
import ResumeTracker from '@/components/ResumeTracker'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

interface VaultStep {
  num: string
  title: string
  color: string
  content: string
}

export default async function VaultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entry, error } = await supabase
    .from('knowledge_vault')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !entry) notFound()

  const { data: siblings } = await supabase
    .from('knowledge_vault')
    .select('id, title')
    .eq('discipline', entry.discipline)
    .order('created_at', { ascending: true })

  const currentIndex = siblings?.findIndex(s => s.id === entry.id) ?? -1
  const prev = currentIndex > 0 ? siblings![currentIndex - 1] : null
  const next = currentIndex < (siblings?.length ?? 0) - 1 ? siblings![currentIndex + 1] : null

  const sections = [
    { label: 'DETAILED EXPLANATION', data: entry.detailed_explanation, type: 'text' },
    { label: 'FIRST PRINCIPLES', data: entry.first_principles, type: 'list' },
    { label: 'ANALOGIES', data: entry.analogies, type: 'quote' },
    { label: 'CONNECTIONS', data: entry.connections, type: 'tags' },
    { label: 'APPLICATIONS', data: entry.applications, type: 'list' },
    { label: 'FURTHER QUESTIONS', data: entry.further_questions, type: 'terminal' }
  ].filter(sec => sec.data && (Array.isArray(sec.data) ? sec.data.length > 0 : sec.data.trim() !== ''))

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      {/* THE MAGIC TRACKER */}
      <ResumeTracker type="vault" id={entry.id} title={entry.title} href={`/library/vault/${entry.id}`} />

      <div className="max-w-4xl mx-auto pb-24 font-sans w-full min-h-screen pt-12 relative z-10">
        
        <Link href="/library/vault" className="inline-flex items-center gap-2 text-xs font-mono text-[#8892a6] hover:text-[#f59e0b] transition-colors mb-12">
          <span>&larr;</span> BACK TO VAULT
        </Link>

        <div className="mb-16">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.3em] text-[#f59e0b] mb-4">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#f59e0b] shadow-[0_0_10px_#f59e0b] animate-[spin_4s_linear_infinite]" />
            {entry.discipline}
          </div>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-6 tracking-wide drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            {entry.title}
          </h1>
          <p className="text-[#8892a6] text-xl font-[family-name:var(--font-garamond)] italic max-w-2xl leading-relaxed">
            "{entry.core_concept}"
          </p>
        </div>

        {/* THE TIMELINE UI */}
        <div className="relative border-l-2 border-white/5 ml-4 md:ml-6 space-y-16 pb-12 mb-16">
          {sections.map((section, index) => {
            const colors = ['#22d3ee', '#c084fc', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
            const color = colors[index % colors.length];
            const stepNum = String(index + 1).padStart(2, '0');

            return (
              <div key={section.label} className="relative pl-10 md:pl-14 group">
                
                <div 
                  className="absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center font-mono text-[10px] font-bold bg-[#0a0f18] border-2 z-10 transition-all duration-500 group-hover:scale-110"
                  style={{ borderColor: color, color: color, boxShadow: `0 0 15px ${color}40` }}
                >
                  {stepNum}
                </div>

                <div className="pt-1">
                  <h3 
                    className="text-sm font-mono tracking-[0.2em] uppercase mb-4 font-bold drop-shadow-md"
                    style={{ color: color }}
                  >
                    {section.label}
                  </h3>
                  
                  <div className="prose prose-invert max-w-none">
                    {section.type === 'text' && (
                      <p className="text-[#e5e9f0] font-[family-name:var(--font-garamond)] text-xl leading-relaxed">
                        {section.data}
                      </p>
                    )}

                    {section.type === 'list' && Array.isArray(section.data) && (
                      <ul className="space-y-4">
                        {section.data.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-4">
                            <span style={{ color }} className="mt-1.5 text-xs drop-shadow-md">◆</span>
                            <span className="text-[#e5e9f0] font-[family-name:var(--font-garamond)] text-xl leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.type === 'quote' && Array.isArray(section.data) && (
                      <div className="space-y-4">
                        {section.data.map((item: string, i: number) => (
                          <p key={i} className="text-[#c8d0dd] font-[family-name:var(--font-garamond)] text-xl italic leading-relaxed pl-4 border-l border-white/10">
                            "{item}"
                          </p>
                        ))}
                      </div>
                    )}

                    {section.type === 'tags' && Array.isArray(section.data) && (
                      <div className="flex flex-wrap gap-3">
                        {section.data.map((item: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm font-mono text-[#e5e9f0]">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {section.type === 'terminal' && Array.isArray(section.data) && (
                      <div className="space-y-3 font-mono text-sm">
                        {section.data.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 text-[#8892a6]">
                            <span className="text-white/30">{'>'}</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        <SiblingNav prev={prev} next={next} basePath="/library/vault" accent="gold" />
      </div>
    </AppShell>
  )
}