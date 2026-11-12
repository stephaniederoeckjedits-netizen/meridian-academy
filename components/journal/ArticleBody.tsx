interface Block {
  type: string
  text?: string
  level?: number
  items?: string[]
  ordered?: boolean
  attribution?: string
  src?: string
  caption?: string
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  if (!blocks || !Array.isArray(blocks)) return null

  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} className="text-2xl md:text-3xl font-bold text-white mb-5 mt-12 first:mt-0 leading-tight tracking-tight">
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} className="text-xl md:text-2xl font-bold text-white mb-4 mt-8 leading-tight">
                {block.text}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="text-[17px] md:text-[19px] leading-[1.75] text-[#c8d0dd] mb-6">
                {block.text}
              </p>
            )
          case 'quote':
            return (
              <blockquote key={i} className="my-10 pl-6 md:pl-8 border-l-2 border-[#22d3ee]">
                <p className="text-xl md:text-2xl leading-relaxed italic text-white font-[family-name:var(--font-garamond)] mb-3">
                  "{block.text}"
                </p>
                {block.attribution && (
                  <cite className="text-sm font-mono tracking-widest text-[#8892a6] uppercase not-italic">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            )
          case 'callout':
            return (
              <div key={i} className="my-8 p-6 rounded-lg border-l-4 border-[#22d3ee] bg-[#22d3ee]/5">
                <div className="text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] uppercase mb-2">Editor's Note</div>
                <p className="text-base md:text-lg leading-relaxed text-white italic">
                  {block.text}
                </p>
              </div>
            )
          case 'list':
            if (!block.items) return null
            return (
              <ul key={i} className={`my-6 space-y-3 ${block.ordered ? 'list-decimal' : 'list-disc'} pl-6 md:pl-8`}>
                {block.items.map((item, j) => (
                  <li key={j} className="text-[17px] md:text-[19px] leading-relaxed text-[#c8d0dd]">
                    {item}
                  </li>
                ))}
              </ul>
            )
          case 'image':
            return (
              <figure key={i} className="my-10">
                <img
                  src={block.src}
                  alt={block.caption || ''}
                  className="w-full rounded-lg border border-white/5"
                />
                {block.caption && (
                  <figcaption className="mt-3 text-sm text-[#8892a6] italic text-center font-[family-name:var(--font-garamond)]">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )
          case 'divider':
            return <hr key={i} className="my-12 border-white/10" />
          default:
            return null
        }
      })}
    </div>
  )
}