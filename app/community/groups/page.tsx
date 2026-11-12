import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import GroupsClient from './GroupsClient'
import BackLink from '@/components/ui/BackLink'

export const revalidate = 0

export default async function GroupsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()
  const { data } = await supabase.from('groups').select('*').order('created_at', { ascending: false })
  return (
    <AppShell userEmail={user.email ?? undefined}>
      <div className="max-w-4xl mx-auto">
        <BackLink href="/community" label="Back to Community" accent="#8b5cf6" />
        <GroupsClient groups={data || []} userId={user.id} />
      </div>
    </AppShell>
  )
}