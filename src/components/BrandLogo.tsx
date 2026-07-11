import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'logo' | 'icon';
  className?: string;
  /** Koyu arka planlarda (footer vb.) logo rengini açık göster */
  inverted?: boolean;
}

/** Tek marka logosu / ikonu — tüm sistemde bu bileşen kullanılır */
export function BrandLogo({ variant = 'logo', className, inverted = false }: BrandLogoProps) {
  const src = variant === 'icon' ? '/images/brand/icon.png' : '/images/brand/logo.png';
  return (
    <img
      src={src}
      alt="Aquails"
      className={cn(
        variant === 'icon' ? 'object-contain' : 'h-auto w-auto object-contain',
        inverted && variant === 'logo' && 'brightness-0 invert',
        className,
      )}
    />
  );
}
