import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'blue' | 'dark';
  hover?: boolean;
}

export function GlassCard({ children, className, variant = 'white', hover = false }: GlassCardProps) {
  const variants = {
    white: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm',
    blue: 'bg-aq-sky/60 backdrop-blur-md border border-aq-deep/10',
    dark: 'bg-aq-deep/80 backdrop-blur-md border border-white/10',
  };

  return (
    <div
      className={cn(
        'rounded-2xl',
        variants[variant],
        hover && 'hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
