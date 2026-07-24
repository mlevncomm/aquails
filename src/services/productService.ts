import { getSupabaseOrNull, isSupabaseConfigured } from '@/lib/supabase';
import {
  products as localProducts,
  categories as localCategories,
  getProductBySlug as getLocalProductBySlug,
  getRelatedProducts as getLocalRelatedProducts,
} from '@/data/products';
import type { Product, Category } from '@/types';
import type { DbProduct, DbCategory, DbProductImage } from '@/types/database';
import { fail, mapDbError, ok, type MutationResult } from '@/lib/mutationResult';

type ProductWithRelations = DbProduct & {
  categories: DbCategory | DbCategory[] | null;
  product_images: DbProductImage[] | null;
  category_id?: string;
  sku?: string;
  is_active?: boolean;
  tax_rate?: number | null;
};

export type AdminProduct = Product & {
  categoryId: string;
  sku: string;
  isActive: boolean;
  imageRecords: DbProductImage[];
};

export type CatalogLoadResult =
  | { ok: true; products: Product[]; source: 'remote' | 'local' }
  | { ok: false; error: string; code: 'not_configured' | 'network' | 'query' };

function getCategoryName(relation: DbCategory | DbCategory[] | null): string {
  if (!relation) return '';
  if (Array.isArray(relation)) return relation[0]?.name ?? '';
  return relation.name;
}

function getCategorySlug(relation: DbCategory | DbCategory[] | null): string {
  if (!relation) return '';
  if (Array.isArray(relation)) return relation[0]?.slug ?? '';
  return relation.slug;
}

function mapDbProduct(row: ProductWithRelations): Product {
  const images = (row.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);
  const categoryName = getCategoryName(row.categories);
  const categorySlug = getCategorySlug(row.categories);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: categoryName,
    categorySlug,
    subcategory: categoryName,
    description: row.description,
    shortDescription: row.short_description,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    taxRate: row.tax_rate != null ? Number(row.tax_rate) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    images: images.length ? images : ['/images/products/placeholder.jpg'],
    features: Array.isArray(row.features) ? row.features : [],
    specifications:
      row.specifications && typeof row.specifications === 'object'
        ? (row.specifications as Record<string, string>)
        : {},
    badge: row.badge ?? undefined,
    discountPercent: row.discount_percent ?? undefined,
  };
}

function mapAdminProduct(row: ProductWithRelations): AdminProduct {
  const product = mapDbProduct(row);
  return {
    ...product,
    categoryId: row.category_id ?? '',
    sku: row.sku ?? '',
    isActive: row.is_active !== false,
    imageRecords: [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

function mapDbCategory(row: DbCategory, productCount = 0): Category {
  return {
    id: row.slug,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? 'Package',
    productCount,
  };
}

const PRODUCT_SELECT = `
  *,
  categories (*),
  product_images (*)
`;

export async function getProducts(): Promise<Product[]> {
  const result = await loadPublicProducts();
  if (result.ok) return result.products;
  if (result.code === 'not_configured') return [...localProducts];
  return [];
}

/** Public catalog loader — no silent local fallback when Supabase is configured. */
export async function loadPublicProducts(): Promise<CatalogLoadResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true, products: [...localProducts], source: 'local' };
  }
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ok: false, error: 'Supabase yapılandırılmamış.', code: 'not_configured' };

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('name');

  if (error) {
    return {
      ok: false,
      error: mapDbError(error.message, 'Ürünler yüklenemedi.'),
      code: /network|fetch|timeout/i.test(error.message) ? 'network' : 'query',
    };
  }
  return {
    ok: true,
    products: (data as unknown as ProductWithRelations[] | null)?.map(mapDbProduct) ?? [],
    source: 'remote',
  };
}

async function fetchProductBySlugFromSupabase(slug: string): Promise<Product | undefined> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapDbProduct(data as unknown as ProductWithRelations);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return getLocalProductBySlug(slug);
  return fetchProductBySlugFromSupabase(slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return localProducts.find((p) => p.id === id);
  const supabase = getSupabaseOrNull();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapDbProduct(data as unknown as ProductWithRelations);
}

export async function bulkUpdateProductPrices(
  categorySlug: string,
  mode: 'percent' | 'fixed_add' | 'set_tax',
  value: number,
): Promise<{ success: boolean; count?: number; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('bulk_update_product_prices', {
    p_category_slug: categorySlug,
    p_mode: mode,
    p_value: value,
  });

  if (error) return { success: false, error: mapDbError(error.message) };
  return { success: true, count: data as number };
}

