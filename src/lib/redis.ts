import { Redis } from 'ioredis';
import { SECURITY_CONSTANTS } from '@/config/security';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface RateLimiterOptions {
  keyPrefix: string;
  maxAttempts: number;
  windowMs: number;
}

interface RateLimiterResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function createRateLimiter(options: RateLimiterOptions) {
  const { keyPrefix, maxAttempts, windowMs } = options;

  return {
    async attempt(): Promise<RateLimiterResult> {
      const now = Date.now();
      const key = `${keyPrefix}:${Math.floor(now / windowMs)}`;

      try {
        // Use Redis transaction to ensure atomicity
        const multi = redis.multi();
        multi.incr(key);
        multi.pttl(key);

        const [attempts, ttl] = await multi.exec() as [number, number][];
        const currentAttempts = attempts?.[1] || 0;

        // Set expiry on first attempt
        if (currentAttempts === 1) {
          await redis.pexpire(key, windowMs);
        }

        const remaining = Math.max(0, maxAttempts - currentAttempts);
        const reset = now + (ttl?.[1] || windowMs);

        return {
          success: currentAttempts <= maxAttempts,
          remaining,
          reset,
        };
      } catch (error) {
        console.error('Redis rate limiter error:', error);
        // Fail open
        return {
          success: true,
          remaining: maxAttempts,
          reset: now + windowMs,
        };
      }
    }
  };
}

// Graceful shutdown
process.on('SIGTERM', () => {
  redis.quit();
});

export default redis; 