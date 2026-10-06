import { Truck, Wrench, Clock, MapPin, Package, Headphones, Sparkles } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';


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
      <PageHero
        size="sm"
        title="Kargo ve Kurulum"
        description="Hızlı teslimat ve ücretsiz profesyonel kurulum."
        breadcrumbs={[{ label: 'Kargo ve Kurulum' }]}
        image="/images/lifestyle/story-lake.jpg"
      />

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        <div className="space-y-5">
          {/* Kargo */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-aq-cloud rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-aq-ink" />
                </div>
                <h2 className="text-lg font-semibold text-aq-text">Kargo Bilgileri</h2>
              </div>
              <div className="space-y-4">
                {kargoItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aq-ice/50">
                    <div className="w-8 h-8 bg-aq-cloud rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-aq-ink" />
                    </div>
                    <p className="text-sm text-aq-muted pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Kurulum */}
          <ScrollReveal delay={0.15}>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-aq-cloud rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-aq-ink" />
                </div>
                <h2 className="text-lg font-semibold text-aq-text">Kurulum Hizmeti</h2>
              </div>
              <div className="space-y-4">
                {kurulumItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aq-ice/50">
                    <div className="w-8 h-8 bg-aq-cloud rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-aq-ink" />
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
