import Container from '@/components/shared/ui/Container';
import UserAccountNavigation from '@/components/main/account/UserAccountNavigation';

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
      <UserAccountNavigation navItems={navLinks} />
      <Container className="mt-11">{children}</Container>
    </div>
  );
}

export default Layout;
