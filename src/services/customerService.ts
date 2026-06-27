import { apiClient } from '@/lib/apiClient';
import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';
import type { User } from '@/services/authService';
import type { Address } from '@/types';

export async function getProfile(): Promise<{ user: User }> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Oturum gerekli');
    const { data, error } = await supabase.from('profiles').select('id, name, email, phone, role').eq('id', authUser.id).single();
    if (error || !data) throw new Error('Profil bulunamadı');
    return { user: data as User };
  }
  return apiClient.get<{ user: User }>('/api/customers/profile');
}

export async function updateProfile(body: { name?: string; phone?: string | null }) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Oturum gerekli');
    const { data, error } = await supabase.from('profiles').update(body).eq('id', user.id).select('id, name, email, phone, role').single();
    if (error) throw new Error(error.message);
    return { user: data as User };
  }
  return apiClient.patch<{ user: User }>('/api/customers/profile', body);
}

function mapAddress(row: Record<string, unknown>): Address {
  return {
    id: String(row.id),
    title: String(row.title),
    city: String(row.city),
    district: String(row.district ?? ''),
    fullAddress: String(row.full_address),
    postalCode: String(row.postal_code ?? ''),
    isDefault: Boolean(row.is_default),
  };
}

export async function getAddresses(): Promise<Address[]> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapAddress(row as Record<string, unknown>));
  }
  return apiClient.get<Address[]>('/api/customers/addresses');
}

export async function createAddress(body: Omit<Address, 'id'>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Oturum gerekli');
    const { data, error } = await supabase.from('addresses').insert({
      user_id: user.id,
      title: body.title,
      city: body.city,
      district: body.district,
      full_address: body.fullAddress,
      postal_code: body.postalCode,
      is_default: body.isDefault,
    }).select('*').single();
    if (error) throw new Error(error.message);
    return mapAddress(data as Record<string, unknown>);
  }
  return apiClient.post<Address>('/api/customers/addresses', body);
}

export async function updateAddress(id: string, body: Partial<Address>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('addresses').update({
      title: body.title,
      city: body.city,
      district: body.district,
      full_address: body.fullAddress,
      postal_code: body.postalCode,
      is_default: body.isDefault,
    }).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return mapAddress(data as Record<string, unknown>);
  }
  return apiClient.patch<Address>(`/api/customers/addresses/${id}`, body);
}

export async function deleteAddress(id: string) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
  return apiClient.delete(`/api/customers/addresses/${id}`);
}

export async function getAdminDashboard() {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const [orders, products, customers] = await Promise.all([
      supabase.from('orders').select('id, total, status', { count: 'exact' }),
      supabase.from('products').select('id, stock', { count: 'exact' }).lte('stock', 5),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
    ]);
    const revenue = (orders.data ?? []).reduce((sum, o) => sum + Number(o.total), 0);
    return {
      totalOrders: orders.count ?? 0,
      totalRevenue: revenue,
      lowStockCount: products.count ?? 0,
      totalCustomers: customers.count ?? 0,
      pendingOrders: (orders.data ?? []).filter((o) => o.status === 'pending').length,
    };
  }
  return apiClient.get<Record<string, unknown>>('/api/admin/dashboard');
}

export async function getAdminCustomers() {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('profiles').select('id, name, email, phone, role, created_at').eq('role', 'customer');
    if (error) throw new Error(error.message);
    return (data ?? []).map((c) => ({
      id: String(c.id),
      name: String(c.name),
      email: String(c.email),
      phone: c.phone ? String(c.phone) : null,
      role: c.role as User['role'],
      registeredAt: String(c.created_at),
      orderCount: 0,
    }));
  }
  return apiClient.get<Array<User & { registeredAt: string; orderCount: number }>>('/api/admin/customers');
}
