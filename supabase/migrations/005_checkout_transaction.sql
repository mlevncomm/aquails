-- Atomic checkout via Postgres transaction (called from checkout Edge Function with service role)

CREATE OR REPLACE FUNCTION public.checkout_order(
  p_user_id uuid,
  p_session_id text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_payment_method text,
  p_shipping_address jsonb,
  p_notes text DEFAULT NULL,
  p_coupon_code text DEFAULT NULL,
  p_service_slot_id uuid DEFAULT NULL,
  p_shipping_cost numeric DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cart_id uuid;
  v_cart_item record;
  v_product record;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_shipping numeric := COALESCE(p_shipping_cost, 0);
  v_total numeric;
  v_coupon record;
  v_order_id uuid;
  v_order_number text;
  v_payment_status text := 'pending';
BEGIN
  IF p_user_id IS NOT NULL THEN
    SELECT id INTO v_cart_id FROM public.carts WHERE user_id = p_user_id LIMIT 1;
  ELSIF p_session_id IS NOT NULL AND length(trim(p_session_id)) > 0 THEN
    SELECT id INTO v_cart_id FROM public.carts WHERE session_id = trim(p_session_id) LIMIT 1;
  ELSE
    RAISE EXCEPTION 'Sepet oturumu gerekli' USING ERRCODE = 'P0001';
  END IF;

  IF v_cart_id IS NULL THEN
    RAISE EXCEPTION 'Sepet boş' USING ERRCODE = 'P0001';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.cart_items WHERE cart_id = v_cart_id) THEN
    RAISE EXCEPTION 'Sepet boş' USING ERRCODE = 'P0001';
  END IF;

  FOR v_cart_item IN
    SELECT ci.product_id, ci.quantity
    FROM public.cart_items ci
    WHERE ci.cart_id = v_cart_id
    FOR UPDATE
  LOOP
    SELECT * INTO v_product
    FROM public.products
    WHERE id = v_cart_item.product_id AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Ürün bulunamadı: %', v_cart_item.product_id USING ERRCODE = 'P0001';
    END IF;

    IF v_product.stock < v_cart_item.quantity THEN
      RAISE EXCEPTION 'Yetersiz stok: %', v_product.name USING ERRCODE = 'P0001';
    END IF;

    v_subtotal := v_subtotal + (v_product.price * v_cart_item.quantity);
  END LOOP;

  IF p_coupon_code IS NOT NULL AND length(trim(p_coupon_code)) > 0 THEN
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE upper(code) = upper(trim(p_coupon_code))
      AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Geçersiz kupon kodu' USING ERRCODE = 'P0001';
    END IF;

    IF v_coupon.starts_at IS NOT NULL AND v_coupon.starts_at > now() THEN
      RAISE EXCEPTION 'Kupon henüz geçerli değil' USING ERRCODE = 'P0001';
    END IF;

    IF v_coupon.ends_at IS NOT NULL AND v_coupon.ends_at < now() THEN
      RAISE EXCEPTION 'Kupon süresi dolmuş' USING ERRCODE = 'P0001';
    END IF;

    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
      RAISE EXCEPTION 'Kupon kullanım limiti dolmuş' USING ERRCODE = 'P0001';
    END IF;

    IF v_coupon.min_order_amount > v_subtotal THEN
      RAISE EXCEPTION 'Minimum sipariş tutarı karşılanmıyor' USING ERRCODE = 'P0001';
    END IF;

    IF v_coupon.type = 'percent' THEN
      v_discount := round(v_subtotal * (v_coupon.value / 100), 2);
      IF v_coupon.max_discount IS NOT NULL THEN
        v_discount := least(v_discount, v_coupon.max_discount);
      END IF;
    ELSIF v_coupon.type = 'fixed' THEN
      v_discount := least(v_coupon.value, v_subtotal);
    ELSIF v_coupon.type = 'shipping' THEN
      v_shipping := 0;
      v_discount := 0;
    END IF;
  END IF;

  v_total := greatest(0, v_subtotal + v_shipping - v_discount);

  IF p_service_slot_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.service_slots
      WHERE id = p_service_slot_id AND status = 'available'
      FOR UPDATE
    ) THEN
      RAISE EXCEPTION 'Seçilen kurulum slotu müsait değil' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  INSERT INTO public.orders (
    user_id, customer_name, customer_email, customer_phone,
    status, payment_status, subtotal, shipping_cost, discount, total,
    shipping_address, payment_method, installation_slot_id, notes
  ) VALUES (
    p_user_id, p_customer_name, p_customer_email, p_customer_phone,
    'pending', v_payment_status, v_subtotal, v_shipping, v_discount, v_total,
    p_shipping_address, p_payment_method, p_service_slot_id, p_notes
  )
  RETURNING id, order_number, total, payment_status INTO v_order_id, v_order_number, v_total, v_payment_status;

  FOR v_cart_item IN
    SELECT ci.product_id, ci.quantity
    FROM public.cart_items ci
    WHERE ci.cart_id = v_cart_id
  LOOP
    SELECT * INTO v_product FROM public.products WHERE id = v_cart_item.product_id FOR UPDATE;

    INSERT INTO public.order_items (
      order_id, product_id, product_name_snapshot, quantity, unit_price, total_price
    ) VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      v_cart_item.quantity,
      v_product.price,
      v_product.price * v_cart_item.quantity
    );

    UPDATE public.products
    SET stock = stock - v_cart_item.quantity
    WHERE id = v_product.id;
  END LOOP;

  IF p_coupon_code IS NOT NULL AND length(trim(p_coupon_code)) > 0 AND v_coupon.id IS NOT NULL THEN
    UPDATE public.coupons SET usage_count = usage_count + 1 WHERE id = v_coupon.id;
    INSERT INTO public.coupon_usages (coupon_id, user_id, order_id)
    VALUES (v_coupon.id, p_user_id, v_order_id);
  END IF;

  INSERT INTO public.payments (order_id, provider, status, amount)
  VALUES (v_order_id, 'mock', 'pending', v_total);

  IF p_service_slot_id IS NOT NULL THEN
    UPDATE public.service_slots
    SET status = 'booked', order_id = v_order_id
    WHERE id = p_service_slot_id AND status = 'available';
  END IF;

  DELETE FROM public.cart_items WHERE cart_id = v_cart_id;

  RETURN jsonb_build_object(
    'orderId', v_order_id,
    'orderNumber', v_order_number,
    'total', v_total,
    'paymentStatus', v_payment_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.checkout_order(uuid, text, text, text, text, text, jsonb, text, text, uuid, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.checkout_order(uuid, text, text, text, text, text, jsonb, text, text, uuid, numeric) TO service_role;
