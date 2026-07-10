import { getSupabaseOrNull } from '@/lib/supabase';
import { getCurrentUser } from '@/services/authService';

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

const SESSION_KEY = 'aquails_abandoned_cart_session';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function mapCart(row: {
  id: string;
  customer_name: string;
  customer_email: string | null;
  items: unknown;
  total: number;
  last_activity: string;
  status: AbandonedCart['status'];
  reminder_sent_at: string | null;
}): AbandonedCart {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email ?? undefined,
    items: Array.isArray(row.items) ? (row.items as CartItem[]) : [],
    total: Number(row.total),
    lastActivity: row.last_activity,
    status: row.status,
    reminderSentAt: row.reminder_sent_at ?? undefined,
  };
}

export async function syncAbandonedCart(
  items: CartItem[],
  customerName = 'Misafir',
  customerEmail?: string
): Promise<void> {
  if (!items.length) return;

  const supabase = getSupabaseOrNull();
  if (!supabase) return;

  const sessionId = getSessionId();
  const user = await getCurrentUser();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: existing } = await supabase
    .from('abandoned_carts')
    .select('id, status, reminder_sent_at')
    .eq('session_id', sessionId)
    .neq('status', 'converted')
    .maybeSingle();

  const payload = {
    session_id: sessionId,
    user_id: user?.id ?? null,
    customer_name: customerName,
    customer_email: customerEmail ?? null,
    items,
    total,
    last_activity: new Date().toISOString(),
    status: (existing?.status ?? 'new') as AbandonedCart['status'],
    reminder_sent_at: existing?.reminder_sent_at ?? null,
  };

  if (existing?.id) {
    await supabase.from('abandoned_carts').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('abandoned_carts').insert(payload);
  }
}

/** @deprecated Use syncAbandonedCart instead */
export function trackAbandonedCart(items: CartItem[], customerName: string, customerEmail?: string): void {
  void syncAbandonedCart(items, customerName, customerEmail);
}

export async function getAbandonedCarts(): Promise<AbandonedCart[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .order('last_activity', { ascending: false });

  if (error || !data) return [];
  return data.map(mapCart);
}

export async function completeAbandonedCart(): Promise<void> {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  const supabase = getSupabaseOrNull();
  if (!supabase) return;

  await supabase.rpc('mark_abandoned_cart_converted', { p_session_id: sessionId });
  localStorage.removeItem(SESSION_KEY);
}

export async function sendReminder(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('abandoned_carts')
    .update({
      status: 'reminder-sent',
      reminder_sent_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markConverted(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('abandoned_carts')
    .update({ status: 'converted' })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAbandonedCart(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('abandoned_carts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getStats() {
  const carts = await getAbandonedCarts();
  return {
    total: carts.length,
    new: carts.filter((c) => c.status === 'new').length,
    reminderSent: carts.filter((c) => c.status === 'reminder-sent').length,
    converted: carts.filter((c) => c.status === 'converted').length,
    avgCartValue: carts.length ? Math.round(carts.reduce((s, c) => s + c.total, 0) / carts.length) : 0,
  };
}
