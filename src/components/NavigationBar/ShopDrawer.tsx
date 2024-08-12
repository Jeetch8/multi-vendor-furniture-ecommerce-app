'use client';

import React, { memo } from 'react';
import LinkUnderlined from '../shared/Animated/LinkUnderlined';
import { Sheet, SheetContent } from '../ui/sheet';
import { ChevronLeft } from 'lucide-react';
import { TCategoryWithSubCategories } from '@/types/Category';
import Image from 'next/image';

interface ShopDrawerProps {
  categories: TCategoryWithSubCategories[];
  activeSubmenu: 'shop' | 'collections' | null;
  setActiveSubmenu: (submenu: 'shop' | 'collections' | null) => void;
}

const ShopDrawer = memo(
  ({ categories, activeSubmenu, setActiveSubmenu }: ShopDrawerProps) => {
    return (
      <Sheet
        open={activeSubmenu === 'shop'}
        onOpenChange={() => setActiveSubmenu(null)}
      >
        <SheetContent side="right" className="w-full max-w-xs p-0">
          <div className="p-4">
            <button
              onClick={() => setActiveSubmenu(null)}
              className="mb-6 flex items-center gap-2"
            >
              <div>
                <ChevronLeft className="w-6 h-6" />
              </div>
              Back
            </button>
            <div>
              <h4 className="text-lg font-semibold">Shop</h4>
            </div>
            <div className="grid gap-6 mt-4 overflow-scroll h-[85vh] no-scroll-bar">
              {categories.map((category) => (
                <div key={category.slug} className="flex gap-4 items-center">
                  <div className="relative h-[55px] w-[90px] overflow-hidden rounded-md mb-2">
                    <Image
                      src={category.image || ''}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <LinkUnderlined
                    href={`/category/${category.slug}`}
                    className="text-lg"
                  >
                    {category.name}
                  </LinkUnderlined>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.activeSubmenu === nextProps.activeSubmenu;
  }
);

ShopDrawer.displayName = 'ShopDrawer';

export default ShopDrawer;
