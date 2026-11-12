// FILE: proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths — never intercept
  const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password', '/reset-password']
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next({ request })
  }

  // Skip prefetches
  const isPrefetch =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch'
  if (isPrefetch) return NextResponse.next({ request })

  // Skip if no auth cookie
  const hasAuthCookie = request.cookies
    .getAll()
    .some(c => c.name.startsWith('sb-') && c.name.includes('auth-token'))
  if (!hasAuthCookie) return NextResponse.next({ request })

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  // CRITICAL: exclude all files with extensions (.png .jpg .css .js .svg etc)
  // Next.js 16 proxy intercepts EVERYTHING by default — including your images.
  // The `.*\\..*` pattern means "any path containing a dot" — that's how we
  // skip every static asset (images, fonts, css, js chunks).
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}