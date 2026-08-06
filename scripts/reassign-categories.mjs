#!/usr/bin/env node
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORY_CONFIG, classifyProduct } from './category-rules.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* optional */
  }
}

loadEnv();

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL or DIRECT_URL required');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();

  const old = await client.query(`SELECT id, slug FROM categories WHERE slug = 'su-aritma'`);
  const oldId = old.rows[0]?.id;

  for (const cat of CATEGORY_CONFIG) {
    await client.query(
      `INSERT INTO categories (slug, name, icon, sort_order, is_active)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order`,
      [cat.slug, cat.name, cat.icon, cat.sortOrder],
    );
  }

  if (oldId) {
    await client.query(`UPDATE categories SET is_active = false WHERE id = $1`, [oldId]);
  }

  const cats = await client.query(`SELECT id, slug FROM categories WHERE is_active = true`);
  const bySlug = Object.fromEntries(cats.rows.map((r) => [r.slug, r.id]));

  const products = await client.query(`SELECT id, slug, name FROM products`);
  const counts = {};

  for (const p of products.rows) {
    const catSlug = classifyProduct(p.slug, p.name);
    const catId = bySlug[catSlug];
    if (!catId) {
      console.warn('No category for', p.slug, '→', catSlug);
      continue;
    }
    await client.query(`UPDATE products SET category_id = $1 WHERE id = $2`, [catId, p.id]);
    counts[catSlug] = (counts[catSlug] || 0) + 1;
  }

  console.log('Category distribution:');
  for (const c of CATEGORY_CONFIG) {
    console.log(`  ${c.name}: ${counts[c.slug] || 0}`);
  }

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
