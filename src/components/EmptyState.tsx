import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
  actionNode?: ReactNode;
  className?: string;
  variant?: 'default' | 'premium';
}

export function EmptyState({ icon, title, description, action, actionNode, className, variant = 'premium' }: EmptyStateProps) {
  if (variant === 'default') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
        <div className="w-16 h-16 bg-aq-sky rounded-2xl flex items-center justify-center text-aq-muted mb-4">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-aq-text mb-1">{title}</h3>
        <p className="text-sm text-aq-muted max-w-[280px] mb-5">{description}</p>
        {action && (
          <Link
            to={action.href}
            className="inline-flex items-center gap-2 bg-aq-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all"
          >
            {action.label}
          </Link>
        )}
        {actionNode && <div className="mt-2">{actionNode}</div>}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-aq-blue/10 to-aq-aqua/10 rounded-full blur-xl scale-150" />
        <div className="relative w-20 h-20 bg-aq-ice rounded-2xl flex items-center justify-center text-aq-blue border border-aq-border/60">
          {icon}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-aq-text mb-2">{title}</h3>
      <p className="text-sm text-aq-muted max-w-[320px] mb-6 leading-relaxed">{description}</p>

      {action && (
        <Link
          to={action.href}
          className="inline-flex items-center gap-2 bg-aq-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white hover:-translate-y-0.5 transition-all"
        >
          {action.label}
        </Link>
      )}
      {actionNode && <div className="mt-2">{actionNode}</div>}

      <div className="flex items-center gap-1.5 mt-8">
        <div className="w-1.5 h-1.5 rounded-full bg-aq-ice" />
        <div className="w-2 h-2 rounded-full bg-aq-border" />
        <div className="w-1.5 h-1.5 rounded-full bg-aq-ice" />
      </div>
    </motion.div>
  );
}
