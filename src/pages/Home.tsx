import { Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, ArrowRight, ChevronDown, ShieldCheck,
  Droplet, Cpu, Zap, Wrench, RefreshCw, Sparkles,
  Search, Calendar, ClipboardCheck, Gauge, FlaskConical, BellRing,
  Home as HomeIcon, Monitor, Coffee, Filter, CircleDot, Settings, Plug, ChefHat, Activity,
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { PageContainer } from '@/components/PageContainer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { RatingStars } from '@/components/RatingStars';
import { SEO } from '@/components/SEO';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/SchemaOrg';
import { products as staticProducts, categories as staticCategories } from '@/data';
import { useCatalog } from '@/hooks/useCatalog';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Droplet, Zap, Monitor, Coffee, Filter, CircleDot, Settings, Wrench, Plug, Sparkles, ChefHat, Activity, Home: HomeIcon,
};

const heroSolutions = [
  {
    icon: Droplet,
    title: 'Su Arıtma Cihazları',
    desc: 'Ev ve iş yeri için akıllı RO, direkt akış ve tezgah altı sistemler.',
    href: '/urunler?kategori=su-aritma',
  },
  {
    icon: Filter,
    title: 'Filtre & Bakım',
    desc: 'Orijinal filtre setleri, abonelik planları ve periyodik bakım hizmeti.',
    href: '/filtre-aboneligi',
  },
  {
    icon: Wrench,
    title: 'Kurulum & Servis',
    desc: '500+ servis noktası ile aynı gün kurulum ve 7/24 teknik destek.',
    href: '/servis-randevusu',
  },
];

const miniFeatures = [
  { icon: Gauge, label: 'Sensör Takibi' },
  { icon: FlaskConical, label: '7 Aşamalı Arıtma' },
  { icon: BellRing, label: 'Filtre Hatırlatma' },
  { icon: ShieldCheck, label: '5 Yıl Garanti' },
  { icon: RefreshCw, label: 'Kolay Değişim' },
  { icon: Sparkles, label: 'Mineral Denge' },
];

const nedenAquails = [
  { icon: Cpu, title: 'Akıllı Filtre Teknolojisi', desc: 'Sensör tabanlı gerçek zamanlı su kalitesi izleme ve otomatik filtre değişim uyarıları.' },
  { icon: Droplet, title: 'Sağlıklı Mineral Dengesi', desc: 'Ters ozmoz sonrası kalsiyum ve magnezyum mineralizasyonu ile sağlıklı su.' },
  { icon: Zap, title: 'Sessiz ve Verimli Sistem', desc: '35 dB altında çalışma sesi ve enerji verimli motor teknolojisi.' },
  { icon: Wrench, title: 'Kurulum ve Servis Desteği', desc: 'Türkiye genelinde 500+ servis noktası ile aynı gün kurulum ve bakım.' },
];

const nasilCalisir = [
  { step: '01', title: 'İhtiyacını Belirle', desc: 'Sihirbaz ile evinize en uygun cihazı seçin.', icon: Search },
  { step: '02', title: 'Sipariş Ver', desc: 'Güvenli ödeme veya ücretsiz keşif randevusu alın.', icon: Calendar },
  { step: '03', title: 'Kurulum Yapılsın', desc: 'Uzman ekip aynı gün profesyonel montaj gerçekleştirir.', icon: Wrench },
  { step: '04', title: 'Filtreyi Takip Et', desc: 'Aquails filtre değişimlerini sizin için hatırlatır.', icon: ClipboardCheck },
];

const heroStats = [
  { v: '10.000+', l: 'Mutlu Müşteri' },
  { v: '500+', l: 'Servis Noktası' },
  { v: '%99', l: 'Memnuniyet' },
];

const heroBadges = ['Ücretsiz Keşif', 'Kurulum Desteği', '5 Yıl Garanti', 'Filtre Hatırlatma'];

const impactStats = [
  { v: '10.000+', l: 'Mutlu Müşteri', sub: 'Türkiye geneli' },
  { v: '%99', l: 'Klor Azaltma', sub: 'Laboratuvar testli' },
  { v: '500+', l: 'Servis Noktası', sub: 'Aynı gün destek' },
  { v: '17+', l: 'Yıllık Deneyim', sub: 'Su teknolojisi' },
];

