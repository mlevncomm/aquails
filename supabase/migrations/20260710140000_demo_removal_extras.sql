-- Demo removal: RLS fixes + extra tables for blog, subscriptions, stock notifications, loyalty

-- order_items: customers can insert items for their own orders
CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- abandoned_carts: allow tracking from storefront
CREATE POLICY "abandoned_carts_insert_public" ON public.abandoned_carts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "abandoned_carts_update_public" ON public.abandoned_carts
  FOR UPDATE USING (public.is_admin() OR auth.uid() = user_id OR session_id IS NOT NULL);

CREATE OR REPLACE FUNCTION public.mark_abandoned_cart_converted(p_session_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.abandoned_carts
  SET status = 'converted', updated_at = NOW()
  WHERE session_id = p_session_id AND status != 'converted';
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_abandoned_cart_converted(TEXT) TO anon, authenticated;

-- loyalty points on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS loyalty_points INT NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
  ADD COLUMN IF NOT EXISTS loyalty_redeemed INT NOT NULL DEFAULT 0 CHECK (loyalty_redeemed >= 0);

-- blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Genel',
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views INT NOT NULL DEFAULT 0 CHECK (views >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_select_published" ON public.blog_posts
  FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "blog_posts_admin_all" ON public.blog_posts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  device_name TEXT NOT NULL DEFAULT '',
  next_delivery TIMESTAMPTZ,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "subscriptions_admin_all" ON public.subscriptions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- stock_notifications
CREATE TABLE IF NOT EXISTS public.stock_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  email TEXT NOT NULL,
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX stock_notifications_product_id_idx ON public.stock_notifications(product_id);

ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_notifications_insert_public" ON public.stock_notifications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_notifications_admin_all" ON public.stock_notifications
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- site_settings (key-value store for admin config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_write" ON public.site_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
