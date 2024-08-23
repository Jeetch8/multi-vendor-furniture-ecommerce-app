'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { Card } from '@/components/ui/card';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';

interface PriceRangeProps {
  minRange?: number;
  maxRange?: number;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  minRange = 0,
  maxRange = 10000,
}) => {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get('minPrice')) || minRange,
    Number(searchParams.get('maxPrice')) || maxRange,
  ]);
  const pathname = usePathname();
  const router = useRouter();

  const debouncedPriceRange = useDebounce(priceRange, 1000);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const minPrice = Number(params.get('minPrice'));
    const maxPrice = Number(params.get('maxPrice'));
    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('minPrice', debouncedPriceRange[0].toString());
    params.set('maxPrice', debouncedPriceRange[1].toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedPriceRange, pathname, router, searchParams]);

  const handleReset = useCallback(() => {
    setPriceRange([minRange, maxRange]);
    const params = new URLSearchParams(searchParams);
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`${pathname}?${params.toString()}`);
  }, [minRange, maxRange, searchParams, pathname, router]);

  const formatPrice = useCallback((value: number | undefined) => {
    if (value === undefined) return '';
    return `$${value.toLocaleString()}`;
  }, []);

  return (
    <Card className="w-full p-4 my-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Price Range</h3>
        {(priceRange[0] > minRange || priceRange[1] < maxRange) && (
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Reset
          </button>
        )}
      </div>
      <div className="px-2">
        <DualRangeSlider
          min={minRange}
          max={maxRange}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="my-6"
          label={formatPrice}
          labelPosition="bottom"
        />
      </div>
    </Card>
  );
};

export default PriceRange;
