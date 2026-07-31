import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'logo' | 'icon';
  className?: string;
  /** Koyu zeminlerde açık metalik gümüş */
  inverted?: boolean;
  /** Arka plan kutusu olmadan */
  bare?: boolean;
}

const WORD: { char: string; q?: boolean }[] = [
  { char: 'Λ' },
  { char: 'Q', q: true },
  { char: 'U' },
  { char: 'Λ' },
  { char: 'I' },
  { char: 'L' },
  { char: 'S' },
];

/**
 * Metin logotype: AQUAILS
 * Michroma, geniş harf aralığı, açık A (Λ), mavi degrade Q
 */
export function BrandLogo({
  variant = 'logo',
  className,
  inverted = false,
  bare = false,
}: BrandLogoProps) {
  const metal = inverted
    ? 'bg-[linear-gradient(180deg,#F4F7FA_0%,#C8D0DA_45%,#8B97A6_100%)]'
    : 'bg-[linear-gradient(180deg,#2F3E50_0%,#152232_50%,#0A1420_100%)]';

  const metalClass = cn('bg-clip-text text-transparent', metal);
  const qClass =
    'bg-clip-text text-transparent bg-[linear-gradient(165deg,#6AD0FF_0%,#1B9BEA_40%,#0A6CB8_100%)]';

  if (variant === 'icon') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center bg-transparent select-none',
          'font-[Michroma,ui-sans-serif,system-ui,sans-serif] leading-none',
          bare && 'bg-transparent',
          className,
        )}
        aria-label="Aquails"
        role="img"
      >
        <span className={cn(qClass, 'text-[1.25em]')}>Q</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center bg-transparent select-none',
        'font-[Michroma,ui-sans-serif,system-ui,sans-serif] uppercase leading-none',
        'text-[1.05rem] gap-[0.34em]',
        bare && 'bg-transparent',
        className,
      )}
      aria-label="Aquails"
      role="img"
    >
      {WORD.map(({ char, q }, i) => (
        <span key={`${char}-${i}`} className={q ? qClass : metalClass}>
          {char}
        </span>
      ))}
    </span>
  );
}
