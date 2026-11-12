'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-xs tracking-widest uppercase transition-all duration-300 border overflow-hidden ${
        copied 
          ? 'bg-[#10b981]/10 border-[#10b981]/50 text-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
          : 'bg-[#22d3ee]/10 border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee]/20 hover:border-[#22d3ee]/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
      }`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            COPIED
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            COPY MASTER PROMPT
          </>
        )}
      </span>
    </button>
  )
}