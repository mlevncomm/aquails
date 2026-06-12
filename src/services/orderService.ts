const STORAGE_KEY = 'aquails_orders';

export interface CustomerOrder {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  paymentMethod: string;
  shippingAddress: string;
}

export function getCustomerOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return getDefaultOrders();
}

function getDefaultOrders(): CustomerOrder[] {
  return [
    { id: '1', orderNo: 'AQ-2025-1847', date: '10 Haziran 2025', status: 'shipped', total: 12900, items: [{ name: 'Aquails PurePro 7 Aşamalı', qty: 1, price: 12900 }], paymentMethod: 'Kredi Kartı', shippingAddress: 'Pendik/İstanbul' },
    { id: '2', orderNo: 'AQ-2025-1840', date: '7 Haziran 2025', status: 'pending', total: 10240, items: [{ name: 'Compact + Filtre Seti', qty: 2, price: 5120 }], paymentMethod: 'Havale/EFT', shippingAddress: 'Pendik/İstanbul' },
    { id: '3', orderNo: 'AQ-2025-1838', date: '6 Haziran 2025', status: 'delivered', total: 13400, items: [{ name: 'PurePro + Kurulum', qty: 1, price: 13400 }], paymentMethod: 'Kredi Kartı', shippingAddress: 'Pendik/İstanbul' },
    { id: '4', orderNo: 'AQ-2025-1829', date: '1 Haziran 2025', status: 'delivered', total: 1490, items: [{ name: 'Mineral Plus Filtre Seti', qty: 1, price: 1490 }], paymentMethod: 'Kapıda Ödeme', shippingAddress: 'Pendik/İstanbul' },
    { id: '5', orderNo: 'AQ-2025-1815', date: '25 Mayıs 2025', status: 'delivered', total: 39900, items: [{ name: 'Business Pro Endüstriyel', qty: 1, price: 39900 }], paymentMethod: 'Havale/EFT', shippingAddress: 'Kadıköy/İstanbul' },
  ];
}

export function saveOrder(order: CustomerOrder): void {
  const orders = getCustomerOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function generateOrderNo(): string {
  return `AQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}
