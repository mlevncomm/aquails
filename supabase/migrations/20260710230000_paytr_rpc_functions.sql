-- PayTR server-side RPC — Vercel API routes can use anon key + user JWT (no DATABASE_URL needed)

CREATE OR REPLACE FUNCTION public.paytr_hmac(data text, key text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(hmac(convert_to(data, 'UTF8'), convert_to(key, 'UTF8'), 'sha256'), 'base64');
$$;

CREATE OR REPLACE FUNCTION public.paytr_get_settings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg jsonb;
BEGIN
  SELECT value INTO cfg FROM site_settings WHERE key = 'paytr' LIMIT 1;
  RETURN cfg;
END;
$$;

CREATE OR REPLACE FUNCTION public.paytr_prepare_payment(
  p_order_id uuid,
  p_order_number text,
  p_email text,
  p_user_ip text,
  p_payment_amount integer,
  p_user_basket_b64 text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg jsonb;
  v_enabled boolean;
  v_merchant_id text;
  v_merchant_key text;
  v_merchant_salt text;
  v_test_mode text;
  v_merchant_oid text;
  v_hash_str text;
  v_paytr_token text;
  v_order_user uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501';
  END IF;

  SELECT user_id INTO v_order_user FROM orders WHERE id = p_order_id LIMIT 1;
  IF v_order_user IS NULL OR v_order_user <> auth.uid() THEN
    RAISE EXCEPTION 'Sipariş bulunamadı.' USING ERRCODE = 'P0002';
  END IF;

  cfg := paytr_get_settings();
  IF cfg IS NULL THEN
    RAISE EXCEPTION 'PayTR yapılandırılmamış.' USING ERRCODE = 'P0001';
  END IF;

  v_enabled := COALESCE((cfg->>'enabled')::boolean, false);
  v_merchant_id := COALESCE(cfg->>'merchantId', '');
  v_merchant_key := COALESCE(cfg->>'merchantKey', '');
  v_merchant_salt := COALESCE(cfg->>'merchantSalt', '');
  v_test_mode := CASE WHEN COALESCE((cfg->>'testMode')::boolean, true) THEN '1' ELSE '0' END;

  IF NOT v_enabled OR v_merchant_id = '' OR v_merchant_key = '' OR v_merchant_salt = '' THEN
    RAISE EXCEPTION 'PayTR yapılandırılmamış.' USING ERRCODE = 'P0001';
  END IF;

  v_merchant_oid := left(regexp_replace(p_order_number, '[^a-zA-Z0-9]', '', 'g'), 64);

  v_hash_str :=
    v_merchant_id ||
    p_user_ip ||
    v_merchant_oid ||
    p_email ||
    p_payment_amount::text ||
    p_user_basket_b64 ||
    '0' || '0' || 'TL' || v_test_mode;

  v_paytr_token := paytr_hmac(v_hash_str || v_merchant_salt, v_merchant_key);

  UPDATE orders
  SET notes = 'paytr_oid:' || v_merchant_oid, updated_at = NOW()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'merchant_id', v_merchant_id,
    'merchant_oid', v_merchant_oid,
    'paytr_token', v_paytr_token,
    'user_basket', p_user_basket_b64,
    'payment_amount', p_payment_amount,
    'test_mode', v_test_mode,
    'debug_on', v_test_mode,
    'no_installment', '0',
    'max_installment', '0',
    'currency', 'TL'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.paytr_handle_webhook(
  p_merchant_oid text,
  p_status text,
  p_total_amount text,
  p_hash text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg jsonb;
  v_merchant_key text;
  v_merchant_salt text;
  v_expected_hash text;
  v_order_id uuid;
  v_user_id uuid;
  v_total numeric;
  v_payment_status text;
  v_item record;
  v_loyalty integer;
BEGIN
  cfg := paytr_get_settings();
  IF cfg IS NULL THEN
    RAISE EXCEPTION 'PAYTR settings missing' USING ERRCODE = 'P0001';
  END IF;

  v_merchant_key := COALESCE(cfg->>'merchantKey', '');
  v_merchant_salt := COALESCE(cfg->>'merchantSalt', '');

  IF v_merchant_key = '' OR v_merchant_salt = '' THEN
    RAISE EXCEPTION 'PAYTR settings missing' USING ERRCODE = 'P0001';
  END IF;

  v_expected_hash := paytr_hmac(p_merchant_oid || v_merchant_salt || p_status || p_total_amount, v_merchant_key);
  IF v_expected_hash <> p_hash THEN
    RAISE EXCEPTION 'PAYTR notification failed: bad hash' USING ERRCODE = '22023';
  END IF;

  SELECT id, user_id, payment_status INTO v_order_id, v_user_id, v_payment_status
  FROM orders
  WHERE regexp_replace(order_number, '[^a-zA-Z0-9]', '', 'g') = p_merchant_oid
     OR notes ILIKE '%' || p_merchant_oid || '%'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_order_id IS NULL THEN
    RETURN 'OK';
  END IF;

  IF p_status = 'success' THEN
    IF v_payment_status = 'paid' THEN
      RETURN 'OK';
    END IF;

    FOR v_item IN
      SELECT product_id, quantity FROM order_items WHERE order_id = v_order_id AND product_id IS NOT NULL
    LOOP
      UPDATE products
      SET stock = GREATEST(0, stock - v_item.quantity)
      WHERE id = v_item.product_id;
    END LOOP;

    SELECT total INTO v_total FROM orders WHERE id = v_order_id;
    v_loyalty := floor(COALESCE(v_total, 0) / 10);
    IF v_loyalty > 0 AND v_user_id IS NOT NULL THEN
      UPDATE profiles
      SET loyalty_points = COALESCE(loyalty_points, 0) + v_loyalty
      WHERE id = v_user_id;
    END IF;

    UPDATE orders
    SET payment_status = 'paid', status = 'processing', updated_at = NOW()
    WHERE id = v_order_id;
  ELSE
    UPDATE orders
    SET payment_status = 'failed', status = 'cancelled', updated_at = NOW()
    WHERE id = v_order_id;
  END IF;

  RETURN 'OK';
END;
$$;

REVOKE ALL ON FUNCTION public.paytr_get_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.paytr_prepare_payment(uuid, text, text, text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.paytr_handle_webhook(text, text, text, text) TO anon, authenticated, service_role;
