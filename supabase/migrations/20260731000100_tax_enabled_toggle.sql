-- Tax toggle: site_settings.tax.enabled
-- When enabled=false, create_checkout_order charges net prices (no VAT).

UPDATE public.site_settings
SET value = coalesce(value, '{}'::jsonb) || '{"enabled": true}'::jsonb,
    updated_at = now()
WHERE key = 'tax'
  AND (value->>'enabled') IS NULL;

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
  v_line_tax NUMERIC(5,2) := 20;
  v_tax_json JSONB;
  v_tax_enabled BOOLEAN := true;
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

  SELECT value INTO v_tax_json FROM public.site_settings WHERE key = 'tax';
  v_tax_enabled := coalesce((v_tax_json->>'enabled')::boolean, true);
  IF NOT v_tax_enabled THEN
    v_tax_rate := 0;
  ELSE
    v_tax_rate := coalesce((v_tax_json->>'rate')::numeric, 20);
    IF v_tax_rate < 0 THEN
      v_tax_rate := 20;
    END IF;
  END IF;

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
    IF NOT v_tax_enabled OR v_tax_rate <= 0 THEN
      v_line_tax := 0;
    ELSE
      v_line_tax := coalesce(v_product.tax_rate, v_tax_rate);
      IF v_line_tax < 0 THEN
        v_line_tax := v_tax_rate;
      END IF;
    END IF;
    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES (
      v_order_id, v_product.id, v_product.name, v_quantity,
      round(v_product.price * (1 + v_line_tax / 100), 2),
      round(v_product.price * v_quantity * (1 + v_line_tax / 100), 2)
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
