import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { uploadLimitMiddleware } from './middleware/uploadLimit';
import { cacheMiddleware } from './middleware/cache';
import { securityHeaders } from './lib/security';

export async function middleware(request: NextRequest) {
  try {
    // Apply rate limiting for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const rateLimitResponse = await rateLimitMiddleware(request);
      if (rateLimitResponse.status !== 200) {
        return rateLimitResponse;
      }
    }

    // Apply upload size limits for file uploads
    const uploadLimitResponse = await uploadLimitMiddleware(request);
    if (uploadLimitResponse.status !== 200) {
      return uploadLimitResponse;
    }

    // Apply caching for specific routes
    if (request.nextUrl.pathname.startsWith('/api/permissions')) {
      return await cacheMiddleware(request, 'permissions');
    }
    if (request.nextUrl.pathname.startsWith('/api/secure-data')) {
      return await cacheMiddleware(request, 'decryptedData');
    }

    // Continue with the request
    const response = NextResponse.next();

    // Apply security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Fail open in case of errors
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 