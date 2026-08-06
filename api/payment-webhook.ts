import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function parseBody(req: VercelRequest): Record<string, string> {
  if (typeof req.body === 'string') return Object.fromEntries(new URLSearchParams(req.body));
  return (req.body ?? {}) as Record<string, string>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  try {
    const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
    const merchantKey = process.env.PAYTR_MERCHANT_KEY ?? '';
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT ?? '';
    if (!url || !serviceKey || !merchantKey || !merchantSalt) return res.status(500).send('Server not configured');

    const body = parseBody(req);
    const { merchant_oid: oid, status, total_amount: amount, hash } = body;
    if (!oid || !status || !amount || !hash || oid.length > 64 || !/^\d+$/.test(amount)) {
      return res.status(400).send('Invalid callback');
    }
    const expected = createHmac('sha256', merchantKey)
      .update(oid + merchantSalt + status + amount, 'utf8').digest('base64');
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(hash);
    if (expectedBuffer.length !== receivedBuffer.length || !timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return res.status(400).send('PAYTR notification failed: bad hash');
    }

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await admin.rpc('finalize_paytr_payment', {
      p_merchant_oid: oid, p_status: status, p_total_amount: amount,
    });
    if (error) {
      console.error('finalize_paytr_payment:', error.message);
      return res.status(error.message.includes('amount mismatch') ? 400 : 500).send('ERROR');
    }
    return res.status(200).send('OK');
  } catch (error) {
    console.error('payment-webhook error:', error instanceof Error ? error.message : error);
    return res.status(500).send('ERROR');
  }
}
