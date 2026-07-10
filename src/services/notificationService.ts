import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'order' | 'service' | 'promo' | 'system';
  link?: string;
  isRead: boolean;
  date: string;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  return (data ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type as Notification['type'],
    link: n.link ?? undefined,
    isRead: n.is_read,
    date: formatDateTR(n.created_at, { day: 'numeric', month: 'long', year: 'numeric' }),
  }));
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
}
