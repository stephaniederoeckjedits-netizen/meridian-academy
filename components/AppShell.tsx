// FILE: components/AppShell.tsx

import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import ExtensionsPanel from './ExtensionsPanel'

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
        <MobileNav userEmail={userEmail} />
        <main className="flex-1 min-w-0 m-grid-bg">{children}</main>
      </div>
      <ExtensionsPanel />
    </div>
  )
}