import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-aq-deep hover:bg-aq-sky',
  secondary:
    'bg-aq-text text-white hover:bg-aq-deep',
  ghost:
    'border border-white/30 text-white hover:border-white/70 hover:bg-white/5 bg-transparent',
  outline:
    'border border-aq-border/60 text-aq-text hover:border-aq-deep bg-white',
  dark:
    'bg-aq-blue text-white hover:bg-aq-deep',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm',
};

interface AquailsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  to?: string;
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
}

export function AquailsButton({
  variant = 'primary',
  size = 'md',
  href,
  to,
  children,
  showArrow = false,
  className,
  ...props
}: AquailsButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      {children}
      {showArrow && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-aq-deep/10">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
