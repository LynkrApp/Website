import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default async function middleware(req) {
  // Get the pathname of the request (e.g. /, /admin)
  const path = req.nextUrl.pathname;

  // A list of all protected pages
  const protectedPaths = [
    '/admin',
    '/admin/customize',
    '/admin/analytics',
    '/admin/settings',
  ];

  // If it's the root path, just render it
  if (path === '/') {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle protected paths that require authentication
  if (!session && protectedPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // Handle redirect for authenticated users who need to complete onboarding
  else if (session && !session.handle && protectedPaths.includes(path)) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }
  // Redirect authenticated users away from login/register pages
  else if (session && (path === '/login' || path === '/register')) {
    // Check if this is an account linking flow by looking at the URL parameters
    const url = req.nextUrl;
    if (
      url.searchParams.get('callbackUrl')?.includes('admin/settings') &&
      url.searchParams.get('callbackUrl')?.includes('tab=accounts')
    ) {
      // Allow account linking flows to proceed with their intended redirect
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  return NextResponse.next();
}
