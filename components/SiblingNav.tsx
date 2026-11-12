import Link from 'next/link'

interface NavItem {
  id: string
  title: string
}

interface SiblingNavProps {
  prev: NavItem | null
  next: NavItem | null
  basePath: string
  accent?: 'cyan' | 'gold'
}

export default function SiblingNav({ prev, next, basePath, accent = 'cyan' }: SiblingNavProps) {
  const isCyan = accent === 'cyan'
  const hoverText = isCyan ? 'group-hover:text-[#22d3ee]' : 'group-hover:text-[#f59e0b]'
  const borderColor = isCyan ? 'group-hover:border-[#22d3ee]' : 'group-hover:border-[#f59e0b]'
  const glow = isCyan ? 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]' : 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]'
  const textAccent = isCyan ? 'text-[#22d3ee]' : 'text-[#f59e0b]'
  const bgHover = isCyan ? 'group-hover:bg-[#22d3ee]/5' : 'group-hover:bg-[#f59e0b]/5'
  const lineColor = isCyan ? 'bg-[#22d3ee]' : 'bg-[#f59e0b]'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-24 pt-12 border-t border-white/5 w-full">
      {prev ? (
        <Link 
          href={`${basePath}/${prev.id}`}
          className={`group relative flex flex-col justify-center p-8 bg-[#050810]/80 backdrop-blur-md border border-white/10 transition-all duration-500 ${borderColor} ${glow} ${bgHover} overflow-hidden`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
        >
          {/* Animated Side Bar */}
          <div className={`absolute top-0 left-0 w-[3px] h-full ${lineColor} opacity-30 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_currentColor]`} />
          
          <span className={`text-[10px] font-mono tracking-[0.3em] mb-3 flex items-center gap-3 text-[#8892a6] transition-colors ${hoverText}`}>
            <span className="text-xl transition-transform duration-300 group-hover:-translate-x-2">{'\u2190'}</span> PREVIOUS DATA
          </span>
          <span className={`text-2xl font-bold text-white transition-all duration-300 ${hoverText} font-[family-name:var(--font-cinzel)] tracking-wide`}>
            {prev.title}
          </span>
        </Link>
      ) : <div className="hidden md:block" />}

      {next ? (
        <Link 
          href={`${basePath}/${next.id}`}
          className={`group relative flex flex-col justify-center p-8 bg-[#050810]/80 backdrop-blur-md border border-white/10 transition-all duration-500 ${borderColor} ${glow} ${bgHover} overflow-hidden text-right`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}
        >
          {/* Animated Side Bar */}
          <div className={`absolute top-0 right-0 w-[3px] h-full ${lineColor} opacity-30 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_currentColor]`} />
          
          <span className={`text-[10px] font-mono tracking-[0.3em] mb-3 flex items-center justify-end gap-3 text-[#8892a6] transition-colors ${hoverText}`}>
            NEXT DATA <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">{'\u2192'}</span>
          </span>
          <span className={`text-2xl font-bold text-white transition-all duration-300 ${hoverText} font-[family-name:var(--font-cinzel)] tracking-wide`}>
            {next.title}
          </span>
        </Link>
      ) : <div className="hidden md:block" />}
    </div>
  )
}