const kampanyalar = [
  { title: 'Direkt Akış Cihazlarda %20 İndirim', desc: 'Tankless sistemlerde özel fırsat.', code: 'DIREKT20', image: '/images/campaign-1.jpg' },
  { title: '2. Filtre Setinde %50', desc: 'İkinci set yarı fiyatına.', code: 'FILTRE50', image: '/images/campaign-3.jpg' },
  { title: 'Ücretsiz Kurulum', desc: 'Tüm cihazlarda profesyonel montaj bedava.', code: 'KURULUM0', image: '/images/campaign-2.jpg' },
];

const yorumlar = [
  { name: 'Mehmet K.', city: 'İstanbul', rating: 5, product: 'Aquails Smart RO Pro', text: 'Suyun tadı inanılmaz değişti. Kurulum ekibi çok profesyoneldi.', verified: true },
  { name: 'Ayşe Y.', city: 'Ankara', rating: 5, product: 'Aquails DirectFlow 400GPD', text: 'Direkt akış cihaz aldım, anında taze su. Kesinlikle tavsiye ederim.', verified: true },
  { name: 'Fatih S.', city: 'İzmir', rating: 4, product: 'Aquails Compact UnderSink', text: 'Sessiz çalışıyor, fiyat performans harika.', verified: true },
];

const blogYazilar = [
  { title: 'Su Arıtma Cihazı Seçerken Nelere Dikkat Edilmeli?', category: 'Rehber', readTime: '5 dk', image: '/images/blog-1.jpg' },
  { title: 'Filtre Değişimi Ne Zaman Yapılmalı?', category: 'Bakım', readTime: '3 dk', image: '/images/blog-2.jpg' },
  { title: 'Direkt Akış Su Arıtma Nedir?', category: 'Teknoloji', readTime: '4 dk', image: '/images/blog-3.jpg' },
];

const faqAnasayfa = [
  { q: 'Su arıtma cihazı kurulumu ne kadar sürer?', a: 'Standart ev tipi kurulum ortalama 45-60 dakika sürer.' },
  { q: 'Filtre değişimi kaç ayda bir yapılır?', a: 'Sediment ve karbon filtreler 6-12 ay, RO membran 24-36 ayda değiştirilmelidir.' },
  { q: 'Garanti süresi nedir?', a: '5 yıl ana cihaz garantisi ve ömür boyu teknik destek sunuyoruz.' },
];

const categoryImages: Record<string, string> = {
  'su-aritma': '/images/products/su-aritma-cihazlari.jpg',
};

