import { MdOutlineCategory } from 'react-icons/md';
import SecondTopNavigation from '@/components/main/account/SecondaryTopNavigation';

const navLinks = [
  {
    name: 'Categories',
    href: '/dashboard/categories',
    icon: (
      <MdOutlineCategory className="${css} h-[24px] w-[24px] group-hover:text-orange-1" />
    ),
  },
];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mx-auto grid h-full w-full grid-cols-12 grid-rows-12 bg-[#f0f5f9]">
        <div className="fixed col-start-1 col-end-3 row-span-full h-full min-w-[300px]">
          <SecondTopNavigation navItems={navLinks} />
        </div>
        <main className="col-start-3 col-end-13 row-start-2 row-end-13 h-[105vh] px-28">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
