import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Extending the NextAuth User type to include role
interface ExtendedUser extends NextAuthUser {
  id: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and Password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('No user found with the provided email');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Return only the necessary fields that match the ExtendedUser type
        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        } as ExtendedUser;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // Optional: Set JWT expiration
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.userId as string,
          email: token.email as string,
          role: token.role as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id as string;
        token.email = user.email as string;
        token.role = user.role as string;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