export default function Home() {
  const { products, categories } = useCatalog();
  const catalogProducts = products.length > 0 ? products : staticProducts;
  const catalogCategories = categories.length > 0 ? categories : staticCategories;
  const [activeTab, setActiveTab] = useState('cok-satanlar');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const tabProducts: Record<string, typeof products> = {
    'cok-satanlar': catalogProducts.filter(p => p.rating >= 4.5).slice(0, 4),
    'yeni-gelenler': catalogProducts.filter(p => p.badge === 'new').slice(0, 4),
    'kampanyali': catalogProducts.filter(p => p.discountPercent && p.discountPercent > 0).slice(0, 4),
    'su-aritma': catalogProducts.filter(p => p.categorySlug === 'su-aritma').slice(0, 4),
  };

  const shownCategories = catalogCategories.filter(c => categoryImages[c.id]).slice(0, 6);

  return (
    <>
      <SEO
        title="Aquails | Daha Temiz Su, Daha Akıllı Teknoloji"
        description="Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar."
        canonical="/"
        schema={{ ...getOrganizationSchema(), ...getWebsiteSchema() }}
      />
      <PageLayout variant="default">
        {/* ——— HERO: Split layout + zengin görseller ——— */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E8F4FF]">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            aria-hidden
          />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1A73E8]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00D4C8]/10 rounded-full blur-3xl pointer-events-none" />

          <PageContainer className="relative py-12 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="min-w-0 order-2 lg:order-1"
              >
                <div className="flex flex-wrap gap-2 mb-5">
                  {heroBadges.map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[11px] sm:text-xs font-medium text-[#1A73E8] px-3 py-1.5 rounded-full border border-[#1A73E8]/15 shadow-sm">
                      <Check className="w-3 h-3 flex-shrink-0" />{b}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#0D2137] leading-[1.12] text-balance">
                  Daha Temiz Su,
                  <span className="block gradient-text mt-1">Daha Akıllı Teknoloji</span>
                </h1>
                <p className="text-sm sm:text-base text-[#5A6B7B] mt-5 leading-relaxed max-w-lg">
                  Aquails; eviniz ve iş yeriniz için modern su arıtma cihazları, akıllı filtre takibi ve profesyonel servis hizmetlerini tek platformda sunar.
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    to="/urunler"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#1557B0] text-white px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#1A73E8]/25 transition-all"
                  >
                    Ürünleri İncele <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/servis-randevusu"
                    className="inline-flex items-center gap-2 bg-white border-2 border-[#1A73E8]/30 text-[#1A73E8] px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#F0F6FF] transition-all shadow-sm"
                  >
                    Servis Randevusu
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-10">
                  {heroStats.map(s => (
                    <div key={s.l} className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center border border-[#E8F0FE] shadow-aquails card-lift">
                      <p className="text-lg sm:text-2xl font-bold text-[#0D2137]">{s.v}</p>
                      <p className="text-[10px] sm:text-[11px] text-[#8B9DAF] mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative min-w-0 order-1 lg:order-2"
              >
                <div className="absolute -inset-3 bg-gradient-to-br from-[#1A73E8]/25 to-[#00D4C8]/20 rounded-[2rem] blur-2xl pointer-events-none" />
                <div className="relative bg-white rounded-3xl p-3 sm:p-4 shadow-aquails-hover border border-white/80">
                  <img
                    src="/images/hero-product.jpg"
                    alt="Aquails Su Arıtma Cihazı"
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-3 left-2 sm:-bottom-4 sm:left-0 bg-white rounded-2xl p-3 sm:p-4 shadow-lg border border-[#E8F0FE] max-w-[210px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00C9A7] to-[#00D4C8] rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0D2137]">5 Yıl Garanti</p>
                      <p className="text-[10px] text-[#8B9DAF]">Tam kapsamlı destek</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 right-2 sm:-top-3 sm:right-0 bg-white rounded-2xl px-3 py-2 shadow-lg border border-[#E8F0FE]">
                  <p className="text-xs font-bold text-[#1A73E8]">★ 4.9 / 5</p>
                  <p className="text-[10px] text-[#8B9DAF]">10.000+ müşteri</p>
                </div>
              </motion.div>
            </div>
          </PageContainer>
        </section>

        {/* ——— Görsel galeri şeridi ——— */}
        <section className="py-6 bg-white border-y border-[#E8F0FE]/80 overflow-hidden">
          <div className="responsive-scroll-x">
            <div className="flex gap-3 px-4 sm:px-6 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4 sm:max-w-[1280px] sm:mx-auto">
              {[
                { src: '/images/service-installation.jpg', label: 'Profesyonel Kurulum' },
                { src: '/images/filter-subscription.jpg', label: 'Filtre Aboneliği' },
                { src: '/images/campaign-1.jpg', label: 'Kampanyalar' },
                { src: '/images/about-hero.jpg', label: 'Su Teknolojisi' },
              ].map((img) => (
                <div key={img.label} className="relative w-[220px] sm:w-auto h-[120px] sm:h-[140px] rounded-2xl overflow-hidden flex-shrink-0 card-lift">
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/70 to-transparent" />
                  <p className="absolute bottom-2 left-3 text-xs font-semibold text-white">{img.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ——— OVERLAPPING SOLUTION CARDS ——— */}
        <section className="relative z-20 pb-4 pt-6">
          <PageContainer>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.1}>
              {heroSolutions.map((s) => (
                <StaggerItem key={s.title}>
                  <Link
                    to={s.href}
                    className="group block bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-aquails-hover border border-[#E8F0FE]/80 card-lift h-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A73E8] to-[#4FC3F7] flex items-center justify-center mb-4 shadow-lg shadow-[#1A73E8]/20 group-hover:scale-105 transition-transform">
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0D2137] group-hover:text-[#1A73E8] transition-colors">{s.title}</h3>
                    <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A73E8] mt-4">
                      Keşfet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </PageContainer>
        </section>

        {/* ——— MINI FEATURES ——— */}
        <section className="py-10 sm:py-14 bg-[#F7FAFF]">
          <PageContainer>
            <ScrollReveal className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D2137]">
                <span className="wavy-underline inline-block">Akıllı Su Çözümleri</span>
              </h2>
              <p className="text-sm text-[#5A6B7B] mt-4 max-w-xl mx-auto">
                Sensör destekli teknoloji, orijinal filtreler ve profesyonel servis ağı ile güvenilir su deneyimi.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {miniFeatures.map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#E8F0FE] card-lift">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F6FF] flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#0D2137] text-center">{f.label}</span>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— PRODUCTS ——— */}
        <section className="page-section bg-white">
          <PageContainer>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">Koleksiyon</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] mt-2">Öne Çıkan Ürünler</h2>
              </div>
              <div className="responsive-scroll-x">
                <div className="flex gap-2 min-w-max pb-1">
                  {[
                    { key: 'cok-satanlar', label: 'Çok Satanlar' },
                    { key: 'yeni-gelenler', label: 'Yeni' },
                    { key: 'kampanyali', label: 'Kampanyalı' },
                    { key: 'su-aritma', label: 'Su Arıtma' },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                        activeTab === t.key ? 'bg-[#0D2137] text-white' : 'bg-[#F8FBFF] text-[#5A6B7B] border border-[#E8F0FE]',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.08} key={activeTab}>
              {(tabProducts[activeTab] || catalogProducts.slice(0, 4)).map(p => (
                <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>
              ))}
            </StaggerContainer>
            <div className="text-center mt-10">
              <Link to="/urunler" className="inline-flex items-center gap-2 border-2 border-[#0D2137] text-[#0D2137] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#0D2137] hover:text-white transition-all">
                Tüm Ürünler <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* ——— DARK STATS (CropSync style) ——— */}
        <section className="relative bg-[#0B1D3A] overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A73E8]/20 rounded-full blur-3xl pointer-events-none" />
          <PageContainer className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ScrollReveal>
                <span className="text-xs font-semibold text-[#4FC3F7] tracking-widest uppercase">Neden Aquails?</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
                  Modern Su Operasyonları İçin Tasarlandı
                </h2>
                <p className="text-white/65 mt-4 leading-relaxed text-sm sm:text-base">
                  17 yıllık deneyim, akıllı sensör teknolojisi ve Türkiye geneli servis ağı ile ailenizin sağlığını ön planda tutuyoruz.
                </p>
                <ul className="mt-8 space-y-3">
                  {['7 aşamalı filtre teknolojisi', 'Akıllı filtre değişim uyarıları', 'Orijinal yedek parça garantisi', 'Ücretsiz profesyonel kurulum'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#1A73E8]/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#4FC3F7]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <StaggerContainer className="grid grid-cols-2 gap-3 sm:gap-4" staggerDelay={0.08}>
                {nedenAquails.map(f => (
                  <StaggerItem key={f.title}>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 h-full card-lift">
                      <f.icon className="w-6 h-6 text-[#4FC3F7] mb-3" />
                      <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                      <p className="text-xs text-white/55 mt-1.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </PageContainer>
        </section>

        {/* ——— IMPACT NUMBERS ——— */}
        <section className="py-12 sm:py-16 bg-[#EEF6FF] border-y border-[#E8F0FE]">
          <PageContainer>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {impactStats.map(s => (
                <ScrollReveal key={s.l} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-[#1A73E8]">{s.v}</p>
                  <p className="text-sm font-semibold text-[#0D2137] mt-1">{s.l}</p>
                  <p className="text-xs text-[#8B9DAF] mt-0.5">{s.sub}</p>
                </ScrollReveal>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— HOW IT WORKS ——— */}
        <section className="page-section bg-white">
          <PageContainer>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">Süreç</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D2137] mt-2">Nasıl Çalışır?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {nasilCalisir.map((s, i) => (
                <ScrollReveal key={s.step} delay={i * 0.08}>
                  <div className="relative bg-[#F8FBFF] border border-[#E8F0FE] rounded-2xl p-6 h-full card-lift text-center">
                    <span className="text-[10px] font-bold text-[#1A73E8] tracking-wider">ADIM {s.step}</span>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-aquails flex items-center justify-center mx-auto mt-3 mb-4">
                      <s.icon className="w-6 h-6 text-[#1A73E8]" />
                    </div>
                    <h3 className="font-semibold text-[#0D2137]">{s.title}</h3>
                    <p className="text-sm text-[#5A6B7B] mt-2">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— FULL WIDTH VISUAL ——— */}
        <section className="relative h-[280px] sm:h-[360px] overflow-hidden">
          <img src="/images/filter-subscription.jpg" alt="Aquails su arıtma" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#0D2137]/50" />
          <PageContainer className="relative h-full flex items-center">
            <div className="max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Her Damla Güvenle Arıtılmış</h2>
              <p className="text-white/75 mt-3 text-sm sm:text-base">Laboratuvar testli filtre teknolojisi ile sağlıklı, lezzetli su.</p>
              <Link to="/urun-secim-sihirbazi" className="inline-flex items-center gap-2 mt-6 bg-white text-[#0D2137] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#F0F6FF] transition-colors">
                Sihirbaz ile Seç <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* ——— KATEGORILER ——— */}
        {shownCategories.length > 0 && (
          <section className="page-section bg-[#F7FAFF]">
            <PageContainer>
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0D2137]">Kategoriler</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {shownCategories.map(cat => {
                  const Icon = iconMap[cat.icon] || Droplet;
                  const img = categoryImages[cat.id] || '/images/products/placeholder.jpg';
                  return (
                    <Link key={cat.id} to={`/urunler?kategori=${cat.id}`} className="group relative rounded-2xl overflow-hidden aspect-[4/5] card-lift">
                      <img src={img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/90 to-transparent" />
                      <div className="absolute bottom-0 p-3 text-white w-full">
                        <Icon className="w-4 h-4 mb-1 text-[#4FC3F7]" />
                        <p className="text-xs font-semibold">{cat.name}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </PageContainer>
          </section>
        )}

        {/* ——— KAMPANYALAR ——— */}
        <section className="page-section bg-white">
          <PageContainer>
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D2137]">Kampanyalar</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {kampanyalar.map(k => (
                <Link key={k.code} to="/kampanyalar" className="group relative rounded-3xl overflow-hidden h-[220px] sm:h-[260px] card-lift block">
                  <img src={k.image} alt={k.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 p-5 sm:p-6">
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur px-2 py-1 rounded-full text-white">{k.code}</span>
                    <h3 className="text-lg font-bold text-white mt-2">{k.title}</h3>
                    <p className="text-sm text-white/75 mt-1">{k.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— YORUMLAR ——— */}
        <section className="page-section bg-[#EEF6FF]">
          <PageContainer>
            <div className="text-center mb-10">
              <RatingStars rating={5} size="md" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D2137] mt-3">Müşterilerimiz Ne Diyor?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {yorumlar.map((y, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8F0FE] card-lift">
                  <RatingStars rating={y.rating} size="sm" />
                  <p className="text-sm text-[#5A6B7B] mt-3 leading-relaxed">&ldquo;{y.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F0F6FF]">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#1A73E8] to-[#4FC3F7] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{y.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0D2137]">{y.name}</p>
                      <p className="text-[11px] text-[#8B9DAF]">{y.city} · {y.product}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— BLOG ——— */}
        <section className="page-section bg-white">
          <PageContainer>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-[#0D2137]">Su Arıtma Rehberi</h2>
              <Link to="/blog" className="text-sm font-medium text-[#1A73E8] hover:underline hidden sm:inline-flex items-center gap-1">
                Tüm Yazılar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {blogYazilar.map((b, i) => (
                <Link key={i} to="/blog" className="group rounded-2xl overflow-hidden border border-[#E8F0FE] card-lift">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[#1A73E8] font-medium">{b.category} · {b.readTime}</span>
                    <h3 className="text-sm font-semibold text-[#0D2137] mt-1 group-hover:text-[#1A73E8] transition-colors line-clamp-2">{b.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— FAQ ——— */}
        <section className="page-section bg-[#F7FAFF]">
          <PageContainer className="max-w-[720px]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#0D2137]">Sıkça Sorulan Sorular</h2>
            </div>
            <div className="space-y-3">
              {faqAnasayfa.map((f, i) => (
                <div key={i} className={cn('bg-white rounded-2xl overflow-hidden border', openFaq === String(i) ? 'border-[#1A73E8]/30 shadow-md' : 'border-[#E8F0FE]')}>
                  <button onClick={() => setOpenFaq(openFaq === String(i) ? null : String(i))} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                    <span className="text-sm font-semibold text-[#0D2137]">{f.q}</span>
                    <ChevronDown className={cn('w-4 h-4 flex-shrink-0 transition-transform', openFaq === String(i) && 'rotate-180 text-[#1A73E8]')} />
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === String(i) ? 'auto' : 0, opacity: openFaq === String(i) ? 1 : 0 }} className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-[#5A6B7B] leading-relaxed border-t border-[#F0F6FF] pt-4">{f.a}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* ——— FINAL CTA ——— */}
        <section className="relative bg-gradient-to-br from-[#1A73E8] to-[#0D2137] py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-product.jpg')] bg-cover bg-center opacity-10" />
          <PageContainer className="relative text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-balance">
              Temiz Su Yolculuğunuza Bugün Başlayın
            </h2>
            <p className="text-white/75 mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Ücretsiz keşif randevusu alın veya ürün kataloğumuzu inceleyin.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to="/urunler" className="bg-white text-[#0D2137] px-8 py-4 rounded-full font-semibold hover:bg-[#F0F6FF] transition-all">
                Alışverişe Başla
              </Link>
              <Link to="/iletisim" className="border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all">
                Bize Ulaşın
              </Link>
            </div>
          </PageContainer>
        </section>
      </PageLayout>
    </>
  );
}
