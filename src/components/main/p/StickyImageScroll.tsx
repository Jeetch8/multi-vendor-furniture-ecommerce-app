/* eslint-disable @next/next/no-img-element */
import React from 'react';

const StickyImageScroll = ({ images }: { images: string[] }) => {
  return (
    <div className="max-w-[900px] w-full h-full">
      {images.map((image, index) => (
        <div key={index} className="pb-3 w-full">
          <img
            src={image}
            alt={`product-${index}`}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default StickyImageScroll;
