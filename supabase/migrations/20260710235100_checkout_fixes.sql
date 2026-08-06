-- Checkout fixes: public PayTR flag, order fulfillment RPC, coupon usage RPC, notes append

-- Allow customers to read whether PayTR is enabled (no secrets)
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (
    key IN ('site', 'nav_links', 'shipping', 'bank_accounts', 'paytr_public')
    OR public.is_admin()
  );

-- Sync public PayTR flag from admin paytr settings
INSERT INTO public.site_settings (key, value)
SELECT 'paytr_public', jsonb_build_object(
  'enabled', COALESCE((value->>'enabled')::boolean, false),
  'testMode', COALESCE((value->>'testMode')::boolean, true)
)
FROM public.site_settings WHERE key = 'paytr'
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

CREATE OR REPLACE FUNCTION public.sync_paytr_public()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO site_settings (key, value)
  VALUES (
    'paytr_public',
    jsonb_build_object(
      'enabled', COALESCE((NEW.value->>'enabled')::boolean, false),
      'testMode', COALESCE((NEW.value->>'testMode')::boolean, true)
    )
  )
  ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_paytr_public ON public.site_settings;
CREATE TRIGGER trg_sync_paytr_public
  AFTER INSERT OR UPDATE ON public.site_settings
  FOR EACH ROW
  WHEN (NEW.key = 'paytr')
  EXECUTE FUNCTION public.sync_paytr_public();

-- Append paytr oid to notes instead of overwriting
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
  v_existing_notes text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501';
  END IF;

  SELECT user_id, notes INTO v_order_user, v_existing_notes FROM orders WHERE id = p_order_id LIMIT 1;
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
  SET notes = CASE
        WHEN v_existing_notes IS NULL OR v_existing_notes = '' THEN 'paytr_oid:' || v_merchant_oid
        WHEN v_existing_notes ILIKE '%paytr_oid:%' THEN v_existing_notes
        ELSE v_existing_notes || ' | paytr_oid:' || v_merchant_oid
      END,
      updated_at = NOW()
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

-- Fulfill COD / transfer orders (stock + processing status)
CREATE OR REPLACE FUNCTION public.confirm_order_fulfillment(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_status text;
  v_item record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501';
  END IF;

  SELECT user_id, status INTO v_user_id, v_status FROM orders WHERE id = p_order_id LIMIT 1;
  IF v_user_id IS NULL OR v_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Sipariş bulunamadı.' USING ERRCODE = 'P0002';
  END IF;

  IF v_status <> 'pending' THEN
    RETURN;
  END IF;

  FOR v_item IN
    SELECT product_id, quantity FROM order_items WHERE order_id = p_order_id AND product_id IS NOT NULL
  LOOP
    UPDATE products
    SET stock = GREATEST(0, stock - v_item.quantity)
    WHERE id = v_item.product_id;
  END LOOP;

  UPDATE orders
  SET status = 'processing', updated_at = NOW()
  WHERE id = p_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.confirm_order_fulfillment(uuid) TO authenticated;

-- Coupon usage increment (customer-safe)
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(p_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE coupons
  SET usage_count = usage_count + 1, updated_at = NOW()
  WHERE upper(code) = upper(trim(p_code))
    AND is_active = TRUE
    AND (usage_limit = 0 OR usage_count < usage_limit);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_coupon_usage(text) TO authenticated, anon;
