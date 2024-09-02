import { TStore } from '@/lib/schema';

export type TUserForAccountSetings = {
  id?: string | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
  store?: TStore | null;
  isTwoFactorEnabled?: boolean | undefined;
};
