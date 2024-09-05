'use server';

import { createId } from '@paralleldrive/cuid2';
import { db } from '@/lib/db';
import { fetchCartByUser } from '@/lib/services/cart';
import { TCoupon } from '@/lib/schema';
import { calculatePriceWithDiscounts } from '@/utils/helpers';
import { auth } from '@/lib/auth';
import * as schema from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { TCartWithDetails } from '@/types/Cart';

type ValidCouponsType = {
  categoryCoupons: TCoupon[] | [];
  productCoupon: TCoupon | null;
};

type SelectedAttribute = {
  attName: string;
  val: string;
};

type FormStateType = {
  error?: { message?: { [key: string]: string[] } };
  success?: { message?: string };
};

type createOrderProps = {
  formState: FormStateType;
  orderDetails: {
    selectedAddressId: string;
    selectedCarriers: {
      [storeId: string]: string;
    };
    totalPrice: number;
    validCoupons: ValidCouponsType[] | null;
  };
};

const createOrder = async ({ orderDetails, formState }: createOrderProps) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return {
      error: { message: { auth: ['You must be signed in to do this.'] } },
    };
  }

  const cart = await fetchCartByUser(user.id as string);

  if (!cart) {
    return { error: { message: { cart: ['Cart not found.'] } } };
  }

  const order_no = createId();

  let coupons;
  if (orderDetails.validCoupons) {
    coupons = orderDetails.validCoupons.flatMap((c) =>
      c.categoryCoupons.map((c) => c.id)
    );

    if (orderDetails.validCoupons[0].productCoupon) {
      coupons.push(orderDetails.validCoupons[0].productCoupon.id);
    }
  }

  let order;
  try {
    order = await db
      .insert(schema.orders)
      .values({
        orderNo: order_no,
        totalPrice: orderDetails.totalPrice,
        userId: user.id,
        couponId: coupons?.[0] || null,
      })
      .returning();

    const itemsByStore: { [key: string]: TCartWithDetails['cartItems'] } = {};
    cart.cartItems.forEach((item) => {
      const storeId = item.product.store.id;
      if (!itemsByStore[storeId]) {
        itemsByStore[storeId] = [];
      }
      itemsByStore[storeId].push(item);
    });

    for (const [storeId, items] of Object.entries(itemsByStore)) {
      const orderStore = await db
        .insert(schema.ordersToStore)
        .values({
          orderId: order[0].id,
          storeId: storeId,
          shippingAddressId: orderDetails.selectedAddressId,
        })
        .returning();

      for (const item of items) {
        const { finalPrice } = calculatePriceWithDiscounts(item.product);
        await db.insert(schema.orderItems).values({
          orderId: order[0].id,
          ordersToStoreId: orderStore[0].id,
          productId: item.productId,
          quantity: item.quantity,
          price: finalPrice,
          selectedAttributes: item.selectedAttributes,
        });

        await db
          .update(schema.products)
          .set({
            stock: sql<number>`${schema.products.stock} - ${item.quantity}`,
          })
          .where(eq(schema.products.id, item.productId));
      }

      await db.insert(schema.shipments).values({
        orderToStoreId: orderStore[0].id,
        status: 'PENDING',
      });
    }

    return { orderNo: order[0].orderNo, cartId: cart.id };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: {
          message: { _form: [err.message] },
        },
      };
    } else {
      return {
        error: {
          message: { _form: ['Something went wrong.'] },
        },
      };
    }
  }
};

export default createOrder;
