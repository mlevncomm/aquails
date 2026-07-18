import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import type { DbStockNotification } from '@/types/database';

export interface StockNotification {
  id: string;
  productName: string;
  email: string;
  date: string;
  notified: boolean;
}

export async function subscribeStockAlert(input: {
  productId: string;
  productName: string;
  email: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('subscribe_stock_notification', {
    p_product_id: input.productId,
    p_email: input.email,
  });

  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean } | null;
  if (!result?.success) return { success: false, error: 'Bildirim kaydı oluşturulamadı.' };
  return { success: true };
}

export async function getStockNotifications(): Promise<StockNotification[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('stock_notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as DbStockNotification[]).map((n) => ({
    id: n.id,
    productName: n.product_name,
    email: n.email,
    date: formatDateTR(n.created_at),
    notified: n.notified,
  }));
}

export async function markNotified(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('queue_stock_notification', { p_notification_id: id });
  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean } | null;
  if (!result?.success) return { success: false, error: 'Bildirim kuyruğa alınamadı.' };
  return { success: true };
}

export async function deleteStockNotification(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('stock_notifications').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
