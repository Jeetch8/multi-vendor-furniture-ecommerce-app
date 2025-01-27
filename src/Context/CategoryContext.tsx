'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { TCategoryForContext, TCategoryWithSubCategories } from '@/types/Category';

interface CategoriesContextType {
  categories: TCategoryForContext[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export const CategoriesProvider: React.FC<{
  children: ReactNode;
  categories: TCategoryForContext[];
}> = ({ children, categories }) => {
  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};


export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
