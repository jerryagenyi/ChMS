import DOMPurify from 'dompurify';
import { SECURITY_HEADERS } from '@/config/security';

export const securityHeaders = SECURITY_HEADERS;

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

// Only import argon2 on the server side
const getArgon2 = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Password operations are only available on the server side');
  }
  return await import('@node-rs/argon2');
};

export const hashPassword = async (password: string): Promise<string> => {
  const argon2 = await getArgon2();
  return await argon2.hash(password, {
    algorithm: SECURITY_CONSTANTS.ARGON2.type,
    timeCost: SECURITY_CONSTANTS.ARGON2.timeCost,
    memoryCost: SECURITY_CONSTANTS.ARGON2.memoryCost,
    parallelism: SECURITY_CONSTANTS.ARGON2.parallelism
  });
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const argon2 = await getArgon2();
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};