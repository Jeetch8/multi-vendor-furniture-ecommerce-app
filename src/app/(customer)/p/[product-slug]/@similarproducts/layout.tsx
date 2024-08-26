import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="my-10">
        <h3 className="text-2xl font-semibold">Similar products</h3>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
};

export default layout;
