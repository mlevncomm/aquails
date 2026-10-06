import { FileText, Users, ShieldCheck, KeyRound, Ban, Scale } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';

const sections = [
  {
    icon: Users,
    title: '1. Taraflar',
    content:
      'Bu üyelik sözleşmesi, Aquails Su Arıtma Sistemleri A.Ş. (“Aquails”) ile www.aquails.com üzerinden üyelik hesabı oluşturan kişi (“Üye”) arasında akdedilmiştir.',
  },
  {
    icon: FileText,
    title: '2. Üyelik Hesabı',
    content:
      'Üye, kayıt sırasında verdiği bilgilerin doğru ve güncel olduğunu kabul eder. Hesap güvenliğinden (şifre dahil) Üye sorumludur. Aquails, yanlış veya yanıltıcı bilgiyle açılan hesapları askıya alma hakkını saklı tutar.',
  },
  {
    icon: ShieldCheck,
    title: '3. Hizmetlerin Kullanımı',
    content:
      'Üyelik; sipariş takibi, adres yönetimi, favoriler, filtre takibi ve benzeri müşteri hizmetlerine erişim sağlar. Site üzerinden yapılan alışverişler ayrıca Mesafeli Satış Sözleşmesi hükümlerine tabidir.',
  },
  {
    icon: KeyRound,
    title: '4. Kişisel Veriler',
    content:
      'Üyelik sırasında ve kullanım süresince işlenen kişisel veriler, KVKK Aydınlatma Metni ve Gizlilik Politikası kapsamında korunur ve işlenir.',
  },
  {
    icon: Ban,
    title: '5. Yasaklı Kullanımlar',
    content:
      'Üye; siteyi hukuka aykırı, yanıltıcı, zararlı veya üçüncü kişilerin haklarını ihlal edecek şekilde kullanamaz. Bu tür kullanımlarda Aquails üyeliği sonlandırabilir.',
  },
  {
    icon: Scale,
    title: '6. Sözleşmenin Süresi ve Fesih',
    content:
      'Üyelik, Üye hesabını silene veya Aquails üyeliği sonlandırana kadar devam eder. Üye, hesabımdan profil ayarları üzerinden veya destek kanallarından hesap kapatma talebinde bulunabilir.',
  },
];

export default function MembershipTermsPage() {
  return (
    <>
      <SEO title="Üyelik Sözleşmesi | Aquails" noindex />
      <PageLayout variant="gradient">
        <PageHero
        size="sm"
        title="Üyelik Sözleşmesi"
        description="Aquails hesabı oluştururken geçerli üyelik koşulları."
        breadcrumbs={[{ label: 'Üyelik Sözleşmesi' }]}
        image="/images/lifestyle/story-lake.jpg"
      />

        <div className="relative z-10 mx-auto -mt-6 max-w-[800px] px-4 py-8">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
              {sections.map((section, i) => (
                <div
                  key={section.title}
                  className={`p-6 md:p-8 ${i !== sections.length - 1 ? 'border-b border-aq-border/60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-aq-cloud">
                      <section.icon className="h-5 w-5 text-aq-ink" />
                    </div>
                    <div>
                      <h2 className="mb-2 text-base font-semibold text-aq-text">{section.title}</h2>
                      <p className="text-sm leading-relaxed text-aq-muted">{section.content}</p>
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
