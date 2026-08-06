export type DbOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

const STATUS_TO_TR: Record<DbOrderStatus, string> = {
  pending: 'Yeni',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  returned: 'İade',
};

const TR_TO_STATUS: Record<string, DbOrderStatus> = {
  Yeni: 'pending',
  Hazırlanıyor: 'processing',
  Kargoda: 'shipped',
  Tamamlandı: 'delivered',
  'İptal Edildi': 'cancelled',
  İade: 'returned',
};

export function orderStatusToTr(status: string): string {
  return STATUS_TO_TR[status as DbOrderStatus] ?? status;
}

export function orderStatusFromTr(label: string): DbOrderStatus {
  return TR_TO_STATUS[label] ?? (label as DbOrderStatus);
}

export const ADMIN_ORDER_STATUS_OPTIONS = [
  'Yeni',
  'Hazırlanıyor',
  'Kargoda',
  'Tamamlandı',
  'İptal Edildi',
  'İade',
] as const;
