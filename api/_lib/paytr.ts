import crypto from 'node:crypto';
import { query } from './db.js';

export interface PaytrSettings {
  enabled: boolean;
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

export async function getPaytrSettings(): Promise<PaytrSettings | null> {
  const rows = await query<{ value: Record<string, unknown> }>(
    `SELECT value FROM site_settings WHERE key = 'paytr' LIMIT 1`
  );
  const v = rows[0]?.value;
  if (!v) return null;
  return {
    enabled: Boolean(v.enabled),
    merchantId: String(v.merchantId ?? ''),
    merchantKey: String(v.merchantKey ?? ''),
    merchantSalt: String(v.merchantSalt ?? ''),
    testMode: v.testMode !== false,
  };
}

export function paytrHmac(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('base64');
}

export function encodeBasket(items: unknown[]): string {
  return Buffer.from(JSON.stringify(items), 'utf8').toString('base64');
}

export async function finalizeOrderPayment(orderId: string): Promise<void> {
  const orders = await query<{ id: string; user_id: string; total: string; payment_status: string }>(
    `SELECT id, user_id, total, payment_status FROM orders WHERE id = $1`,
    [orderId]
  );
  const order = orders[0];
  if (!order || order.payment_status === 'paid') return;

  const items = await query<{ product_id: string | null; quantity: number }>(
    `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
    [orderId]
  );

  for (const item of items) {
    if (!item.product_id) continue;
    await query(
      `UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
      [item.quantity, item.product_id]
    );
  }

  const loyaltyPoints = Math.floor(Number(order.total) / 10);
  if (loyaltyPoints > 0) {
    await query(
      `UPDATE profiles SET loyalty_points = COALESCE(loyalty_points, 0) + $1 WHERE id = $2`,
      [loyaltyPoints, order.user_id]
    );
  }

  await query(
    `UPDATE orders SET payment_status = 'paid', status = 'processing', updated_at = NOW() WHERE id = $1`,
    [orderId]
  );
}

export async function findOrderByMerchantOid(merchantOid: string) {
  const rows = await query<{ id: string; order_number: string; payment_status: string }>(
    `SELECT id, order_number, payment_status FROM orders
     WHERE REPLACE(order_number, '-', '') ILIKE $1
        OR notes ILIKE $2
     LIMIT 5`,
    [`%${merchantOid}%`, `%${merchantOid}%`]
  );
  return (
    rows.find((o) => o.order_number.replace(/[^a-zA-Z0-9]/g, '') === merchantOid) ?? rows[0] ?? null
  );
}
