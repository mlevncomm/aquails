import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 min-w-0">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-aq-text tracking-tight">{title}</h1>
        {description && <p className="text-aq-muted mt-1 text-sm">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
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
      className={`bg-white rounded-2xl border border-aq-border/60 min-w-0 ${padding ? 'p-5 sm:p-6' : ''} ${className}`}
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
      className={`w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-white text-aq-text placeholder:text-aq-muted text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 focus:border-aq-blue ${className}`}
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
      className={`w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-white text-aq-text text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 focus:border-aq-blue ${className}`}
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
      className={`w-full px-4 py-2.5 rounded-xl border border-aq-border/60 bg-white text-aq-text placeholder:text-aq-muted text-sm focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 focus:border-aq-blue resize-none ${className}`}
      {...props}
    />
  );
}

export function AdminLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium text-aq-muted mb-1.5 ${className}`}>{children}</label>;
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
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminBreadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-aq-muted mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-aq-border" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-aq-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-aq-text font-medium">{item.label}</span>
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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-aq-muted">{label}</p>
          <p className="text-2xl font-bold text-aq-text mt-1">{value}</p>
          {sub && <p className="text-xs text-aq-muted mt-1">{sub}</p>}
        </div>
        {icon && <div className="p-2.5 rounded-xl bg-aq-sky text-aq-blue">{icon}</div>}
      </div>
    </AdminCard>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-aq-muted text-sm">{message}</div>
  );
}

export function AdminTableWrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <AdminCard padding={false} className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">{children}</div>
    </AdminCard>
  );
}
