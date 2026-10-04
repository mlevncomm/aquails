-- Aquails catalog seed, exported from the live catalog.
-- Regenerate: npm run catalog:export

DELETE FROM public.product_images;
DELETE FROM public.products;
DELETE FROM public.categories;

INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES
  ('08924fe5-6b9b-4b8a-88d3-4b7adca7f595', 'Direkt Akış RO Cihazları', 'direkt-akis-ro', 'Zap', '', 1, TRUE),
  ('89a44db4-9ab9-455d-8e70-e2679204f207', 'Klasik RO Sistemleri', 'klasik-ro-sistemleri', 'Droplet', '', 2, TRUE),
  ('96201c2c-b2aa-43c0-ac49-1e517e6d8742', 'Soft / Kompakt Sistemler', 'soft-kompakt', 'Settings', '', 3, TRUE),
  ('ebb17321-02f3-4b40-8422-aacff64bbd37', 'Sebiller', 'sebiller', 'Coffee', '', 4, TRUE),
  ('741311e2-c130-4a5d-9a83-2e4c6928f541', 'Bina Giriş Filtrasyonu', 'bina-giris-filtrasyon', 'Building2', '', 5, TRUE),
  ('b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Filtreler & Membranlar', 'filtreler-membranlar', 'Filter', '', 6, TRUE),
  ('a6942fc9-33cd-48f1-b9a3-4748d642ff50', 'Musluklar & Aksesuarlar', 'musluklar-aksesuarlar', 'Wrench', '', 7, TRUE);

