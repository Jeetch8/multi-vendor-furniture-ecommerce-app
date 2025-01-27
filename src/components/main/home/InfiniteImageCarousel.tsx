'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import image1 from '../../../../public/furniture-environment/image1.webp';
import image2 from '../../../../public/furniture-environment/image2.webp';
import image3 from '../../../../public/furniture-environment/image3.webp';
import image4 from '../../../../public/furniture-environment/image4.webp';
import image5 from '../../../../public/furniture-environment/image5.webp';
import image6 from '../../../../public/furniture-environment/image6.webp';
import image7 from '../../../../public/furniture-environment/image7.png';
import image8 from '../../../../public/furniture-environment/image8.webp';
import image9 from '../../../../public/furniture-environment/image9.webp';
import image10 from '../../../../public/furniture-environment/image10.webp';
import image11 from '../../../../public/furniture-environment/image11.webp';
import image12 from '../../../../public/furniture-environment/image12.webp';
import image13 from '../../../../public/furniture-environment/image13.webp';
import { cn } from '@/lib/utils';

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
];

const InfiniteImageCarousel = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slider = sliderRef.current;
      if (!slider) return;

      const existingClones = slider.querySelectorAll('.clone');
      existingClones.forEach((clone) => clone.remove());

      const items = slider.querySelectorAll('.carousel-item');
      items.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        slider.appendChild(clone);
      });

      const itemWidth = 300;
      const gap = 16;
      const totalWidth = items.length * (itemWidth + gap);

      const animationTimeline = gsap
        .timeline()
        .to(slider.querySelectorAll('.carousel-item'), {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        })
        .to(slider, {
          x: -totalWidth,
          duration: 60,
          ease: 'none',
          repeat: -1,
          runBackwards: false,
          onRepeat: () => {
            gsap.set(slider, { x: 0 });
          },
        });

      const handleMouseEnter = () => animationTimeline.pause();
      const handleMouseLeave = () => animationTimeline.play();

      slider.addEventListener('mouseenter', handleMouseEnter);
      slider.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        animationTimeline.kill();
        slider.removeEventListener('mouseenter', handleMouseEnter);
        slider.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { scope: containerRef }
  );

  const getImageHeight = (index: number): string => {
    if (index % 2 === 0) return '200px';
    if (index % 3 === 0) return '250px';
    return '300px';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-4 mb-[10vh]"
    >
      <div
        ref={sliderRef}
        className="flex gap-4 items-center will-change-transform"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="carousel-item relative min-w-[300px] overflow-hidden"
            style={{
              height: getImageHeight(index),
              clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={image}
              alt={`Furniture ${index + 1}`}
              fill
              className={cn(
                'object-cover transition-all duration-500 will-change-transform',
                'transform hover:scale-110',
                hoveredIndex !== null &&
                  hoveredIndex !== index &&
                  'brightness-[0.7]'
              )}
              sizes="300px"
              priority={index < 4}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteImageCarousel;
