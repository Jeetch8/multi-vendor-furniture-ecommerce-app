'use client';

import React, { memo } from 'react';
import LinkUnderlined from '../shared/Animated/LinkUnderlined';
import { Sheet, SheetContent } from '../ui/sheet';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { TCollection } from '@/lib/schema';

interface CollectionsDrawerProps {
  collections: TCollection[];
  activeSubmenu: 'collections' | 'shop' | null;
  setActiveSubmenu: (submenu: 'collections' | null) => void;
}

const CollectionsDrawer = memo(
  ({
    collections,
    activeSubmenu,
    setActiveSubmenu,
  }: CollectionsDrawerProps) => {
    return (
      <Sheet
        open={activeSubmenu === 'collections'}
        onOpenChange={() => setActiveSubmenu(null)}
      >
        <SheetContent side="right" className="w-full max-w-xs p-0">
          <div className="p-4">
            <button
              onClick={() => setActiveSubmenu(null)}
              className="mb-6 flex items-center gap-2"
            >
              <ChevronLeft className="w-6 h-6" />
              Back
            </button>
            <div>
              <h3 className="text-lg font-semibold">Collections</h3>
            </div>
            <div className="flex flex-col gap-4 mt-4 overflow-scroll h-[85vh] no-scroll-bar">
              {collections.map((collection) => (
                <div key={collection.slug} className="flex gap-4 items-center">
                  <div className="relative h-[55px] w-[90px] overflow-hidden rounded-md mb-2">
                    <Image
                      src={collection?.image || ''}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <LinkUnderlined
                    href={`/collections/${collection.slug}`}
                    className="text-lg"
                  >
                    {collection.name}
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

CollectionsDrawer.displayName = 'CollectionsDrawer';

export default CollectionsDrawer;
