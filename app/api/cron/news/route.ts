import { NextResponse } from 'next/server'
import { fetchAndStoreNews } from '@/lib/news/fetcher'

export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ─── DIAGNOSTIC SNAPSHOT ───
  const env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) || null,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    keyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 12) || null,
    hasCronSecret: !!process.env.CRON_SECRET,
  }

  // ─── DB CHECK ───
  let tableExists = false
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error: dbError } = await sb.from('daily_news').select('id').limit(1)
    tableExists = !dbError
    if (dbError) {
      return NextResponse.json({ success: false, stage: 'db_check', env, dbError: dbError.message, dbCode: dbError.code }, { status: 500 })
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, stage: 'db_connect', env, error: e.message }, { status: 500 })
  }

  // ─── FETCH ───
  try {
    const result = await fetchAndStoreNews()
    return NextResponse.json({ success: true, ...result, env, tableExists })
  } catch (error: any) {
    return NextResponse.json({ success: false, stage: 'fetch', env, tableExists, error: error.message, stack: error.stack?.slice(0, 300) }, { status: 500 })
  }
}