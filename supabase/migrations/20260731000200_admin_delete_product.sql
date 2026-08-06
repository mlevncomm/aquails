-- Admin product delete (clears cart refs first; order_items keep SET NULL)

CREATE OR REPLACE FUNCTION public.admin_delete_product(p_product_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_image_urls TEXT[];
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Yetkisiz.' USING ERRCODE = '42501';
  END IF;

  SELECT name INTO v_name FROM public.products WHERE id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  SELECT coalesce(array_agg(url), ARRAY[]::text[])
  INTO v_image_urls
  FROM public.product_images
  WHERE product_id = p_product_id;

  -- cart_items.product_id is ON DELETE RESTRICT
  DELETE FROM public.cart_items WHERE product_id = p_product_id;

  DELETE FROM public.products WHERE id = p_product_id;

  RETURN jsonb_build_object(
    'success', true,
    'id', p_product_id,
    'name', v_name,
    'image_urls', to_jsonb(v_image_urls)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_product(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_product(UUID) TO authenticated;
