import { TProductWithDiscounts } from '@/types/Product';

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
