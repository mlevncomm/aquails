import { Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, ArrowRight, ChevronDown, Users, ShieldCheck, Clock, Award,
  Droplet, Cpu, Zap, Shield, Wrench, RefreshCw, Sparkles,
  Search, Calendar, ClipboardCheck, Star, Play,
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

const trustBadges = [
  { icon: Users, label: '10.000+', desc: 'Mutlu Müşteri' },
  { icon: Filter, label: '7 Aşama', desc: 'Filtre Teknolojisi' },
  { icon: Clock, label: 'Aynı Gün', desc: 'Servis Talebi' },
  { icon: ShieldCheck, label: 'Güvenli', desc: 'Alışveriş' },
  { icon: Award, label: 'Yetkili', desc: 'Kurulum Desteği' },
];

const nedenAquails = [
  { icon: Cpu, title: 'Akıllı Filtre Teknolojisi', desc: 'Sensör tabanlı gerçek zamanlı su kalitesi izleme ve otomatik filtre değişim uyarıları.', accent: 'from-blue-500/10 to-cyan-500/10' },
  { icon: Droplet, title: 'Sağlıklı Mineral Dengesi', desc: 'Ters ozmoz sonrası kalsiyum ve magnezyum mineralizasyonu ile sağlıklı su.', accent: 'from-cyan-500/10 to-teal-500/10' },
  { icon: Zap, title: 'Sessiz ve Verimli Sistem', desc: 'Özel izolasyon teknolojisi ile 35 dB altında çalışma sesi, enerji verimli motor.', accent: 'from-violet-500/10 to-blue-500/10' },
  { icon: RefreshCw, title: 'Kolay Filtre Değişimi', desc: 'Tak-çıkar mekanizması ile tek elinizle 30 saniyede filtre değişimi.', accent: 'from-emerald-500/10 to-cyan-500/10' },
  { icon: Wrench, title: 'Kurulum ve Servis Desteği', desc: 'Türkiye genelinde 500+ servis noktası ile aynı gün kurulum ve bakım.', accent: 'from-sky-500/10 to-indigo-500/10' },
  { icon: Shield, title: 'Uzun Ömürlü Yedek Parça', desc: '5 yıl garanti, 10+ yıl yedek parça temini, orijinal parça garantisi.', accent: 'from-amber-500/10 to-orange-500/10' },
];

const nasilCalisir = [
  { step: '01', title: 'İhtiyacına Uygun Cihazı Seç', desc: 'Evinizin su kalitesi ve kullanım alışkanlıklarınıza en uygun su arıtma sistemini keşfedin.', icon: Search },
  { step: '02', title: 'Online Sipariş veya Randevu', desc: 'Güvenli ödeme ile sipariş verin veya ücretsiz keşif randevusu alın.', icon: Calendar },
  { step: '03', title: 'Kurulum ve Filtre Takibi', desc: 'Profesyonel ekibimiz kurulumu yapar, Aquails filtre değişimlerini sizin için takip eder.', icon: ClipboardCheck },
];

const kampanyalar = [
  { title: 'Direkt Akış Cihazlarda Özel İndirim', desc: 'Tankless su arıtma cihazlarında %20\'ye varan indirim fırsatı.', code: 'DIREKT20', bg: 'from-[#1A73E8] to-[#4A90E2]', image: '/images/campaign-1.jpg' },
  { title: 'Filtre Setlerinde 2. Ürüne İndirim', desc: 'İkinci filtre setinde %50 indirim avantajı.', code: 'FILTRE50', bg: 'from-[#0D2137] to-[#1A3A5C]', image: '/images/campaign-3.jpg' },
  { title: 'Ücretsiz Kurulum Fırsatı', desc: 'Tüm su arıtma cihazlarında profesyonel kurulum bedava.', code: 'KURULUM0', bg: 'from-[#00BFA5] to-[#00D9B5]', image: '/images/campaign-2.jpg' },
];

const yorumlar = [
  { name: 'Mehmet K.', city: 'İstanbul', rating: 5, product: 'Aquails Smart RO Pro', text: '3 aydır kullanıyorum, suyun tadı inanılmaz değişti. Kurulum ekibi çok profesyoneldi. Filtre değişim hatırlatması da çok pratik.', verified: true },
  { name: 'Ayşe Y.', city: 'Ankara', rating: 5, product: 'Aquails DirectFlow 400GPD', text: 'Direkt akış cihaz aldım, tank sorunu olmadan anında su. Çocuklarım artık daha çok su içiyor. Kesinlikle tavsiye ederim.', verified: true },
  { name: 'Fatih S.', city: 'İzmir', rating: 4, product: 'Aquails Compact UnderSink', text: 'Tezgah altı çok yer kaplamıyor, sessiz çalışıyor. Fiyat performans olarak harika bir ürün.', verified: true },
  { name: 'Selin D.', city: 'Bursa', rating: 5, product: 'Aquails Smart RO Pro', text: 'İkinci kez alıyorum, annem için de aldım. Akıllı sensör özelliği çok pratik, telefona bildirim geliyor. Servis hızı mükemmel.', verified: true },
  { name: 'Ali R.', city: 'Antalya', rating: 5, product: 'Aquails DirectFlow 600GPD', text: 'İş yerimiz için aldık, çok memnunuz. Yüksek kapasite, düşük su atığı. Teknik destek harika.', verified: true },
  { name: 'Zeynep B.', city: 'Adana', rating: 4, product: 'Aquails Compact UnderSink', text: 'Kurulum aynı gün yapıldı. Cihaz çok şık görünüyor, su kalitesi muazzam. Filtre değişimi de çok kolay.', verified: true },
];

const blogYazilar = [
  { title: 'Su Arıtma Cihazı Seçerken Nelere Dikkat Edilmeli?', category: 'Rehber', readTime: '5 dk', image: '/images/blog-1.jpg', excerpt: 'Eviniz için en uygun su arıtma cihazını seçerken dikkat etmeniz gereken 7 kritik faktör...' },
  { title: 'Filtre Değişimi Ne Zaman Yapılmalı?', category: 'Bakım', readTime: '3 dk', image: '/images/blog-2.jpg', excerpt: 'Filtrelerinizin ömrünü uzatmanın yolları ve değişim sıklığı hakkında bilmeniz gerekenler...' },
  { title: 'Direkt Akış Su Arıtma Nedir?', category: 'Teknoloji', readTime: '4 dk', image: '/images/blog-3.jpg', excerpt: 'Tankless su arıtma sistemlerinin avantajları ve klasik sistemlerden farkları...' },
];

const faqAnasayfa = [
  { q: 'Su arıtma cihazı kurulumu ne kadar sürer?', a: 'Profesyonel ekibimiz standart bir ev tipi kurulumu ortalama 45-60 dakika içinde tamamlar. Direkt akış ve bina girişi sistemleri için süre 1-2 saat arasındadır.' },
  { q: 'Filtre değişimi kaç ayda bir yapılır?', a: 'Sediment filtreler 6-12 ay, karbon filtreler 6-12 ay, RO membran 24-36 ay, mineral filtresi 12 ayda bir değiştirilmelidir. Kullanım yoğunluğuna göre değişebilir.' },
  { q: 'Direkt akış cihazların farkı nedir?', a: 'Direkt akış (tankless) cihazlar suyu anında arıtır ve depolama tankı kullanmaz. Bu sayede daha kompakt boyut, taze su ve bakteri riski olmadan kullanım sağlar.' },
  { q: 'Kargo ve kurulum nasıl ilerler?', a: 'Siparişiniz aynı gün kargoya verilir. Cihaz elinize ulaştığında servis ekibimiz sizi arayarak uygun bir kurulum tarihi belirler. Kurulum ücretsizdir.' },
  { q: 'Garanti süresi nedir?', a: 'Tüm Aquails su arıtma cihazlarında 5 yıl ana cihaz garantisi, 2 yıl elektronik parça garantisi ve ömür boyu teknik destek sunuyoruz.' },
];

const categoryImages: Record<string, string> = {
  'su-aritma': '/images/products/su-aritma-cihazlari.jpg',
};

const heroStats = [
  { v: '10.000+', l: 'Mutlu Müşteri' },
  { v: '500+', l: 'Servis Noktası' },
  { v: '%99', l: 'Memnuniyet' },
];

function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: 'center' | 'left';
}) {
  return (
    <ScrollReveal className={cn('mb-10 md:mb-12', align === 'center' ? 'text-center' : 'text-left')}>
      <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A73E8] tracking-[0.2em] uppercase">
        <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#1A73E8]/40" />
        {eyebrow}
        <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#1A73E8]/40" />
      </span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] mt-3 text-balance">{title}</h2>
      {desc && (
        <p className={cn('text-sm sm:text-base text-[#5A6B7B] mt-3 leading-relaxed max-w-2xl', align === 'center' && 'mx-auto')}>
          {desc}
        </p>
      )}
    </ScrollReveal>
  );
}

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
  const featured = tabProducts[activeTab]?.[0] ?? catalogProducts[0];
  const restProducts = (tabProducts[activeTab] || catalogProducts.slice(0, 4)).slice(1, 4);

  return (
    <>
      <SEO
        title="Aquails | Daha Temiz Su, Daha Akıllı Teknoloji"
        description="Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar."
        canonical="/"
        schema={{ ...getOrganizationSchema(), ...getWebsiteSchema() }}
      />
      <PageLayout>
        {/* HERO */}
        <section className="relative hero-mesh overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-[#1A73E8]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-[5%] w-64 h-64 bg-[#00D4C8]/10 rounded-full blur-3xl pointer-events-none" />

          <PageContainer className="relative py-14 sm:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-w-0">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="min-w-0">
                <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-[#1A73E8]" />
                  <span className="text-xs font-semibold text-[#0D2137]">Türkiye&apos;nin Akıllı Su Teknolojisi Markası</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {['Ücretsiz Keşif', 'Kurulum Desteği', '5 Yıl Garanti', 'Filtre Hatırlatma'].map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-[11px] font-medium text-[#1A73E8] px-3 py-1.5 rounded-full border border-[#1A73E8]/15 shadow-sm">
                      <Check className="w-3 h-3" />{b}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#0D2137] leading-[1.12] text-balance">
                  Daha Temiz Su,
                  <span className="block gradient-text mt-1">Daha Akıllı Teknoloji</span>
                </h1>
                <p className="text-sm sm:text-base text-[#5A6B7B] mt-5 leading-relaxed max-w-lg">
                  Aquails, eviniz ve iş yeriniz için modern su arıtma cihazları, akıllı filtre takibi ve profesyonel servis hizmetlerini tek platformda bir araya getirir.
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/urunler" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#1557B0] text-white px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#1A73E8]/25 transition-all">
                    Ürünleri Keşfet <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/urun-secim-sihirbazi" className="inline-flex items-center gap-2 glass-panel text-[#0D2137] px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm hover:border-[#1A73E8]/30 transition-all">
                    <Play className="w-4 h-4 text-[#1A73E8]" /> Sihirbaz ile Seç
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-10">
                  {heroStats.map(s => (
                    <div key={s.l} className="glass-panel rounded-2xl p-3 sm:p-4 text-center card-lift">
                      <p className="text-lg sm:text-2xl font-bold text-[#0D2137]">{s.v}</p>
                      <p className="text-[10px] sm:text-[11px] text-[#8B9DAF] mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative min-w-0"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-[#1A73E8]/20 via-transparent to-[#00D4C8]/20 rounded-[2rem] blur-2xl pointer-events-none" />
                <div className="relative glass-panel rounded-[1.75rem] p-3 sm:p-4 max-w-md mx-auto">
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src="/images/hero-product.jpg" alt="Aquails Su Arıtma Cihazı" className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/30 via-transparent to-transparent" />
                  </div>
                </div>

                <div className="absolute -bottom-2 left-2 sm:-bottom-4 sm:left-0 glass-panel rounded-2xl p-3 sm:p-4 shadow-lg max-w-[200px]">
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

                <div className="absolute -top-2 right-2 sm:-top-4 sm:right-0 glass-panel rounded-2xl px-3 py-2.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-[#1A73E8]/20 border-2 border-white flex items-center justify-center">
                          <Star className="w-3 h-3 text-[#1A73E8] fill-[#1A73E8]" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0D2137]">4.9 / 5</p>
                      <p className="text-[10px] text-[#8B9DAF]">Müşteri puanı</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </PageContainer>
        </section>

        {/* TRUST MARQUEE */}
        <section className="bg-white border-y border-[#E8F0FE]/80 py-4 overflow-hidden">
          <div className="flex whitespace-nowrap">
            <div className="marquee-track flex items-center gap-10 sm:gap-16 px-4">
              {[...trustBadges, ...trustBadges].map((b, i) => (
                <div key={`${b.label}-${i}`} className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F6FF] flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0D2137]">{b.label}</p>
                    <p className="text-[11px] text-[#8B9DAF]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KATEGORILER */}
        <section className="page-section bg-[#F7FAFF]">
          <PageContainer>
            <SectionHeading
              eyebrow="Kategoriler"
              title="İhtiyacınıza Uygun Çözümler"
              desc="Modern su arıtma teknolojileri, filtre sistemleri ve profesyonel hizmetler tek çatı altında."
            />
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4" staggerDelay={0.06}>
              {shownCategories.map(cat => {
                const Icon = iconMap[cat.icon] || Droplet;
                const img = categoryImages[cat.id] || '/images/products/placeholder.jpg';
                return (
                  <StaggerItem key={cat.id}>
                    <Link to={`/urunler?kategori=${cat.id}`} className="group block relative rounded-2xl overflow-hidden card-lift h-full min-h-[140px] sm:min-h-[180px]">
                      <img src={img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/90 via-[#0D2137]/40 to-[#0D2137]/20 group-hover:from-[#1A73E8]/90 group-hover:via-[#1A73E8]/50 transition-all duration-500" />
                      <div className="relative h-full flex flex-col justify-end p-3 sm:p-4 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-semibold leading-tight">{cat.name}</h3>
                        <p className="text-[10px] text-white/70 mt-0.5">{cat.productCount} ürün</p>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </PageContainer>
        </section>

        {/* ONE CIKAN URUNLER — Bento */}
        <section className="page-section bg-white">
          <PageContainer>
            <SectionHeading eyebrow="Öne Çıkan Ürünler" title="En Çok Tercih Edilenler" />

            <ScrollReveal className="responsive-scroll-x mb-8">
              <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center pb-1">
                {[
                  { key: 'cok-satanlar', label: 'Çok Satanlar' },
                  { key: 'yeni-gelenler', label: 'Yeni Gelenler' },
                  { key: 'kampanyali', label: 'Kampanyalı' },
                  { key: 'su-aritma', label: 'Su Arıtma' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      'px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                      activeTab === t.key
                        ? 'bg-gradient-to-r from-[#1A73E8] to-[#4FC3F7] text-white shadow-md shadow-[#1A73E8]/20'
                        : 'bg-[#F8FBFF] text-[#5A6B7B] border border-[#E8F0FE] hover:border-[#1A73E8]/40',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 min-w-0" key={activeTab}>
              {featured && (
                <ScrollReveal className="lg:col-span-5 min-w-0">
                  <div className="relative h-full min-h-[320px] rounded-3xl overflow-hidden group">
                    <img
                      src={featured.images?.[0] || '/images/products/placeholder.jpg'}
                      alt={featured.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137] via-[#0D2137]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4FC3F7] bg-white/10 backdrop-blur px-2 py-1 rounded-full">Öne Çıkan</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-3 line-clamp-2">{featured.name}</h3>
                      <p className="text-white/80 text-sm mt-2">{featured.price.toLocaleString('tr-TR')} ₺</p>
                      <Link to={`/urun/${featured.slug}`} className="inline-flex items-center gap-2 mt-4 bg-white text-[#0D2137] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#F0F6FF] transition-colors">
                        İncele <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              )}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-w-0">
                {restProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link to="/urunler" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0D2137] px-6 py-3 rounded-full hover:bg-[#1A3A5C] transition-colors">
                Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* NEDEN AQUAILS */}
        <section className="page-section bg-gradient-to-b from-[#EEF6FF] to-[#F7FAFF]">
          <PageContainer>
            <SectionHeading
              eyebrow="Neden Aquails?"
              title="Fark Yaratan Teknoloji"
              desc="17 yıllık deneyim ve en son teknoloji ile ürettiğimiz çözümler, ailenizin sağlığını ön planda tutar."
            />
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.08}>
              {nedenAquails.map(f => (
                <StaggerItem key={f.title}>
                  <div className={cn('relative bg-white rounded-2xl p-6 h-full border border-[#E8F0FE] card-lift overflow-hidden')}>
                    <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60', f.accent)} />
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[#E8F0FE]">
                        <f.icon className="w-6 h-6 text-[#1A73E8]" />
                      </div>
                      <h3 className="text-base font-semibold text-[#0D2137]">{f.title}</h3>
                      <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </PageContainer>
        </section>

        {/* NASIL CALISIR */}
        <section className="page-section bg-white">
          <PageContainer>
            <SectionHeading eyebrow="Nasıl Çalışır?" title="3 Adımda Temiz Su" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative min-w-0">
              <div className="hidden md:block absolute top-[4.5rem] left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-[#1A73E8]/30 to-transparent z-0" />
              {nasilCalisir.map((s, i) => (
                <ScrollReveal key={s.step} y={20} delay={i * 0.12} className="relative z-10">
                  <div className="glass-panel rounded-3xl p-6 sm:p-8 text-center h-full card-lift">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1A73E8] to-[#4FC3F7] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#1A73E8]/20 mb-5">
                      <s.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#1A73E8] bg-[#F0F6FF] px-3 py-1 rounded-full">Adım {s.step}</span>
                    <h3 className="text-lg font-semibold text-[#0D2137] mt-4">{s.title}</h3>
                    <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* FILTRE ABONELIGI + SERVIS — iki kolon kartlar */}
        <section className="page-section bg-[#F7FAFF]">
          <PageContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 min-w-0">
              <ScrollReveal className="glass-panel rounded-3xl overflow-hidden card-lift min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                  <img src="/images/filter-subscription.jpg" alt="Filtre Aboneliği" className="w-full h-48 sm:h-full object-cover min-h-[180px]" loading="lazy" />
                  <div className="p-5 sm:p-6 flex flex-col justify-center min-w-0">
                    <span className="text-xs font-semibold text-[#1A73E8] uppercase tracking-wider">Filtre Aboneliği</span>
                    <h3 className="text-xl font-bold text-[#0D2137] mt-2">Filtre Değişimini Unutmayın</h3>
                    <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed">Otomatik teslimat, indirimli fiyatlar ve kapınıza kadar servis.</p>
                    <Link to="/filtre-aboneligi" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#1A73E8] hover:underline">
                      Aboneliği İncele <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="glass-panel rounded-3xl overflow-hidden card-lift min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                  <img src="/images/service-installation.jpg" alt="Servis Kurulum" className="w-full h-48 sm:h-full object-cover min-h-[180px] order-1 sm:order-none" loading="lazy" />
                  <div className="p-5 sm:p-6 flex flex-col justify-center min-w-0 order-2 sm:order-none">
                    <span className="text-xs font-semibold text-[#1A73E8] uppercase tracking-wider">Servis & Kurulum</span>
                    <h3 className="text-xl font-bold text-[#0D2137] mt-2">Profesyonel Destek</h3>
                    <p className="text-sm text-[#5A6B7B] mt-2 leading-relaxed">Kurulum, bakım ve arıza müdahalesi — 500+ servis noktası.</p>
                    <Link to="/servis-randevusu" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#1A73E8] hover:underline">
                      Randevu Al <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </PageContainer>
        </section>

        {/* KAMPANYALAR */}
        <section className="page-section bg-white">
          <PageContainer>
            <SectionHeading eyebrow="Kampanyalar" title="Kaçırılmayacak Fırsatlar" />
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.1}>
              {kampanyalar.map(k => (
                <StaggerItem key={k.code}>
                  <div className="group relative rounded-3xl overflow-hidden h-[240px] sm:h-[280px] card-lift">
                    <img src={k.image} alt={k.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="text-lg font-bold text-white leading-tight">{k.title}</h3>
                      <p className="text-sm text-white/80 mt-1 line-clamp-2">{k.desc}</p>
                      <div className="flex items-center justify-between mt-4 gap-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">{k.code}</span>
                        <Link to="/kampanyalar" className="text-white text-xs font-semibold flex items-center gap-1 hover:underline whitespace-nowrap">
                          İncele <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </PageContainer>
        </section>

        {/* YORUMLAR */}
        <section className="page-section bg-gradient-to-b from-[#EEF6FF] to-[#F0F6FF]">
          <PageContainer>
            <SectionHeading eyebrow="Müşteri Yorumları" title="10.000'den Fazla Mutlu Müşteri" />
            <ScrollReveal className="flex items-center justify-center gap-2 mb-10">
              <RatingStars rating={5} size="md" />
              <span className="font-bold text-lg text-[#0D2137]">4.9 / 5.0</span>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.08}>
              {yorumlar.slice(0, 6).map((y, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 h-full border border-[#E8F0FE] card-lift relative overflow-hidden">
                    <div className="absolute top-3 right-4 text-5xl font-serif text-[#1A73E8]/10 leading-none">&ldquo;</div>
                    <div className="flex items-center gap-2 mb-3 relative">
                      <RatingStars rating={y.rating} size="sm" />
                      {y.verified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 font-medium px-2 py-0.5 rounded-full ml-auto">Onaylı Alıcı</span>
                      )}
                    </div>
                    <p className="text-sm text-[#5A6B7B] leading-relaxed relative">&ldquo;{y.text}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F0F6FF]">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#4FC3F7] rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{y.name[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D2137] truncate">{y.name}</p>
                        <p className="text-[11px] text-[#8B9DAF] truncate">{y.city} · {y.product}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </PageContainer>
        </section>

        {/* BLOG */}
        <section className="page-section bg-[#F7FAFF]">
          <PageContainer>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Blog & Bilgi Merkezi</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0D2137] mt-2">Su Arıtma Rehberi</h2>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[#5A6B7B] hover:text-[#1A73E8] transition-colors">
                Tüm Yazılar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6" staggerDelay={0.1}>
              {blogYazilar.map((b, i) => (
                <StaggerItem key={i}>
                  <Link to="/blog" className="group block bg-white rounded-2xl overflow-hidden border border-[#E8F0FE] card-lift h-full">
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
          </PageContainer>
        </section>

        {/* SSS */}
        <section className="page-section bg-white">
          <PageContainer className="max-w-[720px]">
            <SectionHeading eyebrow="SSS" title="Merak Ettikleriniz" />
            <div className="space-y-3">
              {faqAnasayfa.map((f, i) => (
                <ScrollReveal key={i} y={10} delay={i * 0.05}>
                  <div className={cn('rounded-2xl overflow-hidden transition-all', openFaq === String(i) ? 'shadow-md ring-1 ring-[#1A73E8]/15 bg-white' : 'border border-[#E8F0FE] bg-[#FAFCFF]')}>
                    <button onClick={() => setOpenFaq(openFaq === String(i) ? null : String(i))} className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left min-w-0">
                      <span className={cn('text-sm font-semibold', openFaq === String(i) ? 'text-[#1A73E8]' : 'text-[#0D2137]')}>{f.q}</span>
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all', openFaq === String(i) ? 'bg-[#1A73E8] text-white rotate-180' : 'bg-[#F0F6FF] text-[#8B9DAF]')}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    <motion.div initial={false} animate={{ height: openFaq === String(i) ? 'auto' : 0, opacity: openFaq === String(i) ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-4 sm:px-5 pb-4 border-t border-[#F0F6FF]">
                        <p className="text-sm text-[#5A6B7B] leading-relaxed pt-4">{f.a}</p>
                      </div>
                    </motion.div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* FINAL CTA */}
        <section className="relative bg-gradient-to-br from-[#0B1D3A] via-[#0D2137] to-[#0a1628] overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
          <div className="absolute top-10 right-10 w-80 h-80 bg-[#1A73E8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#00D4C8]/15 rounded-full blur-3xl pointer-events-none" />
          <PageContainer className="text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight text-balance">
                Eviniz için Doğru Su Arıtma Sistemini Birlikte Seçelim
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-4 max-w-lg mx-auto">
                Uzman ekibimiz size en uygun çözümü sunmak için hazır. Ücretsiz keşif randevusu alın veya ürünlerimizi inceleyin.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                <Link to="/urunler" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#4FC3F7] text-white px-7 sm:px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#1A73E8]/30 transition-all">
                  Ürünleri İncele <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/servis-randevusu" className="inline-flex items-center gap-2 border-2 border-white/25 text-white px-7 sm:px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all">
                  Servis Randevusu Al
                </Link>
              </div>
            </motion.div>
          </PageContainer>
        </section>
      </PageLayout>
    </>
  );
}
