import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  
  // Check if the path is a public route or starts with a public path like /api
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`)
  );

  const isApiRoute = pathname.startsWith('/api/');
  const isStaticAsset = pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/i);
  
  // Allow access to public routes, API routes, and static assets
  if (isPublicRoute || isApiRoute || isStaticAsset) {
    return NextResponse.next();
  }
  
  // Redirect to login if the user is not authenticated
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/auth/login', request.url);
    // Add a redirect parameter so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If a user is logged in and tries to access auth pages, redirect to dashboard
  if (token && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Specify which paths this middleware should run on
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
