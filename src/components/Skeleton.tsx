import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  const base = 'animate-pulse bg-[#E8F0FE] rounded-lg';
  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-2xl',
  };
  return <div className={cn(base, variants[variant], className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden p-4 space-y-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton className="h-3 w-20" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-3/4" variant="text" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" variant="text" />
        <Skeleton className="h-4 w-16" variant="text" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