INSERT INTO public.products (id, category_id, name, slug, sku, description, short_description, price, old_price, stock, rating, review_count, features, specifications, badge, discount_percent, is_active) VALUES
  ('7b8b2640-daab-4a3d-a80f-cf0c2fa66487', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails 10" 3''lü Bina Girişi Filtrasyon Sistemi', 'aquails-10-3lu-bina-girisi-filtrasyon-sistemi', 'AQ-8053270249517', 'Aquails bina girişi filtrasyon sistemi, ana su hattına takılarak evinize giren suyun tamamını musluklara ulaşmadan önce filtreler. Böylece yalnızca içme suyu değil; duş, çamaşır ve bulaşık makinesi, kombi ve tesisat da korunur.

Filtrasyon aşamaları
• 10" 5 mikron sediment filtre: kum, çamur, pas ve tortuyu tutarak suyu berraklaştırır
• 10" granül aktif karbon filtre: klor, koku ve tat bozucu maddeleri azaltır
• Kireç önleyici filtre: kireç oluşumunu azaltarak tesisatı ve cihazları korur

Ne kazandırır?
• Musluklardan bulanık ve çamurlu su gelmez
• Kombi, çamaşır ve bulaşık makinesi daha uzun ömürlü olur
• Kireç azaldığı için ısıtma verimi artar
• Depo kullanılan binalarda tortu sorununu çözer
• Kuyu suyu kullanılan yerlerde özellikle önerilir

Filtre değişimi
5 mikron sediment filtrenin ortalama 6 ayda bir değiştirilmesi önerilir; kuyu suyu ya da bulanık şebeke suyu kullanılıyorsa 3 ayda bir.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Ana su hattına takılan 10 inç 3 aşamalı filtrasyon: sediment, aktif karbon ve kireç önleyici. Tüm evin suyunu filtreler.', 17900, NULL, 50, 4.5, 177, '["Tüm evin suyunu filtreler","Sediment + karbon + kireç önleyici","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Kategori":"Bina Giriş Filtrasyonu","Üretici":"Aquails","Filtre Boyu":"10 inç","Ürün Tipi":"Bina Girişi Filtrasyon Sistemi","Arıtma Aşamaları":"5 Mikron Sediment: Kum, çamur ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Kireç Önleyici: Tesisatı ve cihazları kireçten korur"}'::jsonb, NULL, NULL, TRUE),
  ('282ee162-cf46-4589-aa0b-5d87d6689985', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails 10" Bina Girişi Yedek Filtre Seti (3''lü)', 'aquails-10-bina-girisi-yedek-filtre-seti', 'AQ-8272879353901', '10 inç bina girişi filtrasyon sistemleri için yedek filtre seti. Üç filtre birlikte değiştirildiğinde sistem ilk günkü performansına döner.

Set içeriği
• 10" 5 mikron spun (sediment) filtre: kum, çamur ve tortuyu tutar (ömrü 6 ay)
• 10" blok karbon (CTO) filtre: klor, koku ve tat bozucu maddeleri azaltır (ömrü 6 ay)
• 10" Siliphos kireç önleyici filtre: borularda ve cihazlarda kireç taşı, pas ve korozyon oluşumunu azaltır (ömrü 6 ay)

Siliphos hakkında
Siliphos, su ile temas ettikçe yavaşça çözünerek suya çok düşük miktarda fosfat verir ve kireç oluşumunu engeller. İçme suyu hattında kullanıma uygundur.

Montaj müşteriye aittir.', '10 inç bina girişi sistemleri için 3''lü yedek filtre seti: sediment, blok karbon (CTO) ve Siliphos kireç önleyici.', 3349, NULL, 10, 4.2, 141, '["3''lü yedek set","Siliphos kireç önleyici","6 ay kullanım"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Filtre Boyu":"10 inç","Ürün Tipi":"Yedek Filtre Seti","Kullanım Ömrü":"6 ay"}'::jsonb, NULL, NULL, TRUE),
  ('a4b87a16-dfd6-4594-a923-48cd451b3426', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails 1812 80 GPD RO Membran', 'aquails-1812-80gpd-membran', 'AQ-8053269397549', 'Membran, ters ozmoz cihazının kalbidir: suyu yarı geçirgen yapısından geçirerek çözünmüş maddeleri, ağır metalleri ve mikroorganizmaları ayrıştırır. Aquails 1812 80 GPD membran, ev tipi RO cihazlarında yedek membran olarak kullanılır.

Özellikler
• 1812 standart ölçü, 80 GPD kapasite
• Standart ev tipi ters ozmoz cihazlarıyla uyumlu
• Çözünmüş maddeleri, ağır metalleri ve mikroorganizmaları ayrıştırır

Ne zaman değişir?
Membran, ön filtreler düzenli değiştirildiğinde ortalama 2-3 yıl kullanılır. Arıtılmış suyun TDS değeri belirgin şekilde yükselmeye başladığında değişim zamanı gelmiştir.', 'Ev tipi ters ozmoz cihazları için 1812 ölçülü 80 GPD membran filtre. Standart RO cihazlarıyla uyumlu.', 1000, 1379, 10, 4.1, 189, '["1812 standart ölçü","80 GPD kapasite","Ev tipi RO uyumlu"]'::jsonb, '{"Marka":"Aquails","Kapasite":"80 GPD","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"RO Membran","Referans Kodu":"H2O-1812-80"}'::jsonb, 'discount', 46, TRUE),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'a6942fc9-33cd-48f1-b9a3-4748d642ff50', 'Aquails 2/3 Yollu Musluk Bataryası', 'aquails-2-3-yollu-musluk-bataryasi', 'AQ-8053269561389', 'Aquails 2/3 yollu musluk bataryası, mutfak bataryası ile su arıtma musluğunu tek gövdede birleştirir. Sıcak-soğuk şebeke suyu ve arıtılmış su ayrı kanallardan aktığı için birbirine karışmaz.

Özellikler
• Tek batarya, iki ayrı su hattı: şebeke suyu ve arıtılmış su
• Tezgahta ek delik ve ikinci musluk gerektirmez
• Su arıtma cihazlarıyla uyumlu bağlantı
• Modern mutfaklara uygun tasarım

Montaj için tezgah ölçülerinize ve mevcut arıtma cihazınıza uygunluğu bize danışabilirsiniz.', 'Tek bataryadan hem şebeke suyu hem arıtılmış su: tezgahta ikinci bir musluğa gerek kalmaz.', 5900, NULL, 50, 4.3, 149, '["Tek bataryada iki su hattı","Ek musluk gerektirmez"]'::jsonb, '{"Marka":"Aquails","Kategori":"Musluklar & Aksesuarlar","Üretici":"Aquails","Ürün Tipi":"Musluk Bataryası"}'::jsonb, NULL, NULL, TRUE),
  ('edb49685-aece-4fef-a95d-845197acc542', '741311e2-c130-4a5d-9a83-2e4c6928f541', 'Aquails 20" 3''lü Bina Girişi Filtrasyon Sistemi', 'aquails-20-3lu-bina-girisi-filtrasyon-sistemi', 'AQ-8103853850669', '20 inç filtre gövdeleri, 10 inç versiyona göre daha yüksek debi ve daha uzun filtre ömrü sunar; kalabalık haneler, müstakil evler ve küçük işletmeler için uygundur.

Aquails bina girişi filtrasyon sistemi, ana su hattına takılarak evinize giren suyun tamamını musluklara ulaşmadan önce filtreler. Böylece yalnızca içme suyu değil; duş, çamaşır ve bulaşık makinesi, kombi ve tesisat da korunur.

Filtrasyon aşamaları
• 20" 5 mikron sediment filtre: kum, çamur, pas ve tortuyu tutarak suyu berraklaştırır
• 20" granül aktif karbon filtre: klor, koku ve tat bozucu maddeleri azaltır
• Kireç önleyici filtre: kireç oluşumunu azaltarak tesisatı ve cihazları korur

Ne kazandırır?
• Musluklardan bulanık ve çamurlu su gelmez
• Kombi, çamaşır ve bulaşık makinesi daha uzun ömürlü olur
• Kireç azaldığı için ısıtma verimi artar
• Depo kullanılan binalarda tortu sorununu çözer
• Kuyu suyu kullanılan yerlerde özellikle önerilir

Filtre değişimi
5 mikron sediment filtrenin ortalama 6 ayda bir değiştirilmesi önerilir; kuyu suyu ya da bulanık şebeke suyu kullanılıyorsa 3 ayda bir.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Yüksek debili binalar için 20 inç 3 aşamalı filtrasyon: sediment, aktif karbon ve kireç önleyici.', 19900, NULL, 30, 4.4, 149, '["20 inç yüksek debi","Sediment + karbon + kireç önleyici","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Kategori":"Bina Giriş Filtrasyonu","Üretici":"Aquails","Filtre Boyu":"20 inç","Ürün Tipi":"Bina Girişi Filtrasyon Sistemi","Arıtma Aşamaları":"5 Mikron Sediment: Kum, çamur ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Kireç Önleyici: Tesisatı ve cihazları kireçten korur"}'::jsonb, NULL, NULL, TRUE),
  ('e2c3dd88-8029-4d92-a7bd-2fd02f78d57c', 'a6942fc9-33cd-48f1-b9a3-4748d642ff50', 'Aquails 304 Paslanmaz Çelik Arıtma Musluğu', '304-paslanmaz-celik-musluk', 'AQ-8059496038445', 'Arıtılmış su musluktan geçerek bardağınıza ulaşır; bu yüzden musluğun malzemesi en az filtreler kadar önemlidir. Aquails 304 paslanmaz çelik musluk, arıtılmış suyun tadını ve temizliğini son noktaya kadar korur.

Özellikler
• 18/10 krom-nikel 304 kalite paslanmaz çelik gövde
• Paslanmaya ve korozyona dayanıklı
• Suya koku ve tat geçirmez
• Modern, sade tasarım
• Standart su arıtma cihazlarıyla uyumlu, kolay montaj
• Uzun ömürlü kullanım', '18/10 krom-nikel 304 paslanmaz çelik su arıtma musluğu. Paslanmaz, koku yapmaz, tüm arıtma cihazlarıyla uyumlu.', 1900, NULL, 99, 4.5, 185, '["304 paslanmaz çelik","Koku ve tat geçirmez","Kolay montaj"]'::jsonb, '{"Marka":"Aquails","Malzeme":"304 paslanmaz çelik (18/10)","Kategori":"Musluklar & Aksesuarlar","Üretici":"Aquails","Ürün Tipi":"Arıtma Musluğu"}'::jsonb, NULL, NULL, TRUE),
  ('5fe4de4c-4c60-41e8-ad81-50edcf1ccaed', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Alkali Mineral Filtre', 'alkali-mineral-filtre', 'AQ-8103165788205', 'Ters ozmoz arıtma, suyu çözünmüş maddelerden arındırırken doğal mineralleri de azaltır. Aquails Alkali Mineral Filtre, arıtılmış suya son aşamada mineral kazandırır ve pH değerini yükseltir.

Özellikler
• pH aralığı: 7,5 - 9,5
• Kalsiyum, magnezyum, potasyum ve sodyum mineralleri ekler
• Suya daha dolgun ve dengeli bir tat verir
• Standart inline bağlantı, RO cihazlarının son aşamasına takılır
• Kullanım ömrü: 6-12 ay

Kullanım alanları: evler, ofisler, iş yerleri, restoran ve kafeler.', 'Arıtılmış suya kalsiyum, magnezyum ve potasyum gibi mineraller katar; suyun pH değerini 7,5-9,5 aralığına yükseltir.', 2519, NULL, 10, 4.8, 125, '["pH 7,5 - 9,5","Mineral katkısı","6-12 ay kullanım"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"Alkalin Mineral Filtre","pH Aralığı":"7,5 - 9,5","Kullanım Ömrü":"6-12 ay"}'::jsonb, NULL, NULL, TRUE),
  ('7c02e393-4caa-4d75-a3f7-45c8a205dc49', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Alkaline pH Filtre', 'aquails-alkaline-filtre', 'AQ-8121664798765', 'Aquails Alkaline pH Filtre, ters ozmozla arıtılmış suyun pH değerini yükseltir ve suya mineral kazandırır. Böylece arıtılmış su daha dengeli ve ferah bir içime kavuşur.

Özellikler
• Suyun pH değerini yükseltir, asidik yapıyı dengeler
• Suya mineral katar
• Tadı iyileştirir, ferah bir içim sağlar
• Standart inline bağlantı, kolay montaj
• Ev ve ofis tipi RO cihazlarıyla uyumlu', 'Arıtılmış suyun asidik yapısını dengeleyen, mineral katan alkalin filtre. RO cihazlarının son aşamasına takılır.', 2400, NULL, 100, 4.1, 145, '["pH dengeleme","Mineral katkısı","Inline bağlantı"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"Alkalin Filtre"}'::jsonb, NULL, NULL, TRUE),
  ('47ec2ad3-0165-4136-a2d5-e62057bf03dc', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Antioxidant ORP Alkaline Filtre', 'aquails-antioxdant-orp-alkaline-filtre', 'AQ-8121668763693', 'Aquails Antioxidant ORP Alkaline Filtre, arıtılmış suya üç özelliği bir arada kazandırır: daha yüksek pH, eklenmiş mineraller ve düşük (negatif yönde) ORP değeri.

Özellikler
• ORP değerini düşürür: suya antioksidan özellik kazandırır
• pH değerini yükseltir: alkali yapıda su
• Kalsiyum, magnezyum ve potasyum gibi mineraller ekler
• Standart inline bağlantı, RO cihazlarının son aşamasına takılır
• Uzun kullanım ömrü

ORP nedir?
ORP, suyun oksitleyici ya da indirgeyici özelliğini milivolt (mV) cinsinden gösteren bir ölçüdür.', 'Suyun ORP (oksidasyon-redüksiyon potansiyeli) değerini düşüren, pH''ı yükselten ve mineral katan son aşama filtresi.', 3500, NULL, 100, 4.1, 113, '["ORP düşürme","pH yükseltme","Mineral katkısı"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"ORP Alkalin Filtre"}'::jsonb, NULL, NULL, TRUE),
  ('af6d8df9-6881-4b6f-a27a-af9af5c4677f', '96201c2c-b2aa-43c0-ac49-1e517e6d8742', 'Aquails AQ-100 Soft Midi Su Yumuşatma Sistemi', 'aquails-aq-100-soft-midi-su-yumusatma-sistemi', 'AQ-8053266612269', 'Aquails AQ-100 Soft Midi, suyun sertliğine neden olan kalsiyum ve magnezyum iyonlarını iyon değişimi yöntemiyle gideren tam otomatik bir su yumuşatma sistemidir. Tesisatı, kombiyi, beyaz eşyaları ve armatürleri kireçten korur.

Nasıl çalışır?
Sert su, sodyum formundaki reçineden geçerken kalsiyum ve magnezyum iyonları reçinede tutulur. Reçine doyduğunda sistem, ayarlanan gün ve saatte tuzlu su ile kendini otomatik olarak yeniler (rejenerasyon). Rejenerasyon geri yıkama, tuzlu su emişi, yavaş durulama, hızlı durulama ve tuz tankı dolumu aşamalarından oluşur.

Teknik özellikler
• Tam otomatik, zaman kontrollü vana
• Kabinli kompakt yapı, polietilen kabin ve fiberglas mineral tankı
• 1" tesisat bağlantısı
• Çalışma basıncı: 2-7 bar (tank test basıncı 10 bar)
• Çalışma sıcaklığı: 4-50 °C
• Elektrik: 220 V, 50 Hz
• Minimum bakım, düşük işletme maliyeti

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Ev ve küçük kullanımlar için kompakt, tam otomatik su yumuşatma sistemi. Kireci iyon değişimiyle giderir.', 119900, NULL, 10, 4.9, 129, '["Tam otomatik","Kireci iyon değişimiyle giderir","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-100","Kategori":"Soft / Kompakt Sistemler","Üretici":"Aquails","Bağlantı":"1 inç","Ürün Tipi":"Su Yumuşatma Sistemi"}'::jsonb, NULL, NULL, TRUE),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'ebb17321-02f3-4b40-8422-aacff64bbd37', 'Aquails AQ-115 Arıtmalı Sebil', 'aquails-aq-115-aritmali-sebil', 'AQ-8053277294637', 'Aquails AQ-115, su arıtma cihazı ile sıcak-soğuk su sebilini tek gövdede birleştirir. Damacana taşımadan, doğrudan şebekeden arıtılmış sıcak ve soğuk su elde edersiniz.

Arıtma
• 5 aşamalı filtrasyon: sediment, GAC karbon, CTO blok karbon, 80 GPD membran ve 1050 iyot post karbon

Teknik özellikler
• Sıcak su: 500-600 W, 2,0 litre tank
• Soğuk su: 110 W, 3,0 litre tank, 6-8 °C
• Soğutma kapasitesi: 2,0 litre/saat, R134a kompresörlü
• Soğuk su tankı ve suyla temas eden bağlantılar 304 paslanmaz çelik
• Dijital dokunmatik kontrol paneli
• 8 litre harici tank (opsiyonel)
• Voltaj: 220-240 V
• Ölçüler: 113 x 38 x 28 cm (yükseklik x genişlik x derinlik)

Kullanım alanları: evler, ofisler ve küçük işletmeler.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Sıcak-soğuk sulu, 5 aşamalı arıtmalı sebil. Dokunmatik ekran, paslanmaz çelik tank, ev ve ofis için ideal.', 138000, NULL, 10, 4.8, 157, '["Sıcak ve soğuk su","5 aşamalı arıtma","Dokunmatik ekran","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-115","Membran":"80 GPD","Kategori":"Sebiller","Üretici":"Aquails","Ürün Tipi":"Arıtmalı Sebil","Arıtma Aşamaları":"Sediment: Kum, pas ve tortuyu tutar | GAC Karbon: Klor ve kötü kokuyu azaltır | CTO Blok Karbon: Kimyasal kalıntıları filtreler | 80 GPD RO Membran: Çözünmüş maddeleri ayrıştırır | Post Karbon (1050 iyot): Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('84e5d59f-1973-4fd7-a1fc-f75a02e01627', '96201c2c-b2aa-43c0-ac49-1e517e6d8742', 'Aquails AQ-150 Softmax Maxi Su Yumuşatma Sistemi', 'aquails-aq-150-softmax-maxi-su-yumusatma-sistemi', 'AQ-8053266972717', 'Aquails AQ-150 Softmax Maxi, suyun sertliğine neden olan kalsiyum ve magnezyum iyonlarını iyon değişimi yöntemiyle gideren tam otomatik bir su yumuşatma sistemidir. AQ-100 Soft Midi''ye göre daha yüksek su tüketimi olan haneler ve işletmeler için tasarlanmıştır.

Tesisatı, kombiyi, beyaz eşyaları ve armatürleri kireçten korur; reçine doyduğunda kendini tuzlu su ile otomatik olarak yeniler.

Kapasite seçimi su sertliğine ve günlük tüketime göre yapılır. Ayrıntılı teknik özellikler ve keşif için WhatsApp hattımızdan bize ulaşabilirsiniz.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Yüksek su tüketimi için tam otomatik su yumuşatma sistemi. Teknik detaylar için bizimle iletişime geçin.', 147000, NULL, 10, 4.7, 37, '["Tam otomatik","Yüksek tüketim için","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-150","Kategori":"Soft / Kompakt Sistemler","Üretici":"Aquails","Ürün Tipi":"Su Yumuşatma Sistemi"}'::jsonb, NULL, NULL, TRUE),
  ('b70c7547-fb29-4662-af97-72eaf5584326', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails AQ-300 / 300 GPD Endüstriyel Su Arıtma Cihazı', 'aquails-aq-300-endustriyel-su-aritma-cihazi', 'AQ-8053271199789', 'Aquails AQ-300, yüksek su tüketimi olan işletmeler için tasarlanmış 300 GPD kapasiteli bir ters ozmoz su arıtma cihazıdır. Günde yaklaşık 1.000 litre arıtılmış su üretir.

Arıtma aşamaları
• 5 mikron spun filtre: kir, pas ve kumu tutar
• Blok karbon filtre: klor ve organik kimyasalları azaltır, tat ve kokuyu düzeltir
• 1 mikron spun filtre: membranı ince partiküllerden korur
• 3 x 100 GPD RO membran: çözünmüş maddeleri, ağır metalleri ve mikroorganizmaları ayrıştırır
• Inline post karbon filtre (hindistan cevizi kabuğu): suya yumuşak bir içim kazandırır

Teknik özellikler
• 2 adet 20" mat mavi ve 1 adet 20" şeffaf filtre gövdesi
• 300 GPD pompa ve adaptör
• Çalışma basıncı: 0,68-8,6 bar (10-125 PSI)
• Elektrik: 110/220/240 V, 50/60 Hz
• Verim: yaklaşık %50 (giren suyun yarısı arıtılmış su olarak çıkar)
• Depolama tankı opsiyoneldir
• Ağırlık: 42 kg
• Ölçüler: 24 x 50 x 80 cm (en x boy x yükseklik)
• Lüks paslanmaz musluk

Kullanım alanları: restoranlar, kafeler, imalathaneler, gıda üretim tesisleri, okullar, oteller ve alışveriş merkezleri.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Günde yaklaşık 1.000 litre arıtma kapasiteli 300 GPD ters ozmoz cihazı. Restoran, okul, imalathane ve oteller için.', 84900, NULL, 10, 4.7, 89, '["300 GPD (~1.000 L/gün)","İşletmeler için","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-300","Kapasite":"300 GPD (~1.000 L/gün)","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Endüstriyel Su Arıtma Cihazı","Referans Kodu":"300-GPD","Arıtma Aşamaları":"5 Mikron Spun: Kir, pas ve kumu tutar | Blok Karbon: Klor ve organik kimyasalları azaltır | 1 Mikron Spun: Membranı ince partiküllerden korur | 3 x 100 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('0186e795-3ad2-4037-a3ba-a515329ba552', 'ebb17321-02f3-4b40-8422-aacff64bbd37', 'Aquails AQ-351 Arıtmalı Sebil', 'aquails-aq-351-aritmali-sebil', 'AQ-8090262011949', 'Aquails AQ-351, kompakt gövdesinde 5 aşamalı su arıtma ve sıcak-soğuk su sebilini birleştirir. Quick fittings bağlantı sistemi sayesinde kurulumu ve filtre bakımı kolaydır.

Arıtma aşamaları
• 10" inline sediment filtre: tortu, kum ve çamuru tutar
• 10" inline GAC karbon filtre: klor, koku ve tat bozucu maddeleri azaltır
• Kapsül membran filtre: çözünmüş maddeleri ve mikroorganizmaları ayrıştırır
• Post karbon filtre: suya yumuşak bir içim kazandırır
• Platinum pompa: membran için ideal çalışma basıncını sağlar

Teknik özellikler
• Soğuk su kapasitesi: 4 litre
• Sıcak su kapasitesi: 1,5 litre
• Soğutma gücü: 277 W
• 6 litre ek tank (opsiyonel)
• Voltaj: 220-240 V

Kullanım alanları: evler, ofisler ve küçük işletmeler.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', '5 aşamalı arıtmalı, kompakt sıcak-soğuk su sebili. 4 litre soğuk, 1,5 litre sıcak su kapasitesi.', 112000, NULL, 10, 4.5, 169, '["Sıcak ve soğuk su","Arıtmalı","Kompakt tasarım","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-351","Kategori":"Sebiller","Üretici":"Aquails","Ürün Tipi":"Arıtmalı Sebil","Arıtma Aşamaları":"10\" Sediment: Tortu, kum ve çamuru tutar | 10\" GAC Karbon: Klor ve kötü kokuyu azaltır | Kapsül Membran: Çözünmüş maddeleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('56961781-fef1-4912-a810-7566b1a3badd', 'ebb17321-02f3-4b40-8422-aacff64bbd37', 'Aquails AQ-50 Arıtmalı Sebil', 'aquails-aq-50-aritmali-sebil', 'AQ-8053277360173', 'Aquails AQ-50, su arıtma ve sıcak-soğuk su sebilini tek gövdede birleştiren arıtmalı sebil modelidir.

Modelin ayrıntılı teknik özellikleri, kapasite seçenekleri ve kurulum koşulları için WhatsApp hattımızdan ya da iletişim sayfamızdan bize ulaşabilirsiniz.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Aquails AQ-50 arıtmalı sebil. Teknik detaylar ve kurulum için bizimle iletişime geçin.', 135000, NULL, 10, 4.3, 193, '["Arıtmalı sebil","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-50","Kategori":"Sebiller","Üretici":"Aquails","Ürün Tipi":"Arıtmalı Sebil"}'::jsonb, NULL, NULL, TRUE),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails AQ-600 / 600 GPD Endüstriyel Su Arıtma Cihazı', 'aquails-aq-600-endustriyel-su-aritma-cihazi', 'AQ-8053267136557', 'Aquails AQ-600, yüksek su tüketimi olan işletmeler için 600 GPD kapasiteli bir ters ozmoz su arıtma cihazıdır. Günde 1.500-2.000 litre arıtılmış su üretir; bu, günde yaklaşık 80-100 damacana suya karşılık gelir.

Arıtma aşamaları
• 20" sediment filtre: tortu, çamur ve kaba kirleri tutar
• 20" granül aktif karbon filtre: klor ve kötü kokuyu azaltır
• 20" blok karbon filtre: kalan kimyasal kirlilikleri tutar
• 3 x 200 GPD RO membran: çözünmüş maddeleri, ağır metalleri ve mikroorganizmaları ayrıştırır
• 2,5" inline hindistan cevizi karbon filtre: suya yumuşak bir içim kazandırır

Set içeriği
36 V pompa, 600 GPD adaptör ve Avrupa model musluk. Tüm filtreler cihazla birlikte gelir.

Tank seçimi
Cihaz direkt akışlıdır. Pompanın ömrünü uzatmak ve kesintisiz kullanım için 40 veya 80 litrelik depolama tankıyla birlikte kullanılması önerilir.

Filtre değişimi
İlk üç ön filtre 6-9 ayda bir, membranlar ve son karbon filtre 18-24 ayda bir değiştirilir.

Ölçüler: 29 x 46 x 77 cm (en x boy x yükseklik)

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Günde 1.500-2.000 litre arıtma kapasiteli 600 GPD ters ozmoz cihazı. Günde 80-100 damacana ihtiyacını karşılar.', 99000, NULL, 10, 4.9, 97, '["600 GPD (1.500-2.000 L/gün)","İşletmeler için","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-600","Kapasite":"600 GPD (1.500-2.000 L/gün)","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Endüstriyel Su Arıtma Cihazı","Referans Kodu":"600-GPD","Arıtma Aşamaları":"20\" Sediment: Tortu ve kaba kirleri tutar | 20\" Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | 20\" Blok Karbon: Kalan kimyasal kirlilikleri tutar | 3 x 200 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Hindistan Cevizi Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('e2ec33f9-b103-4e25-a136-903becdfa275', 'ebb17321-02f3-4b40-8422-aacff64bbd37', 'Aquails AQ-80 Arıtmalı Sebil', 'aquails-aq-80-aritmali-sebil', 'AQ-8053277425709', 'Aquails AQ-80, su arıtma ve sıcak-soğuk su sebilini tek gövdede birleştiren arıtmalı sebil modelidir.

Modelin ayrıntılı teknik özellikleri, kapasite seçenekleri ve kurulum koşulları için WhatsApp hattımızdan ya da iletişim sayfamızdan bize ulaşabilirsiniz.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Aquails AQ-80 arıtmalı sebil. Teknik detaylar ve kurulum için bizimle iletişime geçin.', 155000, NULL, 10, 4.8, 149, '["Arıtmalı sebil","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Model":"AQ-80","Kategori":"Sebiller","Üretici":"Aquails","Ürün Tipi":"Arıtmalı Sebil"}'::jsonb, NULL, NULL, TRUE),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', '08924fe5-6b9b-4b8a-88d3-4b7adca7f595', 'Aquails BLUEDROP Direkt Akış Su Arıtma Cihazı', 'aquails-blue-drop-su-aritma-cihazi', 'AQ-8299605917741', 'Aquails BLUEDROP, suyu depoda bekletmeden, ihtiyaç anında arıtan direkt akışlı bir su arıtma cihazıdır. Tank olmadığı için dolap altında çok daha az yer kaplar ve depoda bekleyen su sorunu ortadan kalkar.

Neden BLUEDROP?
• 600 GPD kapasite: günde yaklaşık 2.270 litre arıtılmış su, kalabalık aileler için de yeterli
• Direkt akış: musluğu açtığınız an taze su, tank gerektirmez
• Ters yıkama: membranı düzenli olarak temizleyerek filtre ömrünü uzatır
• Filtre değişim uyarısı: değişim zamanını ön paneldeki göstergeden takip edersiniz
• Verimli çalışma: klasik tanklı sistemlere göre daha az atık su
• Kompakt gövde: mutfak dolabının altına rahatça sığar

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Tanksız, direkt akışlı su arıtma: musluğu açtığınız an taze arıtılmış su. 600 GPD kapasite, ters yıkama ve filtre değişim uyarısı.', 45000, NULL, 25, 4.4, 21, '["600 GPD kapasite","Tanksız direkt akış","Ters yıkama","Filtre değişim uyarısı","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Kapasite":"600 GPD (~2.270 L/gün)","Kategori":"Direkt Akış RO Cihazları","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı"}'::jsonb, NULL, NULL, TRUE),
  ('e74b68b3-943f-4d52-a298-95df745a294f', 'a6942fc9-33cd-48f1-b9a3-4748d642ff50', 'Aquails Dijital 304 Paslanmaz Çelik Arıtma Musluğu', 'dijital-304-paslanmaz-celik-musluk', 'AQ-8409359155245', 'Aquails Dijital Musluk, arıtma cihazınızın performansını doğrudan musluk üzerinden görmenizi sağlar. Ekrandaki TDS (PPM) değeri, arıtılmış suyun saflığını sayısal olarak gösterir.

Özellikler
• Anlık TDS ölçümü: arıtılmış suyun PPM değeri ekranda
• Filtre ömrü takibi: kullanım süresini gösterir, değişim zamanını hatırlatır
• Pille çalışır: elektrik bağlantısı gerektirmez
• 304 paslanmaz çelik gövde
• Standart arıtma cihazlarına ek tesisat gerekmeden takılır

TDS nedir?
TDS (toplam çözünmüş madde), sudaki çözünmüş katı madde miktarıdır ve PPM ile ölçülür. Arıtılmış suda TDS değerinin yükselmeye başlaması, filtre değişim zamanının yaklaştığını gösterir.', 'TDS göstergeli akıllı musluk: arıtılmış suyun kalitesini ve filtre ömrünü musluk üzerindeki ekrandan takip edin. Pille çalışır.', 12500, NULL, 10, 4.3, 45, '["Anlık TDS göstergesi","Filtre ömrü takibi","Pille çalışır"]'::jsonb, '{"Güç":"Pil","Marka":"Aquails","Malzeme":"304 paslanmaz çelik","Kategori":"Musluklar & Aksesuarlar","Üretici":"Aquails","Ürün Tipi":"Dijital Arıtma Musluğu"}'::jsonb, NULL, NULL, TRUE),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails EONAQUA Dijital Su Arıtma Cihazı', 'aquails-eonaqua-dijital-su-aritma-cihazi', 'AQ-8371464896557', 'Aquails EONAQUA, suyunuzun ne kadar temiz olduğunu tahmin etmek yerine görmenizi sağlar. Ön paneldeki dijital gösterge, şebeke suyunun ve arıtılmış suyun TDS (toplam çözünmüş madde) değerini aynı anda gösterir.

Öne çıkanlar
• Dijital TDS göstergesi: giriş ve çıkış suyu değerleri anlık
• 5 aşamalı filtrasyon: tortudan kloruna, ağır metalden tadına kadar kademeli arıtma
• 80 GPD membran: 2000 TDS''ye kadar şebeke suyunda çalışır
• Yumuşak ve ferah içim

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', '5 aşamalı ters ozmoz arıtma ve dijital TDS göstergesi. Giriş ve çıkış suyunun kalitesini ekranda anlık görün.', 55000, NULL, 50, 4.9, 97, '["Dijital TDS göstergesi","5 aşamalı arıtma","80 GPD membran","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Membran":"80 GPD","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"PP Sediment: Kum, pas ve tortuyu tutar | GAC Granül Karbon: Klor ve kötü kokuyu azaltır | CTO Blok Karbon: Kimyasal kalıntıları filtreler | 80 GPD RO Membran: Ağır metal, bakteri ve çözünmüş maddeleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails EONAQUA PRO Dijital Su Arıtma Cihazı', 'aquails-eonaqua-pro-dijital-su-aritma-cihazi', 'AQ-8404650131501', 'Aquails EONAQUA PRO, dijital su arıtmayı bir adım ileri taşır. Suyun kalitesini anlık izlemenin yanında filtrelerin kullanım süresini de takip eder; değişim zamanı yaklaştığında uyarı verir. Böylece filtre değişimini unutmazsınız ve cihaz her zaman ilk günkü performansla çalışır.

Öne çıkanlar
• Akıllı filtre takibi: her filtrenin kullanım durumu ekranda, değişim zamanı gelince uyarı
• Performans uyarısı: arıtma performansı düşmeye başladığında önceden bildirir
• Dijital TDS kontrolü: giriş ve çıkış suyu değerleri anlık
• 5 aşamalı profesyonel filtrasyon, 80 GPD membran, 2000 TDS''ye kadar çalışma

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'EONAQUA''nın tüm özelliklerine ek olarak akıllı filtre takibi: filtre değişim zamanı gelince cihaz sizi uyarır.', 65000, NULL, 50, 4.7, 81, '["Akıllı filtre takibi","Dijital TDS göstergesi","5 aşamalı arıtma","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Membran":"80 GPD","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"PP Sediment: Kum, pas ve tortuyu tutar | GAC Granül Karbon: Klor ve kötü kokuyu azaltır | CTO Blok Karbon: Kimyasal kalıntıları filtreler | 80 GPD RO Membran: Ağır metal, bakteri ve çözünmüş maddeleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('f4134ade-ef9a-4021-a1f0-95c595e338f1', '08924fe5-6b9b-4b8a-88d3-4b7adca7f595', 'Aquails H2O DROP PLUS Su Arıtma Sistemi', 'aquails-h2o-drop-plus-su-aritma-sistemi', 'AQ-8053269823533', 'Aquails H2O DROP PLUS, H2O DROP''un tüm özelliklerine ek olarak alkalin-mineral filtreyle birlikte gelir. Ters ozmozla arıtılan suya son aşamada kalsiyum ve magnezyum gibi mineraller geri kazandırılır.

Arıtma aşamaları
• 5 mikron sediment filtre: kum, pas ve tortuyu tutar
• Granül aktif karbon filtre: klor, koku ve tat bozucu maddeleri azaltır
• Blok karbon filtre: kalan kimyasal ve organik kirlilikleri tutar
• 75 GPD Aquails RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Son (post) karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre: suyun pH değerini yükseltir ve mineral katar

Set içeriği
Basınç pompası, alçak ve yüksek basınç anahtarları, küresel vana, Avrupa model musluk, 2,2 galon depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 29 x 38 x 39 cm (en x boy x yükseklik)

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'H2O DROP''un alkalin-mineral filtreli versiyonu: 6 aşamalı ters ozmoz arıtma, 75 GPD membran ve 2,2 galon tank.', 15000, 21500, 10, 4.3, 133, '["6 aşamalı arıtma","Alkalin-mineral filtre","75 GPD membran","5 yıl garanti"]'::jsonb, '{"Tank":"2,2 galon","Marka":"Aquails","Membran":"75 GPD","Kategori":"Direkt Akış RO Cihazları","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 75 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır | Alkalin-Mineral Filtre: pH değerini yükseltir ve mineral katar"}'::jsonb, NULL, NULL, TRUE),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', '08924fe5-6b9b-4b8a-88d3-4b7adca7f595', 'Aquails H2O DROP Su Arıtma Sistemi', 'aquails-h2o-drop-su-aritma-sistemi', 'AQ-8053269626925', 'Aquails H2O DROP, evler için kompakt ve ekonomik bir ters ozmoz (RO) su arıtma sistemidir. Şebeke suyunu beş kademede arıtır ve arıtılmış suyu tankında hazır bekletir.

Arıtma aşamaları
• 5 mikron sediment filtre: kum, pas ve tortuyu tutar
• Granül aktif karbon filtre: klor, koku ve tat bozucu maddeleri azaltır
• Blok karbon filtre: kalan kimyasal ve organik kirlilikleri tutar
• 75 GPD RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Son (post) karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre opsiyonel olarak eklenebilir

Set içeriği
Basınç pompası, alçak ve yüksek basınç anahtarları, küresel vana, Avrupa model musluk, 2,2 galon depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 29 x 38 x 39 cm (en x boy x yükseklik)

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir. Filtreler, suyun durumuna ve kullanıma bağlı olarak ortalama yılda bir değiştirilir.', '5 aşamalı ters ozmoz su arıtma sistemi: 75 GPD membran, basınç pompası ve 2,2 galon depolama tankı.', 19790, NULL, 10, 4.8, 105, '["5 aşamalı arıtma","75 GPD membran","2,2 galon tank","5 yıl garanti"]'::jsonb, '{"Tank":"2,2 galon","Marka":"Aquails","Membran":"75 GPD","Kategori":"Direkt Akış RO Cihazları","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Referans Kodu":"H2O SERİES","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 75 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails H2O GREEN PLUS Dijital Su Arıtma Sistemi', 'aquails-h2o-green-plus-dijital-su-aritma-sistemi', 'AQ-8157080748077', 'Aquails H2O GREEN PLUS Dijital, GREEN PLUS''ın 5 aşamalı ters ozmoz arıtmasını dijital TDS göstergesiyle birleştirir. Ekrandaki değer sayesinde arıtılmış suyun saflığını anlık izler, filtre değişim zamanını da TDS''deki artıştan kolayca anlarsınız.

Arıtma aşamaları
• 12" inline sediment filtre (5 mikron): kum, pas ve tortuyu tutar
• 12" inline granül aktif karbon filtre: klor ve kötü kokuyu azaltır
• 12" inline blok karbon filtre: kalan kimyasal kirlilikleri tutar
• 80 GPD RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Post karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre opsiyonel olarak eklenebilir

Set içeriği
Dijital TDS göstergesi, küresel vana, 304 paslanmaz çelik musluk, 2,2 galon metal depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 29 x 38 x 39 cm (en x boy x yükseklik)

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'H2O GREEN PLUS''ın dijital TDS göstergeli versiyonu: arıttığınız suyun kalitesini ekranda anlık görün.', 35800, 37900, 10, 4.6, 177, '["Dijital TDS göstergesi","5 aşamalı arıtma","80 GPD membran","5 yıl garanti"]'::jsonb, '{"Tank":"2,2 galon metal","Marka":"Aquails","Membran":"80 GPD","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 80 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, 6, TRUE),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails H2O GREEN PLUS Su Arıtma Sistemi', 'aquails-h2o-green-plus-su-aritma-sistemi', 'AQ-8053270020141', 'Aquails H2O GREEN PLUS, ev ve ofis kullanımı için tasarlanmış klasik bir ters ozmoz su arıtma sistemidir. 80 GPD membranı ve metal depolama tankıyla günlük içme ve yemek suyu ihtiyacını rahatlıkla karşılar.

Arıtma aşamaları
• 12" inline sediment filtre (5 mikron): kum, pas ve tortuyu tutar
• 12" inline granül aktif karbon filtre: klor ve kötü kokuyu azaltır
• 12" inline blok karbon filtre: kalan kimyasal kirlilikleri tutar
• 80 GPD RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Post karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre opsiyonel olarak eklenebilir

Set içeriği
Küresel vana, 304 paslanmaz çelik musluk, 2,2 galon metal depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 29 x 38 x 39 cm (en x boy x yükseklik)

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', '80 GPD membranlı, 5 aşamalı ters ozmoz su arıtma sistemi. Paslanmaz musluk ve 2,2 galon metal tank dahil.', 28800, NULL, 10, 4.7, 161, '["5 aşamalı arıtma","80 GPD membran","Paslanmaz musluk","5 yıl garanti"]'::jsonb, '{"Tank":"2,2 galon metal","Marka":"Aquails","Membran":"80 GPD","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 80 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', '96201c2c-b2aa-43c0-ac49-1e517e6d8742', 'Aquails H2O NEO Su Arıtma Sistemi', 'aquails-h2o-neo-su-aritma-sistemi', 'AQ-8053270577197', 'Aquails H2O NEO, tüm filtreleri ve tankı tek bir kabinde toplayan kompakt bir ters ozmoz sistemidir. Dolap altında düzenli bir görünüm sağlar, bakım için filtrelere kolayca ulaşılır.

Arıtma aşamaları
• 12" inline sediment filtre (5 mikron): kum, pas ve tortuyu tutar
• 12" inline granül aktif karbon filtre: klor ve kötü kokuyu azaltır
• 12" inline blok karbon filtre: kalan kimyasal kirlilikleri tutar
• 75 GPD Aquails RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Post karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre opsiyonel olarak eklenebilir

Set içeriği
Basınç pompası, alçak ve yüksek basınç anahtarları, küresel vana, Avrupa model musluk, 3,2 galon depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 31 x 47,5 x 40 cm (en x boy x yükseklik)

Kullanım alanları: evler, ofisler, restoranlar, buz makineleri.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir. Filtreler ortalama yılda bir değiştirilir.', 'Kabinli, kompakt ters ozmoz su arıtma sistemi: 5 aşamalı arıtma, 75 GPD membran ve 3,2 galon tank.', 29990, NULL, 10, 4.9, 197, '["Kabinli kompakt tasarım","5 aşamalı arıtma","3,2 galon tank","5 yıl garanti"]'::jsonb, '{"Tank":"3,2 galon","Marka":"Aquails","Membran":"75 GPD","Kategori":"Soft / Kompakt Sistemler","Üretici":"Aquails","Ürün Tipi":"Kabinli Su Arıtma Cihazı","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 75 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails H2O TESLA Alkali Su Arıtma Sistemi (6 Aşama)', 'aquails-h2o-tesla-alkali-su-aritma-sistemi', 'AQ-8063948423213', 'Aquails H2O TESLA Alkali, H2O TESLA''nın tüm özelliklerine ek olarak alkalin-mineral filtreyle standart gelir. Ters ozmozla arıtılan suya son aşamada mineraller geri kazandırılır ve suyun pH değeri yükseltilir.

Arıtma aşamaları
• 12" inline sediment filtre (5 mikron): kum, pas ve tortuyu tutar
• 12" inline granül aktif karbon filtre: klor ve kötü kokuyu azaltır
• 12" inline blok karbon filtre: kalan kimyasal kirlilikleri tutar
• 80 GPD RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Post karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre: suyun pH değerini yükseltir ve mineral katar

Set içeriği
Basınç pompası, alçak ve yüksek basınç anahtarları, küresel vana, 304 paslanmaz çelik musluk, 3,2 galon metal depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 31 x 47,5 x 40 cm (en x boy x yükseklik)

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'H2O TESLA''nın alkalin-mineral filtreli 6 aşamalı versiyonu: arıtılmış suya mineral ve dengeli pH kazandırır.', 55000, 65000, 10, 4.7, 173, '["6 aşamalı arıtma","Alkalin-mineral filtre","3,2 galon metal tank","5 yıl garanti"]'::jsonb, '{"Tank":"3,2 galon metal","Marka":"Aquails","Membran":"80 GPD","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 80 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır | Alkalin-Mineral Filtre: pH değerini yükseltir ve mineral katar"}'::jsonb, 'discount', 15, TRUE),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', '89a44db4-9ab9-455d-8e70-e2679204f207', 'Aquails H2O TESLA Su Arıtma Sistemi', 'aquails-h2o-tesla-su-aritma-sistemi', 'AQ-8053270708269', 'Aquails H2O TESLA, basınç pompası ve geniş metal tankıyla şebeke basıncı düşük evlerde bile verimli çalışan bir ters ozmoz su arıtma sistemidir. Tam otomatik çalışır; tank dolunca kendiliğinden durur, su kullandıkça yeniden devreye girer.

Arıtma aşamaları
• 12" inline sediment filtre (5 mikron): kum, pas ve tortuyu tutar
• 12" inline granül aktif karbon filtre: klor ve kötü kokuyu azaltır
• 12" inline blok karbon filtre: kalan kimyasal kirlilikleri tutar
• 80 GPD RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Post karbon filtre: suya yumuşak bir içim kazandırır
• Alkalin-mineral filtre opsiyonel olarak eklenebilir

Set içeriği
Basınç pompası, alçak ve yüksek basınç anahtarları, küresel vana, 304 paslanmaz çelik musluk, 3,2 galon metal depolama tankı, atık kısıcı, flow, şatof ve çekvalf.

Ölçüler: 31 x 47,5 x 40 cm (en x boy x yükseklik)

Kullanım alanları: evler, ofisler, restoranlar, buz makineleri ve akvaryumlar.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'Yüksek performanslı ters ozmoz sistemi: 80 GPD membran, basınç pompası ve 3,2 galon metal tank.', 42000, NULL, 9, 4.9, 189, '["Basınç pompalı","5 aşamalı arıtma","3,2 galon metal tank","5 yıl garanti"]'::jsonb, '{"Tank":"3,2 galon metal","Marka":"Aquails","Membran":"80 GPD","Kategori":"Klasik RO Sistemleri","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı","Arıtma Aşamaları":"5 Mikron Sediment: Kum, pas ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Blok Karbon: Kalan kimyasal kirlilikleri tutar | 80 GPD RO Membran: Çözünmüş maddeleri ve ağır metalleri ayrıştırır | Post Karbon: Suya yumuşak bir içim kazandırır"}'::jsonb, NULL, NULL, TRUE),
  ('c55ae6c3-5a45-43dd-ab5f-1577715da78e', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Inline Ön Filtre Seti (3''lü)', 'aquails-inline-filtreler', 'AQ-8053266382893', 'Ön filtreler, membranı kum, pas ve klordan koruyarak cihazın ömrünü belirler. Bu set, ters ozmoz cihazınızın ilk üç aşamasını bir arada yeniler.

Set içeriği
• 5 mikron sediment filtre: kum, pas ve kaba tortuyu tutar
• Granül aktif karbon filtre (hindistan cevizi kabuğu): klor, koku ve tat bozucu maddeleri azaltır
• 1 mikron sediment filtre: ince partikülleri tutarak membranı korur

Değişim
Ön filtrelerin 6-12 ayda bir değiştirilmesi önerilir. Kuyu suyu veya bulanık şebeke suyu kullanılan yerlerde bu süre kısalabilir.', 'Ev tipi RO cihazları için 3''lü inline ön filtre seti: 5 mikron sediment, granül aktif karbon ve 1 mikron sediment.', 1349, 1699, 10, 4.3, 33, '["3''lü ön filtre seti","5 mikron + GAC + 1 mikron"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","İçerik":"5 mikron sediment, GAC karbon, 1 mikron sediment","Ürün Tipi":"Yedek Filtre Seti"}'::jsonb, 'discount', 21, TRUE),
  ('1ec3f482-37f6-44af-ae94-09bc8f989bc2', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Mineral pH Stabilizer Filtre', 'aquails-mineral-ph-stabilizer-filtre', 'AQ-8121666830381', 'Aquails Mineral pH Stabilizer Filtre, ters ozmozla arıtılmış suyun pH değerini dengeler ve sabit tutar. Aynı zamanda suya magnezyum ve kalsiyum gibi mineraller kazandırır.

Özellikler
• pH değerini dengeler ve sabit tutar
• Magnezyum ve kalsiyum katar
• Suya doğal ve taze bir tat verir
• Standart inline bağlantı, RO cihazlarının son aşamasına takılır
• Uzun kullanım ömrü', 'Arıtılmış suyun pH değerini dengeleyip sabit tutan, magnezyum ve kalsiyum katan mineral filtre.', 3460, NULL, 10, 4.4, 41, '["pH stabilizasyonu","Magnezyum ve kalsiyum katkısı"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"Mineral Filtre"}'::jsonb, NULL, NULL, TRUE),
  ('9c9a7602-ffcd-43dd-a467-901cd7ba7189', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails ORP Filtre', 'aquails-orp-filtre', 'AQ-8103178764333', 'ORP (oksidasyon-redüksiyon potansiyeli), suyun oksitleyici ya da indirgeyici özelliğini milivolt (mV) cinsinden gösteren bir ölçüdür. Aquails ORP Filtre, ters ozmozla arıtılmış suyun ORP değerini düzenleyen bir son aşama filtresidir.

Özellikler
• Arıtılmış suyun ORP değerini düşürür
• Suyun tadını ve içimini iyileştirir
• Standart inline bağlantı, kolay montaj
• Ev ve ofis tipi RO cihazlarıyla uyumlu', 'Arıtılmış suyun ORP (oksidasyon-redüksiyon potansiyeli) değerini düzenleyen son aşama filtresi.', 3751, NULL, 10, 4.1, 33, '["ORP düzenleme","Inline bağlantı"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"ORP Filtre"}'::jsonb, NULL, NULL, TRUE),
  ('ec40c917-d1b7-421e-afa4-cafcac9b4116', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Post Karbon Filtre', 'post-karbon-filtre', 'AQ-8053271330861', 'Post karbon filtre, ters ozmoz cihazlarının son aşamasıdır. Arıtılmış su musluğa ulaşmadan önce bu filtreden geçer ve tadı son kez düzenlenir.

Özellikler
• Hindistan cevizi kabuğundan üretilmiş aktif karbon
• 1050 mg/g iyot değeri: yüksek adsorpsiyon kapasitesi
• Tankta bekleyen suyun tat ve kokusunu giderir
• Klor kalıntılarına karşı son bariyer
• Standart inline bağlantı, ev tipi RO cihazlarıyla uyumlu

Değişim
Suyun durumuna ve kullanıma bağlı olarak ortalama yılda bir değiştirilmesi önerilir.', 'Hindistan cevizi kabuğu karbonlu son aşama filtresi: arıtılmış suya yumuşak, dengeli bir içim kazandırır.', 749, 950, 10, 4.7, 161, '["Hindistan cevizi karbonu","1050 mg/g iyot değeri","Son aşama tat düzenleme"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"Post Karbon Filtre","İyot Değeri":"1050 mg/g"}'::jsonb, 'discount', 21, TRUE),
  ('721dae4a-8bb2-496c-a07e-837f5f752648', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails PRO Inline Ön Filtre Seti (3''lü)', 'pro-inline-filtreler', 'AQ-8405941387309', 'Aquails PRO Inline filtre seti, ters ozmoz cihazınızın ilk üç aşamasını tek seferde yeniler. Düzenli değiştirilen ön filtreler membranın ömrünü uzatır ve arıtma performansını korur.

Set içeriği
• 5 mikron sediment filtre: kum, pas ve kaba tortuyu tutar
• Granül aktif karbon filtre (hindistan cevizi kabuğu): klor, koku ve tat bozucu maddeleri azaltır
• 1 mikron sediment filtre: ince partikülleri tutarak membranı korur

Değişim
Ön filtrelerin 6-12 ayda bir değiştirilmesi önerilir.', 'PRO serisi 3''lü inline ön filtre seti: 5 mikron sediment, granül aktif karbon ve 1 mikron sediment.', 2499, 2980, 10, 4.4, 129, '["3''lü ön filtre seti","5 mikron + GAC + 1 mikron"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","İçerik":"5 mikron sediment, GAC karbon, 1 mikron sediment","Ürün Tipi":"Yedek Filtre Seti"}'::jsonb, 'discount', 16, TRUE),
  ('efb6155e-1c56-4dd4-ad27-6777c6757651', 'ebb17321-02f3-4b40-8422-aacff64bbd37', 'Aquails Tanklı Sebil Aparatı', 'tankli-sebil-aparati', 'AQ-8053271429165', 'Aquails Tanklı Sebil Aparatı, mevcut damacana sebilinizi su arıtma cihazınıza bağlar. Damacana taşımaya, değiştirmeye gerek kalmaz; sebil arıtılmış suyla kendiliğinden dolar.

Nasıl çalışır?
Aparat, damacananın yerine sebilin üstüne yerleştirilir ve arıtma cihazından gelen ince bir hortumla bağlanır. İçindeki şamandıra sayesinde su kullandıkça otomatik olarak dolar, dolunca durur.

Set içeriği
• Polikarbonat şamandıralı tank
• NSF sertifikalı bağlantı hortumu (istenilen ölçüde uzatılabilir)
• T bağlantı aparatı
• Vana

Taşınabilir damacana sebillerinin büyük çoğunluğuyla uyumludur.', 'Sıradan damacana sebilinizi arıtmalı sebile dönüştürür: arıtma cihazınıza bağlanır, şamandıralı tankı kendiliğinden dolar.', 3500, NULL, 10, 4.4, 185, '["Damacanasız kullanım","Şamandıralı otomatik dolum"]'::jsonb, '{"Marka":"Aquails","Kategori":"Sebiller","Üretici":"Aquails","Ürün Tipi":"Sebil Aparatı"}'::jsonb, NULL, NULL, TRUE),
  ('e21d12cd-1fdf-44c0-acb8-3a14009e895d', 'ebb17321-02f3-4b40-8422-aacff64bbd37', 'Aquails Tanksız Sebil Aparatı', 'tanksiz-sebil-aparati', 'AQ-8053271625773', 'Aquails Tanksız Sebil Aparatı, damacana sebilinizi ek bir tank kullanmadan su arıtma cihazınıza bağlar. Damacana taşıma ve değiştirme derdi ortadan kalkar.

Nasıl çalışır?
Aparat sebilin damacana yuvasına yerleştirilir ve arıtma cihazından gelen ince bir hortumla bağlanır. Şamandıralı kapak sayesinde sebilin haznesi su kullandıkça otomatik olarak dolar.

Set içeriği
• Polikarbonat şamandıralı kapak
• NSF sertifikalı bağlantı hortumu (istenilen ölçüde uzatılabilir)
• T bağlantı aparatı
• Vana

Taşınabilir damacana sebillerinin büyük çoğunluğuyla uyumludur.', 'Damacana sebilinizi arıtma cihazınıza doğrudan bağlayan tanksız aparat. Kompakt ve kolay montajlı.', 2500, NULL, 10, 4.9, 33, '["Damacanasız kullanım","Tanksız kompakt yapı"]'::jsonb, '{"Marka":"Aquails","Kategori":"Sebiller","Üretici":"Aquails","Ürün Tipi":"Sebil Aparatı"}'::jsonb, NULL, NULL, TRUE),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', '741311e2-c130-4a5d-9a83-2e4c6928f541', 'Aquails TRIO CLEAN 10" 3''lü Bina Girişi Filtrasyon Sistemi', 'aquails-trio-clean-10-3-lu-bina-giris-filtrasyon-aritma-sistemi', 'AQ-8335644983341', 'Aquails bina girişi filtrasyon sistemi, ana su hattına takılarak evinize giren suyun tamamını musluklara ulaşmadan önce filtreler. Böylece yalnızca içme suyu değil; duş, çamaşır ve bulaşık makinesi, kombi ve tesisat da korunur.

Filtrasyon aşamaları
• 10" 5 mikron sediment filtre: kum, çamur, pas ve tortuyu tutarak suyu berraklaştırır
• 10" granül aktif karbon filtre: klor, koku ve tat bozucu maddeleri azaltır
• Kireç önleyici filtre: kireç oluşumunu azaltarak tesisatı ve cihazları korur

Ne kazandırır?
• Musluklardan bulanık ve çamurlu su gelmez
• Kombi, çamaşır ve bulaşık makinesi daha uzun ömürlü olur
• Kireç azaldığı için ısıtma verimi artar
• Depo kullanılan binalarda tortu sorununu çözer
• Kuyu suyu kullanılan yerlerde özellikle önerilir

Filtre değişimi
5 mikron sediment filtrenin ortalama 6 ayda bir değiştirilmesi önerilir; kuyu suyu ya da bulanık şebeke suyu kullanılıyorsa 3 ayda bir.

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', 'TRIO CLEAN serisi 10 inç 3 aşamalı bina girişi filtrasyonu: sediment, aktif karbon ve kireç önleyici.', 49900, 55900, 10, 4.9, 121, '["Tüm evin suyunu filtreler","Sediment + karbon + kireç önleyici","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Kategori":"Bina Giriş Filtrasyonu","Üretici":"Aquails","Filtre Boyu":"10 inç","Ürün Tipi":"Bina Girişi Filtrasyon Sistemi","Arıtma Aşamaları":"5 Mikron Sediment: Kum, çamur ve tortuyu tutar | Granül Aktif Karbon: Klor ve kötü kokuyu azaltır | Kireç Önleyici: Tesisatı ve cihazları kireçten korur"}'::jsonb, 'discount', 11, TRUE),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', '08924fe5-6b9b-4b8a-88d3-4b7adca7f595', 'Aquails Water Chef Direkt Akış Su Arıtma Cihazı', 'aquails-water-chef-direkt-akis-su-aritma-cihazi', 'AQ-8053277229101', 'Aquails Water Chef, yüksek su tüketimi olan evler ve küçük işletmeler için tasarlanmış direkt akışlı bir ters ozmoz cihazıdır. Su depoda beklemez; musluğu açtığınız anda arıtılır.

Öne çıkanlar
• 600 GPD kapasite: günde yaklaşık 2.270 litre arıtılmış su
• Tanksız tasarım: depolama tankı gerektirmez, daha az yer kaplar
• Otomatik ters yıkama: membranı belirli aralıklarla temizler, filtre ömrünü uzatır
• Gösterge paneli: filtre değişim zamanını ve cihaz durumunu ekrandan takip edersiniz
• Düşük atık su ve düşük enerji tüketimi
• Filtreler yılda bir kez değiştirilir

Kurulum ve garanti
Ege, Marmara, Akdeniz ve İç Anadolu bölgelerinde ücretsiz kurulum yapılır. Cihaz 5 yıl garantilidir.', '600 GPD kapasiteli, tanksız direkt akış su arıtma cihazı. Otomatik ters yıkama ve ekrandan filtre değişim takibi.', 95900, NULL, 10, 4.3, 121, '["600 GPD kapasite","Tanksız direkt akış","Otomatik ters yıkama","5 yıl garanti"]'::jsonb, '{"Marka":"Aquails","Kapasite":"600 GPD (~2.270 L/gün)","Kategori":"Direkt Akış RO Cihazları","Üretici":"Aquails","Ürün Tipi":"Tezgah Altı Su Arıtma Cihazı"}'::jsonb, NULL, NULL, TRUE),
  ('198c87c1-0c41-47dd-a84a-dface4feeac4', 'b485346d-b9ec-4dea-a4f9-9a514c4e6f94', 'Aquails Water Chef Yedek Filtre Seti', 'aquails-water-chef-yedek-filtre-seti', 'AQ-8053274771501', 'Aquails Water Chef cihazına özel yedek filtre seti. Filtreler tak-çıkar kartuş yapısındadır; cihaz, filtre ömrü dolmak üzereyken ekranda uyarı verir.

Set içeriği
• Sediment + granül aktif karbon kompozit filtre: tortu, klor ve kötü kokuyu tutar
• RO membran: çözünmüş maddeleri ve ağır metalleri ayrıştırır
• Post karbon filtre (hindistan cevizi kabuğu): suyun tadını düzenler

Değişim
Filtre ömürleri kartuşların üzerinde yazılıdır. Cihaz uyarı verdiğinde değişim için bize ulaşabilirsiniz.', 'Water Chef direkt akış cihazı için yedek filtre seti: sediment+karbon kompozit, RO membran ve post karbon.', 7900, NULL, 10, 4.7, 81, '["Water Chef uyumlu","Tak-çıkar kartuş"]'::jsonb, '{"Marka":"Aquails","Kategori":"Filtreler & Membranlar","Üretici":"Aquails","Ürün Tipi":"Yedek Filtre Seti","Uyumlu Cihaz":"Aquails Water Chef"}'::jsonb, NULL, NULL, TRUE);

INSERT INTO public.product_images (product_id, url, sort_order, alt_text) VALUES
  ('7b8b2640-daab-4a3d-a80f-cf0c2fa66487', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/7b8b2640-daab-4a3d-a80f-cf0c2fa66487/1785494984407-chatgpt-image-31-tem-2026-13_49_34.png', 0, 'Aquails 10" 3''lü Bina Girişi Filtrasyon Sistemi'),
  ('282ee162-cf46-4589-aa0b-5d87d6689985', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/282ee162-cf46-4589-aa0b-5d87d6689985/1785790503321-chatgpt-image-3-a-u-2026-23_54_58.png', 0, 'Aquails 10" Bina Girişi Yedek Filtre Seti (3''lü)'),
  ('a4b87a16-dfd6-4594-a923-48cd451b3426', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/a4b87a16-dfd6-4594-a923-48cd451b3426/1785495370515-chatgpt-image-31-tem-2026-13_56_05.png', 0, 'Aquails 1812 80 GPD RO Membran'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/daf19938-985b-4747-a41a-6d54628761f2/1785495596789-chatgpt-image-31-tem-2026-13_59_53.png', 0, 'Aquails 2/3 Yollu Musluk Bataryası'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/daf19938-985b-4747-a41a-6d54628761f2/1784914091060-aquails-2-3-yollu-musluk-bataryasi.png', 1, 'Aquails 2/3 Yollu Musluk Bataryası'),
  ('edb49685-aece-4fef-a95d-845197acc542', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/edb49685-aece-4fef-a95d-845197acc542/1785496428991-chatgpt-image-31-tem-2026-14_13_44.png', 0, 'Aquails 20" 3''lü Bina Girişi Filtrasyon Sistemi'),
  ('e2c3dd88-8029-4d92-a7bd-2fd02f78d57c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/e2c3dd88-8029-4d92-a7bd-2fd02f78d57c/1785493998369-chatgpt-image-31-tem-2026-13_33_13.png', 0, 'Aquails 304 Paslanmaz Çelik Arıtma Musluğu'),
  ('e2c3dd88-8029-4d92-a7bd-2fd02f78d57c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/e2c3dd88-8029-4d92-a7bd-2fd02f78d57c/1785493825516-chatgpt-image-31-tem-2026-13_30_19.png', 1, 'Aquails 304 Paslanmaz Çelik Arıtma Musluğu'),
  ('5fe4de4c-4c60-41e8-ad81-50edcf1ccaed', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/5fe4de4c-4c60-41e8-ad81-50edcf1ccaed/1785494738647-chatgpt-image-31-tem-2026-13_45_15.png', 0, 'Aquails Alkali Mineral Filtre'),
  ('7c02e393-4caa-4d75-a3f7-45c8a205dc49', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/7c02e393-4caa-4d75-a3f7-45c8a205dc49/1785498952981-chatgpt-image-31-tem-2026-14_55_46.png', 0, 'Aquails Alkaline pH Filtre'),
  ('47ec2ad3-0165-4136-a2d5-e62057bf03dc', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/47ec2ad3-0165-4136-a2d5-e62057bf03dc/1785499271237-chatgpt-image-31-tem-2026-15_01_01.png', 0, 'Aquails Antioxidant ORP Alkaline Filtre'),
  ('af6d8df9-6881-4b6f-a27a-af9af5c4677f', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/af6d8df9-6881-4b6f-a27a-af9af5c4677f/1785935470897-chatgpt-image-5-a-u-2026-16_10_49.png', 0, 'Aquails AQ-100 Soft Midi Su Yumuşatma Sistemi'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/0af9a6dd-a06b-469d-aecc-c3437edd46a3/1785791590938-chatgpt-image-4-a-u-2026-00_13_04.png', 0, 'Aquails AQ-115 Arıtmalı Sebil'),
  ('84e5d59f-1973-4fd7-a1fc-f75a02e01627', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/84e5d59f-1973-4fd7-a1fc-f75a02e01627/1785936105713-chatgpt-image-5-a-u-2026-16_21_36.png', 0, 'Aquails AQ-150 Softmax Maxi Su Yumuşatma Sistemi'),
  ('b70c7547-fb29-4662-af97-72eaf5584326', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/b70c7547-fb29-4662-af97-72eaf5584326/1785936980205-chatgpt-image-5-a-u-2026-16_36_14.png', 0, 'Aquails AQ-300 / 300 GPD Endüstriyel Su Arıtma Cihazı'),
  ('b70c7547-fb29-4662-af97-72eaf5584326', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/b70c7547-fb29-4662-af97-72eaf5584326/1785937283404-chatgpt-image-5-a-u-2026-16_41_19.png', 1, 'Aquails AQ-300 / 300 GPD Endüstriyel Su Arıtma Cihazı'),
  ('0186e795-3ad2-4037-a3ba-a515329ba552', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/0186e795-3ad2-4037-a3ba-a515329ba552/1785793575134-chatgpt-image-4-a-u-2026-00_46_04.png', 0, 'Aquails AQ-351 Arıtmalı Sebil'),
  ('56961781-fef1-4912-a810-7566b1a3badd', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/56961781-fef1-4912-a810-7566b1a3badd/1785933676154-chatgpt-image-5-a-u-2026-15_41_10.png', 0, 'Aquails AQ-50 Arıtmalı Sebil'),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/10fbd756-47b5-4550-a469-d4f330896bfd/1785937830191-chatgpt-image-5-a-u-2026-16_50_25.png', 0, 'Aquails AQ-600 / 600 GPD Endüstriyel Su Arıtma Cihazı'),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/10fbd756-47b5-4550-a469-d4f330896bfd/1785937848880-chatgpt-image-5-a-u-2026-16_50_43.png', 1, 'Aquails AQ-600 / 600 GPD Endüstriyel Su Arıtma Cihazı'),
  ('e2ec33f9-b103-4e25-a136-903becdfa275', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/e2ec33f9-b103-4e25-a136-903becdfa275/1785934174696-chatgpt-image-5-a-u-2026-15_49_25.png', 0, 'Aquails AQ-80 Arıtmalı Sebil'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/f984b923-5328-40d2-a53d-ebc4bcb99e96/1785493593047-chatgpt-image-31-tem-2026-13_26_27.png', 0, 'Aquails BLUEDROP Direkt Akış Su Arıtma Cihazı'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/f984b923-5328-40d2-a53d-ebc4bcb99e96/1785492245555-chatgpt-image-31-tem-2026-13_03_59.png', 1, 'Aquails BLUEDROP Direkt Akış Su Arıtma Cihazı'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/f984b923-5328-40d2-a53d-ebc4bcb99e96/1784920919821-aquails-bluedrop-di-rek-aki-su-aritma-ci-hazi.1.png', 2, 'Aquails BLUEDROP Direkt Akış Su Arıtma Cihazı'),
  ('e74b68b3-943f-4d52-a298-95df745a294f', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/e74b68b3-943f-4d52-a298-95df745a294f/1785790828351-chatgpt-image-4-a-u-2026-00_00_08.png', 0, 'Aquails Dijital 304 Paslanmaz Çelik Arıtma Musluğu'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/8aafff14-4c47-4753-a511-c63ee6e17d70/1785500798208-chatgpt-image-31-tem-2026-15_25_34.png', 0, 'Aquails EONAQUA Dijital Su Arıtma Cihazı'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/8aafff14-4c47-4753-a511-c63ee6e17d70/1785500983157-chatgpt-image-31-tem-2026-15_29_31.png', 1, 'Aquails EONAQUA Dijital Su Arıtma Cihazı'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/232bca60-2a29-4917-a710-9357f9dec6bc/1785501155570-chatgpt-image-31-tem-2026-15_32_21.png', 0, 'Aquails EONAQUA PRO Dijital Su Arıtma Cihazı'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/232bca60-2a29-4917-a710-9357f9dec6bc/1785501167806-chatgpt-image-31-tem-2026-15_29_31.png', 1, 'Aquails EONAQUA PRO Dijital Su Arıtma Cihazı'),
  ('f4134ade-ef9a-4021-a1f0-95c595e338f1', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/f4134ade-ef9a-4021-a1f0-95c595e338f1/1785776908079-chatgpt-image-3-a-u-2026-20_08_12.png', 0, 'Aquails H2O DROP PLUS Su Arıtma Sistemi'),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/5e83a8a8-ff91-4dac-ad02-b473bb034c48/1785777279041-chatgpt-image-3-a-u-2026-20_14_22.png', 0, 'Aquails H2O DROP Su Arıtma Sistemi'),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/3d8e1c98-6540-43d4-a800-8e779f366531/1785777777378-chatgpt-image-3-a-u-2026-20_22_34.png', 0, 'Aquails H2O GREEN PLUS Dijital Su Arıtma Sistemi'),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/d7ccad97-744e-46dd-afef-be787d8ac47e/1785778271985-chatgpt-image-3-a-u-2026-20_30_56.png', 0, 'Aquails H2O GREEN PLUS Su Arıtma Sistemi'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/e03bcd14-9792-4461-af79-14746bb7f10c/1785778612699-chatgpt-image-3-a-u-2026-20_36_18.png', 0, 'Aquails H2O NEO Su Arıtma Sistemi'),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/ab455c9a-7931-494e-a2c3-bb779176ac79/1785778776566-chatgpt-image-3-a-u-2026-20_39_29.png', 0, 'Aquails H2O TESLA Alkali Su Arıtma Sistemi (6 Aşama)'),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/2b825da4-a810-4682-a6dc-0c20c7b52680/1785778978307-chatgpt-image-3-a-u-2026-20_42_50.png', 0, 'Aquails H2O TESLA Su Arıtma Sistemi'),
  ('c55ae6c3-5a45-43dd-ab5f-1577715da78e', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/c55ae6c3-5a45-43dd-ab5f-1577715da78e/1785791043142-chatgpt-image-4-a-u-2026-00_03_58.png', 0, 'Aquails Inline Ön Filtre Seti (3''lü)'),
  ('1ec3f482-37f6-44af-ae94-09bc8f989bc2', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/1ec3f482-37f6-44af-ae94-09bc8f989bc2/1785779171716-chatgpt-image-3-a-u-2026-20_46_04.png', 0, 'Aquails Mineral pH Stabilizer Filtre'),
  ('9c9a7602-ffcd-43dd-a467-901cd7ba7189', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/9c9a7602-ffcd-43dd-a467-901cd7ba7189/1785779541010-chatgpt-image-3-a-u-2026-20_52_12.png', 0, 'Aquails ORP Filtre'),
  ('ec40c917-d1b7-421e-afa4-cafcac9b4116', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/ec40c917-d1b7-421e-afa4-cafcac9b4116/1785779806814-chatgpt-image-3-a-u-2026-20_56_39.png', 0, 'Aquails Post Karbon Filtre'),
  ('721dae4a-8bb2-496c-a07e-837f5f752648', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/721dae4a-8bb2-496c-a07e-837f5f752648/1785938139854-chatgpt-image-5-a-u-2026-16_55_32.png', 0, 'Aquails PRO Inline Ön Filtre Seti (3''lü)'),
  ('efb6155e-1c56-4dd4-ad27-6777c6757651', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/efb6155e-1c56-4dd4-ad27-6777c6757651/1785938359537-chatgpt-image-5-a-u-2026-16_59_13.png', 0, 'Aquails Tanklı Sebil Aparatı'),
  ('e21d12cd-1fdf-44c0-acb8-3a14009e895d', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/e21d12cd-1fdf-44c0-acb8-3a14009e895d/1785938709792-chatgpt-image-5-a-u-2026-17_05_05.png', 0, 'Aquails Tanksız Sebil Aparatı'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/1ae0cca1-9257-4984-a8a2-1e4981747d0c/1785780048766-chatgpt-image-3-a-u-2026-21_00_12.png', 0, 'Aquails TRIO CLEAN 10" 3''lü Bina Girişi Filtrasyon Sistemi'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/1ae0cca1-9257-4984-a8a2-1e4981747d0c/1785788291854-chatgpt-image-3-a-u-2026-23_17_58.png', 1, 'Aquails TRIO CLEAN 10" 3''lü Bina Girişi Filtrasyon Sistemi'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/1ae0cca1-9257-4984-a8a2-1e4981747d0c/1785789008491-chatgpt-image-3-a-u-2026-23_30_04.png', 2, 'Aquails TRIO CLEAN 10" 3''lü Bina Girişi Filtrasyon Sistemi'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/1ae0cca1-9257-4984-a8a2-1e4981747d0c/1785789181349-chatgpt-image-3-a-u-2026-23_32_56.png', 3, 'Aquails TRIO CLEAN 10" 3''lü Bina Girişi Filtrasyon Sistemi'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/44fdebff-d3f1-4fab-ab9d-5be09731a0b3/1785789528047-chatgpt-image-3-a-u-2026-23_38_37.png', 0, 'Aquails Water Chef Direkt Akış Su Arıtma Cihazı'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/44fdebff-d3f1-4fab-ab9d-5be09731a0b3/1785789952619-chatgpt-image-3-a-u-2026-23_45_48.png', 1, 'Aquails Water Chef Direkt Akış Su Arıtma Cihazı'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/44fdebff-d3f1-4fab-ab9d-5be09731a0b3/1785790090958-chatgpt-image-3-a-u-2026-23_48_05.png', 2, 'Aquails Water Chef Direkt Akış Su Arıtma Cihazı'),
  ('198c87c1-0c41-47dd-a84a-dface4feeac4', 'https://lumwisbjvlggtdjcahtj.supabase.co/storage/v1/object/public/product-images/198c87c1-0c41-47dd-a84a-dface4feeac4/1785940073980-chatgpt-image-5-a-u-2026-17_27_48.png', 0, 'Aquails Water Chef Yedek Filtre Seti');
