import { cn } from '@/lib/utils';

interface SectionBackgroundProps {
  children: React.ReactNode;
  variant?: 'white' | 'blue-light' | 'blue-gradient' | 'gradient' | 'dark';
  className?: string;
  withWave?: boolean;
}

export function SectionBackground({ children, variant = 'white', className, withWave = false }: SectionBackgroundProps) {
  const variants = {
    white: 'bg-white',
    'blue-light': 'bg-aq-ice',
    'blue-gradient': 'bg-gradient-to-b from-aq-sky/30 to-aq-ice',
    gradient: 'bg-gradient-to-br from-aq-sky/20 via-white to-aq-ice',
    dark: 'bg-gradient-to-br from-aq-deep via-aq-deep to-aq-deep',
  };

  return (
    <section className={cn('relative', variants[variant], className)}>
      {withWave && variant !== 'dark' && (
        <svg
          className="absolute top-0 left-0 w-full h-24 pointer-events-none opacity-40"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill={variant === 'white' ? '#F5FBFF' : '#FFFFFF'}
            d="M0,60L48,55C96,50,192,40,288,45C384,50,480,70,576,75C672,80,768,70,864,60C960,50,1056,40,1152,42C1248,45,1344,60,1392,67L1440,75L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
