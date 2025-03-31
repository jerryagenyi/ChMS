import { randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

const TOKEN_SECRET = process.env.NEXTAUTH_SECRET!;
const TOKEN_EXPIRY = '24h';

export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

export function generatePasswordResetToken(userId: string): string {
  return sign({ userId, type: 'password_reset' }, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRY
  });
}

export function verifyPasswordResetToken(token: string): string | null {
  try {
    const decoded = verify(token, TOKEN_SECRET) as {
      userId: string;
      type: string;
    };
    
    if (decoded.type !== 'password_reset') {
      return null;
    }
    
    return decoded.userId;
  } catch {
    return null;
  }
}

export function generateEmailVerificationToken(userId: string): string {
  return sign({ userId, type: 'email_verification' }, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRY
  });
}

export function verifyEmailVerificationToken(token: string): string | null {
  try {
    const decoded = verify(token, TOKEN_SECRET) as {
      userId: string;
      type: string;
    };
    
    if (decoded.type !== 'email_verification') {
      return null;
    }
    
    return decoded.userId;
  } catch {
    return null;
  }
}
