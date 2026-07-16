import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronDown, Users, ShieldCheck, Clock, Award,
  Droplet, Cpu, Zap, Shield, Wrench, RefreshCw, Sparkles,
  Package, Search, Calendar, ClipboardCheck,
  Home as HomeIcon, Monitor, Coffee, Filter, CircleDot, Settings, Plug, ChefHat, Activity, Building2,
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { RatingStars } from '@/components/RatingStars';
import { SEO } from '@/components/SEO';
import { BrandLogo } from '@/components/BrandLogo';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/SchemaOrg';
import { products as staticProducts, categories as staticCategories } from '@/data';
import { useCatalog } from '@/hooks/useCatalog';
import { getPublishedBlogPosts, type PublicBlogPost } from '@/services/blogService';
import { getPublishedReviews, type PublicReview } from '@/services/reviewService';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Droplet, Zap, Monitor, Coffee, Filter, CircleDot, Settings, Wrench, Plug, Sparkles,
  ChefHat, Activity, Home: HomeIcon, Building2,
};

const DEVICE_CATEGORY_SLUGS = new Set([
  'direkt-akis-ro',
  'klasik-ro-sistemleri',
  'soft-kompakt',
  'sebiller',
  'bina-giris-filtrasyon',
]);

const categoryImages: Record<string, string> = {
  'direkt-akis-ro': '/images/products/direkt-akis-su-aritma.jpg',
  'klasik-ro-sistemleri': '/images/products/su-aritma-cihazlari.jpg',
  'soft-kompakt': '/images/products/dijital-su-aritma.jpg',
  sebiller: '/images/products/sebiller.jpg',
  'bina-giris-filtrasyon': '/images/products/bina-girisi-filtrasyon.jpg',
  'filtreler-membranlar': '/images/products/filtreler.jpg',
  'musluklar-aksesuarlar': '/images/products/musluklar.jpg',
};

const trustBadges = [
  { icon: Users, label: '10.000+', desc: 'Mutlu Müşteri' },
  { icon: Filter, label: '7 Aşama', desc: 'Filtre Teknolojisi' },
  { icon: Clock, label: 'Aynı Gün', desc: 'Servis Talebi' },
  { icon: ShieldCheck, label: 'Güvenli', desc: 'Alışveriş' },
  { icon: Award, label: 'Yetkili', desc: 'Kurulum Desteği' },
];

const nedenAquails = [
  { icon: Cpu, title: 'Akıllı Filtre Teknolojisi', desc: 'Sensör tabanlı gerçek zamanlı su kalitesi izleme ve otomatik filtre değişim uyarıları.' },
  { icon: Droplet, title: 'Sağlıklı Mineral Dengesi', desc: 'Ters ozmoz sonrası kalsiyum ve magnezyum mineralizasyonu ile sağlıklı su.' },
  { icon: Zap, title: 'Sessiz ve Verimli Sistem', desc: 'Özel izolasyon teknolojisi ile 35 dB altında çalışma sesi, enerji verimli motor.' },
  { icon: RefreshCw, title: 'Kolay Filtre Değişimi', desc: 'Tak-çıkar mekanizması ile tek elinizle 30 saniyede filtre değişimi.' },
  { icon: Wrench, title: 'Kurulum ve Servis Desteği', desc: 'Türkiye genelinde 500+ servis noktası ile aynı gün kurulum ve bakım.' },
  { icon: Shield, title: 'Uzun Ömürlü Yedek Parça', desc: '5 yıl garanti, 10+ yıl yedek parça temini, orijinal parça garantisi.' },
];

const nasilCalisir = [
  { step: '01', title: 'İhtiyacına Uygun Cihazı Seç', desc: 'Evinizin su kalitesi ve kullanım alışkanlıklarınıza en uygun su arıtma sistemini keşfedin.', icon: Search },
  { step: '02', title: 'Online Sipariş veya Randevu', desc: 'Güvenli ödeme ile sipariş verin veya ücretsiz keşif randevusu alın.', icon: Calendar },
  { step: '03', title: 'Kurulum ve Filtre Takibi', desc: 'Profesyonel ekibimiz kurulumu yapar, Aquails filtre değişimlerini sizin için takip eder.', icon: ClipboardCheck },
];