export async function importProductsBatch(
  rows: AdminProductForm[],
): Promise<{ success: boolean; imported: number; errors: string[] }> {
  let imported = 0;
  const errors: string[] = [];
  for (const row of rows) {
    const res = await createProduct(row);
    if (res.success) imported++;
    else errors.push(`${row.name}: ${res.error}`);
  }
  return { success: errors.length === 0, imported, errors };
}

export async function getRelated(productId: string, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const source = all.find((p) => p.id === productId);
  if (!source) {
    if (!isSupabaseConfigured()) return getLocalRelatedProducts(productId, limit);
    return [];
  }

  return all
    .filter((p) => p.category === source.category && p.id !== productId)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getProducts();

  if (!isSupabaseConfigured()) {
    return localProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }

  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,slug.ilike.%${q}%`);

  if (error) return [];
  return (data as unknown as ProductWithRelations[] | null)?.map(mapDbProduct) ?? [];
}

export interface AdminProductForm {
  name: string;
  slug: string;
  categoryId: string;
  sku?: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  taxRate?: number;
  stock: number;
  isActive: boolean;
  specifications: Record<string, string>;
}

export type AdminProductLoadError = {
  code: 'not_found' | 'forbidden' | 'network' | 'schema' | 'not_configured';
  message: string;
};

export async function getAdminProducts(): Promise<
  | { ok: true; products: AdminProduct[] }
  | { ok: false; error: string; code: 'not_configured' | 'network' | 'query' | 'forbidden' }
> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase yapılandırılmamış.', code: 'not_configured' };
  }
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ok: false, error: 'Supabase yapılandırılmamış.', code: 'not_configured' };

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('name');

  if (error) {
    const msg = mapDbError(error.message, 'Ürünler yüklenemedi.');
    const code =
      /42501|permission|rls|row-level/i.test(error.message) ? 'forbidden'
        : /network|fetch|timeout/i.test(error.message) ? 'network'
          : 'query';
    return { ok: false, error: msg, code };
  }

  return {
    ok: true,
    products: (data as unknown as ProductWithRelations[] | null)?.map(mapAdminProduct) ?? [],
  };
}

export async function getAdminProductById(
  id: string,
): Promise<{ ok: true; product: AdminProduct } | { ok: false; error: AdminProductLoadError }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: { code: 'not_configured', message: 'Supabase yapılandırılmamış.' } };
  }
  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return { ok: false, error: { code: 'not_configured', message: 'Supabase yapılandırılmamış.' } };
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    const message = mapDbError(error.message);
    if (/42501|permission|rls|row-level/i.test(error.message)) {
      return { ok: false, error: { code: 'forbidden', message } };
    }
    if (/network|fetch|timeout/i.test(error.message)) {
      return { ok: false, error: { code: 'network', message } };
    }
    if (/column|schema|does not exist/i.test(error.message)) {
      return { ok: false, error: { code: 'schema', message } };
    }
    return { ok: false, error: { code: 'schema', message } };
  }

  if (!data) {
    return { ok: false, error: { code: 'not_found', message: 'Ürün bulunamadı.' } };
  }

  return { ok: true, product: mapAdminProduct(data as unknown as ProductWithRelations) };
}

export function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ğüşıöç\s-]/gi, '')
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function validateAdminProductForm(input: AdminProductForm): string | null {
  if (!input.name.trim()) return 'Ürün adı zorunludur.';
  if (!input.slug.trim()) return 'Ürün adresi (slug) zorunludur.';
  if (!input.categoryId) return 'Kategori seçilmelidir.';
  if (!Number.isFinite(input.price) || input.price < 0) return 'Geçerli bir fiyat girin.';
  if (!Number.isFinite(input.stock) || input.stock < 0) return 'Geçerli bir stok değeri girin.';
  if (input.taxRate != null && (!Number.isFinite(input.taxRate) || input.taxRate < 0)) {
    return 'Geçerli bir KDV oranı girin.';
  }
  return null;
}

export async function updateProduct(
  id: string,
  input: AdminProductForm,
): Promise<MutationResult<AdminProduct>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');

  const validation = validateAdminProductForm(input);
  if (validation) return fail(validation);

  const slug = normalizeSlug(input.slug);
  const { data, error } = await supabase.rpc('admin_update_product', {
    p_id: id,
    p_name: input.name.trim(),
    p_slug: slug,
    p_category_id: input.categoryId,
    p_sku: input.sku?.trim() || `AQ-${slug}`,
    p_short_description: input.shortDescription,
    p_description: input.description,
    p_price: input.price,
    p_old_price: input.oldPrice ?? null,
    p_stock: input.stock,
    p_is_active: input.isActive,
    p_specifications: input.specifications,
    p_tax_rate: input.taxRate ?? 20,
  });

  if (error) return fail(mapDbError(error.message, 'Ürün güncellenemedi.'));
  if (!data) return fail('Ürün güncellenemedi (satır bulunamadı).');

  const reloaded = await getAdminProductById(id);
  if (!reloaded.ok) return fail(reloaded.error.message);
  return ok(reloaded.product);
}

export async function setProductPrimaryImage(
  productId: string,
  imageId: string,
): Promise<MutationResult> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');

  const { error } = await supabase.rpc('admin_set_product_primary_image', {
    p_product_id: productId,
    p_image_id: imageId,
  });
  if (error) return fail(mapDbError(error.message, 'Ana görsel ayarlanamadı.'));
  return ok();
}

/** @deprecated Prefer addProductImageRecord + gallery APIs */
export async function setProductPrimaryImageByUrl(
  productId: string,
  url: string,
): Promise<MutationResult> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');

  const { data, error } = await supabase.rpc('admin_add_product_image', {
    p_product_id: productId,
    p_url: url,
    p_alt_text: null,
    p_sort_order: 0,
  });
  if (error) return fail(mapDbError(error.message, 'Görsel kaydedilemedi.'));
  if (!data) return fail('Görsel kaydı oluşturulamadı.');

  const row = data as DbProductImage;
  return setProductPrimaryImage(productId, row.id);
}

export async function addProductImageRecord(
  productId: string,
  url: string,
  altText?: string | null,
  sortOrder?: number | null,
): Promise<MutationResult<DbProductImage>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');

  const { data, error } = await supabase.rpc('admin_add_product_image', {
    p_product_id: productId,
    p_url: url,
    p_alt_text: altText ?? null,
    p_sort_order: sortOrder ?? null,
  });
  if (error) return fail(mapDbError(error.message, 'Görsel kaydı eklenemedi.'));
  if (!data) return fail('Görsel kaydı eklenemedi.');
  return ok(data as DbProductImage);
}

export async function reorderProductImages(
  productId: string,
  orderedIds: string[],
): Promise<MutationResult> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');
  const { error } = await supabase.rpc('admin_reorder_product_images', {
    p_product_id: productId,
    p_ordered_ids: orderedIds,
  });
  if (error) return fail(mapDbError(error.message, 'Sıralama güncellenemedi.'));
  return ok();
}

export async function deleteProductImageRecord(
  imageId: string,
): Promise<MutationResult<{ url: string; product_id: string }>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');
  const { data, error } = await supabase.rpc('admin_delete_product_image_record', {
    p_image_id: imageId,
  });
  if (error) return fail(mapDbError(error.message, 'Görsel silinemedi.'));
  const result = data as { success?: boolean; url?: string; product_id?: string } | null;
  if (!result?.success || !result.url || !result.product_id) {
    return fail('Görsel silinemedi.');
  }
  return ok({ url: result.url, product_id: result.product_id });
}

export async function createProduct(
  input: AdminProductForm,
): Promise<MutationResult<{ id: string }>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Servis yapılandırılmamış.');

  const validation = validateAdminProductForm(input);
  if (validation) return fail(validation);

  const slug = normalizeSlug(input.slug);
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name.trim(),
      slug,
      category_id: input.categoryId,
      sku: input.sku?.trim() || `AQ-${slug}`,
      short_description: input.shortDescription,
      description: input.description,
      price: input.price,
      old_price: input.oldPrice ?? null,
      stock: input.stock,
      is_active: input.isActive,
      specifications: input.specifications,
      rating: 0,
      review_count: 0,
      tax_rate: input.taxRate ?? 20,
    })
    .select('id')
    .single();

  if (error || !data) return fail(mapDbError(error?.message, 'Ürün oluşturulamadı.'));
  return ok({ id: data.id });
}

export async function getCategoryOptions(): Promise<{ id: string; name: string; slug: string }[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order');

  if (error) return [];
  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return localCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.id,
      icon: c.icon,
      productCount: c.productCount,
    }));
  }

  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) return [];
  return (data as DbCategory[] | null)?.map((row) => mapDbCategory(row)) ?? [];
}
