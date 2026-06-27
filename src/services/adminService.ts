import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';
import { getAdminDashboard, getAdminCustomers } from '@/services/customerService';
import { adminGetOrders } from '@/services/orderService';

export async function getDashboardMetrics() {
  return getAdminDashboard();
}

export async function getCustomers() {
  return getAdminCustomers();
}

export async function getRecentOrders(limit = 10) {
  return adminGetOrders({ limit, page: 1 });
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseMode) {
    try {
      const raw = localStorage.getItem(`aquails_setting_${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
  const { data } = await requireSupabase().from('site_settings').select('value').eq('key', key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

export async function setSiteSetting(key: string, value: unknown) {
  if (!isSupabaseMode) {
    localStorage.setItem(`aquails_setting_${key}`, JSON.stringify(value));
    return value;
  }
  const { data, error } = await requireSupabase()
    .from('site_settings')
    .upsert({ key, value })
    .select('value')
    .single();
  if (error) throw new Error(error.message);
  return data.value;
}
