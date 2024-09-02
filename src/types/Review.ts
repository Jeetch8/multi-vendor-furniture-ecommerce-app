import { InferQueryModel } from '@/utils/QueryTypesBuilder';

export type TReviewForAccount = InferQueryModel<
  'reviews',
  {
    with: {
      user: true;
      product: true;
    };
  }
>;
