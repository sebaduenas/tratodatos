// lib/auth.ts
// TratoDatos - NextAuth Configuration

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
      subscriptionTier: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
      emailVerified: Date | null;
      companyName: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    subscriptionTier: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
    emailVerified: Date | null;
    companyName: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    subscriptionTier: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
    emailVerified: Date | null;
    companyName: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Credenciales inválidas');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error('Credenciales inválidas');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          emailVerified: user.emailVerified,
          companyName: user.companyName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
        token.emailVerified = user.emailVerified;
        token.companyName = user.companyName;
      }
      // Update token on session update (e.g., after email verification)
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            name: true,
            emailVerified: true,
            subscriptionTier: true,
            companyName: true,
          },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.emailVerified = dbUser.emailVerified;
          token.subscriptionTier = dbUser.subscriptionTier;
          token.companyName = dbUser.companyName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscriptionTier = token.subscriptionTier;
        session.user.emailVerified = token.emailVerified;
        session.user.companyName = token.companyName;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Log audit
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          resource: 'user',
          resourceId: user.id,
        },
      });
    },
  },
};
