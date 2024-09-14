import { TCart, TCartItem, TCoupon, TReview } from '@/lib/schema';
import { TProductForTable, TProductWithDiscounts } from '@/types/Product';
import { format } from 'date-fns';
import slugify from 'slugify';
import * as ExcelJS from 'exceljs';

export function getUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.dwello.com/';
  } else {
    return 'http://localhost:3000';
  }
}

export const downloadAsExcelProductTable = async () => {
  try {
    const response = await fetch('/api/products');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('API did not return JSON');
    }

    const data = await response.json();

    const products = data.products.products;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.addRow([
      'Brand',
      'Category',
      'Description',
      'Name',
      'Price',
      'Status',
      'Stock',
      'Summary',
    ]);

    products.forEach((product: Partial<TProductForTable>) => {
      const categories = product.categoryToProducts
        ?.map((c) => c.category.name)
        .join(',');

      worksheet.addRow([
        product.name || '',
        product.price || '',
        product.brand || '',
        categories || '',
        product.description || '',
        product.status ? 'Active' : 'Inactive',
        product.stock || '',
        product.summary || '',
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer;
  } catch (error) {
    console.error('Error in downloadAsExcelProductTable:', error);
    throw error;
  }
};

export const handleExportExcel = async () => {
  try {
    const excelBuffer = await downloadAsExcelProductTable();

    if (!excelBuffer) {
      console.error('Excel buffer is empty');
      return;
    }

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting Excel:', error);
  }
};

export function calculatePriceWithDiscounts(
  product: any,
  quantity: number = 1
) {
  let finalPrice = parseFloat(product.price);
  const oldPrice = parseFloat(product.price);
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

  const categoryWithDiscount = product.categoryToProducts.find(
    (cat: any) => cat.category.discount && cat.category.discount.active
  );

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
    totalSaving:
      parseFloat(product.price) * quantity - Number(finalPrice.toFixed(2)),
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

export function discountCheckIfEnded(endDate: Date | null) {
  if (endDate === null) return false;
  const currentDate = new Date();
  const couponEndDate = new Date(endDate);
  return couponEndDate >= currentDate;
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

export function convertToSubcurrency(amount: number, factor = 100): number {
  return Math.round(amount * factor);
}

export const getUniqueStoreIds = (
  cart: TCart & { cartItems: TCartItem[] }
): string[] => {
  const storeIds = cart?.cartItems.map((item) => item.productId);
  return Array.from(new Set(storeIds));
};

export function generateSlug(str: string) {
  return slugify(str, {
    lower: true,
    strict: true,
    trim: true,
  });
}
