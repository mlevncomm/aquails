import { getSupabaseOrNull } from '@/lib/supabase';
import type { DbAddress } from '@/types/database';

export interface Address {
  id: string;
  title: string;
  type: 'shipping' | 'billing';
  city: string;
  district: string;
  fullAddress: string;
  postalCode?: string;
  isDefault: boolean;
}

function mapAddress(row: DbAddress): Address {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    city: row.city,
    district: row.district,
    fullAddress: row.full_address,
    postalCode: row.postal_code ?? undefined,
    isDefault: row.is_default,
  };
}

export async function getAddresses(userId: string): Promise<Address[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error || !data) return [];
  return (data as DbAddress[]).map(mapAddress);
}

export async function createAddress(
  userId: string,
  input: Omit<Address, 'id'>
): Promise<{ success: boolean; address?: Address; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  if (input.isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      title: input.title,
      type: input.type,
      city: input.city,
      district: input.district,
      full_address: input.fullAddress,
      postal_code: input.postalCode ?? null,
      is_default: input.isDefault,
    })
    .select()
    .single();

  if (error || !data) return { success: false, error: error?.message };
  return { success: true, address: mapAddress(data as DbAddress) };
}

export async function updateAddress(
  id: string,
  userId: string,
  input: Omit<Address, 'id'>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  if (input.isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  }

  const { error } = await supabase
    .from('addresses')
    .update({
      title: input.title,
      type: input.type,
      city: input.city,
      district: input.district,
      full_address: input.fullAddress,
      postal_code: input.postalCode ?? null,
      is_default: input.isDefault,
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAddress(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
