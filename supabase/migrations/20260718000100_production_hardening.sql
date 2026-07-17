-- Production hardening: privileged fields, atomic checkout, stock reservation,
-- coupon consumption and strict PayTR amount/basket verification.

-- ---------------------------------------------------------------------------
-- Privileged profile fields may only be changed by an administrator.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND current_user IN ('authenticated', 'anon') AND NOT public.is_admin() AND (
    NEW.role IS DISTINCT FROM OLD.role
    OR NEW.email IS DISTINCT FROM OLD.email
    OR NEW.loyalty_points IS DISTINCT FROM OLD.loyalty_points
    OR NEW.loyalty_redeemed IS DISTINCT FROM OLD.loyalty_redeemed
    OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
    OR NEW.tax_id IS DISTINCT FROM OLD.tax_id
  ) THEN
    RAISE EXCEPTION 'Yetkili profil alanları değiştirilemez.' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_fields();

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Prevent identity spoofing and customer-side moderation/status changes.
DROP POLICY IF EXISTS "product_questions_insert_auth" ON public.product_questions;
CREATE POLICY "product_questions_insert_auth" ON public.product_questions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id AND is_published = FALSE AND answer IS NULL);

DROP POLICY IF EXISTS "reviews_insert_auth" ON public.reviews;
CREATE POLICY "reviews_insert_auth" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id AND is_published = FALSE);

DROP POLICY IF EXISTS "reviews_update_admin" ON public.reviews;
CREATE POLICY "reviews_update_admin" ON public.reviews
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "service_requests_update_own_or_admin" ON public.service_requests;
CREATE POLICY "service_requests_update_admin" ON public.service_requests
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "service_requests_insert_own" ON public.service_requests;
CREATE POLICY "service_requests_insert_own" ON public.service_requests
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND status = 'pending' AND assigned_to IS NULL AND notes IS NULL
  );

DROP POLICY IF EXISTS "returns_insert_own" ON public.return_requests;
CREATE POLICY "returns_insert_own" ON public.return_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending' AND admin_note IS NULL);

CREATE OR REPLACE FUNCTION public.protect_notification_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND current_user IN ('authenticated', 'anon') AND NOT public.is_admin() AND (
    NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.title IS DISTINCT FROM OLD.title
    OR NEW.message IS DISTINCT FROM OLD.message OR NEW.type IS DISTINCT FROM OLD.type
    OR NEW.link IS DISTINCT FROM OLD.link OR NEW.created_at IS DISTINCT FROM OLD.created_at
  ) THEN
    RAISE EXCEPTION 'Yalnızca okundu bilgisi değiştirilebilir.' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_notification_fields ON public.notifications;
CREATE TRIGGER trg_protect_notification_fields
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.protect_notification_fields();

DROP POLICY IF EXISTS "subscriptions_insert_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_own" ON public.subscriptions;

