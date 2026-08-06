import { Link } from 'react-router';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Clock, Award, Truck,
  Droplet, Cpu, Zap, Shield, Wrench, RefreshCw, Sparkles,
  Search, Calendar, ClipboardCheck, Check, Users,
  Home as HomeIcon, Monitor, Coffee, Filter, CircleDot, Settings, Plug, ChefHat, Activity, Building2,
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { SEO } from '@/components/SEO';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/SchemaOrg';
import { AquailsButton, SectionHeading, MetricStat } from '@/components/design';
import { products as staticProducts, categories as staticCategories } from '@/data';
import { useCatalog } from '@/hooks/useCatalog';
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

const trustRow = [
  { icon: Truck, label: 'Ücretsiz Kargo', desc: '1.500₺ üzeri siparişlerde' },
  { icon: Wrench, label: 'Ücretsiz Kurulum', desc: 'Profesyonel montaj ekibi' },
  { icon: ShieldCheck, label: '5 Yıl Garanti', desc: 'Tam kapsamlı güvence' },
  { icon: Clock, label: 'Aynı Gün Servis', desc: '500+ servis noktası' },
  { icon: Award, label: 'Yetkili Servis', desc: 'Orijinal yedek parça' },
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

const heroBadges = ['Ücretsiz Keşif', 'Kurulum Desteği', '5 Yıl Garanti', 'Filtre Hatırlatma'];

function pickProducts(list: Product[], fallback: Product[], limit = 4): Product[] {
  if (list.length > 0) return list.slice(0, limit);
  return fallback.slice(0, limit);
}

function CategoryCard({
  id,
  name,
  productCount,
  icon,
  image,
}: {
  id: string;
  name: string;
  productCount: number;
  icon: string;
  image: string;
}) {
  const Icon = iconMap[icon] || Droplet;

  return (
    <Link
      to={`/urunler?kategori=${id}`}
      className="group flex h-full min-w-0 w-full max-w-full flex-col overflow-hidden rounded-xl border border-aq-border/60 bg-white transition-all duration-300 hover:border-aq-blue/20 sm:rounded-2xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-aq-ice">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex min-h-[4.5rem] flex-1 flex-col items-center justify-start px-1.5 py-2 text-center sm:min-h-[4.75rem] sm:px-3 sm:py-3">
        <Icon className="mb-1 h-3.5 w-3.5 flex-shrink-0 text-aq-blue sm:h-4 sm:w-4" aria-hidden />
        <h3 className="w-full max-w-full break-words text-[11px] font-semibold leading-snug text-aq-text transition-colors line-clamp-2 group-hover:text-aq-blue sm:text-xs">
          {name}
        </h3>
        <p className="mt-auto pt-1 text-[10px] leading-none text-aq-muted">
          {productCount} ürün
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { products, categories } = useCatalog();
  const catalogProducts = products.length > 0 ? products : staticProducts;
  const catalogCategories = categories.length > 0 ? categories : staticCategories;
  const [activeTab, setActiveTab] = useState('cok-satanlar');

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

  return (
    <>
      <SEO
        title="Aquails | Yeni Nesil Su Arıtma Teknolojisi"
        description="Aquails, eviniz ve işletmeniz için sağlıklı, güvenilir ve ölçülebilir su kalitesi sunar. Su arıtma cihazları, filtre setleri ve servis çözümleri."
        canonical="/"
        schema={{ ...getOrganizationSchema(), ...getWebsiteSchema() }}
      />
      <PageLayout>
        {/* ========== 1. HERO ========== */}
        <section className="px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-5">
          <div className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] md:rounded-[40px] lg:rounded-[48px] hero-aqua">
            {/* Decorative water glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-32 right-[10%] w-[480px] h-[480px] rounded-full bg-aq-aqua/15 blur-[110px]" />
              <div className="absolute -bottom-24 left-[5%] w-[420px] h-[420px] rounded-full bg-aq-blue/25 blur-[100px]" />
              <div className="absolute inset-0 opacity-[0.05] tech-grid" />
            </div>

            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-9 sm:py-12 md:py-16 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Left copy */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="min-w-0"
                >
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                    {heroBadges.map((b) => (
                      <span key={b} className="inline-flex items-center gap-1.5 bg-white/[0.07] backdrop-blur-sm text-[10px] sm:text-[11px] font-medium text-white/85 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15">
                        <Check className="w-3 h-3 text-aq-aqua flex-shrink-0" />{b}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-[1.7rem] sm:text-4xl md:text-[2.9rem] lg:text-5xl font-bold text-white leading-[1.15]">
                    Yeni Nesil<br />
                    <span className="text-aq-aqua">Su Arıtma</span> Teknolojisi
                  </h1>
                  <p className="text-sm sm:text-base text-white/70 mt-4 sm:mt-5 leading-relaxed max-w-md">
                    Aquails, eviniz ve işletmeniz için sağlıklı, güvenilir ve ölçülebilir su kalitesi sunar.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 mt-6 sm:mt-8">
                    <AquailsButton to="/urunler" variant="primary" size="lg" showArrow className="w-full sm:w-auto">
                      Ürünleri İncele
                    </AquailsButton>
                    <AquailsButton href="#nasil-calisir" variant="ghost" size="lg" className="w-full sm:w-auto">
                      Nasıl Çalışır?
                    </AquailsButton>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-10">
                    {[
                      { v: '10.000+', l: 'Mutlu Müşteri' },
                      { v: '500+', l: 'Servis Noktası' },
                      { v: '%99', l: 'Memnuniyet' },
                    ].map((s) => (
                      <div key={s.l} className="min-w-0">
                        <p className="text-lg sm:text-2xl font-bold text-white tabular-nums">{s.v}</p>
                        <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5 leading-snug">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Right product visual */}
                <motion.div
                  initial={{ opacity: 0, x: 32, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="relative mt-2 sm:mt-0"
                >
                  <div className="relative bg-gradient-to-b from-white/[0.10] to-white/[0.04] backdrop-blur-sm border border-white/15 rounded-2xl sm:rounded-[28px] p-2 sm:p-3 md:p-4 max-w-md mx-auto">
                    <img
                      src="/images/hero-product.jpg"
                      alt="Aquails Su Arıtma Cihazı"
                      className="w-full aspect-[4/3] object-cover rounded-xl sm:rounded-[20px]"
                    />
                  </div>
                  <div className="absolute -bottom-3 -left-1 sm:-bottom-4 sm:-left-2 md:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-sm p-2.5 sm:p-3.5 hidden sm:flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-aq-sky rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-4.5 h-4.5 text-aq-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-aq-text">5 Yıl Garanti</p>
                      <p className="text-[10px] text-aq-muted">Tam Kapsamlı</p>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 md:-right-4 bg-white rounded-xl sm:rounded-2xl shadow-sm p-2.5 sm:p-3.5 hidden sm:flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-aq-sky rounded-xl flex items-center justify-center">
                      <Droplet className="w-4.5 h-4.5 text-aq-aqua" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-aq-text">7 Aşama</p>
                      <p className="text-[10px] text-aq-muted">Filtrasyon</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 2. GUVEN / OZELLIK SATIRI ========== */}
        <section className="py-8 sm:py-12 md:py-16 border-b border-aq-border/50 bg-white">
          <div className="page-container">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-5 sm:gap-6 md:gap-8">
              {trustRow.map((t) => (
                <div key={t.label} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-aq-sky/70 flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-aq-blue" strokeWidth={1.9} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] sm:text-[13px] font-medium text-aq-text leading-tight">{t.label}</p>
                    <p className="text-[10px] sm:text-[11px] text-aq-muted mt-0.5 leading-snug">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 3. METRICS ========== */}
        <section className="py-12 sm:py-16 md:py-24 bg-white">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <ScrollReveal>
                <h2 className="text-2xl md:text-3xl lg:text-[2.4rem] font-bold text-aq-text leading-tight">
                  Temiz Su,<br />Ölçülebilir Sonuçlar
                </h2>
                <div className="flex items-center gap-3 mt-5 sm:mt-6 flex-wrap">
                  <div className="flex -space-x-2">
                    {['A', 'M', 'S', 'E'].map((c) => (
                      <div key={c} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-aq-blue to-aq-deep border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                        {c}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-aq-aqua flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-aq-deep" />
                    </div>
                    <span className="text-xs sm:text-sm text-aq-muted font-medium">Güvenen 10.000+ aile</span>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8">
                  <MetricStat value="50M+" label="Filtrelenen Litre" />
                  <MetricStat value="2M+" label="Kurtarılan Plastik Şişe" />
                  <MetricStat value="%99" label="Müşteri Memnuniyeti" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ========== 4. KATEGORILER ========== */}
        <section className="overflow-x-clip bg-aq-ice/50 py-12 sm:py-16 md:py-24">
          <div className="page-container">
            <SectionHeading
              tag="Kategoriler"
              title="İhtiyacınıza Uygun Çözümler"
              description="Modern su arıtma teknolojileri, filtre sistemleri ve profesyonel hizmetler tek çatı altında."
            />
            <StaggerContainer
              className="grid w-full min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5"
              staggerDelay={0.06}
            >
              {shownCategories.map((cat) => (
                <StaggerItem key={cat.id} className="min-w-0 h-full max-w-full">
                  <CategoryCard
                    id={cat.id}
                    name={cat.name}
                    productCount={cat.productCount}
                    icon={cat.icon}
                    image={categoryImages[cat.id] || '/images/products/placeholder.jpg'}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ========== 5. ONE CIKAN URUNLER ========== */}
        <section className="py-12 sm:py-16 md:py-24 bg-white">
          <div className="page-container">
            <SectionHeading tag="Öne Çıkan Ürünler" title="En Çok Tercih Edilenler" />
            <div className="responsive-scroll-x mb-7 sm:mb-9">
              <div className="flex sm:flex-wrap sm:justify-center gap-2 min-w-max sm:min-w-0 pb-1 sm:pb-0">
                {[
                  { key: 'cok-satanlar', label: 'Çok Satanlar' },
                  { key: 'yeni-gelenler', label: 'Yeni Gelenler' },
                  { key: 'kampanyali', label: 'Kampanyalı' },
                  { key: 'cihazlar', label: 'Su Arıtma Cihazları' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      'px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap',
                      activeTab === t.key
                        ? 'bg-aq-deep text-white shadow-sm'
                        : 'bg-aq-ice text-aq-muted border border-aq-border/60 hover:border-aq-blue/40 hover:text-aq-blue',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(tabProducts[activeTab as keyof typeof tabProducts] ?? catalogProducts.slice(0, 4)).map((p) => (
                <div key={p.id} className="min-w-0"><ProductCard product={p} /></div>
              ))}
            </div>
            <div className="text-center mt-7 sm:mt-9">
              <Link to="/urunler" className="inline-flex items-center gap-2 text-sm font-semibold text-aq-blue hover:underline">
                Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========== 6. NEDEN AQUAILS ========== */}
        <section className="py-12 sm:py-16 md:py-24 bg-aq-ice/50">
          <div className="page-container">
            <SectionHeading
              tag="Neden Aquails?"
              title="Fark Yaratan Teknoloji"
              description="17 yıllık deneyim ve en son teknoloji ile ürettiğimiz çözümler, ailenizin sağlığını ön planda tutar."
            />
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.08}>
              {nedenAquails.map((f) => (
                <StaggerItem key={f.title}>
                  <div className="bg-white border border-aq-border/60 rounded-2xl p-5 sm:p-7 hover:border-aq-blue/20 transition-all duration-300 h-full">
                    <div className="w-11 h-11 bg-aq-sky rounded-xl flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-aq-blue" />
                    </div>
                    <h3 className="text-base font-semibold text-aq-text">{f.title}</h3>
                    <p className="text-sm text-aq-muted mt-2 leading-relaxed">{f.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ========== 7. NASIL CALISIR ========== */}
        <section id="nasil-calisir" className="py-12 sm:py-16 md:py-24 bg-white scroll-mt-24">
          <div className="page-container">
            <SectionHeading tag="Nasıl Çalışır?" title="3 Adımda Temiz Su" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[18%] right-[18%] h-px bg-aq-border z-0" />
              {nasilCalisir.map((s, i) => (
                <ScrollReveal key={s.step} y={20} delay={i * 0.12} className="relative z-10">
                  <div className="text-center px-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-aq-blue/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <s.icon className="w-6 h-6 sm:w-7 sm:h-7 text-aq-blue" />
                    </div>
                    <span className="text-xs font-medium text-aq-blue bg-aq-sky px-3 py-1 rounded-full">Adım {s.step}</span>
                    <h3 className="text-base sm:text-lg font-semibold text-aq-text mt-3">{s.title}</h3>
                    <p className="text-sm text-aq-muted mt-2 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 8. CTA ========== */}
        <section className="px-3 sm:px-6 lg:px-8 pb-12 sm:pb-14 md:pb-16 pt-2 bg-white">
          <div className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] md:rounded-[40px] hero-aqua">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 right-[15%] w-[380px] h-[380px] rounded-full bg-aq-aqua/15 blur-[90px]" />
              <div className="absolute -bottom-24 left-[10%] w-[340px] h-[340px] rounded-full bg-aq-blue/20 blur-[80px]" />
            </div>
            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14 md:py-20 text-center">
              <ScrollReveal>
                <span className="inline-block text-aq-aqua text-[10px] sm:text-xs font-semibold tracking-[0.18em] sm:tracking-[0.2em] uppercase mb-3 sm:mb-4">
                  Temiz Su · Sağlıklı Yaşam
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto">
                  Size En Uygun Su Arıtma Sistemini Birlikte Bulalım
                </h2>
                <p className="text-sm sm:text-base text-white/65 mt-3 sm:mt-4 max-w-lg mx-auto leading-relaxed">
                  Ücretsiz keşif randevusu alın; uzman ekibimiz su kalitenizi analiz etsin, ihtiyacınıza en uygun çözümü önersin.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8">
                  <AquailsButton to="/servis-randevusu" variant="primary" size="lg" showArrow className="w-full sm:w-auto">
                    Ücretsiz Keşif Randevusu
                  </AquailsButton>
                  <AquailsButton to="/urunler" variant="ghost" size="lg" className="w-full sm:w-auto">
                    Ürünleri İncele
                  </AquailsButton>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mt-7 sm:mt-9 pt-6 sm:pt-7 border-t border-white/10">
                  {[
                    { icon: Users, label: '10.000+ Mutlu Müşteri' },
                    { icon: ShieldCheck, label: '5 Yıl Garanti' },
                    { icon: Wrench, label: 'Ücretsiz Kurulum' },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center justify-center gap-2 text-xs font-medium text-white/70">
                      <Icon className="w-4 h-4 text-aq-aqua flex-shrink-0" />{label}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
