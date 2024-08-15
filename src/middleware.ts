import NextAuth from 'next-auth';
import authConfig from './config/auth.config';

const { auth } = NextAuth(authConfig);

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
