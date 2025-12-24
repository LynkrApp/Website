import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin)
  const path = req.nextUrl.pathname;

  // A list of all protected pages
  const protectedPaths = [
    '/admin',
    '/admin/customize',
    '/admin/analytics',
    '/admin/settings',
    '/staff/user',
  ];

  // If it's the root path, just render it
  if (path === '/') {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if user is banned
  if (session?.isBanned) {
    // Allow signout
    if (path.includes('/api/auth/signout')) {
      return NextResponse.next();
    }
    // Prevent redirect loop if already on login page with error
    if (path === '/login' && req.nextUrl.searchParams.get('error') === 'AccountBanned') {
       return NextResponse.next(); // Don't redirect again, and stop execution so we don't hit the 'authenticated user' redirect below? 
       // WAIT. If I return next(), does it execute lines below in THIS function? 
       // No, 'return' exits the function. So it skips lines 35-46. Perfect.
    }
    
    return NextResponse.redirect(new URL('/login?error=AccountBanned', req.url));
  }

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
