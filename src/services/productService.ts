import { apiClient } from '@/lib/apiClient';
import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';
import { mapDbProduct, type DbProduct } from '@/types/database';
import type { Product } from '@/types';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export interface PaginatedProducts {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  isActive?: boolean;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

const PRODUCT_SELECT = '*, categories(slug, name, icon, description)';

async function supabaseGetProducts(params: ProductListParams = {}): Promise<PaginatedProducts> {
  const supabase = requireSupabase();
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('is_active', true);

  if (params.search) query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  if (params.minPrice != null) query = query.gte('price', params.minPrice);
  if (params.maxPrice != null) query = query.lte('price', params.maxPrice);
  if (params.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).maybeSingle();
    if (cat) query = query.eq('category_id', cat.id);
  }

  switch (params.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  return {
    items: (data ?? []).map((row) => mapDbProduct(row as DbProduct)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

async function supabaseGetProduct(slug: string): Promise<Product> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error || !data) throw new Error('Ürün bulunamadı');
  return mapDbProduct(data as DbProduct);
}

async function supabaseGetRelated(productId: string, limit = 4): Promise<Product[]> {
  const supabase = requireSupabase();
  const { data: product } = await supabase.from('products').select('category_id').eq('id', productId).single();
  if (!product?.category_id) return [];

  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(limit);

  return (data ?? []).map((row) => mapDbProduct(row as DbProduct));
}

async function supabaseGetCategories(): Promise<CategoryDto[]> {
  const supabase = requireSupabase();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, slug, name, description, icon, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);

  const { data: products } = await supabase.from('products').select('category_id').eq('is_active', true);
  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    if (p.category_id) counts.set(String(p.category_id), (counts.get(String(p.category_id)) ?? 0) + 1);
  }

    return (categories ?? []).map((c) => ({
      id: String(c.id),
      slug: String(c.slug),
      name: String(c.name),
      description: String(c.description ?? ''),
      icon: String(c.icon ?? 'Package'),
      productCount: counts.get(String(c.id)) ?? 0,
      isActive: Boolean(c.is_active),
    }));
}

async function supabaseGetCategory(slug: string): Promise<CategoryDto> {
  const categories = await supabaseGetCategories();
  const found = categories.find((c) => c.slug === slug);
  if (!found) throw new Error('Kategori bulunamadı');
  return found;
}

export async function getProducts(params: ProductListParams = {}): Promise<PaginatedProducts> {
  if (isSupabaseMode) return supabaseGetProducts(params);
  return apiClient.get<PaginatedProducts>(`/api/products${buildQuery(params as Record<string, string | number | boolean | undefined>)}`);
}

export async function getProduct(slug: string): Promise<Product> {
  if (isSupabaseMode) return supabaseGetProduct(slug);
  return apiClient.get<Product>(`/api/products/${slug}`);
}

export async function getRelated(productId: string, limit = 4): Promise<Product[]> {
  if (isSupabaseMode) return supabaseGetRelated(productId, limit);
  return apiClient.get<Product[]>(`/api/products/${productId}/related?limit=${limit}`);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const result = await getProducts({ search: query, limit: 50 });
  return result.items;
}

export async function getCategories(): Promise<CategoryDto[]> {
  if (isSupabaseMode) return supabaseGetCategories();
  return apiClient.get<CategoryDto[]>('/api/categories');
}

export async function getCategory(slug: string): Promise<CategoryDto> {
  if (isSupabaseMode) return supabaseGetCategory(slug);
  return apiClient.get<CategoryDto>(`/api/categories/${slug}`);
}

export async function adminGetProducts(params: ProductListParams & { includeInactive?: boolean; lowStock?: boolean } = {}) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    let query = supabase.from('products').select(PRODUCT_SELECT, { count: 'exact' });
    if (!params.includeInactive) query = query.eq('is_active', true);
    if (params.lowStock) query = query.lte('stock', 5);
    if (params.search) query = query.ilike('name', `%${params.search}%`);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const from = (page - 1) * limit;
    const { data, count, error } = await query.range(from, from + limit - 1).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const total = count ?? 0;
    return {
      items: (data ?? []).map((row) => mapDbProduct(row as DbProduct)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }
  return apiClient.get<PaginatedProducts>(
    `/api/admin/products${buildQuery({
      ...params,
      includeInactive: params.includeInactive ? 'true' : undefined,
      lowStock: params.lowStock ? 'true' : undefined,
    })}`,
  );
}

export async function adminCreateProduct(body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('products').insert(body).select(PRODUCT_SELECT).single();
    if (error) throw new Error(error.message);
    return mapDbProduct(data as DbProduct);
  }
  return apiClient.post<Product>('/api/admin/products', body);
}

export async function adminUpdateProduct(id: string, body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('products').update(body).eq('id', id).select(PRODUCT_SELECT).single();
    if (error) throw new Error(error.message);
    return mapDbProduct(data as DbProduct);
  }
  return apiClient.patch<Product>(`/api/admin/products/${id}`, body);
}

export async function adminDeleteProduct(id: string) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('products').update({ is_active: false }).eq('id', id).select(PRODUCT_SELECT).single();
    if (error) throw new Error(error.message);
    return mapDbProduct(data as DbProduct);
  }
  return apiClient.delete<Product>(`/api/admin/products/${id}`);
}

export async function adminGetCategories() {
  if (isSupabaseMode) return supabaseGetCategories();
  return apiClient.get<CategoryDto[]>('/api/admin/categories');
}

export async function adminCreateCategory(body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('categories').insert(body).select('*').single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.post<CategoryDto>('/api/admin/categories', body);
}

export async function adminUpdateCategory(id: string, body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('categories').update(body).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.patch<CategoryDto>(`/api/admin/categories/${id}`, body);
}

export async function adminDeleteCategory(id: string) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('categories').update({ is_active: false }).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.delete<CategoryDto>(`/api/admin/categories/${id}`);
}
