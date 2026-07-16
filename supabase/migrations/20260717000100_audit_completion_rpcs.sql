-- Guest order tracking, referral conversion, offline payment confirm,
-- service calendar slots, product-images storage policies, cart helpers.

-- 1) Guest order tracking (SECURITY DEFINER — returns limited fields only)
CREATE OR REPLACE FUNCTION public.track_order_by_number_and_contact(
  p_order_number TEXT,
  p_email_or_phone TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_profile public.profiles%ROWTYPE;
  v_query TEXT;
  v_query_phone TEXT;
  v_items JSONB;
BEGIN
  IF p_order_number IS NULL OR length(trim(p_order_number)) < 3 THEN
    RETURN NULL;
  END IF;
  IF p_email_or_phone IS NULL OR length(trim(p_email_or_phone)) < 3 THEN
    RETURN NULL;
  END IF;

  v_query := lower(trim(p_email_or_phone));
  v_query_phone := regexp_replace(v_query, '\s+', '', 'g');

  SELECT * INTO v_order
  FROM public.orders
  WHERE order_number = trim(p_order_number)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = v_order.user_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF lower(coalesce(v_profile.email, '')) <> v_query
     AND regexp_replace(coalesce(v_profile.phone, ''), '\s+', '', 'g') <> v_query_phone
     AND NOT (
       length(v_query_phone) >= 10
       AND right(regexp_replace(coalesce(v_profile.phone, ''), '\s+', '', 'g'), 10)
           = right(v_query_phone, 10)
     )
  THEN
    RETURN NULL;
  END IF;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'name', oi.product_name,
    'qty', oi.quantity,
    'price', oi.unit_price
  )), '[]'::jsonb)
  INTO v_items
  FROM public.order_items oi
  WHERE oi.order_id = v_order.id;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'status', v_order.status,
    'payment_status', v_order.payment_status,
    'payment_method', v_order.payment_method,
    'cargo_company', v_order.cargo_company,
    'tracking_number', v_order.tracking_number,
    'shipping_address', v_order.shipping_address,
    'total', v_order.total,
    'created_at', v_order.created_at,
    'items', v_items
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_order_by_number_and_contact(TEXT, TEXT) TO anon, authenticated;

-- 2) Referral: ensure profile code + track signup by code
CREATE OR REPLACE FUNCTION public.ensure_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_code TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT referral_code INTO v_code FROM public.profiles WHERE id = v_uid;
  IF v_code IS NULL OR v_code = '' THEN
    v_code := 'AQUAILS' || upper(substr(replace(v_uid::text, '-', ''), 1, 6));
    UPDATE public.profiles SET referral_code = v_code WHERE id = v_uid;
  END IF;
  RETURN v_code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_referral_code() TO authenticated;

CREATE OR REPLACE FUNCTION public.track_referral_signup(p_referral_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_referrer UUID;
  v_email TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_referral_code IS NULL OR length(trim(p_referral_code)) < 3 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  SELECT id INTO v_referrer
  FROM public.profiles
  WHERE upper(referral_code) = upper(trim(p_referral_code))
  LIMIT 1;

  IF v_referrer IS NULL OR v_referrer = v_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_or_self');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.referrals
    WHERE referred_user_id = v_uid
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_tracked');
  END IF;

  SELECT email INTO v_email FROM public.profiles WHERE id = v_uid;

  INSERT INTO public.referrals (referrer_id, referred_email, referred_user_id, status)
  VALUES (v_referrer, coalesce(v_email, ''), v_uid, 'completed');

  UPDATE public.profiles
  SET loyalty_points = coalesce(loyalty_points, 0) + 200
  WHERE id = v_referrer;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_referral_signup(TEXT) TO authenticated;

DROP POLICY IF EXISTS "referrals_insert_own" ON public.referrals;
CREATE POLICY "referrals_insert_via_rpc" ON public.referrals
  FOR INSERT WITH CHECK (false);

-- 3) Admin confirms offline payment (havale / COD) then fulfills stock
CREATE OR REPLACE FUNCTION public.admin_confirm_offline_payment(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_order.payment_status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'already_paid', true);
  END IF;

  IF v_order.payment_method NOT IN ('transfer', 'cod', 'Havale/EFT', 'Kapıda Ödeme')
     AND lower(coalesce(v_order.payment_method, '')) NOT LIKE '%havale%'
     AND lower(coalesce(v_order.payment_method, '')) NOT LIKE '%kapıda%'
     AND lower(coalesce(v_order.payment_method, '')) NOT LIKE '%cod%'
  THEN
    -- still allow admin override for pending offline orders
    NULL;
  END IF;

  UPDATE public.orders
  SET payment_status = 'paid',
      status = CASE WHEN status = 'pending' THEN 'processing' ELSE status END,
      updated_at = NOW()
  WHERE id = p_order_id;

  BEGIN
    PERFORM public.confirm_order_fulfillment(p_order_id);
  EXCEPTION WHEN OTHERS THEN
    -- stock already deducted or other non-fatal
    NULL;
  END;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_confirm_offline_payment(UUID) TO authenticated;

