import { writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[seo-routes] Supabase env missing; keeping committed route manifest.');
  process.exit(0);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const [products, blogs, categories] = await Promise.all([
  db.from('products').select('slug').eq('is_active', true),
  db.from('blog_posts').select('slug').eq('status', 'published'),
  db.from('categories').select('slug').eq('is_active', true),
]);

if (products.error) throw products.error;
if (blogs.error) throw blogs.error;
if (categories.error) throw categories.error;

const clean = (rows = []) =>
  rows
    .map((row) => row.slug)
    .filter((slug) => typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug))
    .filter((slug) => !/(^|-)kopya(?:-\d+)?$/.test(slug));

const source = [
  '// Generated at build time by scripts/generate-seo-route-manifest.mjs.',
  '// Keep this file committed so local tooling has a safe fallback.',
  'export const prerenderedProductSlugs = ' + JSON.stringify(clean(products.data)) + ' as const;',
  'export const prerenderedBlogSlugs = ' + JSON.stringify(clean(blogs.data)) + ' as const;',
  'export const prerenderedCategorySlugs = ' + JSON.stringify(clean(categories.data)) + ' as const;',
  '',
].join('\n');

await writeFile('seo-routes.generated.ts', source, 'utf8');
console.log('[seo-routes] route manifest refreshed.');
