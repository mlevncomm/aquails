import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_lib/db.js';
import { findOrderByMerchantOid, finalizeOrderPayment, getPaytrSettings, paytrHmac } from './_lib/paytr.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const paytr = await getPaytrSettings();
    if (!paytr?.merchantKey || !paytr.merchantSalt) {
      return res.status(500).send('PAYTR settings missing');
    }

    const contentType = req.headers['content-type'] ?? '';
    let callback: Record<string, string>;

    if (contentType.includes('application/json')) {
      callback = (req.body ?? {}) as Record<string, string>;
    } else if (typeof req.body === 'string') {
      callback = Object.fromEntries(new URLSearchParams(req.body));
    } else {
      callback = (req.body ?? {}) as Record<string, string>;
    }
    const hashStr = callback.merchant_oid + paytr.merchantSalt + callback.status + callback.total_amount;
    const token = paytrHmac(hashStr, paytr.merchantKey);

    if (token !== callback.hash) {
      return res.status(400).send('PAYTR notification failed: bad hash');
    }

    const order = await findOrderByMerchantOid(callback.merchant_oid);
    if (!order) {
      return res.status(200).send('OK');
    }

    if (callback.status === 'success') {
      await finalizeOrderPayment(order.id);
    } else {
      await query(
        `UPDATE orders SET payment_status = 'failed', status = 'cancelled', updated_at = NOW() WHERE id = $1`,
        [order.id]
      );
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('payment-webhook error:', error);
    return res.status(500).send('ERROR');
  }
}
