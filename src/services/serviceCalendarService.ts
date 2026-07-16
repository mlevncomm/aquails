import { getSupabaseOrNull } from '@/lib/supabase';

export interface ServiceSlot {
  id: string;
  date: string;
  time: string;
  label: string;
  available: boolean;
  customerName?: string;
  serviceType?: string;
  address?: string;
  status?: 'available' | 'booked' | 'completed';
}

function mapRow(row: {
  id: string;
  slot_date: string;
  slot_time: string;
  capacity: number;
  booked: number;
  is_available: boolean;
}): ServiceSlot {
  const available = row.is_available && row.booked < row.capacity;
  return {
    id: row.id,
    date: row.slot_date,
    time: row.slot_time,
    label: row.slot_time,
    available,
    status: available ? 'available' : 'booked',
  };
}

async function ensureSlots(daysAhead = 14): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.rpc('ensure_service_slots', { p_days_ahead: daysAhead });
}

export async function generateSlots(daysAhead = 14): Promise<ServiceSlot[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  await ensureSlots(daysAhead);

  const end = new Date();
  end.setDate(end.getDate() + daysAhead);
  const { data } = await supabase
    .from('service_slots')
    .select('*')
    .gte('slot_date', new Date().toISOString().split('T')[0])
    .lte('slot_date', end.toISOString().split('T')[0])
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  return (data ?? []).map(mapRow);
}

export async function bookSlot(
  slotId: string,
  ..._meta: string[]
): Promise<boolean> {
  void _meta;
  const supabase = getSupabaseOrNull();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc('book_service_slot', { p_slot_id: slotId });
  if (error) return false;
  const result = data as { success?: boolean } | null;
  return Boolean(result?.success);
}

export async function getSlotsForDate(date: string): Promise<ServiceSlot[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  await ensureSlots(14);
  const { data } = await supabase
    .from('service_slots')
    .select('*')
    .eq('slot_date', date)
    .order('slot_time', { ascending: true });

  return (data ?? []).map(mapRow);
}

export async function getTodaySlots(): Promise<ServiceSlot[]> {
  const today = new Date().toISOString().split('T')[0];
  return getSlotsForDate(today);
}

export async function getWeekSlots(): Promise<ServiceSlot[]> {
  const slots = await generateSlots(7);
  return slots;
}

export async function completeSlot(slotId: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase
    .from('service_slots')
    .update({ is_available: false, booked: 999 })
    .eq('id', slotId);
}
