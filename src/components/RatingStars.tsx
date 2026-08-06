import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function RatingStars({ rating, size = 'md', showCount = false, count, className }: RatingStarsProps) {
  const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const starSize = sizeMap[size];

  return (
    <div className={"flex items-center gap-1 " + (className || '')}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const halfFilled = !filled && star - 0.5 <= rating;

          return (
            <div key={star} className="relative">
              <Star
                className={cn(
                  starSize,
                  filled ? 'text-[#F5A623] fill-[#F5A623]' : 'text-aq-border'
                )}
              />
              {halfFilled && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star className={cn(starSize, 'text-[#F5A623] fill-[#F5A623]')} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-aq-muted ml-1">({count})</span>
      )}
    </div>
  );
}
