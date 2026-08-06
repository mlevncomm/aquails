import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageBackgroundProps {
  children: ReactNode;
  variant?: 'default' | 'hero' | 'blue' | 'gradient' | 'dark';
  className?: string;
}

export function PageBackground({ children, variant = 'default', className }: PageBackgroundProps) {
  const variants = {
    default: 'bg-aq-ice',
    hero: 'bg-gradient-to-br from-aq-ice via-white to-aq-sky/40',
    blue: 'bg-gradient-to-b from-aq-sky/30 to-aq-ice',
    gradient: 'bg-gradient-to-br from-aq-sky/20 via-white to-aq-ice',
    dark: 'bg-gradient-to-br from-aq-deep via-aq-deep to-aq-deep',
  };

  return (
    <div className={cn('min-h-screen', variants[variant], className)}>
      {children}
    </div>
  );
}
