-- Ortimax catalog import (rebranded as Aquails)
-- Regenerate: node scripts/import-ortimax.mjs

DELETE FROM public.product_images;
DELETE FROM public.products;
DELETE FROM public.categories;

INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES
  ('bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Su Arıtma Cihazları', 'su-aritma', 'Droplet', 'Ev ve iş yeri için profesyonel su arıtma cihazları ve sistemleri', 1, TRUE);

INSERT INTO public.products (id, category_id, name, slug, sku, description, short_description, price, old_price, stock, rating, review_count, features, specifications, badge, discount_percent, is_active) VALUES
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI', 'water-chef-filtreler-su-aritma', 'AQ-8053277229101', 'Aquails 600 GPD Direkt Akış Su Arıtma Cihazı 

Teknik Özellikler
600 GPD  kapasiteli direkt su arıtma cihazı, evde kullanım için ideal, yüksek verimli ve çevre dostu bir çözümdür. Özel mineral filtre  teknolojisi sayesinde suyunuzu sadece arıtmakla kalmaz, aynı zamanda sağlıklı minerallerle zenginleştirir. 

İşte cihazın sunduğu  ana özellikler :

1. Yüksek Kapasite - 600 GPD

• 
600 GPD  (Galon / Gün) kapasite, günlük ortalama 2.270 litre su arıtma kapasitesi sağlar. Bu, büyük aileler veya yüksek su tüketimi olan evler için idealdir.

• Yüksek debi, hızlı ve sürekli su temini sağlar.

2. Direkt Akış Teknolojisi

• 
Ters Osmoz (RO) Sistemini  kullanarak suyunu doğrudan besleme halinde arıtır. Bu teknoloji, suyun her litre damlasını hızlı bir şekilde arıtarak atık su miktarını en aza indirir . 

• Cihazda suyun doğrudan hazır hale getirilmesi sağlanır, tank depolama ihtiyaçları yoktur.

3. Ters Yıkama Filtresi ve Kolay Bakım

• 
Ters yıkama filtresi  özelliği ile sistemin içindeki filtrelerin ömrü uzatılır. Bu filtre, belirli aralıklarla otomatik yıkama yaparak , kir ve tortuların sistemden atılmasını sağlar.

• Bu bakım yöntemi sayesinde filtrelerin verimli çalışması uzun süre korunur, bakım maliyetleri azalır.

4. Filtre Değişim Uyarıları

• 
Filtre değişim göstergesi , su arıtma filtrelerinin  değişim şeması gösterge paneli  bildiriminde mevcuttur. Bu sayede düzenli bakım yapılabilir ve cihazın verimliliği sürekli yüksek kalır.  

5. Az Atık Su

• 
Bu cihaz, geleneksel su arıtma sistemlerine kıyasla az atık su üretir . Yalnızca tüketim olan kadar atık su üretir ve suyun en verimli şekilde kullanılmasını sağlar. Bu özellik, su tasarrufu sağlayan çevre dostu bir çözüm sunuyor. 

6. Yüksek Verimlilik ve Hızlı Arıtma

• 
600 GPD kapasitesi  sayesinde cihaz, suyu hızla arıtarak büyük miktarda temiz su sağlar. Bu, büyük aileler veya ticari kullanımlar için mükemmel bir tercihtir.

• Arıtma Hızı, günlük su ihtiyacını karşılamak için yeterlidir.

7. Aşamalı Filtrasyon Sistemi

• 
Aşamalı arıtma rejimi  sayesinde suyunuz, ilk etapta mekanik filtrelerden (kum, çakıl, vb.) geçirilir, ardından aktif karbon filtreler ile kötü kokular ve tatlar giderilir. Son aşamada ters ozmoz membranı suyu mikro düzeyde arıtarak, zararlı maddeleri %99 oranında filtreler.  

8. Düşük Enerji Tüketimi

• 
Sistem enerji verimliliği ile çalışır, düşük güç tüketimi sağlar. Hem çevre dostudur, hem de elektrik faturalarını minimum düzeyde tutar.  

9. Kolay Kurulum ve Kullanım

• 
Hızlı kurulum  ve kullanım kolaylığı sağlayan tasarım. Şebeke suyuna doğrudan bağlanabilen cihaz, kurulumun ardından hızlı bir şekilde kullanılabilir.

• Kullanıcı dostu kontrol paneli ile tüm durumlar izlenebilir ve kolayca yönetilebilir.

10. Kompakt ve Şık Tasarım

• 
Kompakt boyutlar  ve şık tasarım sayesinde, sürekli mutfak veya yer sınırları dahilinde kullanılabilir.

11. Uzun Ömürlü Filtreler ve Düşük Bakım İhtiyacı

• 
Filtreler  uzun ömürlüdür ve yılda sadece bir kez değiştirilmesi gerekir. Bu da düşük bakım maliyetleri ile sürekli performans sağlar.  Gelişmiş filtre teknolojisi  sayesinde,  verimli çalışma uzun süre devam eder.

Özetle:

• 
600 GPD  kapasiteyle yüksek su verimliliği.

• 
Direkt akış  teknolojisi ile hızlı ve sürekli temiz su temini.

• 
Az atık su  üretimi ve enerji alışverişi ile çevre dostu çözüm.  

• 
Kolay bakım ve ters yıkama filtresi sayesinde uzun ömürlü kullanım.  

• 
Aşamalı filtreleme  ile suyunun en yüksek kalitede arıtılması.', 'Aquails 600 GPD Direkt Akış Su Arıtma Cihazı 

