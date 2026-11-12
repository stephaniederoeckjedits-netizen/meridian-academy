import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import SiblingNav from '@/components/SiblingNav'
import CopyButton from '@/components/CopyButton'
import ResumeTracker from '@/components/ResumeTracker'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: spec, error } = await supabase
    .from('study_specs')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !spec) notFound()

  const { data: siblings } = await supabase
    .from('study_specs')
    .select('id, title')
    .eq('category', spec.category)
    .order('created_at', { ascending: true })

  const currentIndex = siblings?.findIndex(s => s.id === spec.id) ?? -1
  const prev = currentIndex > 0 ? siblings![currentIndex - 1] : null
  const next = currentIndex < (siblings?.length ?? 0) - 1 ? siblings![currentIndex + 1] : null

  const promptText = spec.content || spec.prompt || spec.body || spec.description || "Prompt content goes here..."

  return (
    <AppShell userEmail={user?.email ?? undefined}>
      {/* THE MAGIC TRACKER */}
      <ResumeTracker type="spec" id={spec.id} title={spec.title} href={`/library/prompts/${spec.id}`} />

      <div className="max-w-4xl mx-auto pb-24 font-sans w-full min-h-screen pt-12 relative z-10">
        
        <Link href="/library/prompts" className="inline-flex items-center gap-2 text-xs font-mono text-[#8892a6] hover:text-[#22d3ee] transition-colors mb-12">
          <span>&larr;</span> BACK TO PROTOCOLS
        </Link>

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_10px_#22d3ee]" />
              {spec.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-4 tracking-wide drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              {spec.title}
            </h1>
            <p className="text-[#8892a6] text-lg font-[family-name:var(--font-garamond)] italic max-w-2xl leading-relaxed">
              {spec.description}
            </p>
          </div>
          <div className="shrink-0">
            <CopyButton text={promptText} />
          </div>
        </div>

        <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-[#22d3ee]/80 via-[#3b82f6]/40 to-[#8b5cf6]/80 shadow-[0_0_50px_rgba(34,211,238,0.15)] group hover:shadow-[0_0_70px_rgba(34,211,238,0.3)] transition-all duration-500">
          <div className="bg-[#0a0f18] rounded-2xl p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22d3ee] via-[#3b82f6] to-[#8b5cf6]" />
            
            <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#22d3ee] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full animate-pulse" />
              MASTER PROMPT READY
            </div>

            <div className="prose prose-invert prose-cyan max-w-none font-mono text-sm md:text-base leading-relaxed text-[#c8d0dd] whitespace-pre-wrap">
              {promptText}
            </div>
          </div>
        </div>

        <SiblingNav prev={prev} next={next} basePath="/library/prompts" accent="cyan" />
      </div>
    </AppShell>
  )
}