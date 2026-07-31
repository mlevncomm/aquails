import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'logo' | 'icon';
  className?: string;
  /**
   * @deprecated Yeni metalik logo renkli; koyu yüzeylerde invert kullanmayın.
   * Geriye dönük uyumluluk için prop korunur ancak logo variant’ta uygulanmaz.
   */
  inverted?: boolean;
  /** Arka plan kutusu olmadan, şeffaf sunum */
  bare?: boolean;
}

const LOGO_SRC = '/images/brand/logo.png';
const ICON_SRC = '/images/brand/icon.png';

/** Tek marka logosu / ikonu — tüm sistemde bu bileşen kullanılır */
export function BrandLogo({ variant = 'logo', className, bare = false }: BrandLogoProps) {
  const src = variant === 'icon' ? ICON_SRC : LOGO_SRC;
  return (
    <span className={cn('inline-flex items-center justify-center bg-transparent', bare && 'bg-transparent')}>
      <img
        src={src}
        alt="Aquails"
        className={cn(
          'object-contain select-none bg-transparent',
          variant === 'logo' ? 'h-auto w-auto max-w-full' : 'object-contain',
          className,
        )}
        draggable={false}
      />
    </span>
  );
}

/** Header vb. açık zeminlerde metalik logoyu okunaklı gösteren koyu plaka */
export function BrandLogoMark({
  variant = 'logo',
  className,
  imgClassName,
}: {
  variant?: 'logo' | 'icon';
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-2xl bg-[#05070c]',
        'ring-1 ring-white/10 shadow-[0_4px_16px_rgba(7,24,39,0.12)]',
        'px-2.5 py-1.5',
        className,
      )}
    >
      <BrandLogo variant={variant} bare className={imgClassName} />
    </span>
  );
}
