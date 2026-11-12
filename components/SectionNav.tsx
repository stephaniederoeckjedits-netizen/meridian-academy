'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SectionNav() {
  const pathname = usePathname()

  const links = [
    { name: 'OVERVIEW', path: '/dashboard' },
    { name: 'COURSES', path: '/courses' },
    { name: 'LIBRARY', path: '/library' },
    { name: 'COMMUNITY', path: '/community' },
  ]

  return (
    <div className="w-full bg-[#020408] border-b border-white/5 mb-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar">
        {links.map(link => {
          const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path))
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex-1 py-4 px-6 text-center font-mono text-[11px] tracking-[0.25em] transition-all border-b-2 hover:bg-white/[0.02] ${
                isActive 
                  ? 'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/5 text-sharp-cyan' 
                  : 'border-transparent text-[#8892a6] hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}