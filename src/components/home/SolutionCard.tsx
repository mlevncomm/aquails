import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';

interface SolutionCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  href?: string;
}

export function SolutionCard({ icon: Icon, title, desc, href }: SolutionCardProps) {
  const inner = (
    <>
      <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center mb-4 group-hover:bg-[#1A73E8] transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#1A73E8] group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-[#0D2137] mb-2 group-hover:text-[#1A73E8] transition-colors">{title}</h3>
      <p className="text-sm text-[#5A6B7B] leading-relaxed line-clamp-3">{desc}</p>
    </>
  );

  if (href) {
    return (
      <Link to={href} className="group cropsync-card p-6 sm:p-7 block h-full">
        {inner}
      </Link>
    );
  }

  return <div className="group cropsync-card p-6 sm:p-7 h-full">{inner}</div>;
}
