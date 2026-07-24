-- Admin catalog reliability: product image uniqueness + admin-only RPCs.
-- Does not embed secrets or service-role keys.
-- Depends on 20260717000100 for product-images storage bucket/policies.
-- Preserves all product_images rows (normalize sort_order; never DELETE for dedupe).

-- ---------------------------------------------------------------------------
-- Normalize existing sort_order to 0..n-1 per product (no row loss)
-- Two-phase update avoids unique collisions during rewrite.
-- ---------------------------------------------------------------------------
UPDATE public.product_images
SET sort_order = sort_order + 1000000
WHERE TRUE;

WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY product_id
      ORDER BY sort_order ASC, created_at ASC NULLS LAST, id ASC
    ) - 1 AS new_order
  FROM public.product_images
)
UPDATE public.product_images pi
SET sort_order = ordered.new_order,
    updated_at = COALESCE(pi.updated_at, now())
FROM ordered
WHERE pi.id = ordered.id;

ALTER TABLE public.product_images
  DROP CONSTRAINT IF EXISTS product_images_product_id_sort_order_key;

DROP INDEX IF EXISTS product_images_product_id_sort_order_uidx;

ALTER TABLE public.product_images
  ADD CONSTRAINT product_images_product_id_sort_order_uidx
  UNIQUE (product_id, sort_order)
  DEFERRABLE INITIALLY DEFERRED;

-- ---------------------------------------------------------------------------
-- Helpers (admin-only via callers; not granted to anon)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._admin_require_product_lock(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;
  PERFORM 1 FROM public.products WHERE id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public._admin_require_product_lock(UUID) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public._admin_renumber_product_images(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Phase 1: move into a collision-free range
  UPDATE public.product_images
  SET sort_order = sort_order + 1000000
  WHERE product_id = p_product_id;

  -- Phase 2: dense 0..n-1 in current visual order
  WITH ordered AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY sort_order ASC, created_at ASC NULLS LAST, id ASC
      ) - 1 AS new_order
    FROM public.product_images
    WHERE product_id = p_product_id
  )
  UPDATE public.product_images pi
  SET sort_order = ordered.new_order,
      updated_at = now()
  FROM ordered
  WHERE pi.id = ordered.id;
END;
$$;

