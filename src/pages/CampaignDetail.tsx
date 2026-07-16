import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight, Percent, Truck, Gift, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';


const campaigns: Record<string, { title: string; desc: string; code: string; endDate: string; discount: string }> = {
  'yaz-indirimi': { title: 'Yaz İndirimi %20', desc: 'Tüm su arıtma cihazlarında geçerli %20 indirim fırsatı. Bu kampanya kapsamında PurePro, Compact ve Business serisi tüm cihazlarımızda geçerlidir.', code: 'YAZ20', endDate: '30 Haziran 2026', discount: '%20' },
  'filtre-kampanya': { title: 'Filtre Setinde %15', desc: 'Tüm filtre setleri ve yedek parçalarda %15 indirim. 4\'lü, 5\'li ve premium filtre setlerinde geçerlidir.', code: 'FILTRE15', endDate: '15 Temmuz 2026', discount: '%15' },
  'ucretsiz-kargo': { title: 'Ücretsiz Kargo', desc: '1500₺ ve üzeri tüm siparişlerde ücretsiz kargo avantajı.', code: 'KARGO', endDate: 'Süresiz', discount: '0₺' },
  'bedava-kurulum': { title: 'Bedava Kurulum', desc: 'PurePro serisi cihaz alımlarında ücretsiz profesyonel kurulum.', code: 'KURULUM', endDate: '31 Ağustos 2026', discount: 'Ücretsiz' },
};

export default function CampaignDetail() {
  const { slug } = useParams<{ slug: string }>();
  const c = campaigns[slug || ''] || campaigns['yaz-indirimi'];
  const addToast = useToastStore(s => s.add);

  const copyCode = () => {
    navigator.clipboard?.writeText(c.code);
    addToast(`${c.code} kopyalandı!`, 'success');
  };

  return (
    <>
      <SEO
        title={`${c.title} | Aquails Kampanyalar`}
        description={c.desc}
        canonical={`/kampanya/${slug}`}
      />
    <PageLayout variant="blue">
      {/* Breadcrumb */}
      <div className="max-w-[800px] mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 text-[13px] text-aq-muted">
          <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/kampanyalar" className="hover:text-aq-blue">Kampanyalar</Link>
          <span>/</span>
          <span className="text-aq-muted">{c.title}</span>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-6">
        {/* Campaign Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep rounded-2xl p-8 text-white mb-6 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{c.discount} İndirim</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{c.title}</h1>
            <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed max-w-lg">{c.desc}</p>
            <div className="flex items-center gap-1.5 text-sm text-white/70 mb-6">
              <Clock className="w-4 h-4" /> Son Geçerlilik: <strong className="text-white">{c.endDate}</strong>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyCode}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all backdrop-blur-sm"
              >
                <Gift className="w-4 h-4" />
                {c.code} - Kopyala
              </button>
              <Link
                to="/urunler"
                className="flex items-center gap-2 bg-white text-aq-blue text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/90 hover:shadow-sm transition-all"
              >
                Alışverişe Başla <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Campaign Details */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Percent, title: 'İndirim', desc: c.discount },
              { icon: Clock, title: 'Son Tarih', desc: c.endDate },
              { icon: Truck, title: 'Kargo', desc: 'Ücretsiz' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-aq-border/60 rounded-xl p-5 text-center hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-aq-sky rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-aq-blue" />
                </div>
                <p className="text-xs text-aq-muted mb-1">{item.title}</p>
                <p className="text-sm font-semibold text-aq-text">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* How to Use */}
        <ScrollReveal delay={0.3}>
          <div className="bg-white border border-aq-border/60 rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-semibold text-aq-text mb-4">Kampanya Nasıl Kullanılır?</h3>
            <div className="space-y-4">
              {[
                'Ürünler sayfasından dilediğiniz ürünleri sepete ekleyin.',
                'Sepet sayfasında "Kupon Kodu" alanına kampanya kodunu girin.',
                `İndirim otomatik olarak uygulanacaktır.`,
                'Ödeme adımına geçerek alışverişinizi tamamlayın.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-aq-sky rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-aq-blue">{i + 1}</span>
                  </div>
                  <p className="text-sm text-aq-muted pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-6 text-center">
            <Link
              to="/urunler"
              className="inline-flex items-center gap-2 bg-aq-blue text-white px-8 py-3 rounded-xl font-semibold hover:bg-aq-deep hover:text-white transition-all"
            >
              Tüm Ürünleri Gör <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
