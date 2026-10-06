import { Shield, Lock, FileText, Server, UserCheck } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';


const sections = [
  { icon: UserCheck, title: '1. Veri Sorumlusu', content: 'Aquails Su Arıtma Sistemleri A.Ş. olarak kişisel verilerinizin güvenliği en önemli önceliğimizdir. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve koruduğumuzu açıklar.' },
  { icon: FileText, title: '2. Toplanan Veriler', content: 'Ad, soyad, e-posta adresi, telefon numarası, teslimat adresi ve ödeme bilgileri gibi veriler sadece hizmet sunumu amacıyla toplanır.' },
  { icon: Server, title: '3. Veri Kullanımı', content: 'Kişisel verileriniz; sipariş işleme, müşteri desteği, kampanya bildirimleri (izin verildiğinde) ve yasal yükümlülükler için kullanılır.' },
  { icon: Lock, title: '4. Veri Güvenliği', content: 'Verileriniz 256-bit SSL şifreleme ile korunur. Üçüncü taraflarla paylaşılmaz (yasal zorunluluk hariç).' },
  { icon: Shield, title: '5. Haklarınız', content: 'KVKK kapsamında verilerinize erişme, düzeltme, silme ve işlenmesine itiraz etme hakkına sahipsiniz.' },
];

export default function PrivacyPage() {
  return (
    <>
      <SEO title="Aquails" noindex />
    <PageLayout variant="gradient">
      <PageHero
        size="sm"
        title="Gizlilik Politikası"
        description="Son güncelleme: 1 Haziran 2026"
        breadcrumbs={[{ label: 'Gizlilik Politikası' }]}
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
