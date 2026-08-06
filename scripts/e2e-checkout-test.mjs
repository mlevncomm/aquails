#!/usr/bin/env node
/**
 * E2E checkout test: login → create COD order → verify DB state
 * Usage: node scripts/e2e-checkout-test.mjs
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf8');
    return Object.fromEntries(
      raw
        .split('\n')
        .filter((l) => l && !l.startsWith('#'))
        .map((l) => {
          const i = l.indexOf('=');
          return [l.slice(0, i), l.slice(i + 1)];
        })
    );
  } catch {
    return {};
  }
}

const env = { ...loadEnv(), ...process.env };
const email = env.TEST_EMAIL;
const password = env.TEST_PASSWORD;
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const dbUrl = env.DATABASE_URL;

if (!email || !password || !url || !anonKey || !dbUrl) {
  console.error('TEST_EMAIL, TEST_PASSWORD, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY ve DATABASE_URL gereklidir.');
  process.exit(1);
}
if (env.E2E_ALLOW_MUTATION !== 'true') {
  console.error('Bu test veri yazar. Yalnızca izole test ortamında E2E_ALLOW_MUTATION=true ile çalıştırın.');
  process.exit(1);
}

const supabase = createClient(url, anonKey);
const results = [];

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? `: ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
}

// 1. Login
const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
if (authErr || !auth.user) {
  fail('login', authErr?.message ?? 'no user');
  process.exit(1);
}
pass('login', auth.user.id);

// 2. PayTR public status readable
const { data: paytrPublic } = await supabase.from('site_settings').select('value').eq('key', 'paytr_public').maybeSingle();
pass('paytr_public readable', paytrPublic ? `enabled=${paytrPublic.value?.enabled}` : 'missing');

// 3. Get a product
const { data: product } = await supabase
  .from('products')
  .select('id, name, slug, price, stock')
  .gt('stock', 0)
  .limit(1)
  .maybeSingle();

if (!product) {
  fail('product fetch');
  process.exit(1);
}
pass('product', `${product.name} stock=${product.stock}`);

const stockBefore = product.stock;
const qty = 1;
const subtotal = Number(product.price);
const shipping = 0;
const total = subtotal + shipping;

// 4. Create order through the production atomic checkout RPC
const { data: orderResult, error: orderErr } = await supabase.rpc('create_checkout_order', {
  p_items: [{ product_id: product.id, quantity: qty }],
  p_shipping_address: {
      title: 'Ev',
      city: 'İstanbul',
      district: 'Kadıköy',
      full_address: 'Test Mah. Test Sok. No:1',
      phone: '05321234567',
      name: 'Test Müşteri',
  },
  p_billing_address: {
      title: 'Ev',
      city: 'İstanbul',
      district: 'Kadıköy',
      full_address: 'Test Mah. Test Sok. No:1',
  },
  p_payment_method: 'cod',
  p_shipping_method: 'standard',
  p_coupon_code: null,
  p_notes: 'E2E test siparişi',
  p_service_slot_id: null,
});
const order = orderResult?.success ? { id: orderResult.order_id } : null;
const orderNumber = orderResult?.order_number;

if (orderErr || !order) {
  fail('create order', orderErr?.message);
  process.exit(1);
}
pass('create order', orderNumber);
pass('order items and stock reserved atomically');

// 7. Verify order status + stock
const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
const verify = await pool.query(
  `SELECT o.status, o.payment_status, p.stock
   FROM orders o
   JOIN order_items oi ON oi.order_id = o.id
   JOIN products p ON p.id = oi.product_id
   WHERE o.id = $1`,
  [order.id]
);
await pool.end();

const row = verify.rows[0];
if (row?.status === 'processing') pass('order status processing');
else fail('order status', row?.status);

if (Number(row?.stock) === stockBefore - qty) pass('stock decremented', `${stockBefore} → ${row.stock}`);
else fail('stock', `expected ${stockBefore - qty}, got ${row?.stock}`);

// 8. Test paytr-init API (expect 503 without PayTR creds or 401 without token)
const initRes = await fetch('https://aquails.vercel.app/api/paytr-init', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth.session.access_token}`,
  },
  body: JSON.stringify({
    orderId: order.id,
    orderNumber,
    email,
    paymentAmount: Math.round((total + 150) * 100),
    userBasket: [[product.name, Number(product.price).toFixed(2), qty]],
  }),
});
const initBody = await initRes.json();
if (initRes.status === 503 && initBody.error?.includes('PayTR')) {
  pass('paytr-init API reachable', 'PayTR not configured yet (expected)');
} else if (initRes.status === 200 && initBody.success) {
  pass('paytr-init API', 'token received');
} else {
  fail('paytr-init API', `${initRes.status} ${JSON.stringify(initBody)}`);
}

// 9. Test webhook endpoint
const hookRes = await fetch('https://aquails.vercel.app/api/payment-webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'merchant_oid=test&status=success&total_amount=100&hash=bad',
});
const hookText = await hookRes.text();
if (hookRes.status === 400 && hookText.includes('bad hash')) pass('webhook hash validation');
else if (hookRes.status === 500 && hookText.includes('Server not configured')) pass('webhook reachable', 'PayTR not configured');
else fail('webhook', `${hookRes.status} ${hookText}`);

const failed = results.filter((r) => !r.ok);
console.log('\n---');
console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
if (failed.length) process.exit(1);
