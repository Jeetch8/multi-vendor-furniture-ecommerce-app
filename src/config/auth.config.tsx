import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { compare } from 'bcrypt';
import { generateFromEmail } from 'unique-username-generator';
import { db } from '@/lib/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getUserByEmail, createUser } from '@/lib/services/user';
import { createAccount } from '@/lib/services/account';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: 'dark',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile, tokens) {
        const user = await getUserByEmail(profile.email);
        return { ...profile, username: user?.username };
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      async profile(profile, tokens) {
        const user = await getUserByEmail(profile.email);
        return { ...profile, username: user?.username };
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // gets called when user signs in with credentials
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          const user = await getUserByEmail(credentials.email);
          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
            username: user?.username,
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'credentials') return true;
      const userEmail =
        typeof user.email === 'string' ? user.email : profile?.email;
      if (!userEmail) {
        return false;
      }
      const existingUser = await getUserByEmail(userEmail);
      if (!existingUser) {
        await db.transaction(async (tx) => {
          const newUser = await createUser(
            {
              email: userEmail,
              name: profile?.name || user?.name || '',
              image: profile?.image || user?.image,
              username: generateFromEmail(userEmail!),
              emailVerified: new Date(),
              password: '',
              role: 'USER',
              banner_img: profile?.image,
            },
            tx
          );
          await createAccount(
            {
              userId: newUser[0]?.id,
              refresh_token: account?.refresh_token,
              access_token: account?.access_token,
              token_type: account?.token_type,
              expires_at: account?.expires_at,
              scope: account?.scope,
              id_token: account?.id_token,
              provider: account?.provider || 'email',
              providerAccountId: account?.providerAccountId || userEmail,
            },
            tx
          );
        });
        return true;
      }
      return !!existingUser;
    },
    async redirect({ baseUrl, url }) {
      const callbackUrl = new URL(url).searchParams.get('callbackUrl');
      if (callbackUrl) {
        return callbackUrl;
      }
      if (url.startsWith('/auth/signin')) {
        return `${baseUrl}/`;
      }
      return baseUrl;
    },
    async jwt({ token, user, account, profile, session, trigger }) {
      if (user) {
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token, newSession, trigger, user }) {
      if (session.user) {
        const obj = {
          name: token.name,
          image: token.picture,
          email: token.email,
          id: token.sub,
          username: token.username,
          role: token.role,
        };
        session.user = obj;
      }
      return session;
    },
  },
};
