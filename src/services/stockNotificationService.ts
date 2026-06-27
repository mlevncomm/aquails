import { apiClient } from '@/lib/apiClient';
import { isSupabaseMode } from '@/lib/dataProvider';
import { invokeFunction } from '@/lib/api';
import { requireSupabase } from '@/lib/supabase';

export async function requestNotification(productId: string, email: string, phone?: string) {
  if (isSupabaseMode) {
    return invokeFunction('stock-notification', { productId, email, phone });
  }
  return apiClient.post('/api/stock-notifications', { productId, email, phone });
}

export async function adminGetNotifications() {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase()
      .from('stock_notifications')
      .select('*, products(name, slug)')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  return apiClient.get('/api/admin/stock-notifications');
}

export async function adminMarkNotified(id: string) {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase()
      .from('stock_notifications')
      .update({ status: 'notified', notified_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.patch(`/api/admin/stock-notifications/${id}/mark-notified`);
}

export async function adminNotifyStockBack(productId: string) {
  if (isSupabaseMode) {
    return invokeFunction('stock-notification', { action: 'notify-pending', productId });
  }
  return apiClient.post('/api/admin/stock-notifications/notify', { productId });
}
