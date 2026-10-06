import { Check, X, Clock, Package, Sparkles, ShieldCheck } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';


const conditions = [
  { ok: true, text: 'Ürün kullanılmamış ve orijinal ambalajında olmalı' },
  { ok: true, text: '14 gün içinde iade talebi oluşturulmalı' },
  { ok: true, text: 'Fatura veya irsaliye ibraz edilmeli' },
  { ok: false, text: 'Kullanılmış veya hasar görmüş ürünler' },
  { ok: false, text: 'Orijinal ambalajı açılmış özel üretim ürünler' },
  { ok: false, text: 'Kurulumu yapılmış cihazlar (arıza hariç)' },
];

export default function ReturnPolicyPage() {
  return (
    <>
      <SEO title="Aquails" noindex />
    <PageLayout variant="gradient">
      <PageHero
        size="sm"
        title="İade Politikası"
        description="14 gün koşulsuz iade garantisi."
        breadcrumbs={[{ label: 'İade Politikası' }]}
        image="/images/lifestyle/story-lake.jpg"
      />

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        {/* Conditions */}
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-soft">
            <h2 className="text-base font-semibold text-aq-text mb-5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-aq-ink" />
              İade Koşulları
            </h2>
            <div className="space-y-3">
              {conditions.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aq-ice/50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${c.ok ? 'bg-emerald-100 text-aq-blue' : 'bg-red-100 text-red-500'}`}>
                    {c.ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm text-aq-muted pt-0.5">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Highlights */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: '14 Gün', desc: 'Cayma hakkı süresi' },
              { icon: Package, title: 'Ücretsiz İade', desc: 'Kargo ücreti tarafımızdan karşılanır' },
              { icon: Sparkles, title: 'Hızlı İade', desc: '3-5 iş günü içinde geri ödeme' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-5 text-center transition-all shadow-soft">
                <div className="w-12 h-12 bg-aq-cloud rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-aq-ink" />
                </div>
                <h3 className="text-sm font-semibold text-aq-text">{item.title}</h3>
                <p className="text-xs text-aq-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
