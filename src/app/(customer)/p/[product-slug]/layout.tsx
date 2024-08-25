import Container from '@/components/shared/ui/Container';

type LayoutProps = {
  children: React.ReactNode;
};

async function Layout({ children }: LayoutProps) {
  return <Container>{children}</Container>;
}

export default Layout;
