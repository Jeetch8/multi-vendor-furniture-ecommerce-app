import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap-trial/all';
import React from 'react';
import gsap from 'gsap';

const StickyImageScroll = ({ images }: { images: string[] }) => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.sticky-image-scroll', {
      x: -100,
      scrollTrigger: {
        trigger: '.sticky-image-scroll',
        pin: true,
        pinSpacing: false,
      },
    });
  });
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