const kampanyalar = [
  { title: 'Direkt Akış Cihazlarda Özel İndirim', desc: 'Tankless su arıtma cihazlarında %20\'ye varan indirim fırsatı.', code: 'DIREKT20', slug: 'yaz-indirimi', image: '/images/campaign-1.jpg' },
  { title: 'Filtre Setlerinde 2. Ürüne İndirim', desc: 'İkinci filtre setinde %50 indirim avantajı.', code: 'FILTRE50', slug: 'filtre-kampanya', image: '/images/campaign-3.jpg' },
  { title: 'Ücretsiz Kurulum Fırsatı', desc: 'Tüm su arıtma cihazlarında profesyonel kurulum bedava.', code: 'KURULUM0', slug: 'ucretsiz-kargo', image: '/images/campaign-2.jpg' },
];

const FALLBACK_YORUMLAR: PublicReview[] = [
  { id: '1', name: 'Mehmet K.', city: 'İstanbul', rating: 5, product: 'Aquails Smart RO Pro', text: '3 aydır kullanıyorum, suyun tadı inanılmaz değişti. Kurulum ekibi çok profesyoneldi. Filtre değişim hatırlatması da çok pratik.', verified: true },
  { id: '2', name: 'Ayşe Y.', city: 'Ankara', rating: 5, product: 'Aquails DirectFlow 400GPD', text: 'Direkt akış cihaz aldım, tank sorunu olmadan anında su. Çocuklarım artık daha çok su içiyor. Kesinlikle tavsiye ederim.', verified: true },
  { id: '3', name: 'Fatih S.', city: 'İzmir', rating: 4, product: 'Aquails Compact UnderSink', text: 'Tezgah altı çok yer kaplamıyor, sessiz çalışıyor. Fiyat performans olarak harika bir ürün.', verified: true },
  { id: '4', name: 'Selin D.', city: 'Bursa', rating: 5, product: 'Aquails Smart RO Pro', text: 'İkinci kez alıyorum, annem için de aldım. Akıllı sensör özelliği çok pratik, telefona bildirim geliyor. Servis hızı mükemmel.', verified: true },
  { id: '5', name: 'Ali R.', city: 'Antalya', rating: 5, product: 'Aquails DirectFlow 600GPD', text: 'İş yerimiz için aldık, çok memnunuz. Yüksek kapasite, düşük su atığı. Teknik destek harika.', verified: true },
  { id: '6', name: 'Zeynep B.', city: 'Adana', rating: 4, product: 'Aquails Compact UnderSink', text: 'Kurulum aynı gün yapıldı. Cihaz çok şık görünüyor, su kalitesi muazzam. Filtre değişimi de çok kolay.', verified: true },
];

const FALLBACK_BLOG: PublicBlogPost[] = [
  { id: '1', slug: 'su-aritma-secerken', title: 'Su Arıtma Cihazı Seçerken Nelere Dikkat Edilmeli?', category: 'Rehber', readTime: '5 dk', image: '/images/blog-1.jpg', excerpt: 'Eviniz için en uygun su arıtma cihazını seçerken dikkat etmeniz gereken 7 kritik faktör...' },
  { id: '2', slug: 'filtre-degisim-sikligi', title: 'Filtre Değişimi Ne Zaman Yapılmalı?', category: 'Bakım', readTime: '3 dk', image: '/images/blog-2.jpg', excerpt: 'Filtrelerinizin ömrünü uzatmanın yolları ve değişim sıklığı hakkında bilmeniz gerekenler...' },
  { id: '3', slug: 'direkt-akis-nedir', title: 'Direkt Akış Su Arıtma Nedir?', category: 'Teknoloji', readTime: '4 dk', image: '/images/blog-3.jpg', excerpt: 'Tankless su arıtma sistemlerinin avantajları ve klasik sistemlerden farkları...' },
];

