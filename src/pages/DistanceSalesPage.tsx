import { Users, Box, Undo2, Truck, CreditCard } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';


const sections = [
  { icon: Users, title: '1. Taraflar', content: 'Bu sözleşme, Aquails Su Arıtma Sistemleri A.Ş. (SATICI) ile www.aquails.com üzerinden alışveriş yapan müşteri (ALICI) arasında akdedilmiştir.' },
  { icon: Box, title: '2. Ürün Bilgisi', content: 'Sipariş edilen ürünlerin cinsi, miktarı, fiyatı ve özellikleri sipariş özetinde belirtilmektedir.' },
  { icon: Undo2, title: '3. Cayma Hakkı', content: 'ALICI, sözleşme konusu ürünün kendisine tesliminden itibaren 14 gün içinde cayma hakkını kullanabilir. Cayma hakkı kullanımında ürünün kullanılmamış ve orijinal ambalajında olması gerekir.' },
  { icon: Truck, title: '4. Teslimat', content: 'Ürünler, sipariş onayından sonra 3-5 iş günü içinde kargoya teslim edilir. Kurulum gerektiren ürünlerde ayrı randevu planlanır.' },
  { icon: CreditCard, title: '5. Ödeme', content: 'Kredi kartı, havale/EFT ve kapıda ödeme seçenekleri mevcuttur. Taksit imkanları ödeme sayfasında görüntülenir.' },
];

export default function DistanceSalesPage() {
  return (
    <>
      <SEO title="Aquails" noindex />
    <PageLayout variant="gradient">
      <PageHero
        size="sm"
        title="Mesafeli Satış Sözleşmesi"
        description="Tüm siparişlerimiz için geçerli yasal sözleşme."
        breadcrumbs={[{ label: 'Mesafeli Satış Sözleşmesi' }]}
        image="/images/lifestyle/story-lake.jpg"
      />

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        <ScrollReveal>
          <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
            {sections.map((section, i) => (
              <div key={i} className={`p-6 md:p-8 ${i !== sections.length - 1 ? 'border-b border-aq-border/60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-aq-cloud rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-aq-ink" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-aq-text mb-2">{section.title}</h2>
                    <p className="text-sm text-aq-muted leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
