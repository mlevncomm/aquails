// Supabase Edge Function: payment-webhook
// TODO: Handle Iyzico / PayTR webhook callbacks
// - Verify webhook signature
// - Update order payment_status and order status
// - Decrement product stock atomically
// - Trigger shipping / notification workflows
// - Idempotency: guard against duplicate webhook delivery

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json();
    // TODO: verify provider signature (Iyzico/PayTR)
    // TODO: find order by provider reference
    // TODO: update orders.payment_status = 'paid', status = 'processing'
    // TODO: insert order_items, reduce stock
    // TODO: mark abandoned_cart as converted

    return new Response(
      JSON.stringify({
        ok: false,
        message: 'Placeholder — webhook handler not implemented yet',
        received: payload,
        supabaseReady: Boolean(supabase),
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
