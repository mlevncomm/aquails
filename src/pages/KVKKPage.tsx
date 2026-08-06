import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ScrollText, UserCheck, Building2, Database, Scale } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


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
              <span className="text-white/80">KVKK Aydınlatma Metni</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">KVKK Aydınlatma Metni</h1>
            </div>
            <p className="text-white/70 text-sm">6698 sayılı KVKK kapsamında hazırlanmıştır.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        <ScrollReveal>
          <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden shadow-sm">
            {sections.map((section, i) => (
              <div key={i} className={`p-6 md:p-8 ${i !== sections.length - 1 ? 'border-b border-aq-border/60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-aq-sky rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-aq-blue" />
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
