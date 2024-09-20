import React from 'react';
import { ThemeProvider } from 'next-themes';

const Theme = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};

export default Theme;
