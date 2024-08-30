import { TCategoriesToProductsMap, TCategory, TDiscount } from '@/lib/schema';
import { TProduct } from '@/lib/schema';
import {
  calculatePriceWithDiscounts,
  roundToTwoDecimals,
} from '@/utils/helpers';

type ProductPriceDisplayProps = {
  product: TProduct & {
    discount: TDiscount | null;
    categoryToProducts: TCategoriesToProductsMap & {
      category: TCategory & { discount: TDiscount };
    };
  };
  quantity?: number;
  showTotalSavings?: boolean;
  showOldPrice?: boolean;
  className?: string;
};

function ProductPriceDisplay({
  product,
  quantity = 1,
  showOldPrice = true,
  showTotalSavings = true,
  className,
}: ProductPriceDisplayProps) {
  const { finalPrice, oldPrice, discountPercentage } =
    calculatePriceWithDiscounts(product, quantity);

  const hasDiscount = discountPercentage > 0;

  return (
    <div className={className}>
      {hasDiscount && showOldPrice && oldPrice !== finalPrice && (
        <div className="flex text-xs">
          <span className="mr-1 text-muted-foreground line-through">
            ${roundToTwoDecimals(oldPrice)}
          </span>
          {discountPercentage > 0 && (
            <span className="font-semibold text-primary">
              %{discountPercentage} off
            </span>
          )}
        </div>
      )}
      <p className="text-sm font-semibold text-primary">
        ${roundToTwoDecimals(finalPrice)}
      </p>

      {discountPercentage > 0 && showTotalSavings && (
        <p className="text-xs text-primary">
          You save: ${roundToTwoDecimals(product.price - finalPrice)}
        </p>
      )}
    </div>
  );
}

export default ProductPriceDisplay;
