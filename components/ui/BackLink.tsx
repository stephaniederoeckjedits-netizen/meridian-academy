import Link from 'next/link'

export default function BackLink({ href, label, accent = '#22d3ee' }: { href: string; label: string; accent?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all mb-8"
      style={{
        borderColor: accent + '40',
        backgroundColor: accent + '08',
      }}
    >
      <span
        className="flex items-center justify-center w-6 h-6 rounded border transition-all group-hover:-translate-x-0.5"
        style={{ borderColor: accent + '60', color: accent, backgroundColor: accent + '15' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      <span className="text-xs font-mono tracking-[0.2em] uppercase font-bold" style={{ color: accent }}>
        {label}
      </span>
    </Link>
  )
}