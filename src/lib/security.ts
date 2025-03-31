import { hash, compare } from 'bcryptjs';
import DOMPurify from 'dompurify';
import { SECURITY_CONSTANTS } from '@/config/security';

export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.example.com;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export const sanitizeInput = (data: any) => {
  // Recursively sanitize all string values
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object') {
      return typeof obj === 'string' ? DOMPurify.sanitize(obj) : obj;
    }
    
    return Object.keys(obj).reduce((acc, key) => ({
      ...acc,
      [key]: sanitize(obj[key])
    }), {});
  };

  return sanitize(data);
};

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, SECURITY_CONSTANTS.PASSWORD_HASH_ROUNDS);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword);
};