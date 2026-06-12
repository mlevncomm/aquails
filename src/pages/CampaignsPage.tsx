import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Clock, Copy, Check, Package, Truck, Wrench } from 'lucide-react';
import { useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';


const campaigns = [
  { id: 'yaz20', slug: 'yaz-indirimi', title: 'Direkt Akış Cihazlarda %20 İndirim', desc: 'Tankless su arıtma cihazlarında geçerli %20 indirim fırsatı. Sınırlı süre için geçerlidir.', endDate: '30 Haziran 2026', discount: '%20', code: 'DIREKT20', bg: 'from-[#1A73E8] to-[#4A90E2]', image: '/images/campaign-1.jpg' },
  { id: 'filtre15', slug: 'filtre-kampanya', title: 'Filtre Setlerinde 2. Ürüne %50', desc: 'Tüm filtre setleri ve yedek parçalarda ikinci ürüne özel %50 indirim.', endDate: '15 Temmuz 2026', discount: '%50', code: 'FILTRE50', bg: 'from-[#0D2137] to-[#1A3A5C]', image: '/images/campaign-3.jpg' },
  { id: 'kargo0', slug: 'ucretsiz-kargo', title: 'Ücretsiz Kurulum Fırsatı', desc: 'Tüm su arıtma cihazlarında profesyonel kurulum bedava.', endDate: '31 Ağustos 2026', discount: 'Ücretsiz', code: 'KURULUM0', bg: 'from-[#00BFA5] to-[#00D9B5]', image: '/images/campaign-2.jpg' },
  { id: 'abonelik', slug: 'abonelik-kampanya', title: 'Filtre Aboneliğinde %15 İndirim', desc: 'Yıllık filtre aboneliği alanlara ekstra %15 indirim avantajı.', endDate: '30 Eylül 2026', discount: '%15', code: 'ABONE15', bg: 'from-[#7C4DFF] to-[#B388FF]', image: '/images/filter-subscription.jpg' },
  { id: 'sebil', slug: 'sebil-kampanya', title: 'Sebil Alana Filtre Seti Hediye', desc: 'Tüm sebil modellerinde filtre değişim seti hediye kampanyası.', endDate: '15 Haziran 2026', discount: 'Hediye', code: 'SEBILHED', bg: 'from-[#FF6D00] to-[#FFAB40]', image: '/images/products/sebiller.jpg' },
  { id: 'yeni', slug: 'yeni-musteri', title: 'Yeni Müşteriye Özel %10', desc: 'İlk alışverişinize özel %10 hoş geldin indirimi.', endDate: 'Süresiz', discount: '%10', code: 'HOSGELDIN', bg: 'from-[#2962FF] to-[#2979FF]', image: '/images/hero-product.jpg' },
];

const kampanyaUrunleri = products.filter(p => (p.discountPercent || 0) > 0).slice(0, 4);

export default function CampaignsPage() {
  const addToast = useToastStore(s => s.add);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    addToast(`${code} kuponu kopyalandı!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <SEO
        title="Aquails Kampanyaları | Su Arıtma Fırsatları"
        description="Aquails kampanyaları ve indirim fırsatları. Su arıtma cihazlarında özel fiyatlar, ücretsiz kurulum ve kargo avantajları."
        canonical="/kampanyalar"
      />
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0D2137] via-[#1A3A5C] to-[#0D2137] py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#1A73E8] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-[#4FC3F7] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center gap-2 text-[13px] text-white/50 mb-3">
            <Link to="/" className="hover:text-white">Ana Sayfa</Link><span>/</span><span className="text-white/70">Kampanyalar</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Kampanyalar ve Fırsatlar</h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg">Güncel indirimleri, kupon kodlarını ve özel fırsatları kaçırmayın.</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { icon: Package, label: '60+ Ürün' },
              { icon: Truck, label: 'Ücretsiz Kargo' },
              { icon: Wrench, label: 'Ücretsiz Kurulum' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-white/70 text-xs"><b.icon className="w-4 h-4" />{b.label}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {campaigns.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="group relative rounded-2xl overflow-hidden h-[280px]">
                <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{c.discount}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white leading-tight mb-1">{c.title}</h3>
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">{c.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-3"><Clock className="w-3 h-3" />Son Tarih: {c.endDate}</div>
                  <div className="flex gap-2">
                    <button onClick={() => copyCode(c.code)} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-full transition-all">
                      {copiedCode === c.code ? <><Check className="w-3 h-3" />Kopyalandı</> : <><Copy className="w-3 h-3" />{c.code}</>}
                    </button>
                    <Link to="/urunler" className="flex items-center gap-1 bg-white text-[#0D2137] text-xs font-semibold px-3 py-2 rounded-full hover:bg-white/90 transition-all">Ürünler <ArrowRight className="w-3 h-3" /></Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Kampanyalı Ürünler */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-5 h-5 text-[#1A73E8]" />
            <h2 className="text-xl font-bold text-[#0D2137]">Kampanyalı Ürünler</h2>
          </div>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
          {kampanyaUrunleri.map(p => (
            <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>
          ))}
        </StaggerContainer>

        {/* Paket Fırsatları */}
        <ScrollReveal className="mt-12">
          <div className="bg-gradient-to-r from-[#F0F6FF] to-[#F8FBFF] border border-[#E8F0FE] rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Paket Fırsatları</span>
                <h3 className="text-xl font-bold text-[#0D2137] mt-2">Cihaz + Filtre + Kurulum Paketi</h3>
                <p className="text-sm text-[#5A6B7B] mt-3">Su arıtma cihazı, 1 yıllık filtre seti ve profesyonel kurulumu bir arada alın, %25'e varan tasarruf edin.</p>
                <Link to="/urunler" className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1557B0] transition-all mt-5">Paketleri İncele <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '%25', label: 'Tasarruf' },
                  { value: '12 Ay', label: 'Filtre Dahil' },
                  { value: '0 ₺', label: 'Kurulum' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 text-center border border-[#E8F0FE]">
                    <p className="text-xl font-bold text-[#1A73E8]">{s.value}</p>
                    <p className="text-[11px] text-[#8B9DAF] mt-1">{s.label}</p>
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
