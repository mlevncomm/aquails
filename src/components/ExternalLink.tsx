import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * External link with world-standard security defaults:
 * target=_blank + rel=noopener noreferrer
 */
export function ExternalLink({ href, children, className, rel, target, ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target={target ?? '_blank'}
      rel={rel ?? 'noopener noreferrer'}
      className={cn(className)}
      {...props}
    >
      {children}
    </a>
  );
}
