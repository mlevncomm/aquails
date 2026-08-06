// Supabase Edge Function: create-checkout-session
// TODO: Integrate Iyzico / PayTR payment session creation
// - Validate cart and stock server-side (service role)
// - Create pending order record
// - Return payment redirect URL or client token
// - NEVER expose service role key to the frontend

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    // TODO: auth.getUser() from Authorization header
    // TODO: validate items, coupons, addresses
    // TODO: create order with status pending + payment_status pending
    // TODO: call payment provider API (Iyzico/PayTR)

    return new Response(
      JSON.stringify({
        ok: false,
        message: 'Placeholder — payment session not implemented yet',
        received: body,
        supabaseReady: Boolean(supabase),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 501 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
