import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/brand/dashboard',
  '/brand/quests/create',
  '/brand/quests/[id]/edit',
  '/brand/quests/[id]/submissions',
  '/brand/quests/[id]/analytics',
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/quests',
  '/quests/[id]',
  '/terms',
  '/privacy',
  '/brand', // Landing page for brands
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
   // Try to get auth token from cookies - check both possible cookie names
  const authToken = request.cookies.get('token')?.value || 
                   request.cookies.get('auth_token')?.value || 
                   request.headers.get('x-auth-token')
  
  // Debug logging - commented out for production
  // console.log(`🔍 Middleware Debug for ${pathname}:`)
  // console.log('📋 All cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`))
  // console.log('🔑 Auth token found:', authToken ? `${authToken.substring(0, 20)}...` : 'NONE')
  
  // Determine token source for debugging
  let tokenSource = 'NONE'
  if (request.cookies.get('token')?.value) {
    tokenSource = 'Cookie (token)'
  } else if (request.cookies.get('auth_token')?.value) {
    tokenSource = 'Cookie (auth_token)'
  } else if (request.headers.get('x-auth-token')) {
    tokenSource = 'Header'
  }
  // console.log('🔧 Token source:', tokenSource)

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    // Handle dynamic routes
    const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
    const regex = new RegExp(`^${routePattern}$`)
    return regex.test(pathname)
  })

  // console.log(`🛡️ Route ${pathname} is protected:`, isProtectedRoute)

  // If it's a protected route and no auth token, redirect to home
  if (isProtectedRoute && !authToken) {
    // console.log(`🚫 Middleware: Blocking access to ${pathname} - No auth token`)
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('redirect', pathname) // Remember where they wanted to go
    return NextResponse.redirect(url)
  }

  // If authenticated user tries to access home, redirect to their dashboard
  if (pathname === '/' && authToken) {
    // console.log(`🏠 Middleware: Redirecting authenticated user from home to dashboard`)
    // You could determine user type from token and redirect accordingly
    // For now, redirect to creator dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 