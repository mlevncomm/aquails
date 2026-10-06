import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PageHeroCrumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  /** Trailing crumbs; "Ana Sayfa" is always prepended. */
  breadcrumbs?: PageHeroCrumb[];
  /** @deprecated Inner pages use the light header; kept so existing callers compile. */
  image?: string;
  /** @deprecated See `image`. */
  imagePosition?: string;
  size?: 'sm' | 'md';
  /** Extra content under the copy (CTAs, chips, steps...). */
  children?: ReactNode;
  className?: string;
}

/** Light page header shared by every inner page (reference style: airy, navy type, gray eyebrow). */
export function PageHero({
  title,
  description,
  eyebrow,
  breadcrumbs = [],
  size = 'md',
  children,
  className,
}: PageHeroProps) {
  const crumbs: PageHeroCrumb[] = [{ label: 'Ana Sayfa', to: '/' }, ...breadcrumbs];

  return (
    <section className={cn('bg-aq-cloud', className)}>
      <div className={cn('page-container', size === 'sm' ? 'py-8 sm:py-10' : 'py-10 sm:py-14')}>
        {crumbs.length > 1 && (
          <nav aria-label="Sayfa yolu" className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-aq-muted">
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 && <ChevronRight className="h-3 w-3 text-aq-muted/60" aria-hidden />}
                {c.to && i < crumbs.length - 1 ? (
                  <Link to={c.to} className="transition-colors hover:text-aq-ink">{c.label}</Link>
                ) : (
                  <span className={cn(i === crumbs.length - 1 && 'max-w-[60vw] truncate text-aq-ink')}>{c.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-aq-muted">{eyebrow}</p>
        )}
        <h1
          className={cn(
            'max-w-3xl font-bold tracking-[-0.02em] text-aq-ink',
            eyebrow && 'mt-2',
            size === 'sm' ? 'text-2xl sm:text-3xl' : 'text-3xl leading-[1.12] sm:text-4xl',
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-aq-muted sm:text-[15px]">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
