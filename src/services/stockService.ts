import { getSupabaseOrNull } from '@/lib/supabase';
import type { DbProduct } from '@/types/database';

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  critical: number;
}

const CRITICAL_THRESHOLD = 5;

export async function getStockItems(): Promise<StockItem[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('id, name, sku, stock')
    .order('stock');

  if (error || !data) return [];
  return (data as Pick<DbProduct, 'id' | 'name' | 'sku' | 'stock'>[]).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    stock: p.stock,
    critical: CRITICAL_THRESHOLD,
  }));
}

export async function updateStock(
  id: string,
  stock: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('products')
    .update({ stock: Math.max(0, stock) })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function adjustStock(
  id: string,
  delta: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data } = await supabase.from('products').select('stock').eq('id', id).maybeSingle();
  if (!data) return { success: false, error: 'Ürün bulunamadı.' };

  return updateStock(id, data.stock + delta);
}