const faqAnasayfa = [
  { q: 'Su arıtma cihazı kurulumu ne kadar sürer?', a: 'Profesyonel ekibimiz standart bir ev tipi kurulumu ortalama 45-60 dakika içinde tamamlar. Direkt akış ve bina girişi sistemleri için süre 1-2 saat arasındadır.' },
  { q: 'Filtre değişimi kaç ayda bir yapılır?', a: 'Sediment filtreler 6-12 ay, karbon filtreler 6-12 ay, RO membran 24-36 ay, mineral filtresi 12 ayda bir değiştirilmelidir. Kullanım yoğunluğuna göre değişebilir.' },
  { q: 'Direkt akış cihazların farkı nedir?', a: 'Direkt akış (tankless) cihazlar suyu anında arıtır ve depolama tankı kullanmaz. Bu sayede daha kompakt boyut, taze su ve bakteri riski olmadan kullanım sağlar.' },
  { q: 'Kargo ve kurulum nasıl ilerler?', a: 'Siparişiniz aynı gün kargoya verilir. Cihaz elinize ulaştığında servis ekibimiz sizi arayarak uygun bir kurulum tarihi belirler. Kurulum ücretsizdir.' },
  { q: 'Garanti süresi nedir?', a: 'Tüm Aquails su arıtma cihazlarında 5 yıl ana cihaz garantisi, 2 yıl elektronik parça garantisi ve ömür boyu teknik destek sunuyoruz.' },
];

function pickProducts(list: Product[], fallback: Product[], limit = 4): Product[] {
  if (list.length > 0) return list.slice(0, limit);
  return fallback.slice(0, limit);
}

