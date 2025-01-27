import Container from '@/components/shared/ui/Container';

type LayoutProps = {
  children: React.ReactNode;
  similarproducts: React.ReactNode;
};

async function Layout({ children, similarproducts }: LayoutProps) {
  return (
    <Container>
      {children}
      {similarproducts}
    </Container>
  );
}

export default Layout;
