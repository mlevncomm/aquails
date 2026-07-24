#!/usr/bin/env node
/**
 * Catalog SQL contracts + optional live RPC scenarios.
 * Live mutations refuse production ref and require TEST_DATABASE_URL.
 */
import { readFileSync } from 'node:fs';
import pg from 'pg';

const PRODUCTION_REF = 'lumwisbjvlggtdjcahtj';
const url = process.env.TEST_DATABASE_URL || '';
let failed = 0;

function ok(name) { console.log(`✓ ${name}`); }
function bad(name, detail = '') {
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`);
  failed += 1;
}

const migration = readFileSync('supabase/migrations/20260724000100_admin_catalog_reliability.sql', 'utf8');

const staticChecks = [
  [/DELETE FROM public\.product_images pi[\s\S]*rn > 1/, false, 'normalize without DELETE dedupe'],
  [/DEFERRABLE INITIALLY DEFERRED/, true, 'deferrable unique sort_order'],
  [/PERFORM public\._admin_require_product_lock/, true, 'product FOR UPDATE lock helper'],
  [/reorder requires complete image list/, true, 'reorder rejects incomplete list'],
  [/reorder ids must be unique/, true, 'reorder rejects duplicates'],
  [/reorder contains unknown image id/, true, 'reorder rejects foreign ids'],
  [/admin_adjust_product_stock/, true, 'atomic stock RPC'],
  [/admin_save_shipping_bundle/, true, 'atomic shipping RPC'],
  [/p_tax_rate < 0 OR p_tax_rate > 100/, true, 'tax_rate 0..100 validation'],
  [/p_old_price IS NOT NULL AND p_old_price < 0/, true, 'old_price >= 0 validation'],
];

for (const [re, expectMatch, name] of staticChecks) {
  const hit = re.test(migration);
  if (hit === expectMatch) ok(`sql contract: ${name}`);
  else bad(`sql contract: ${name}`);
}

if (!url) {
  console.log('⊘ skip live SQL RPC scenarios (TEST_DATABASE_URL not set)');
  if (failed) process.exit(1);
  console.log('\nSQL catalog static contracts passed');
  process.exit(0);
}

if (url.includes(PRODUCTION_REF)) {
  bad('fail-closed: refuse production ref mutations');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  await client.query('begin');
  const { rows: fns } = await client.query(`
    select proname from pg_proc
    where pronamespace = 'public'::regnamespace
      and proname = any($1::text[])
  `, [[
    'admin_set_product_primary_image',
    'admin_reorder_product_images',
    'admin_add_product_image',
    'admin_delete_product_image_record',
  ]]);
  if (fns.length < 4) {
    console.log('⊘ skip live RPC scenarios (functions not applied)');
    await client.query('rollback');
  } else {
    ok('live RPC functions present');
    // Live scenarios require is_admin(); without a test admin session we only verify presence.
    console.log('ℹ full concurrent/primary live scenarios need authenticated admin session — skipped here');
    await client.query('rollback');
  }
} catch (err) {
  await client.query('rollback').catch(() => {});
  bad('live sql', err instanceof Error ? err.message : String(err));
} finally {
  await client.end();
}

if (failed) process.exit(1);
console.log('\nSQL catalog checks passed');
