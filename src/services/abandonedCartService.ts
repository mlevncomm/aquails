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

const STORAGE_KEY = 'abandoned-carts';
const SESSION_KEY = 'aquails_abandoned_cart_session';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session-${Date.now()}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function saveCarts(carts: AbandonedCart[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carts.slice(0, 100)));
}

export function syncAbandonedCart(
  items: CartItem[],
  customerName = 'Misafir',
  customerEmail?: string
): void {
  if (!items.length) return;

  const sessionId = getSessionId();
  const carts = getAbandonedCarts();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const existingIdx = carts.findIndex((c) => c.id === sessionId && c.status !== 'converted');

  const cartData: AbandonedCart = {
    id: sessionId,
    customerName,
    customerEmail,
    items,
    total,
    lastActivity: new Date().toISOString(),
    status: existingIdx >= 0 ? carts[existingIdx].status : 'new',
    reminderSentAt: existingIdx >= 0 ? carts[existingIdx].reminderSentAt : undefined,
  };

  if (existingIdx >= 0) {
    carts[existingIdx] = cartData;
  } else {
    carts.unshift(cartData);
  }

  saveCarts(carts);
}

/** @deprecated Use syncAbandonedCart instead */
export function trackAbandonedCart(items: CartItem[], customerName: string, customerEmail?: string): void {
  syncAbandonedCart(items, customerName, customerEmail);
}

export function getAbandonedCarts(): AbandonedCart[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function completeAbandonedCart(): void {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  const carts = getAbandonedCarts().filter((c) => c.id !== sessionId);
  saveCarts(carts);
  localStorage.removeItem(SESSION_KEY);
}

export function sendReminder(id: string): void {
  const carts = getAbandonedCarts();
  const c = carts.find((cart) => cart.id === id);
  if (c) {
    c.status = 'reminder-sent';
    c.reminderSentAt = new Date().toISOString();
  }
  saveCarts(carts);
}

export function markConverted(id: string): void {
  const carts = getAbandonedCarts();
  const c = carts.find((cart) => cart.id === id);
  if (c) c.status = 'converted';
  saveCarts(carts);
}

export function deleteAbandonedCart(id: string): void {
  saveCarts(getAbandonedCarts().filter((c) => c.id !== id));
}

export function getStats() {
  const carts = getAbandonedCarts();
  return {
    total: carts.length,
    new: carts.filter((c) => c.status === 'new').length,
    reminderSent: carts.filter((c) => c.status === 'reminder-sent').length,
    converted: carts.filter((c) => c.status === 'converted').length,
    avgCartValue: carts.length ? Math.round(carts.reduce((s, c) => s + c.total, 0) / carts.length) : 0,
  };
}
