interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail?: string;
  items: CartItem[];
  total: number;
  lastActivity: string;
  status: 'new' | 'reminder-sent' | 'converted';
  reminderSentAt?: string;
}

export function trackAbandonedCart(items: CartItem[], customerName: string, customerEmail?: string): void {
  if (!items.length) return;
  const carts = getAbandonedCarts();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  carts.unshift({
    id: Date.now().toString(),
    customerName,
    customerEmail,
    items,
    total,
    lastActivity: new Date().toISOString(),
    status: 'new',
  });
  localStorage.setItem('abandoned-carts', JSON.stringify(carts.slice(0, 100)));
}

export function getAbandonedCarts(): AbandonedCart[] {
  return JSON.parse(localStorage.getItem('abandoned-carts') || '[]');
}

export function sendReminder(id: string): void {
  const carts = getAbandonedCarts();
  const c = carts.find(c => c.id === id);
  if (c) { c.status = 'reminder-sent'; c.reminderSentAt = new Date().toISOString(); }
  localStorage.setItem('abandoned-carts', JSON.stringify(carts));
}

export function markConverted(id: string): void {
  const carts = getAbandonedCarts();
  const c = carts.find(c => c.id === id);
  if (c) c.status = 'converted';
  localStorage.setItem('abandoned-carts', JSON.stringify(carts));
}

export function deleteAbandonedCart(id: string): void {
  const carts = getAbandonedCarts().filter(c => c.id !== id);
  localStorage.setItem('abandoned-carts', JSON.stringify(carts));
}

export function getStats() {
  const carts = getAbandonedCarts();
  return {
    total: carts.length,
    new: carts.filter(c => c.status === 'new').length,
    reminderSent: carts.filter(c => c.status === 'reminder-sent').length,
    converted: carts.filter(c => c.status === 'converted').length,
    avgCartValue: carts.length ? Math.round(carts.reduce((s, c) => s + c.total, 0) / carts.length) : 0,
  };
}
