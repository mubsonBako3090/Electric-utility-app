import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/';
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value || '';
  
  // Verify token
  const payload = token ? verifyToken(token) : null;
  const isAuthenticated = !!payload;
  
  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // If authenticated user tries to access public paths, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPublicPath && !isAuthenticated) {
    // If not authenticated and trying to access protected path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based access control
  if (isAuthenticated && path.startsWith('/dashboard')) {
    const userRole = payload.role;
    const category = payload.customerCategory;
    
    // Redirect to specific dashboard based on role
    if (path === '/dashboard') {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else if (userRole === 'field-officer') {
        return NextResponse.redirect(new URL('/dashboard/field-officer', request.url));
      } else if (userRole === 'customer' && category) {
        return NextResponse.redirect(new URL(`/dashboard/customer/${category}`, request.url));
      }
    }
    
    // Prevent access to wrong dashboards
    if (userRole === 'admin' && !path.includes('/admin')) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
    if (userRole === 'field-officer' && !path.includes('/field-officer')) {
      return NextResponse.redirect(new URL('/dashboard/field-officer', request.url));
    }
    if (userRole === 'customer' && !path.includes(`/customer/${category}`)) {
      return NextResponse.redirect(new URL(`/dashboard/customer/${category}`, request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths to run middleware on
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/billing/:path*',
    '/outage/:path*',
    '/vacation/:path*',
    '/feeders/:path*',
    '/verification/:path*',
  ],
};
