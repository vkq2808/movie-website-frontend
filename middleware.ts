import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real application, you would validate the JWT token here
    // For now, we'll let the client-side handle authentication
    // The AdminLayout component will redirect if not authenticated or not admin

    // You could also add server-side token validation here:
    // const token = request.cookies.get('auth_token');
    // if (!token || !validateToken(token)) {
    //   return NextResponse.redirect(new URL('/auth/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