-- 4) Service calendar slots
CREATE TABLE IF NOT EXISTS public.service_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 3,
  booked INT NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slot_date, slot_time)
);

ALTER TABLE public.service_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_slots_select_all" ON public.service_slots;
CREATE POLICY "service_slots_select_all" ON public.service_slots
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_slots_admin_all" ON public.service_slots;
CREATE POLICY "service_slots_admin_all" ON public.service_slots
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.book_service_slot(p_slot_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slot public.service_slots%ROWTYPE;
BEGIN
  SELECT * INTO v_slot FROM public.service_slots WHERE id = p_slot_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;
  IF NOT v_slot.is_available OR v_slot.booked >= v_slot.capacity THEN
    RETURN jsonb_build_object('success', false, 'error', 'unavailable');
  END IF;

  UPDATE public.service_slots
  SET booked = booked + 1,
      is_available = (booked + 1) < capacity
  WHERE id = p_slot_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_service_slot(UUID) TO authenticated, anon;

CREATE OR REPLACE FUNCTION public.ensure_service_slots(p_days_ahead INT DEFAULT 14)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d INT;
  t TEXT;
  v_date DATE;
  times TEXT[] := ARRAY['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'];
BEGIN
  FOR d IN 0..GREATEST(p_days_ahead, 1) - 1 LOOP
    v_date := (CURRENT_DATE + d);
    FOREACH t IN ARRAY times LOOP
      INSERT INTO public.service_slots (slot_date, slot_time, capacity, booked, is_available)
      VALUES (v_date, t, 3, 0, TRUE)
      ON CONFLICT (slot_date, slot_time) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_service_slots(INT) TO anon, authenticated;

-- 5) Product images storage bucket + policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());

-- 6) Server cart sync helpers (authenticated users)
CREATE OR REPLACE FUNCTION public.sync_user_cart(p_items JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cart_id UUID;
  v_item JSONB;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO v_cart_id FROM public.carts WHERE user_id = v_uid LIMIT 1;
  IF v_cart_id IS NULL THEN
    INSERT INTO public.carts (user_id) VALUES (v_uid) RETURNING id INTO v_cart_id;
  END IF;

  DELETE FROM public.cart_items WHERE cart_id = v_cart_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  LOOP
    IF (v_item->>'product_id') IS NOT NULL AND (v_item->>'quantity')::int > 0 THEN
      INSERT INTO public.cart_items (cart_id, product_id, quantity, price)
      VALUES (
        v_cart_id,
        (v_item->>'product_id')::uuid,
        (v_item->>'quantity')::int,
        coalesce((v_item->>'price')::numeric, 0)
      )
      ON CONFLICT (cart_id, product_id) DO UPDATE
      SET quantity = EXCLUDED.quantity, price = EXCLUDED.price, updated_at = NOW();
    END IF;
  END LOOP;

  UPDATE public.carts SET updated_at = NOW() WHERE id = v_cart_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_user_cart(JSONB) TO authenticated;
