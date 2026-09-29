import Link from 'next/link'
import Sidebar from './Sidebar'

export default function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail?: string
}) {
  return (
    <div className="min-h-screen flex bg-[var(--m-bg)]">
      <Sidebar userEmail={userEmail} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--m-border)]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-bold text-xs">
              M
            </div>
            <span className="text-sm font-bold">MERIDIAN</span>
          </Link>
          <Link href="/community" className="text-xs text-[var(--m-text-muted)]">
            Community
          </Link>
        </header>

        <main className="flex-1 min-w-0 m-grid-bg">{children}</main>
      </div>
    </div>
  )
}