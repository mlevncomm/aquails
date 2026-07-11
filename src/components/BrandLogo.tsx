import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'logo' | 'icon';
  className?: string;
  /** Koyu arka planlarda (footer vb.) logo rengini açık göster */
  inverted?: boolean;
  /** Arka plan kutusu olmadan, şeffaf sunum */
  bare?: boolean;
}

/** Tek marka logosu / ikonu — tüm sistemde bu bileşen kullanılır */
export function BrandLogo({ variant = 'logo', className, inverted = false, bare = false }: BrandLogoProps) {
  const src = variant === 'icon' ? '/images/brand/icon.png' : '/images/brand/logo.png';
  return (
    <span className={cn('inline-flex items-center', bare && 'bg-transparent')}>
      <img
        src={src}
        alt="Aquails"
        className={cn(
          'object-contain select-none',
          variant === 'logo' ? 'h-auto w-auto max-w-full' : 'object-contain',
          inverted && variant === 'logo' && 'brightness-0 invert',
          className,
        )}
        draggable={false}
      />
    </span>
  );
}
