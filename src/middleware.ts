import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get('app_role')?.value;
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // Protect all auth routes if logged in
  if (sessionToken && roleCookie) {
    if (pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up') {
      switch (roleCookie) {
        case 'ADMIN': return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        case 'AKREDITASI': return NextResponse.redirect(new URL('/akreditasi/dashboard', request.url));
        case 'WD': return NextResponse.redirect(new URL('/wd1/dashboard', request.url));
        case 'MAHASISWA': return NextResponse.redirect(new URL('/dashboard', request.url));
        default: return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Prevent role-crossing
    if (pathname.startsWith('/admin') && roleCookie !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname.startsWith('/wd1') && roleCookie !== 'WD' && roleCookie !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname.startsWith('/akreditasi') && roleCookie !== 'AKREDITASI' && roleCookie !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname === '/dashboard' && roleCookie !== 'MAHASISWA') {
      // If Admin tries to access mahasiswa dashboard, maybe redirect to their own dashboard
      switch (roleCookie) {
        case 'ADMIN': return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        case 'AKREDITASI': return NextResponse.redirect(new URL('/akreditasi/dashboard', request.url));
        case 'WD': return NextResponse.redirect(new URL('/wd1/dashboard', request.url));
      }
    }
  }

  // If no session and trying to access protected routes, let layout.tsx or better-auth handle it
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
