'use client';

import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import PriceRange from '@/components/shared/ui/PriceRangeDialer';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidebarCategoryItem from './SidebarCategoryItem';
import { Accordion } from '@/components/ui/accordion';
import { GiSettingsKnobs } from 'react-icons/gi';
import { MoonLoader } from 'react-spinners';

interface FilterDrawerProps {
  categories: string[];
  attributes: Record<string, string[]>;
  priceRange: { min: number; max: number };
  isLoading?: boolean;
}

const FilterDrawer = ({
  categories,
  attributes,
  priceRange,
  isLoading = false,
}: FilterDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
  }, [searchParams]);

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.keys(selectedFilters).forEach((key) => {
      params.delete(key);
    });
    router.push(`?${params.toString().toLowerCase()}`);
    setSelectedFilters({});
    setIsDrawerOpen(false);
  };

  const handleShowAllProducts = () => {
    router.push('/products');
    setIsDrawerOpen(false);
  };

  const handleSelectionChange = (key: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-2"
      >
        <GiSettingsKnobs className="w-4 h-4" />
        Filters
        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
          {searchParams.size}
        </span>
      </Button>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader>
            <SheetTitle className="px-4 pt-2 text-lg flex items-center gap-2">
              <GiSettingsKnobs />
              <span className="font-semibold">Filters</span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="flex flex-col py-4">
              <div className="px-4">
                <PriceRange
                  minRange={priceRange.min}
                  maxRange={priceRange.max}
                />
              </div>
              <Accordion type="multiple" className="w-full">
                {categories.length > 0 && (
                  <SidebarCategoryItem
                    title="category"
                    items={categories}
                    selectedValues={selectedFilters['category'] || []}
                    onSelectionChange={(values) =>
                      handleSelectionChange('category', values)
                    }
                  />
                )}

                {Object.entries(attributes).map(([title, items]) => (
                  <SidebarCategoryItem
                    key={title}
                    title={title}
                    items={items}
                    selectedValues={selectedFilters[title] || []}
                    onSelectionChange={(values) =>
                      handleSelectionChange(title, values)
                    }
                  />
                ))}
              </Accordion>
            </div>
          </ScrollArea>

          <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                Clear Filters
              </Button>
              <Button
                className="flex-1"
                onClick={handleShowAllProducts}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div>
                    <MoonLoader color="#000" size={16} />
                  </div>
                ) : (
                  'Show All Products'
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FilterDrawer;
