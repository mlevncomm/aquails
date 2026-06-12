import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageBackgroundProps {
  children: ReactNode;
  variant?: 'default' | 'hero' | 'blue' | 'gradient' | 'dark';
  className?: string;
}

export function PageBackground({ children, variant = 'default', className }: PageBackgroundProps) {
  const variants = {
    default: 'bg-[#F7FAFF]',
    hero: 'bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E8F4FF]',
    blue: 'bg-gradient-to-b from-[#EEF6FF] to-[#F7FAFF]',
    gradient: 'bg-gradient-to-br from-[#E6F2FF] via-[#F5FAFF] to-[#EBF8FF]',
    dark: 'bg-gradient-to-br from-[#0B1D3A] via-[#0D2137] to-[#0B1D3A]',
  };

  return (
    <div className={cn('min-h-screen', variants[variant], className)}>
      {children}
    </div>
  );
}
