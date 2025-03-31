import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_CONSTANTS } from '@/config/security';
import redis from '@/lib/redis';
import securityMetrics from '@/lib/monitoring';

interface CacheOptions {
  ttl: number;
  keyPrefix: string;
}

const CACHE_CONFIGS = {
  permissions: {
    ttl: SECURITY_CONSTANTS.CACHE.PERMISSIONS_TTL * 1000,
    keyPrefix: 'cache:permissions',
  },
  decryptedData: {
    ttl: SECURITY_CONSTANTS.CACHE.DECRYPTED_DATA_TTL * 1000,
    keyPrefix: 'cache:decrypted',
  },
} as const;

export async function cacheMiddleware(
  request: NextRequest,
  type: keyof typeof CACHE_CONFIGS
) {
  const config = CACHE_CONFIGS[type];
  const path = request.nextUrl.pathname;
  const cacheKey = `${config.keyPrefix}:${path}`;

  try {
    // Try to get from cache first
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      // Log cache hit
      securityMetrics.logCache(path, true);

      return new NextResponse(cachedData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
      });
    }

    // Log cache miss
    securityMetrics.logCache(path, false);

    // If not in cache, proceed with request
    const response = await NextResponse.next();
    const data = await response.json();

    // Cache the response
    await redis.set(cacheKey, JSON.stringify(data), 'PX', config.ttl);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    securityMetrics.logError('cache', error as Error, { path, type });
    // Fail open - proceed without caching
    return NextResponse.next();
  }
} 