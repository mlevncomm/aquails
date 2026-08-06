import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Truck, Wrench, Clock, MapPin, Package, Headphones, Sparkles } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


const kargoItems = [
  { icon: Package, text: '1500₺ ve üzeri siparişlerde ücretsiz kargo' },
  { icon: Clock, text: 'İstanbul içi 1-2 iş günü, diğer iller 3-5 iş günü' },
  { icon: Truck, text: 'Yurtiçi Kargo ile gönderim' },
  { icon: Headphones, text: 'Kargo takip numarası SMS ve e-posta ile gönderilir' },
];

const kurulumItems = [
  { icon: Wrench, text: 'PurePro ve Compact serisinde ücretsiz kurulum' },
  { icon: Sparkles, text: 'Profesyonel sertifikalı teknik ekibimiz kurulumu yapar' },
  { icon: MapPin, text: 'Kurulum sonrası su kalite testi yapılır' },
  { icon: Headphones, text: 'Kullanım eğitimi verilir' },
];

export default function ShippingPage() {
  return (
    <>
      <SEO title="Aquails" noindex />
    <PageLayout variant="gradient">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-24 h-24 border border-white rounded-full" />
        </div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-white/80">Kargo ve Kurulum</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Kargo ve Kurulum</h1>
            </div>
            <p className="text-white/70 text-sm">Hızlı teslimat ve ücretsiz profesyonel kurulum.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        <div className="space-y-5">
          {/* Kargo */}
          <ScrollReveal>
            <div className="bg-white border border-aq-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-aq-sky rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-aq-blue" />
                </div>
                <h2 className="text-lg font-semibold text-aq-text">Kargo Bilgileri</h2>
              </div>
              <div className="space-y-4">
                {kargoItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aq-ice/50">
                    <div className="w-8 h-8 bg-aq-sky rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-aq-blue" />
                    </div>
                    <p className="text-sm text-aq-muted pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Kurulum */}
          <ScrollReveal delay={0.15}>
            <div className="bg-white border border-aq-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-aq-sky rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-aq-blue" />
                </div>
                <h2 className="text-lg font-semibold text-aq-text">Kurulum Hizmeti</h2>
              </div>
              <div className="space-y-4">
                {kurulumItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aq-ice/50">
                    <div className="w-8 h-8 bg-aq-sky rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-aq-blue" />
                    </div>
                    <p className="text-sm text-aq-muted pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageLayout>
    </>
  );
}
