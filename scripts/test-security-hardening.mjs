#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const migration = readFileSync('supabase/migrations/20260718000100_production_hardening.sql', 'utf8');
const cronMigration = readFileSync('supabase/migrations/20260718000200_email_outbox_pg_cron.sql', 'utf8');
const reliabilityMigration = readFileSync('supabase/migrations/20260718000300_email_outbox_reliability.sql', 'utf8');
const emailWorker = readFileSync('api/process-email-outbox.ts', 'utf8');
const vercelConfig = readFileSync('vercel.json', 'utf8');

const checks = [
  ['atomic checkout RPC', /CREATE OR REPLACE FUNCTION public\.create_checkout_order/, migration],
  ['direct order insert removed', /DROP POLICY IF EXISTS "orders_insert_own"/, migration],
  ['profile privilege trigger', /protect_profile_privileged_fields/, migration],
  ['PayTR service-role finalization', /GRANT EXECUTE ON FUNCTION public\.finalize_paytr_payment\([^)]+\) TO service_role/, migration],
  ['legacy PayTR webhook revoked', /REVOKE ALL ON FUNCTION public\.paytr_handle_webhook[^;]+service_role/, migration],
  ['stored PayTR secrets removed', /DELETE FROM public\.site_settings WHERE key = 'paytr'/, migration],
  ['abandoned cart writes scoped', /CREATE OR REPLACE FUNCTION public\.sync_abandoned_cart/, migration],
  ['subscription price RPC', /CREATE OR REPLACE FUNCTION public\.create_my_subscription/, migration],
  ['cron endpoint requires CRON_SECRET', /if \(!secret \|\| req\.headers\.authorization !== `Bearer \$\{secret\}`\)/, emailWorker],
  ['pg_cron vault site url name', /aquails_site_url/, cronMigration],
  ['pg_cron vault cron secret name', /aquails_cron_secret/, cronMigration],
  ['pg_cron fail-closed without vault', /required Vault secrets missing/, cronMigration],
  ['pg_cron idempotent unschedule', /cron\.unschedule\(j\.jobid\)[\s\S]*jobname = 'aquails-process-email-outbox'/, cronMigration],
  ['pg_cron ten-minute schedule', /cron\.schedule\(\s*'aquails-process-email-outbox',\s*'\*\/10 \* \* \* \*'/, cronMigration],
  ['no hourly vercel cron', (src) => !/"schedule"\s*:\s*"0 \* \* \* \*"/.test(src) && !/"crons"\s*:/.test(src), vercelConfig],
  ['claimed_at column', /ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ/, reliabilityMigration],
  ['stale processing recovery', /status = 'processing'[\s\S]*claimed_at < now\(\) - interval '15 minutes'/, reliabilityMigration],
  ['FOR UPDATE SKIP LOCKED', /FOR UPDATE SKIP LOCKED/, reliabilityMigration],
  ['attempts limit', /attempts < 5/, reliabilityMigration],
  ['claim sets processing claimed_at attempts', /status = 'processing'[\s\S]*claimed_at = now\(\)[\s\S]*attempts = e\.attempts \+ 1/, reliabilityMigration],
  ['claim RPC service_role only', /REVOKE ALL ON FUNCTION public\.claim_email_outbox\(INT\) FROM PUBLIC, anon, authenticated;[\s\S]*GRANT EXECUTE ON FUNCTION public\.claim_email_outbox\(INT\) TO service_role;/, reliabilityMigration],
  ['Resend Idempotency-Key', /['"]Idempotency-Key['"]\s*:\s*idempotencyKeyFor\(job\)/, emailWorker],
  ['idempotency uses dedupe_key or id', /job\.dedupe_key \|\| job\.id/, emailWorker],
  ['idempotency key max 256', /\.slice\(0,\s*256\)/, emailWorker],
  ['sent clears claimed_at', /status:\s*'sent'[\s\S]*claimed_at:\s*null/, emailWorker],
  ['failed clears claimed_at', /status:\s*'failed'[\s\S]*claimed_at:\s*null/, emailWorker],
  ['DB update errors not swallowed', /updateFailures > 0/, emailWorker],
];

const forbiddenInCronSql = [
  ['no SITE_URL literal in cron SQL', /\bSITE_URL\s*=/i],
  ['no CRON_SECRET literal assignment in cron SQL', /\bCRON_SECRET\s*=/i],
  ['no service role key in cron SQL', /SERVICE_ROLE|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\./i],
  ['no vault secret value logging', /RAISE\s+(NOTICE|WARNING|EXCEPTION|LOG|INFO|DEBUG)\s+[^;]*(cron_secret|site_url|decrypted_secret)/i],
];

let failed = 0;
for (const [name, pattern, source] of checks) {
  const ok = typeof pattern === 'function' ? pattern(source) : pattern.test(source);
  if (ok) console.log(`✓ ${name}`);
  else { console.error(`✗ ${name}`); failed += 1; }
}

for (const [name, pattern] of forbiddenInCronSql) {
  if (!pattern.test(cronMigration)) console.log(`✓ ${name}`);
  else { console.error(`✗ ${name}`); failed += 1; }
}

if (failed) process.exit(1);
