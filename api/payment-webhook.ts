import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
  return { url, anonKey };
}

function parseCallbackBody(req: VercelRequest): Record<string, string> {
  const contentType = req.headers['content-type'] ?? '';
  if (contentType.includes('application/json')) {
    return (req.body ?? {}) as Record<string, string>;
  }
  if (typeof req.body === 'string') {
    return Object.fromEntries(new URLSearchParams(req.body));
  }
  return (req.body ?? {}) as Record<string, string>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return res.status(500).send('Supabase not configured');
    }

    const callback = parseCallbackBody(req);
    const supabase = createClient(url, anonKey);

    const { error } = await supabase.rpc('paytr_handle_webhook', {
      p_merchant_oid: callback.merchant_oid,
      p_status: callback.status,
      p_total_amount: callback.total_amount,
      p_hash: callback.hash,
    });

    if (error) {
      if (error.message.includes('bad hash')) {
        return res.status(400).send('PAYTR notification failed: bad hash');
      }
      if (error.message.includes('PAYTR settings missing')) {
        return res.status(500).send('PAYTR settings missing');
      }
      console.error('paytr_handle_webhook error:', error);
      return res.status(500).send('ERROR');
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('payment-webhook error:', error);
    return res.status(500).send('ERROR');
  }
}
