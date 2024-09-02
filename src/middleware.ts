import NextAuth from 'next-auth';
import authConfig from './config/auth.config';
import { TUserRole } from './lib/schema';
import {
  apiAuthPrefix,
  apiCategoriesRoute,
  apiProductsRoute,
  publicRoutes,
  publicPrefixes,
  authRoutes,
  roleBasedRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req): any => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as TUserRole;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiCategoriesRoute = nextUrl.pathname.startsWith(apiCategoriesRoute);
  const isApiProductRoute = nextUrl.pathname.startsWith(apiProductsRoute);

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isPublicPrefix = publicPrefixes.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isRouteAllowedForRole = userRole
    ? roleBasedRoutes[userRole].some((route) =>
        nextUrl.pathname.startsWith(route)
      )
    : null;

  const isRoleBasedRoute = Object.values(roleBasedRoutes).some((roleRoutes) =>
    roleRoutes.some((route) => nextUrl.pathname.startsWith(route))
  );

  const isRouteExists =
    isApiAuthRoute ||
    isApiCategoriesRoute ||
    isApiProductRoute ||
    isPublicRoute ||
    isPublicPrefix ||
    isAuthRoute ||
    isRoleBasedRoute;

  if (!isRouteExists) {
    return null;
  }

  if (isApiAuthRoute || isApiProductRoute || isApiCategoriesRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (isPublicRoute || isPublicPrefix) {
    return null;
  }

  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isLoggedIn && userRole) {
    if (!isRouteAllowedForRole) {
      return Response.redirect(new URL('/signin', nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
