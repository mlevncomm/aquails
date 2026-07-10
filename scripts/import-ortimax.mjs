#!/usr/bin/env node
/**
 * Import catalog from ortimax.com.tr (Shopify) into Aquails.
 * Rebrands Ortimax → Aquails and writes products.ts + supabase/seed.sql
 */
import { writeFileSync } from 'fs';
import { createHash } from 'crypto';

const BASE_URL = 'https://ortimax.com.tr';

const CATEGORY_CONFIG = [
  { handle: 'su-aritma', name: 'Su Arıtma', icon: 'Droplet', description: 'Ev ve iş yeri için profesyonel su arıtma cihazları ve sistemleri', sort: 1 },
  { handle: 'filtreler', name: 'Filtreler', icon: 'Filter', description: 'Su arıtma cihazları için yedek filtreler ve filtre setleri', sort: 2 },
  { handle: 'elektrikli-ev-aletleri', name: 'Elektrikli Ev Aletleri', icon: 'ChefHat', description: 'Mutfak ve ev için elektrikli küçük ev aletleri', sort: 3 },
  { handle: 'ev-temizligi', name: 'Ev Temizliği', icon: 'Sparkles', description: 'Ev temizliği için süpürge ve temizlik robotları', sort: 4 },
  { handle: 'tens-cihazi', name: 'Tens Cihazı', icon: 'Activity', description: 'TENS cihazları ve sağlık ürünleri', sort: 5 },
  { handle: 'ev-gerecleri', name: 'Ev Gereçleri', icon: 'Home', description: 'Mutfak ve ev gereçleri', sort: 6 },
  { handle: 'su-aritma-aksesuarlari', name: 'Su Arıtma Aksesuarları', icon: 'Settings', description: 'Musluk, pompa ve su arıtma yedek parçaları', sort: 7 },
];

// More specific categories first so shared products land in the right menu
const CATEGORY_PRIORITY = [
  'filtreler',
  'su-aritma-aksesuarlari',
  'elektrikli-ev-aletleri',
  'ev-temizligi',
  'tens-cihazi',
  'ev-gerecleri',
  'su-aritma',
];

function rebrand(text) {
  if (!text) return text;
  return text
    .replace(/ORTİMAX/g, 'Aquails')
    .replace(/ORTIMAX/g, 'Aquails')
    .replace(/Ortimax/g, 'Aquails')
    .replace(/ortimax/g, 'Aquails')
    .replace(/ORTİMAX5/g, 'AQUAILS5')
    .replace(/ORTIMAX5/g, 'AQUAILS5');
}

function normalizeSlug(handle) {
  return handle
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function htmlToText(html) {
  if (!html) return '';
  return rebrand(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<h[1-6][^>]*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

function extractFeatures(html) {
  const features = [];
  const liMatches = html.matchAll(/<li[^>]*>[\s\S]*?<\/li>/gi);
  for (const m of liMatches) {
    const text = htmlToText(m[0]).replace(/^•\s*/, '').trim();
    if (text && text.length < 120) features.push(text);
  }
  if (features.length === 0) {
    const h3Matches = html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);
    for (const m of h3Matches) {
      const text = htmlToText(m[1]).trim();
      if (text) features.push(text);
    }
  }
  return [...new Set(features)].slice(0, 8);
}

function ensureHttps(url) {
  if (!url) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return url;
}

function stableUuid(prefix, seed) {
  const hash = createHash('sha256').update(`${prefix}:${seed}`).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

function pseudoRating(id) {
  const n = Number(String(id).slice(-3)) || 50;
  return Math.round((4.1 + (n % 9) * 0.1) * 10) / 10;
}

function pseudoReviews(id) {
  const n = Number(String(id).slice(-4)) || 100;
  return 20 + (n % 180);
}

async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 Aquails-Import/1.0' },
  });
  if (!res.ok) throw new Error(`Failed ${path}: ${res.status}`);
  return res.json();
}

