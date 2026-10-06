import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';

export interface FilterDevice {
  id: string;
  deviceName: string;
  filterName: string;
  installedAt: string;
  changeIntervalDays: number;
  reminderEnabled: boolean;
  daysRemaining: number;
  lastChangedAt?: string;
}

export async function getFilterDevices(userId: string): Promise<FilterDevice[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('filter_tracking')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data ?? []).map((f) => {
    const base = f.last_changed_at ? new Date(f.last_changed_at) : new Date(f.installed_at);
    const nextChange = new Date(base);
    nextChange.setDate(nextChange.getDate() + f.change_interval_days);
    const daysRemaining = Math.ceil((nextChange.getTime() - Date.now()) / 86400000);
    return {
      id: f.id,
      deviceName: f.device_name,
      filterName: f.filter_name,
      installedAt: formatDateTR(f.installed_at),
      changeIntervalDays: f.change_interval_days,
      reminderEnabled: f.reminder_enabled,
      daysRemaining,
      lastChangedAt: f.last_changed_at ? formatDateTR(f.last_changed_at) : undefined,
    };
  });
}

export async function addFilterDevice(
  userId: string,
  input: { deviceName: string; filterName: string; changeIntervalDays: number; installedAt?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('filter_tracking').insert({
    user_id: userId,
    device_name: input.deviceName,
    filter_name: input.filterName,
    change_interval_days: input.changeIntervalDays,
    ...(input.installedAt ? { installed_at: input.installedAt } : {}),
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleFilterReminder(id: string, enabled: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase
    .from('filter_tracking')
    .update({ reminder_enabled: enabled })
    .eq('id', id)
    .select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Kayıt güncellenemedi.' };
  return { success: true };
}

export async function markFilterChanged(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase
    .from('filter_tracking')
    .update({ last_changed_at: new Date().toISOString().slice(0, 10) })
    .eq('id', id)
    .select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Kayıt güncellenemedi.' };
  return { success: true };
}

export async function deleteFilterDevice(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.from('filter_tracking').delete().eq('id', id).select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Kayıt silinemedi.' };
  return { success: true };
}

/** Admin: run the daily reminder job now; returns how many reminders were queued. */
export async function adminRunFilterReminders(): Promise<{ success: boolean; error?: string; upcoming?: number; overdue?: number }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.rpc('admin_run_filter_reminders');
  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean; upcoming?: number; overdue?: number } | null;
  if (!result?.success) return { success: false, error: 'Hatırlatmalar gönderilemedi.' };
  return { success: true, upcoming: result.upcoming ?? 0, overdue: result.overdue ?? 0 };
}

export interface AdminFilterDevice extends FilterDevice {
  userId: string;
  customer: string;
  email: string;
  phone: string;
}

/** Admin: every tracked device across customers, soonest change first. */
export async function getAllFilterDevices(): Promise<AdminFilterDevice[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('filter_tracking')
    .select('*, profiles(name, email, phone)')
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  return (data as unknown as (Record<string, unknown> & {
    id: string; user_id: string; device_name: string; filter_name: string; installed_at: string;
    change_interval_days: number; reminder_enabled: boolean; last_changed_at: string | null;
    profiles: { name: string | null; email: string; phone: string | null } | null;
  })[])
    .map((f) => {
      const base = f.last_changed_at ? new Date(f.last_changed_at) : new Date(f.installed_at);
      const next = new Date(base);
      next.setDate(next.getDate() + f.change_interval_days);
      return {
        id: f.id,
        userId: f.user_id,
        customer: f.profiles?.name || 'Müşteri',
        email: f.profiles?.email ?? '',
        phone: f.profiles?.phone ?? '',
        deviceName: f.device_name,
        filterName: f.filter_name,
        installedAt: formatDateTR(f.installed_at),
        changeIntervalDays: f.change_interval_days,
        reminderEnabled: f.reminder_enabled,
        daysRemaining: Math.ceil((next.getTime() - Date.now()) / 86400000),
        lastChangedAt: f.last_changed_at ? formatDateTR(f.last_changed_at) : undefined,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}
