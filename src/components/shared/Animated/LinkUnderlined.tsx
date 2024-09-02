import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface LinkUnderlinedProps {
  initialUnderlined?: boolean;
  className?: string;
  href?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LinkUnderlined = ({
  initialUnderlined,
  className,
  href,
  children,
  onClick,
}: LinkUnderlinedProps) => {
  return (
    <Link
      href={href || '#'}
      className={cn(
        initialUnderlined
          ? 'hover-underline-animation-initial'
          : 'hover-underline-animation',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default LinkUnderlined;
