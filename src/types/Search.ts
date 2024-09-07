import { TCategory, TProduct, TStore } from '@/lib/schema';

export type TSearchResults = {
  products: TProduct[];
  categories: TCategory[];
  stores: TStore[];
};