export default function Home() {
  const { products, categories } = useCatalog();
  const catalogProducts = products.length > 0 ? products : staticProducts;
  const catalogCategories = categories.length > 0 ? categories : staticCategories;
  const [activeTab, setActiveTab] = useState('cok-satanlar');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<PublicBlogPost[]>(FALLBACK_BLOG);
  const [reviews, setReviews] = useState<PublicReview[]>(FALLBACK_YORUMLAR);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [publishedBlog, publishedReviews] = await Promise.all([
        getPublishedBlogPosts(3),
        getPublishedReviews(6),
      ]);
      if (cancelled) return;
      if (publishedBlog.length > 0) setBlogPosts(publishedBlog);
      if (publishedReviews.length > 0) setReviews(publishedReviews);
    })();
    return () => { cancelled = true; };
  }, []);

  const shownCategories = catalogCategories.slice(0, 6);

  const tabProducts = useMemo(() => {
    const fallback = catalogProducts;
    const bestsellers = [...catalogProducts].sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
    const newOnes = catalogProducts.filter((p) => p.badge === 'new');
    const discounted = catalogProducts.filter((p) => (p.discountPercent ?? 0) > 0);
    const devices = catalogProducts.filter((p) => DEVICE_CATEGORY_SLUGS.has(p.categorySlug));

    return {
      'cok-satanlar': pickProducts(
        bestsellers.filter((p) => p.rating >= 4.5),
        bestsellers.length > 0 ? bestsellers : fallback,
      ),
      'yeni-gelenler': pickProducts(newOnes, fallback),
      kampanyali: pickProducts(discounted, fallback),
      cihazlar: pickProducts(devices, fallback),
    } satisfies Record<string, Product[]>;
  }, [catalogProducts]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  return (
    <>
      <SEO
        title="Aquails | Daha Temiz Su, Daha Akıllı Teknoloji"
        description="Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar."
        canonical="/"
        schema={{ ...getOrganizationSchema(), ...getWebsiteSchema() }}
      />
      <PageLayout>
      {/* ========== HERO ========== */}
      <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-end md:items-center overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ scale: 1.06, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061628]/88 via-[#0D2137]/72 to-[#0D2137]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061628]/70 via-transparent to-[#061628]/25" />
        </motion.div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-xl"
          >
            <BrandLogo variant="logo" inverted bare className="h-10 sm:h-12 mb-6 md:mb-8 drop-shadow-sm" />
            <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold text-white leading-[1.1] tracking-tight">
              Daha Temiz Su,<br />
              Daha Akıllı Teknoloji
            </h1>
            <p className="mt-5 text-sm sm:text-base text-white/75 leading-relaxed max-w-md">
              Aquails, eviniz ve iş yeriniz için modern su arıtma cihazları, filtre çözümleri ve bakım hizmetlerini tek platformda sunar.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/urunler"
                className="group inline-flex items-center gap-2 bg-[#1A73E8] text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1557B0] transition-all duration-300 shadow-[0_8px_28px_rgba(26,115,232,0.45)] hover:-translate-y-0.5"
              >
                Ürünleri İncele
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/servis-randevusu"
                className="inline-flex items-center gap-2 border border-white/35 text-white/95 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-white/10 hover:border-white/55 transition-all duration-300"
              >
                Servis Randevusu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== GUVEN BAR ========== */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-[#E8F0FE]/60 py-6 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {trustBadges.map(b => (
              <div key={b.label} className="flex items-center gap-2.5">
                <b.icon className="w-5 h-5 text-[#1A73E8]" />
                <div><p className="text-sm font-bold text-[#0D2137]">{b.label}</p><p className="text-[10px] text-[#8B9DAF]">{b.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== KATEGORILER ========== */}
      <section className="py-16 md:py-20 bg-[#F7FAFF] relative">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Kategoriler</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">İhtiyacınıza Uygun Çözümler</h2>
            <p className="text-sm sm:text-[15px] text-[#5A6B7B] mt-3 max-w-lg mx-auto">Modern su arıtma teknolojileri, filtre sistemleri ve profesyonel hizmetler tek çatı altında.</p>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.06}>
            {shownCategories.map(cat => {
              const Icon = iconMap[cat.icon] || Droplet;
              const img = categoryImages[cat.id] || '/images/products/placeholder.jpg';
              return (
                <StaggerItem key={cat.id}>
                  <Link to={`/urunler?kategori=${cat.id}`} className="group block bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden hover:border-[#1A73E8] hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden bg-[#F0F6FF]">
                      <img src={img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-3 text-center">
                      <Icon className="w-4 h-4 text-[#1A73E8] mx-auto mb-1" />
                      <h3 className="text-xs font-semibold text-[#0D2137] group-hover:text-[#1A73E8] transition-colors">{cat.name}</h3>
                      <p className="text-[10px] text-[#8B9DAF] mt-0.5">{cat.productCount} ürün</p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ========== SECMELI URUNLER ========== */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#4FC3F7]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-10">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Öne Çıkan Ürünler</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">En Çok Tercih Edilenler</h2>
          </ScrollReveal>
          <ScrollReveal className="flex justify-center flex-wrap gap-2 mb-10">
            {[
              { key: 'cok-satanlar', label: 'Çok Satanlar' },
              { key: 'yeni-gelenler', label: 'Yeni Gelenler' },
              { key: 'kampanyali', label: 'Kampanyalı' },
              { key: 'cihazlar', label: 'Su Arıtma Cihazları' },
            ].map(t => (
              <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all', activeTab === t.key ? 'bg-[#1A73E8] text-white' : 'bg-white text-[#5A6B7B] border border-[#E8F0FE] hover:border-[#1A73E8]')}>
                {t.label}
              </button>
            ))}
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08} key={activeTab}>
            {(tabProducts[activeTab as keyof typeof tabProducts] ?? catalogProducts.slice(0, 4)).map(p => (
              <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>
            ))}
          </StaggerContainer>
          <div className="text-center mt-10">
            <Link to="/urunler" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A73E8] hover:underline">Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ========== NEDEN AQUAILS ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#EEF6FF] to-[#F7FAFF] relative">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#1A73E8]/[0.025] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Neden Aquails?</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">Fark Yaratan Teknoloji</h2>
            <p className="text-sm sm:text-[15px] text-[#5A6B7B] mt-3 max-w-xl mx-auto">17 yıllık deneyim ve en son teknoloji ile ürettiğimiz çözümler, ailenizin sağlığını ön planda tutar.</p>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
            {nedenAquails.map(f => (
              <StaggerItem key={f.title}>
                <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 hover:shadow-lg hover:border-[#1A73E8]/20 transition-all duration-300 h-full">
                  <div className="w-11 h-11 bg-[#F0F6FF] rounded-xl flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0D2137]">{f.title}</h3>
                  <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========== NASIL CALISIR ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#F0F6FF] via-[#F7FAFF] to-[#F8FBFF] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1A73E8]/[0.015] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Nasıl Çalışır?</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">3 Adımda Temiz Su</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-[#E8F0FE] -translate-y-1/2 z-0" />
            {nasilCalisir.map((s, i) => (
              <ScrollReveal key={s.step} y={20} delay={i * 0.15} className="relative z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white border-2 border-[#1A73E8] rounded-2xl flex items-center justify-center mx-auto shadow-md mb-5">
                    <s.icon className="w-7 h-7 text-[#1A73E8]" />
                  </div>
                  <span className="text-xs font-bold text-[#1A73E8] bg-[#F0F6FF] px-3 py-1 rounded-full">Adım {s.step}</span>
                  <h3 className="text-lg font-semibold text-[#0D2137] mt-4">{s.title}</h3>
                  <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FILTRE ABONELIGI ========== */}
      <section className="py-16 md:py-20 bg-[#F7FAFF] relative">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#00D4C8]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal x={-20}>
              <img src="/images/filter-subscription.jpg" alt="Filtre Aboneliği" className="rounded-2xl shadow-lg w-full object-cover aspect-video" loading="lazy" />
            </ScrollReveal>
            <ScrollReveal x={20} delay={0.1}>
              <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Filtre Aboneliği</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2 leading-tight">Filtre Değişim Tarihini Unutmayın</h2>
              <p className="text-sm sm:text-[15px] text-[#5A6B7B] mt-4 leading-relaxed">
                Filtre aboneliği ile 6 ayda veya 12 ayda bir otomatik filtre seti teslimatı alın. İndirimli fiyatlarla, kapınıza kadar teslim.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                {[
                  { title: '6 Aylık', price: '1.499 ₺', desc: 'Yarı yıllık set' },
                  { title: '12 Aylık', price: '2.699 ₺', desc: 'Yıllık set (%10 indirimli)', highlight: true },
                  { title: 'Premium', price: '4.499 ₺', desc: 'Bakım + filtre paketi', highlight: true },
                ].map(p => (
                  <div key={p.title} className={cn('border rounded-2xl p-4 text-center', p.highlight ? 'border-[#1A73E8] bg-[#F0F6FF]' : 'border-[#E8F0FE]')}>
                    <p className="text-sm font-semibold text-[#0D2137]">{p.title}</p>
                    <p className="text-xl font-bold text-[#1A73E8] mt-1">{p.price}</p>
                    <p className="text-[11px] text-[#8B9DAF] mt-1">{p.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/filtre-aboneligi" className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1557B0] transition-all">Aboneliği İncele <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/servis-randevusu" className="inline-flex items-center gap-2 border border-[#E8F0FE] text-[#5A6B7B] px-6 py-3 rounded-full font-medium text-sm hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all">Filtre Değişim Talebi</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========== SERVIS & KURULUM ========== */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal x={-20} className="order-2 lg:order-1">
              <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Servis & Kurulum</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2 leading-tight">Profesyonel Kurulum, Kesintisiz Hizmet</h2>
              <p className="text-sm sm:text-[15px] text-[#5A6B7B] mt-4 leading-relaxed">Uzman ekibimiz cihazınızın kurulumundan periyodik bakımına kadar her adımda yanınızda.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  { icon: Package, title: 'Yeni Cihaz Kurulumu', desc: 'Ücretsiz profesyonel montaj' },
                  { icon: RefreshCw, title: 'Filtre Değişimi', desc: 'Hızlı ve hijyenik değişim' },
                  { icon: Wrench, title: 'Arıza/Bakım', desc: '7/24 teknik destek' },
                  { icon: Building2, title: 'Bina Girişi Filtrasyon', desc: 'Endüstriyel çözümler' },
                ].map(s => (
                  <div key={s.title} className="flex items-start gap-3 bg-white border border-[#E8F0FE] rounded-xl p-4">
                    <div className="w-9 h-9 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0"><s.icon className="w-4 h-4 text-[#1A73E8]" /></div>
                    <div><p className="text-sm font-semibold text-[#0D2137]">{s.title}</p><p className="text-[11px] text-[#8B9DAF] mt-0.5">{s.desc}</p></div>
                  </div>
                ))}
              </div>
              <Link to="/servis-randevusu" className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1557B0] transition-all mt-8">Servis Randevusu Oluştur <ArrowRight className="w-4 h-4" /></Link>
            </ScrollReveal>
            <ScrollReveal x={20} delay={0.1} className="order-1 lg:order-2">
              <img src="/images/service-installation.jpg" alt="Servis Kurulum" className="rounded-2xl shadow-lg w-full object-cover aspect-video" loading="lazy" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========== KAMPANYALAR ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#F7FAFF] to-white relative">
        <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-[#F59E0B]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Kampanyalar</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">Kaçırılmayacak Fırsatlar</h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5" staggerDelay={0.1}>
            {kampanyalar.map(k => (
              <StaggerItem key={k.code}>
                <div className="group relative rounded-2xl overflow-hidden h-[260px]">
                  <img src={k.image} alt={k.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white leading-tight">{k.title}</h3>
                    <p className="text-sm text-white/80 mt-1">{k.desc}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">{k.code}</span>
                      <Link to={`/kampanya/${k.slug}`} className="text-white text-xs font-semibold flex items-center gap-1 hover:underline">İncele <ArrowRight className="w-3 h-3" /></Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========== MUSTERI YORUMLARI ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#EEF6FF] to-[#F0F6FF] relative">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Müşteri Yorumları</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">10.000&apos;den Fazla Mutlu Müşteri</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <RatingStars rating={5} size="md" /><span className="font-bold text-lg text-[#0D2137] ml-2">{avgRating} / 5.0</span>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
            {reviews.slice(0, 6).map((y) => (
              <StaggerItem key={y.id}>
                <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <RatingStars rating={y.rating} size="sm" />
                    {y.verified && <span className="text-[10px] bg-[#00C9A7]/10 text-[#00C9A7] font-medium px-2 py-0.5 rounded-full ml-auto">Onayli Alici</span>}
                  </div>
                  <p className="text-sm text-[#5A6B7B] leading-relaxed">&ldquo;{y.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F0F6FF]">
                    <div className="w-9 h-9 bg-[#1A73E8]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#1A73E8]">{y.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0D2137]">{y.name}</p>
                      <p className="text-[11px] text-[#8B9DAF]">{y.city} &middot; {y.product}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========== BLOG ========== */}
      <section className="py-16 md:py-20 bg-[#F7FAFF] relative">
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4FC3F7]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Blog & Bilgi Merkezi</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">Su Arıtma Rehberi</h2>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#5A6B7B] hover:text-[#1A73E8] transition-colors">Tüm Yazılar <ArrowRight className="w-4 h-4" /></Link>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {blogPosts.slice(0, 3).map((b) => (
              <StaggerItem key={b.id}>
                <Link to={`/blog/${b.slug}`} className="group block bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#1A73E8] bg-[#F0F6FF] px-2 py-0.5 rounded-full">{b.category}</span>
                      <span className="text-[11px] text-[#8B9DAF]">{b.readTime}</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0D2137] leading-snug group-hover:text-[#1A73E8] transition-colors line-clamp-2">{b.title}</h3>
                    <p className="text-sm text-[#5A6B7B] mt-2 line-clamp-2">{b.excerpt}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========== SSS ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#F7FAFF] to-[#F8FBFF] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#1A73E8]/[0.01] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[720px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-10">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Sıkça Sorulan Sorular</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">Merak Ettikleriniz</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faqAnasayfa.map((f, i) => (
              <ScrollReveal key={i} y={10} delay={i * 0.05}>
                <div className={cn('bg-white rounded-2xl overflow-hidden transition-all', openFaq === String(i) ? 'shadow-md ring-1 ring-[#1A73E8]/10' : 'shadow-sm border border-[#E8F0FE]')}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === String(i) ? null : String(i))} className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className={cn('text-sm font-semibold pr-4', openFaq === String(i) ? 'text-[#1A73E8]' : 'text-[#0D2137]')}>{f.q}</span>
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all', openFaq === String(i) ? 'bg-[#1A73E8] text-white rotate-180' : 'bg-[#F0F6FF] text-[#8B9DAF]')}><ChevronDown className="w-3.5 h-3.5" /></div>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === String(i) ? 'auto' : 0, opacity: openFaq === String(i) ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-[#F0F6FF]"><p className="text-sm text-[#5A6B7B] leading-relaxed pt-4">{f.a}</p></div>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/sss" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A73E8] hover:underline">
              Tüm SSS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </PageLayout>
    </>
  );
}
