import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_CONSTANTS } from '@/config/security';
import { createRateLimiter } from '@/lib/redis';
import securityMetrics from '@/lib/monitoring';

// Create a Map to store rate limit data in memory (for development)
const inMemoryStore = new Map();

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const path = request.nextUrl.pathname;

  // Skip rate limiting for non-API routes
  if (!path.startsWith('/api/')) {
    return NextResponse.next();
  }

  const limiter = await createRateLimiter({
    keyPrefix: `rate-limit:${ip}:${path}`,
    maxAttempts: SECURITY_CONSTANTS.RATE_LIMIT.MAX_ATTEMPTS,
    windowMs: SECURITY_CONSTANTS.RATE_LIMIT.WINDOW_MS,
  });

  try {
    const { success, remaining, reset } = await limiter.attempt();

    // Log rate limit check
    securityMetrics.logRateLimit(ip, path, remaining, success);

    if (!success) {
      return new NextResponse(JSON.stringify({
        error: 'Too many requests',
        message: `Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds`,
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(SECURITY_CONSTANTS.RATE_LIMIT.MAX_ATTEMPTS),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        },
      });
    }

    const response = NextResponse.next();
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', String(SECURITY_CONSTANTS.RATE_LIMIT.MAX_ATTEMPTS));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(reset));

    return response;
  } catch (error) {
    securityMetrics.logError('rate_limit', error as Error, { ip, path });
    // Fail open - allow request if rate limiting fails
    return NextResponse.next();
  }
} 