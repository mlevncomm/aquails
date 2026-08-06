import { cn } from '@/lib/utils';

interface MetricStatProps {
  value: string;
  label: string;
  className?: string;
  tone?: 'light' | 'dark';
}

export function MetricStat({ value, label, className, tone = 'light' }: MetricStatProps) {
  return (
    <div className={cn('text-center lg:text-left min-w-0', className)}>
      <p
        className={cn(
          'text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight',
          tone === 'light' ? 'text-aq-text' : 'text-white',
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'text-[11px] sm:text-sm mt-1.5 leading-snug',
          tone === 'light' ? 'text-aq-muted' : 'text-white/60',
        )}
      >
        {label}
      </p>
    </div>
  );
}
