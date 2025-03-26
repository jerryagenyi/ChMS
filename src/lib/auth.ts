import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from './prisma';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { logger } from './logger';
import { DatabaseError } from './errors';

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
      organisationId: null,
    },
  });
}

export async function validateSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);
  return session;
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || undefined,
                image: user.image || undefined,
                organisationId: process.env.DEFAULT_ORGANISATION_ID!,
              },
            });
          }
        } catch (error) {
          logger.error('Failed to handle user sign in', new DatabaseError('Failed to create user', error));
          return false;
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.organisationId = dbUser.organisationId;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

export { authOptions }; 
