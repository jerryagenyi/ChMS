import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { logger } from "@/lib/logger";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          logger.error('Sign in failed: No email provided', { user, account });
          return false;
        }

        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create them
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || '',
              image: user.image || '',
              organizationId: process.env.DEFAULT_ORGANIZATION_ID!,
              role: 'USER', // Add default role
            },
          });
          logger.info('New user created', { userId: dbUser.id, email: dbUser.email });
        }

        return true;
      } catch (error) {
        logger.error('Sign in callback failed', error, { user, account });
        return false;
      }
    },
    async session({ session, user }) {
      try {
        if (session.user) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              organizationId: true,
              role: true,
              email: true,
              name: true,
              image: true,
            },
          });

          if (!dbUser) {
            throw new Error('User not found in database');
          }

          session.user = {
            ...session.user,
            id: dbUser.id,
            organizationId: dbUser.organizationId,
            role: dbUser.role,
          };
        }
        return session;
      } catch (error) {
        logger.error('Session callback failed', error, { userId: user.id });
        return session;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.organizationId = user.organizationId;
        }
        return token;
      } catch (error) {
        logger.error('JWT callback failed', error, { userId: user?.id });
        return token;
      }
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      logger.info('Sign in successful', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
    async error(error) {
      logger.error('Auth error occurred', error);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
