// FILE: app/courses/[slug]/lessons/[lessonId]/CodexContent.tsx  (architectural markdown renderer)

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong
          key={`${keyPrefix}-${i}`}
          className="font-semibold text-[var(--m-text)]"
        >
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

// If the content already has \n\n breaks, leave it alone. Only reinsert
// line breaks if the SQL editor collapsed everything to a single line.
function normalize(content: string): string {
  if (/\n\n/.test(content)) return content.trim()

  return content
    .replace(/\s+(#{2,3}\s)/g, '\n\n$1')
    .replace(/\s+(>\s)/g, '\n$1')
    .replace(/\s+(-\s)/g, '\n$1')
    .trim()
}

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'hr' }
  | { type: 'quote'; lines: string[] }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'para'; text: string }

function parse(content: string): Block[] {
  const lines = normalize(content).split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) })
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) })
      i++
      continue
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push({ type: 'quote', lines: quoteLines })
      continue
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push({ type: 'list', items, ordered: false })
      continue
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', items, ordered: true })
      continue
    }

    // Paragraph — accumulate until blank line or next marker
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('## ') &&
      !lines[i].trim().startsWith('### ') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().startsWith('- ') &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^-{3,}$/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim())
      i++
    }
    if (para.length) {
      blocks.push({ type: 'para', text: para.join(' ') })
    }
  }

  return blocks
}

export default function CodexContent({ content }: { content: string }) {
  const blocks = parse(content)

  return (
    <div className="text-[15px]">
      {blocks.map((block, i) => {
        if (block.type === 'hr') {
          return (
            <div key={i} className="h-px bg-[var(--m-border)] my-10" />
          )
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={i}
              className="text-lg md:text-xl font-bold tracking-tight text-[var(--m-cyan)] mt-10 mb-5 first:mt-0 pb-2 border-b border-[var(--m-border)]"
            >
              {block.text}
            </h2>
          )
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={i}
              className="text-base font-semibold text-[var(--m-text)] mt-7 mb-3"
            >
              {block.text}
            </h3>
          )
        }

        if (block.type === 'quote') {
          return (
            <div
              key={i}
              className="my-6 border-l-2 border-[var(--m-cyan)] bg-[var(--m-surface-2)]/40 rounded-r-lg px-5 py-4"
            >
              <div className="text-[var(--m-cyan)] font-mono text-[13px] tracking-wide leading-relaxed">
                {block.lines.map((line, j) => (
                  <div key={j}>{renderInline(line, `q${i}-${j}`)}</div>
                ))}
              </div>
            </div>
          )
        }

        if (block.type === 'list') {
          return (
            <ul key={i} className="my-5 space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 leading-relaxed">
                  <span className="text-[var(--m-cyan)] mt-[7px] shrink-0 text-[10px]">
                    {block.ordered ? `${j + 1}.` : '▸'}
                  </span>
                  <span className="text-[var(--m-text)]">
                    {renderInline(item, `l${i}-${j}`)}
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i} className="text-[var(--m-text)] leading-relaxed my-4">
            {renderInline(block.text, `p${i}`)}
          </p>
        )
      })}
    </div>
  )
}