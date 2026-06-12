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
        <div className="w-16 h-16 bg-[#F0F6FF] rounded-2xl flex items-center justify-center text-[#8B9DAF] mb-4">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-[#0D2137] mb-1">{title}</h3>
        <p className="text-sm text-[#8B9DAF] max-w-[280px] mb-5">{description}</p>
        {action && (
          <Link
            to={action.href}
            className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all"
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
      {/* Premium animated icon container */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A73E8]/10 to-[#00C9A7]/10 rounded-full blur-xl scale-150" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-[#F0F6FF] to-[#E8F4FD] rounded-2xl flex items-center justify-center text-[#1A73E8] shadow-sm border border-[#E8F0FE]">
          {icon}
        </div>
      </div>

      {/* Title with gradient accent */}
      <h3 className="text-lg font-bold text-[#0D2137] mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-[#8B9DAF] max-w-[320px] mb-6 leading-relaxed">{description}</p>

      {/* Action button */}
      {action && (
        <Link
          to={action.href}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#1557B0] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#1A73E8]/20 hover:-translate-y-0.5 transition-all"
        >
          {action.label}
        </Link>
      )}
      {actionNode && <div className="mt-2">{actionNode}</div>}

      {/* Decorative dots */}
      <div className="flex items-center gap-1.5 mt-8">
        <div className="w-1.5 h-1.5 rounded-full bg-[#E8F0FE]" />
        <div className="w-2 h-2 rounded-full bg-[#D6E3F0]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#E8F0FE]" />
      </div>
    </motion.div>
  );
}
