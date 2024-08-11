import Link from 'next/link';
import { spaceMono } from '@/lib/fonts';

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Link href="/">
        <h3 className={`${spaceMono.className} text-2xl`}>DWELLO</h3>
      </Link>
    </div>
  );
}

export default Logo;
