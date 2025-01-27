import { TUserRole } from './lib/schema';

type RoleBasedRoutes = {
  [K in TUserRole]: string[];
};

export const publicRoutes = [
  '/',
  '/new-verification',
  '/all-categories',
  '/products',
  '/cart',
  '/favorites',
];
export const publicPrefixes = ['/c', '/p'];

export const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
  '/auth/new-verification',
];

export const apiAuthPrefix = '/api/auth';

export const apiProductsRoute = '/api/stores';

export const apiCategoriesRoute = '/api/categories';

export const apiStripeRoute = '/api/create-payment-intent';

export const apiSearch = '/api/s';

export const DEFAULT_LOGIN_REDIRECT = '/account';

export const roleBasedRoutes: RoleBasedRoutes = {
  ADMIN: ['/dashboard', '/account'],
  USER: ['/account'],
  STORE_OWNER: ['/store', '/account'],
};
