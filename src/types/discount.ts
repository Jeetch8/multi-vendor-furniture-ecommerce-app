import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TDiscountForDiscountTable = InferQueryModel<
  'discounts',
  {
    with: {
      category: true;
      product: true;
    };
  }
>;
