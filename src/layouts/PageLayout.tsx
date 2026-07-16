import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'blue' | 'gradient' | 'tech';
}

export function PageLayout({ children, variant = 'default' }: PageLayoutProps) {
  const bgClasses: Record<string, string> = {
    default: 'bg-[#F7FAFF] min-h-screen',
    blue: 'bg-gradient-to-b from-[#EEF6FF] to-[#F7FAFF] min-h-screen',
    gradient: 'bg-gradient-to-br from-[#E6F2FF] via-[#F5FAFF] to-[#EBF8FF] min-h-screen',
    tech: 'bg-[#F7FAFF] min-h-screen relative',
  };

  return (
    <div className={bgClasses[variant]}>
      {/* Subtle blob decorations for default variant */}
      {variant === 'default' && (
        <>
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#1A73E8]/[0.025] rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#4FC3F7]/[0.03] rounded-full blur-3xl pointer-events-none -z-0" />
        </>
      )}
      {/* Tech grid for tech variant */}
      {variant === 'tech' && (
        <>
          <div className="fixed inset-0 pointer-events-none -z-0 tech-grid opacity-50" />
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl pointer-events-none -z-0" />
        </>
      )}
      {/* Avoid overflow-x-hidden here — it breaks IntersectionObserver / fade-in animations */}
      <div className="relative z-10 min-w-0 w-full">{children}</div>
    </div>
  );
}
