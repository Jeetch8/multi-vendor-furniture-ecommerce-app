import React from 'react';
import Navbar from '@/components/shared/ui/Navbar';

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mt-10">Hello World</h1>
      </div>
    </div>
  );
};

export default page;
