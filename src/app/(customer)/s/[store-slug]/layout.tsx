import Container from '@/components/shared/ui/Container';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20">
      <Container>{children}</Container>
    </div>
  );
}

export default Layout;
