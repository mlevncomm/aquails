import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardLightProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  className?: string;
}

export function FeatureCardLight({
  title,
  description,
  icon: Icon,
  image,
  className,
}: FeatureCardLightProps) {
  return (
    <div
      className={cn(
        'bg-white border border-aq-border/60 rounded-2xl p-6 transition-all duration-300 h-full flex flex-col',
        className,
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-aq-sky flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-aq-blue" />
        </div>
      )}
      {image && (
        <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/10]">
          <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <h3 className="text-base font-semibold text-aq-text">{title}</h3>
      <p className="text-sm text-aq-muted mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
