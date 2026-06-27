import { apiClient } from '@/lib/apiClient';
import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';
import { invokeFunction } from '@/lib/api';

export interface ServiceSlot {
  id: string;
  date: string;
  time: string;
  label: string;
  available: boolean;
  status: string;
  customerName?: string | null;
  customerPhone?: string | null;
  serviceType?: string | null;
  address?: string | null;
  orderId?: string | null;
}

function mapSlot(row: Record<string, unknown>): ServiceSlot {
  const start = String(row.start_time ?? '').slice(0, 5);
  const end = String(row.end_time ?? '').slice(0, 5);
  return {
    id: String(row.id),
    date: String(row.date),
    time: start,
    label: `${start} - ${end}`,
    available: row.status === 'available',
    status: String(row.status),
    orderId: row.order_id ? String(row.order_id) : null,
  };
}

async function supabaseGetSlotsForDate(date: string): Promise<ServiceSlot[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('service_slots')
    .select('*')
    .eq('date', date)
    .eq('status', 'available')
    .order('start_time', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSlot(row as Record<string, unknown>));
}

export async function getSlotsForDate(date: string): Promise<ServiceSlot[]> {
  if (isSupabaseMode) return supabaseGetSlotsForDate(date);
  return apiClient.get<ServiceSlot[]>(`/api/service-slots?date=${encodeURIComponent(date)}`);
}

export async function bookSlot(payload: {
  slotId: string;
  customerName: string;
  customerPhone: string;
  serviceType?: string;
  address?: string;
  orderId?: string;
}) {
  if (isSupabaseMode) {
    return invokeFunction('create-service-request', {
      slotId: payload.slotId,
      type: payload.serviceType ?? 'installation',
      description: `${payload.customerName} - ${payload.customerPhone}`,
      address: payload.address ? { fullAddress: payload.address } : null,
    });
  }
  return apiClient.post<ServiceSlot>('/api/service-slots/book', payload);
}

export async function adminGetSlots(): Promise<ServiceSlot[]> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('service_slots').select('*').order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapSlot(row as Record<string, unknown>));
  }
  return apiClient.get<ServiceSlot[]>('/api/admin/service-slots');
}

export async function adminCreateSlot(body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('service_slots').insert(body).select('*').single();
    if (error) throw new Error(error.message);
    return mapSlot(data as Record<string, unknown>);
  }
  return apiClient.post<ServiceSlot>('/api/admin/service-slots', body);
}

export async function adminUpdateSlot(id: string, body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('service_slots').update(body).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return mapSlot(data as Record<string, unknown>);
  }
  return apiClient.patch<ServiceSlot>(`/api/admin/service-slots/${id}`, body);
}

export async function adminDeleteSlot(id: string) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { error } = await supabase.from('service_slots').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
  return apiClient.delete(`/api/admin/service-slots/${id}`);
}

export function generateSlots(): ServiceSlot[] {
  return [];
}

export async function getTodaySlots(): Promise<ServiceSlot[]> {
  const today = new Date().toISOString().slice(0, 10);
  return getSlotsForDate(today);
}

export async function getWeekSlots(): Promise<ServiceSlot[]> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const today = new Date().toISOString().slice(0, 10);
    const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('service_slots')
      .select('*')
      .gte('date', today)
      .lte('date', weekLater)
      .order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapSlot(row as Record<string, unknown>));
  }
  return apiClient.get<ServiceSlot[]>('/api/service-slots');
}

export async function completeSlot(): Promise<void> {
  // Admin updates via adminUpdateSlot
}
