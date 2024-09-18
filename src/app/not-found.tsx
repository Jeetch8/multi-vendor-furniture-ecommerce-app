import Button from '@/components/shared/ui/Button';
// import NotFoundImg from '@/public/images/404-img.png';
import NotFoundImg from '../../public/404-img.jpg';
import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div>
      <div className="grid grid-cols-1 place-items-center h-screen px-4 sm:grid-cols-2">
        <div className="flex flex-col justify-center gap-4">
          <h2 className="text-4xl font-bold">Oops! Page not found</h2>
          <p className="text-muted-foreground max-w-xl">
            {`We're sorry, but the page you are looking for doesn't exist or has
            been moved. We apologize for the inconvenience!`}
          </p>
          <Button
            el="anchor"
            href="/"
            className="w-fit mt-4 bg-primary hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 py-2 px-4 rounded-md"
          >
            Go to homepage
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="max-w-2xl max-h-2xl">
          <Image
            src={NotFoundImg}
            priority
            alt="404"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
