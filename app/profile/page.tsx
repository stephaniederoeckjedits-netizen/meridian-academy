// FILE: app/profile/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, created_at')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-3xl mx-auto">
        {/* header */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#22d3ee] mb-2">
            <span className="w-1 h-1 rounded-full bg-[#22d3ee] animate-pulse" />
            PROFILE
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] text-[#e5e9f0]">
            OPERATOR
          </h1>
          <p className="text-sm mt-2 text-[#8892a6]">
            Your account and identity inside Meridian Academy.
          </p>
        </div>

        <ProfileClient
          email={user?.email ?? ''}
          username={profile?.username ?? ''}
          fullName={profile?.full_name ?? ''}
          role={profile?.role ?? 'member'}
          joinedAt={profile?.created_at ?? ''}
        />
      </div>
    </AppShell>
  )
}