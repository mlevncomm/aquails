import { cn } from '@/lib/utils';

interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
}

export function SectionTag({ children, className, tone = 'light' }: SectionTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide',
        tone === 'light'
          ? 'bg-aq-ice text-aq-muted border border-aq-border/60'
          : 'bg-white/10 text-white/80 border border-white/15',
        className,
      )}
    >
      {children}
    </span>
  );
}
