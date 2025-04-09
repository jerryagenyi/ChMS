# Security Middleware Documentation

## Overview

This document outlines the security middleware implementation in the ChMS application. Our security middleware provides three main features:

1. Rate Limiting
2. Upload Size Limits
3. Response Caching

Each feature includes comprehensive monitoring and logging.

## Monitoring & Logging

### Logging Infrastructure

We use a multi-layered logging approach:

1. **Winston Logger**

   - Structured JSON logging
   - File-based transport for security events
   - Separate error log file
   - Console output in development

2. **Pino Logger**

   - High-performance structured logging
   - Used for general application events
   - Timestamp-based logging

3. **Sentry Integration**
   - Error tracking and monitoring
   - Exception capturing with context
   - Performance monitoring

### Security Metrics

Each security feature reports the following metrics:

1. **Rate Limiting**

```typescript
{
  type: 'rate_limit',
  status: 'success' | 'failure',
  ip: string,
  path: string,
  remaining: number
}
```

2. **Upload Size**

```typescript
{
  type: 'upload_size',
  status: 'success' | 'failure',
  path: string,
  size: number
}
```

3. **Cache Operations**

```typescript
{
  type: 'cache',
  status: 'hit' | 'miss',
  path: string
}
```

### Performance Monitoring

```typescript
const end = performanceMonitor.start('operation-name');
// ... operation code ...
const duration = end(); // Records duration automatically
```

## Rate Limiting

### Configuration

Rate limiting is configured in `src/config/security.ts`:

```typescript
RATE_LIMIT: {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 5 * 60 * 1000, // 5 minutes
}
```

### Implementation

- Uses Redis for distributed rate limiting
- Tracks requests by IP address and path
- Applies to all API routes (`/api/*`)
- Includes rate limit headers in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- Comprehensive error logging and monitoring

### Fail-Open Behavior

If Redis is unavailable, the middleware will:

1. Log the error with full context
2. Track the failure in monitoring
3. Allow the request to proceed
4. Include monitoring metrics

## Upload Size Limits

### Configuration

File size limits are configured in `src/config/security.ts`:

```typescript
MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
```

### Implementation

- Checks `content-length` header for multipart form data
- Applies to POST and PUT requests only
- Returns 413 (Payload Too Large) for oversized files
- Includes detailed error messages
- Logs all upload attempts with size information

## Caching

### Configuration

Cache durations are configured in `src/config/security.ts`:

```typescript
CACHE: {
  PERMISSIONS_TTL: 60, // 1 minute
  DECRYPTED_DATA_TTL: 30, // 30 seconds
}
```

### Implementation

- Uses Redis for distributed caching
- Applies to specific routes:
  - `/api/permissions/*`
  - `/api/secure-data/*`
- Includes cache headers:
  - `X-Cache: HIT/MISS`
- Monitors cache hit rates and performance

## Error Handling

All middleware components follow a fail-open strategy with comprehensive error tracking:

1. Log the error with full context
2. Track in Sentry for monitoring
3. Include performance metrics
4. Allow the request to proceed
5. Include monitoring data

## Development Setup

1. Install Redis:

   ```bash
   # macOS
   brew install redis
   brew services start redis

   # Ubuntu
   sudo apt-get install redis-server
   sudo systemctl start redis
   ```

2. Configure environment variables:
   ```env
   REDIS_URL=redis://localhost:6379
   SENTRY_DSN=your-sentry-dsn
   LOG_LEVEL=debug
   ```

## Production Monitoring

1. **Metrics to Monitor**:

   - Rate limit violations per IP/path
   - Upload size violations
   - Cache hit rates
   - Response times
   - Error rates

2. **Alert Conditions**:

   - High rate of 429 responses
   - Increased error rates
   - Cache miss spikes
   - Redis connection issues

3. **Dashboard Metrics**:
   - Request volume by path
   - Rate limit usage
   - Cache hit ratios
   - Error distribution
   - Performance metrics

## Troubleshooting

Common issues and solutions:

1. Rate limiting not working:

   - Check Redis connection
   - Verify IP address detection
   - Check rate limit configuration
   - Review monitoring logs

2. File uploads failing:

   - Verify content-type header
   - Check file size calculation
   - Review nginx/proxy configuration
   - Check error logs

3. Caching issues:

   - Check Redis connection
   - Verify cache key generation
   - Review TTL settings
   - Monitor cache hit rates

4. Monitoring issues:
   - Verify log file permissions
   - Check Sentry configuration
   - Review log levels
   - Ensure disk space for logs

## Testing Requirements

### Middleware Tests

```typescript
describe('Security Middleware', () => {
  it('applies security headers', async () => {
    const response = await fetch('/api/test');
    expect(response.headers.get('Content-Security-Policy')).toBeDefined();
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('enforces rate limiting', async () => {
    // Make multiple requests
    const responses = await Promise.all(
      Array(101)
        .fill(null)
        .map(() => fetch('/api/test'))
    );
    expect(responses[100].status).toBe(429);
  });

  it('validates authentication', async () => {
    const response = await fetch('/api/protected');
    expect(response.status).toBe(401);
  });
});
```

### Integration Tests

```typescript
describe('Middleware Integration', () => {
  it('integrates with authentication', async () => {
    const response = await fetch('/api/protected', {
      headers: { Authorization: 'Bearer invalid' },
    });
    expect(response.status).toBe(401);
  });

  it('integrates with error handling', async () => {
    const response = await fetch('/api/error');
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
```
