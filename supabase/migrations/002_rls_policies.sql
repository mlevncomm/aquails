-- RLS helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin', 'staff')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY profiles_admin_all ON public.profiles FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- categories & products (public read active)
CREATE POLICY categories_public_read ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY categories_admin_write ON public.categories FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY products_public_read ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY products_admin_write ON public.products FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- coupons (admin only direct access; validate via Edge Function)
CREATE POLICY coupons_admin ON public.coupons FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- carts: users read own; writes via service role (Edge Functions)
CREATE POLICY carts_select_own ON public.carts FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY cart_items_select_via_cart ON public.cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_items.cart_id
        AND (c.user_id = auth.uid() OR public.is_admin())
    )
  );

-- orders
CREATE POLICY orders_select_own ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY order_items_select_own ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY payments_select_own ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- addresses
CREATE POLICY addresses_own ON public.addresses FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- service slots (public read available)
CREATE POLICY service_slots_public_read ON public.service_slots FOR SELECT
  USING (status = 'available' OR public.is_staff_or_admin());
CREATE POLICY service_slots_admin_write ON public.service_slots FOR ALL
  USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

CREATE POLICY technicians_admin ON public.technicians FOR ALL
  USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

CREATE POLICY service_requests_own ON public.service_requests FOR SELECT
  USING (user_id = auth.uid() OR public.is_staff_or_admin());
CREATE POLICY service_requests_insert_own ON public.service_requests FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- stock notifications
CREATE POLICY stock_notifications_insert_public ON public.stock_notifications FOR INSERT
  WITH CHECK (true);
CREATE POLICY stock_notifications_admin ON public.stock_notifications FOR SELECT
  USING (public.is_admin());

-- Q&A and reviews
CREATE POLICY product_questions_public_read ON public.product_questions FOR SELECT
  USING (is_published = true OR user_id = auth.uid() OR public.is_admin());
CREATE POLICY product_questions_insert_auth ON public.product_questions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY product_questions_admin ON public.product_questions FOR UPDATE
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY reviews_public_read ON public.reviews FOR SELECT
  USING (is_published = true OR user_id = auth.uid() OR public.is_admin());
CREATE POLICY reviews_insert_own ON public.reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY reviews_admin ON public.reviews FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- loyalty, referrals, subscriptions, notifications
CREATE POLICY loyalty_own ON public.loyalty_transactions FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY referrals_own ON public.referrals FOR SELECT
  USING (referrer_id = auth.uid() OR referred_user_id = auth.uid() OR public.is_admin());
CREATE POLICY subscriptions_own ON public.subscriptions FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY notifications_own ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- campaigns & blog
CREATE POLICY campaigns_public_read ON public.campaigns FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY campaigns_admin ON public.campaigns FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY blog_public_read ON public.blog_posts FOR SELECT
  USING (is_published = true OR public.is_admin());
CREATE POLICY blog_admin ON public.blog_posts FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY site_settings_admin ON public.site_settings FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY site_settings_public_read ON public.site_settings FOR SELECT
  USING (key IN ('admin_links', 'public_links'));

-- Storage policies
CREATE POLICY storage_product_images_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
CREATE POLICY storage_product_images_admin_write ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY storage_product_images_admin_update ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY storage_product_images_admin_delete ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY storage_blog_public_read ON storage.objects FOR SELECT
  USING (bucket_id IN ('blog-images', 'campaign-images'));
CREATE POLICY storage_blog_admin_write ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('blog-images', 'campaign-images') AND public.is_admin());

CREATE POLICY storage_avatars_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
CREATE POLICY storage_avatars_own_write ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY storage_avatars_own_update ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
