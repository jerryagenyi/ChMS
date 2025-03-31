import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { rateLimitMiddleware } from '../rateLimit';
import { uploadLimitMiddleware } from '../uploadLimit';
import { cacheMiddleware } from '../cache';
import { SECURITY_CONSTANTS } from '@/config/security';
import redis from '@/lib/redis';

// Mock Redis client
vi.mock('@/lib/redis', () => ({
  default: {
    multi: vi.fn(),
    incr: vi.fn(),
    pttl: vi.fn(),
    pexpire: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe('Security Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const request = new NextRequest('http://localhost/api/test');
      const multi = {
        incr: vi.fn(),
        pttl: vi.fn(),
        exec: vi.fn().mockResolvedValue([[null, 1], [null, 30000]]),
      };

      vi.mocked(redis.multi).mockReturnValue(multi as any);

      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Remaining')).toBe(
        String(SECURITY_CONSTANTS.RATE_LIMIT.MAX_ATTEMPTS - 1)
      );
    });

    it('should block requests exceeding rate limit', async () => {
      const request = new NextRequest('http://localhost/api/test');
      const multi = {
        incr: vi.fn(),
        pttl: vi.fn(),
        exec: vi.fn().mockResolvedValue([[null, 6], [null, 30000]]),
      };

      vi.mocked(redis.multi).mockReturnValue(multi as any);

      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(429);
      expect(await response.json()).toMatchObject({
        error: 'Too many requests',
      });
    });
  });

  describe('Upload Size Limits', () => {
    it('should allow files within size limit', async () => {
      const headers = new Headers({
        'content-type': 'multipart/form-data',
        'content-length': '1000000', // 1MB
      });
      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        headers,
      });

      const response = await uploadLimitMiddleware(request);
      expect(response.status).toBe(200);
    });

    it('should block oversized files', async () => {
      const headers = new Headers({
        'content-type': 'multipart/form-data',
        'content-length': String(SECURITY_CONSTANTS.MAX_FILE_SIZE + 1),
      });
      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        headers,
      });

      const response = await uploadLimitMiddleware(request);
      expect(response.status).toBe(413);
      expect(await response.json()).toMatchObject({
        error: 'File too large',
      });
    });
  });

  describe('Caching', () => {
    it('should return cached data when available', async () => {
      const request = new NextRequest('http://localhost/api/permissions');
      const cachedData = JSON.stringify({ permissions: ['READ', 'WRITE'] });

      vi.mocked(redis.get).mockResolvedValue(cachedData);

      const response = await cacheMiddleware(request, 'permissions');
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Cache')).toBe('HIT');
      expect(await response.json()).toEqual(JSON.parse(cachedData));
    });

    it('should cache new data when not in cache', async () => {
      const request = new NextRequest('http://localhost/api/permissions');

      vi.mocked(redis.get).mockResolvedValue(null);
      vi.mocked(redis.set).mockResolvedValue('OK');

      const response = await cacheMiddleware(request, 'permissions');
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Cache')).toBe('MISS');
    });
  });
}); 