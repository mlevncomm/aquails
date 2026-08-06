import { cn } from '@/lib/utils';
import { SectionTag } from './SectionTag';

interface SectionHeadingProps {
  tag?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  tone?: 'light' | 'dark';
  action?: React.ReactNode;
}

export function SectionHeading({
  tag,
  title,
  description,
  align = 'center',
  className,
  tone = 'light',
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-12',
        align === 'center' && 'text-center',
        action && 'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-left',
        className,
      )}
    >
      <div className={cn(action && 'flex-1')}>
        {tag && (
          <SectionTag tone={tone} className={cn(align === 'center' && !action && 'mx-auto mb-4', (align === 'left' || action) && 'mb-4')}>
            {tag}
          </SectionTag>
        )}
        <h2
          className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-bold leading-tight',
            tone === 'light' ? 'text-aq-text' : 'text-white',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'text-sm sm:text-[15px] mt-3 leading-relaxed max-w-xl',
              tone === 'light' ? 'text-aq-muted' : 'text-white/70',
              align === 'center' && !action && 'mx-auto',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
