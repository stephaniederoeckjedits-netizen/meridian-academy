import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'
import LibraryClient from './LibraryClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EbooksPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const { data: books } = await supabase
    .from('library_books')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })

  const { data: progress } = await supabase
    .from('library_progress')
    .select('book_id, scroll_percentage, updated_at, is_bookmarked')
    .eq('user_id', user.id)

  const latestProgress = progress?.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )[0]

  const latestBook = books?.find(b => b.id === latestProgress?.book_id)
  const progressMap = new Map(progress?.map(p => [p.book_id, p.scroll_percentage]) || [])

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <LibraryClient 
        initialBooks={books || []} 
        progressMap={progressMap} 
        latestBook={latestBook}
        allProgress={progress || []}
      />
    </AppShell>
  )
}