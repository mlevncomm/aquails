#!/usr/bin/env node
/**
 * Full system smoke test — customer account + admin modules
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf8');
    return Object.fromEntries(
      raw.split('\n').filter((l) => l && !l.startsWith('#')).map((l) => {
        const i = l.indexOf('=');
        return [l.slice(0, i), l.slice(i + 1)];
      })
    );
  } catch {
    return {};
  }
}

const env = { ...loadEnv(), ...process.env };
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const dbUrl = env.DATABASE_URL;
const email = env.TEST_EMAIL ?? 'aquails.test.musteri@gmail.com';
const password = env.TEST_PASSWORD ?? 'AquailsTest2026!';

const supabase = createClient(url, anonKey);
const results = [];
const pass = (n, d = '') => { results.push({ n, ok: true, d }); console.log(`✓ ${n}${d ? `: ${d}` : ''}`); };
const fail = (n, d = '') => { results.push({ n, ok: false, d }); console.error(`✗ ${n}${d ? `: ${d}` : ''}`); };

// Login
const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
if (authErr || !auth.user) { fail('login', authErr?.message); process.exit(1); }
pass('login');

const uid = auth.user.id;

// Tables readable
const checks = [
  ['notifications', supabase.from('notifications').select('id').eq('user_id', uid).limit(1)],
  ['user_favorites', supabase.from('user_favorites').select('id').eq('user_id', uid).limit(1)],
  ['return_requests', supabase.from('return_requests').select('id').eq('user_id', uid).limit(1)],
  ['filter_tracking', supabase.from('filter_tracking').select('id').eq('user_id', uid).limit(1)],
  ['loyalty_transactions', supabase.from('loyalty_transactions').select('id').eq('user_id', uid).limit(1)],
  ['subscriptions', supabase.from('subscriptions').select('id').eq('user_id', uid).limit(1)],
  ['service_requests', supabase.from('service_requests').select('id').eq('user_id', uid).limit(1)],
  ['site_settings tax', supabase.from('site_settings').select('value').eq('key', 'tax').maybeSingle()],
  ['site_settings shipping', supabase.from('site_settings').select('value').eq('key', 'shipping_methods').maybeSingle()],
];

for (const [name, query] of checks) {
  const { error } = await query;
  if (error) fail(name, error.message);
  else pass(name);
}

// Service request create
const { error: srErr } = await supabase.from('service_requests').insert({
  user_id: uid,
  type: 'maintenance',
  address: 'Test Adres',
  description: 'E2E test servis',
  status: 'pending',
});
if (srErr) fail('service_request insert', srErr.message);
else pass('service_request insert');

// Filter tracking create
const { error: ftErr } = await supabase.from('filter_tracking').insert({
  user_id: uid,
  device_name: 'E2E Cihaz',
  filter_name: 'Sediment',
});
if (ftErr) fail('filter_tracking insert', ftErr.message);
else pass('filter_tracking insert');

// Return request create
const { error: retErr } = await supabase.from('return_requests').insert({
  user_id: uid,
  order_number: 'AQ-TEST',
  product_name: 'Test Ürün',
  type: 'return',
  reason: 'E2E test',
});
if (retErr) fail('return_request insert', retErr.message);
else pass('return_request insert');

// Notification via RPC path - direct insert as admin would; test table works
const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
await pool.query(
  `SELECT public.create_user_notification($1, 'E2E Test', 'Bildirim testi', 'system', '/hesabim')`,
  [uid]
);
pass('create_user_notification RPC');

// Bulk price RPC exists
const { error: bulkErr } = await supabase.rpc('bulk_update_product_prices', {
  p_category_slug: '',
  p_mode: 'percent',
  p_value: 0,
});
if (bulkErr && !bulkErr.message.includes('Yetkisiz')) fail('bulk_update RPC', bulkErr.message);
else pass('bulk_update RPC', bulkErr?.message.includes('Yetkisiz') ? 'requires admin (expected)' : 'ok');

await pool.end();

const failed = results.filter((r) => !r.ok);
console.log(`\n--- ${results.length - failed.length}/${results.length} passed ---`);
if (failed.length) process.exit(1);
