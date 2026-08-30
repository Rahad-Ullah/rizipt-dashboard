import { baseURL } from '@/utils/BaseURL';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function checkIsTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        if (decoded && typeof decoded.exp === 'number') {
            return decoded.exp * 1000 <= Date.now();
        }
        return false;
    } catch {
        return true;
    }
}

export function middleware(request: NextRequest) {
    const rawToken = request.cookies.get('rizipt-admin-token')?.value || request.cookies.get('PharmacyAdmin')?.value;
    const { pathname } = request.nextUrl;

    const isExpired = rawToken ? checkIsTokenExpired(rawToken) : true;
    const token = isExpired ? null : rawToken;

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

    // 1. If NO valid token and user tries to access protected pages (Dashboard/etc), redirect directly to /auth/login
    if (!token && !isAuthRoute) {
        const loginUrl = new URL('/auth/login', request.url);
        if (rawToken && isExpired) {
            loginUrl.searchParams.set('reason', 'expired');
        }
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('rizipt-admin-token');
        response.cookies.delete('PharmacyAdmin');
        return response;
    }

    // 2. If valid token exists and user tries to access auth pages (/auth/login, etc), redirect directly to /
    if (token && isAuthRoute) {
        const dashboardUrl = new URL('/', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // 3. If rawToken exists but is expired while accessing auth route, clear cookies
    if (rawToken && isExpired && isAuthRoute) {
        const response = NextResponse.next();
        response.cookies.delete('rizipt-admin-token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
