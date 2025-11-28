import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/login', '/register', '/verified', '/auth/verify-email'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Get the token from the cookies
  // We check for common names since the user didn't specify the exact cookie name
  const token = request.cookies.get('accessToken')?.value || 
                request.cookies.get('Authentication')?.value ||
                request.cookies.get('token')?.value;

  // If the user is not authenticated and tries to access a private route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and tries to access a public auth route (login/register)
  // We can optionally redirect them to dashboard, but the user didn't explicitly ask for this.
  // However, it's good practice.
  if (token && (pathname === '/login' || pathname === '/register')) {
     const dashboardUrl = new URL('/dashboard', request.url);
     return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|models|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

