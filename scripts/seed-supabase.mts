/**
 * Generates SQL seed for products from src/data/products.ts
 * Run: npm run supabase:seed
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CATEGORY_MAP: Record<string, string> = {
  'Su Arıtma Cihazları': '11111111-1111-1111-1111-111111111101',
  'Direkt Akış Su Arıtma': '11111111-1111-1111-1111-111111111102',
  'Dijital Su Arıtma': '11111111-1111-1111-1111-111111111103',
  Sebiller: '11111111-1111-1111-1111-111111111104',
  'Bina Girişi Filtrasyon': '11111111-1111-1111-1111-111111111105',
  Filtreler: '11111111-1111-1111-1111-111111111106',
  'Membran Filtreler': '11111111-1111-1111-1111-111111111107',
  Musluklar: '11111111-1111-1111-1111-111111111108',
  'Pompa ve Yedek Parçalar': '11111111-1111-1111-1111-111111111109',
  Aksesuarlar: '11111111-1111-1111-1111-111111111110',
  'Elektrikli Ev Aletleri': '11111111-1111-1111-1111-111111111111',
  'Ev Temizliği': '11111111-1111-1111-1111-111111111112',
  'Ev Gereçleri': '11111111-1111-1111-1111-111111111113',
  'Tens Cihazı': '11111111-1111-1111-1111-111111111114',
};

function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

function jsonSql(value: unknown): string {
  return `'${sqlEscape(JSON.stringify(value))}'::jsonb`;
}

function deterministicUuid(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `33333333-3333-3333-3333-${hex.padStart(12, '0').slice(0, 12)}`;
}

const lines: string[] = [
  '-- Auto-generated product seed from src/data/products.ts',
  '-- Idempotent: upsert by slug',
  '',
];

for (const p of products) {
  const categoryId = CATEGORY_MAP[p.category] ?? CATEGORY_MAP[p.subcategory] ?? CATEGORY_MAP.Filtreler;
  const id = deterministicUuid(p.slug);
  lines.push(`INSERT INTO public.products (
  id, name, slug, sku, category_id, description, short_description,
  price, old_price, stock, images, features, specifications,
  rating, review_count, badge, discount_percent, is_active
) VALUES (
  '${id}',
  '${sqlEscape(p.name)}',
  '${sqlEscape(p.slug)}',
  '${sqlEscape(p.id)}',
  '${categoryId}',
  '${sqlEscape(p.description)}',
  '${sqlEscape(p.shortDescription)}',
  ${p.price},
  ${p.oldPrice ?? 'NULL'},
  ${p.stock},
  ${jsonSql(p.images)},
  ${jsonSql(p.features)},
  ${jsonSql(p.specifications)},
  ${p.rating},
  ${p.reviewCount},
  ${p.badge ? `'${p.badge}'` : 'NULL'},
  ${p.discountPercent ?? 'NULL'},
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  old_price = EXCLUDED.old_price,
  stock = EXCLUDED.stock,
  images = EXCLUDED.images,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  badge = EXCLUDED.badge,
  discount_percent = EXCLUDED.discount_percent,
  is_active = true;`);
  lines.push('');
}

const outPath = resolve(__dirname, '../supabase/migrations/004_seed_products.sql');
writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Wrote ${products.length} products to ${outPath}`);
