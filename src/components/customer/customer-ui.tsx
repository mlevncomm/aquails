import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Inbox, Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CustomerPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('min-w-0 w-full max-w-[1200px]', className)}>{children}</div>;
}

export function CustomerPageHeader({
  title,
  description,
  action,
  breadcrumb,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumb?: { label: string; to?: string }[];
  className?: string;
}) {
  return (
    <div className={cn('mb-6 sm:mb-8 min-w-0', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1 text-sm text-aq-muted mb-3">
          {breadcrumb.map((item, i) => (
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
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-aq-text tracking-tight">{title}</h1>
          {description && (
            <p className="text-aq-muted mt-1 text-sm leading-relaxed">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0 flex flex-wrap gap-2">{action}</div>}
      </div>
    </div>
  );
}

export function CustomerCard({
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

export function CustomerSectionTitle({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-5 py-4 border-b border-aq-border/60',
        className,
      )}
    >
      <h2 className="text-base font-semibold text-aq-text truncate">{title}</h2>
      {action}
    </div>
  );
}

export function CustomerInput({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-aq-ice/50 text-aq-text placeholder:text-aq-muted text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/20 focus:border-aq-blue focus:bg-white min-w-0 transition-colors',
        className,
      )}
      {...props}
    />
  );
}

export function CustomerSelect({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-aq-ice/50 text-aq-text text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/20 focus:border-aq-blue focus:bg-white min-w-0',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function CustomerTextarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-aq-ice/50 text-aq-text placeholder:text-aq-muted text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/20 focus:border-aq-blue focus:bg-white resize-none min-w-0',
        className,
      )}
      {...props}
    />
  );
}

export function CustomerLabel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block text-sm font-medium text-aq-muted mb-1.5', className)}>
      {children}
    </label>
  );
}

export function CustomerButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark';
}) {
  const variants = {
    primary: 'bg-aq-blue hover:bg-aq-deep text-white',
    dark: 'bg-aq-deep hover:bg-aq-navy text-white',
    secondary:
      'bg-white border border-aq-border/60 text-aq-muted hover:border-aq-blue hover:text-aq-blue',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-aq-muted hover:bg-aq-ice hover:text-aq-text',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none min-h-[40px]',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function CustomerEmpty({
  message,
  title = 'Henüz bir şey yok',
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
      <div className="w-14 h-14 rounded-2xl bg-aq-sky/70 flex items-center justify-center mb-4 border border-aq-border/40">
        <Icon className="w-6 h-6 text-aq-blue" />
      </div>
      <p className="text-base font-semibold text-aq-text">{title}</p>
      <p className="text-sm text-aq-muted mt-1.5 max-w-sm leading-relaxed">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function CustomerLoading({
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
        <div key={i} className="h-16 rounded-2xl bg-white border border-aq-border/40" />
      ))}
    </div>
  );
}

export function CustomerFilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 mb-5 min-w-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CustomerChip({
  active,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors min-h-[36px]',
        active
          ? 'bg-aq-deep text-white'
          : 'bg-white border border-aq-border/60 text-aq-muted hover:border-aq-blue hover:text-aq-blue',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function CustomerBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-aq-ice text-aq-muted',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-aq-sky text-aq-blue',
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

export function CustomerStatCard({
  label,
  value,
  icon,
  tone = 'info',
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'neutral';
}) {
  const tones = {
    info: 'bg-aq-sky text-aq-blue',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    neutral: 'bg-aq-ice text-aq-muted',
  };
  return (
    <CustomerCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-aq-muted">{label}</p>
          <p className="text-2xl font-bold text-aq-text mt-1 tabular-nums truncate">{value}</p>
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-xl flex-shrink-0', tones[tone])}>{icon}</div>
        )}
      </div>
    </CustomerCard>
  );
}
