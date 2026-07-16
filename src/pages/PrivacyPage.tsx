import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Server, UserCheck } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


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
              <span className="text-white/80">Gizlilik Politikası</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Gizlilik Politikası</h1>
            </div>
            <p className="text-white/70 text-sm">Son güncelleme: 1 Haziran 2026</p>
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
