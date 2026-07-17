#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const migration = readFileSync('supabase/migrations/20260718000100_production_hardening.sql', 'utf8');
const checks = [
  ['atomic checkout RPC', /CREATE OR REPLACE FUNCTION public\.create_checkout_order/],
  ['direct order insert removed', /DROP POLICY IF EXISTS "orders_insert_own"/],
  ['profile privilege trigger', /protect_profile_privileged_fields/],
  ['PayTR service-role finalization', /GRANT EXECUTE ON FUNCTION public\.finalize_paytr_payment\([^)]+\) TO service_role/],
  ['legacy PayTR webhook revoked', /REVOKE ALL ON FUNCTION public\.paytr_handle_webhook[^;]+service_role/],
  ['stored PayTR secrets removed', /DELETE FROM public\.site_settings WHERE key = 'paytr'/],
  ['abandoned cart writes scoped', /CREATE OR REPLACE FUNCTION public\.sync_abandoned_cart/],
  ['subscription price RPC', /CREATE OR REPLACE FUNCTION public\.create_my_subscription/],
];

let failed = 0;
for (const [name, pattern] of checks) {
  if (pattern.test(migration)) console.log(`✓ ${name}`);
  else { console.error(`✗ ${name}`); failed += 1; }
}
if (failed) process.exit(1);
