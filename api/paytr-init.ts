import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
  return { url, anonKey };
}

function encodeBasket(items: unknown[]): string {
  return Buffer.from(JSON.stringify(items), 'utf8').toString('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Yetkilendirme gerekli.' });
    }

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return res.status(503).json({ success: false, error: 'Supabase yapılandırılmamış.' });
    }

    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      return res.status(401).json({ success: false, error: 'Geçersiz oturum.' });
    }

    const body = req.body ?? {};
    const {
      orderId,
      orderNumber,
      email,
      userName,
      userPhone,
      userAddress,
      paymentAmount,
      userBasket,
      merchantOkUrl,
      merchantFailUrl,
    } = body;

    if (!orderId || !orderNumber || !email || !paymentAmount || !userBasket) {
      return res.status(400).json({ success: false, error: 'Eksik ödeme bilgisi.' });
    }

    const forwarded = req.headers['x-forwarded-for'];
    const userIp =
      (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded?.[0])?.trim() || '127.0.0.1';
    const userBasketB64 = encodeBasket(userBasket);
    const paymentAmountKurus = Math.round(Number(paymentAmount));

    const { data: paytrFields, error: rpcError } = await userClient.rpc('paytr_prepare_payment', {
      p_order_id: orderId,
      p_order_number: String(orderNumber),
      p_email: String(email),
      p_user_ip: userIp,
      p_payment_amount: paymentAmountKurus,
      p_user_basket_b64: userBasketB64,
    });

    if (rpcError) {
      const msg = rpcError.message ?? 'PayTR hazırlık hatası.';
      if (msg.includes('Sipariş bulunamadı')) {
        return res.status(404).json({ success: false, error: msg });
      }
      if (msg.includes('PayTR yapılandırılmamış')) {
        return res.status(503).json({ success: false, error: 'PayTR yapılandırılmamış. Admin → Ödeme Ayarları.' });
      }
      return res.status(400).json({ success: false, error: msg });
    }

    const fields = paytrFields as Record<string, string | number>;
    const siteUrl = process.env.SITE_URL ?? 'https://aquails.vercel.app';
    const callbackUrl = `${siteUrl.replace(/\/$/, '')}/api/payment-webhook`;

    const form = new URLSearchParams({
      merchant_id: String(fields.merchant_id),
      user_ip: userIp,
      merchant_oid: String(fields.merchant_oid),
      email: String(email),
      payment_amount: String(fields.payment_amount),
      paytr_token: String(fields.paytr_token),
      user_basket: String(fields.user_basket),
      debug_on: String(fields.debug_on),
      no_installment: String(fields.no_installment),
      max_installment: String(fields.max_installment),
      user_name: String(userName ?? 'Müşteri'),
      user_address: String(userAddress ?? 'Türkiye'),
      user_phone: String(userPhone ?? '05000000000'),
      merchant_ok_url: String(merchantOkUrl ?? `${siteUrl}/odeme/basarili?order=${orderNumber}`),
      merchant_fail_url: String(merchantFailUrl ?? `${siteUrl}/odeme/basarisiz?order=${orderNumber}`),
      timeout_limit: '30',
      currency: String(fields.currency),
      test_mode: String(fields.test_mode),
      lang: 'tr',
      iframe_v2: '1',
      merchant_notify_url: callbackUrl,
    });

    const paytrRes = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const paytrData = (await paytrRes.json()) as { status?: string; token?: string; reason?: string };

    if (paytrData.status !== 'success' || !paytrData.token) {
      return res.status(502).json({
        success: false,
        error: paytrData.reason ?? 'PayTR token alınamadı.',
      });
    }

    return res.status(200).json({ success: true, token: paytrData.token });
  } catch (error) {
    console.error('paytr-init error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    });
  }
}
