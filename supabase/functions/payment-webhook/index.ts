// PayTR ödeme bildirimi (callback) — stok ve sipariş durumu güncelleme
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

interface PaytrSettings {
  merchantKey: string;
  merchantSalt: string;
}

async function toBase64Hmac(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  const bytes = new Uint8Array(sig);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

async function getPaytrSettings(supabase: ReturnType<typeof createClient>): Promise<PaytrSettings | null> {
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'paytr').maybeSingle();
  if (!data?.value) return null;
  const v = data.value as Record<string, unknown>;
  return {
    merchantKey: String(v.merchantKey ?? ''),
    merchantSalt: String(v.merchantSalt ?? ''),
  };
}

async function finalizeOrderPayment(
  supabase: ReturnType<typeof createClient>,
  orderId: string
): Promise<void> {
  const { data: order } = await supabase
    .from('orders')
    .select('id, user_id, total, payment_status')
    .eq('id', orderId)
    .maybeSingle();

  if (!order || order.payment_status === 'paid') return;

  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  for (const item of items ?? []) {
    if (!item.product_id) continue;
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .maybeSingle();
    if (product) {
      await supabase
        .from('products')
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq('id', item.product_id);
    }
  }

  const loyaltyPoints = Math.floor(Number(order.total) / 10);
  if (loyaltyPoints > 0 && order.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('loyalty_points')
      .eq('id', order.user_id)
      .maybeSingle();
    if (profile) {
      await supabase
        .from('profiles')
        .update({ loyalty_points: (profile.loyalty_points ?? 0) + loyaltyPoints })
        .eq('id', order.user_id);
    }
  }

  await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'processing' })
    .eq('id', orderId);
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const contentType = req.headers.get('content-type') ?? '';
    let callback: Record<string, string>;

    if (contentType.includes('application/json')) {
      callback = await req.json();
    } else {
      const form = await req.formData();
      callback = Object.fromEntries(form.entries()) as Record<string, string>;
    }

    const paytr = await getPaytrSettings(supabase);
    if (!paytr?.merchantKey || !paytr.merchantSalt) {
      return new Response('PAYTR settings missing', { status: 500 });
    }

    const hashStr = callback.merchant_oid + paytr.merchantSalt + callback.status + callback.total_amount;
    const token = await toBase64Hmac(hashStr, paytr.merchantKey);

    if (token !== callback.hash) {
      return new Response('PAYTR notification failed: bad hash', { status: 400 });
    }

    const merchantOid = callback.merchant_oid;

    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, payment_status')
      .or(`order_number.ilike.%${merchantOid}%,notes.ilike.%${merchantOid}%`);

    const order =
      orders?.find((o) => o.order_number.replace(/[^a-zA-Z0-9]/g, '') === merchantOid) ??
      orders?.[0];

    if (!order) {
      return new Response('OK');
    }

    if (callback.status === 'success') {
      await finalizeOrderPayment(supabase, order.id);
    } else {
      await supabase
        .from('orders')
        .update({ payment_status: 'failed', status: 'cancelled' })
        .eq('id', order.id);
    }

    return new Response('OK');
  } catch (error) {
    console.error('payment-webhook error:', error);
    return new Response('ERROR', { status: 500 });
  }
});
