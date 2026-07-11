import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** 1440px geniş container */
  wide?: boolean;
  /** Section padding (py-12 md:py-16 lg:py-20) */
  section?: boolean;
  as?: 'div' | 'section';
}

export function PageContainer({
  children,
  className,
  wide = false,
  section = false,
  as: Tag = 'div',
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        wide ? 'page-container-wide' : 'page-container',
        section && 'page-section',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
