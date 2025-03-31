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
  // Session Management
  SESSION_MAX_AGE: 2 * 60 * 60, // 2 hours in seconds
  
  // Password Hashing (Argon2id)
  ARGON2: {
    timeCost: 2,
    memoryCost: 65536, // 64MB
    parallelism: 1,
    type: 'argon2id'
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  },
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  
  // Cache Duration
  CACHE: {
    PERMISSIONS_TTL: 60, // 1 minute
    DECRYPTED_DATA_TTL: 30, // 30 seconds
  },
  
  // reCAPTCHA
  RECAPTCHA: {
    SCORE_THRESHOLD: 0.7, // Increased from 0.5 for better security
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
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; frame-src 'self' https://www.google.com/recaptcha/; style-src 'self' 'unsafe-inline';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Expect-CT': 'max-age=86400, enforce',
  'X-XSS-Protection': '1; mode=block'
} as const; 