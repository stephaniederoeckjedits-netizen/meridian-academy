// FILE: app/courses/[slug]/lessons/[lessonId]/CodexContent.tsx  (mini markdown renderer)

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

function isNumberedHeading(line: string): boolean {
  return /^\d+\.\s+\S/.test(line) && line.length < 90 && !line.endsWith('.')
}

export default function CodexContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/)

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        if (/^-{3,}$/.test(trimmed)) {
          return (
            <hr
              key={i}
              className="border-0 border-t border-[var(--m-border)] my-6"
            />
          )
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={i}
              className="text-lg font-semibold text-[var(--m-cyan)] pt-3"
            >
              {trimmed.slice(3)}
            </h3>
          )
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={i} className="text-base font-semibold pt-2">
              {trimmed.slice(4)}
            </h4>
          )
        }

        if (trimmed.startsWith('> ')) {
          const lines = trimmed
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join(' ')
          return (
            <blockquote
              key={i}
              className="border-l-2 border-[var(--m-cyan)] pl-4 py-1 text-[var(--m-text-muted)] italic"
            >
              {renderInline(lines, `q${i}`)}
            </blockquote>
          )
        }

        const lines = trimmed.split('\n')
        if (lines.every((l) => l.trim().startsWith('- '))) {
          const items = lines.map((l) => l.trim().slice(2))
          return (
            <ul key={i} className="space-y-2">
              {items.map((item, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-[var(--m-text)] leading-relaxed"
                >
                  <span className="text-[var(--m-cyan)] mt-2 shrink-0 text-xs">
                    ●
                  </span>
                  <span>{renderInline(item, `l${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (lines.length === 1 && isNumberedHeading(lines[0])) {
          const text = lines[0].replace(/^\d+\.\s+/, '')
          return (
            <h3
              key={i}
              className="text-lg font-semibold text-[var(--m-cyan)] pt-3"
            >
              {text}
            </h3>
          )
        }

        return (
          <p
            key={i}
            className="text-[var(--m-text)] leading-relaxed whitespace-pre-wrap"
          >
            {renderInline(trimmed, `p${i}`)}
          </p>
        )
      })}
    </div>
  )
}