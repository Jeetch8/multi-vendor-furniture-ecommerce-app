'use server';

import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import * as schema from '@/lib/schema';

const deleteOrder = (orderNo: string) => {
  try {
    db.delete(schema.orders).where(eq(schema.orders.orderNo, orderNo));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          message: [err.message],
        },
      };
    } else {
      return {
        error: {
          message: ['Something went wrong.'],
        },
      };
    }
  }
};

export default deleteOrder;
