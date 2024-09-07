'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import React, { useState } from 'react';
import { LuSearch, LuLoader } from 'react-icons/lu';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFetch } from 'use-http';
import { TProductCard } from '@/types/Product';
import { Button } from '@/components/ui/button';
import { calculatePriceWithDiscounts } from '@/utils/helpers';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  '3 Seater Sofa',
  'Double Bed',
  'Dining Table',
  'Coffee Table',
];

const categoryCards = [
  { name: 'Sofas', image: '/furniture-environment/image1.webp', slug: 'sofas' },
  { name: 'Beds', image: '/furniture-environment/image2.webp', slug: 'beds' },
  {
    name: 'Tables',
    image: '/furniture-environment/image3.webp',
    slug: 'tables',
  },
  {
    name: 'Chairs',
    image: '/furniture-environment/image4.webp',
    slug: 'chairs',
  },
];

const SearchDrawer = ({ isOpen, onClose }: SearchDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const { get, loading, error, data } = useFetch<TProductCard[]>(
    `/api/search?searchQuery=${searchTerm}`
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    const res = await get();
    console.log(res);
    setIsLoading(false);
  };

  const handleShowMore = () => {
    router.push(`/products?searchQuery=${encodeURIComponent(searchTerm)}`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <div className="h-full flex flex-col">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:outline-none"
            />
            <LuSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {!hasSearched && (
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Link
                      key={term}
                      href={`/search?query=${encodeURIComponent(term)}`}
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categoryCards.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center flex-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <LuLoader className="w-8 h-8 text-gray-400" />
              </motion.div>
            </div>
          )}

          {data && hasSearched && !isLoading && (
            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {data?.map((product: TProductCard) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-500">
                        ${calculatePriceWithDiscounts(product).finalPrice}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button onClick={handleShowMore} color="zinc">
                  Show more results
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchDrawer;
