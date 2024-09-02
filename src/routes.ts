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
  '/signin',
  '/signup',
  '/error',
  '/reset',
  '/new-password',
  'new-verification',
];

export const apiAuthPrefix = '/api/auth';

export const apiProductsRoute = '/api/stores';

export const apiCategoriesRoute = '/api/categories';

export const DEFAULT_LOGIN_REDIRECT = '/account';

export const roleBasedRoutes: RoleBasedRoutes = {
  ADMIN: ['/dashboard', '/account'],
  USER: ['/account'],
  STORE_OWNER: ['/store', '/account'],
};
