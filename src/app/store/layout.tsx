import {
  MdOutlinePhoneAndroid,
  MdOutlineStorefront,
  MdOutlineShoppingCart,
  MdOutlineDiscount,
} from 'react-icons/md';
import { HiOutlineTruck } from 'react-icons/hi2';
import SecondaryTopNavigation from '@/components/main/account/SecondaryTopNavigation';

const navLinks = [
  {
    name: 'My Store',
    href: '/store/mystore',
    icon: (
      <MdOutlineStorefront className="h-[24px] w-[24px] group-hover:text-orange-1" />
    ),
  },
  {
    name: 'Products',
    href: '/store/products',
    icon: (
      <MdOutlinePhoneAndroid className="h-[24px] w-[24px] group-hover:text-orange-1" />
    ),
  },
  {
    name: 'Orders',
    href: '/store/orders',
    icon: (
      <MdOutlineShoppingCart className="h-[24px] w-[24px] group-hover:text-orange-1" />
    ),
  },
  {
    name: 'Discounts',
    href: '/store/discounts',
    icon: (
      <MdOutlineDiscount className="h-[24px] w-[24px] group-hover:text-orange-1" />
    ),
  },
  {
    name: 'Carriers',
    href: '/store/carriers',
    icon: (
      <HiOutlineTruck className="h-[24px] w-[24px] group-hover:text-orange-1" />
    ),
  },
];

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <SecondaryTopNavigation navItems={navLinks} />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
