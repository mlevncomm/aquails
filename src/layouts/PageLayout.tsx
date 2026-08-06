import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'blue' | 'gradient' | 'tech';
}

export function PageLayout({ children, variant = 'default' }: PageLayoutProps) {
  const bgClasses: Record<string, string> = {
    default: 'bg-white min-h-screen',
    blue: 'bg-aq-ice min-h-screen',
    gradient: 'bg-gradient-to-br from-aq-ice via-white to-aq-ice min-h-screen',
    tech: 'bg-aq-ice min-h-screen relative',
  };

  return (
    <div className={bgClasses[variant]}>
      {variant === 'tech' && (
        <div className="fixed inset-0 pointer-events-none -z-0 tech-grid opacity-40" />
      )}
      <div className="relative z-10 min-w-0 w-full">{children}</div>
    </div>
  );
}
