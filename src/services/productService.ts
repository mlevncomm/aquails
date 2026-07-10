import { getSupabaseOrNull } from '@/lib/supabase';
import {
  products as localProducts,
  categories as localCategories,
  getProductBySlug as getLocalProductBySlug,
  getRelatedProducts as getLocalRelatedProducts,
} from '@/data/products';
import type { Product, Category } from '@/types';
import type { DbProduct, DbCategory, DbProductImage } from '@/types/database';

type ProductWithRelations = DbProduct & {
  categories: DbCategory | DbCategory[] | null;
  product_images: DbProductImage[] | null;
};

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

async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('name');

  if (error || !data?.length) return null;
  return (data as unknown as ProductWithRelations[]).map(mapDbProduct);
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

export async function getProducts(): Promise<Product[]> {
  const remote = await fetchProductsFromSupabase();
  return remote ?? [...localProducts];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const remote = await fetchProductBySlugFromSupabase(slug);
  if (remote) return remote;
  return getLocalProductBySlug(slug);
}

export async function getRelated(productId: string, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const source = all.find((p) => p.id === productId);
  if (!source) return getLocalRelatedProducts(productId, limit);

  return all
    .filter((p) => p.category === source.category && p.id !== productId)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getProducts();

  const supabase = getSupabaseOrNull();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,slug.ilike.%${q}%`);

    if (!error && data?.length) {
      return (data as unknown as ProductWithRelations[]).map(mapDbProduct);
    }
  }

  return localProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
  );
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
  stock: number;
  isActive: boolean;
  specifications: Record<string, string>;
}

export async function getAdminProductById(id: string): Promise<(Product & { categoryId?: string; sku?: string; isActive?: boolean }) | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(`${PRODUCT_SELECT}`)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as ProductWithRelations & { category_id?: string; sku?: string; is_active?: boolean };
  const product = mapDbProduct(row);
  return {
    ...product,
    categoryId: row.category_id,
    sku: row.sku ?? undefined,
  };
}

export async function updateProduct(
  id: string,
  input: AdminProductForm,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('products')
    .update({
      name: input.name,
      slug: input.slug,
      category_id: input.categoryId,
      sku: input.sku || `AQ-${input.slug}`,
      short_description: input.shortDescription,
      description: input.description,
      price: input.price,
      old_price: input.oldPrice ?? null,
      stock: input.stock,
      is_active: input.isActive,
      specifications: input.specifications,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function createProduct(
  input: AdminProductForm,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  if (!input.categoryId) return { success: false, error: 'Kategori seçilmelidir.' };

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      slug: input.slug,
      category_id: input.categoryId,
      sku: input.sku || `AQ-${input.slug}`,
      short_description: input.shortDescription,
      description: input.description,
      price: input.price,
      old_price: input.oldPrice ?? null,
      stock: input.stock,
      is_active: input.isActive,
      specifications: input.specifications,
      rating: 0,
      review_count: 0,
    })
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Ürün oluşturulamadı.' };
  return { success: true, id: data.id };
}

export async function getCategoryOptions(): Promise<{ id: string; name: string; slug: string }[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order');

  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return localCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.id,
      icon: c.icon,
      productCount: c.productCount,
    }));
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data?.length) {
    return localCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.id,
      icon: c.icon,
      productCount: c.productCount,
    }));
  }

  return (data as DbCategory[]).map((row) => mapDbCategory(row));
}
