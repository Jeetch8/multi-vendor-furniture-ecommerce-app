import { Open_Sans, Teko, Poppins, Space_Mono } from 'next/font/google';

export const opensans = Open_Sans({ subsets: ['latin'] });
export const teko = Teko({ subsets: ['latin'] });
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});
