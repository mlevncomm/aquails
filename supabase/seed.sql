-- Aquails seed data (representative subset from src/data/products.ts)
-- Full catalog import: extend this file or run a custom import script.

-- Categories
INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES
  ('a1000001-0000-4000-8000-000000000001', 'Su Arıtma Cihazları', 'su-aritma-cihazlari', 'Droplet', 'Ev ve iş yeri için profesyonel su arıtma cihazları', 1, TRUE),
  ('a1000001-0000-4000-8000-000000000002', 'Direkt Akış Su Arıtma', 'direkt-akis-su-aritma', 'Zap', 'Tankless, anında saf su üreten sistemler', 2, TRUE),
  ('a1000001-0000-4000-8000-000000000003', 'Dijital Su Arıtma', 'dijital-su-aritma', 'Monitor', 'Akıllı dijital kontrol panelli su arıtma cihazları', 3, TRUE),
  ('a1000001-0000-4000-8000-000000000004', 'Filtreler', 'filtreler', 'Filter', 'Su arıtma cihazları için yedek filtreler ve setler', 4, TRUE),
  ('a1000001-0000-4000-8000-000000000005', 'Musluklar', 'musluklar', 'Faucet', '304 paslanmaz çelik su arıtma muslukları', 5, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO public.products (
  id, category_id, name, slug, sku, description, short_description,
  price, old_price, stock, rating, review_count, features, specifications, badge, discount_percent, is_active
) VALUES
  (
    'b2000001-0000-4000-8000-000000000001',
    'a1000001-0000-4000-8000-000000000005',
    'Aquails DİJİTAL 304 PASLANMAZ ÇELİK MUSLUK',
    'dijital-304-paslanmaz-celik-musluk',
    'AQ-MUSLUK-304',
    'DİJİTAL 304 PASLANMAZ ÇELİK MUSLUK, 304 paslanmaz çelikten üretilmiş, su arıtma cihazlarına uygun estetik ve dayanıklı musluktur.',
    '304 paslanmaz çelik musluk, su arıtma cihazlarına uyumlu.',
    1250, NULL, 10, 4.3, 95,
    '["304 paslanmaz çelik","Paslanmaya dayanıklı","Krom kaplama","Kolay montaj"]'::jsonb,
    '{"Marka":"Aquails","Kategori":"Musluklar","Garanti":"5 Yıl"}'::jsonb,
    NULL, NULL, TRUE
  ),
  (
    'b2000001-0000-4000-8000-000000000002',
    'a1000001-0000-4000-8000-000000000004',
    'PRO INLINE FİLTRELER',
    'pro-inline-filtreler',
    'AQ-FILTRE-PRO',
    'PRO INLINE FİLTRELER, Aquails su arıtma cihazlarıyla tam uyumlu, NSF sertifikalı yüksek performanslı filtredir.',
    'NSF sertifikalı yüksek performanslı inline filtre.',
    2499, 2980, 10, 4.3, 135,
    '["NSF sertifikalı","6-12 ay ömür","Kolay değişim"]'::jsonb,
    '{"Marka":"Aquails","Kategori":"Filtreler","Garanti":"2 Yıl"}'::jsonb,
    'discount', 16, TRUE
  ),
  (
    'b2000001-0000-4000-8000-000000000003',
    'a1000001-0000-4000-8000-000000000003',
    'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI',
    'aquails-eonaqua-pro-dijital-su-aritma-cihazi',
    'AQ-EONAQUA-PRO',
    'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI, dijital TDS göstergesi ve akıllı filtre uyarı sistemi ile donatılmış modern su arıtma cihazıdır.',
    'Dijital TDS göstergeli akıllı su arıtma cihazı.',
    85900, NULL, 10, 4.4, 156,
    '["Dijital TDS göstergesi","Akıllı filtre uyarısı","7 aşamalı filtrasyon"]'::jsonb,
    '{"Marka":"Aquails","Kategori":"Dijital Su Arıtma","Garanti":"5 Yıl"}'::jsonb,
    'new', NULL, TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- Product images
INSERT INTO public.product_images (product_id, url, sort_order, alt_text) VALUES
  ('b2000001-0000-4000-8000-000000000001', '/images/products/filtreler.jpg', 0, 'Aquails Dijital Musluk'),
  ('b2000001-0000-4000-8000-000000000002', '/images/products/dijital-su-aritma.jpg', 0, 'Pro Inline Filtreler'),
  ('b2000001-0000-4000-8000-000000000003', '/images/products/dijital-su-aritma.jpg', 0, 'Eonaqua Pro');

-- Sample coupons
INSERT INTO public.coupons (code, type, value, min_order_amount, usage_limit, is_active) VALUES
  ('AQUAILS10', 'percentage', 10, 1000, 100, TRUE),
  ('FILTRE250', 'fixed', 250, 2000, 50, TRUE),
  ('KARGO', 'shipping', 0, 0, 999, TRUE)
ON CONFLICT (code) DO NOTHING;
