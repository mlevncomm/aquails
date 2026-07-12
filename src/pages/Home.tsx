import { Link } from 'react-router';
import {
  Check, ArrowRight,
  Droplet, Cpu, Zap, Wrench, RefreshCw, Sparkles,
  Search, Calendar, ClipboardCheck, Gauge, FlaskConical, BellRing,
  Filter, ShieldCheck,
} from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { SEO } from '@/components/SEO';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/SchemaOrg';
import { HomeHero } from '@/components/home/HomeHero';
import { SolutionCard } from '@/components/home/SolutionCard';
import { HomeStats } from '@/components/home/HomeStats';
import { HomeFaq } from '@/components/home/HomeFaq';
import { products as staticProducts } from '@/data';
import { useCatalog } from '@/hooks/useCatalog';

const solutions = [
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
  {
    icon: Cpu,
    title: 'Akıllı Filtre Teknolojisi',
    desc: 'Sensör tabanlı gerçek zamanlı su kalitesi izleme ve otomatik filtre uyarıları.',
    href: '/urunler',
  },
  {
    icon: Zap,
    title: 'Sessiz ve Verimli Sistem',
    desc: '35 dB altında çalışma sesi ve enerji verimli motor teknolojisi.',
    href: '/urunler',
  },
  {
    icon: ShieldCheck,
    title: '5 Yıl Garanti',
    desc: 'Ana cihaz garantisi, orijinal yedek parça ve ömür boyu teknik destek.',
    href: '/iletisim',
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

const blueBlockFeatures = [
  { icon: Cpu, title: 'Akıllı Filtre Teknolojisi', desc: 'Sensör tabanlı gerçek zamanlı su kalitesi izleme.' },
  { icon: Droplet, title: 'Sağlıklı Mineral Dengesi', desc: 'Ters ozmoz sonrası mineralizasyon ile sağlıklı su.' },
  { icon: Zap, title: 'Sessiz ve Verimli', desc: '35 dB altında çalışma, düşük enerji tüketimi.' },
  { icon: Wrench, title: 'Kurulum Desteği', desc: '500+ servis noktası, aynı gün montaj imkanı.' },
];

const nasilCalisir = [
  { step: '01', title: 'İhtiyacını Belirle', desc: 'Sihirbaz ile evinize en uygun cihazı seçin.', icon: Search },
  { step: '02', title: 'Sipariş Ver', desc: 'Güvenli ödeme veya ücretsiz keşif randevusu alın.', icon: Calendar },
  { step: '03', title: 'Kurulum Yapılsın', desc: 'Uzman ekip aynı gün profesyonel montaj yapar.', icon: Wrench },
  { step: '04', title: 'Filtreyi Takip Et', desc: 'Aquails filtre değişimlerini sizin için hatırlatır.', icon: ClipboardCheck },
];

const impactStats = [
  { v: '10.000+', l: 'Mutlu Müşteri', sub: 'Türkiye geneli' },
  { v: '%99', l: 'Klor Azaltma', sub: 'Laboratuvar testli' },
  { v: '500+', l: 'Servis Noktası', sub: 'Aynı gün destek' },
  { v: '17+', l: 'Yıllık Deneyim', sub: 'Su teknolojisi' },
];

const faqAnasayfa = [
  { q: 'Su arıtma cihazı kurulumu ne kadar sürer?', a: 'Standart ev tipi kurulum ortalama 45-60 dakika sürer.' },
  { q: 'Filtre değişimi kaç ayda bir yapılır?', a: 'Sediment ve karbon filtreler 6-12 ay, RO membran 24-36 ayda değiştirilmelidir.' },
  { q: 'Garanti süresi nedir?', a: '5 yıl ana cihaz garantisi ve ömür boyu teknik destek sunuyoruz.' },
  { q: 'Kurulum ücretsiz mi?', a: 'Tüm Aquails cihazlarında profesyonel kurulum ücretsizdir.' },
];

export default function Home() {
  const { products } = useCatalog();
  const catalogProducts = products.length > 0 ? products : staticProducts;
  const featuredProducts = catalogProducts.filter((p) => p.rating >= 4.5).slice(0, 4);

  return (
    <>
      <SEO
        title="Aquails | Daha Temiz Su, Daha Akıllı Teknoloji"
        description="Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar."
        canonical="/"
        schema={{ ...getOrganizationSchema(), ...getWebsiteSchema() }}
      />

      <div className="min-h-screen overflow-x-hidden bg-white">
        {/* 1. Cinematic Hero */}
        <HomeHero />

        {/* 2. Akıllı Su Çözümleri */}
        <section className="cropsync-section bg-white">
          <PageContainer>
            <ScrollReveal className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] wavy-underline inline-block">
                Akıllı Su Çözümleri
              </h2>
              <p className="text-sm sm:text-base text-[#5A6B7B] mt-5 max-w-2xl mx-auto leading-relaxed">
                Sensör destekli teknoloji, orijinal filtreler ve profesyonel servis ağı ile
                eviniz ve iş yeriniz için güvenilir su deneyimi.
              </p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" staggerDelay={0.07}>
              {solutions.map((s) => (
                <StaggerItem key={s.title}>
                  <SolutionCard icon={s.icon} title={s.title} desc={s.desc} href={s.href} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </PageContainer>
        </section>

        {/* 3. Mini feature icons */}
        <section className="py-12 sm:py-16 bg-[#F7FAFF] border-y border-[#EEF2F8]">
          <PageContainer>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {miniFeatures.map((f) => (
                <ScrollReveal key={f.label} className="flex flex-col items-center gap-2.5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8F0FE] flex items-center justify-center shadow-sm">
                    <f.icon className="w-5 h-5 text-[#1A73E8]" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#0D2137]">{f.label}</span>
                </ScrollReveal>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* 4. Asymmetric image + text */}
        <section className="cropsync-section bg-white">
          <PageContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ScrollReveal>
                <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">Teknoloji</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] mt-2 leading-tight">
                  Modern Su Arıtma Sistemleri
                </h2>
                <p className="text-sm sm:text-base text-[#5A6B7B] mt-4 leading-relaxed">
                  Aquails, ev ve iş yerlerinde güvenilir, verimli ve akıllı su arıtma çözümleri sunar.
                  7 aşamalı filtre teknolojisi ile suyunuz her an temiz ve lezzetli kalır.
                </p>
                <ul className="mt-6 space-y-3">
                  {['7 aşamalı filtre teknolojisi', 'Akıllı filtre değişim uyarıları', 'Orijinal yedek parça garantisi', 'Ücretsiz profesyonel kurulum'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#5A6B7B]">
                      <span className="w-5 h-5 rounded-full bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#1A73E8]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/urunler"
                  className="inline-flex items-center gap-2 mt-8 bg-[#1A73E8] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1557B0] transition-all"
                >
                  Sistemleri İncele <ArrowRight className="w-4 h-4" />
                </Link>
              </ScrollReveal>

              <ScrollReveal x={20} delay={0.1}>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg">
                    <img src="/images/hero-product.jpg" alt="Aquails su arıtma cihazı" className="w-full aspect-[16/10] object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img src="/images/service-installation.jpg" alt="Profesyonel kurulum" className="w-full aspect-square object-cover" loading="lazy" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img src="/images/filter-subscription.jpg" alt="Filtre aboneliği" className="w-full aspect-square object-cover" loading="lazy" />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </PageContainer>
        </section>

        {/* 5. Blue full-width feature block */}
        <section className="cropsync-section bg-[#1A73E8] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <PageContainer className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  Akıllı Su Operasyonları İçin Tasarlandı
                </h2>
                <p className="text-white/75 mt-4 leading-relaxed text-sm sm:text-base">
                  17 yıllık deneyim, akıllı sensör teknolojisi ve Türkiye geneli servis ağı ile
                  ailenizin sağlığını ön planda tutuyoruz.
                </p>
                <ul className="mt-6 space-y-3">
                  {['Gerçek zamanlı su kalitesi takibi', 'Otomatik filtre değişim hatırlatması', 'Laboratuvar testli filtre performansı'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/85 text-sm">
                      <Check className="w-4 h-4 text-white/70 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <StaggerContainer className="grid grid-cols-2 gap-3 sm:gap-4" staggerDelay={0.08}>
                {blueBlockFeatures.map((f) => (
                  <StaggerItem key={f.title}>
                    <div className="bg-white rounded-2xl p-4 sm:p-5 h-full shadow-sm">
                      <f.icon className="w-6 h-6 text-[#1A73E8] mb-3" strokeWidth={1.75} />
                      <h3 className="text-sm font-semibold text-[#0D2137]">{f.title}</h3>
                      <p className="text-xs text-[#5A6B7B] mt-1.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </PageContainer>
        </section>

        {/* 6. Statistics */}
        <HomeStats stats={impactStats} />

        {/* 7. Featured products */}
        <section className="cropsync-section bg-[#F7FAFF]">
          <PageContainer>
            <ScrollReveal className="text-center mb-10 sm:mb-12">
              <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">Koleksiyon</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] mt-2">Öne Çıkan Ürünler</h2>
              <p className="text-sm text-[#5A6B7B] mt-3 max-w-lg mx-auto">
                En çok tercih edilen su arıtma cihazları ve filtre setleri.
              </p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.08}>
              {featuredProducts.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerContainer>
            <div className="text-center mt-10">
              <Link
                to="/urunler"
                className="inline-flex items-center gap-2 border-2 border-[#0D2137] text-[#0D2137] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#0D2137] hover:text-white transition-all"
              >
                Tüm Ürünler <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* 8. How it works */}
        <section className="cropsync-section bg-white">
          <PageContainer>
            <ScrollReveal className="text-center mb-10 sm:mb-14">
              <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">Süreç</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D2137] mt-2">Nasıl Çalışır?</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {nasilCalisir.map((s, i) => (
                <ScrollReveal key={s.step} delay={i * 0.08}>
                  <div className="relative cropsync-card p-6 text-center h-full">
                    <span className="text-[10px] font-bold text-[#1A73E8] tracking-wider">ADIM {s.step}</span>
                    <div className="w-14 h-14 bg-[#F0F6FF] rounded-2xl flex items-center justify-center mx-auto mt-3 mb-4">
                      <s.icon className="w-6 h-6 text-[#1A73E8]" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-semibold text-[#0D2137] text-sm">{s.title}</h3>
                    <p className="text-xs text-[#5A6B7B] mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* 9. Full-width image band */}
        <section className="relative h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
          <img
            src="/images/about-hero.jpg"
            alt="Aquails su arıtma teknolojisi"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#0D2137]/50" />
          <PageContainer className="relative h-full flex items-center">
            <ScrollReveal className="max-w-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                Her Damla Güvenle Arıtılmış
              </h2>
              <p className="text-white/75 mt-3 text-sm sm:text-base leading-relaxed">
                Laboratuvar testli filtre teknolojisi ile sağlıklı, lezzetli su.
              </p>
              <Link
                to="/urun-secim-sihirbazi"
                className="inline-flex items-center gap-2 mt-6 btn-pill-white text-sm"
              >
                Sihirbaz ile Seç <Sparkles className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </PageContainer>
        </section>

        {/* 10. FAQ */}
        <HomeFaq items={faqAnasayfa} />
      </div>
    </>
  );
}
