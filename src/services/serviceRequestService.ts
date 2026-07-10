import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import type { DbServiceRequest } from '@/types/database';

export interface AdminServiceRequest {
  id: string;
  customer: string;
  device: string;
  type: string;
  address: string;
  date: string;
  status: DbServiceRequest['status'];
  tech: string;
}

export interface CustomerServiceRequest {
  id: string;
  type: string;
  typeKey: DbServiceRequest['type'];
  address: string;
  date: string;
  description: string;
  status: DbServiceRequest['status'];
}

const TYPE_LABELS: Record<DbServiceRequest['type'], string> = {
  installation: 'Kurulum',
  filter_change: 'Filtre Değişimi',
  maintenance: 'Bakım',
  repair: 'Arıza',
};

const TYPE_FROM_LABEL: Record<string, DbServiceRequest['type']> = {
  Kurulum: 'installation',
  'Filtre Değişimi': 'filter_change',
  Bakım: 'maintenance',
  Arıza: 'repair',
  'Genel Kontrol': 'maintenance',
};

type ServiceWithProfile = DbServiceRequest & {
  profiles: { name: string } | null;
};

function mapRequest(row: ServiceWithProfile): AdminServiceRequest {
  return {
    id: row.id,
    customer: row.profiles?.name ?? 'Müşteri',
    device: row.description.split('|')[0]?.trim() || 'Cihaz',
    type: TYPE_LABELS[row.type] ?? row.type,
    address: row.address,
    date: row.preferred_date ? formatDateTR(row.preferred_date) : formatDateTR(row.created_at),
    status: row.status,
    tech: row.assigned_to ?? '',
  };
}

function mapCustomerRequest(row: DbServiceRequest): CustomerServiceRequest {
  const parts = row.description.split('|');
  return {
    id: row.id,
    type: TYPE_LABELS[row.type] ?? row.type,
    typeKey: row.type,
    address: row.address,
    date: row.preferred_date ? formatDateTR(row.preferred_date) : formatDateTR(row.created_at),
    description: parts.length > 1 ? parts.slice(1).join('|').trim() : row.description,
    status: row.status,
  };
}

export async function getServiceRequests(): Promise<AdminServiceRequest[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('service_requests')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ServiceWithProfile[]).map(mapRequest);
}

export async function getCustomerServiceRequests(userId: string): Promise<CustomerServiceRequest[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('service_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data ?? []).map(mapCustomerRequest);
}

export function labelToServiceType(label: string): DbServiceRequest['type'] {
  return TYPE_FROM_LABEL[label] ?? 'maintenance';
}

export async function updateServiceRequest(
  id: string,
  updates: { status?: DbServiceRequest['status']; assigned_to?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('service_requests').update(updates).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function createServiceRequest(input: {
  userId: string;
  type: DbServiceRequest['type'];
  address: string;
  description: string;
  preferredDate?: string;
  deviceName?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const description = input.deviceName
    ? `${input.deviceName} | ${input.description}`
    : input.description;

  const { error } = await supabase.from('service_requests').insert({
    user_id: input.userId,
    type: input.type,
    address: input.address,
    description,
    preferred_date: input.preferredDate ?? null,
    status: 'pending',
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getPendingServiceCount(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;

  const { count } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return count ?? 0;
}

export async function getTodayScheduledCount(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { count } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'scheduled')
    .gte('preferred_date', start.toISOString())
    .lte('preferred_date', end.toISOString());

  return count ?? 0;
}
