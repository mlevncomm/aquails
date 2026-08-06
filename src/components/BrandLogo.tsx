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

const FONT = 'font-[Poppins,ui-sans-serif,system-ui,sans-serif]';

/**
 * Metin logotype: AQUAILS
 * Poppins (az kalın), geniş aralık, açık A (Λ), mavi degrade Q
 */
export function BrandLogo({
  variant = 'logo',
  className,
  inverted = false,
  bare = false,
}: BrandLogoProps) {
  const metal = inverted
    ? 'bg-[linear-gradient(180deg,#F7FAFC_0%,#D0D8E2_42%,#9AA6B4_100%)]'
    : 'bg-[linear-gradient(180deg,#3A4B5E_0%,#1C2B3C_48%,#0C1622_100%)]';

  const metalClass = cn('bg-clip-text text-transparent', metal);
  const qClass =
    'bg-clip-text text-transparent bg-[linear-gradient(165deg,#7AD6FF_0%,#2AA6F0_36%,#0C74C4_100%)]';

  if (variant === 'icon') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center bg-transparent select-none',
          FONT,
          'font-semibold leading-none',
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
        FONT,
        'font-semibold uppercase leading-none',
        'text-[1.15rem] gap-[0.32em]',
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
