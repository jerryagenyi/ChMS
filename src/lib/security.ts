import { hash, verify } from '@node-rs/argon2';
import DOMPurify from 'dompurify';
import { SECURITY_CONSTANTS, SECURITY_HEADERS } from '@/config/security';

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

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, {
    algorithm: SECURITY_CONSTANTS.ARGON2.type,
    timeCost: SECURITY_CONSTANTS.ARGON2.timeCost,
    memoryCost: SECURITY_CONSTANTS.ARGON2.memoryCost,
    parallelism: SECURITY_CONSTANTS.ARGON2.parallelism
  });
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await verify(hashedPassword, password);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};