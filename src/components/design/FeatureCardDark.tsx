import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardDarkProps {
  title: string;
  description: string;
  metric?: string;
  image?: string;
  icon?: LucideIcon;
  className?: string;
}

export function FeatureCardDark({
  title,
  description,
  metric,
  image,
  icon: Icon,
  className,
}: FeatureCardDarkProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-aq-deep text-white flex flex-col h-full',
        className,
      )}
    >
      {image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        {Icon && (
          <div className="w-11 h-11 rounded-2xl bg-aq-aqua/15 flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-aq-aqua" />
          </div>
        )}
        <h3 className="text-lg font-semibold leading-snug">{title}</h3>
        <p className="text-sm text-white/65 mt-2 leading-relaxed flex-1">{description}</p>
        {metric && (
          <p className="mt-4 text-aq-aqua font-semibold text-sm">{metric}</p>
        )}
      </div>
    </div>
  );
}
