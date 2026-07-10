-- Payment & shipping extras for production e-commerce

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cargo_company TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS cod_fee NUMERIC(12, 2) NOT NULL DEFAULT 0;

-- Restrict public read of sensitive payment credentials
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;

CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (
    key IN ('site', 'nav_links', 'shipping', 'bank_accounts')
    OR public.is_admin()
  );