Teknik Özellikler
600 GPD  kapasiteli direkt su arıtma cihazı, evde kullanım için ideal, yüksek verimli ve çevre ...', 95900, NULL, 10, 4.3, 121, '["Yüksek debi, hızlı ve sürekli su temini sağlar.","Cihazda suyun doğrudan hazır hale getirilmesi sağlanır, tank depolama ihtiyaçları yoktur.","Bu bakım yöntemi sayesinde filtrelerin verimli çalışması uzun süre korunur, bakım maliyetleri azalır.","Arıtma Hızı, günlük su ihtiyacını karşılamak için yeterlidir.","Kullanıcı dostu kontrol paneli ile tüm durumlar izlenebilir ve kolayca yönetilebilir.","Kompakt boyutlar  ve şık tasarım sayesinde, sürekli mutfak veya yer sınırları dahilinde kullanılabilir.","600 GPD  kapasiteyle yüksek su verimliliği.","Direkt akış  teknolojisi ile hızlı ve sürekli temiz su temini."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails BLUEDROP DİREK AKIŞ SU ARITMA CİHAZI', 'aquails-blue-drop-su-aritma-cihazi', 'AQ-8299605917741', 'Aquails 600 GPD Direkt Akış Su Arıtma Cihazı - Teknik Özellikler
600 GPD  kapasiteli direkt su arıtma cihazı, evde kullanım için ideal, yüksek verimli ve çevre dostu bir çözümdür. Özel mineral filtre  teknolojisi sayesinde suyunuzu sadece arıtarak kalır, aynı zamanda sağlıklı minerallerle zenginleştirir. İşte cihazın sunduğu  ana özellikler :

1. Yüksek Kapasite - 600 GPD

• 
600 GPD  (Galon / Gün) kapasite, günlük ortalama 2.270 litre su arıtma kapasitesi sağlar. Bu, büyük aileler veya yüksek su tüketimi olan evler için idealdir.

• Yüksek debi, hızlı ve sürekli su temini sağlar.

2. Direkt Akış Teknolojisi

• 
Ters Ozmoz (RO) Sistemini  kullanarak suyunu doğrudan besleme halinde arıtır. Bu teknoloji, suyun her litre damlasını hızlı bir şekilde arıtarak atık su miktarını en aza indirir . 

• Cihazda doğrudan doğruya hazır hale getirilmesi sağlanır, tank depolama ihtiyaçları yoktur.

3. Ters Yıkama Filtresi ve Kolay Bakım

• 
Ters yıkama filtresi  özelliği ile sistemin içindeki filtrelerin ömrü uzatılır. Bu filtre, belirli aralıkların akışıyla temizlenerek, kir ve tortuların sistemden atılmasını sağlar.

• Bu bakım yöntemi sayesinde filtrelerin verimli çalışması uzun süre korur, bakım maliyetleri azalır.

4. Filtre Değişim Uyarıları

• 
Filtre değişim göstergesi , su arıtma işlemlerinin filtrelerinin değişim şeması boyut bildiriminde mevcuttur. Bu sayede düzenli bakım yapılabilir ve cihazın verimliliği sürekli yüksek kalır.  

5. Az Atık Su

• 
Bu cihaz, geleneksel su arıtma sistemlerine kıyasla az atık su üretir . Yalnızca tüketim olan kadar atık su üretir ve suyun en verimli şekilde kullanılmasını sağlar. Bu özellik, su tasarrufu sağlayan çevre dostu bir çözüm sunuyor. 

6. Yüksek Verimlilik ve Hızlı Arıtma

• 
600 GPD kapasitesi  sayesinde cihaz, suyu hızla arıtarak büyük miktarda temiz su sağlar. Bu, büyük aileler veya ticari kullanımlar için mükemmel bir tercihtir.

• Arıtma Hızı, günlük su ihtiyacını karşılamak için yeterlidir.

7. Aşamalı Filtrasyon Sistemi

• 
Aşamalı rejimi  sayesinde suyuz, ilk etapta mekanik filtrelerden (kum, çakıl, vb.) geçirilir, ardından aktif karbon filtreler ile kötü kokular ve tatlar giderilir. Son aşamada ters ozmoz membranı suyunu mikro düzeyde arıtarak, zararlı maddeleri %99 oranında filtreler.  

8. Düşük Enerji Tüketimi

• 
Sistem enerji verimliliği ile çalışır, düşük güç tüketimi sağlar. Hem çevre dostudur, hem de elektrik faturalarını minimum düzeyde tutar.  

9. Kolay Kurulum ve Kullanım

• 
Hızlı kurulum  ve kullanım kolaylığı sağlayan tasarım. Şebeke suyuna doğrudan bağlanabilen cihaz, kurulumun ardından hızlı bir şekilde kullanılabilir.

• Kullanıcı dostu kontrol paneli ile tüm durumlar izlenebilir ve kolayca yönetilebilir.

10. Kompakt ve Şık Tasarım

• 
Kompakt boyutlar  ve şık tasarım sayesinde, sürekli mutfak veya yer sınırları dahilinde kullanılabilir.

11. Uzun Ömürlü Filtreler ve Düşük Bakım İhtiyacı

• 
Filtreler  uzun ömürlüdür ve yılda sadece birkaç kez değiştirilmesi gerekir. Bu da düşük bakım maliyetleri ile sürekli performans sağlar.  

• 
Gelişmiş filtre teknolojisi  sayesinde, verimliliğin verimli çalışması uzun süre devam eder.

Özetle:

• 
600 GPD  kapasiteyle yüksek su verimliliği.

• 
Direkt akış  teknolojisi ile hızlı ve sürekli temiz su temini.

• 
Az atık su  üretimi ve enerji alışverişi ile çevre dostu çözüm.  

• 
Kolay bakım ve ters yıkama filtresi sayesinde uzun ömürlü kullanım.  

• 
Aşamalı filtreleme  ile suyunun en yüksek kalitede arıtılması.', 'Aquails 600 GPD Direkt Akış Su Arıtma Cihazı - Teknik Özellikler
600 GPD  kapasiteli direkt su arıtma cihazı, evde kullanım için ideal, yüksek verimli ve çevre ...', 95900, NULL, 10, 4.4, 21, '["Yüksek debi, hızlı ve sürekli su temini sağlar.","Cihazda doğrudan doğruya hazır hale getirilmesi sağlanır, tank depolama ihtiyaçları yoktur.","Bu bakım yöntemi sayesinde filtrelerin verimli çalışması uzun süre korur, bakım maliyetleri azalır.","Arıtma Hızı, günlük su ihtiyacını karşılamak için yeterlidir.","Kullanıcı dostu kontrol paneli ile tüm durumlar izlenebilir ve kolayca yönetilebilir.","Kompakt boyutlar  ve şık tasarım sayesinde, sürekli mutfak veya yer sınırları dahilinde kullanılabilir.","Gelişmiş filtre teknolojisi  sayesinde, verimliliğin verimli çalışması uzun süre devam eder.","600 GPD  kapasiteyle yüksek su verimliliği."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI', 'aquails-eonaqua-dijital-su-aritma-cihazi', 'AQ-8371464896557', '🔹 5 Aşamalı Güçlü Filtrasyon Sistemi
Cihaz, suyu adım adım arıtarak maksimum temizlik ve tat kalitesi sunar:

1️⃣ PP Sediment FiltreSudaki tortu, kum, çamur ve pas gibi büyük partikülleri tutar.

2️⃣ GAC (Granül Aktif Karbon) FiltreKlor, kötü koku ve organik maddeleri azaltır.

3️⃣ CTO (Blok Karbon) FiltreKimyasal kalıntıları ve ağır metalleri filtreleyerek suyu daha güvenli hale getirir.

4️⃣ 80 GPD Membran FiltreYüksek performanslı membran teknolojisi sayesinde✔ Ağır metaller✔ Bakteriler✔ Virüsler✔ Çözünmüş zararlı maddeler✔ Yüksek TDS değerleri

etkili şekilde arıtılır.2000 TDS seviyesine kadar çalışma kapasitesine sahiptir.

5️⃣ Post Carbon (Tatlandırıcı) FiltreArıtılmış suya doğal ve yumuşak içim tadı kazandırır.

📊 Dijital TDS Gösterge Sistemi
Cihazın en önemli özelliklerinden biri:

✅ Giriş suyu TDS değeri görüntüleme✅ Çıkış suyu TDS değeri görüntüleme✅ Anlık su kalitesi kontrolü', '🔹 5 Aşamalı Güçlü Filtrasyon Sistemi
Cihaz, suyu adım adım arıtarak maksimum temizlik ve tat kalitesi sunar:

1️⃣ PP Sediment FiltreSudaki tortu, kum, çamur ve...', 65900, NULL, 10, 4.9, 97, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI', 'aquails-eonaqua-pro-dijital-su-aritma-cihazi', 'AQ-8404650131501', '💎 Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI
Daha fazla kontrol, daha fazla güvenlik, daha akıllı teknoloji!Aquails EONAQUA PRO, gelişmiş dijital özellikleri ve filtre takip sistemi ile su arıtma deneyimini bir üst seviyeye taşır. Hem su kalitenizi anlık izleyin hem de filtre değişim zamanını asla kaçırmayın.

🔹 5 Aşamalı Profesyonel Filtrasyon Sistemi
Gelişmiş filtre teknolojisi ile maksimum arıtma performansı:

1️⃣ PP Sediment FiltreTortu, kum, pas ve partikülleri tutar, diğer filtreleri korur.

2️⃣ GAC (Granül Aktif Karbon) FiltreKlor, kötü tat ve kokuyu azaltır.

3️⃣ CTO (Blok Karbon) FiltreKimyasal kalıntılar ve ağır metalleri filtreleyerek suyu güvenli hale getirir.

4️⃣ 80 GPD Yüksek Performanslı Membran✔ Ağır metaller✔ Bakteriler ve virüsler✔ Çözünmüş zararlı maddeler✔ Yüksek TDS değerleri

2000 TDS seviyesine kadar çalışma kapasitesine sahiptir.

5️⃣ Post Carbon (Tatlandırıcı) FiltreSuya doğal, yumuşak ve ferah bir içim kazandırır.

📊 Dijital TDS Kontrol Sistemi
PRO model gelişmiş dijital ekranıyla:

✅ Giriş suyu TDS değeri✅ Çıkış suyu TDS değeri✅ Anlık arıtma performansı kontrolü

Suyunuzun kalitesini gözle görün, güvenle tüketin.

🔔 Akıllı Filtre Takip ve Uyarı Sistemi (PRO’ya Özel)
PRO modelin en önemli avantajı:

✔ Filtre kullanım süresini takip eder✔ Filtre değişim zamanı geldiğinde uyarı verir✔ Performans düşüşünü önceden bildirir✔ Maksimum verimlilik sağlar

Bu sistem sayesinde filtre değişimini unutmaz, cihazınızdan her zaman en yüksek performansı alırsınız.', '💎 Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI
Daha fazla kontrol, daha fazla güvenlik, daha akıllı teknoloji!Aquails EONAQUA PRO, gelişmiş dijital özellikleri...', 85900, NULL, 10, 4.7, 81, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O TESLA SU ARITMA SİSTEMİ', 'aquails-h2o-tesla-su-aritma-sistemi', 'AQ-8053270708269', 'Aquails Reverse Osmosis (Ters Osmos) Su Arıtma Cihazı 

Sağlıklı ve Güvenilir İçme Suyu
Dünya genelinde olduğu gibi Türkiye’de de temiz içme suyu temin etmek giderek daha zor hale gelmektedir. Çevre kirliliği, sanayileşme, tarımsal ilaçlar ve altyapı eksiklikleri, suyun kalitesini olumsuz etkiliyor ve içilebilir su kaynaklarının azalmasına neden oluyor. Musluk suyunda, özellikle büyük şehirlerde suyun şebekeye ulaşana kadar binlerce kilometre mesafe kat etmesi, kirleticilerin suya karışmasına yol açabiliyor. Bu da musluk suyunun sağlıklı olup olmadığı konusunda şüpheler uyandırıyor.

Damacana ve şişe su kullanımı da ekonomik olmayan ve potansiyel sağlık riskleri taşıyan bir çözüm olmaya devam ediyor. Çıkan haberlerle damacana sularının sağlık açısından güvenilirliğinin sorgulanması, insanları daha güvenilir bir çözüm arayışına itiyor. İşte bu noktada Aquails Reverse Osmosis Su Arıtma Cihazı devreye giriyor. Bu cihaz, şüphe duyduğunuz musluk suyunu, en güvenilir ve sağlıklı hale getirerek, kendi suyunuzu üretmenizi sağlar.

Neden Reverse Ozmosis (Ters Ozmos) Su Arıtma Cihazı?
Ters Ozmos Teknolojisi:
Ters ozmos (Reverse Ozmosis) su arıtma teknolojisi, suyun içindeki tüm kirleticileri ve zararlı maddeleri %90-98 oranında filtreleyerek yalnızca saf suyun geçişine izin verir. Membran filtrasyon sistemi, suyun içindeki ağır metaller, kimyasallar, klor, bakteriler, virüsler, ağır mineraller (kurşun, bakır, baryum, krom, vb.) ve zararlı kontaminantları temizler.

Tam Otomatik Çalışma:
Cihaz tam otomatik çalışır, bu da hiçbir müdahale gerektirmeden sürekli ve güvenli içme suyu sağlar. Bu teknoloji, sağlık açısından en hassas filtrasyon yöntemidir ve her türlü kirleticiyi sudan ayırarak şebeke suyunu içmeye uygun hale getirir.

Ürün Özellikleri

Filtrasyon Aşamaları

• 
Aquails 5 Mikron Sediment Filtre
Kaba tortu ve partikülleri temizler, membran filtreyi korur ve ömrünü uzatır.

• 
Aquails Granül Aktif Karbon Filtre
Klor, kötü koku, tat, gazlar ve kimyasalları sudan arındırarak suyun tadı ve kokusunu iyileştirir.

• 
Aquails Blok Karbon Filtre
Granül aktif karbon filtreden geçmesi muhtemel kirlilik ve bakterilerin filtre edilmesini sağlar.

• 
Aquails Ters Osmos Membran Filtre
5 angstrom gözenek çapı ile yalnızca su moleküllerinin geçişine izin verir. Tüm zararlı bakteriler, ağır metaller, kireç, tortu ve diğer kirleticiler %99 oranında arıtılır.

• 
Aquails Hindistan Cevizi Kabuğu Filtre
Arıtılmış suyu son bir kez geçiren bu filtre, suyu minerallerle zenginleştirir ve tadını iyileştirir.

• 
Aquails Alkalin-Mineral Filtre (Opsiyonel)
Alkali suyun pH seviyesini dengeler, minerallerle zenginleştirir ve sağlıklı bir içme suyu sağlar.

Alkali Su Faydaları

• 
Daha fazla oksijen: Alkali su, diğer su türlerinden daha fazla oksijen taşır ve vücuda hızlıca emilir.

• 
Vücut pH dengesini düzenler: Alkali su, vücudun pH seviyesini dengeleyerek hastalıkların oluşumunu engeller.

• 
Hidrasyon: Moleküler yapısı sayesinde, alkali su vücudunuzu çok daha etkili şekilde nemlendirir.

• 
Detoks ve enerji: Alkali su, vücudun toksinlerden arınmasına yardımcı olur ve enerji seviyelerini artırır.

Ekipman Özellikleri

• Aquails12" 5 Mikron Inline Sediment Filtre

• Aquails12" Inline GAC Granül Karbon Filtre

• Aquails12" Inline Blok Karbon Filtre

• Aquails Son (Post) Karbon Filtre

• Aquails 80 GPD Membran Filtre

• Aquails Alkalin/Mineral Filtre (Opsiyonel)

Diğer Ekipmanlar:

• Basınç Pompası

• Alçak Basınç Anahtarı

• Yüksek Basınç Anahtarı

• Küresel Vana

• 304 paslanmaz  çelik Musluk

• 3.2 G Metal,çelik Depolama Tankı

• Atık Kısıcı-Flow-Şatof-Çekvalf

Kullanım Alanları

• 
Evler: Musluk suyunuzu güvenli ve sağlıklı hale getirin.

• 
İşyerleri: Ofisler, mağazalar ve daha fazlası için ideal.

• 
Restoranlar: Müşterilerinize her zaman temiz ve taze içme suyu sunun.

• 
Buz Makineleri & Akvaryumlar: Su kalitesini iyileştirin ve kullanım ömrünü uzatın.

Ölçüler

• 
En: 31 cm

• 
Boy: 47,5 cm

• 
Yükseklik: 40 cm

Aquails Reverse Ozmosis Su Arıtma Cihazı ile Sağlıklı Suyu Evinize Getirin!
Daha sağlıklı, temiz ve güvenilir içme suyu için hemen Aquails Reverse Ozmosis Su Arıtma Cihazı edinin. Alkali-mineral filtre opsiyonuyla suyunuzu daha besleyici hale getirin ve doğal pH dengesini koruyarak sağlığınızı destekleyin!', 'Aquails Reverse Osmosis (Ters Osmos) Su Arıtma Cihazı 

Sağlıklı ve Güvenilir İçme Suyu
Dünya genelinde olduğu gibi Türkiye’de de temiz içme suyu temin etmek gi...', 42000, NULL, 10, 4.9, 189, '["Aquails 5 Mikron Sediment Filtre\nKaba tortu ve partikülleri temizler, membran filtreyi korur ve ömrünü uzatır.","Daha fazla oksijen: Alkali su, diğer su türlerinden daha fazla oksijen taşır ve vücuda hızlıca emilir.","Vücut pH dengesini düzenler: Alkali su, vücudun pH seviyesini dengeleyerek hastalıkların oluşumunu engeller.","Hidrasyon: Moleküler yapısı sayesinde, alkali su vücudunuzu çok daha etkili şekilde nemlendirir.","Detoks ve enerji: Alkali su, vücudun toksinlerden arınmasına yardımcı olur ve enerji seviyelerini artırır.","Aquails12\" 5 Mikron Inline Sediment Filtre","Aquails12\" Inline GAC Granül Karbon Filtre","Aquails12\" Inline Blok Karbon Filtre"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O TESLA (ALKALİ) SU ARITMA SİSTEMİ / 6 AŞAMA', 'https-aquails-com-tr-collections-su-aritma-products-orti-cc-87max-h2o-tesla-su-aritma-si-cc-87stemi-cc-87', 'AQ-8063948423213', 'Aquails Reverse Osmosis (Ters Osmos) Su Arıtma Cihazı 

Sağlıklı ve Güvenilir İçme Suyu
Dünya genelinde olduğu gibi Türkiye’de de temiz içme suyu temin etmek giderek daha zor hale gelmektedir. Çevre kirliliği, sanayileşme, tarımsal ilaçlar ve altyapı eksiklikleri, suyun kalitesini olumsuz etkiliyor ve içilebilir su kaynaklarının azalmasına neden oluyor. Musluk suyunda, özellikle büyük şehirlerde suyun şebekeye ulaşana kadar binlerce kilometre mesafe kat etmesi, kirleticilerin suya karışmasına yol açabiliyor. Bu da musluk suyunun sağlıklı olup olmadığı konusunda şüpheler uyandırıyor.

Damacana ve şişe su kullanımı da ekonomik olmayan ve potansiyel sağlık riskleri taşıyan bir çözüm olmaya devam ediyor. Çıkan haberlerle damacana sularının sağlık açısından güvenilirliğinin sorgulanması, insanları daha güvenilir bir çözüm arayışına itiyor. İşte bu noktada Aquails Reverse Osmosis Su Arıtma Cihazı devreye giriyor. Bu cihaz, şüphe duyduğunuz musluk suyunu, en güvenilir ve sağlıklı hale getirerek, kendi suyunuzu üretmenizi sağlar.

Neden Reverse Ozmosis (Ters Ozmos) Su Arıtma Cihazı?
Ters Ozmos Teknolojisi:
Ters ozmos (Reverse Ozmosis) su arıtma teknolojisi, suyun içindeki tüm kirleticileri ve zararlı maddeleri %90-98 oranında filtreleyerek yalnızca saf suyun geçişine izin verir. Membran filtrasyon sistemi, suyun içindeki ağır metaller, kimyasallar, klor, bakteriler, virüsler, ağır mineraller (kurşun, bakır, baryum, krom, vb.) ve zararlı kontaminantları temizler.

Tam Otomatik Çalışma:
Cihaz tam otomatik çalışır, bu da hiçbir müdahale gerektirmeden sürekli ve güvenli içme suyu sağlar. Bu teknoloji, sağlık açısından en hassas filtrasyon yöntemidir ve her türlü kirleticiyi sudan ayırarak şebeke suyunu içmeye uygun hale getirir.

Ürün Özellikleri

Filtrasyon Aşamaları

• 
Aquails 5 Mikron Sediment Filtre
Kaba tortu ve partikülleri temizler, membran filtreyi korur ve ömrünü uzatır.

• 
Aquails Granül Aktif Karbon Filtre
Klor, kötü koku, tat, gazlar ve kimyasalları sudan arındırarak suyun tadı ve kokusunu iyileştirir.

• 
Aquails Blok Karbon Filtre
Granül aktif karbon filtreden geçmesi muhtemel kirlilik ve bakterilerin filtre edilmesini sağlar.

• 
Aquails Ters Osmos Membran Filtre
5 angstrom gözenek çapı ile yalnızca su moleküllerinin geçişine izin verir. Tüm zararlı bakteriler, ağır metaller, kireç, tortu ve diğer kirleticiler %99 oranında arıtılır.

• 
Aquails Hindistan Cevizi Kabuğu Filtre
Arıtılmış suyu son bir kez geçiren bu filtre, suyu minerallerle zenginleştirir ve tadını iyileştirir.

• 
Aquails Alkalin-Mineral Filtre 
Alkali suyun pH seviyesini dengeler, minerallerle zenginleştirir ve sağlıklı bir içme suyu sağlar.

Alkali Su Faydaları

• 
Daha fazla oksijen: Alkali su, diğer su türlerinden daha fazla oksijen taşır ve vücuda hızlıca emilir.

• 
Vücut pH dengesini düzenler: Alkali su, vücudun pH seviyesini dengeleyerek hastalıkların oluşumunu engeller.

• 
Hidrasyon: Moleküler yapısı sayesinde, alkali su vücudunuzu çok daha etkili şekilde nemlendirir.

• 
Detoks ve enerji: Alkali su, vücudun toksinlerden arınmasına yardımcı olur ve enerji seviyelerini artırır.

Ekipman Özellikleri

• Aquails12" 5 Mikron Inline Sediment Filtre

• Aquails12" Inline GAC Granül Karbon Filtre

• Aquails12" Inline Blok Karbon Filtre

• Aquails Son (Post) Karbon Filtre

• Aquails 80 GPD Membran Filtre

• Aquails Alkalin/Mineral Filtre (Opsiyonel)

Diğer Ekipmanlar:

• Basınç Pompası

• Alçak Basınç Anahtarı

• Yüksek Basınç Anahtarı

• Küresel Vana

• 304 paslanmaz  çelik Musluk

• 3.2 G Metal,çelik Depolama Tankı

• Atık Kısıcı-Flow-Şatof-Çekvalf

Kullanım Alanları

• 
Evler: Musluk suyunuzu güvenli ve sağlıklı hale getirin.

• 
İşyerleri: Ofisler, mağazalar ve daha fazlası için ideal.

• 
Restoranlar: Müşterilerinize her zaman temiz ve taze içme suyu sunun.

• 
Buz Makineleri & Akvaryumlar: Su kalitesini iyileştirin ve kullanım ömrünü uzatın.

Ölçüler

• 
En: 31 cm

• 
Boy: 47,5 cm

• 
Yükseklik: 40 cm

Aquails Reverse Ozmosis Su Arıtma Cihazı ile Sağlıklı Suyu Evinize Getirin!
Daha sağlıklı, temiz ve güvenilir içme suyu için hemen Aquails Reverse Ozmosis Su Arıtma Cihazı edinin. Alkali-mineral filtre opsiyonuyla suyunuzu daha besleyici hale getirin ve doğal pH dengesini koruyarak sağlığınızı destekleyin!', 'Aquails Reverse Osmosis (Ters Osmos) Su Arıtma Cihazı 

Sağlıklı ve Güvenilir İçme Suyu
Dünya genelinde olduğu gibi Türkiye’de de temiz içme suyu temin etmek gi...', 55000, 65000, 10, 4.7, 173, '["Aquails 5 Mikron Sediment Filtre\nKaba tortu ve partikülleri temizler, membran filtreyi korur ve ömrünü uzatır.","Daha fazla oksijen: Alkali su, diğer su türlerinden daha fazla oksijen taşır ve vücuda hızlıca emilir.","Vücut pH dengesini düzenler: Alkali su, vücudun pH seviyesini dengeleyerek hastalıkların oluşumunu engeller.","Hidrasyon: Moleküler yapısı sayesinde, alkali su vücudunuzu çok daha etkili şekilde nemlendirir.","Detoks ve enerji: Alkali su, vücudun toksinlerden arınmasına yardımcı olur ve enerji seviyelerini artırır.","Aquails12\" 5 Mikron Inline Sediment Filtre","Aquails12\" Inline GAC Granül Karbon Filtre","Aquails12\" Inline Blok Karbon Filtre"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, 'discount', 15, TRUE),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O NEO SU ARITMA SİSTEMİ', 'aquails-h2o-neo-su-aritma-sistemi', 'AQ-8053270577197', '• 
Bildiğiniz gibi Dünya’nın birçok ülkesinde olduğu gibi ülkemizde de temiz içme suyunu temin etmek her geçen gün zorlaşmaktadır. Gün geçtikçe çevre kirliliğinin artması, sanayileşme, tarımsal ilaçlar ve diğer birçok faktör nedeniyle bu kirlilik sulara geçmekte ve içilebilir su rezervlerinin azalmasına sebep olmaktadır. Büyük şehirlerde şebekeye verilmeden önce, içme ve kullanım sularının belediyeler tarafından tüm ağır metallerden ve zehirli atıklardan arıtıldığını kabul etsek bile, evimizdeki musluğa gelinceye kadar binlerce kilometrelik yolda muhtemel kirleticilerin sızma ihtimali, sel vakalarının neden olduğu kirlilikler ve alt yapı yetersizlikleri evlerimize ulaşan suyun içilebilir olmasında ciddi şüpheler uyandırmaktadır. Bunu da suların kesildikten bir müddet sonra yeniden akmaya başladığında, ilk gelen suyun gözle görülebilir düzeyde kirli olmasından rahatlıkla anlayabiliriz. İlk 5-10 dakika sular bulanık akar ve pas kokusu etrafı sarar. Bu da musluğumuza kadar gelen suyun sağlıklı bir şebeken gelmediğinin somut ispatlarından sadece bir tanesidir. Şebeke sularının içilebilir durumda olmaması insanları damacana ve şişe su kullanımına yönlendirmiştir. Bu yöntemler ekonomik değildir ve belirttiğimiz gibi ciddi tehlikeleri de beraberinde getirmektedir. Nitekim damacana sularının hiç de masum olmadığını çıkan haberlerden takip etmekteyiz. Bu nedenle hazır sular konusunda da birtakım kuşkular akılları her zaman karıştırmaktadır. Tüm bu kuşkulardan kurtulmanın tek çaresi “kaliteli ve güvenilir” bir Reverse Osmosis Su arıtma cihazı kullanarak kendi suyunuzu üretmektir. Böylelikle şüphe duyduğunuz musluk suyundan daha kaliteli ve güvenilir su elde etmiş olursunuz. Reverse Osmosis sistem su arıtma cihazları, sadece su moleküllerinin geçişine müsaade etmekte olup sisteme giren sudaki tüm ağır eriyikleri ve kirleticileri dışarı atar. Ayrıca tam otomatik olarak çalıştığından hiç bir şekilde müdahaleye gerek kalmaz. Reverse Osmosis (Ters Osmos) teknolojisi bilinen en hassas filtrasyon yöntemidir. Suyun içindeki istenmeyen tüm kirlilikleri sudan ayıran ve içme suyu teminine yönelik olarak kullanılan membran filtrasyon sisteminin adıdır. Bu sistemler çapraz akışlı olarak çalışır. Membran, yarı geçirgen bir zardır. Sadece su molekülleri ve bazı inorganik moleküller, bu zardan geçiş yapabilmektedir. Diğer moleküller ise, % 90 – 98 hassasiyetle filtre edilir ve konsantre su ile sistemden dışarı atılır. Bu sayede, su içerisindeki kötü koku ve tada sebep olan klor ve diğer kimyasallar ile birlikte kurşun, bakır, baryum, krom, cıva, sodyum, kadmiyum, nitrit, nitrat ve selenyum gibi ağır metaller ve zararlı kontaminantlar da arıtılmış olur.

Kullanım Alanları: Konutlar, işyerleri, restaurant, buz makineleri, akvaryumlar.

NOT: Su arıtma cihazı filtreleri suyun kirlilik kalitesine ve su kullanım miktarına bağlı olarak ortalama yılda bir defa değiştirilir.

Ekipman Özellikleri

12” 5 mic. İnline Sediment Filtre

12” İnline GAC Karbon Filtre

12” İnline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD Aquails Membran Filtre

Alkalin/mineral filtre (opsiyonel)

Diğer Ekipmanlar:

Basınç Pompası

Alçak Basınç Anahtarı

Yüksek Basınç Anahtarı

Küresel Vana

Avrupa Model Musluk

3.2 G Depolama Tankı

Atık kısıcı-Flow-Şatof-Çekvalf

Reverse Osmosis Aşamaları

• 

• 

• Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.

• Aşama: Granül Aktif Karbon Filtre – 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir.

• Aşama: Blok Karbon Filtre – 2. Aşamadaki granül aktif karbon filtreden geçmesi muhtemel kirlilik ve bakterilerin filtrelenmesi için tasarlanmıştır. Karbonun sıkıştırılarak preslenmesi sonucu elde edilir.

• Aşama: Ters Ozmos Membran Filtre – 5 angstrom gözenek çapına sahiptir. İlk 3 aşamada kaba tortu ve partiküllerden ayrıştırılan suyu detaylı arıtmaya hazır hale getirir. İlk 3 filtrenin asıl amacı membran filtresinin işini kolaylaştırmak ve ömrünü uzatmaktır. Özel yapım membran filtre olan LG membran filtre, suyun alkali seviyesinde neredeyse hiçbir değişiklik yapmaz. Arıtmanın en önemli aşamasıdır. Cihazın ana filtresi olan membran filtre, yarı geçirgen bir zar gibi hareket eder. Bitkilerin topraktan suyu emdiği gibi suyun içerisinden sadece yararlı maddelerin geçmesine izin verir. Tamamen doğaldır. Yüksek basınçla içinden sadece suyu geçirirken, mikron boyutunda suda var olan zararlı bakterileri, kireci, tortuyu, pası, asbesti, partikülleri ve ağır metalleri tamamen arıtır.

• Aşama: Hindistan Cevizi Kabuğu Filtre – Arıtılmış su, tanktan musluğa giderken, son kez Hindistan cevizi kabuğu filtreden geçer. Bu aşama, suyun mineral açısından zenginleşmesini sağlar.

• Aşama: Alkalin-Mineral filtre (opsiyonel)

ALKALİ SUYUN FAYDALARI 

Daha fazla oksijene sahip sağlıklı ve fonksiyonel sudur. Temiz ve bakterisizdir. İçindeki alkali minerallerin yanı sıra diğer su çeşitlerine göre daha fazla oksijene sahiptir. Negatif ORP değerlerine ve güçlü antioksidan özelliğe sahiptir. Alkali iyonize su antioksidan özelliğe sahiptir. Küçük moleküler küme yapısına sahip bir sıvı olarak diğer antioksidanlara göre vücut tarafından çok daha hızlı ve kolayca emilir. Vücudun pH dengesini korumasına yardım eder ve hastalıkları önler . Alkali iyonize su vücudun doğal pH dengesini korumasına ve düzenlemesine yardımcı olur ve vücutta zararlı bakteri iltihaplanma ve hastalıkların oluşumunu engelleyen bir ortam yaratır. Olağanüstü hidrasyon (nemlendirme)ve detoks sağlar. Moleküler yapısı diğer sulardan daha küçüktür. Bu nedenle hücrelerin içine diğer su çeşitlerine göre altı katına kadar fazla su girişi sağlar ve vücudun daha fazla nemlenmesine ve vücudun zehirli atıklardan en hızlı ve mükemmel şekilde temizlenmesine yardımcı olur. Vücudun enerjisini ve zindeliğini artırır. Alkali iyonize su küçük moleküler yapısı nedeniyle vücudun biyo-elektriksel dengesini diğer su çeşitlerine göre üç kat daha hızlı yenileyerek vücudun enerjisini ve zindeliğini artırır.

Ölçüler 

En: 31 cm

Boy: 47,5  cm

Yükseklik: 40 cm', '• 
Bildiğiniz gibi Dünya’nın birçok ülkesinde olduğu gibi ülkemizde de temiz içme suyunu temin etmek her geçen gün zorlaşmaktadır. Gün geçtikçe çevre kirliliğin...', 29990, NULL, 10, 4.9, 197, '["Aşama: Alkalin-Mineral filtre (opsiyonel)"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O GREEN PLUS SU ARITMA SİSTEMİ', 'aquails-h2o-green-plus-su-aritma-sistemi', 'AQ-8053270020141', 'Aquails Ters Osmos Su Arıtma Cihazı - Sağlıklı ve Temiz Su
Su Arıtmanın Yeni Standardı: Aquails Ters Osmos Cihazı
Sağlıklı ve temiz suya ulaşmak her geçen gün daha zor hale geliyor. Çevre kirliliği, sanayileşme, tarımsal ilaçlar ve altyapı yetersizlikleri, musluk sularının kalitesini olumsuz etkileyerek içilebilirliklerini sorgulatıyor. Bu sorunu ortadan kaldırmanın en güvenli ve ekonomik yolu ise Aquails Su Arıtma Cihazı kullanmaktır.

Öne Çıkan Özellikler:

1. Ters Osmos Teknolojisi ile Yüksek Verimli Su Arıtma
Aquails Ters Osmos teknolojisi, suyun içindeki zararlı maddeleri %90-%98 oranında filtreler. Bu sayede yalnızca su moleküllerinin geçişine izin verilir. Musluk suyundaki ağır metaller, zararlı kimyasallar, klor, bakteriler, virüsler, kireç ve diğer kirleticiler arındırılarak, size sağlıklı ve içilebilir su sunulur.

2. Alkalin-Mineral Filtre (Opsiyonel)
Su arıtma sisteminizin son aşamasında eklenebilen alkalin-mineral filtre, suyun pH seviyesini dengeleyerek mineraller açısından zenginleştirilmiş su sağlar. Bu özellik, içtiğiniz suyun vücudunuzun doğal pH dengesini korumasını, hücrelerinizin daha hızlı bir şekilde nemlenmesini ve toksinlerden arındırılmasını sağlar.

3. 5 Filtrasyon Aşaması ile Derinlemesine Temizlik

• 
5 Mikron Sediment Filtre: Kaba tortu ve partikülleri temizler, membranı korur ve ömrünü uzatır.

• 
Granül Aktif Karbon Filtre: Klor, kötü koku, tat ve kimyasal maddeleri sudan arındırarak suyun tadını ve kalitesini iyileştirir.

• 
Blok Karbon Filtre: Derinlemesine arıtma sağlar ve bakterileri filtreler.

• 
Ters Osmos Membran Filtre: 5 angstrom gözenek çapı ile yalnızca su moleküllerinin geçişine izin verir, tüm zararlı maddeleri %99 oranında arıtarak saf su elde etmenizi sağlar.

• 
Hindistan Cevizi Kabuğu Filtre: Minerallerle zenginleştirilmiş su sağlar, tadı ve kalitesini iyileştirir.

4. Alkali Suyun Sağlık Faydaları

• 
Daha fazla oksijen: Alkali su, diğer su türlerinden daha fazla oksijen taşır ve vücuda hızlıca emilir.

• 
Vücut pH dengesini düzenler: Alkali su, vücudun doğal pH dengesini korur, hastalıkların oluşumunu engeller ve iltihaplanmalarla mücadele eder.

• 
Olağanüstü hidrasyon: Moleküler yapısı sayesinde, alkali su vücudu daha etkili şekilde nemlendirir ve toksinlerden hızlıca arındırılmasına yardımcı olur.

• 
Enerji ve zindelik artırır: Alkali iyonize su, biyo-elektriksel dengeyi hızla yenileyerek enerjinizi artırır ve zindelik sağlar.

Kullanım Alanları:
Evler, işyerleri, restoranlar, buz makineleri, akvaryumlar ve daha fazlası için uygundur. Aquails Su Arıtma Cihazı ile her zaman temiz ve sağlıklı suya sahip olabilirsiniz.

Ekipman Özellikleri:

• 
12" Aquails Inline Sediment Filtre (5 mikron)

• 12" Aquails Inline Granül Aktif Karbon Filtre

• 12" Aquails Inline Blok Karbon Filtre

• Aquails Post Karbon Filtre

• Aquails 80 GPD Membran Filtre

• 
Aquails Alkalin-Mineral Filtre (Opsiyonel)

• Küresel Vana

• Lüks 304 Paslanmaz Musluk

• 2,2 G Metal Depolama Tankı

• Atık Kısıcı (Flow-Şatof-Çekvalf)

Boyutlar:

• 
En: 29 cm

• 
Boy: 38 cm

• 
Yükseklik: 39 cm

Neden Aquails Ters Osmos Su Arıtma Cihazı?

• 
Sağlıklı içme suyu: Zararlı maddelerden tamamen arındırılmış, saf ve temiz su.

• 
Ekonomik ve güvenilir çözüm: Uzun ömürlü filtrelerle düşük bakım maliyetleri.

• 
Alkalin-mineral filtre (Opsiyonel): Vücudunuzun pH dengesini düzenleyen zengin mineralli su.

• 
Çeşitli kullanım alanları: Evde, işyerlerinde ve diğer pek çok alanda kullanılabilir.', 'Aquails Ters Osmos Su Arıtma Cihazı - Sağlıklı ve Temiz Su
Su Arıtmanın Yeni Standardı: Aquails Ters Osmos Cihazı
Sağlıklı ve temiz suya ulaşmak her geçen gün d...', 28800, NULL, 10, 4.7, 161, '["5 Mikron Sediment Filtre: Kaba tortu ve partikülleri temizler, membranı korur ve ömrünü uzatır.","Blok Karbon Filtre: Derinlemesine arıtma sağlar ve bakterileri filtreler.","Hindistan Cevizi Kabuğu Filtre: Minerallerle zenginleştirilmiş su sağlar, tadı ve kalitesini iyileştirir.","Daha fazla oksijen: Alkali su, diğer su türlerinden daha fazla oksijen taşır ve vücuda hızlıca emilir.","12\" Aquails Inline Sediment Filtre (5 mikron)","12\" Aquails Inline Granül Aktif Karbon Filtre","12\" Aquails Inline Blok Karbon Filtre","Aquails Post Karbon Filtre"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O GREEN PLUS DİJİTAL SU ARITMA SİSTEMİ', 'aquails-h2o-green-plus-dijital-su-aritma-sistemi', 'AQ-8157080748077', 'Aquails Ters Osmos Su Arıtma Cihazı – Sağlıklı, Güvenli ve Dijital Kontrollü Su

Su Arıtmanın Yeni Standardı
Sağlıklı ve temiz içme suyuna ulaşmak gün geçtikçe daha da zorlaşıyor. Çevre kirliliği, sanayileşme, tarımsal ilaç kalıntıları ve altyapı sorunları, musluk suyunun güvenilirliğini ciddi şekilde etkiliyor. Bu noktada, Aquails Ters Osmos Su Arıtma Cihazı, hem sağlıklı hem de ekonomik bir çözüm sunuyor.

Ev, iş yeri, restoran, akvaryum ve daha birçok alanda kullanılabilen bu gelişmiş sistemle, her zaman temiz, kaliteli ve güvenilir suya sahip olabilirsiniz.

Öne Çıkan Özellikler

1. Ters Osmos Teknolojisi ile Yüksek Verimli Su Arıtma
Aquails Ters Osmos sistemi, musluk suyundaki zararlı maddeleri %90-%98 oranında filtreleyerek yalnızca su moleküllerinin geçişine izin verir. Ağır metaller, klor, kimyasallar, bakteri, virüs, kireç ve diğer kirleticilerden arındırılmış, saf içme suyu sunar.

2. 5 Aşamalı Filtrasyon ile Derinlemesine Temizlik

• 
5 Mikron Sediment Filtre: Tortu ve partikülleri temizleyerek sistemin ömrünü uzatır.

• 
Granül Aktif Karbon Filtre: Kloru, kötü kokuları ve kimyasalları uzaklaştırır.

• 
Blok Karbon Filtre: Derin temizlik sağlayarak zararlı organizmaları filtreler.

• 
Ters Osmos Membran Filtre: 5 angstrom çapındaki gözenekleri ile tüm zararlı maddeleri %99 oranında arıtarak saf su elde edilmesini sağlar.

• 
Hindistan Cevizi Kabuğu Filtre: Suyu minerallerle zenginleştirir, tadını iyileştirir.

3. Alkalin-Mineral Filtre (Opsiyonel)
İçme suyunun pH seviyesini dengeleyerek alkalin hale getirir. Minerallerle zenginleştirilmiş bu su, vücudun doğal dengesini korur, toksinlerin atılmasına yardımcı olur ve daha etkili nemlendirme sağlar.

4. Alkali Suyun Sağlık Faydaları

• 
Daha fazla oksijen taşır ve vücut tarafından kolayca emilir.

• 
pH dengesini düzenler, bağışıklığı destekler.

• 
Derin hidrasyon sağlar, hücreleri daha hızlı nemlendirir.

• 
Enerji ve zindelik kazandırır, yorgunluğu azaltır.

5. Dijital TDS Göstergesi ile Anlık Su Kalite Takibi
Aquails cihazı, gelişmiş dijital TDS göstergesi ile donatılmıştır. Bu ekran sayesinde suyunuzun toplam çözünmüş madde (Total Dissolved Solids) değerini anlık olarak görebilirsiniz.

🔹 Gerçek zamanlı kalite kontrol: Arıtılan suyun saflık düzeyini doğrudan gözlemleyin.🔹 Filtre değişim zamanını anlayın: TDS değerindeki değişimler, bakım ve filtre değişim zamanlarının belirlenmesine yardımcı olur.🔹 Şeffaflık ve güven: İçtiğiniz suyun kalitesini artık sadece hissetmekle kalmayacak, sayısal olarak da göreceksiniz.

Bu özellik sayesinde, içme suyunuzun kalitesi her an gözünüzün önünde olur.

Kullanım Alanları
🏠 Evler🏢 Ofisler🍽️ Restoranlar🧊 Buz makineleri🐠 Akvaryumlarve daha fazlası…

Teknik Özellikler ve Ekipman Listesi

• 
12" Aquails Inline Sediment Filtre (5 mikron)

• 
12" Aquails Inline Granül Aktif Karbon Filtre

• 
12" Aquails Inline Blok Karbon Filtre

• 
Aquails Post Karbon Filtre

• 
Aquails 80 GPD Membran Filtre

• 
Aquails Alkalin-Mineral Filtre (Opsiyonel)

• 
Dijital TDS Göstergesi

• 
Küresel Vana

• 
Lüks 304 Paslanmaz Musluk

• 
2,2 G Metal Depolama Tankı

• 
Atık Kısıcı (Flow-Şatof-Çekvalf)

Boyutlar:

• 
En: 29 cm

• 
Boy: 38 cm

• 
Yükseklik: 39 cm

Neden Aquails Ters Osmos Su Arıtma Cihazı?
✅ %99’a varan saflık oranı ile güvenli su✅ Dijital TDS göstergesi ile anlık kalite kontrol✅ Uzun ömürlü filtreler ve düşük bakım maliyeti✅ Alkalin ve mineral desteğiyle zenginleştirilmiş su✅ Evden ofise geniş kullanım alanı

🔹 Sağlığınız için en iyi yatırım: Aquails ile suyun en saf halini keşfedin.🔹 Teknolojiyle desteklenen hijyen: Hem fiziksel hem dijital arıtma güvencesi.🔹 Her damlası güvenilir: Artık içtiğiniz suya %100 güvenebilirsiniz.', 'Aquails Ters Osmos Su Arıtma Cihazı – Sağlıklı, Güvenli ve Dijital Kontrollü Su

Su Arıtmanın Yeni Standardı
Sağlıklı ve temiz içme suyuna ulaşmak gün geçtikçe ...', 35800, 37900, 10, 4.6, 177, '["5 Mikron Sediment Filtre: Tortu ve partikülleri temizleyerek sistemin ömrünü uzatır.","Granül Aktif Karbon Filtre: Kloru, kötü kokuları ve kimyasalları uzaklaştırır.","Blok Karbon Filtre: Derin temizlik sağlayarak zararlı organizmaları filtreler.","Hindistan Cevizi Kabuğu Filtre: Suyu minerallerle zenginleştirir, tadını iyileştirir.","Daha fazla oksijen taşır ve vücut tarafından kolayca emilir.","pH dengesini düzenler, bağışıklığı destekler.","Derin hidrasyon sağlar, hücreleri daha hızlı nemlendirir.","Enerji ve zindelik kazandırır, yorgunluğu azaltır."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, 6, TRUE),
  ('f4134ade-ef9a-4021-a1f0-95c595e338f1', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O DROP PLUS SU ARITMA SİSTEMİ', 'aquails-h2o-drop-plus-su-aritma-sistemi', 'AQ-8053269823533', '12” 5 mic. Inline Sediment Filtre

12” Inline GAC Karbon Filtre

12” Inline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD Aquails Membran Filtre

Alkalin/Mineral filtre

Diğer Ekipmanlar

• 
Basınç Pompası

Alçak Basınç Anahtarı

Yüksek Basınç Anahtarı

Küresel Vana

Avrupa Model Musluk

2.2 G Depolama Tankı

Atık kısıcı-Flow-Şatof-Çekvalf

Reverse Osmosis Aşamaları

• 

• Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.

• Aşama: Granül Aktif Karbon Filtre – 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir.

• Aşama: Blok Karbon Filtre – 2. Aşamadaki granül aktif karbon filtreden geçmesi muhtemel kirlilik ve bakterilerin filtrelenmesi için tasarlanmıştır. Karbonun sıkıştırılarak preslenmesi sonucu elde edilir.

• Aşama: Ters Ozmos Membran Filtre – 5 angstrom gözenek çapına sahiptir. İlk 3 aşamada kaba tortu ve partiküllerden ayrıştırılan suyu detaylı arıtmaya hazır hale getirir. İlk 3 filtrenin asıl amacı membran filtresinin işini kolaylaştırmak ve ömrünü uzatmaktır. Özel yapım membran filtre olan LG membran filtre, suyun alkali seviyesinde neredeyse hiçbir değişiklik yapmaz. Arıtmanın en önemli aşamasıdır. Cihazın ana filtresi olan membran filtre, yarı geçirgen bir zar gibi hareket eder. Bitkilerin topraktan suyu emdiği gibi suyun içerisinden sadece yararlı maddelerin geçmesine izin verir. Tamamen doğaldır. Yüksek basınçla içinden sadece suyu geçirirken, mikron boyutunda suda var olan zararlı bakterileri, kireci, tortuyu, pası, asbesti, partikülleri ve ağır metalleri tamamen arıtır.

• Aşama: Hindistan Cevizi Kabuğu Filtre – Arıtılmış su, tanktan musluğa giderken, son kez Hindistan cevizi kabuğu filtreden geçer. Bu aşama, suyun mineral açısından zenginleşmesini sağlar.

• Aşama: Alkalin-Mineral filtre (opsiyonel)

ALKALİ SUYUN FAYDALARI 

Daha fazla oksijene sahip sağlıklı ve fonksiyonel sudur. Temiz ve bakterisizdir. İçindeki alkali minerallerin yanı sıra diğer su çeşitlerine göre daha fazla oksijene sahiptir. Negatif ORP değerlerine ve güçlü antioksidan özelliğe sahiptir. Alkali iyonize su antioksidan özelliğe sahiptir. Küçük moleküler küme yapısına sahip bir sıvı olarak diğer antioksidanlara göre vücut tarafından çok daha hızlı ve kolayca emilir. Vücudun pH dengesini korumasına yardım eder ve hastalıkları önler . Alkali iyonize su vücudun doğal pH dengesini korumasına ve düzenlemesine yardımcı olur ve vücutta zararlı bakteri iltihaplanma ve hastalıkların oluşumunu engelleyen bir ortam yaratır. Olağanüstü hidrasyon (nemlendirme)ve detoks sağlar. Moleküler yapısı diğer sulardan daha küçüktür. Bu nedenle hücrelerin içine diğer su çeşitlerine göre altı katına kadar fazla su girişi sağlar ve vücudun daha fazla nemlenmesine ve vücudun zehirli atıklardan en hızlı ve mükemmel şekilde temizlenmesine yardımcı olur. Vücudun enerjisini ve zindeliğini artırır. Alkali iyonize su küçük moleküler yapısı nedeniyle vücudun biyo-elektriksel dengesini diğer su çeşitlerine göre üç kat daha hızlı yenileyerek vücudun enerjisini ve zindeliğini artırır.

Ölçüler

En: 29 cm

Boy: 38 cm

Yükseklik: 39 cm', '12” 5 mic. Inline Sediment Filtre

12” Inline GAC Karbon Filtre

12” Inline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD Aquails Membran Filtre

Alkalin...', 23790, NULL, 10, 4.3, 133, '["Aşama: Alkalin-Mineral filtre (opsiyonel)"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('0905fb07-482d-4477-aef2-463b528149c2', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails EKO PLUS  SU ARITMA', 'aquails-eko-plus-su-aritma-sistemi', 'AQ-8065692598317', '12” 5 mic. Inline Sediment Filtre

12” Inline GAC Karbon Filtre

12” Inline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD Aquails Membran Filtre

Alkalin/Mineral filtre

Diğer Ekipmanlar

• 
Basınç Pompası

Alçak Basınç Anahtarı

Yüksek Basınç Anahtarı

Küresel Vana

Avrupa Model Musluk

2.2 G Depolama Tankı

Atık kısıcı-Flow-Şatof-Çekvalf

Reverse Osmosis Aşamaları

• 

• Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.

• Aşama: Granül Aktif Karbon Filtre – 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir.

• Aşama: Blok Karbon Filtre – 2. Aşamadaki granül aktif karbon filtreden geçmesi muhtemel kirlilik ve bakterilerin filtrelenmesi için tasarlanmıştır. Karbonun sıkıştırılarak preslenmesi sonucu elde edilir.

• Aşama: Ters Ozmos Membran Filtre – 5 angstrom gözenek çapına sahiptir. İlk 3 aşamada kaba tortu ve partiküllerden ayrıştırılan suyu detaylı arıtmaya hazır hale getirir. İlk 3 filtrenin asıl amacı membran filtresinin işini kolaylaştırmak ve ömrünü uzatmaktır. Özel yapım membran filtre olan LG membran filtre, suyun alkali seviyesinde neredeyse hiçbir değişiklik yapmaz. Arıtmanın en önemli aşamasıdır. Cihazın ana filtresi olan membran filtre, yarı geçirgen bir zar gibi hareket eder. Bitkilerin topraktan suyu emdiği gibi suyun içerisinden sadece yararlı maddelerin geçmesine izin verir. Tamamen doğaldır. Yüksek basınçla içinden sadece suyu geçirirken, mikron boyutunda suda var olan zararlı bakterileri, kireci, tortuyu, pası, asbesti, partikülleri ve ağır metalleri tamamen arıtır.

• Aşama: Hindistan Cevizi Kabuğu Filtre – Arıtılmış su, tanktan musluğa giderken, son kez Hindistan cevizi kabuğu filtreden geçer. Bu aşama, suyun mineral açısından zenginleşmesini sağlar.

• Aşama: Alkalin-Mineral filtre (opsiyonel)

 

Ölçüler

En: 29 cm

Boy: 38 cm

Yükseklik: 39 cm', '12” 5 mic. Inline Sediment Filtre

12” Inline GAC Karbon Filtre

12” Inline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD Aquails Membran Filtre

Alkalin...', 18900, NULL, 10, 4.3, 57, '["Aşama: Alkalin-Mineral filtre (opsiyonel)"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails H2O DROP SU ARITMA SİSTEMİ', 'aquails-h2o-drop-su-aritma-sistemi', 'AQ-8053269626925', '12” 5 mic. Inline Sediment Filtre

12” Inline GAC Karbon Filtre

12” Inline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD  Membran Filtre

Diğer Ekipmanlar

• 
Basınç Pompası

Alçak Basınç Anahtarı

Yüksek Basınç Anahtarı

Küresel Vana

Avrupa Model Musluk

2,2 G Depolama Tankı

Atık kısıcı-Flow-Şatof-Çekvalf

Reverse Osmosis Aşamaları

• 

• Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.

• Aşama: Granül Aktif Karbon Filtre – 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir.

• Aşama: Blok Karbon Filtre – 2. Aşamadaki granül aktif karbon filtreden geçmesi muhtemel kirlilik ve bakterilerin filtrelenmesi için tasarlanmıştır. Karbonun sıkıştırılarak preslenmesi sonucu elde edilir.

• Aşama: Ters Ozmos Membran Filtre – 5 angstrom gözenek çapına sahiptir. İlk 3 aşamada kaba tortu ve partiküllerden ayrıştırılan suyu detaylı arıtmaya hazır hale getirir. İlk 3 filtrenin asıl amacı membran filtresinin işini kolaylaştırmak ve ömrünü uzatmaktır. Özel yapım membran filtre olan LG membran filtre, suyun alkali seviyesinde neredeyse hiçbir değişiklik yapmaz. Arıtmanın en önemli aşamasıdır. Cihazın ana filtresi olan membran filtre, yarı geçirgen bir zar gibi hareket eder. Bitkilerin topraktan suyu emdiği gibi suyun içerisinden sadece yararlı maddelerin geçmesine izin verir. Tamamen doğaldır. Yüksek basınçla içinden sadece suyu geçirirken, mikron boyutunda suda var olan zararlı bakterileri, kireci, tortuyu, pası, asbesti, partikülleri ve ağır metalleri tamamen arıtır.

• Aşama: Hindistan Cevizi Kabuğu Filtre – Arıtılmış su, tanktan musluğa giderken, son kez Hindistan cevizi kabuğu filtreden geçer. Bu aşama, suyun mineral açısından zenginleşmesini sağlar.

• Aşama: Alkalin-Mineral filtre (opsiyonel)

ALKALİ SUYUN FAYDALARI 

Daha fazla oksijene sahip sağlıklı ve fonksiyonel sudur. Temiz ve bakterisizdir. İçindeki alkali minerallerin yanı sıra diğer su çeşitlerine göre daha fazla oksijene sahiptir. Negatif ORP değerlerine ve güçlü antioksidan özelliğe sahiptir. Alkali iyonize su antioksidan özelliğe sahiptir. Küçük moleküler küme yapısına sahip bir sıvı olarak diğer antioksidanlara göre vücut tarafından çok daha hızlı ve kolayca emilir. Vücudun pH dengesini korumasına yardım eder ve hastalıkları önler . Alkali iyonize su vücudun doğal pH dengesini korumasına ve düzenlemesine yardımcı olur ve vücutta zararlı bakteri iltihaplanma ve hastalıkların oluşumunu engelleyen bir ortam yaratır. Olağanüstü hidrasyon (nemlendirme)ve detoks sağlar. Moleküler yapısı diğer sulardan daha küçüktür. Bu nedenle hücrelerin içine diğer su çeşitlerine göre altı katına kadar fazla su girişi sağlar ve vücudun daha fazla nemlenmesine ve vücudun zehirli atıklardan en hızlı ve mükemmel şekilde temizlenmesine yardımcı olur. Vücudun enerjisini ve zindeliğini artırır. Alkali iyonize su küçük moleküler yapısı nedeniyle vücudun biyo-elektriksel dengesini diğer su çeşitlerine göre üç kat daha hızlı yenileyerek vücudun enerjisini ve zindeliğini artırır.

Ölçüler

En: 29 cm

Boy: 38 cm

Yükseklik: 39 cm', '12” 5 mic. Inline Sediment Filtre

12” Inline GAC Karbon Filtre

12” Inline Blok Karbon Filtre

Son (post) Karbon Filtre

75 GPD  Membran Filtre

Diğer Ekipmanl...', 19790, NULL, 10, 4.8, 105, '["Aşama: Alkalin-Mineral filtre (opsiyonel)"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Referans Kodu":"H2O SERİES","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'OR-115 ARITMALI SEBİL', 'wg-115-sebil', 'AQ-8053277294637', 'Ev ve Ofis İçin OR-115 Su Sebili

 

OR-115 model su sebili, hem ev hem de ofis ortamları için ideal bir çözüm sunarak sıcak ve soğuk su ihtiyaçlarını karşılamanın yanında gelişmiş su arıtma sistemiyle sağlıklı ve güvenilir içme suyu deneyimi sunar. Modern tasarımı, dayanıklı yapısı ve dijital kontrol özellikleriyle kullanıcı konforunu üst seviyeye taşır.

 

Teknik Özellikler:
 • Elektrik Tüketimi (Sıcak): 500-600W
 • Elektrik Tüketimi (Soğuk): 110W
 • Soğuk Su Derece Aralığı: 6-8 °C
 • Ürün Tipi: Tam Boy Su Sebili
 • Ürün Ölçüleri:
 • Yükseklik: 113 cm
 • Genişlik: 38 cm
 • Derinlik: 28 cm
 • Voltaj: 220V-240V
 • Suyun Temas Ettiği Bağlantılar: Paslanmaz Çelik Aksam
 • Kontrol Paneli: Dijital Dokunmatik Ekran

 

Gelişmiş Arıtma Sistemi:
 • 5 Aşamalı Filtrasyon Sistemi
 • 80 GPD Aquails Membran
 • Sediment Filtre
 • GAC Karbon Filtre
 • CTO Blok Karbon Filtre
 • 1050 Iodine Post Carbon Filtre

 

Soğutma Özellikleri:
 • Soğutma Tipi: Çevre dostu R134a kompresörlü soğutucu
 • Soğutma Kapasitesi: 2.0 Litre/Saat
 • Soğuk Su Tank Malzemesi: 304 Kalite Paslanmaz Çelik

 

Tank Kapasiteleri:
 • Sıcak Su Tank Kapasitesi: 2.0 Litre
 • Soğuk Su Tank Kapasitesi: 3.0 Litre
 • Harici Tank: 8 Litre opsiyonel seçenek

 

Avantajları:
 • Gelişmiş Filtrasyon Teknolojisi: 5 aşamalı filtre sistemi sayesinde daha temiz, sağlıklı ve kaliteli içme suyu sağlar.
 • Dijital Kullanım Konforu: Dokunmatik ekran ile sıcaklık ve kullanım kontrolü kolayca yönetilebilir.
 • Çevre Dostu Tasarım: Enerji tasarruflu ve çevre dostu R134a gazlı kompresör.
 • Dayanıklı Malzeme: Suyun temas ettiği tüm yüzeyler 304 kalite paslanmaz çelikten üretilmiştir.
 • Dengeli Tank Kapasitesi: 3 litrelik soğuk su ve 2 litrelik sıcak su kapasitesiyle günlük kullanım için ideal performans sunar.
 • Kompakt Boyutlar: Alan tasarrufu sağlayan modern tasarım sayesinde dar alanlarda rahat kullanım sunar.

 

Kullanım Alanları:
 • Evlerde günlük sağlıklı su tüketimi için
 • Ofislerde çalışanların sıcak-soğuk su ihtiyacı için
 • Küçük işletmelerde pratik ve hijyenik su çözümü sağlamak için

 

Model: OR-115

 

OR-115; gelişmiş filtreleme sistemi, dijital dokunmatik ekranı, yüksek performanslı soğutma sistemi ve şık tasarımıyla her ortam için modern, güvenilir ve uzun ömürlü bir su arıtmalı sebil çözümü sunar.', 'Ev ve Ofis İçin OR-115 Su Sebili

 

OR-115 model su sebili, hem ev hem de ofis ortamları için ideal bir çözüm sunarak sıcak ve soğuk su ihtiyaçlarını karşılama...', 138000, NULL, 10, 4.8, 157, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('0186e795-3ad2-4037-a3ba-a515329ba552', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'OR-351 ARITMALI SEBİL', 'wg-115-sebil-kopya', 'AQ-8090262011949', 'Bu ileri teknolojili su arıtma sistemi, suyunuzu en saf ve kaliteli hale getirerek her yudumda sağlığı ve lezzeti bir araya getirir. 5 aşamalı filtrasyon sistemi ve yenilikçi özellikleriyle hem ev hem de ofis kullanımı için ideal bir çözüm sunar.

Filtrasyon Aşamaları:
 1. 10” Inline Sediment Filtre: Suda bulunan tortu, kum, çamur gibi büyük partikülleri etkili bir şekilde uzaklaştırır.
 2. 10” Inline GAC Karbon Filtre: Sudaki kötü tat, koku ve klor gibi kimyasal kirleticileri gidererek daha temiz bir su sağlar.
 3. Post Karbon Filtre: Suya mükemmel bir lezzet kazandırır ve son aşamada kalıntıları filtreler.
 4. Kapsül Membran Filtre: Yüksek verimle suyunuzu mikroskobik düzeyde arıtarak, bakteriler ve zararlı maddelerden arındırır.
 5. Platinium Pompa: Suyun ideal basınçla arıtılmasını sağlayarak üstün performans sunar.

Teknik Özellikler:
 • Voltaj: 220V – 240V
 • Soğutma Gücü: 277W
 • Soğuk Su Kapasitesi: 4 litre (serinletici ve taze su keyfi için)
 • Sıcak Su Kapasitesi: 1,5 litre (çay ve kahve için anında sıcak su)
 • Bağlantı Sistemi: Quick Fittings ile kolay montaj ve bakım
 • Opsiyonel Tank: 6 litre kapasiteli ek tank seçeneği
 • Adaptör: Cihazla uyumlu yüksek güvenlikli adaptör

Avantajlar:
 • Tam Zamanlı Su Kalitesi: 5 aşamalı filtrasyon sistemiyle her zaman temiz ve sağlıklı su sağlar.
 • Enerji Verimliliği: 277W soğutma kapasitesiyle düşük enerji tüketimi.
 • Kompakt ve Şık Tasarım: Her ortama uyum sağlayan estetik görünüm.
 • Esnek Kullanım: Opsiyonel tank seçeneğiyle farklı ihtiyaçlara kolayca adapte olur.
 • Kolay Montaj ve Bakım: Quick Fittings bağlantı sistemiyle kullanıcı dostu yapı.

Kullanım Alanları:
 • Evlerde temiz içme suyu sağlamak için
 • Ofislerde çalışanların ihtiyacını karşılamak
 • Küçük işletmelerde içme suyu çözümleri için', 'Bu ileri teknolojili su arıtma sistemi, suyunuzu en saf ve kaliteli hale getirerek her yudumda sağlığı ve lezzeti bir araya getirir. 5 aşamalı filtrasyon sistem...', 112000, NULL, 10, 4.5, 169, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'ORT-600 / 600 GPD DİREK AKIŞ SU ARITMA CİHAZI', 'ort-600-ro', 'AQ-8053267136557', 'Aquails Endüstriyel Su Arıtma Cihazı

Aquails, endüstriyel su arıtma alanında güvenilir ve kaliteli çözümler sunan lider bir markadır. Aquails Endüstriyel Su Arıtma Cihazı, özellikle günlük su tüketimi yüksek olan işletmeler için hem sağlık hem de ekonomik açıdan mükemmel bir tercihtir. Yüksek kapasiteli, düşük maliyetli bu cihaz, suyun kalitesini ve tadını iyileştirirken, kloru %99 oranında azaltır. Ayrıca, damak tadına rahatsızlık veren kötü koku ve tortuları ortadan kaldırarak, suyunuzu hem sağlıklı hem de lezzetli hale getirir.

Aquails su arıtma cihazı, suyunuzdaki kurşun, bakır, baryum, krom, cıva, klorür, nitrat, nitrit, selenyum ve kadmiyum gibi zararlı kirleticileri etkili bir şekilde temizler, böylece suyunuzu yumuşatarak, daha sağlıklı bir içme suyu sağlar. Aquails’ın sunduğu bu güvenilir çözümle, işletmenizde su kalitesini artırabilir ve suyunuzu en verimli şekilde kullanabilirsiniz.

Yüksek Kapasite ve Ekonomik Tasarruf ile Aquails Farkı

Aquails Endüstriyel Su Arıtma Cihazı, 24 saat boyunca 1500-2000 litre su arıtma kapasitesine sahiptir. Bu kapasite, işletmelerinizin günlük 80-100 damacana su ihtiyacını rahatlıkla karşılayarak ekonomik anlamda büyük tasarruf sağlamanızı destekler. Aquails, yüksek verimlilikle düşük maliyetli su arıtma çözümleri sunarak, işletmenizin bütçesini korur ve uzun vadede ekonomik fayda sağlar.

Aquails Endüstriyel Su Arıtma Cihazı Tank Seçimi

Aquails, cihazını daha verimli kullanabilmeniz için, 600 GPD kapasitesine sahip, direkt akışlı bir sistem sunmaktadır. Pompa (motor) ömrünü uzatmak ve cihazın verimli çalışmasını sağlamak için, 40 litre veya 80 litre su tankı seçimi önerilmektedir. Bu tanklarda depolanan içme suyu sayesinde, arıtma işlemi tamamlanmadan, kesintisiz bir şekilde suyunuzu kullanabilirsiniz. Aquails’ın sunduğu bu tank seçenekleri, işletmenizde sürekli su temini sağlayarak iş akışınızı kesintisiz hale getirir.

Filtre Değişim Süreleri ve Aquails Kalitesi

Aquails Endüstriyel Su Arıtma Cihazı’nın ilk üç filtresi, şebeke suyundaki tortu, çamur ve kaba pislikleri etkili bir şekilde temizler. Bu filtreler, hızlı bir şekilde tıkanabileceği için, ortalama 6-9 ayda bir değiştirilmeleri tavsiye edilir.

Cihazda kullanılan 3 adet 200 GPD membran filtre ve 1 adet tatlandırıcı karbon filtre, şebeke suyunun kirlilik oranına ve kullanım sıklığına bağlı olarak daha uzun süre dayanır. Ortalama olarak, bu filtrelerin 18-24 ayda bir değiştirilmesi tavsiye edilir. Aquails, yüksek kaliteli filtrelerle, uzun süreli kullanım ve yüksek verimlilik sunar.

Aquails Endüstriyel Su Arıtma Cihazı Özellikleri

• 3 Adet 200 GPD Membran

• 1 Adet 20” İnch Sediment Filtre

• 1 Adet 20” İnch Granül Aktif Karbon Filtre

• 1 Adet 20” İnch Blok Karbon Filtre

• 1 Adet 2,5 İnch İnline Tatlandırıcı Hindistan Cevizi Karbon Filtre

• 36 V GPD Pompa

• 600 GPD Adaptör

• Avrupa Musluk

Tüm filtreler ve yan ürünler cihaz içeriğinde bulunmaktadır.

Aquails’ın Güvenilirliği ile Tanışın

Aquails, endüstriyel su arıtma sistemlerinde kaliteyi ön planda tutarak, işletmelere güvenilir ve etkili çözümler sunmaktadır. Aquails Endüstriyel Su Arıtma Cihazı ile suyunuzu en yüksek kalitede arıtın ve işletmenizde sağlıklı su kullanımını garanti altına alın.

Cihaz Ölçüleri

• 
En: 29 cm

• 
Boy: 46 cm

• 
Yükseklik: 77 cm', 'Aquails Endüstriyel Su Arıtma Cihazı

Aquails, endüstriyel su arıtma alanında güvenilir ve kaliteli çözümler sunan lider bir markadır. Aquails Endüstriyel Su Ar...', 99000, NULL, 10, 4.9, 97, '["3 Adet 200 GPD Membran","1 Adet 20” İnch Sediment Filtre","1 Adet 20” İnch Granül Aktif Karbon Filtre","1 Adet 20” İnch Blok Karbon Filtre","1 Adet 2,5 İnch İnline Tatlandırıcı Hindistan Cevizi Karbon Filtre","36 V GPD Pompa","600 GPD Adaptör","Avrupa Musluk"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Referans Kodu":"600-GPD","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('b70c7547-fb29-4662-af97-72eaf5584326', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'ORT-300 / 300 GPD DİREK AKIŞ SU ARITMA CİHAZI', 'aquails-ort-300-ro-sistem', 'AQ-8053271199789', 'Aquails RO-300 Reverse Osmosis Su Arıtma Sistemi

Aquails, su arıtma teknolojilerindeki liderliğini, RO-300 Reverse Osmosis Su Arıtma Sistemi ile bir adım daha ileriye taşıyor. Hem ticari hem de ev kullanımı için mükemmel bir çözüm sunan Aquails, suyunuzu sadece arıtmakla kalmaz, aynı zamanda kalitesini ve tadını da iyileştirir. Aquails RO-300, günlük 1000 litre su arıtma kapasitesine sahip, ekonomik ve verimli bir su arıtma cihazıdır.

İmalathaneler, restoranlar, gıda endüstrisi tesisleri, alışveriş merkezleri, okullar ve oteller gibi yüksek su tüketimi olan işletmeler için özel olarak tasarlanmış olan bu sistem, suyunuzu sağlıklı, lezzetli ve kaliteli hale getirir. Aquails''ın güvenilir ve ileri teknoloji ürünleriyle suyunuzdaki zararlı kirleticileri etkili bir şekilde süzer, hem ekonominizi hem de sağlığınızı korur.

Aquails RO-300 Su Arıtma Sistemi Özellikleri:

• 
2 Adet 20″ Mat Mavi Housing: Yüksek dayanıklılık ve uzun ömürlü performans sağlar.

• 
1 Adet 20” Şeffaf Housing: Filtrelerin durumu hakkında kolayca görsel bilgi almanızı sağlar.

• 
3 x 100 GPD Membran: Yüksek verimli 300 GPD kapasite ile suyunuzu etkili bir şekilde arıtır.

• 
Çalışma Basıncı: 10-125 PSI aralığında, çeşitli su basınçlarına uyum sağlayarak optimum performans gösterir.

• 
300 GPD Pompa ve Adaptör: Yüksek debi sağlayarak suyun verimli bir şekilde arıtılmasını mümkün kılar.

• 
Lüks Paslanmaz Musluk: Şık tasarımıyla kullanımı kolay ve dayanıklıdır.

Filtreleme Aşamaları:

• 
Aşama: 5 Mikron Spun Filtre – Gözle görülebilen kiri, pası ve kum parçacıklarını giderir, suyun temizlenmesini başlatır.

• 
Aşama: Blok Karbon Filtre – Klor ve organik kimyasalların %99’unu giderir, suyun tadını ve kokusunu iyileştirir.

• 
Aşama: 1 Mikron Spun Filtre – Membrandan önce suyu 1 mikron seviyesinde süzerek cihazın ömrünü uzatır.

• 
Aşama: 300 GPD RO Membran Filtre – Mikrobiyolojik ve kimyasal arıtım yaparak, ağır metaller, mineraller ve zararlı maddeleri molekül seviyesinde temizler, suyu sağlıklı, yumuşak ve mineral dengeli hale getirir.

• 
Aşama: Inline Post Karbon Filtre – Hindistan cevizi kabuğundan üretilmiştir, suya tatlı bir tat katar ve içim kalitesini artırır.

Teknik Özellikler ve Performans:

• 
Membran Kapasitesi: 300 GPD / 1000 litre (günde yaklaşık 1 ton su arıtma kapasitesi).

• 
Depolama Tankı Hacmi: Opsiyonel (ihtiyaca göre haricen satın alınabilir).

• 
Çalışma Basıncı Aralığı: 0,68-8,6 bar.

• 
Elektrik Beslemesi: 110 Volt, 220 Volt veya 240 Volt (50/60 Hz).

• 
Ağırlık: 42 kg (sistem ve tank).

• 
Verim: %50 (reverse osmosis sistemlerine giren suyun %50''si üretime, %50''si atık hale gelir).

Cihaz Ölçüleri:

• 
En: 24 cm

• 
Boy: 50 cm

• 
Yükseklik: 80 cm

Aquails ile Güvenli, Sağlıklı ve Lezzetli Su

Aquails, su arıtma teknolojisinin öncüsü olarak, hem ticari hem de evsel kullanım için ideal çözümler sunmaktadır. RO-300 Reverse Osmosis Su Arıtma Sistemi, Aquails’ın güvenilir ve yüksek kaliteli teknolojisinin bir örneğidir. Suyunuzu sadece arıtarak değil, aynı zamanda ona mineral dengesini kazandırarak sağlıklı ve içimi keyifli hale getirir. İster evinizde, ister işletmenizde, Aquails ürünleriyle suyun kalitesini her zaman bir adım ileriye taşıyın.', 'Aquails RO-300 Reverse Osmosis Su Arıtma Sistemi

Aquails, su arıtma teknolojilerindeki liderliğini, RO-300 Reverse Osmosis Su Arıtma Sistemi ile bir adım daha ...', 84900, NULL, 10, 4.7, 89, '["2 Adet 20″ Mat Mavi Housing: Yüksek dayanıklılık ve uzun ömürlü performans sağlar.","1 Adet 20” Şeffaf Housing: Filtrelerin durumu hakkında kolayca görsel bilgi almanızı sağlar.","3 x 100 GPD Membran: Yüksek verimli 300 GPD kapasite ile suyunuzu etkili bir şekilde arıtır.","Çalışma Basıncı: 10-125 PSI aralığında, çeşitli su basınçlarına uyum sağlayarak optimum performans gösterir.","300 GPD Pompa ve Adaptör: Yüksek debi sağlayarak suyun verimli bir şekilde arıtılmasını mümkün kılar.","Lüks Paslanmaz Musluk: Şık tasarımıyla kullanımı kolay ve dayanıklıdır.","Aşama: Blok Karbon Filtre – Klor ve organik kimyasalların %99’unu giderir, suyun tadını ve kokusunu iyileştirir.","Aşama: 1 Mikron Spun Filtre – Membrandan önce suyu 1 mikron seviyesinde süzerek cihazın ömrünü uzatır."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Referans Kodu":"300-GPD","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('af6d8df9-6881-4b6f-a27a-af9af5c4677f', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'ORT-100(SOFT-MİDİ)', 'ort-100midi', 'AQ-8053266612269', 'Su yumuşatma işlemi iyon değiştirme yöntemiyle gerçekleşmektedir.

İyon değişimi sertliğe sebep olan kalsiyum ve magnezyum iyonlarını içeren suyun,

 sodyum formunda katyonik bir reçineden geçirilmesi suretiyle gerçekleşmektedir.

 YUMUŞATMA SİSTEMLERİ

Su yumuşatma işlemi iyon değiştirme yöntemiyle gerçekleşmektedir.

 İyon değişimi sertliğe sebep olan kalsiyum ve magnezyum iyonlarını içeren suyun,

 sodyum formunda katyonik bir reçineden geçirilmesi suretiyle gerçekleşmektedir.

 Sert su sodyum bazlı katyonik reçineden geçerken içerisindeki sertlik iyonları (Ca+2 ve Mg+2) ;

reçineye bağlı bulunan Na+ iyonları ile yer değiştirir.

 Belli miktarda sert su reçine yatağından geçtikten sonra, reçine tanecikleri tamamıyla,

 sertlik mineralleriyle kaplanır. Bu durumda sertlik minerallerinin tutulması son bulur.

 Sertlik iyonlarının tekrar sudan tutulabilmesi için reçine taneciklerinin sertlik minerallerinden

 kurtarılarak tekrar sodyum taneciklerinin bağlanması gereklidir. Bu işleme ‘rejenerasyon’ adı verilir.

 Rejenerasyon işlemi, geri yıkama, tuzlu su emiş, yavaş durulama, hızlı durulama ve tuzlu su dolum olmak üzere 5 ana aşamadan oluşmaktadır.

 5 aşamanın tamamlanması sonucu reçine, kalsiyum (Ca2+) ve Magnezyum (Mg2+) iyonlarını bırakırken,

 sodyum (Na+) iyonlarını tekrar kendine bağlar ve servis pozisyonuna hazır hale gelir.

 Su Yumuşatma Ünitelerinin dizaynı yapılırken reçine tankı içine yerleştirilecek olan reçine miktarı ham su karakterine,

 günlük ortalama debi ve pik su tüketimlerine bağlı olarak hesaplanır.

 Ayrıca rejenerasyon işlemi, zaman kontrollü, debi kontrollü veya sertlik analizörü ile

 çıkış suyu sertlik derecesi ölçümüne bağlı olarak otomasyonlu olarak sağlanabilmektedir.

 Ev ve küçük kullanımlar İçin kompakt yapıda.

 Tam otomatik zaman kontrollü otomasyon valfli.

 220 Volt, 50 Hz elektrik beslemeli.

 1” Tesisat bağlantılı; 2 - 7 bar işletme basıncında.

 4 - 50 °C Arasında kullanım özelliğine sahip.

 Polietilen kabinetli, fiberglas polietilen mineral tanklıdır.

suda bulunan ve sertliğe neden olan Kasiyum (Ca) ve Magnezyum (Mg) iyonlarını gideren sistemlerdir.

Natural Water S-4  Kabinetli Tam Otomatik Su Yumuşatma Sistemleri ile; sudaki kalsiyum ve magnezyum iyonları iyon değiştirme yöntemiyle giderilir.

Yumuşatma sistemleri zamansal periyot olarak haftanın istenilen gününde, istenilen saatte herhangi bir müdahale olmaksızın rejenerasyon işlemlerini kendiliğinden gerçekleştirir.

Doyuma ulaşan reçine zaman kontrollü olarak tuzlu su ile rejenerasyona girerek, kalsiyum ve magnezyum iyonlarından temizlenir.

İlser Su Arıtma Teknolojileri güvencesiyle sahip olabilirsiniz.

 Standart Özellikler

• Sudan Etkilenmeyen FRP veya Boyalı Karbon Çelik Gövde

• Tam Otomatik Otomasyon Sistemi

• Kullanıma Uygun Model

• Üstün Nitelikli Mineraller

• İnsan Müdahalesiz Minimum Bakım

• Düşük Enerji ve İşletme Maliyeti

• 10 Bar Tank Test Basıncı

• 2 - 7 Bar Çalışma Aralığı

• Max 50 °C Çalışma Sıcaklığı', 'Su yumuşatma işlemi iyon değiştirme yöntemiyle gerçekleşmektedir.

İyon değişimi sertliğe sebep olan kalsiyum ve magnezyum iyonlarını içeren suyun,

 sodyum for...', 119900, NULL, 10, 4.9, 129, '["Sudan Etkilenmeyen FRP veya Boyalı Karbon Çelik Gövde","Tam Otomatik Otomasyon Sistemi","Kullanıma Uygun Model","Üstün Nitelikli Mineraller","İnsan Müdahalesiz Minimum Bakım","Düşük Enerji ve İşletme Maliyeti","10 Bar Tank Test Basıncı","2 - 7 Bar Çalışma Aralığı"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('84e5d59f-1973-4fd7-a1fc-f75a02e01627', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'ORT-150(SOFTMAX-MAXİ)', 'ort-150maxi', 'AQ-8053266972717', 'İÇERİK HAZIRLANIYOR…', 'İÇERİK HAZIRLANIYOR…', 147000, NULL, 10, 4.7, 37, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails TRİO CLEAN 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ', 'aquails-trio-clean-10-3-lu-bina-giris-filtrasyon-aritma-sistemi', 'AQ-8335644983341', 'DAİRE GİRİŞİ SU ÖN FİLTRASYON SİSTEMİ

Daire girişi için tasarlanmış ön filtrasyon sistemi dairenizde kullanılan tüm suyu yabancı maddelerden, kireç, klor ve sertlik verici kimyasal maddelerden ve kirleticilerden arındırır. Suyu yumuşatmak için kullanılır. Dairenizdeki tüm su tesisatının boruları, vanaları, bağlantı parçalarını, musluk ve armatürleri, kalorifer peteklerini suyla çalışan beyaz eşyaları korur. Oluşabilecek korozyonu önleyerek daha uzun ömürlü olmalarını sağlar. Suyun sertliği giderildiğinden duş aldığınızda saçlarınızı ve cildinizi kireçli ve klorlu suyun oluşturabileceği zararlardan korur. Isıtma sisteminde kullanılan suyun sertliği azaldığından ısınma giderlerini düşürür ve ekonomik kazanç sağlar. Kullandığınız sabun ve deterjanların çözücü etkilerini artırarak temizlik giderlerinizi düşürür. Kuyu suyu kullanılan yerler için kesinlikle kullanılması tavsiye edilir.

• Aşama: 10″ 5 Mikron Filtre –

Sularda askıda bulunan katı maddeler (tortu, kum, çamur v.s.) bulanıklık oluşturur. Askıdaki katı maddelerin oluşturduğu kirliliği ve bulanıklığı gidermek için kullanılan bu filtreler suda bulunan her türlü partikül, kir, tortu, kum ve diğer kaba kirleticileri filtre eder ve suyu berraklaştırır. 5 mikron sediment filtrenin, ortalama 6 ayda bir değiştirilmesi tavsiye edilir. Kuyu suyu kullanıyorsanız veya şebeke suyunuzda gözle görülür derecede bulanıklık mevcutsa, diğer filtrelerin korunması için üç ayda bir değiştirilmesi yararınıza olacaktır.

• Aşama: 10″ Granül Aktif Karbon Filtresi –

Suda bulunan klor, renk, tat ve koku veren eriyik gazlar, artıklar ve organik maddelerin arıtımı için kullanılır. Bu aktif granül karbon filtre yüksek performanslı aktive edilmiş karbondan oluşur. Suyu klorin, koku, organik kirleticiler, böcek ilaçları ve koku ile tadı etkileyen kimyasallardan arındırır.

• Aşama: Kireç Önleyici Filtre –

Sudaki kirecin zararlı etkilerini %50 oranında engelleyen filtredir.

Bu sistemi kullanmanız size şunları kazandırır:

1.Tüm musluklarınızdan her zaman tertemiz su akacak şebekeden gelen çamurlu su görüntüleriyle karşılaşmazsınız.

• Evinizde kullandığınız suyla çalışan tüm sistemlerinizi kurur ve daha uzun ömürlü olmalarını sağlar. Kombi, bulaşık ve çamaşır makinesi ve bina tesisatının daha uzun ömürlü olmasını sağlar

3.Kuyu suyu kullanıyorsanız mutlak kullanmanız tavsiye edilir.

4.Depo kullanıyorsanız zamanla deponun tabanına çöken tortuları ve pislikleri filtre etmiş olursunuz.

5.Suyunuz daha yumuşak olacağı için ısıtmada %20 tasarruf sağlarsınız.', 'DAİRE GİRİŞİ SU ÖN FİLTRASYON SİSTEMİ

Daire girişi için tasarlanmış ön filtrasyon sistemi dairenizde kullanılan tüm suyu yabancı maddelerden, kireç, klor ve se...', 49900, 55900, 10, 4.9, 121, '["Aşama: 10″ 5 Mikron Filtre –","Aşama: 10″ Granül Aktif Karbon Filtresi –","Aşama: Kireç Önleyici Filtre –"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, 'discount', 11, TRUE),
  ('7b8b2640-daab-4a3d-a80f-cf0c2fa66487', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ', 'aquails-h2o-green-plus-su-aritma-sistemi-1', 'AQ-8053270249517', 'DAİRE GİRİŞİ SU ÖN FİLTRASYON SİSTEMİ

Daire girişi için tasarlanmış ön filtrasyon sistemi dairenizde kullanılan tüm suyu yabancı maddelerden, kireç, klor ve sertlik verici kimyasal maddelerden ve kirleticilerden arındırır. Suyu yumuşatmak için kullanılır. Dairenizdeki tüm su tesisatının boruları, vanaları, bağlantı parçalarını, musluk ve armatürleri, kalorifer peteklerini suyla çalışan beyaz eşyaları korur. Oluşabilecek korozyonu önleyerek daha uzun ömürlü olmalarını sağlar. Suyun sertliği giderildiğinden duş aldığınızda saçlarınızı ve cildinizi kireçli ve klorlu suyun oluşturabileceği zararlardan korur. Isıtma sisteminde kullanılan suyun sertliği azaldığından ısınma giderlerini düşürür ve ekonomik kazanç sağlar. Kullandığınız sabun ve deterjanların çözücü etkilerini artırarak temizlik giderlerinizi düşürür. Kuyu suyu kullanılan yerler için kesinlikle kullanılması tavsiye edilir.

• Aşama: 10″ 5 Mikron Filtre –

Sularda askıda bulunan katı maddeler (tortu, kum, çamur v.s.) bulanıklık oluşturur. Askıdaki katı maddelerin oluşturduğu kirliliği ve bulanıklığı gidermek için kullanılan bu filtreler suda bulunan her türlü partikül, kir, tortu, kum ve diğer kaba kirleticileri filtre eder ve suyu berraklaştırır. 5 mikron sediment filtrenin, ortalama 6 ayda bir değiştirilmesi tavsiye edilir. Kuyu suyu kullanıyorsanız veya şebeke suyunuzda gözle görülür derecede bulanıklık mevcutsa, diğer filtrelerin korunması için üç ayda bir değiştirilmesi yararınıza olacaktır.

• Aşama: 10″ Granül Aktif Karbon Filtresi –

Suda bulunan klor, renk, tat ve koku veren eriyik gazlar, artıklar ve organik maddelerin arıtımı için kullanılır. Bu aktif granül karbon filtre yüksek performanslı aktive edilmiş karbondan oluşur. Suyu klorin, koku, organik kirleticiler, böcek ilaçları ve koku ile tadı etkileyen kimyasallardan arındırır.

• Aşama: Kireç Önleyici Filtre –

Sudaki kirecin zararlı etkilerini %50 oranında engelleyen filtredir.

Bu sistemi kullanmanız size şunları kazandırır:

1.Tüm musluklarınızdan her zaman tertemiz su akacak şebekeden gelen çamurlu su görüntüleriyle karşılaşmazsınız.

• Evinizde kullandığınız suyla çalışan tüm sistemlerinizi kurur ve daha uzun ömürlü olmalarını sağlar. Kombi, bulaşık ve çamaşır makinesi ve bina tesisatının daha uzun ömürlü olmasını sağlar

3.Kuyu suyu kullanıyorsanız mutlak kullanmanız tavsiye edilir.

4.Depo kullanıyorsanız zamanla deponun tabanına çöken tortuları ve pislikleri filtre etmiş olursunuz.

5.Suyunuz daha yumuşak olacağı için ısıtmada %20 tasarruf sağlarsınız.', 'DAİRE GİRİŞİ SU ÖN FİLTRASYON SİSTEMİ

Daire girişi için tasarlanmış ön filtrasyon sistemi dairenizde kullanılan tüm suyu yabancı maddelerden, kireç, klor ve se...', 27900, NULL, 10, 4.5, 177, '["Aşama: 10″ 5 Mikron Filtre –","Aşama: 10″ Granül Aktif Karbon Filtresi –","Aşama: Kireç Önleyici Filtre –"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('edb49685-aece-4fef-a95d-845197acc542', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails 20" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ', 'aquails-20-3-lu-bina-giris-filtrasyon-aritma-sistemi-kopya', 'AQ-8103853850669', 'DAİRE GİRİŞİ SU ÖN FİLTRASYON SİSTEMİ

Daire girişi için tasarlanmış ön filtrasyon sistemi dairenizde kullanılan tüm suyu yabancı maddelerden, kireç, klor ve sertlik verici kimyasal maddelerden ve kirleticilerden arındırır. Suyu yumuşatmak için kullanılır. Dairenizdeki tüm su tesisatının boruları, vanaları, bağlantı parçalarını, musluk ve armatürleri, kalorifer peteklerini suyla çalışan beyaz eşyaları korur. Oluşabilecek korozyonu önleyerek daha uzun ömürlü olmalarını sağlar. Suyun sertliği giderildiğinden duş aldığınızda saçlarınızı ve cildinizi kireçli ve klorlu suyun oluşturabileceği zararlardan korur. Isıtma sisteminde kullanılan suyun sertliği azaldığından ısınma giderlerini düşürür ve ekonomik kazanç sağlar. Kullandığınız sabun ve deterjanların çözücü etkilerini artırarak temizlik giderlerinizi düşürür. Kuyu suyu kullanılan yerler için kesinlikle kullanılması tavsiye edilir.

• Aşama: 10″ 5 Mikron Filtre –

Sularda askıda bulunan katı maddeler (tortu, kum, çamur v.s.) bulanıklık oluşturur. Askıdaki katı maddelerin oluşturduğu kirliliği ve bulanıklığı gidermek için kullanılan bu filtreler suda bulunan her türlü partikül, kir, tortu, kum ve diğer kaba kirleticileri filtre eder ve suyu berraklaştırır. 5 mikron sediment filtrenin, ortalama 6 ayda bir değiştirilmesi tavsiye edilir. Kuyu suyu kullanıyorsanız veya şebeke suyunuzda gözle görülür derecede bulanıklık mevcutsa, diğer filtrelerin korunması için üç ayda bir değiştirilmesi yararınıza olacaktır.

• Aşama: 10″ Granül Aktif Karbon Filtresi –

Suda bulunan klor, renk, tat ve koku veren eriyik gazlar, artıklar ve organik maddelerin arıtımı için kullanılır. Bu aktif granül karbon filtre yüksek performanslı aktive edilmiş karbondan oluşur. Suyu klorin, koku, organik kirleticiler, böcek ilaçları ve koku ile tadı etkileyen kimyasallardan arındırır.

• Aşama: Kireç Önleyici Filtre –

Sudaki kirecin zararlı etkilerini %50 oranında engelleyen filtredir.

Bu sistemi kullanmanız size şunları kazandırır:

1.Tüm musluklarınızdan her zaman tertemiz su akacak şebekeden gelen çamurlu su görüntüleriyle karşılaşmazsınız.

• Evinizde kullandığınız suyla çalışan tüm sistemlerinizi kurur ve daha uzun ömürlü olmalarını sağlar. Kombi, bulaşık ve çamaşır makinesi ve bina tesisatının daha uzun ömürlü olmasını sağlar

3.Kuyu suyu kullanıyorsanız mutlak kullanmanız tavsiye edilir.

4.Depo kullanıyorsanız zamanla deponun tabanına çöken tortuları ve pislikleri filtre etmiş olursunuz.

5.Suyunuz daha yumuşak olacağı için ısıtmada %20 tasarruf sağlarsınız.', 'DAİRE GİRİŞİ SU ÖN FİLTRASYON SİSTEMİ

Daire girişi için tasarlanmış ön filtrasyon sistemi dairenizde kullanılan tüm suyu yabancı maddelerden, kireç, klor ve se...', 29990, NULL, 10, 4.4, 149, '["Aşama: 10″ 5 Mikron Filtre –","Aşama: 10″ Granül Aktif Karbon Filtresi –","Aşama: Kireç Önleyici Filtre –"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('56961781-fef1-4912-a810-7566b1a3badd', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'OR-50 Sebil', 'wg-50-sebil', 'AQ-8053277360173', 'İÇERİK HAZIRLANIYOR…', 'İÇERİK HAZIRLANIYOR…', 135000, NULL, 10, 4.3, 193, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('e2ec33f9-b103-4e25-a136-903becdfa275', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'OR-80 Sebil', 'wg-80-sebil', 'AQ-8053277425709', 'İÇERİK HAZIRLANIYOR…', 'İÇERİK HAZIRLANIYOR…', 155000, NULL, 10, 4.8, 149, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('198c87c1-0c41-47dd-a84a-dface4feeac4', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Water chef filtreler', 'water-chef-filtreler', 'AQ-8053274771501', 'Aşama: 5 Mikron Sediment ve Granül aktif karbon Filtre – Sediment Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar. Granül Aktif Karbon Filtre 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir. Aşama: RO Membran Filtre – 5 angstron gözenek çapına sahiptir. İlk  aşamada kaba tortu ve partiküllerden ayrıştırılan suyu detaylı arıtmaya hazır hale getirir. İlk  filtrenin asıl amacı membran filtresinin işini kolaylaştırmak ve ömrünü uzatmaktır. Özel yapım membran filtre olan membran filtre, suyun alkali seviyesinde neredeyse hiçbir değişiklik yapmaz. Arıtmanın en önemli aşamasıdır. Cihazın ana filtresi olan membran filtre, yarı geçirgen bir zar gibi hareket eder. Bitkilerin topraktan suyu emdiği gibi suyun içerisinden sadece yararlı maddelerin geçmesine izin verir. Tamamen doğaldır. Yüksek basınçla içinden sadece suyu geçirirken, mikron boyutunda suda var olan zararlı bakterileri, kireci, tortuyu, pası, asbesti, partikülleri ve ağır metalleri tamamen arıtır. Aşama: Post karbo filtre – Hindistan Cevizi Kabuğundan üretilir. Arıtılmış su, musluğa giderken, son kez Hindistan cevizi kabuğu filtreden geçer. Bu aşama, suyun mineral açısından zenginleşmesini sağlar ve tadını düzenler     

Filtrelerin kullanım ömürleri üzerinde yazılıdır. kullanım ömrü dolmak üzere iken cihaz alarm verip sizi uyaracaktır. Yetkili servise bilgi verip değişimi sağlamanız gerekecektir.', 'Aşama: 5 Mikron Sediment ve Granül aktif karbon Filtre – Sediment Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtrey...', 7900, NULL, 10, 4.7, 81, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('721dae4a-8bb2-496c-a07e-837f5f752648', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'PRO INLINE FİLTRELER', 'pro-inline-filtreler', 'AQ-8405941387309', '1. Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.

2. Aşama: Granül Aktif Karbon Filtre – 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir.

3. Aşama: 1 Mikron Sediment Filtre – Kaba tortu filtresinden geçme ihtimali olan  kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.', '1. Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağla...', 2499, 2980, 10, 4.4, 129, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, 'discount', 16, TRUE),
  ('c55ae6c3-5a45-43dd-ab5f-1577715da78e', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'INLINE FİLTRELER', 'inline-filtreler', 'AQ-8053266382893', '1. Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.

2. Aşama: Granül Aktif Karbon Filtre – 1. filtrede kaba malzemelerden ayrılıp bu filtreye gelen suyun içindeki klor, kötü koku ve tat veren gazlar, ağır materyallerin bir kısmı ve diğer kimyasal maddelerden ayrıştırılır ve bu sayede suyun tadı, rengi ve kokusu düzenlenir. Bu filtre hindistan cevizi kabuğunun 800°C oksijensiz ortamda yakılmasıyla elde edilmiş tuz halindeki karbon filtredir. Bir susam büyüklüğündeki aktif karbon taneciği bir futbol sahasını kaplayacak kadar moleküler yüzeye sahiptir. Bu sayede yarım kg’lık aktif karbon, yarım ton suyu arıtmaya yetecek kadar yoğun bir malzemedir.

3. Aşama: 1 Mikron Sediment Filtre – Kaba tortu filtresinden geçme ihtimali olan  kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağlar.', '1. Aşama: 5 Mikron Sediment Filtre – Kaba tortu filtresi olup suda bulunan kaba tortu ve partikülleri filtre ederek membran filtreyi korur ve optimum ömür sağla...', 1349, 1699, 10, 4.3, 33, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, 'discount', 21, TRUE),
  ('a4b87a16-dfd6-4594-a923-48cd451b3426', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails 1812-80GPD MEMBRAN', 'aquails-1812-80gpd-membran', 'AQ-8053269397549', 'İnovatif Teknoloji
Aquails gelişmiş ve inovatif üretim süreçleri kullanılarak üretilmektedir.Bileşeni olduğu su arıtma cihazlarının güvenilirliğini ve üretim kalitesini arttırmaktadır.

Mikroplara Geçit Vermez
Tasarımı ve teknolojisi şebeke suyunu en iyi şekilde mikrop ve bakterilerden arındırır.

Size, ailenize ve sevdiklerinize sağlıklı bir su üretimi gerçekleştirir.

Mevcut uyumlu arıtma cihazlarında rahatlıkla kullanılabilir.', 'İnovatif Teknoloji
Aquails gelişmiş ve inovatif üretim süreçleri kullanılarak üretilmektedir.Bileşeni olduğu su arıtma cihazlarının güvenilirliğini ve üretim ka...', 749, 1379, 10, 4.1, 189, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Referans Kodu":"H2O-1812-80","Üretici":"Aquails"}'::jsonb, 'discount', 46, TRUE),
  ('ec40c917-d1b7-421e-afa4-cafcac9b4116', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails POST KARBON FİLTRE', 'post-karbon-filtre', 'AQ-8053271330861', '🔹 Yüksek Kalite Aktif Karbon Teknolojisi

• 
İyot (Iodine) Değeri: 1050 mg/gYüksek iyot değeri sayesinde güçlü adsorpsiyon kapasitesine sahiptir. Bu da su içerisindeki istenmeyen tat ve kokuların etkili şekilde giderilmesini sağlar.

• 
Tayland Hindistan Cevizi (Coconut Shell) KarbonuTayland menşeli hindistan cevizi kabuğundan üretilmiş aktif karbon kullanılır.✔ Daha yüksek mikrogözenek yapısı✔ Üstün tat ve koku giderimi✔ Doğal ve çevre dostu hammadde

🔹 Sağladığı Avantajlar

• 
Arıtılmış suya doğal ve dengeli içim tadı kazandırır

• 
Beklemiş su tadını azaltır

• 
Klor kalıntılarına karşı son bariyer görevi görür

• 
Suyun pürüzsüz ve yumuşak içimli olmasını sağlar

Yüksek iyot değeri ve kaliteli coconut karbon yapısı sayesinde Post Carbon filtre, arıtılmış suyun kalitesini hissedilir şekilde artırır ve her bardakta taze kaynak suyu lezzeti sunar. 💧', '🔹 Yüksek Kalite Aktif Karbon Teknolojisi

• 
İyot (Iodine) Değeri: 1050 mg/gYüksek iyot değeri sayesinde güçlü adsorpsiyon kapasitesine sahiptir. Bu da su içer...', 749, 950, 10, 4.7, 161, '["Arıtılmış suya doğal ve dengeli içim tadı kazandırır","Beklemiş su tadını azaltır","Klor kalıntılarına karşı son bariyer görevi görür","Suyun pürüzsüz ve yumuşak içimli olmasını sağlar"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, 'discount', 21, TRUE),
  ('5fe4de4c-4c60-41e8-ad81-50edcf1ccaed', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'ALKALİ MİNERAL FİLTRE', 'alkali-mineral-filtre', 'AQ-8103165788205', 'Aquails Alkalin Mineral Filtre Teknik Özellikleri
Ürün Adı: Aquails Alkalin Mineral Filtre

Üretici: Aquails 

Amaç: Aquails Alkalin Mineral Filtre, içme suyunuzun pH seviyesini dengeleyerek alkali hale getirir ve minerallerle zenginleştirir. Bu, suyun kalitesini arttırır, vücudunuzun sağlığını destekler ve suyun lezzetini iyileştirir.

Özellikler:

• 
pH Aralığı: 7.5 - 9.5 arası alkali su sağlar.

• 
Mineral Zenginleştirme: Doğal mineraller (Kalsiyum, Magnezyum, Potasyum, Sodyum) ekler.

• 
Bakteri ve Kir Filtrasyonu: Suya karışmış olan kir ve zararlı mikroorganizmaları temizler.

• 
Yüksek Verimlilik: Yüksek filtreleme kapasitesi ile suyunuzda her türlü yabancı maddeyi etkili şekilde giderir.

• 
Uzun Ömürlü: 6-12 ay arasında yüksek verimle kullanılabilir.

• 
Çevre Dostu: Doğal malzemelerle üretilmiştir, çevre dostudur.

• 
Kullanım Alanları: Evlerde, ofislerde ve ticari alanlarda kullanılabilir.

• 
Kolay Kurulum ve Bakım: Kullanıcı dostu tasarımı ile kolayca kurulabilir ve bakımı yapılabilir.

Avantajlar:

• İçme suyunun pH seviyesini artırarak alkali su sağlar.

• Minerallerin katkısı ile suyun sağlık faydalarını artırır.

• Uzun süreli kullanımda suyun kalitesini korur.

• Sağlıklı ve doğal bir içme suyu sağlar.

Uygulama Alanları:

• Evler

• Ofisler

• İş yerleri

• Restoranlar ve kafe zincirleri

Aquails  olarak, yüksek kaliteyi ön planda tutarak, suyunuzun içindeki zararlı maddelerden arındırılmasını sağlıyoruz. Sağlıklı, taze ve alkali suyun keyfini çıkarın!', 'Aquails Alkalin Mineral Filtre Teknik Özellikleri
Ürün Adı: Aquails Alkalin Mineral Filtre

Üretici: Aquails 

Amaç: Aquails Alkalin Mineral Filtre, içme suyunu...', 2519, NULL, 10, 4.8, 125, '["pH Aralığı: 7.5 - 9.5 arası alkali su sağlar.","Mineral Zenginleştirme: Doğal mineraller (Kalsiyum, Magnezyum, Potasyum, Sodyum) ekler.","Bakteri ve Kir Filtrasyonu: Suya karışmış olan kir ve zararlı mikroorganizmaları temizler.","Yüksek Verimlilik: Yüksek filtreleme kapasitesi ile suyunuzda her türlü yabancı maddeyi etkili şekilde giderir.","Uzun Ömürlü: 6-12 ay arasında yüksek verimle kullanılabilir.","Çevre Dostu: Doğal malzemelerle üretilmiştir, çevre dostudur.","Kullanım Alanları: Evlerde, ofislerde ve ticari alanlarda kullanılabilir.","Kolay Kurulum ve Bakım: Kullanıcı dostu tasarımı ile kolayca kurulabilir ve bakımı yapılabilir."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('7c02e393-4caa-4d75-a3f7-45c8a205dc49', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails ALKALİNE FİLTRE', 'aquails-alkaline-filtre', 'AQ-8121664798765', 'Aquails Alkaline PH Filtresi Özellikleri:

• 
PH Dengeleme Teknolojisi: Aquails Alkaline PH Filtresi, suyun PH seviyesini dengeleyerek daha sağlıklı ve içilebilir bir su sağlar. Bu, vücudun asidik birikimlerini dengelemeye yardımcı olarak genel sağlığı iyileştirir.

• 
Alkali Su Üretimi: Suyun asidik özelliklerini nötralize ederek daha alkalin bir yapı oluşturur, böylece bağışıklık sistemini destekler ve enerjiyi artırır.

• 
Mineral Zengini: Filtre, suya gerekli mineralleri ekleyerek vücudun ihtiyacı olan faydalı maddeleri sağlar. Bu, suyun besleyici değerini artırır.

• 
Gelişmiş Filtrasyon: Aquails Alkaline PH Filtresi, sudaki zararlı kirleticileri ve ağır metallerin %99''unu arındırarak daha temiz su elde edilmesini sağlar.

• 
Kolay Kurulum ve Kullanım: Filtre, pratik montajı ile kullanıcı dostudur, evde ya da ofiste rahatlıkla kullanılabilir.

• 
Uzun Ömürlü Filtreleme: Yüksek verimlilikle çalışan uzun ömürlü filtre teknolojisi sayesinde, düzenli kullanımda etkili sonuçlar elde edilir.

• 
Su Tadını İyileştirir: Alkalinize edilmiş su, taze ve ferahlatıcı bir içim deneyimi sunar.

• 
Çevre Dostu: Uzun ömürlü kullanımı sayesinde çevreye duyarlı bir seçenek olarak öne çıkar, sürdürülebilir su arıtma sağlar.', 'Aquails Alkaline PH Filtresi Özellikleri:

• 
PH Dengeleme Teknolojisi: Aquails Alkaline PH Filtresi, suyun PH seviyesini dengeleyerek daha sağlıklı ve içilebil...', 3359, NULL, 10, 4.1, 145, '["Kolay Kurulum ve Kullanım: Filtre, pratik montajı ile kullanıcı dostudur, evde ya da ofiste rahatlıkla kullanılabilir.","Su Tadını İyileştirir: Alkalinize edilmiş su, taze ve ferahlatıcı bir içim deneyimi sunar."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('1ec3f482-37f6-44af-ae94-09bc8f989bc2', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails MİNERAL PH STABİLİZER FİLTRE', 'aquails-mineral-ph-stabilizer-filtre', 'AQ-8121666830381', 'Aquails Mineral PH Stabilizer Filtre Özellikleri:

• 
PH Dengeleme ve Stabilizasyon: Aquails Mineral PH Stabilizer Filtre, suyun PH seviyesini optimize eder ve sabit tutarak, suyun sağlıklı içilebilirlik düzeyinde kalmasını sağlar. Bu, suyun asidik veya alkali olma eğilimlerini dengeleyerek vücudun doğal dengesine katkı sağlar.

• 
Mineral Zenginleştirme: Bu filtre, suya vücudun ihtiyacı olan mineralleri ekler. Magnezyum, kalsiyum gibi önemli mineraller, suyun besleyici değerini artırır ve genel sağlığı destekler.

• 
Gelişmiş Filtrasyon Teknolojisi: Aquails Mineral PH Stabilizer, sudaki zararlı maddeleri ve ağır metallerin etkin şekilde arındırılmasını sağlar, böylece sadece temiz değil, aynı zamanda mineral açısından zengin su elde edilir.

• 
Sağlıklı Su, Taze Tat: Su, mineral içerikleriyle zenginleşerek, doğal ve taze bir tat kazanır. Bu, içme suyunun daha lezzetli olmasını sağlar.

• 
Kolay Kurulum: Evde veya ofiste rahatlıkla kurulabilen bu filtre, kullanıcılara hızlı ve etkili bir su arıtma deneyimi sunar.

• 
Uzun Ömürlü Filtreleme: Yüksek verimlilikle çalışan uzun ömürlü filtre teknolojisi sayesinde, suyu etkin şekilde arıtarak uzun vadede güvenli kullanım sağlar.

• 
Çevre Dostu: Suyu doğal minerallerle zenginleştirirken çevre dostu bir yaklaşım benimser. Filtrelerin uzun ömürlü kullanımı sayesinde, sürdürülebilir su arıtımı sağlar.', 'Aquails Mineral PH Stabilizer Filtre Özellikleri:

• 
PH Dengeleme ve Stabilizasyon: Aquails Mineral PH Stabilizer Filtre, suyun PH seviyesini optimize eder ve ...', 3460, NULL, 10, 4.4, 41, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('47ec2ad3-0165-4136-a2d5-e62057bf03dc', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails ANTİOXDANT ORP ALKALİNE FİLTRE', 'aquails-antioxdant-orp-alkaline-filtre', 'AQ-8121668763693', 'Aquails Mineral PH Stabilizer Filtre Özellikleri:

• 

• 
Aquails AntioxDant ORP Alkaline Filtre Özellikleri:

• 
AntioxDant Teknolojisi: Aquails AntioxDant ORP Alkaline Filtre, suyu güçlü bir antioksidan özellik kazandırarak oksidatif stresle savaşmaya yardımcı olur. Bu teknoloji, serbest radikalleri nötralize eder ve hücreleri zararlı etkilerden korur, vücudun yaşlanma sürecini yavaşlatır.

• 
ORP (Oksidasyon-Redüksiyon Potansiyeli) Desteği: ORP filtresi, suyun oksidasyon-redüksiyon seviyesini optimize ederek, daha aktif ve reaktif su üretir. Bu, suyun temizlenmesini ve dezenfekte edilmesini sağlar, aynı zamanda suyun kalitesini artırır.

• 
Alkaline Su Üretimi: Filtre, suyun asidik yapısını dengeleyerek alkalin bir su elde eder. Alkalin su, vücudun pH seviyesini dengelemeye yardımcı olur ve asidik birikimlerin giderilmesine katkı sağlar.

• 
Mineral Zenginleştirme: Suya vücudun ihtiyaç duyduğu mineralleri ekler. Kalsiyum, magnezyum ve potasyum gibi mineraller, suyun besleyici değerini artırarak genel sağlığı destekler.

• 
Gelişmiş Filtrasyon Sistemi: Aquails AntioxDant ORP Alkaline Filtre, sudaki zararlı kirleticileri ve ağır metallerin %99’unu arındırarak suyu daha temiz ve sağlıklı hale getirir.

• 
Kolay Kurulum ve Kullanım: Kullanıcı dostu tasarımı sayesinde evde ya da ofiste hızlıca kurulabilir ve pratik bir kullanım sunar.

• 
Uzun Ömürlü Filtreleme: Yüksek verimliliği ve uzun ömürlü filtreleme teknolojisi ile uzun vadede etkin performans sağlar.

• 
Çevre Dostu: Aquails filtreleri, çevreye duyarlı bir çözüm sunarak sürdürülebilir su arıtımı sağlar. Uzun ömürlü filtreler, daha az atık oluşturur.', 'Aquails Mineral PH Stabilizer Filtre Özellikleri:

• 

• 
Aquails AntioxDant ORP Alkaline Filtre Özellikleri:

• 
AntioxDant Teknolojisi: Aquails AntioxDant ORP...', 3549, NULL, 10, 4.1, 113, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('282ee162-cf46-4589-aa0b-5d87d6689985', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'DAİRE GİRİŞİ 10'''' FİLTRASYON SİSTEMİ', 'daire-girisi-10-filtrasyon-sistemi', 'AQ-8272879353901', 'Bina Girişi Su Arıtma Cihazı 3''lü Filtre Seti BİNA GİRİŞİ SU ARITMA CİHAZI İÇİN 3''LÜ YEDEK FİLTRE SETİ +  AŞAMALAR 1. AŞAMA - 10" Tortu Filtre: Sularda askıda bulunan katı maddeler (tortu, kum, çamur v.s.) bulanıklık oluşturur.

Askıdaki katı maddelerin oluşturduğu kirliliği ve bulanıklığı gidermek için kullanılan bu filtreler suda bulunan her türlü partiküller, kir, tortu, kum ve diğer kaba kirleticileri filtre ederek suyu berraklaştırır.

2. AŞAMA - 10" Blok Karbon Filtre: Suda bulunan klor, renk, tat ve koku veren eriyik gazlar, artıklar ve organik maddelerin arıtımı için kullanılır.

Bu aktif granül karbon filtre yüksek performanslı aktive edilmiş karbondan oluşmaktadır ve suyu klorin, koku, organik kirleticiler, böcek ilaçları ve koku ile tadı etkileyen kimyasallardan arındırır.

3. AŞAMA - 10 '''' SİLİPHOS (Mikrofoz) Kireç Önleyici Filtresi: Siliphos, sinai ıslah suları ve şehir şebeke sularında suyun kalitesini yükselten kimyasal bir üründür.

Sıcak veya soğuk su ile temas eden tüm metal yüzeylerde, borularda, soğutma kule ve radyatörlerinde, kaplıca, sıcak su şebekelerinde, buhar kazanı besleme sularında vb.

noktalarda PAS, KOROZYON ve KİREÇ TAŞI oluşumunu kesinlikle önler.

Suyu yumuşatmaktan çok daha ekonomiktir.

Merkezi su sistemine bağlanan özel tankların (dispenser) içine konan siliphos suyla temas ettikçe kendiliğinden eriyerek suya karışır.

Su tüketimine göre uygun dispenser seçimi yapılmalıdır.

Ana su girişine bağlanabileceği gibi buhar kazanı veya kapalı, açık devre su sistemleri öncesinde lokal olarak uygulanabilir.

Merkezi olarak bağlandığında, içme suyu olarak rahatlıkla kullanılır.

Sağlığa zararlı hiçbir etkisi olmadığı gibi, limitlerin altında içerdiği ( 2-3 ppm) fosfat dolayısıyla insan sağlığına faydası vardır.

Avrupa''nın birçok ülkesinde, şehir sebekelerine siliphos dispenserleri merkezi olarak bağlanmıştır ve şehir halkı bu sudan istifade etmektedir.

Dispenserden her bir ton su geçtiğinde yaklaşık 3-5 gr.

siliphos eriyerek suya karışır.

Bu konsantrasyonda çözünen siliphos suya 2-3 gr (P205) fosfat vermektedir.

Bu oran siliphos''un işlevlerini yerine getirmesi için yeterlidir.

Suda çözünen 2-3 ppm (2-3 gr P2O5 /ton) Fosfat (P2O5) ÜRÜN İÇERİĞİ •10” 5 Mikron Spun (Sediment) Filtre * 1 adet - Filtre Ömrü 6 Ay •10” Blok Karbon Kartuş Filtre (CTO) * 1 adet - Filtre Ömrü 6 Ay •10” Siliphos Filtre * 1 adet - Filtre Ömrü 6 Ay Ürünün Montajı Müşteriye aittir.', 'Bina Girişi Su Arıtma Cihazı 3''lü Filtre Seti BİNA GİRİŞİ SU ARITMA CİHAZI İÇİN 3''LÜ YEDEK FİLTRE SETİ +  AŞAMALAR 1. AŞAMA - 10" Tortu Filtre: Sularda askıda b...', 3349, NULL, 10, 4.2, 141, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('9c9a7602-ffcd-43dd-a467-901cd7ba7189', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails ORP FİLTRE', 'aquails-orp-filtre', 'AQ-8103178764333', 'ORP (Oksidasyon-Redüksiyon Potansiyeli), bir sıvının oksidasyon veya redüksiyon reaksiyonlarına ne kadar yatkın olduğunu ölçen bir parametredir. Kısaca, suyun kimyasal dengesini belirler ve suyun ne kadar "aktif" veya "reaktif" olduğunu gösterir. ORP değeri, suyun kalitesini anlamak ve suyu dezenfekte etmek için önemlidir. Genellikle milivolt (mV) cinsinden ölçülür.

Aquails ORP Filtresi Su Arıtma Cihazında Neden Gereklidir?

ORP filtresi, suyun oksidasyon-redüksiyon seviyesini sürekli olarak izleyerek, suyun temizliğini ve dezenfeksiyonunu sağlar. Su arıtma cihazlarında kullanıldığında, bu filtre suyun kalitesini iyileştirir, bakterileri ve kirleticileri azaltır. ORP filtresi, suyun ideal kimyasal dengesini sağlamak için gerekli olan doğru oksidasyon seviyelerini korur.

Aquails ORP Filtrelerinin Faydaları:

• 
Sağlıklı Su Sağlar: ORP filtresi, suyun oksidasyon-redüksiyon seviyesini optimize eder, bu da mikroorganizmaların öldürülmesine ve zararlı maddelerin giderilmesine yardımcı olur.

• 
Kimyasal Dengeyi Korur: Suya karışan kimyasalların etkisini dengeler, suyun içeriğini düzenler.

• 
Mikropları Azaltır: Yüksek ORP seviyeleri, bakteri ve diğer mikroorganizmaların öldürülmesini sağlar.

• 
Su Kalitesini İyileştirir: Su arıtma sürecinde daha temiz ve sağlıklı su elde edilir.

• 
Enerji Verimliliği: Filtreleme sürecini optimize ederek enerji tüketimini azaltır.

• 
Sürekli İzleme: Su kalitesi anlık olarak izlenir ve gerektiğinde otomatik ayarlamalar yapılır.

Kısacası, Aquails ORP filtresi, su arıtma sistemlerinin daha verimli ve etkili çalışmasını sağlar, sağlıklı ve temiz su elde edilmesine yardımcı olur.', 'ORP (Oksidasyon-Redüksiyon Potansiyeli), bir sıvının oksidasyon veya redüksiyon reaksiyonlarına ne kadar yatkın olduğunu ölçen bir parametredir. Kısaca, suyun k...', 3751, NULL, 10, 4.1, 33, '["Kimyasal Dengeyi Korur: Suya karışan kimyasalların etkisini dengeler, suyun içeriğini düzenler.","Mikropları Azaltır: Yüksek ORP seviyeleri, bakteri ve diğer mikroorganizmaların öldürülmesini sağlar.","Su Kalitesini İyileştirir: Su arıtma sürecinde daha temiz ve sağlıklı su elde edilir.","Enerji Verimliliği: Filtreleme sürecini optimize ederek enerji tüketimini azaltır.","Sürekli İzleme: Su kalitesi anlık olarak izlenir ve gerektiğinde otomatik ayarlamalar yapılır."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI', 'aquails-2-3-yollu-musluk-bataryasi', 'AQ-8053269561389', '(Tavsiye edilen satış fiyatı)', '(Tavsiye edilen satış fiyatı)', 8699, NULL, 10, 4.3, 149, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('e2c3dd88-8029-4d92-a7bd-2fd02f78d57c', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', '304 PASLANMAZ ÇELİK MUSLUK', '304-paslanmaz-celik-musluk', 'AQ-8059496038445', 'Su arıtma cihazınızın son çıkış noktası olan su alma musluğu, sağlıklı ve temiz su elde etmenin kritik bir parçasıdır. Kalitesiz ve ucuz musluklarla sağlığınızı riske atmayın.

Ürün Özellikleri:

• 
Malzeme Kalitesi: 18/10 Krom Nikel 304 kalite paslanmaz çelik, paslanma ve korozyona karşı dayanıklıdır.

• 
Sağlık Güvencesi: Kimyasal madde içermeyen, tamamen doğal su elde etmenizi sağlar.

• 
Koku ve Tat: Özel tasarımı sayesinde suyun doğal tadını korur, koku yapmaz.

• 
Estetik Tasarım: Şık ve modern görünümüyle mutfak dekorunuza zarafet katacak.

• 
Kolay Montaj: Pratik montaj imkanı ile kullanıcı dostudur, kısa sürede kurulabilir.

• 
Uzun Ömürlü Kullanım: Dayanıklı yapısı sayesinde uzun yıllar boyunca güvenle kullanabilirsiniz.

Sağlıklı içme suyu deneyimini en üst düzeye çıkarmak için kaliteli bir musluk tercih edin. Hem sağlığınızı koruyun hem de mutfaklarınıza estetik bir dokunuş katın!', 'Su arıtma cihazınızın son çıkış noktası olan su alma musluğu, sağlıklı ve temiz su elde etmenin kritik bir parçasıdır. Kalitesiz ve ucuz musluklarla sağlığınızı...', 2899, NULL, 10, 4.5, 185, '["Malzeme Kalitesi: 18/10 Krom Nikel 304 kalite paslanmaz çelik, paslanma ve korozyona karşı dayanıklıdır.","Sağlık Güvencesi: Kimyasal madde içermeyen, tamamen doğal su elde etmenizi sağlar.","Koku ve Tat: Özel tasarımı sayesinde suyun doğal tadını korur, koku yapmaz.","Estetik Tasarım: Şık ve modern görünümüyle mutfak dekorunuza zarafet katacak.","Kolay Montaj: Pratik montaj imkanı ile kullanıcı dostudur, kısa sürede kurulabilir.","Uzun Ömürlü Kullanım: Dayanıklı yapısı sayesinde uzun yıllar boyunca güvenle kullanabilirsiniz."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('e74b68b3-943f-4d52-a298-95df745a294f', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'DİJİTAL 304 PASLANMAZ ÇELİK MUSLUK', 'dijital-304-paslanmaz-celik-musluk', 'AQ-8409359155245', '💧 Akıllı Dijital Musluk – Suyunuzu Anlık Takip Edin
Yeni nesil Dijital Musluk, su kalitenizi anlık olarak kontrol etmenizi sağlayan gelişmiş ölçüm sistemiyle donatılmıştır. Hem giriş hem de çıkış suyu değerlerini göstererek filtrasyon performansını net bir şekilde takip etmenize yardımcı olur.

🔎 Anlık TDS Ölçümü

• 
Arıtma sonrası suyun çıkış TDS (PPM) değerini anlık olarak ölçer.

• 
Filtrasyon farkını net şekilde görmenizi sağlar.

Bu sayede suyunuzun kalitesini sayısal verilerle kontrol edebilir, arıtma performansını güvenle izleyebilirsiniz.

📊 PPM (TDS) Değeri Nedir?
TDS (Total Dissolved Solids), suda çözünmüş toplam katı madde miktarını ifade eder ve PPM (parts per million) birimi ile ölçülür. Dijital ekran sayesinde suyunuzun PPM değerini anlık olarak görüntüleyebilirsiniz.

⏳ Akıllı Filtre Ömrü Takibi

• 
Filtrelerin kullanım süresini gösterir.

• 
Tahmini filtre değişim zamanını bildirir.

• 
Zamanında değişim yaparak maksimum performans sağlar.

Böylece filtre takibini manuel olarak yapmanıza gerek kalmaz.

🔋 Pilli Çalışma – Elektrik Gerektirmez

• 
Pil ile çalışır.

• 
Elektrik bağlantısına ihtiyaç duymaz.

• 
Enerji tasarruflu ve güvenlidir.

Kurulumu kolaydır ve ekstra tesisat gerektirmez.

✅ Neden Dijital Musluk?
✔ Anlık su kalitesi takibi✔ Giriş–çıkış karşılaştırmalı ölçüm✔ Filtre ömrü göstergesi✔ Elektriksiz kullanım✔ Modern ve şık tasarım

Suyunuzun kalitesini kontrol altına alın, sağlıklı yaşam için teknolojiyi mutfağınıza taşıyın.', '💧 Akıllı Dijital Musluk – Suyunuzu Anlık Takip Edin
Yeni nesil Dijital Musluk, su kalitenizi anlık olarak kontrol etmenizi sağlayan gelişmiş ölçüm sistemiyle d...', 12500, NULL, 10, 4.3, 45, '["Arıtma sonrası suyun çıkış TDS (PPM) değerini anlık olarak ölçer.","Filtrasyon farkını net şekilde görmenizi sağlar.","Filtrelerin kullanım süresini gösterir.","Tahmini filtre değişim zamanını bildirir.","Zamanında değişim yaparak maksimum performans sağlar.","Pil ile çalışır.","Elektrik bağlantısına ihtiyaç duymaz.","Enerji tasarruflu ve güvenlidir."]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('efb6155e-1c56-4dd4-ad27-6777c6757651', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'TANKLI SEBİL APARATI', 'tankli-sebil-aparati', 'AQ-8053271429165', 'Polikarbon sağlıklı malzemeden yapılmıştır. İstenilen ölçülerde uzatılabilen hortum, su arıtma cihazına bağlantı aparatı ve şamandıralı kapağı ile portatif her sebile uyumlu hale getirilmiştir.
*NSF li hortum
*T aparat
*Vana
Sebilin üstüne sabit olarak yerleştirilir. Arıtma cihazından çekilen ince bir hortum ile bağlantı sağlanır. Damacana aparatının içinde bulunan şamandıra vasıtasıyla sistem otomatik olarak dolar. Sebilden su kullandığınız zaman otomatik olarak devreye girer ve damacana aparatını doldurur.
Damacana doldurmaya, indirip kaldırmaya gerek kalmadan normal su sebilinizi arıtmalı sebile dönüştürebilirsiniz. Arıtma cihazınızdan alacağınız bir hat ile su sebilinizi kesintisiz doldur boşalt derdi olmadan kullanabilirsiniz.', 'Polikarbon sağlıklı malzemeden yapılmıştır. İstenilen ölçülerde uzatılabilen hortum, su arıtma cihazına bağlantı aparatı ve şamandıralı kapağı ile portatif her ...', 3500, NULL, 10, 4.4, 185, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE),
  ('e21d12cd-1fdf-44c0-acb8-3a14009e895d', 'bca816b3-96c7-4927-a872-0ba3a5dff89d', 'TANKSIZ SEBİL APARATI', 'tanksiz-sebil-aparati', 'AQ-8053271625773', 'Polikarbon sağlıklı malzemeden yapılmıştır. İstenilen ölçülerde uzatılabilen hortum, su arıtma cihazına bağlantı aparatı ve şamandıralı kapağı ile portatif her sebile uyumlu hale getirilmiştir.
*NSF li hortum
*T aparat
*Vana
Sebilin üstüne sabit olarak yerleştirilir. Arıtma cihazından çekilen ince bir hortum ile bağlantı sağlanır. Damacana aparatının içinde bulunan şamandıra vasıtasıyla sistem otomatik olarak dolar. Sebilden su kullandığınız zaman otomatik olarak devreye girer ve damacana aparatını doldurur.
Damacana doldurmaya, indirip kaldırmaya gerek kalmadan normal su sebilinizi arıtmalı sebile dönüştürebilirsiniz. Arıtma cihazınızdan alacağınız bir hat ile su sebilinizi kesintisiz doldur boşalt derdi olmadan kullanabilirsiniz.', 'Polikarbon sağlıklı malzemeden yapılmıştır. İstenilen ölçülerde uzatılabilen hortum, su arıtma cihazına bağlantı aparatı ve şamandıralı kapağı ile portatif her ...', 2500, NULL, 10, 4.9, 33, '["Aquails kalite güvencesi","Türkiye geneli servis desteği"]'::jsonb, '{"Marka":"Aquails","Kategori":"Su Arıtma Cihazları","Ürün Tipi":"Su Arıtma","Üretici":"Aquails"}'::jsonb, NULL, NULL, TRUE);

INSERT INTO public.product_images (product_id, url, sort_order, alt_text) VALUES
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/36.jpg?v=1729253771', 0, 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/37.jpg?v=1729253771', 1, 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/35.jpg?v=1729251513', 2, 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/23.jpg?v=1760694617', 3, 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/IMG_1409.jpg?v=1760694617', 4, 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI'),
  ('44fdebff-d3f1-4fab-ab9d-5be09731a0b3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/IMG_1408_9984736d-bbab-4049-889b-8def01da8be3.jpg?v=1760694617', 5, 'Aquails WATER CHEF DİREK AKIŞ SU ARITMA CİHAZI'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/1148E4B3-CEAD-466A-8543-EDD09670DB3C.jpg?v=1760694617', 0, 'Aquails BLUEDROP DİREK AKIŞ SU ARITMA CİHAZI'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/23.jpg?v=1760694617', 1, 'Aquails BLUEDROP DİREK AKIŞ SU ARITMA CİHAZI'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/IMG_1409.jpg?v=1760694617', 2, 'Aquails BLUEDROP DİREK AKIŞ SU ARITMA CİHAZI'),
  ('f984b923-5328-40d2-a53d-ebc4bcb99e96', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/IMG_1408_9984736d-bbab-4049-889b-8def01da8be3.jpg?v=1760694617', 3, 'Aquails BLUEDROP DİREK AKIŞ SU ARITMA CİHAZI'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.40_1.jpg?v=1771656544', 0, 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.40.jpg?v=1771656544', 1, 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.41_1.jpg?v=1771656544', 2, 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.41.jpg?v=1771656544', 3, 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.42_4.jpg?v=1771656926', 4, 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI'),
  ('8aafff14-4c47-4753-a511-c63ee6e17d70', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2024-11-07-11-50-52.jpg?v=1771656926', 5, 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.41_3.jpg?v=1771656926', 0, 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.42.jpg?v=1771656926', 1, 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.41_2.jpg?v=1771656926', 2, 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/WhatsApp_Image_2026-02-21_at_09.25.42_4.jpg?v=1771656926', 3, 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI'),
  ('232bca60-2a29-4917-a710-9357f9dec6bc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2024-11-07-11-50-52.jpg?v=1771656926', 4, 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI'),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/20.jpg?v=1739972855', 0, 'Aquails H2O TESLA SU ARITMA SİSTEMİ'),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/21.jpg?v=1739972941', 1, 'Aquails H2O TESLA SU ARITMA SİSTEMİ'),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/22.jpg?v=1739972941', 2, 'Aquails H2O TESLA SU ARITMA SİSTEMİ'),
  ('2b825da4-a810-4682-a6dc-0c20c7b52680', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/23.jpg?v=1760694617', 3, 'Aquails H2O TESLA SU ARITMA SİSTEMİ'),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/20.jpg?v=1739972855', 0, 'Aquails H2O TESLA (ALKALİ) SU ARITMA SİSTEMİ / 6 AŞAMA'),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/16_b5fd0b26-5684-48dd-b05d-10e99bb3ca6d.jpg?v=1739972941', 1, 'Aquails H2O TESLA (ALKALİ) SU ARITMA SİSTEMİ / 6 AŞAMA'),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/21.jpg?v=1739972941', 2, 'Aquails H2O TESLA (ALKALİ) SU ARITMA SİSTEMİ / 6 AŞAMA'),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/22.jpg?v=1739972941', 3, 'Aquails H2O TESLA (ALKALİ) SU ARITMA SİSTEMİ / 6 AŞAMA'),
  ('ab455c9a-7931-494e-a2c3-bb779176ac79', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/23.jpg?v=1760694617', 4, 'Aquails H2O TESLA (ALKALİ) SU ARITMA SİSTEMİ / 6 AŞAMA'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/16.jpg?v=1739972646', 0, 'Aquails H2O NEO SU ARITMA SİSTEMİ'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/14.jpg?v=1739972646', 1, 'Aquails H2O NEO SU ARITMA SİSTEMİ'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/15.jpg?v=1739972646', 2, 'Aquails H2O NEO SU ARITMA SİSTEMİ'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/17.jpg?v=1729248957', 3, 'Aquails H2O NEO SU ARITMA SİSTEMİ'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/18.jpg?v=1729248957', 4, 'Aquails H2O NEO SU ARITMA SİSTEMİ'),
  ('e03bcd14-9792-4461-af79-14746bb7f10c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/19.jpg?v=1729248957', 5, 'Aquails H2O NEO SU ARITMA SİSTEMİ'),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/09.jpg?v=1729248674', 0, 'Aquails H2O GREEN PLUS SU ARITMA SİSTEMİ'),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/10.jpg?v=1729248637', 1, 'Aquails H2O GREEN PLUS SU ARITMA SİSTEMİ'),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/11.jpg?v=1729248637', 2, 'Aquails H2O GREEN PLUS SU ARITMA SİSTEMİ'),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/08.jpg?v=1729248637', 3, 'Aquails H2O GREEN PLUS SU ARITMA SİSTEMİ'),
  ('d7ccad97-744e-46dd-afef-be787d8ac47e', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/12.jpg?v=1744888488', 4, 'Aquails H2O GREEN PLUS SU ARITMA SİSTEMİ'),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/C488F9B1-B0C9-47B7-B80C-C1DA63E28561.jpg?v=1744888488', 0, 'Aquails H2O GREEN PLUS DİJİTAL SU ARITMA SİSTEMİ'),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/12.jpg?v=1744888488', 1, 'Aquails H2O GREEN PLUS DİJİTAL SU ARITMA SİSTEMİ'),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/1491E0BF-4543-4021-B888-4CCB35788FF9.jpg?v=1744888147', 2, 'Aquails H2O GREEN PLUS DİJİTAL SU ARITMA SİSTEMİ'),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/723F3CDD-ECCD-495C-BBA8-93A4422733AC.jpg?v=1744888146', 3, 'Aquails H2O GREEN PLUS DİJİTAL SU ARITMA SİSTEMİ'),
  ('3d8e1c98-6540-43d4-a800-8e779f366531', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/4FAFA75F-6B83-4916-8B4C-88C4B08A980B.jpg?v=1744888147', 4, 'Aquails H2O GREEN PLUS DİJİTAL SU ARITMA SİSTEMİ'),
  ('f4134ade-ef9a-4021-a1f0-95c595e338f1', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/07.jpg?v=1729248510', 0, 'Aquails H2O DROP PLUS SU ARITMA SİSTEMİ'),
  ('f4134ade-ef9a-4021-a1f0-95c595e338f1', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/06.jpg?v=1729248468', 1, 'Aquails H2O DROP PLUS SU ARITMA SİSTEMİ'),
  ('0905fb07-482d-4477-aef2-463b528149c2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2024-11-19-14-52-27.jpg?v=1739972709', 0, 'Aquails EKO PLUS  SU ARITMA'),
  ('0905fb07-482d-4477-aef2-463b528149c2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2024-11-19-14-52-28.jpg?v=1739972709', 1, 'Aquails EKO PLUS  SU ARITMA'),
  ('0905fb07-482d-4477-aef2-463b528149c2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2024-11-19-14-52-28_00000003.jpg?v=1739972709', 2, 'Aquails EKO PLUS  SU ARITMA'),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/00.jpg?v=1729248336', 0, 'Aquails H2O DROP SU ARITMA SİSTEMİ'),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/01.jpg?v=1729248313', 1, 'Aquails H2O DROP SU ARITMA SİSTEMİ'),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/02.jpg?v=1729248313', 2, 'Aquails H2O DROP SU ARITMA SİSTEMİ'),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/03.jpg?v=1729248313', 3, 'Aquails H2O DROP SU ARITMA SİSTEMİ'),
  ('5e83a8a8-ff91-4dac-ad02-b473bb034c48', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/04.jpg?v=1729248313', 4, 'Aquails H2O DROP SU ARITMA SİSTEMİ'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/7E7BB333-D44B-4BF4-839B-D9BE6C2ED555.jpg?v=1778503597', 0, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/6EF8D029-7198-48E8-80BF-A464A27D8CB0.jpg?v=1778503597', 1, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/0AC36691-E3AC-4874-BCC0-1526F40DB66F.jpg?v=1778503597', 2, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/59FBC9B8-E5D9-4705-A4B3-B031BC5BFD65.jpg?v=1778503597', 3, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/4B6365DA-5324-424F-B2E6-23DD014B38C6.jpg?v=1778503597', 4, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/D83B09EE-891D-45BE-B0F5-8DD5A0753D71.jpg?v=1778503597', 5, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/CEC4A300-5B06-4C87-8E34-8C5996DA87DA.jpg?v=1778503597', 6, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/B2B13B99-7E8F-4969-8E53-C3336468C025.jpg?v=1778503597', 7, 'OR-115 ARITMALI SEBİL'),
  ('0af9a6dd-a06b-469d-aecc-c3437edd46a3', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/4BFEEDEA-8F87-4EC7-9599-D09522E966D0.jpg?v=1778503597', 8, 'OR-115 ARITMALI SEBİL'),
  ('0186e795-3ad2-4037-a3ba-a515329ba552', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/5.jpg?v=1739869203', 0, 'OR-351 ARITMALI SEBİL'),
  ('0186e795-3ad2-4037-a3ba-a515329ba552', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/8.jpg?v=1739869203', 1, 'OR-351 ARITMALI SEBİL'),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/12_774a8fdc-dce2-44dd-9cea-7e2d7eba9041.jpg?v=1739869205', 0, 'ORT-600 / 600 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/10_2cfd47bf-2100-4280-b799-e11948256df4.jpg?v=1739869205', 1, 'ORT-600 / 600 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/9.jpg?v=1739869205', 2, 'ORT-600 / 600 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('10fbd756-47b5-4550-a469-d4f330896bfd', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/11_de6e6ae7-f066-4cdc-a323-c19c968b2f06.jpg?v=1739869204', 3, 'ORT-600 / 600 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('b70c7547-fb29-4662-af97-72eaf5584326', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/26.jpg?v=1729249420', 0, 'ORT-300 / 300 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('b70c7547-fb29-4662-af97-72eaf5584326', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/27.jpg?v=1729249401', 1, 'ORT-300 / 300 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('b70c7547-fb29-4662-af97-72eaf5584326', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/28.jpg?v=1729249402', 2, 'ORT-300 / 300 GPD DİREK AKIŞ SU ARITMA CİHAZI'),
  ('af6d8df9-6881-4b6f-a27a-af9af5c4677f', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/1.jpg?v=1739869203', 0, 'ORT-100(SOFT-MİDİ)'),
  ('af6d8df9-6881-4b6f-a27a-af9af5c4677f', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/2.jpg?v=1739869204', 1, 'ORT-100(SOFT-MİDİ)'),
  ('84e5d59f-1973-4fd7-a1fc-f75a02e01627', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/3.jpg?v=1739869203', 0, 'ORT-150(SOFTMAX-MAXİ)'),
  ('84e5d59f-1973-4fd7-a1fc-f75a02e01627', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/4.jpg?v=1739869203', 1, 'ORT-150(SOFTMAX-MAXİ)'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/02_b0eb294b-2af0-4743-a537-f379da16c29b.jpg?v=1764158481', 0, 'Aquails TRİO CLEAN 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/03_572e188e-d2fc-419c-821d-44fd50d0fd35.jpg?v=1764158207', 1, 'Aquails TRİO CLEAN 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/04_25294626-75c9-4f64-bc9b-a8d3bef79f40.jpg?v=1764158207', 2, 'Aquails TRİO CLEAN 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/01_a0cd0d78-2bb5-4af1-b9a9-9d1c47cc5179.jpg?v=1764158207', 3, 'Aquails TRİO CLEAN 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('1ae0cca1-9257-4984-a8a2-1e4981747d0c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/05_0a76a1ff-feb0-4c2d-a6a7-4aa7b97ca623.jpg?v=1764158207', 4, 'Aquails TRİO CLEAN 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('7b8b2640-daab-4a3d-a80f-cf0c2fa66487', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/14_d029eeaa-7fe5-4684-9384-a94859cb727f.jpg?v=1739869205', 0, 'Aquails 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('7b8b2640-daab-4a3d-a80f-cf0c2fa66487', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/13_8c182a86-e081-4d11-94f0-51f55818ebf1.jpg?v=1739869205', 1, 'Aquails 10" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('edb49685-aece-4fef-a95d-845197acc542', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/14_d029eeaa-7fe5-4684-9384-a94859cb727f.jpg?v=1739869205', 0, 'Aquails 20" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('edb49685-aece-4fef-a95d-845197acc542', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/13_8c182a86-e081-4d11-94f0-51f55818ebf1.jpg?v=1739869205', 1, 'Aquails 20" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('edb49685-aece-4fef-a95d-845197acc542', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/13.jpg?v=1729248814', 2, 'Aquails 20" 3 LÜ BİNA GİRİŞ FİLTRASYON ARITMA SİSTEMİ'),
  ('56961781-fef1-4912-a810-7566b1a3badd', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/39.jpg?v=1729253948', 0, 'OR-50 Sebil'),
  ('e2ec33f9-b103-4e25-a136-903becdfa275', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/40.jpg?v=1729254025', 0, 'OR-80 Sebil'),
  ('198c87c1-0c41-47dd-a84a-dface4feeac4', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/35.jpg?v=1729251513', 0, 'Water chef filtreler'),
  ('721dae4a-8bb2-496c-a07e-837f5f752648', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/589CEE6C-BC7A-4CE6-AAE0-7AE0DBF6A211.jpg?v=1775230875', 0, 'PRO INLINE FİLTRELER'),
  ('721dae4a-8bb2-496c-a07e-837f5f752648', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/244c0e92-233c-403a-94bf-41998dc61d60.jpg?v=1775230875', 1, 'PRO INLINE FİLTRELER'),
  ('721dae4a-8bb2-496c-a07e-837f5f752648', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/c679110b-21b9-4215-81ce-36a82b82d2dd.jpg?v=1775230875', 2, 'PRO INLINE FİLTRELER'),
  ('c55ae6c3-5a45-43dd-ab5f-1577715da78e', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/17_756b9c67-322f-4ec9-8497-5ad3f5ccc79a.jpg?v=1739869205', 0, 'INLINE FİLTRELER'),
  ('a4b87a16-dfd6-4594-a923-48cd451b3426', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/15_21737d7d-3ce2-43f7-b2a6-9d04d2e948a7.jpg?v=1739869203', 0, 'Aquails 1812-80GPD MEMBRAN'),
  ('a4b87a16-dfd6-4594-a923-48cd451b3426', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/ORTIMAX_1812-80GPD_MEMBRAN-2.jpg?v=1729248066', 1, 'Aquails 1812-80GPD MEMBRAN'),
  ('a4b87a16-dfd6-4594-a923-48cd451b3426', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/ORTIMAX_1812-80GPD_MEMBRAN-3.jpg?v=1729248065', 2, 'Aquails 1812-80GPD MEMBRAN'),
  ('ec40c917-d1b7-421e-afa4-cafcac9b4116', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/29.jpg?v=1729249539', 0, 'Aquails POST KARBON FİLTRE'),
  ('ec40c917-d1b7-421e-afa4-cafcac9b4116', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/30.jpg?v=1729249540', 1, 'Aquails POST KARBON FİLTRE'),
  ('5fe4de4c-4c60-41e8-ad81-50edcf1ccaed', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/16_b5fd0b26-5684-48dd-b05d-10e99bb3ca6d.jpg?v=1739972941', 0, 'ALKALİ MİNERAL FİLTRE'),
  ('5fe4de4c-4c60-41e8-ad81-50edcf1ccaed', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/25_6264fa56-679e-461b-b18d-fce5dbeb79c1.jpg?v=1739869203', 1, 'ALKALİ MİNERAL FİLTRE'),
  ('7c02e393-4caa-4d75-a3f7-45c8a205dc49', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/IMG-5724.jpg?v=1743063051', 0, 'Aquails ALKALİNE FİLTRE'),
  ('7c02e393-4caa-4d75-a3f7-45c8a205dc49', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/24_e54eb17a-718b-4f8a-bf0d-c9869a6aef8b.jpg?v=1743063051', 1, 'Aquails ALKALİNE FİLTRE'),
  ('1ec3f482-37f6-44af-ae94-09bc8f989bc2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/20_1ae2bc6d-3f74-4ec4-a5a8-3903f4d07e77.jpg?v=1739869205', 0, 'Aquails MİNERAL PH STABİLİZER FİLTRE'),
  ('47ec2ad3-0165-4136-a2d5-e62057bf03dc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/21_e332b060-c55b-476d-8ec2-56c10207d998.jpg?v=1739869205', 0, 'Aquails ANTİOXDANT ORP ALKALİNE FİLTRE'),
  ('47ec2ad3-0165-4136-a2d5-e62057bf03dc', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/22_605cec52-b084-4d3f-9216-2be4e1f13407.jpg?v=1739869203', 1, 'Aquails ANTİOXDANT ORP ALKALİNE FİLTRE'),
  ('282ee162-cf46-4589-aa0b-5d87d6689985', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/ORTIMAX_DAIRE_GIRISI.jpg?v=1758179507', 0, 'DAİRE GİRİŞİ 10'''' FİLTRASYON SİSTEMİ'),
  ('9c9a7602-ffcd-43dd-a467-901cd7ba7189', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/18_32997639-ffb4-44c5-809e-977c1ea56e64.jpg?v=1739869205', 0, 'Aquails ORP FİLTRE'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-48.jpg?v=1743061939', 0, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-47.jpg?v=1743061939', 1, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-49-2.jpg?v=1743061939', 2, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-49-3.jpg?v=1743059524', 3, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-49-4.jpg?v=1743059524', 4, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-48-3.jpg?v=1743059524', 5, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-48-4.jpg?v=1743059524', 6, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('daf19938-985b-4747-a41a-6d54628761f2', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2025-03-18-17-20-48-2.jpg?v=1743059524', 7, 'Aquails 2 / 3 YOLLU MUSLUK BATARYASI'),
  ('e2c3dd88-8029-4d92-a7bd-2fd02f78d57c', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/PHOTO-2024-11-07-11-50-52_b01f37cc-d7ff-4193-9a7a-0447c1dc3344.jpg?v=1730969592', 0, '304 PASLANMAZ ÇELİK MUSLUK'),
  ('e74b68b3-943f-4d52-a298-95df745a294f', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/unnamed_1f5212d1-cc62-437b-a381-7c8b50ea51a8.jpg?v=1772094347', 0, 'DİJİTAL 304 PASLANMAZ ÇELİK MUSLUK'),
  ('efb6155e-1c56-4dd4-ad27-6777c6757651', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/31.jpg?v=1729249639', 0, 'TANKLI SEBİL APARATI'),
  ('efb6155e-1c56-4dd4-ad27-6777c6757651', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/32.jpg?v=1729249622', 1, 'TANKLI SEBİL APARATI'),
  ('e21d12cd-1fdf-44c0-acb8-3a14009e895d', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/33.jpg?v=1729251206', 0, 'TANKSIZ SEBİL APARATI'),
  ('e21d12cd-1fdf-44c0-acb8-3a14009e895d', 'https://cdn.shopify.com/s/files/1/0650/6830/2381/files/34.png?v=1729251187', 1, 'TANKSIZ SEBİL APARATI');