#!/usr/bin/env node
/**
 * Create or update Aquails admin user in Supabase.
 * Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/create-admin.mjs
 * Optional: SUPABASE_SERVICE_ROLE_KEY in .env for admin API
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
const email = env.ADMIN_EMAIL ?? 'mlevncom@outlook.com.tr';
const password = env.ADMIN_PASSWORD;
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const directUrl = env.DIRECT_URL;

if (!password) {
  console.error('ADMIN_PASSWORD is required.');
  process.exit(1);
}

if (!url || !directUrl) {
  console.error('VITE_SUPABASE_URL and DIRECT_URL are required in .env');
  process.exit(1);
}

async function ensureProfileRole(userId) {
  const client = new pg.Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(
    `UPDATE public.profiles
     SET role = 'super_admin', name = COALESCE(NULLIF(name, ''), 'Aquails Yönetici')
     WHERE id = $1 OR email = $2`,
    [userId, email]
  );
  await client.query(
    `UPDATE auth.users
     SET email_confirmed_at = COALESCE(email_confirmed_at, now())
     WHERE email = $1`,
    [email]
  );
  await client.end();
}

async function main() {
  if (serviceKey) {
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: list } = await admin.auth.admin.listUsers();
    const existing = list?.users?.find((u) => u.email === email);

    if (existing) {
      await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { name: 'Aquails Yönetici' },
      });
      await ensureProfileRole(existing.id);
      console.log('Admin updated:', email);
      return;
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'Aquails Yönetici' },
    });
    if (error) throw error;
    await ensureProfileRole(data.user.id);
    console.log('Admin created:', email);
    return;
  }

  if (!anonKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY required.');
    process.exit(1);
  }

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: 'Aquails Yönetici' } },
  });

  if (error && !error.message.toLowerCase().includes('already')) {
    throw error;
  }

  const userId = data?.user?.id;
  if (userId) await ensureProfileRole(userId);
  else {
    const client = new pg.Client({
      connectionString: directUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const res = await client.query(`SELECT id FROM auth.users WHERE email = $1`, [email]);
    if (res.rows[0]?.id) await ensureProfileRole(res.rows[0].id);
    await client.end();
  }

  console.log('Admin ready:', email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
