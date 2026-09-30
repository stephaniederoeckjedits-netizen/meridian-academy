// FILE: app/profile/page.tsx  (URL: /profile)

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
        <div className="m-label m-label-cyan mb-3">Profile</div>
        <h1 className="text-3xl font-bold tracking-tight mb-10">
          Your account
        </h1>

        <ProfileClient
          email={user.email || ''}
          fullName={profile?.full_name || ''}
          username={profile?.username || ''}
        />
      </div>
    </AppShell>
  )
}