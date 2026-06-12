export interface StockNotification {
  id: string;
  productId: string;
  productName: string;
  email: string;
  phone?: string;
  status: 'pending' | 'notified';
  createdAt: string;
  notifiedAt?: string;
}

export function requestNotification(productId: string, productName: string, email: string, phone?: string): void {
  const notifications = getNotifications();
  notifications.push({
    id: Date.now().toString(),
    productId,
    productName,
    email,
    phone,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('stock-notifications', JSON.stringify(notifications));
}

export function getNotifications(): StockNotification[] {
  return JSON.parse(localStorage.getItem('stock-notifications') || '[]');
}

export function markAsNotified(id: string): void {
  const notifications = getNotifications();
  const n = notifications.find(n => n.id === id);
  if (n) { n.status = 'notified'; n.notifiedAt = new Date().toISOString(); }
  localStorage.setItem('stock-notifications', JSON.stringify(notifications));
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications().filter(n => n.id !== id);
  localStorage.setItem('stock-notifications', JSON.stringify(notifications));
}
