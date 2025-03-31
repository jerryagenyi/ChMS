import rateLimit from 'express-rate-limit';

interface RateLimitResponse {
  success: boolean;
  error?: Error;
}

// Create a limiter instance
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Wrapper for Next.js API routes
export const rateLimiter = {  // Changed from rateLimit to rateLimiter
  check: async (req: Request): Promise<RateLimitResponse> => {
    return new Promise((resolve) => {
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      
      const mockReq = {
        ip,
        headers: Object.fromEntries(req.headers.entries()),
      };
      
      const mockRes = {
        setHeader: () => {},
        status: () => ({ send: () => {} }),
      };

      limiter(mockReq as any, mockRes as any, (result: any) => {
        if (result instanceof Error) {
          resolve({ success: false, error: result });
        } else {
          resolve({ success: true });
        }
      });
    });
  }
};
