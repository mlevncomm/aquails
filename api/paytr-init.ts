import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function config() {
  return {
    url: process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    merchantId: process.env.PAYTR_MERCHANT_ID ?? '',
    merchantKey: process.env.PAYTR_MERCHANT_KEY ?? '',
    merchantSalt: process.env.PAYTR_MERCHANT_SALT ?? '',
    testMode: process.env.PAYTR_TEST_MODE === '1' ? '1' : '0',
    siteUrl: process.env.SITE_URL ?? 'https://aquails.vercel.app',
  };
}

function hmac(data: string, key: string): string {
  return createHmac('sha256', key).update(data, 'utf8').digest('base64');
}

function cleanText(value: unknown, fallback: string, max: number): string {
  const text = typeof value === 'string' ? value.trim() : '';
  return (text || fallback).slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cfg = config();
  const requestOrigin = req.headers.origin;
  if (requestOrigin === new URL(cfg.siteUrl).origin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, error: 'Yetkilendirme gerekli.' });
    if (!cfg.url || !cfg.anonKey || !cfg.serviceKey) {
      return res.status(503).json({ success: false, error: 'Sunucu veritabanı yapılandırılmamış.' });
    }
    if (!cfg.merchantId || !cfg.merchantKey || !cfg.merchantSalt) {
      return res.status(503).json({ success: false, error: 'PayTR ortam değişkenleri yapılandırılmamış.' });
    }

    const userClient = createClient(cfg.url, cfg.anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) return res.status(401).json({ success: false, error: 'Geçersiz oturum.' });

    const orderId = cleanText(req.body?.orderId, '', 36);
    if (!orderId) return res.status(400).json({ success: false, error: 'Sipariş kimliği gerekli.' });

    const admin = createClient(cfg.url, cfg.serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: order, error: orderError } = await admin
      .from('orders')
      .select('id,user_id,order_number,total,payment_method,payment_status,notes,order_items(product_name,unit_price,quantity)')
      .eq('id', orderId)
      .eq('user_id', authData.user.id)
      .maybeSingle();
    if (orderError || !order) return res.status(404).json({ success: false, error: 'Sipariş bulunamadı.' });
    if (order.payment_method !== 'card' || order.payment_status !== 'pending') {
      return res.status(409).json({ success: false, error: 'Sipariş kartla ödemeye uygun değil.' });
    }

    const merchantOid = order.order_number.replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
    const paymentAmount = Math.round(Number(order.total) * 100);
    const basket = Buffer.from(JSON.stringify((order.order_items ?? []).map((item) => [
      item.product_name, Number(item.unit_price).toFixed(2), item.quantity,
    ])), 'utf8').toString('base64');
    const forwarded = req.headers['x-forwarded-for'];
    const userIp = (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded?.[0])?.trim() || '127.0.0.1';
    const email = authData.user.email ?? '';
    const hashInput = cfg.merchantId + userIp + merchantOid + email + paymentAmount + basket + '0' + '0' + 'TL' + cfg.testMode;
    const token = hmac(hashInput + cfg.merchantSalt, cfg.merchantKey);
    const baseUrl = cfg.siteUrl.replace(/\/$/, '');

    await admin.from('orders').update({
      notes: String(order.notes ?? '').includes('paytr_oid:')
        ? order.notes
        : [order.notes, `paytr_oid:${merchantOid}`].filter(Boolean).join(' | '),
    }).eq('id', order.id);

    const form = new URLSearchParams({
      merchant_id: cfg.merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      payment_amount: String(paymentAmount),
      paytr_token: token,
      user_basket: basket,
      debug_on: cfg.testMode,
      no_installment: '0',
      max_installment: '0',
      user_name: cleanText(req.body?.userName, 'Müşteri', 80),
      user_address: cleanText(req.body?.userAddress, 'Türkiye', 400),
      user_phone: cleanText(req.body?.userPhone, '05000000000', 30),
      merchant_ok_url: `${baseUrl}/odeme/basarili?order=${encodeURIComponent(order.order_number)}`,
      merchant_fail_url: `${baseUrl}/odeme/basarisiz?order=${encodeURIComponent(order.order_number)}`,
      merchant_notify_url: `${baseUrl}/api/payment-webhook`,
      timeout_limit: '30', currency: 'TL', test_mode: cfg.testMode, lang: 'tr', iframe_v2: '1',
    });

    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString(),
    });
    const payload = await paytrResponse.json() as { status?: string; token?: string; reason?: string };
    if (!paytrResponse.ok || payload.status !== 'success' || !payload.token) {
      return res.status(502).json({ success: false, error: payload.reason ?? 'PayTR token alınamadı.' });
    }
    return res.status(200).json({ success: true, token: payload.token });
  } catch (error) {
    console.error('paytr-init error:', error instanceof Error ? error.message : error);
    return res.status(500).json({ success: false, error: 'Ödeme başlatılamadı.' });
  }
}
