import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/transactions') ||
                           pathname.startsWith('/budgets') ||
                           pathname.startsWith('/goals') ||
                           pathname.startsWith('/analytics');

  if (isAuthRoute || isDashboardRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

