import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import DiscoverFeed from '@/components/discover/DiscoverFeed'

export const dynamic = 'force-dynamic'

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: videos } = await supabase
    .from('discover_videos')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <AppShell userEmail={user?.email ?? undefined} variant="dashboard">
      <DiscoverFeed initialVideos={videos || []} />
    </AppShell>
  )
}