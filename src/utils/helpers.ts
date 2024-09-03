import { TReview } from '@/lib/schema';
import { TProductWithDiscounts } from '@/types/Product';
import { format } from 'date-fns';

export function getUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.priashop.com/';
  } else {
    return 'http://localhost:3000';
  }
}

export function calculatePriceWithDiscounts(
  product: TProductWithDiscounts,
  quantity: number = 1
) {
  let finalPrice = product.price;
  const oldPrice = product.price;
  let discountPercentage = 0;

  if (
    product.discount &&
    product.discount.active &&
    new Date(product.discount.startDate) <= new Date() &&
    (!product.discount.endDate ||
      new Date(product.discount.endDate) > new Date())
  ) {
    discountPercentage += Number(product.discount.discountPercent);
  }

  const categoryWithDiscount = product?.categoryToProducts?.category?.discount
    ?.active
    ? product.categoryToProducts
    : null;

  if (categoryWithDiscount) {
    const catDiscount = categoryWithDiscount.category.discount;
    if (
      catDiscount &&
      new Date(catDiscount.startDate) <= new Date() &&
      (!catDiscount.endDate || new Date(catDiscount.endDate) > new Date())
    ) {
      discountPercentage += Number(catDiscount.discountPercent);
    }
  }

  if (discountPercentage > 0) {
    finalPrice *= 1 - discountPercentage / 100;
  }

  finalPrice *= quantity;

  return {
    finalPrice: Number(finalPrice.toFixed(2)),
    oldPrice: oldPrice * quantity,
    discountPercentage: Number(discountPercentage.toFixed(2)),
    totalSaving: product.price * quantity - Number(finalPrice.toFixed(2)),
  };
}

export function roundToTwoDecimals(num: number) {
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2);
}

export function formatDate(date: Date) {
  return format(date, 'dd MMMM');
}

export function formatDateSecondary(date: Date) {
  return format(date, 'dd.MM.yyyy EEEE HH:mm');
}

export function formatDateTertiary(date: Date) {
  return format(date, 'MMM dd, yyyy');
}

export function capitalizeOnlyFirstLetter(str: string) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}

export function calculateTotalProductRating(productReviews: TReview[]) {
  const rating =
    productReviews?.reduce(
      (sum: number, review) => (sum += Number(review.rating)),
      0
    ) / productReviews.length;

  return rating;
}

export function findValidCoupons(
  product: any,
  couponCode: string
): { productCoupon: TCoupon | null; categoryCoupons: TCoupon[] } | null {
  let productCoupon: TCoupon | null = null;
  let categoryCoupons: TCoupon[] = [];

  productCoupon =
    product.coupons.find(
      (coupon: TCoupon) =>
        coupon.code === couponCode &&
        coupon.usesCount > 0 &&
        discountCheckIfEnded(coupon.endDate)
    ) || null;

  categoryCoupons = product.categories
    .flatMap((category: any) => category.category.coupons)
    .filter(
      (coupon: TCoupon) =>
        coupon.code === couponCode &&
        coupon.usesCount > 0 &&
        discountCheckIfEnded(coupon.endDate)
    );

  if (!productCoupon && categoryCoupons.length === 0) {
    return null;
  }

  return { productCoupon, categoryCoupons };
}
