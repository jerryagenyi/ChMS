import { hash, verify } from '@node-rs/argon2';
import { SECURITY_CONSTANTS } from '@/config/security';

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