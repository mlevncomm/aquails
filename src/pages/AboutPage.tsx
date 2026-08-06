import { Link } from 'react-router';
import { Shield, Award, Users, Droplets, Clock, MapPin, Wrench, Leaf, Heart, Target, Sparkles, Zap, Phone, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


const stats = [
  { value: '10.000+', label: 'Mutlu Müşteri', icon: Users },
  { value: '15+', label: 'Yıllık Deneyim', icon: Clock },
  { value: '500+', label: 'Servis Noktası', icon: MapPin },
  { value: '5 Yıl', label: 'Garanti', icon: Shield },
  { value: '60+', label: 'Ürün Çeşidi', icon: Award },
  { value: '81', label: 'İl Kapsamı', icon: MapPin },
];

const degerler = [
  { icon: Droplets, title: 'Sağlıklı Su', desc: 'Her eve temiz, sağlıklı ve güvenilir su ulaştırmak için çalışıyoruz. Su kalitesi, yaşam kalitesidir.' },
  { icon: Award, title: 'Kalite Standartları', desc: 'ISO 9001 ve CE sertifikalı üretim tesislerimizde en yüksek kalite standartlarında ürünler sunuyoruz.' },
  { icon: Shield, title: 'Güven ve Şeffaflık', desc: 'Müşterilerimizin güveni bizim en büyük sermayemiz. Şeffaf fiyatlandırma, net garanti koşulları.' },
  { icon: Leaf, title: 'Sürdürülebilirlik', desc: 'Düşük su atıklı sistemler ve enerji verimli teknolojilerle çevreye duyarlı çözümler üretiyoruz.' },
  { icon: Heart, title: 'Müşteri Odaklılık', desc: '7/24 destek, aynı gün servis, ücretsiz kurulum ile müşteri memnuniyetini ön planda tutuyoruz.' },
  { icon: Target, title: 'İnovasyon', desc: 'Akıllı sensör teknolojisi, IoT entegrasyonu ve sürekli Ar-Ge ile sektörde öncü olmaya devam ediyoruz.' },
];

const milestones = [
  { year: '2011', title: 'Kuruluş', desc: 'İstanbul Pendik\'te su arıtma sektörüne giriş.' },
  { year: '2015', title: 'Büyüme', desc: 'Türkiye geneline servis ağı kurulumu, 5.000+ müşteri.' },
  { year: '2018', title: 'Teknoloji', desc: 'Akıllı su arıtma sistemleri ve IoT entegrasyonu.' },
  { year: '2021', title: 'Liderlik', desc: 'E-ticaret platformu, 50.000+ mutlu müşteri, 500+ servis noktası.' },
  { year: '2024', title: 'Aquails', desc: 'Yeni nesil Aquails markası ile premium su arıtma deneyimi.' },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Hakkımızda | Aquails"
        description="Aquails, 2008'den beri su arıtma teknolojilerinde güvenilir çözüm ortağınız. Temiz su, sağlıklı gelecek misyonuyla çalışıyoruz."
        canonical="/hakkimizda"
      />
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="aspect-[21/9] md:aspect-[3/1] relative">
          <img src="/images/about-hero.jpg" alt="Aquails" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-aq-deep/90 via-aq-deep/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="page-container w-full">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 text-[13px] text-white/50 mb-3">
                  <Link to="/" className="hover:text-white">Ana Sayfa</Link><span>/</span><span className="text-white/70">Hakkımızda</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">Aquails Hikayesi</h1>
                <p className="text-sm md:text-base text-white/70 mt-3 leading-relaxed">2011\'den bu yana Türkiye\'nin su arıtma teknolojileri alanında güvenilir markası.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-12">
        {/* Story */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <span className="text-xs font-semibold text-aq-blue tracking-[0.15em] uppercase">Marka Hikayemiz</span>
              <h2 className="text-2xl md:text-3xl font-bold text-aq-text mt-2 leading-tight">Daha Temiz Su İçin 15 Yıllık Yolculuk</h2>
              <p className="text-sm sm:text-[15px] text-aq-muted mt-4 leading-relaxed">Aquails, 2011 yılında İstanbul\'da kurulan ve su arıtma sektöründe yenilikçi çözümler sunan bir teknoloji markasıdır. Misyonumuz, her haneye ve işletmeye en yüksek kalitede arıtılmış su ulaştırmaktır.</p>
              <p className="text-sm sm:text-[15px] text-aq-muted mt-3 leading-relaxed">Ters ozmoz, UV sterilizasyon, mineral enjeksiyonu ve akıllı sensör teknolojilerini bir araya getirerek, kullanıcılarımıza sadece temiz su değil, aynı zamanda sağlıklı bir yaşam sunuyoruz.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/urunler" className="inline-flex items-center gap-2 bg-aq-blue text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-aq-deep hover:text-white transition-all">Ürünleri İncele <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/iletisim" className="inline-flex items-center gap-2 border border-aq-border/60 text-aq-muted px-6 py-3 rounded-xl font-semibold text-sm hover:border-aq-blue hover:text-aq-blue transition-all">Bize Ulaşın</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-aq-sky rounded-2xl p-5 text-center"><Sparkles className="w-8 h-8 text-aq-blue mx-auto mb-2" /><p className="text-2xl font-bold text-aq-text">15+</p><p className="text-xs text-aq-muted">Yıllık Deneyim</p></div>
              <div className="bg-aq-sky rounded-2xl p-5 text-center"><Zap className="w-8 h-8 text-aq-blue mx-auto mb-2" /><p className="text-2xl font-bold text-aq-text">%99</p><p className="text-xs text-aq-muted">Arıtma Oranı</p></div>
              <div className="bg-aq-sky rounded-2xl p-5 text-center"><Users className="w-8 h-8 text-aq-blue mx-auto mb-2" /><p className="text-2xl font-bold text-aq-text">10K+</p><p className="text-xs text-aq-muted">Mutlu Müşteri</p></div>
              <div className="bg-aq-sky rounded-2xl p-5 text-center"><Wrench className="w-8 h-8 text-aq-blue mx-auto mb-2" /><p className="text-2xl font-bold text-aq-text">500+</p><p className="text-xs text-aq-muted">Servis Noktası</p></div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16" staggerDelay={0.06}>
          {stats.map(s => (
            <StaggerItem key={s.label}>
              <div className="bg-white border border-aq-border/60 rounded-2xl p-5 text-center transition-all">
                <s.icon className="w-6 h-6 text-aq-blue mx-auto mb-2" />
                <p className="text-xl font-semibold text-aq-text">{s.value}</p>
                <p className="text-xs text-aq-muted mt-1">{s.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Milestones */}
        <ScrollReveal className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-aq-blue tracking-[0.15em] uppercase">Yolculuğumuz</span>
            <h2 className="text-2xl md:text-3xl font-bold text-aq-text mt-2">Önemli Dönüm Noktaları</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-aq-ice -translate-y-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {milestones.map((m) => (
                <div key={m.year} className="text-center relative">
                  <div className="w-12 h-12 bg-aq-aqua rounded-full flex items-center justify-center mx-auto mb-3 relative z-10">
                    <span className="text-sm font-semibold text-aq-text">{m.year.slice(2)}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-aq-text">{m.title}</h4>
                  <p className="text-xs text-aq-muted mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-aq-blue tracking-[0.15em] uppercase">Değerlerimiz</span>
            <h2 className="text-2xl md:text-3xl font-bold text-aq-text mt-2">Bizi Biz Yapan Değerler</h2>
          </div>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
          {degerler.map(v => (
            <StaggerItem key={v.title}>
              <div className="bg-white border border-aq-border/60 rounded-2xl p-6 hover:border-aq-blue/20 transition-all h-full">
                <div className="w-11 h-11 bg-aq-sky rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-aq-blue" />
                </div>
                <h3 className="text-base font-semibold text-aq-text">{v.title}</h3>
                <p className="text-sm text-aq-muted mt-2 leading-relaxed">{v.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Service Network */}
        <ScrollReveal className="mt-16">
          <div className="bg-gradient-to-r from-aq-sky to-aq-ice border border-aq-border/60 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-aq-text mb-2">Türkiye Geneli Servis Ağı</h3>
                <p className="text-sm text-aq-muted leading-relaxed">81 ilde yetkili servis noktalarımızla hızlı kurulum, bakım ve onarım hizmeti sunuyoruz. Servis talebiniz için hemen bize ulaşın.</p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <Link to="/servis-randevusu" className="inline-flex items-center gap-2 bg-aq-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all">Servis Talebi <ArrowRight className="w-4 h-4" /></Link>
                  <a href="tel:08501234567" className="inline-flex items-center gap-2 border border-aq-border/60 text-aq-muted px-5 py-2.5 rounded-full text-sm font-semibold hover:border-aq-blue hover:text-aq-blue transition-all"><Phone className="w-4 h-4" />0850 123 45 67</a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '81', label: 'İl Kapsamı' },
                  { value: '500+', label: 'Servis Noktası' },
                  { value: '2 Saat', label: 'Ort. Yanıt Süresi' },
                  { value: '7/24', label: 'Destek Hattı' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 text-center border border-aq-border/60">
                    <p className="text-lg font-semibold text-aq-blue">{s.value}</p>
                    <p className="text-[11px] text-aq-muted mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
