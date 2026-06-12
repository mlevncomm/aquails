import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusMap: Record<string, { label: string; class: string }> = {
  // Order statuses
  pending: { label: 'Bekliyor', class: 'bg-amber-50 text-amber-600' },
  processing: { label: 'Hazırlanıyor', class: 'bg-sky-50 text-sky-600' },
  shipped: { label: 'Kargoda', class: 'bg-blue-50 text-blue-600' },
  delivered: { label: 'Teslim Edildi', class: 'bg-emerald-50 text-emerald-600' },
  cancelled: { label: 'İptal Edildi', class: 'bg-red-50 text-red-600' },
  // Service statuses
  'Bekliyor': { label: 'Bekliyor', class: 'bg-amber-50 text-amber-600' },
  'Planlandı': { label: 'Planlandı', class: 'bg-sky-50 text-sky-600' },
  'Tamamlandı': { label: 'Tamamlandı', class: 'bg-emerald-50 text-emerald-600' },
  'İptal': { label: 'İptal', class: 'bg-red-50 text-red-600' },
  'Kargoda': { label: 'Kargoda', class: 'bg-blue-50 text-blue-600' },
  // Generic
  active: { label: 'Aktif', class: 'bg-emerald-50 text-emerald-600' },
  inactive: { label: 'Pasif', class: 'bg-gray-100 text-gray-500' },
  low: { label: 'Kritik Stok', class: 'bg-red-50 text-red-600' },
  'Yeni': { label: 'Yeni', class: 'bg-violet-50 text-violet-600' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-600' };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        config.class
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', config.class.split(' ')[1].replace('text-', 'bg-'))} />
      {config.label}
    </span>
  );
}
