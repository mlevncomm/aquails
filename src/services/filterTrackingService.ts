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
  input: { deviceName: string; filterName: string; changeIntervalDays: number }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('filter_tracking').insert({
    user_id: userId,
    device_name: input.deviceName,
    filter_name: input.filterName,
    change_interval_days: input.changeIntervalDays,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleFilterReminder(id: string, enabled: boolean): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.from('filter_tracking').update({ reminder_enabled: enabled }).eq('id', id);
}

export async function markFilterChanged(id: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.from('filter_tracking').update({ last_changed_at: new Date().toISOString().slice(0, 10) }).eq('id', id);
}

export async function deleteFilterDevice(id: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.from('filter_tracking').delete().eq('id', id);
}
