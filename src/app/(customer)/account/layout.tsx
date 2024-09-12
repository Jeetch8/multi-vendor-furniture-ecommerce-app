import Container from '@/components/shared/ui/Container';
import SecondaryTopNavigation from '@/components/main/account/SecondaryTopNavigation';

const navLinks = [
  {
    name: 'Orders',
    href: '/account/orders',
  },
  {
    name: 'Reviews',
    href: '/account/reviews',
  },
  {
    name: 'Addresses',
    href: '/account/addresses',
  },
  {
    name: 'Account Settings',
    href: '/account/account-settings',
  },
];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SecondaryTopNavigation navItems={navLinks} />
      <Container className="mt-11">{children}</Container>
    </div>
  );
}

export default Layout;
