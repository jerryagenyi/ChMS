import { randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { SECURITY_CONSTANTS, SECURITY_MESSAGES } from '@/config/security';

// Validate environment variables
const TOKEN_SECRET = process.env.NEXTAUTH_SECRET;
if (!TOKEN_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set');
}

export function generateVerificationToken(): string {
  return randomBytes(SECURITY_CONSTANTS.VERIFICATION_TOKEN_BYTES).toString('hex');
}

export function generatePasswordResetToken(userId: string): string {
  return sign({ userId, type: 'password_reset' }, TOKEN_SECRET, {
    expiresIn: SECURITY_CONSTANTS.TOKEN_EXPIRY
  });
}

export function verifyPasswordResetToken(token: string): string | null {
  try {
    const decoded = verify(token, TOKEN_SECRET) as {
      userId: string;
      type: string;
      exp?: number;
    };
    
    if (decoded.type !== 'password_reset') {
      return null;
    }

    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error(SECURITY_MESSAGES.INVALID_TOKEN);
    }
    
    return decoded.userId;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Token verification failed:', error.message);
    }
    return null;
  }
}

export function generateEmailVerificationToken(userId: string): string {
  return sign({ userId, type: 'email_verification' }, TOKEN_SECRET, {
    expiresIn: SECURITY_CONSTANTS.TOKEN_EXPIRY
  });
}

export function verifyEmailVerificationToken(token: string): string | null {
  try {
    const decoded = verify(token, TOKEN_SECRET) as {
      userId: string;
      type: string;
      exp?: number;
    };
    
    if (decoded.type !== 'email_verification') {
      return null;
    }

    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error(SECURITY_MESSAGES.INVALID_TOKEN);
    }
    
    return decoded.userId;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Token verification failed:', error.message);
    }
    return null;
  }
}
