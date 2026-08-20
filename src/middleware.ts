import { baseURL } from '@/utils/BaseURL';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('rizipt-admin-token')?.value || request.cookies.get('PharmacyAdmin')?.value;
    const { pathname } = request.nextUrl;

    // Handle API proxies securely
    if (pathname.startsWith('/api/v1')) {
        const requestHeaders = new Headers(request.headers);
        if (token && !requestHeaders.has('Authorization')) {
            requestHeaders.set('Authorization', `Bearer ${token}`);
        }

        const targetUrl = `${baseURL}${pathname}${request.nextUrl.search}`;
        return NextResponse.rewrite(targetUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Skip static assets, images, next internal files
    const isPublicFile = pathname.match(/\.(.*)$/) || pathname.startsWith('/_next') || pathname.startsWith('/api');
    if (isPublicFile) {
        return NextResponse.next();
    }

    const isAuthRoute = pathname.startsWith('/auth');

    // 1. If NO token and user tries to access protected pages (Dashboard/etc), redirect directly to /auth/login
    if (!token && !isAuthRoute) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If token exists and user tries to access auth pages (/auth/login, etc), redirect directly to /
    if (token && isAuthRoute) {
        const dashboardUrl = new URL('/', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
