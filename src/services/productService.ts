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

function mapDbProduct(row: ProductWithRelations): Product {
  const images = (row.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);
  const categoryName = getCategoryName(row.categories);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: categoryName,
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
  return (data as ProductWithRelations[]).map(mapDbProduct);
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
  return mapDbProduct(data as ProductWithRelations);
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
      return (data as ProductWithRelations[]).map(mapDbProduct);
    }
  }

  return localProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
  );
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