CREATE OR REPLACE FUNCTION public.create_my_subscription(p_plan TEXT, p_device_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_id UUID;
  v_price NUMERIC(12,2);
  v_months INT;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501'; END IF;
  CASE p_plan
    WHEN '6ay' THEN v_price := 590; v_months := 6;
    WHEN '12ay' THEN v_price := 990; v_months := 12;
    WHEN 'premium' THEN v_price := 1890; v_months := 6;
    ELSE RAISE EXCEPTION 'Geçersiz abonelik planı.' USING ERRCODE = '22023';
  END CASE;
  IF coalesce(length(trim(p_device_name)), 0) < 2 THEN
    RAISE EXCEPTION 'Cihaz adı gereklidir.' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.subscriptions (user_id, plan, device_name, price, next_delivery, status)
  VALUES (v_uid, p_plan, left(trim(p_device_name), 120), v_price, now() + make_interval(months => v_months), 'active')
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('success', true, 'subscription_id', v_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.set_my_subscription_status(p_subscription_id UUID, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501'; END IF;
  IF p_status NOT IN ('active', 'paused', 'cancelled') THEN
    RAISE EXCEPTION 'Geçersiz abonelik durumu.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.subscriptions SET status = p_status, updated_at = now()
  WHERE id = p_subscription_id
    AND (user_id = auth.uid() OR public.is_admin())
    AND (status <> 'cancelled' OR public.is_admin());
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'not_found'); END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.create_my_subscription(TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_my_subscription_status(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_my_subscription(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_my_subscription_status(UUID, TEXT) TO authenticated;

-- Checkout writes are only allowed through create_checkout_order().
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS service_slot_id UUID REFERENCES public.service_slots(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS stock_reserved BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stock_released BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS coupon_released BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS service_slot_released BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.create_checkout_order(
  p_items JSONB,
  p_shipping_address JSONB,
  p_billing_address JSONB,
  p_payment_method TEXT,
  p_shipping_method TEXT,
  p_coupon_code TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_service_slot_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_order_id UUID;
  v_order_number TEXT;
  v_item JSONB;
  v_product public.products%ROWTYPE;
  v_quantity INT;
  v_items_count INT;
  v_subtotal NUMERIC(12,2) := 0;
  v_discount NUMERIC(12,2) := 0;
  v_shipping NUMERIC(12,2) := 0;
  v_cod_fee NUMERIC(12,2) := 0;
  v_tax_rate NUMERIC(5,2) := 20;
  v_total NUMERIC(12,2) := 0;
  v_coupon public.coupons%ROWTYPE;
  v_shipping_cfg JSONB;
  v_shipping_row JSONB;
  v_slot public.service_slots%ROWTYPE;
  v_method TEXT := lower(trim(coalesce(p_payment_method, '')));
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501';
  END IF;

  IF jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'Geçersiz sepet.' USING ERRCODE = '22023';
  END IF;
  v_items_count := jsonb_array_length(p_items);
  IF v_items_count < 1 OR v_items_count > 50 THEN
    RAISE EXCEPTION 'Sepet 1-50 ürün satırı içermelidir.' USING ERRCODE = '22023';
  END IF;
  IF (SELECT count(DISTINCT value->>'product_id') FROM jsonb_array_elements(p_items)) <> v_items_count THEN
    RAISE EXCEPTION 'Aynı ürün sepette birden fazla satırda bulunamaz.' USING ERRCODE = '22023';
  END IF;
  IF v_method NOT IN ('card', 'transfer', 'cod') THEN
    RAISE EXCEPTION 'Geçersiz ödeme yöntemi.' USING ERRCODE = '22023';
  END IF;
  IF coalesce(length(trim(p_shipping_address->>'full_address')), 0) < 5
     OR coalesce(length(trim(p_shipping_address->>'city')), 0) < 2
     OR coalesce(length(trim(p_shipping_address->>'district')), 0) < 2 THEN
    RAISE EXCEPTION 'Teslimat adresi eksik.' USING ERRCODE = '22023';
  END IF;

  SELECT coalesce((value->>'rate')::numeric, 20)
  INTO v_tax_rate FROM public.site_settings WHERE key = 'tax';
  v_tax_rate := coalesce(v_tax_rate, 20);

  SELECT value INTO v_shipping_cfg FROM public.site_settings WHERE key = 'shipping_methods';
  SELECT method.value INTO v_shipping_row
  FROM jsonb_array_elements(coalesce(v_shipping_cfg->'methods', '[]'::jsonb)) AS method(value)
  WHERE method.value->>'id' = p_shipping_method
  LIMIT 1;
  IF v_shipping_row IS NULL THEN
    RAISE EXCEPTION 'Geçersiz kargo yöntemi.' USING ERRCODE = '22023';
  END IF;
  v_shipping := greatest(coalesce((v_shipping_row->>'price')::numeric, 0), 0);
  IF v_method = 'cod' THEN
    v_cod_fee := greatest(coalesce((v_shipping_cfg->>'codFee')::numeric, 0), 0);
  END IF;

  -- Lock every product in a deterministic order and calculate prices from DB.
  FOR v_item IN
    SELECT value FROM jsonb_array_elements(p_items)
    ORDER BY value->>'product_id'
  LOOP
    BEGIN
      v_quantity := (v_item->>'quantity')::int;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Geçersiz ürün adedi.' USING ERRCODE = '22023';
    END;
    IF v_quantity < 1 OR v_quantity > 100 THEN
      RAISE EXCEPTION 'Ürün adedi 1-100 arasında olmalıdır.' USING ERRCODE = '22023';
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::uuid AND is_active = TRUE
    FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Ürün bulunamadı veya satışta değil.' USING ERRCODE = 'P0002';
    END IF;
    IF v_product.stock < v_quantity THEN
      RAISE EXCEPTION '% için yeterli stok yok.', v_product.name USING ERRCODE = 'P0001';
    END IF;
    v_subtotal := v_subtotal + round(v_product.price * v_quantity, 2);
  END LOOP;

  IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE upper(code) = upper(trim(p_coupon_code))
      AND is_active = TRUE
      AND (start_date IS NULL OR start_date <= now())
      AND (end_date IS NULL OR end_date >= now())
      AND (usage_limit = 0 OR usage_count < usage_limit)
    FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Kupon geçersiz veya kullanım süresi dolmuş.' USING ERRCODE = 'P0001';
    END IF;
    IF coalesce(v_coupon.min_order_amount, 0) > v_subtotal THEN
      RAISE EXCEPTION 'Kupon için minimum sepet tutarı sağlanmıyor.' USING ERRCODE = 'P0001';
    END IF;
    IF v_coupon.type = 'percentage' THEN
      v_discount := round(v_subtotal * v_coupon.value / 100, 2);
      IF v_coupon.max_discount IS NOT NULL THEN
        v_discount := least(v_discount, v_coupon.max_discount);
      END IF;
    ELSIF v_coupon.type = 'fixed' THEN
      v_discount := least(v_subtotal, v_coupon.value);
    ELSIF v_coupon.type = 'shipping' THEN
      v_shipping := 0;
    END IF;
  END IF;

  IF p_service_slot_id IS NOT NULL THEN
    SELECT * INTO v_slot FROM public.service_slots WHERE id = p_service_slot_id FOR UPDATE;
    IF NOT FOUND OR NOT v_slot.is_available OR v_slot.booked >= v_slot.capacity OR v_slot.slot_date < current_date THEN
      RAISE EXCEPTION 'Seçilen servis randevusu artık uygun değil.' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  v_total := round((greatest(v_subtotal - v_discount, 0) + v_shipping + v_cod_fee) * (1 + v_tax_rate / 100), 2);
  v_order_number := 'AQ-' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  INSERT INTO public.orders (
    user_id, order_number, status, subtotal, shipping_cost, cod_fee, discount, total,
    payment_method, payment_status, shipping_address, billing_address, notes,
    coupon_code, service_slot_id, installation_slot, stock_reserved
  ) VALUES (
    v_uid, v_order_number, CASE WHEN v_method = 'cod' THEN 'processing' ELSE 'pending' END,
    round(greatest(v_subtotal - v_discount, 0), 2), v_shipping, v_cod_fee, v_discount, v_total,
    v_method, 'pending', p_shipping_address, coalesce(p_billing_address, p_shipping_address),
    nullif(trim(p_notes), ''), nullif(upper(trim(p_coupon_code)), ''), p_service_slot_id,
    CASE WHEN p_service_slot_id IS NULL THEN NULL ELSE (v_slot.slot_date::text || ' ' || split_part(v_slot.slot_time, ' ', 1))::timestamptz END,
    TRUE
  ) RETURNING id INTO v_order_id;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    v_quantity := (v_item->>'quantity')::int;
    SELECT * INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::uuid FOR UPDATE;
    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES (
      v_order_id, v_product.id, v_product.name, v_quantity,
      round(v_product.price * (1 + coalesce(v_product.tax_rate, v_tax_rate) / 100), 2),
      round(v_product.price * v_quantity * (1 + coalesce(v_product.tax_rate, v_tax_rate) / 100), 2)
    );
    UPDATE public.products SET stock = stock - v_quantity, updated_at = now() WHERE id = v_product.id;
  END LOOP;

  IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
    UPDATE public.coupons SET usage_count = usage_count + 1, updated_at = now() WHERE id = v_coupon.id;
  END IF;
  IF p_service_slot_id IS NOT NULL THEN
    UPDATE public.service_slots
    SET booked = booked + 1, is_available = (booked + 1) < capacity
    WHERE id = p_service_slot_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true, 'order_id', v_order_id, 'order_number', v_order_number,
    'subtotal', round(greatest(v_subtotal - v_discount, 0), 2),
    'shipping_cost', v_shipping, 'cod_fee', v_cod_fee, 'discount', v_discount, 'total', v_total
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_checkout_order(JSONB, JSONB, JSONB, TEXT, TEXT, TEXT, TEXT, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_checkout_order(JSONB, JSONB, JSONB, TEXT, TEXT, TEXT, TEXT, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.cancel_my_order(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501'; END IF;
  UPDATE public.orders SET status = 'cancelled', updated_at = now()
  WHERE id = p_order_id AND user_id = auth.uid() AND status = 'pending' AND payment_status = 'pending';
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'not_cancellable'); END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.cancel_my_order(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_my_order(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.confirm_order_fulfillment(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_order public.orders%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Sipariş bulunamadı.' USING ERRCODE = 'P0002'; END IF;
  -- New checkout orders already reserve stock atomically. Legacy orders are
  -- deliberately not mutated here; administrators can reconcile them first.
  UPDATE public.orders SET status = 'processing', updated_at = now()
  WHERE id = p_order_id AND status = 'pending';
END;
$$;
REVOKE ALL ON FUNCTION public.confirm_order_fulfillment(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_fulfillment(UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.release_cancelled_order_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_item record;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled' THEN
    IF NEW.stock_reserved AND NOT NEW.stock_released THEN
      FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id AND product_id IS NOT NULL LOOP
        UPDATE public.products SET stock = stock + v_item.quantity, updated_at = now() WHERE id = v_item.product_id;
      END LOOP;
    END IF;
    IF NEW.coupon_code IS NOT NULL AND NOT NEW.coupon_released THEN
      UPDATE public.coupons SET usage_count = greatest(usage_count - 1, 0), updated_at = now()
      WHERE upper(code) = upper(NEW.coupon_code);
    END IF;
    IF NEW.service_slot_id IS NOT NULL AND NOT NEW.service_slot_released THEN
      UPDATE public.service_slots SET booked = greatest(booked - 1, 0), is_available = TRUE
      WHERE id = NEW.service_slot_id;
    END IF;
    UPDATE public.orders SET
      stock_released = stock_released OR stock_reserved,
      coupon_released = coupon_released OR coupon_code IS NOT NULL,
      service_slot_released = service_slot_released OR service_slot_id IS NOT NULL
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_release_cancelled_order_stock ON public.orders;
CREATE TRIGGER trg_release_cancelled_order_stock
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.release_cancelled_order_stock();

-- PayTR input is derived from the stored order. Legacy client amount/basket
-- parameters are intentionally ignored to keep API compatibility.
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
  v_order public.orders%ROWTYPE;
  v_merchant_id text;
  v_merchant_key text;
  v_merchant_salt text;
  v_test_mode text;
  v_merchant_oid text;
  v_basket text;
  v_amount integer;
  v_hash_str text;
  v_token text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id AND user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Sipariş bulunamadı.' USING ERRCODE = 'P0002'; END IF;
  IF v_order.payment_method <> 'card' OR v_order.payment_status <> 'pending' THEN
    RAISE EXCEPTION 'Sipariş kartla ödemeye uygun değil.' USING ERRCODE = 'P0001';
  END IF;

  cfg := public.paytr_get_settings();
  v_merchant_id := coalesce(cfg->>'merchantId', '');
  v_merchant_key := coalesce(cfg->>'merchantKey', '');
  v_merchant_salt := coalesce(cfg->>'merchantSalt', '');
  v_test_mode := CASE WHEN coalesce((cfg->>'testMode')::boolean, true) THEN '1' ELSE '0' END;
  IF NOT coalesce((cfg->>'enabled')::boolean, false) OR v_merchant_id = '' OR v_merchant_key = '' OR v_merchant_salt = '' THEN
    RAISE EXCEPTION 'PayTR yapılandırılmamış.' USING ERRCODE = 'P0001';
  END IF;

  v_merchant_oid := left(regexp_replace(v_order.order_number, '[^a-zA-Z0-9]', '', 'g'), 64);
  v_amount := round(v_order.total * 100)::integer;
  SELECT encode(convert_to(coalesce(jsonb_agg(jsonb_build_array(product_name, unit_price::text, quantity)), '[]'::jsonb)::text, 'UTF8'), 'base64')
  INTO v_basket FROM public.order_items WHERE order_id = v_order.id;
  v_hash_str := v_merchant_id || p_user_ip || v_merchant_oid || p_email || v_amount::text || v_basket || '0' || '0' || 'TL' || v_test_mode;
  v_token := public.paytr_hmac(v_hash_str || v_merchant_salt, v_merchant_key);

  UPDATE public.orders
  SET notes = concat_ws(' | ', nullif(notes, ''), 'paytr_oid:' || v_merchant_oid), updated_at = now()
  WHERE id = v_order.id AND coalesce(notes, '') NOT LIKE '%paytr_oid:%';

  RETURN jsonb_build_object(
    'merchant_id', v_merchant_id, 'merchant_oid', v_merchant_oid, 'paytr_token', v_token,
    'order_number', v_order.order_number,
    'user_basket', v_basket, 'payment_amount', v_amount, 'test_mode', v_test_mode,
    'debug_on', v_test_mode, 'no_installment', '0', 'max_installment', '0', 'currency', 'TL'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.paytr_handle_webhook(
  p_merchant_oid text, p_status text, p_total_amount text, p_hash text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg jsonb;
  v_expected_hash text;
  v_order public.orders%ROWTYPE;
  v_item record;
  v_expected_amount integer;
  v_loyalty integer;
BEGIN
  cfg := public.paytr_get_settings();
  IF coalesce(cfg->>'merchantKey', '') = '' OR coalesce(cfg->>'merchantSalt', '') = '' THEN
    RAISE EXCEPTION 'PAYTR settings missing' USING ERRCODE = 'P0001';
  END IF;
  v_expected_hash := public.paytr_hmac(p_merchant_oid || (cfg->>'merchantSalt') || p_status || p_total_amount, cfg->>'merchantKey');
  IF v_expected_hash <> p_hash THEN RAISE EXCEPTION 'PAYTR notification failed: bad hash' USING ERRCODE = '22023'; END IF;

  SELECT * INTO v_order FROM public.orders
  WHERE regexp_replace(order_number, '[^a-zA-Z0-9]', '', 'g') = p_merchant_oid
  FOR UPDATE;
  IF NOT FOUND THEN RETURN 'OK'; END IF;

  v_expected_amount := round(v_order.total * 100)::integer;
  IF p_status = 'success' AND (p_total_amount !~ '^[0-9]+$' OR p_total_amount::integer <> v_expected_amount) THEN
    RAISE EXCEPTION 'PAYTR notification failed: amount mismatch' USING ERRCODE = '22023';
  END IF;
  IF v_order.payment_status = 'paid' THEN RETURN 'OK'; END IF;

  IF p_status = 'success' THEN
    v_loyalty := floor(coalesce(v_order.total, 0) / 10);
    UPDATE public.profiles SET loyalty_points = coalesce(loyalty_points, 0) + v_loyalty
    WHERE id = v_order.user_id AND v_loyalty > 0;
    UPDATE public.orders SET payment_status = 'paid', status = 'processing', updated_at = now() WHERE id = v_order.id;
  ELSE
    IF v_order.stock_reserved AND NOT v_order.stock_released THEN
      FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = v_order.id AND product_id IS NOT NULL LOOP
        UPDATE public.products SET stock = stock + v_item.quantity, updated_at = now() WHERE id = v_item.product_id;
      END LOOP;
    END IF;
    UPDATE public.orders
    SET payment_status = 'failed', status = 'cancelled', stock_released = TRUE, updated_at = now()
    WHERE id = v_order.id;
  END IF;
  RETURN 'OK';
END;
$$;

-- Public callers must not invoke internal payment/settings helpers directly.
REVOKE ALL ON FUNCTION public.paytr_get_settings() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.paytr_prepare_payment(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT) FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.paytr_hmac(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.paytr_handle_webhook(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.finalize_paytr_payment(
  p_merchant_oid TEXT, p_status TEXT, p_total_amount TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_expected_amount INT;
  v_loyalty INT;
BEGIN
  SELECT * INTO v_order FROM public.orders
  WHERE regexp_replace(order_number, '[^a-zA-Z0-9]', '', 'g') = p_merchant_oid
  FOR UPDATE;
  IF NOT FOUND THEN RETURN 'OK'; END IF;
  v_expected_amount := round(v_order.total * 100)::int;
  IF p_status = 'success' AND (p_total_amount !~ '^[0-9]+$' OR p_total_amount::int <> v_expected_amount) THEN
    RAISE EXCEPTION 'PAYTR amount mismatch' USING ERRCODE = '22023';
  END IF;
  IF v_order.payment_status = 'paid' THEN RETURN 'OK'; END IF;
  IF p_status = 'success' THEN
    v_loyalty := floor(coalesce(v_order.total, 0) / 10);
    UPDATE public.profiles SET loyalty_points = coalesce(loyalty_points, 0) + v_loyalty
    WHERE id = v_order.user_id AND v_loyalty > 0;
    UPDATE public.orders SET payment_status = 'paid', status = 'processing', updated_at = now()
    WHERE id = v_order.id;
  ELSE
    UPDATE public.orders SET payment_status = 'failed', status = 'cancelled', updated_at = now()
    WHERE id = v_order.id;
  END IF;
  RETURN 'OK';
END;
$$;
REVOKE ALL ON FUNCTION public.finalize_paytr_payment(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_paytr_payment(TEXT, TEXT, TEXT) TO service_role;

-- Secrets are runtime environment variables; remove legacy DB copies.
DROP TRIGGER IF EXISTS trg_sync_paytr_public ON public.site_settings;
DELETE FROM public.site_settings WHERE key = 'paytr';

-- Bound slot generation and require an authenticated caller.
CREATE OR REPLACE FUNCTION public.ensure_service_slots(p_days_ahead INT DEFAULT 14)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d INT;
  t TEXT;
  v_days INT := least(greatest(coalesce(p_days_ahead, 14), 1), 31);
  times TEXT[] := ARRAY['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'];
BEGIN
  FOR d IN 0..v_days - 1 LOOP
    FOREACH t IN ARRAY times LOOP
      INSERT INTO public.service_slots (slot_date, slot_time, capacity, booked, is_available)
      VALUES (current_date + d, t, 3, 0, TRUE)
      ON CONFLICT (slot_date, slot_time) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_service_slots(INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_service_slots(INT) TO authenticated;

REVOKE ALL ON FUNCTION public.increment_coupon_usage(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.book_service_slot(UUID) FROM PUBLIC, anon, authenticated;

-- Internal notification helper: callers may only notify themselves unless admin.
CREATE OR REPLACE FUNCTION public.create_user_notification(
  p_user_id UUID, p_title TEXT, p_message TEXT, p_type TEXT DEFAULT 'info', p_link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID;
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Başka bir kullanıcı için bildirim oluşturulamaz.' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (p_user_id, left(p_title, 160), left(p_message, 1000), p_type, p_link)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_user_notification(UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_user_notification(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role;

-- Abandoned-cart storefront writes are scoped to an opaque session id.
DROP POLICY IF EXISTS "abandoned_carts_insert_public" ON public.abandoned_carts;
DROP POLICY IF EXISTS "abandoned_carts_update_public" ON public.abandoned_carts;

CREATE OR REPLACE FUNCTION public.sync_abandoned_cart(
  p_session_id TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_items JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_total NUMERIC(12,2) := 0;
  v_item JSONB;
  v_qty INT;
  v_price NUMERIC;
BEGIN
  IF p_session_id !~ '^session-[A-Za-z0-9.-]{16,140}$' THEN
    RAISE EXCEPTION 'Geçersiz sepet oturumu.' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) < 1 OR jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Geçersiz sepet içeriği.' USING ERRCODE = '22023';
  END IF;
  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    v_qty := least(greatest(coalesce((v_item->>'quantity')::int, 0), 0), 100);
    v_price := least(greatest(coalesce((v_item->>'price')::numeric, 0), 0), 1000000);
    v_total := v_total + v_qty * v_price;
  END LOOP;

  PERFORM pg_advisory_xact_lock(hashtext(p_session_id));
  SELECT id INTO v_id FROM public.abandoned_carts
  WHERE session_id = p_session_id AND status <> 'converted'
  ORDER BY created_at DESC LIMIT 1 FOR UPDATE;

  IF v_id IS NULL THEN
    INSERT INTO public.abandoned_carts (
      session_id, user_id, customer_name, customer_email, items, total, status, last_activity
    ) VALUES (
      p_session_id, auth.uid(), left(coalesce(nullif(trim(p_customer_name), ''), 'Misafir'), 120),
      left(nullif(trim(p_customer_email), ''), 254), p_items, round(v_total, 2), 'new', now()
    );
  ELSE
    UPDATE public.abandoned_carts SET
      user_id = coalesce(auth.uid(), user_id),
      customer_name = left(coalesce(nullif(trim(p_customer_name), ''), customer_name), 120),
      customer_email = left(coalesce(nullif(trim(p_customer_email), ''), customer_email), 254),
      items = p_items, total = round(v_total, 2), last_activity = now(), updated_at = now()
    WHERE id = v_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_abandoned_cart_converted(p_session_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_session_id !~ '^session-[A-Za-z0-9.-]{16,140}$' THEN RETURN; END IF;
  UPDATE public.abandoned_carts SET status = 'converted', updated_at = now()
  WHERE session_id = p_session_id AND status <> 'converted';
END;
$$;
REVOKE ALL ON FUNCTION public.sync_abandoned_cart(TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_abandoned_cart(TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_abandoned_cart_converted(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_abandoned_cart_converted(TEXT) TO anon, authenticated;

DROP POLICY IF EXISTS "stock_notifications_insert_public" ON public.stock_notifications;
CREATE OR REPLACE FUNCTION public.subscribe_stock_notification(p_product_id UUID, p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_product public.products%ROWTYPE;
BEGIN
  IF p_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' OR length(p_email) > 254 THEN
    RAISE EXCEPTION 'Geçerli bir e-posta adresi girin.' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_product FROM public.products WHERE id = p_product_id AND is_active = TRUE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Ürün bulunamadı.' USING ERRCODE = 'P0002'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(p_product_id::text || lower(trim(p_email))));
  IF NOT EXISTS (
    SELECT 1 FROM public.stock_notifications
    WHERE product_id = p_product_id AND lower(email) = lower(trim(p_email)) AND notified = FALSE
  ) THEN
    INSERT INTO public.stock_notifications (product_id, product_name, email, notified)
    VALUES (p_product_id, v_product.name, lower(trim(p_email)), FALSE);
  END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.subscribe_stock_notification(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_stock_notification(UUID, TEXT) TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.email_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abandoned_cart_id UUID REFERENCES public.abandoned_carts(id) ON DELETE SET NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INT NOT NULL DEFAULT 0,
  last_error TEXT,
  dedupe_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "email_outbox_admin_select" ON public.email_outbox;
CREATE POLICY "email_outbox_admin_select" ON public.email_outbox FOR SELECT USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.queue_abandoned_cart_reminder(p_cart_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_cart public.abandoned_carts%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_cart FROM public.abandoned_carts WHERE id = p_cart_id FOR UPDATE;
  IF NOT FOUND OR v_cart.status = 'converted' THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;
  IF v_cart.customer_email IS NULL OR v_cart.customer_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'missing_email');
  END IF;
  INSERT INTO public.email_outbox (abandoned_cart_id, recipient, subject, html_body, dedupe_key)
  VALUES (
    v_cart.id, lower(v_cart.customer_email), 'Sepetiniz sizi bekliyor',
    '<h2>Sepetiniz sizi bekliyor</h2><p>Aquails sepetinizdeki ürünleri tamamlamak için mağazamıza dönebilirsiniz.</p>',
    'abandoned-cart:' || v_cart.id::text
  ) ON CONFLICT (dedupe_key) DO NOTHING;
  UPDATE public.abandoned_carts SET status = 'reminder-sent', updated_at = now() WHERE id = v_cart.id;
  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.queue_abandoned_cart_reminder(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.queue_abandoned_cart_reminder(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.queue_stock_notification(p_notification_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_notice public.stock_notifications%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_notice FROM public.stock_notifications WHERE id = p_notification_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'not_found'); END IF;
  INSERT INTO public.email_outbox (recipient, subject, html_body, dedupe_key)
  VALUES (
    lower(v_notice.email), v_notice.product_name || ' yeniden stokta',
    '<h2>Beklediğiniz ürün yeniden stokta</h2><p>' || replace(v_notice.product_name, '<', '&lt;') || ' ürününü mağazamızdan inceleyebilirsiniz.</p>',
    'stock-notification:' || v_notice.id::text
  ) ON CONFLICT (dedupe_key) DO NOTHING;
  UPDATE public.stock_notifications SET notified = TRUE WHERE id = v_notice.id;
  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.queue_stock_notification(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.queue_stock_notification(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_email_outbox(p_limit INT DEFAULT 25)
RETURNS SETOF public.email_outbox
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH picked AS (
    SELECT id FROM public.email_outbox
    WHERE status IN ('pending', 'failed') AND attempts < 5
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT least(greatest(p_limit, 1), 50)
  )
  UPDATE public.email_outbox e
  SET status = 'processing', attempts = attempts + 1
  FROM picked
  WHERE e.id = picked.id
  RETURNING e.*;
$$;
REVOKE ALL ON FUNCTION public.claim_email_outbox(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_email_outbox(INT) TO service_role;

DROP POLICY IF EXISTS "contact_messages_insert_public" ON public.contact_messages;
REVOKE INSERT ON public.contact_messages FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.submit_contact_message(
  p_name TEXT, p_email TEXT, p_phone TEXT, p_subject TEXT, p_message TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_email TEXT := lower(trim(p_email));
BEGIN
  IF length(trim(p_name)) < 2 OR length(trim(p_name)) > 120
     OR v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
     OR length(trim(p_message)) < 5 OR length(trim(p_message)) > 5000 THEN
    RAISE EXCEPTION 'İletişim formu alanları geçersiz.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('contact:' || v_email));
  IF (SELECT count(*) FROM public.contact_messages WHERE email = v_email AND created_at > now() - interval '10 minutes') >= 3 THEN
    RAISE EXCEPTION 'Çok fazla mesaj gönderdiniz. Lütfen daha sonra tekrar deneyin.' USING ERRCODE = 'P0001';
  END IF;
  INSERT INTO public.contact_messages (name, email, phone, subject, message, status)
  VALUES (
    left(trim(p_name), 120), v_email, left(trim(coalesce(p_phone, '')), 30),
    left(coalesce(nullif(trim(p_subject), ''), 'Genel Bilgi'), 160), trim(p_message), 'new'
  );
  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.submit_contact_message(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_message(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
