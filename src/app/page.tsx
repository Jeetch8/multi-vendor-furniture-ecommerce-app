import React from 'react';
import Navbar from '@/components/shared/ui/Navbar';
import InfiniteImageCarousel from '@/components/main/home/InfiniteImageCarousel';
import CategoriesBox from '@/components/main/home/CategoriesBox';
import { Button } from '@/components/ui/button';

const page = () => {
  return (
    <div>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-center mt-10 tracking-wider">
            Transform your space with our <br />
            stunning furniture collection
          </h1>
          <Button className="h-16 w-52 rounded-full text-lg mx-auto text-center mt-8">
            Shop Now
          </Button>
        </div>
      </div>
      <InfiniteImageCarousel />
      <div className="max-w-full">
        <CategoriesBox />
      </div>
    </div>
  );
};

export default page;
