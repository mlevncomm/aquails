-- Static seed: categories, coupons, technicians, service slots
-- Products seeded via: npm run supabase:seed (scripts/seed-supabase.mts)

INSERT INTO public.categories (id, slug, name, description, icon, sort_order, is_active) VALUES
  ('11111111-1111-1111-1111-111111111101', 'su-aritma-cihazlari', 'Su Arıtma Cihazları', 'Ev ve iş yeri için profesyonel su arıtma cihazları', 'Droplet', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'direkt-akis-su-aritma', 'Direkt Akış Su Arıtma', 'Tankless, anında saf su üreten sistemler', 'Zap', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'dijital-su-aritma', 'Dijital Su Arıtma', 'Akıllı dijital kontrol panelli su arıtma cihazları', 'Monitor', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'sebiller', 'Sebiller', 'Sıcak-soğuk su sunan arıtmalı sebil sistemleri', 'Coffee', 4, true),
  ('11111111-1111-1111-1111-111111111105', 'bina-girisi-filtrasyon', 'Bina Girişi Filtrasyon', 'Apartman ve site girişi filtrasyon sistemleri', 'Building', 5, true),
  ('11111111-1111-1111-1111-111111111106', 'filtreler', 'Filtreler', 'Su arıtma cihazları için yedek filtreler ve setler', 'Filter', 6, true),
  ('11111111-1111-1111-1111-111111111107', 'membran-filtreler', 'Membran Filtreler', 'Ters ozmoz membran filtreler', 'CircleDot', 7, true),
  ('11111111-1111-1111-1111-111111111108', 'musluklar', 'Musluklar', '304 paslanmaz çelik su arıtma muslukları', 'Faucet', 8, true),
  ('11111111-1111-1111-1111-111111111109', 'pompa-ve-yedek-parcalar', 'Pompa ve Yedek Parçalar', 'Su arıtma cihazı pompası ve yedek parçalar', 'Settings', 9, true),
  ('11111111-1111-1111-1111-111111111110', 'aksesuarlar', 'Aksesuarlar', 'Sebil aparatları ve pratik aksesuarlar', 'Wrench', 10, true),
  ('11111111-1111-1111-1111-111111111111', 'elektrikli-ev-aletleri', 'Elektrikli Ev Aletleri', 'Mutfakınızı kolaylaştıran elektrikli aletler', 'Plug', 11, true),
  ('11111111-1111-1111-1111-111111111112', 'ev-temizligi', 'Ev Temizliği', 'Güçlü temizlik robotları ve süpürgeler', 'Sparkles', 12, true),
  ('11111111-1111-1111-1111-111111111113', 'ev-gerecleri', 'Ev Gereçleri', 'Döküm ve granit tencere setleri', 'ChefHat', 13, true),
  ('11111111-1111-1111-1111-111111111114', 'tens-cihazi', 'Tens Cihazı', 'Profesyonel TENS/EMS tedavi cihazı', 'Activity', 14, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  is_active = true;

INSERT INTO public.coupons (code, type, value, min_order_amount, usage_limit, is_active) VALUES
  ('HOSGELDIN10', 'percent', 10, 500, 1000, true),
  ('KARGO', 'shipping', 0, 1000, NULL, true),
  ('INDIRIM100', 'fixed', 100, 1500, 500, true),
  ('DIREKT20', 'percent', 20, 0, NULL, true),
  ('FILTRE50', 'percent', 50, 0, NULL, true),
  ('KURULUM0', 'shipping', 0, 0, NULL, true)
ON CONFLICT (code) DO UPDATE SET
  type = EXCLUDED.type,
  value = EXCLUDED.value,
  min_order_amount = EXCLUDED.min_order_amount,
  is_active = true;

INSERT INTO public.technicians (id, name, phone, email, is_active) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Aquails Servis Ekibi', '08501234567', 'servis@aquails.com', true)
ON CONFLICT (id) DO NOTHING;

-- Sample service slots for next 7 days
INSERT INTO public.service_slots (date, start_time, end_time, status, technician_id)
SELECT
  (CURRENT_DATE + (d || ' days')::interval)::date,
  t.start_time::time,
  t.end_time::time,
  'available',
  '22222222-2222-2222-2222-222222222201'::uuid
FROM generate_series(0, 6) AS d
CROSS JOIN (VALUES
  ('09:00', '11:00'),
  ('11:00', '13:00'),
  ('14:00', '16:00'),
  ('16:00', '18:00')
) AS t(start_time, end_time)
ON CONFLICT (date, start_time, end_time) DO NOTHING;

INSERT INTO public.campaigns (title, slug, description, is_active, starts_at, ends_at) VALUES
  ('Direkt Akış Cihazlarda Özel İndirim', 'direkt-akış-indirim', 'Tankless su arıtma cihazlarında %20 indirim', true, now(), now() + interval '90 days'),
  ('Ücretsiz Kurulum Fırsatı', 'ucretsiz-kurulum', 'Tüm su arıtma cihazlarında profesyonel kurulum bedava', true, now(), now() + interval '120 days')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_posts (title, slug, category, excerpt, is_published, published_at) VALUES
  ('Su Arıtma Cihazı Seçerken Nelere Dikkat Edilmeli?', 'su-aritma-secerken', 'Rehber', 'Eviniz için en uygun su arıtma cihazını seçerken dikkat etmeniz gereken 7 kritik faktör.', true, now()),
  ('Filtre Değişimi Ne Zaman Yapılmalı?', 'filtre-degisim-sikligi', 'Bakım', 'Filtrelerinizin ömrünü uzatmanın yolları ve değişim sıklığı.', true, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
  ('admin_links', '[]'::jsonb),
  ('public_links', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
