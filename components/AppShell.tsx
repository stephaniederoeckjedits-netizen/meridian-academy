'use client'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import ContextSidebar from './ContextSidebar'
import AcademyBackground from './AcademyBackground'
import CommandCenter from './CommandCenter'
import DynamicResumeMission from './DynamicResumeMission'
import { installZoneTracker } from '@/lib/navZone'
import { usePathname } from 'next/navigation'

export default function AppShell({
  children,
  userEmail,
  variant = 'dashboard',
}: {
  children: React.ReactNode
  userEmail?: string
  variant?: 'dashboard' | 'learning'
}) {
  const pathname = usePathname()
  const [statsOpen, setStatsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    return installZoneTracker()
  }, [])

  return (
    <div className="h-screen w-screen flex overflow-hidden relative" style={{ background: '#050810' }}>
      <AcademyBackground variant={variant} />
      
      <div className="relative flex w-full h-full overflow-hidden" style={{ zIndex: 1 }}>
        
        {/* LEFT SIDEBAR */}
        <div className={`hidden md:flex flex-col transition-all duration-300 ease-in-out shrink-0 h-full overflow-hidden ${isFullscreen ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}>
          <Sidebar userEmail={userEmail} />
        </div>
        
        {/* MAIN CONTENT COLUMN */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          <MobileNav userEmail={userEmail} />

          {/* FULLSCREEN TOGGLE */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] bg-[#0a1018]/90 backdrop-blur-md border border-[#22d3ee]/40 rounded-full p-2.5 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:scale-105 active:scale-95"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>

          <main className="flex-1 overflow-y-auto no-scrollbar w-full relative">
            <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 pt-6 md:pt-10 pb-24 md:pb-24">
              
              {!pathname.startsWith('/discover') && (
              <div className="mb-6 md:mb-8 relative z-40 w-full max-w-7xl mx-auto">
                <DynamicResumeMission />
              </div>
              )}

              <div className="w-full max-w-7xl mx-auto">
                {children}
              </div>

            </div>
          </main>

          {/* Floating STATS Button */}
          <button
            onClick={() => setStatsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-[#0a1018] border-2 border-[#22d3ee] rounded-xl p-3 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex flex-col items-center gap-1 hover:bg-[#22d3ee]/10 transition-all hover:scale-105 active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            <span className="text-[9px] font-mono tracking-widest text-[#22d3ee] font-bold">STATS</span>
          </button>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={`hidden xl:flex flex-col transition-all duration-300 ease-in-out shrink-0 h-full overflow-hidden ${isFullscreen ? 'w-0 opacity-0' : 'w-80 opacity-100'}`}>
          <ContextSidebar userEmail={userEmail} />
        </div>
      </div>

      <CommandCenter isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
    </div>
  )
}