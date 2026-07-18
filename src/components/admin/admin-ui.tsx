import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Inbox, Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 min-w-0',
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-aq-text tracking-tight">{title}</h1>
        {description && <p className="text-aq-muted mt-1 text-sm leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function AdminPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('min-w-0 w-full', className)}>{children}</div>;
}

export function AdminCard({
  children,
  className = '',
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-aq-border/60 min-w-0 shadow-[0_1px_2px_rgba(7,24,39,0.03)]',
        padding && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminInput({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-white text-aq-text placeholder:text-aq-muted text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 focus:border-aq-blue min-w-0',
        className,
      )}
      {...props}
    />
  );
}

export function AdminSelect({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-white text-aq-text text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 focus:border-aq-blue min-w-0',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function AdminTextarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-white text-aq-text placeholder:text-aq-muted text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 focus:border-aq-blue resize-none min-w-0',
        className,
      )}
      {...props}
    />
  );
}

export function AdminLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <label className={cn('block text-sm font-medium text-aq-muted mb-1.5', className)}>{children}</label>;
}

export function AdminButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  const variants = {
    primary: 'bg-aq-blue hover:bg-aq-deep text-white rounded-xl',
    secondary: 'bg-white border border-aq-border/60 text-aq-muted hover:border-aq-blue hover:text-aq-blue rounded-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white rounded-xl',
    ghost: 'text-aq-muted hover:bg-aq-ice rounded-xl',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none min-h-[40px]',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminBreadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-aq-muted mb-4 sm:mb-5">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1 min-w-0">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-aq-border flex-shrink-0" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-aq-blue transition-colors truncate">
              {item.label}
            </Link>
          ) : (
            <span className="text-aq-text font-medium truncate">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function AdminStatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-aq-muted">{label}</p>
          <p className="text-2xl font-bold text-aq-text mt-1 tabular-nums truncate">{value}</p>
          {sub && <p className="text-xs text-aq-muted mt-1">{sub}</p>}
        </div>
        {icon && <div className="p-2.5 rounded-xl bg-aq-sky text-aq-blue flex-shrink-0">{icon}</div>}
      </div>
    </AdminCard>
  );
}

export function AdminEmpty({
  message,
  title = 'Kayıt bulunamadı',
  icon: Icon = Inbox,
  action,
}: {
  message: string;
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-4">
      <div className="w-12 h-12 rounded-2xl bg-aq-sky flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-aq-blue" />
      </div>
      <p className="text-sm font-semibold text-aq-text">{title}</p>
      <p className="text-sm text-aq-muted mt-1 max-w-sm leading-relaxed">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AdminLoading({
  label = 'Yükleniyor...',
  rows = 4,
  variant = 'skeleton',
}: {
  label?: string;
  rows?: number;
  variant?: 'skeleton' | 'spinner';
}) {
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-aq-muted">
        <Loader2 className="w-6 h-6 animate-spin text-aq-blue" />
        <p className="text-sm">{label}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-aq-ice border border-aq-border/40" />
      ))}
    </div>
  );
}

export function AdminFilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3 mb-5 min-w-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-aq-ice text-aq-muted',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-aq-sky text-aq-blue',
    purple: 'bg-violet-50 text-violet-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Shared order-status chip styles (TR labels). */
export const ORDER_STATUS_TONES: Record<string, 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
  Yeni: 'purple',
  Hazırlanıyor: 'warning',
  Kargoda: 'info',
  Tamamlandı: 'success',
  'İptal Edildi': 'neutral',
  İade: 'danger',
};

export function AdminOrderStatusBadge({ status }: { status: string }) {
  return <AdminBadge tone={ORDER_STATUS_TONES[status] ?? 'neutral'}>{status}</AdminBadge>;
}

export function AdminTableWrap({
  children,
  className = '',
  stickyFirst = false,
}: {
  children: ReactNode;
  className?: string;
  stickyFirst?: boolean;
}) {
  return (
    <AdminCard padding={false} className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'overflow-x-auto',
          stickyFirst &&
            '[&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-10 [&_th:first-child]:bg-aq-ice [&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-[1] [&_td:first-child]:bg-white',
        )}
      >
        {children}
      </div>
    </AdminCard>
  );
}

export function AdminMobileCardList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('md:hidden space-y-3', className)}>{children}</div>;
}

export function AdminDesktopOnly({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('hidden md:block', className)}>{children}</div>;
}
