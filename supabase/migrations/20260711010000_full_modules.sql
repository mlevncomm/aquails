-- Full modules: notifications, favorites, returns, filter tracking, loyalty history,
-- referrals, KDV, shipping config, bulk price RPC

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS price_includes_vat BOOLEAN NOT NULL DEFAULT TRUE;

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'order', 'service', 'promo', 'system')),
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_admin_insert" ON public.notifications FOR INSERT WITH CHECK (public.is_admin());

-- user favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON public.user_favorites(user_id);
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_select_own" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

-- return requests
CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL DEFAULT '',
  product_name TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'return' CHECK (type IN ('return', 'exchange')),
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS return_requests_user_id_idx ON public.return_requests(user_id);
CREATE TRIGGER return_requests_updated_at BEFORE UPDATE ON public.return_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "returns_select_own" ON public.return_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "returns_insert_own" ON public.return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "returns_admin_update" ON public.return_requests FOR UPDATE USING (public.is_admin());

-- filter tracking
CREATE TABLE IF NOT EXISTS public.filter_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL DEFAULT '',
  filter_name TEXT NOT NULL DEFAULT 'Sediment Filtre',
  installed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  change_interval_days INT NOT NULL DEFAULT 180,
  reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  last_changed_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS filter_tracking_user_id_idx ON public.filter_tracking(user_id);
CREATE TRIGGER filter_tracking_updated_at BEFORE UPDATE ON public.filter_tracking
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.filter_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "filter_tracking_own" ON public.filter_tracking FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- loyalty transactions
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS loyalty_transactions_user_id_idx ON public.loyalty_transactions(user_id);
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loyalty_tx_select_own" ON public.loyalty_transactions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "loyalty_tx_admin_insert" ON public.loyalty_transactions FOR INSERT WITH CHECK (public.is_admin());

-- referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL DEFAULT '',
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  reward_points INT NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals(referrer_id);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_select_own" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR public.is_admin());
CREATE POLICY "referrals_insert_own" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- subscriptions: allow customer insert/update own
DROP POLICY IF EXISTS "subscriptions_admin_all" ON public.subscriptions;
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "subscriptions_admin_all" ON public.subscriptions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- site_settings: allow shipping + tax keys publicly readable
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (
    key IN ('site', 'nav_links', 'shipping', 'bank_accounts', 'paytr_public', 'tax', 'shipping_methods')
    OR public.is_admin()
  );

INSERT INTO public.site_settings (key, value) VALUES
  ('tax', '{"rate":20,"displayInCheckout":true,"priceIncludesVat":true}'::jsonb),
  ('shipping_methods', '{"methods":[{"id":"standard","label":"Standart Kargo","desc":"3-5 iş günü","price":0,"days":"3-5"},{"id":"fast","label":"Hızlı Kargo","desc":"1-2 iş günü","price":49,"days":"1-2"},{"id":"same","label":"Aynı Gün Teslimat","desc":"İstanbul içi","price":99,"days":"0"}],"codFee":150}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Helper: create notification
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
  INSERT INTO notifications (user_id, title, message, type, link)
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Loyalty redeem → coupon code
CREATE OR REPLACE FUNCTION public.redeem_loyalty_points(p_points INT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_available INT;
  v_discount NUMERIC;
  v_code TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Yetkilendirme gerekli.'; END IF;
  IF p_points < 100 THEN RAISE EXCEPTION 'Minimum 100 puan gerekli.'; END IF;

  SELECT loyalty_points INTO v_available FROM profiles WHERE id = auth.uid();
  IF v_available IS NULL OR v_available < p_points THEN
    RAISE EXCEPTION 'Yetersiz puan.';
  END IF;

  v_discount := floor(p_points / 10);
  v_code := 'PUAN' || p_points || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4));

  UPDATE profiles SET
    loyalty_points = loyalty_points - p_points,
    loyalty_redeemed = loyalty_redeemed + p_points
  WHERE id = auth.uid();

  INSERT INTO loyalty_transactions (user_id, amount, type, description)
  VALUES (auth.uid(), -p_points, 'redeem', v_code || ' kuponu oluşturuldu');

  INSERT INTO coupons (code, type, value, min_order_amount, usage_limit, is_active)
  VALUES (v_code, 'fixed', v_discount, v_discount * 2, 1, TRUE);

  PERFORM create_user_notification(
    auth.uid(), 'Puan Kuponu Oluşturuldu',
    v_code || ' kodu ile ' || v_discount || '₺ indirim kazandınız.', 'promo', '/hesabim/kuponlarim'
  );

  RETURN jsonb_build_object('code', v_code, 'discount', v_discount);
END;
$$;
GRANT EXECUTE ON FUNCTION public.redeem_loyalty_points(INT) TO authenticated;

-- Bulk price update (admin)
CREATE OR REPLACE FUNCTION public.bulk_update_product_prices(
  p_category_slug TEXT,
  p_mode TEXT,
  p_value NUMERIC
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_count INT := 0;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Yetkisiz.'; END IF;

  IF p_mode = 'percent' THEN
    UPDATE products p SET price = GREATEST(0, ROUND(price * (1 + p_value / 100), 2)), updated_at = NOW()
    FROM categories c
    WHERE p.category_id = c.id
      AND (p_category_slug = '' OR c.slug = p_category_slug);
  ELSIF p_mode = 'fixed_add' THEN
    UPDATE products p SET price = GREATEST(0, price + p_value), updated_at = NOW()
    FROM categories c
    WHERE p.category_id = c.id
      AND (p_category_slug = '' OR c.slug = p_category_slug);
  ELSIF p_mode = 'set_tax' THEN
    UPDATE products p SET tax_rate = p_value, updated_at = NOW()
    FROM categories c
    WHERE p.category_id = c.id
      AND (p_category_slug = '' OR c.slug = p_category_slug);
  END IF;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.bulk_update_product_prices(TEXT, TEXT, NUMERIC) TO authenticated;

-- Notify on order fulfillment
CREATE OR REPLACE FUNCTION public.confirm_order_fulfillment(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_status text;
  v_order_number text;
  v_item record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Yetkilendirme gerekli.' USING ERRCODE = '42501'; END IF;

  SELECT user_id, status, order_number INTO v_user_id, v_status, v_order_number FROM orders WHERE id = p_order_id LIMIT 1;
  IF v_user_id IS NULL OR v_user_id <> auth.uid() THEN RAISE EXCEPTION 'Sipariş bulunamadı.' USING ERRCODE = 'P0002'; END IF;
  IF v_status <> 'pending' THEN RETURN; END IF;

  FOR v_item IN SELECT product_id, quantity FROM order_items WHERE order_id = p_order_id AND product_id IS NOT NULL LOOP
    UPDATE products SET stock = GREATEST(0, stock - v_item.quantity) WHERE id = v_item.product_id;
  END LOOP;

  UPDATE orders SET status = 'processing', updated_at = NOW() WHERE id = p_order_id;

  PERFORM create_user_notification(
    v_user_id, 'Siparişiniz Alındı',
    'Sipariş no: ' || v_order_number || ' işleme alındı.', 'order', '/hesabim/siparisler/' || p_order_id
  );
END;
$$;
