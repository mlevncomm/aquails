// PayTR iFrame token oluşturma — sunucu tarafı
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaytrSettings {
  enabled: boolean;
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

function toBase64Hmac(data: string, key: string): string {
  const encoder = new TextEncoder();
  const cryptoKey = crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return cryptoKey.then((k) =>
    crypto.subtle.sign('HMAC', k, encoder.encode(data)).then((sig) => {
      const bytes = new Uint8Array(sig);
      let binary = '';
      for (const b of bytes) binary += String.fromCharCode(b);
      return btoa(binary);
    })
  );
}

async function getPaytrSettings(supabase: ReturnType<typeof createClient>): Promise<PaytrSettings | null> {
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'paytr').maybeSingle();
  if (!data?.value) return null;
  const v = data.value as Record<string, unknown>;
  return {
    enabled: Boolean(v.enabled),
    merchantId: String(v.merchantId ?? ''),
    merchantKey: String(v.merchantKey ?? ''),
    merchantSalt: String(v.merchantSalt ?? ''),
    testMode: v.testMode !== false,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Yetkilendirme gerekli.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ success: false, error: 'Geçersiz oturum.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
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
      return new Response(JSON.stringify({ success: false, error: 'Eksik ödeme bilgisi.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: order } = await supabase
      .from('orders')
      .select('id, user_id, order_number, payment_status')
      .eq('id', orderId)
      .maybeSingle();

    if (!order || order.user_id !== authData.user.id) {
      return new Response(JSON.stringify({ success: false, error: 'Sipariş bulunamadı.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paytr = await getPaytrSettings(supabase);
    if (!paytr?.enabled || !paytr.merchantId || !paytr.merchantKey || !paytr.merchantSalt) {
      return new Response(JSON.stringify({ success: false, error: 'PayTR yapılandırılmamış.' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const merchantOid = String(orderNumber).replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
    const userIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      '127.0.0.1';

    const basketJson = JSON.stringify(userBasket);
    const userBasketB64 = btoa(unescape(encodeURIComponent(basketJson)));
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

    const paytrToken = await toBase64Hmac(hashStr + paytr.merchantSalt, paytr.merchantKey);

    const siteUrl = Deno.env.get('SITE_URL') ?? merchantOkUrl?.replace(/\/odeme\/.*$/, '') ?? '';
    const callbackUrl = `${supabaseUrl}/functions/v1/payment-webhook`;

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

    const paytrData = await paytrRes.json();

    if (paytrData.status !== 'success' || !paytrData.token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: paytrData.reason ?? 'PayTR token alınamadı.',
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('orders')
      .update({
        notes: `paytr_oid:${merchantOid}`,
      })
      .eq('id', orderId);

    return new Response(JSON.stringify({ success: true, token: paytrData.token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Bilinmeyen hata' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
