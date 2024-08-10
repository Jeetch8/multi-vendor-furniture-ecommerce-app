import type { TStore } from '@/lib/schema';
import NextAuth, { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { authOptions } from '@/config/auth.config';

type ExtendedUser = DefaultSession['user'] & {
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
  store?: TStore | null;
  isTwoFactorEnabled?: boolean;
  userId: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'USER' | 'STORE_OWNER';
    store?: TStore | null;
    isTwoFactorEnabled?: boolean;
    userId: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
