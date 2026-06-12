import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FileSignature, Users, Box, Undo2, Truck, CreditCard } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


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
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D2137] via-[#1A3A5C] to-[#1A73E8] py-14 md:py-18">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-24 h-24 border border-white rounded-full" />
        </div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-white/80">Mesafeli Satış Sözleşmesi</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FileSignature className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Mesafeli Satış Sözleşmesi</h1>
            </div>
            <p className="text-white/70 text-sm">Tüm siparişlerimiz için geçerli yasal sözleşme.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        <ScrollReveal>
          <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden shadow-sm">
            {sections.map((section, i) => (
              <div key={i} className={`p-6 md:p-8 ${i !== sections.length - 1 ? 'border-b border-[#F0F6FF]' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#0D2137] mb-2">{section.title}</h2>
                    <p className="text-sm text-[#5A6B7B] leading-relaxed">{section.content}</p>
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
