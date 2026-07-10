import { getSupabaseOrNull } from '@/lib/supabase';

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data: cats, error } = await supabase
    .from('categories')
    .select('id, slug, name, icon, sort_order, is_active')
    .order('sort_order');

  if (error) throw error;

  const { data: products } = await supabase.from('products').select('category_id');
  const counts: Record<string, number> = {};
  for (const p of products ?? []) {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
  }

  return (cats ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    sortOrder: c.sort_order,
    isActive: c.is_active,
    productCount: counts[c.id] ?? 0,
  }));
}

export async function createCategory(input: {
  slug: string;
  name: string;
  icon?: string;
  sortOrder?: number;
}): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) throw new Error('Supabase yapılandırılmamış.');

  const { error } = await supabase.from('categories').insert({
    slug: input.slug,
    name: input.name,
    icon: input.icon ?? 'Droplet',
    sort_order: input.sortOrder ?? 99,
    is_active: true,
  });
  if (error) throw error;
}

export async function updateCategory(
  id: string,
  input: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>,
): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) throw new Error('Supabase yapılandırılmamış.');

  const row: Record<string, unknown> = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.icon !== undefined) row.icon = input.icon;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  if (input.isActive !== undefined) row.is_active = input.isActive;
  const { error } = await supabase.from('categories').update(row as { name?: string; icon?: string; sort_order?: number; is_active?: boolean }).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) throw new Error('Supabase yapılandırılmamış.');

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
