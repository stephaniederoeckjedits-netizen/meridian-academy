'use client'
import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full md:w-auto bg-[#22d3ee] text-black font-bold tracking-widest text-xs uppercase px-8 py-4 rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
    >
      {copied ? 'COPIED TO CLIPBOARD ✓' : 'COPY MASTER PROMPT'}
    </button>
  )
}