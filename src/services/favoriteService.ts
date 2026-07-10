import { getSupabaseOrNull } from '@/lib/supabase';
import { getProductById } from '@/services/productService';
import type { Product } from '@/types';

export async function getFavoriteProducts(userId: string): Promise<Product[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('user_favorites')
    .select('product_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const products: Product[] = [];
  for (const row of data ?? []) {
    const p = await getProductById(row.product_id);
    if (p) products.push(p);
  }
  return products;
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data } = await supabase.from('user_favorites').select('product_id').eq('user_id', userId);
  return (data ?? []).map((r) => r.product_id);
}

export async function addFavorite(userId: string, productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('user_favorites').upsert({ user_id: userId, product_id: productId });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function removeFavorite(userId: string, productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('user_favorites').delete().eq('user_id', userId).eq('product_id', productId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
  const ids = await getFavoriteIds(userId);
  if (ids.includes(productId)) {
    await removeFavorite(userId, productId);
    return false;
  }
  await addFavorite(userId, productId);
  return true;
}
