#!/usr/bin/env node
/**
 * Create a test customer user via direct Postgres (avoids Supabase signup rate limits).
 * Usage: TEST_EMAIL=... TEST_PASSWORD=... node scripts/create-test-user.mjs
 */
import { readFileSync } from 'fs';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

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
const name = env.TEST_NAME ?? 'Test Müşteri';
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const directUrl = env.DIRECT_URL;

if (!directUrl || !url || !anonKey || !email || !password) {
  console.error('DIRECT_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, TEST_EMAIL ve TEST_PASSWORD gereklidir.');
  process.exit(1);
}
if (env.E2E_ALLOW_MUTATION !== 'true') {
  console.error('Test kullanıcısı yalnızca izole test ortamında E2E_ALLOW_MUTATION=true ile oluşturulabilir.');
  process.exit(1);
}

const client = new pg.Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
await client.connect();

const existing = await client.query(`SELECT id FROM auth.users WHERE email = $1`, [email]);

let userId = existing.rows[0]?.id;

if (!userId) {
  const inserted = await client.query(
    `INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      $1,
      crypt($2, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', $3::text),
      now(), now(),
      '', '', '', ''
    )
    RETURNING id`,
    [email, password, name]
  );
  userId = inserted.rows[0].id;
  console.log(JSON.stringify({ ok: true, action: 'created', email, userId, password }));
} else {
  await client.query(
    `UPDATE auth.users SET encrypted_password = crypt($2, gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE id = $1`,
    [userId, password]
  );
  console.log(JSON.stringify({ ok: true, action: 'updated', email, userId, password }));
}

await client.query(
  `UPDATE public.profiles SET name = $2, role = 'customer' WHERE id = $1`,
  [userId, name]
);

await client.end();

const supabase = createClient(url, anonKey);
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
  console.error('Login verify failed:', error.message);
  process.exit(1);
}
console.log('Login verified OK');
