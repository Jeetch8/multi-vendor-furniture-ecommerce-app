import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface LinkUnderlinedProps extends React.ComponentProps<'a'> {
  initial?: boolean;
}

const LinkUnderlined = (props: LinkUnderlinedProps) => {
  return (
    <Link
      {...props}
      href={props.href || '#'}
      className={cn(
        props.initial
          ? 'hover-underline-animation-initial'
          : 'hover-underline-animation',
        props.className
      )}
    >
      {props.children}
    </Link>
  );
};

export default LinkUnderlined;
