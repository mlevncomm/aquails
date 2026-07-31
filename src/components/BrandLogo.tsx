import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'logo' | 'icon';
  className?: string;
  /** @deprecated Metalik logo renkli; invert uygulanmaz. */
  inverted?: boolean;
  /** Arka plan kutusu olmadan, şeffaf sunum */
  bare?: boolean;
}

/** Cache-bust: eski siyah zeminli asset tarayıcıda kalmasın */
const LOGO_SRC = '/images/brand/logo.png?v=20260731b';
const ICON_SRC = '/images/brand/icon.png?v=20260731b';

/** Tek marka logosu / ikonu — ikon solda, yazı sağda yatay logo */
export function BrandLogo({ variant = 'logo', className, bare = false }: BrandLogoProps) {
  const src = variant === 'icon' ? ICON_SRC : LOGO_SRC;
  return (
    <span className={cn('inline-flex items-center justify-center bg-transparent', bare && 'bg-transparent')}>
      <img
        src={src}
        alt="Aquails"
        className={cn(
          'object-contain select-none bg-transparent',
          variant === 'logo' && 'drop-shadow-[0_1px_2px_rgba(7,24,39,0.12)]',
          className,
        )}
        draggable={false}
      />
    </span>
  );
}
