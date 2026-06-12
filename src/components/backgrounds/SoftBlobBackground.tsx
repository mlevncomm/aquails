import { cn } from '@/lib/utils';

interface SoftBlobBackgroundProps {
  children: React.ReactNode;
  className?: string;
  blobColor?: string;
  showGrid?: boolean;
}

export function SoftBlobBackground({ children, className, blobColor = '#1A73E8', showGrid = false }: SoftBlobBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Top right blob */}
      <div
        className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-[0.04]"
        style={{ backgroundColor: blobColor }}
      />
      {/* Bottom left blob */}
      <div
        className="absolute -bottom-[15%] -left-[10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-[0.05]"
        style={{ backgroundColor: '#4FC3F7' }}
      />
      {/* Center subtle blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-[0.02]"
        style={{ backgroundColor: blobColor }}
      />

      {/* Optional subtle grid */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(${blobColor}33 1px, transparent 1px), linear-gradient(90deg, ${blobColor}33 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
