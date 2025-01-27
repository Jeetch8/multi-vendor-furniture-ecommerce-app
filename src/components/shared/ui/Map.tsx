'use client';

import dynamic from 'next/dynamic';
import MiniSpinner from './MiniSpinner';

const ClientSideMap = dynamic(() => import('./ClientSideMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <MiniSpinner />
    </div>
  ),
});

function Map() {
  return (
    <div className="h-full w-full">
      <ClientSideMap />
    </div>
  );
}

export default Map;
