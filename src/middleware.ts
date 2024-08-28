// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Allow if the user is accessing the login or sign-up pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url)); // Redirect to home if not admin
    }
  }

  // Allow access for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/protected/:path*'], // Define routes where middleware should be applied
};