async function main() {
  console.log('Fetching Ortimax catalog...');

  const { products: allProducts } = await fetchJson('/products.json?limit=250');
  console.log(`Found ${allProducts.length} products`);

  const productCollections = new Map();
  for (const handle of CATEGORY_PRIORITY) {
    const { products } = await fetchJson(`/collections/${handle}/products.json?limit=250`);
    for (const p of products || []) {
      if (!productCollections.has(p.id)) productCollections.set(p.id, []);
      productCollections.get(p.id).push(handle);
    }
  }

  const categoryByHandle = Object.fromEntries(CATEGORY_CONFIG.map((c) => [c.handle, c]));
  const categoryProductCounts = Object.fromEntries(CATEGORY_CONFIG.map((c) => [c.handle, 0]));

  const catalogProducts = allProducts.map((p) => {
    const handles = productCollections.get(p.id) || [];
    let categoryHandle = CATEGORY_PRIORITY.find((h) => handles.includes(h));
    if (!categoryHandle) {
      const tag = (p.tags?.[0] || p.product_type || '').toLowerCase();
      if (tag.includes('filtre')) categoryHandle = 'filtreler';
      else if (tag.includes('su arıtma') || tag.includes('su aritma')) categoryHandle = 'su-aritma';
      else if (tag.includes('tens')) categoryHandle = 'tens-cihazi';
      else if (tag.includes('temizlik') || tag.includes('süpürge')) categoryHandle = 'ev-temizligi';
      else if (tag.includes('ev gereç')) categoryHandle = 'ev-gerecleri';
      else categoryHandle = 'su-aritma';
    }

    const category = categoryByHandle[categoryHandle];
    categoryProductCounts[categoryHandle]++;

    const variant = p.variants?.[0] || {};
    const price = Math.round(parseFloat(variant.price || '0'));
    const compareAt = variant.compare_at_price ? Math.round(parseFloat(variant.compare_at_price)) : null;
    const oldPrice = compareAt && compareAt > price ? compareAt : null;
    const discountPercent = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    const images = (p.images || []).map((img) => ensureHttps(img.src));
    const description = htmlToText(p.body_html);
    const shortDescription = description.slice(0, 160) + (description.length > 160 ? '...' : '');
    const features = extractFeatures(p.body_html || '');

    const rawSlug = p.handle
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ort[iİ]max/gi, 'aquails')
      .replace(/orti-max/gi, 'aquails');
    const slug = normalizeSlug(rawSlug);

    let badge;
    if (discountPercent && discountPercent >= 10) badge = 'discount';
    else if (p.tags?.some((t) => /yeni|new/i.test(t))) badge = 'new';

    const specs = {
      Marka: 'Aquails',
      Kategori: category.name,
    };
    if (p.product_type) specs['Ürün Tipi'] = rebrand(p.product_type);
    if (variant.sku) specs['Referans Kodu'] = variant.sku;
    if (p.vendor) specs['Üretici'] = 'Aquails';

    return {
      id: String(p.id),
      slug,
      name: rebrand(p.title),
      category: category.name,
      categorySlug: category.handle,
      subcategory: category.name,
      description: description || rebrand(p.title),
      shortDescription: shortDescription || rebrand(p.title),
      price,
      oldPrice,
      rating: pseudoRating(p.id),
      reviewCount: pseudoReviews(p.id),
      stock: variant.available === false ? 0 : 10,
      images: images.length ? images : ['/images/products/placeholder.jpg'],
      features: features.length ? features : ['Aquails kalite güvencesi', 'Türkiye geneli servis desteği'],
      specifications: specs,
      badge,
      discountPercent,
    };
  });

  const categories = CATEGORY_CONFIG.map((c) => ({
    id: c.handle,
    name: c.name,
    description: c.description,
    productCount: categoryProductCounts[c.handle] || 0,
    icon: c.icon,
  }));

  // Write products.ts
  const productsForTs = catalogProducts.map(({ categorySlug, ...rest }) => ({ ...rest, categorySlug }));

  const productsTs = `// Auto-generated from ortimax.com.tr — do not edit manually
// Regenerate: node scripts/import-ortimax.mjs
import type { Product } from '@/types';

export const products: Product[] = ${JSON.stringify(productsForTs, null, 2)};

export const categories = ${JSON.stringify(categories, null, 2)};

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
  console.log('Wrote src/data/products.ts');

  // Write seed SQL
  const categoryUuids = Object.fromEntries(
    CATEGORY_CONFIG.map((c) => [c.handle, stableUuid('category', c.handle)])
  );

  const sqlLines = [
    '-- Ortimax catalog import (rebranded as Aquails)',
    '-- Regenerate: node scripts/import-ortimax.mjs',
    '',
    'DELETE FROM public.product_images;',
    'DELETE FROM public.products;',
    'DELETE FROM public.categories;',
    '',
    'INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES',
  ];

  const catValues = CATEGORY_CONFIG.map(
    (c) =>
      `  ('${categoryUuids[c.handle]}', '${escapeSql(c.name)}', '${c.handle}', '${c.icon}', '${escapeSql(c.description)}', ${c.sort}, TRUE)`
  );
  sqlLines.push(catValues.join(',\n') + ';');
  sqlLines.push('');
  sqlLines.push(
    'INSERT INTO public.products (id, category_id, name, slug, sku, description, short_description, price, old_price, stock, rating, review_count, features, specifications, badge, discount_percent, is_active) VALUES'
  );

  const productValues = [];
  const imageValues = [];

  for (const p of catalogProducts) {
    const productUuid = stableUuid('product', p.slug);
    const catUuid = categoryUuids[p.categorySlug || CATEGORY_CONFIG.find((c) => c.name === p.category)?.handle];
    const sku = `AQ-${p.id}`;
    const featuresJson = JSON.stringify(p.features).replace(/'/g, "''");
    const specsJson = JSON.stringify(p.specifications).replace(/'/g, "''");

    productValues.push(
      `  ('${productUuid}', '${catUuid}', '${escapeSql(p.name)}', '${p.slug}', '${escapeSql(sku)}', '${escapeSql(p.description)}', '${escapeSql(p.shortDescription)}', ${p.price}, ${p.oldPrice ?? 'NULL'}, ${p.stock}, ${p.rating}, ${p.reviewCount}, '${featuresJson}'::jsonb, '${specsJson}'::jsonb, ${p.badge ? `'${p.badge}'` : 'NULL'}, ${p.discountPercent ?? 'NULL'}, TRUE)`
    );

    p.images.forEach((url, i) => {
      imageValues.push(
        `  ('${productUuid}', '${escapeSql(url)}', ${i}, '${escapeSql(p.name)}')`
      );
    });
  }

  sqlLines.push(productValues.join(',\n') + ';');
  sqlLines.push('');
  sqlLines.push('INSERT INTO public.product_images (product_id, url, sort_order, alt_text) VALUES');
  sqlLines.push(imageValues.join(',\n') + ';');

  writeFileSync('supabase/seed.sql', sqlLines.join('\n'));
  console.log('Wrote supabase/seed.sql');

  console.log('\nCategory counts:');
  categories.forEach((c) => console.log(`  ${c.name}: ${c.productCount}`));
  console.log(`\nTotal products: ${catalogProducts.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
