import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/security";
import { SECURITY_CONSTANTS, SECURITY_MESSAGES } from "@/config/security";

// Validate environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials are not properly configured');
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: SECURITY_CONSTANTS.SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(SECURITY_MESSAGES.INVALID_CREDENTIALS);
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error(SECURITY_MESSAGES.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error(SECURITY_MESSAGES.INVALID_CREDENTIALS);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 