REVOKE ALL ON FUNCTION public._admin_renumber_product_images(UUID) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- admin_update_product
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_update_product(
  p_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_category_id UUID,
  p_sku TEXT,
  p_short_description TEXT,
  p_description TEXT,
  p_price NUMERIC,
  p_old_price NUMERIC,
  p_stock INT,
  p_is_active BOOLEAN,
  p_specifications JSONB,
  p_tax_rate NUMERIC
)
RETURNS public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.products;
  v_slug TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'name required' USING ERRCODE = '22023';
  END IF;

  v_slug := lower(btrim(COALESCE(p_slug, '')));
  v_slug := regexp_replace(v_slug, '[^a-z0-9]+', '-', 'g');
  v_slug := regexp_replace(v_slug, '-+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  IF v_slug = '' THEN
    RAISE EXCEPTION 'slug required' USING ERRCODE = '22023';
  END IF;

  IF p_category_id IS NULL THEN
    RAISE EXCEPTION 'category required' USING ERRCODE = '22023';
  END IF;
  IF p_price IS NULL OR p_price < 0 OR p_stock IS NULL OR p_stock < 0 THEN
    RAISE EXCEPTION 'invalid price or stock' USING ERRCODE = '22023';
  END IF;
  IF p_old_price IS NOT NULL AND p_old_price < 0 THEN
    RAISE EXCEPTION 'invalid old_price' USING ERRCODE = '22023';
  END IF;
  IF p_tax_rate IS NULL OR p_tax_rate < 0 OR p_tax_rate > 100 THEN
    RAISE EXCEPTION 'invalid tax_rate' USING ERRCODE = '22023';
  END IF;

  PERFORM 1 FROM public.products WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.products
  SET
    name = btrim(p_name),
    slug = v_slug,
    category_id = p_category_id,
    sku = COALESCE(NULLIF(btrim(p_sku), ''), 'AQ-' || v_slug),
    short_description = COALESCE(p_short_description, ''),
    description = COALESCE(p_description, ''),
    price = p_price,
    old_price = p_old_price,
    stock = p_stock,
    is_active = COALESCE(p_is_active, TRUE),
    specifications = COALESCE(p_specifications, '{}'::jsonb),
    tax_rate = p_tax_rate,
    updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'product update failed' USING ERRCODE = 'P0001';
  END IF;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_product(
  UUID, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, INT, BOOLEAN, JSONB, NUMERIC
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_product(
  UUID, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, INT, BOOLEAN, JSONB, NUMERIC
) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_add_product_image
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_add_product_image(
  p_product_id UUID,
  p_url TEXT,
  p_alt_text TEXT DEFAULT NULL,
  p_sort_order INT DEFAULT NULL
)
RETURNS public.product_images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sort INT;
  v_count INT;
  v_row public.product_images;
BEGIN
  PERFORM public._admin_require_product_lock(p_product_id);

  IF p_url IS NULL OR btrim(p_url) = '' THEN
    RAISE EXCEPTION 'url required' USING ERRCODE = '22023';
  END IF;

  SELECT COUNT(*)::INT INTO v_count
  FROM public.product_images
  WHERE product_id = p_product_id;

  IF p_sort_order IS NULL THEN
    v_sort := v_count; -- append under row lock (no MAX+1 race)
  ELSE
    IF p_sort_order < 0 THEN
      RAISE EXCEPTION 'invalid sort_order' USING ERRCODE = '22023';
    END IF;
    v_sort := LEAST(p_sort_order, v_count);
    -- Shift existing rows into free range, then place denser orders
    UPDATE public.product_images
    SET sort_order = sort_order + 1000000
    WHERE product_id = p_product_id;

    WITH ordered AS (
      SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY sort_order ASC, created_at ASC NULLS LAST, id ASC) - 1 AS idx
      FROM public.product_images
      WHERE product_id = p_product_id
    )
    UPDATE public.product_images pi
    SET sort_order = CASE
      WHEN ordered.idx >= v_sort THEN ordered.idx + 1
      ELSE ordered.idx
    END
    FROM ordered
    WHERE pi.id = ordered.id;
  END IF;

  INSERT INTO public.product_images (product_id, url, alt_text, sort_order)
  VALUES (p_product_id, btrim(p_url), NULLIF(btrim(COALESCE(p_alt_text, '')), ''), v_sort)
  RETURNING * INTO v_row;

  PERFORM public._admin_renumber_product_images(p_product_id);

  SELECT * INTO v_row FROM public.product_images WHERE id = v_row.id;
  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_add_product_image(UUID, TEXT, TEXT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_add_product_image(UUID, TEXT, TEXT, INT) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_set_product_primary_image
-- Selected image -> 0; remaining keep relative order as 1..n-1
-- Safe to call repeatedly with different images.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_set_product_primary_image(
  p_product_id UUID,
  p_image_id UUID
)
RETURNS public.product_images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.product_images;
  v_exists BOOLEAN;
BEGIN
  PERFORM public._admin_require_product_lock(p_product_id);

  SELECT EXISTS (
    SELECT 1 FROM public.product_images
    WHERE id = p_image_id AND product_id = p_product_id
  ) INTO v_exists;

  IF NOT v_exists THEN
    RAISE EXCEPTION 'image not found' USING ERRCODE = 'P0002';
  END IF;

  -- Phase 1: free range (avoids unique collisions under deferred constraint too)
  UPDATE public.product_images
  SET sort_order = sort_order + 1000000
  WHERE product_id = p_product_id;

  -- Selected image becomes primary (0)
  UPDATE public.product_images
  SET sort_order = 0, updated_at = now()
  WHERE id = p_image_id AND product_id = p_product_id;

  -- Remaining keep relative order as 1..n-1
  WITH ordered AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY sort_order ASC, created_at ASC NULLS LAST, id ASC
      ) AS new_order
    FROM public.product_images
    WHERE product_id = p_product_id AND id <> p_image_id
  )
  UPDATE public.product_images pi
  SET sort_order = ordered.new_order,
      updated_at = now()
  FROM ordered
  WHERE pi.id = ordered.id;

  SELECT * INTO v_row
  FROM public.product_images
  WHERE id = p_image_id;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_product_primary_image(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_product_primary_image(UUID, UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_reorder_product_images — full permutation only
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_reorder_product_images(
  p_product_id UUID,
  p_ordered_ids UUID[]
)
RETURNS SETOF public.product_images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
  v_len INT;
  v_distinct INT;
  v_matched INT;
  i INT;
BEGIN
  PERFORM public._admin_require_product_lock(p_product_id);

  SELECT COUNT(*)::INT INTO v_count
  FROM public.product_images
  WHERE product_id = p_product_id;

  v_len := COALESCE(array_length(p_ordered_ids, 1), 0);
  IF v_len <> v_count THEN
    RAISE EXCEPTION 'reorder requires complete image list' USING ERRCODE = '22023';
  END IF;

  SELECT COUNT(DISTINCT x)::INT INTO v_distinct FROM unnest(p_ordered_ids) AS x;
  IF v_distinct <> v_len THEN
    RAISE EXCEPTION 'reorder ids must be unique' USING ERRCODE = '22023';
  END IF;

  SELECT COUNT(*)::INT INTO v_matched
  FROM public.product_images
  WHERE product_id = p_product_id
    AND id = ANY (p_ordered_ids);

  IF v_matched <> v_count THEN
    RAISE EXCEPTION 'reorder contains unknown image id' USING ERRCODE = '22023';
  END IF;

  UPDATE public.product_images
  SET sort_order = sort_order + 1000000
  WHERE product_id = p_product_id;

  FOR i IN 1 .. v_len LOOP
    UPDATE public.product_images
    SET sort_order = i - 1, updated_at = now()
    WHERE id = p_ordered_ids[i] AND product_id = p_product_id;
  END LOOP;

  RETURN QUERY
    SELECT * FROM public.product_images
    WHERE product_id = p_product_id
    ORDER BY sort_order, created_at;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reorder_product_images(UUID, UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reorder_product_images(UUID, UUID[]) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_delete_product_image_record + renumber
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_delete_product_image_record(
  p_image_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_url TEXT;
  v_product_id UUID;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;

  SELECT url, product_id INTO v_url, v_product_id
  FROM public.product_images
  WHERE id = p_image_id;

  IF v_url IS NULL THEN
    RAISE EXCEPTION 'image not found' USING ERRCODE = 'P0002';
  END IF;

  PERFORM public._admin_require_product_lock(v_product_id);

  DELETE FROM public.product_images WHERE id = p_image_id;
  PERFORM public._admin_renumber_product_images(v_product_id);

  RETURN jsonb_build_object(
    'success', true,
    'product_id', v_product_id,
    'url', v_url
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_product_image_record(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_product_image_record(UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_adjust_product_stock (atomic)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_adjust_product_stock(
  p_product_id UUID,
  p_delta INT
)
RETURNS public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.products;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;
  IF p_delta IS NULL THEN
    RAISE EXCEPTION 'delta required' USING ERRCODE = '22023';
  END IF;

  UPDATE public.products
  SET stock = GREATEST(0, stock + p_delta),
      updated_at = now()
  WHERE id = p_product_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_adjust_product_stock(UUID, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_adjust_product_stock(UUID, INT) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_save_shipping_bundle — shipping methods + free-shipping threshold
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_save_shipping_bundle(
  p_shipping JSONB,
  p_free_shipping_threshold NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;
  IF p_shipping IS NULL OR jsonb_typeof(p_shipping) <> 'object' THEN
    RAISE EXCEPTION 'shipping config required' USING ERRCODE = '22023';
  END IF;
  IF p_free_shipping_threshold IS NULL OR p_free_shipping_threshold < 0 THEN
    RAISE EXCEPTION 'invalid free shipping threshold' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.site_settings (key, value)
  VALUES ('shipping_methods', p_shipping)
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO public.site_settings (key, value)
  VALUES (
    'site',
    COALESCE(
      (SELECT value FROM public.site_settings WHERE key = 'site'),
      '{}'::jsonb
    ) || jsonb_build_object('freeShippingLimit', p_free_shipping_threshold)
  )
  ON CONFLICT (key) DO UPDATE
  SET value = public.site_settings.value || jsonb_build_object('freeShippingLimit', p_free_shipping_threshold);

  INSERT INTO public.site_settings (key, value)
  VALUES ('free_shipping_threshold', jsonb_build_object('text', p_free_shipping_threshold::text))
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_save_shipping_bundle(JSONB, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_save_shipping_bundle(JSONB, NUMERIC) TO authenticated;
