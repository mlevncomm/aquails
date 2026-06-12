import { cn } from '@/lib/utils';

interface TechGridBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function TechGridBackground({ children, className }: TechGridBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,115,232,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,115,232,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Center glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1A73E8]/[0.03] rounded-full blur-3xl pointer-events-none" />
      {/* Cyan accent */}
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#00D4C8]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
