import { cn } from '@/lib/utils';

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(`mx-auto max-w-[1500px] w-full`, className)}>
      {children}
    </div>
  );
}

export default Container;
