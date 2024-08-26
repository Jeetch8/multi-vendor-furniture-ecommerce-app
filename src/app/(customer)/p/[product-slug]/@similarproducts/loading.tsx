import EmptyProductCarousel from '@/components/main/p/EmptyProductCarousel';
import React from 'react';

const loading = () => {
  return (
    <div className="mt-10 overflow-hidden max-h-[450px]">
      <EmptyProductCarousel length={4} />
    </div>
  );
};

export default loading;
