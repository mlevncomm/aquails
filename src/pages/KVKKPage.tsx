import { ScrollText, UserCheck, Building2, Database } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';


const sections = [
  { icon: ScrollText, title: '1. Amaç', content: '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek amacıyla bu aydınlatma metni hazırlanmıştır.' },
  { icon: Building2, title: '2. Veri Sorumlusu', content: 'Veri sorumlusu: Aquails Su Arıtma Sistemleri A.Ş. | Adres: Pendik, İstanbul | E-posta: kvkk@aquails.com' },
  { icon: Database, title: '3. İşlenen Kişisel Veriler', content: 'Kimlik bilgileri, iletişim bilgileri, adres bilgileri, ödeme bilgileri ve sipariş geçmişi KVKK kapsamında işlenmektedir.' },
  { icon: UserCheck, title: '4. Haklarınız', content: 'KVKK madde 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, düzeltme ve silme hakkına sahipsiniz.' },
];

export default function KVKKPage() {
  return (
    <>
      <SEO title="Aquails" noindex />
    <PageLayout variant="gradient">
      <PageHero
        size="sm"
        title="KVKK Aydınlatma Metni"
        description="6698 sayılı KVKK kapsamında hazırlanmıştır."
        breadcrumbs={[{ label: 'KVKK Aydınlatma Metni' }]}
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
