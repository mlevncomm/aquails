import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { query } from './_lib/db.js';
import { encodeBasket, getPaytrSettings, paytrHmac } from './_lib/paytr.js';

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

    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
    if (!supabaseUrl || !anonKey) {
      return res.status(503).json({ success: false, error: 'Supabase yapılandırılmamış.' });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
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

    const orders = await query<{ id: string; user_id: string }>(
      `SELECT id, user_id FROM orders WHERE id = $1 LIMIT 1`,
      [orderId]
    );
    const order = orders[0];
    if (!order || order.user_id !== authData.user.id) {
      return res.status(404).json({ success: false, error: 'Sipariş bulunamadı.' });
    }

    const paytr = await getPaytrSettings();
    if (!paytr?.enabled || !paytr.merchantId || !paytr.merchantKey || !paytr.merchantSalt) {
      return res.status(503).json({ success: false, error: 'PayTR yapılandırılmamış. Admin → Ödeme Ayarları.' });
    }

    const merchantOid = String(orderNumber).replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
    const forwarded = req.headers['x-forwarded-for'];
    const userIp = (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded?.[0])?.trim() || '127.0.0.1';
    const userBasketB64 = encodeBasket(userBasket);
    const paymentAmountKurus = Math.round(Number(paymentAmount));
    const noInstallment = '0';
    const maxInstallment = '0';
    const currency = 'TL';
    const testMode = paytr.testMode ? '1' : '0';

    const hashStr =
      paytr.merchantId +
      userIp +
      merchantOid +
      email +
      String(paymentAmountKurus) +
      userBasketB64 +
      noInstallment +
      maxInstallment +
      currency +
      testMode;

    const paytrToken = paytrHmac(hashStr + paytr.merchantSalt, paytr.merchantKey);

    const siteUrl = process.env.SITE_URL ?? 'https://aquails.vercel.app';
    const callbackUrl = `${siteUrl.replace(/\/$/, '')}/api/payment-webhook`;

    const form = new URLSearchParams({
      merchant_id: paytr.merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: String(email),
      payment_amount: String(paymentAmountKurus),
      paytr_token: paytrToken,
      user_basket: userBasketB64,
      debug_on: testMode,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: String(userName ?? 'Müşteri'),
      user_address: String(userAddress ?? 'Türkiye'),
      user_phone: String(userPhone ?? '05000000000'),
      merchant_ok_url: String(merchantOkUrl ?? `${siteUrl}/odeme/basarili?order=${orderNumber}`),
      merchant_fail_url: String(merchantFailUrl ?? `${siteUrl}/odeme/basarisiz?order=${orderNumber}`),
      timeout_limit: '30',
      currency,
      test_mode: testMode,
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

    await query(`UPDATE orders SET notes = $1, updated_at = NOW() WHERE id = $2`, [
      `paytr_oid:${merchantOid}`,
      orderId,
    ]);

    return res.status(200).json({ success: true, token: paytrData.token });
  } catch (error) {
    console.error('paytr-init error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    });
  }
}
