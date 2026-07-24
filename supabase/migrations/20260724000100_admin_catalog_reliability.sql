-- Admin catalog reliability: product image uniqueness + admin-only RPCs.
-- Does not embed secrets or service-role keys.
-- NOTE: product-images storage bucket must exist (create manually if missing).
-- See README "Ürün görselleri (Storage)" section.

-- Deduplicate (product_id, sort_order): keep the newest row per pair.
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY product_id, sort_order
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
    ) AS rn
  FROM public.product_images
)
DELETE FROM public.product_images pi
USING ranked r
WHERE pi.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS product_images_product_id_sort_order_uidx
  ON public.product_images (product_id, sort_order);

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
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'name required' USING ERRCODE = '22023';
  END IF;
  IF p_slug IS NULL OR btrim(p_slug) = '' THEN
    RAISE EXCEPTION 'slug required' USING ERRCODE = '22023';
  END IF;
  IF p_category_id IS NULL THEN
    RAISE EXCEPTION 'category required' USING ERRCODE = '22023';
  END IF;
  IF p_price IS NULL OR p_price < 0 OR p_stock IS NULL OR p_stock < 0 THEN
    RAISE EXCEPTION 'invalid price or stock' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = p_id) THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.products
  SET
    name = btrim(p_name),
    slug = lower(btrim(p_slug)),
    category_id = p_category_id,
    sku = COALESCE(NULLIF(btrim(p_sku), ''), 'AQ-' || lower(btrim(p_slug))),
    short_description = COALESCE(p_short_description, ''),
    description = COALESCE(p_description, ''),
    price = p_price,
    old_price = p_old_price,
    stock = p_stock,
    is_active = COALESCE(p_is_active, TRUE),
    specifications = COALESCE(p_specifications, '{}'::jsonb),
    tax_rate = COALESCE(p_tax_rate, 20),
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
  v_row public.product_images;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;
  IF p_url IS NULL OR btrim(p_url) = '' THEN
    RAISE EXCEPTION 'url required' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;

  IF p_sort_order IS NULL THEN
    SELECT COALESCE(MAX(sort_order), -1) + 1 INTO v_sort
    FROM public.product_images WHERE product_id = p_product_id;
  ELSE
    v_sort := p_sort_order;
  END IF;

  INSERT INTO public.product_images (product_id, url, alt_text, sort_order)
  VALUES (p_product_id, btrim(p_url), NULLIF(btrim(COALESCE(p_alt_text, '')), ''), v_sort)
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_add_product_image(UUID, TEXT, TEXT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_add_product_image(UUID, TEXT, TEXT, INT) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_set_product_primary_image (atomic)
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
  v_url TEXT;
  v_alt TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT url, alt_text INTO v_url, v_alt
  FROM public.product_images
  WHERE id = p_image_id AND product_id = p_product_id
  FOR UPDATE;

  IF v_url IS NULL THEN
    RAISE EXCEPTION 'image not found' USING ERRCODE = 'P0002';
  END IF;

  -- Shift existing primary (sort_order=0) out of the way, then place selected as 0.
  UPDATE public.product_images
  SET sort_order = sort_order + 1000
  WHERE product_id = p_product_id AND sort_order = 0 AND id <> p_image_id;

  UPDATE public.product_images
  SET sort_order = 0, updated_at = now()
  WHERE id = p_image_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_product_primary_image(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_product_primary_image(UUID, UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_reorder_product_images
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
  i INT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'product not found' USING ERRCODE = 'P0002';
  END IF;

  -- Temporary offset to avoid unique (product_id, sort_order) collisions mid-update.
  UPDATE public.product_images
  SET sort_order = sort_order + 10000
  WHERE product_id = p_product_id;

  FOR i IN 1 .. COALESCE(array_length(p_ordered_ids, 1), 0) LOOP
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
-- admin_delete_product_image_record
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
  WHERE id = p_image_id
  FOR UPDATE;

  IF v_url IS NULL THEN
    RAISE EXCEPTION 'image not found' USING ERRCODE = 'P0002';
  END IF;

  DELETE FROM public.product_images WHERE id = p_image_id;

  RETURN jsonb_build_object(
    'success', true,
    'product_id', v_product_id,
    'url', v_url
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_product_image_record(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_product_image_record(UUID) TO authenticated;
