import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TCategoryForSidebar = InferQueryModel<
  'categories',
  { with: { subCategories: true } }
>;

export type TCategoryWithSubCategories = InferQueryModel<
  'categories',
  { with: { subCategories: true } }
>;
