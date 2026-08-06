import { cn } from '@/lib/utils';

interface WavePatternBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'subtle' | 'hero';
}

export function WavePatternBackground({ children, className, variant = 'light' }: WavePatternBackgroundProps) {
  const colors = {
    light: '#06263D08',
    subtle: '#06263D05',
    hero: '#06263D0D',
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Wave SVG pattern */}
      <svg
        className="absolute top-0 left-0 w-full h-48 pointer-events-none opacity-30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={colors[variant]}
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
      {/* Second subtle wave */}
      <svg
        className="absolute top-0 left-0 w-full h-32 pointer-events-none opacity-20"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          fill={colors[variant]}
          d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,69.3C672,64,768,96,864,106.7C960,117,1056,107,1152,96C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
