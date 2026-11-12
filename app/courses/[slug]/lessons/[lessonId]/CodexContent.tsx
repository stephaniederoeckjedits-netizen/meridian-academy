'use client'

export default function CodexContent({ content }: { content: string }) {
  if (!content) return null

  const blocks = content.replace(/\r\n/g, '\n').split(/\n\s*\n/).filter(b => b.trim() !== '')

  const formatText = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-[#8892a6]">$1</em>')
      .replace(/→/g, '<span class="text-[#22d3ee] font-bold px-1">→</span>')
      .replace(/↓/g, '<span class="text-[#8b5cf6] font-bold px-1">↓</span>')
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-6 w-full overflow-hidden">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()

        // 1. Table Block
        if (trimmed.startsWith('|')) {
          const lines = trimmed.split('\n').filter(l => l.trim().startsWith('|'))
          const cleanLines = lines.filter(l => !/^\|[\s\-\|:]+\|$/.test(l.trim()))
          
          if (cleanLines.length > 0) {
            const headers = cleanLines[0].split('|').map(s => s.trim()).filter(Boolean)
            const rows = cleanLines.slice(1).map(row => row.split('|').map(s => s.trim()).filter(Boolean))

            return (
              <div key={idx} className="w-full overflow-x-auto rounded-xl border border-[#22d3ee]/20 bg-[#0a1018] shadow-[0_0_30px_rgba(34,211,238,0.05)] my-6">
                <table className="w-full text-sm text-left min-w-[400px]">
                  <thead className="bg-[#22d3ee]/5 border-b border-[#22d3ee]/20">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 font-mono text-[10px] tracking-widest text-[#22d3ee] uppercase font-bold">{formatText(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rows.map((row, r) => (
                      <tr key={r} className="hover:bg-[#22d3ee]/5 transition-colors">
                        {row.map((cell, c) => (
                          <td key={c} className="px-4 py-3 text-[#c8d0dd] font-[family-name:var(--font-garamond)] text-base">{formatText(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // 2. H1 Block
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-3 leading-tight">{formatText(trimmed.slice(2))}</h1>
        }

        // 3. H2 Timeline Node Block
        if (trimmed.startsWith('## ')) {
          const title = trimmed.slice(3)
          const match = title.match(/^(?:[^\w\d]*)(\d+)[^\w\d]*(.*)$/)
          const num = match ? match[1] : null
          const cleanTitle = match ? match[2] : title

          if (num) {
            return (
              <div key={idx} className="relative pl-10 mt-10 mb-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#22d3ee] bg-[#0a1018] flex items-center justify-center text-[#22d3ee] font-mono text-[10px] font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] z-10">
                  {num}
                </div>
                <div className="absolute left-4 top-1/2 -bottom-10 w-px bg-gradient-to-b from-[#22d3ee]/50 to-transparent" />
                <h2 className="text-lg md:text-xl font-bold text-white tracking-wide flex items-center gap-3 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse shrink-0" />
                  {formatText(cleanTitle)}
                </h2>
              </div>
            )
          }
          return <h2 key={idx} className="text-lg md:text-xl font-bold text-white mt-8 mb-3 leading-tight">{formatText(title)}</h2>
        }

        // 4. Blockquote (Insight)
        if (trimmed.startsWith('> ')) {
          const quote = trimmed.split('\n').map(l => l.replace(/^>\s*/, '')).join(' ')
          return (
            <div key={idx} className="p-5 md:p-6 rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 relative overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.1)] my-6">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6]" />
              <div className="text-[#e5e9f0] font-medium leading-relaxed font-[family-name:var(--font-garamond)] text-base md:text-lg italic relative z-10">
                {formatText(quote)}
              </div>
            </div>
          )
        }

        // 5. List Block
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').map(l => l.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, ''))
          return (
            <ul key={idx} className="space-y-3 pl-2 my-4">
              {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[#c8d0dd] items-start">
                  <span className="text-[#22d3ee] mt-1 opacity-80 text-sm shrink-0">◆</span>
                  <div className="text-base font-[family-name:var(--font-garamond)] leading-relaxed">{formatText(item)}</div>
                </li>
              ))}
            </ul>
          )
        }

        // 6. DRA Flow Block (Arrows)
        if (trimmed.includes('→') || trimmed.includes('↓')) {
          return (
            <div key={idx} className="p-4 md:p-5 rounded-xl border border-white/5 bg-[#121a27] flex flex-col gap-3 font-mono text-xs md:text-sm tracking-wide shadow-inner my-6 w-full overflow-hidden">
              {trimmed.split('\n').map((line, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#22d3ee] opacity-50 shrink-0 w-5">0{i + 1}</span>
                  <div className="text-[#e5e9f0] break-words">{formatText(line)}</div>
                </div>
              ))}
            </div>
          )
        }

        // 7. Paragraph Block
        return (
          <p key={idx} className="text-base leading-relaxed text-[#8892a6] font-[family-name:var(--font-garamond)] my-4">
            {formatText(trimmed)}
          </p>
        )
      })}
    </div>
  )
}