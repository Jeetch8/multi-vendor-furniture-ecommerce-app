import React from 'react';
import Navbar from '@/components/shared/ui/Navbar';
import SessionProvider from '@/components/Providers/SessionProvider';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
};

export default layout;
