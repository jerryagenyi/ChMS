import { z } from 'zod';

// Environment variable validation schema
export const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RECAPTCHA_SECRET_KEY: z.string(),
  DATABASE_URL: z.string().url(),
});

// Validate environment variables
export function validateEnv() {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}

// Security Constants
export const SECURITY_CONSTANTS = {
  PASSWORD_HASH_ROUNDS: 12,
  VERIFICATION_TOKEN_BYTES: 32,
  SESSION_MAX_AGE: 24 * 60 * 60, // 24 hours in seconds
  TOKEN_EXPIRY: '24h',
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  RECAPTCHA: {
    SCORE_THRESHOLD: 0.5,
  },
} as const;

// Error Messages
export const SECURITY_MESSAGES = {
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  RATE_LIMITED: 'Too many requests, please try again later',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_LOCKED: 'Account temporarily locked',
} as const;

// Security Headers
export const SECURITY_HEADERS = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const; 