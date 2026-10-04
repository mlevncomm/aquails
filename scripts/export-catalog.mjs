#!/usr/bin/env node
/**
 * Exports the live Aquails catalog (Supabase) into the local fallback catalog
 * (src/data/products.ts) and the seed file (supabase/seed.sql).
 *
 * Usage: node --env-file=.env.local scripts/export-catalog.mjs
 */
import { writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required.');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const [{ data: categories, error: catError }, { data: products, error: prodError }] = await Promise.all([
  db.from('categories').select('id, name, slug, icon, description, sort_order, is_active').order('sort_order'),
  db
    .from('products')
    .select(
      'id, category_id, name, slug, sku, description, short_description, price, old_price, stock, rating, review_count, features, specifications, badge, discount_percent, is_active, images:product_images(url, sort_order, alt_text)',
    )
    .eq('is_active', true)
    .order('name'),
]);

if (catError) throw catError;
if (prodError) throw prodError;

const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
const sortedImages = (p) => [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
const escapeSql = (value) => String(value ?? '').replace(/'/g, "''");
const sqlNumber = (value) => (value === null || value === undefined ? 'NULL' : Number(value));

// --- src/data/products.ts -------------------------------------------------
const productsForTs = products.map((p) => {
  const category = categoryById[p.category_id];
  const images = sortedImages(p).map((i) => i.url);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: category?.name ?? '',
    categorySlug: category?.slug ?? '',
    subcategory: category?.name ?? '',
    description: p.description,
    shortDescription: p.short_description,
    price: Number(p.price),
    oldPrice: p.old_price === null ? null : Number(p.old_price),
    rating: Number(p.rating),
    reviewCount: p.review_count,
    stock: p.stock,
    images: images.length ? images : ['/images/products/placeholder.jpg'],
    features: p.features ?? [],
    specifications: p.specifications ?? {},
    ...(p.badge ? { badge: p.badge } : {}),
    ...(p.discount_percent !== null ? { discountPercent: p.discount_percent } : {}),
  };
});

const categoriesForTs = categories
  .filter((c) => c.is_active)
  .map((c) => ({
    id: c.slug,
    name: c.name,
    description: c.description ?? '',
    productCount: productsForTs.filter((p) => p.categorySlug === c.slug).length,
    icon: c.icon ?? '',
  }));

const productsTs = `// Auto-generated from the live Aquails catalog — do not edit manually.
// Regenerate: npm run catalog:export
import type { Product } from '@/types';

export const products: Product[] = ${JSON.stringify(productsForTs, null, 2)};

export const categories = ${JSON.stringify(categoriesForTs, null, 2)};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = categories.find((c) => c.id === categorySlug);
  if (!cat) return [];
  return products.filter((p) => p.category === cat.name);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const source = products.find((p) => p.id === productId);
  if (!source) return [];
  return products
    .filter((p) => p.category === source.category && p.id !== productId)
    .slice(0, limit);
}

export const packages = [
  {
    id: 'starter',
    name: 'Başlangıç Paketi',
    description: 'Ev tipi su arıtma + kurulum',
    price: 45900,
    features: ['Su arıtma cihazı', 'Ücretsiz kurulum', 'İlk filtre seti'],
  },
  {
    id: 'premium',
    name: 'Premium Paket',
    description: 'Direkt akış cihaz + yıllık filtre aboneliği',
    price: 89900,
    features: ['Direkt akış cihaz', 'Yıllık filtre aboneliği', 'Öncelikli servis'],
    popular: true,
  },
];
`;

writeFileSync('src/data/products.ts', productsTs);
console.log(`Wrote src/data/products.ts (${productsForTs.length} products)`);

// --- supabase/seed.sql ----------------------------------------------------
const sql = [
  '-- Aquails catalog seed, exported from the live catalog.',
  '-- Regenerate: npm run catalog:export',
  '',
  'DELETE FROM public.product_images;',
  'DELETE FROM public.products;',
  'DELETE FROM public.categories;',
  '',
  'INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES',
  categories
    .map(
      (c) =>
        `  ('${c.id}', '${escapeSql(c.name)}', '${escapeSql(c.slug)}', '${escapeSql(c.icon)}', '${escapeSql(c.description)}', ${c.sort_order}, ${c.is_active ? 'TRUE' : 'FALSE'})`,
    )
    .join(',\n') + ';',
  '',
  'INSERT INTO public.products (id, category_id, name, slug, sku, description, short_description, price, old_price, stock, rating, review_count, features, specifications, badge, discount_percent, is_active) VALUES',
  products
    .map(
      (p) =>
        `  ('${p.id}', '${p.category_id}', '${escapeSql(p.name)}', '${escapeSql(p.slug)}', '${escapeSql(p.sku)}', '${escapeSql(p.description)}', '${escapeSql(p.short_description)}', ${sqlNumber(p.price)}, ${sqlNumber(p.old_price)}, ${p.stock}, ${sqlNumber(p.rating)}, ${p.review_count}, '${escapeSql(JSON.stringify(p.features ?? []))}'::jsonb, '${escapeSql(JSON.stringify(p.specifications ?? {}))}'::jsonb, ${p.badge ? `'${p.badge}'` : 'NULL'}, ${sqlNumber(p.discount_percent)}, TRUE)`,
    )
    .join(',\n') + ';',
  '',
  'INSERT INTO public.product_images (product_id, url, sort_order, alt_text) VALUES',
  products
    .flatMap((p) =>
      sortedImages(p).map(
        (i) => `  ('${p.id}', '${escapeSql(i.url)}', ${i.sort_order}, '${escapeSql(i.alt_text ?? p.name)}')`,
      ),
    )
    .join(',\n') + ';',
  '',
];

writeFileSync('supabase/seed.sql', sql.join('\n'));
console.log('Wrote supabase/seed.sql');
