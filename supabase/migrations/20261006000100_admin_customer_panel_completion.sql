-- Admin & customer panel completion:
--   * campaigns: real, admin-managed marketing campaigns (replaces hard-coded frontend data)
--   * cancel_my_service_request: customers may cancel their own still-pending request
--   * admin_adjust_loyalty_points: manual point corrections with a customer notification

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  discount_label TEXT NOT NULL DEFAULT '',
  coupon_code TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS campaigns_active_sort_idx ON public.campaigns (is_active, sort_order);

DROP TRIGGER IF EXISTS campaigns_set_updated_at ON public.campaigns;
CREATE TRIGGER campaigns_set_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "campaigns_select_live" ON public.campaigns;
CREATE POLICY "campaigns_select_live" ON public.campaigns
  FOR SELECT USING (
    public.is_admin()
    OR (
      is_active
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
    )
  );

DROP POLICY IF EXISTS "campaigns_admin_all" ON public.campaigns;
CREATE POLICY "campaigns_admin_all" ON public.campaigns
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- cancel_my_service_request
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_my_service_request(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501';
  END IF;

  SELECT status INTO v_status
  FROM public.service_requests
  WHERE id = p_request_id AND user_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_status <> 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_cancellable');
  END IF;

  UPDATE public.service_requests
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_request_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_my_service_request(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_my_service_request(UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_adjust_loyalty_points
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_adjust_loyalty_points(
  p_user_id UUID,
  p_amount INT,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INT;
  v_reason TEXT := coalesce(nullif(trim(p_reason), ''), 'Manuel düzeltme');
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Yetkisiz.' USING ERRCODE = '42501';
  END IF;

  IF p_amount IS NULL OR p_amount = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_amount');
  END IF;

  -- Balance lives on profiles (same source as redeem_loyalty_points / order earnings).
  SELECT loyalty_points INTO v_balance FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF p_amount < 0 AND v_balance + p_amount < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_balance', 'balance', v_balance);
  END IF;

  UPDATE public.profiles
  SET loyalty_points = loyalty_points + p_amount
  WHERE id = p_user_id;

  -- Ledger convention: earn rows positive, redeem/deduction rows negative.
  INSERT INTO public.loyalty_transactions (user_id, amount, type, description)
  VALUES (
    p_user_id,
    p_amount,
    CASE WHEN p_amount > 0 THEN 'earn' ELSE 'redeem' END,
    v_reason
  );

  PERFORM public.create_user_notification(
    p_user_id,
    CASE WHEN p_amount > 0 THEN 'Puan Eklendi' ELSE 'Puan Düzeltmesi' END,
    abs(p_amount) || ' puan ' || CASE WHEN p_amount > 0 THEN 'hesabınıza eklendi' ELSE 'hesabınızdan düşüldü' END || ': ' || v_reason,
    'promo',
    '/hesabim/puanlarim'
  );

  RETURN jsonb_build_object('success', true, 'balance', v_balance + p_amount);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_adjust_loyalty_points(UUID, INT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_adjust_loyalty_points(UUID, INT, TEXT) TO authenticated;
