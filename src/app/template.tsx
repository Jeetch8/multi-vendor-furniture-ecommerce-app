import InitialLoader from '@/components/main/InitialLoader';

function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InitialLoader />
      {children}
    </>
  );
}

export default Template;
