import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { DatabaseError } from '@/lib/errors';

interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export async function createUser(data: CreateUserData) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hash(data.password, 12);

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: Role.MEMBER,
      organizationId: null,
    },
  });
}

export async function validateSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  return session;
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  });

  if (!user) {
    throw new Error('Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null
    }
  });

  return user;
}

export async function enable2FA(userId: string, method: string = 'email') {
  return prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
      twoFactorMethod: method,
      backupCodes: generateBackupCodes() // Implement this helper
    }
  });
}

export async function verify2FACode(userId: string, code: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user?.twoFactorEnabled) {
    return true; // 2FA not required
  }

  // Implement verification logic based on method
  if (user.twoFactorMethod === 'email') {
    return verifyEmailCode(user, code);
  }

  return false;
}
