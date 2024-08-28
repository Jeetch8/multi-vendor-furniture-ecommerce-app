import Container from '@/components/shared/ui/Container';
import { spaceMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full">
      <h1 className={cn(spaceMono.className, 'mb-4 pt-8 text-3xl')}>
        Favorites
      </h1>
      {children}
    </Container>
  );
};

export default layout;
